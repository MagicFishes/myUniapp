<template>
	<view class="page">
		<customNavBar :showBackButton="true" :autoBack="true" title="搜索"></customNavBar>

		<view class="page-content" :style="{ paddingTop: `${utils.totalSafeAreaHeight}px` }">
			<!-- 搜索栏 -->
			<view class="search-header">
				<view class="search-input-wrapper">
					<uni-icons type="search" size="20" color="#999"></uni-icons>
					<input class="search-input" v-model="searchKeyword" placeholder="关键词/品牌/酒店名"
						@input="handleInput" @confirm="handleSearch" />
					<!-- <view class="search-button" @click="handleSearch">搜索</view> -->
				</view>
				<!-- 亚洲等区域 -->
				<!-- <view v-if="!searchKeyword" class="region-list">
					<view class="region-item" v-for="item in regionList" :key="item.id"
						:class="{ active: selectedRegionId === item.id }" @click="handleRegionClick(item.id)">
						<text class="region-item-text">{{ item.name }}</text>
						<view v-if="selectedRegionId === item.id" class="region-indicator"></view>
					</view>
				</view> -->

			</view>
			<template v-if="!searchKeyword">
				<!-- 当前城市 -->
				<!-- <view class="current-city-card">
					<view class="city-icon"></view>
					<text class="city-text">当前城市: {{ currentCity }}</text>
				</view> -->
				<!-- 历史记录 -->
				<view class="history-record-card" v-if="searchHistory.length > 0">
					<view class="history-header">
						<view class="history-title-wrapper">
							<view class="history-icon">🛍️</view>
							<text class="history-title">历史记录</text>
						</view>
						<view class="history-delete" @click="handleClearHistory">
							<text class="delete-icon">🗑️</text>
						</view>
					</view>
					<view class="history-tags">
						<view class="history-tag" v-for="(item, index) in searchHistory" :key="index"
							@click="handleHistoryClick(item)">
							<text class="history-tag-text">{{ item }}</text>
						</view>
					</view>
				</view>
				<!-- 国内热门城市 -->
				<view class="hot-city-card">
					<view class="hot-city-header">
						<view class="hot-city-title-wrapper">
							<text class="hot-city-icon">🔥</text>
							<text class="hot-city-title">国内热门城市</text>
						</view>
					</view>
					<view class="hot-city-tags">
						<view class="hot-city-tag" v-for="(city, index) in defaultHotCities" :key="index"
							@click="handleCityClick(city)">
							<text class="hot-city-tag-text">{{ city.name }}</text>
						</view>
					</view>
				</view>
				<!-- 国外热门城市 -->
				<view class="hot-city-card">
					<view class="hot-city-header">
						<view class="hot-city-title-wrapper">
							<text class="hot-city-icon">🔥</text>
							<text class="hot-city-title">国外热门城市</text>
						</view>
					</view>
					<view class="hot-city-tags">
						<view class="hot-city-tag" v-for="(city, index) in defaultHotForeignCities" :key="index"
							@click="handleCityClick(city)">
							<text class="hot-city-tag-text">{{ city.name }}</text>
						</view>
					</view>
				</view>
			</template>
			<template v-if="searchKeyword">
				<!-- 搜索结果 -->
				<view class="search-results" v-if="hasSearched">
					<view class="result-header">
						<text class="result-count">找到 {{ searchResults.length }} 个结果</text>
					</view>
					<!-- 加载状态 -->
					<view class="loading-wrapper" v-if="isLoading">
						<text class="loading-text">搜索中...</text>
					</view>
					<!-- 搜索结果列表 -->
					<view class="hotel-list" v-else>
						<!-- 城市列表 -->
						<view v-if="cityList.length > 0" class="result-section">
							<view class="result-section-title">城市</view>
							<view v-for="(item, index) in cityList" :key="`city-${item.id || index}`" 
								class="search-result-item city-item" @click="handleSelectCity(item)">
								<view class="result-item-left">
									<text class="result-item-name">{{ item.name }}</text>
								</view>
								<view class="result-item-right">
									<text class="result-item-count" v-if="item.hotelCount">{{ item.hotelCount }}家酒店</text>
									<uni-icons type="right" size="16" color="#999"></uni-icons>
								</view>
							</view>
						</view>
						<!-- 酒店列表 -->
						<view v-if="hotelList.length > 0" class="result-section">
							<view class="result-section-title">酒店</view>
							<view v-for="(item, index) in hotelList" :key="`hotel-${item.id || index}`" 
								class="hotel-item-wrapper" @click="handleSelectHotel(item)">
								<HotelItem :item="item" />
							</view>
						</view>
						<!-- 空状态 -->
						<view class="empty-state" v-if="searchResults.length === 0">
							<text class="empty-text">暂无搜索结果</text>
						</view>
					</view>
				</view>
			</template>


		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useHotelSearchStore } from '@/store/useHotelSearchStore';
import HotelItem from '@/components/hotel-item/index.vue';
import customNavBar from '@/components/custom-nav-bar/index.vue';
import utils from '@/utils/utils';
import Home from '@/api/home';

const regionList = ref<any[]>([
	{
		id: 1,
		name: '亚洲'
	},
	{
		id: 2,
		name: '欧洲'
	},
	{
		id: 3,
		name: '美洲'
	},
	{
		id: 4,
		name: '非洲'
	}
]);
const selectedRegionId = ref<number | null>(1);
const currentCity = ref('珠海');
const hotelSearchStore = useHotelSearchStore();
const searchKeyword = ref('');
const hasSearched = ref(false);
const hotelList = ref<any[]>([]);
const cityList = ref<any[]>([]);
const searchResults = ref<any[]>([]); // 合并的搜索结果列表（包含城市和酒店）
const isLoading = ref(false);
const searchHistory = ref<string[]>(['xi', '香港', '酒店', '丽晶酒店', '丽晶']);
const hotCities = ref<string[]>([
	'香港', '上海', '北京', '三亚',
	'成都', '深圳', '西安', '广州',
	'沈阳', '珠海', '杭州', '重庆',
	'澳门特别', '厦门', '南京', '苏州',
	'天津', '汕头', '哈尔滨', '长沙',
	'大连', '青岛', '金华', '淄博'
]);
// 默认的热门城市列表
const defaultHotCities=[
  { code: '', name: '北京', type: 'city' },
  { code: '', name: '上海', type: 'city' },
  { code: '', name: '天津', type: 'city' },
  { code: '', name: '重庆', type: 'city' },
  { code: '', name: '大连', type: 'city' },
  { code: '', name: '青岛', type: 'city' },
  { code: '', name: '西安', type: 'city' },
  { code: '', name: '南京', type: 'city' },
  { code: '', name: '苏州', type: 'city' },
  { code: '', name: '杭州', type: 'city' },
  { code: '', name: '厦门', type: 'city' },
  { code: '', name: '成都', type: 'city' },
  { code: '', name: '深圳', type: 'city' },
  { code: '', name: '广州', type: 'city' },
  { code: '', name: '三亚', type: 'city' },
  { code: '', name: '台北', type: 'city' },
  { code: '', name: '香港', type: 'city' },
  { code: '', name: '济南', type: 'city' },
  { code: '', name: '沈阳', type: 'city' }
]
// 默认的外国热门城市列表
const defaultHotForeignCities=[
  { code: '', name: '首尔', type: 'city' },
  { code: '', name: '曼谷', type: 'city' },
  { code: '', name: '普吉岛', type: 'city' },
  { code: '', name: '东京', type: 'city' },
  { code: '', name: '新加坡', type: 'city' },
  { code: '', name: '大阪', type: 'city' },
  { code: '', name: '济州市', type: 'city' },
  { code: '', name: '巴厘岛', type: 'city' },
  { code: '', name: '清迈', type: 'city' },
  { code: '', name: '京都', type: 'city' },
  { code: '', name: '吉隆坡', type: 'city' },
  { code: '', name: '芭提雅', type: 'city' },
  { code: '', name: '那霸', type: 'city' },
  { code: '', name: '洛杉矶', type: 'city' },
  { code: '', name: '哥大京那巴鲁', type: 'city' }, 

]
// 获取搜索信息
const searchInfo = computed(() => hotelSearchStore.getSearchInfo);

// 防抖定时器
let debounceTimer: any = null;

// 防抖函数
const debounce = (fn: Function, delay: number = 300) => {
	return (...args: any[]) => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		debounceTimer = setTimeout(() => {
			fn.apply(null, args);
		}, delay);
	};
};

// 处理 input 事件（带防抖）
const handleInput = debounce((e: any) => {
	// input 事件触发时，searchKeyword 已经通过 v-model 自动更新
	const keyword = e.detail?.value || searchKeyword.value;
	if (keyword && keyword.trim()) {
		// 自动执行搜索（不添加历史记录，只在确认时添加）
		performSearch();
	} else {
		// 如果输入为空，清空搜索结果
		hasSearched.value = false;
		searchResults.value = [];
		hotelList.value = [];
		cityList.value = [];
	}
}, 300);

// 处理搜索
const handleSearch = () => {
	if (!searchKeyword.value.trim()) {
		uni.showToast({
			title: '请输入搜索关键词',
			icon: 'none'
		});
		return;
	}

	// 添加到历史记录
	addToHistory(searchKeyword.value.trim());

	// 更新 store 中的酒店名称
	hotelSearchStore.setHotelName(searchKeyword.value);

	// 执行搜索（这里应该调用实际的搜索 API）
	performSearch();
};

// 添加到历史记录
const addToHistory = (keyword: string) => {
	if (!keyword) return;

	// 移除已存在的相同关键词
	const index = searchHistory.value.indexOf(keyword);
	if (index > -1) {
		searchHistory.value.splice(index, 1);
	}

	// 添加到最前面
	searchHistory.value.unshift(keyword);

	// 限制历史记录数量（最多保留10条）
	if (searchHistory.value.length > 10) {
		searchHistory.value = searchHistory.value.slice(0, 10);
	}

	// 保存到本地存储
	try {
		uni.setStorageSync('searchHistory', searchHistory.value);
	} catch (e) {
		console.error('保存历史记录失败:', e);
	}
};

// 点击历史记录标签
const handleHistoryClick = (keyword: string) => {
	searchKeyword.value = keyword;
	handleSearch();
};

// 清除历史记录
const handleClearHistory = () => {
	uni.showModal({
		title: '提示',
		content: '确定要清除所有历史记录吗？',
		success: (res) => {
			if (res.confirm) {
				searchHistory.value = [];
				// 清除本地存储
				try {
					uni.removeStorageSync('searchHistory');
				} catch (e) {
					console.error('清除历史记录失败:', e);
				}
			}
		}
	});
};

// 执行搜索（调用搜索接口）
const performSearch = async () => {
	if (!searchKeyword.value.trim()) {
		return;
	}

	isLoading.value = true;
	hasSearched.value = true;

	try {
		const response = await Home.searchHotels(searchKeyword.value);
		const { data } = response;
		
		if (data.success) {
			const resultData = data.data || {};
			
			// 处理城市列表
			const cities = (resultData.cityList || []).map((city: any) => ({
				...city,
				type: 'city' // 标记为城市类型
			}));
			cityList.value = cities;
			
			// 处理酒店列表
			const hotels = (resultData.hotelList || []).map((hotel: any) => ({
				...hotel,
				type: 'hotel' // 标记为酒店类型
			}));
			hotelList.value = hotels;
			
			// 合并搜索结果（先显示城市，再显示酒店）
			searchResults.value = [...cities, ...hotels];
		} else {
			uni.showToast({
				title: data.message || '搜索失败',
				icon: 'none'
			});
			searchResults.value = [];
			hotelList.value = [];
			cityList.value = [];
		}
	} catch (error: any) {
		console.error('搜索失败:', error);
		uni.showToast({
			title: error.message || '搜索失败，请重试',
			icon: 'none'
		});
		searchResults.value = [];
		hotelList.value = [];
		cityList.value = [];
	} finally {
		isLoading.value = false;
	}
};

// 处理地区点击
const handleRegionClick = (regionId: number) => {
	selectedRegionId.value = selectedRegionId.value === regionId ? null : regionId;
	// TODO: 根据选中的地区筛选搜索结果
};

// 点击热门城市
const handleCityClick = (city: any) => {
	// city 可能是字符串或对象
	const cityName = typeof city === 'string' ? city : city.name;
	
	// 将城市名称赋值到输入栏
	searchKeyword.value = cityName;
	
	// 创建城市对象（热门城市可能只有 name，创建一个包含 name 的对象）
	const cityObj = typeof city === 'string' ? { name: city } : city;
	
	// 更新 store 中的选中目的地（传入完整的城市对象）
	hotelSearchStore.setSelectedDestination(cityObj);
	hotelSearchStore.setDestination(cityName);
	
	// 直接触发搜索（点击城市时不需要防抖，立即搜索）
	handleSearch();
};

// 选中城市
const handleSelectCity = (city: any) => {
	// 存储完整的城市对象到 store（包含 id、name、code 等所有信息）
	if (city && city.name) {
		hotelSearchStore.setSelectedDestination(city); // 传入完整的城市对象
		hotelSearchStore.setDestination(city.name); // destination 字段保持为字符串名称
	}
	
	// 返回上一页
	const pages = getCurrentPages();
	if (pages.length > 1) {
		uni.navigateBack({
			delta: 1
		});
	} else {
		uni.redirectTo({
			url: '/pages/home/index'
		});
	}
};

// 选中酒店
const handleSelectHotel = (hotel: any) => {
	// 存储选中的酒店到 store
	hotelSearchStore.setSelectedHotel(hotel);

	// 同时更新酒店名称
	if (hotel.name) {
		hotelSearchStore.setHotelName(hotel.name);
	}

	// 跳转到酒店详情页面
	if (hotel.id) {
		uni.navigateTo({
			url: `/subpackages/search/pages/detail?id=${hotel.id}`
		});
	} else {
		uni.showToast({
			title: '酒店信息不完整',
			icon: 'none'
		});
	}
};





onMounted(() => {
	// 如果 store 中有酒店名称，自动填充
	// if (searchInfo.value.hotelName) {
	// 	searchKeyword.value = searchInfo.value.hotelName;
	// }

	// 从本地存储加载历史记录
	try {
		const savedHistory = uni.getStorageSync('searchHistory');
		if (savedHistory && Array.isArray(savedHistory)) {
			searchHistory.value = savedHistory;
		}
	} catch (e) {
		console.error('加载历史记录失败:', e);
	}
});

</script>

<style scoped lang="scss">
.page {
	min-height: 100vh;
	background-color: #f4f4f4;
}

.page-content {
	padding: 20rpx;
}

.search-header {
	background-color: #ffffff;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	padding: 20rpx 20rpx;
	margin-top: 20rpx;
}

.region-list {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 24rpx 32rpx;
	margin-top: 20rpx;
}

.region-item {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 8rpx 0;
	cursor: pointer;
	height: 80rpx;
	line-height: 80rpx;
	font-size: 35rpx;
}

.region-item-text {
	font-size: 28rpx;
	color: #000000;
	transition: all 0.3s;
}

.region-item.active .region-item-text {
	color: #333;
	font-weight: bold;
	font-size: 42rpx;
}

.region-indicator {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 50rpx;
	height: 3rpx;
	background-color: #d4a574;
	border-radius: 2rpx;
}

.current-city-card {
	display: flex;
	align-items: center;
	// gap: 20rpx;
	background-color: #ffffff;
	border-radius: 20rpx;
	padding: 24rpx 32rpx;
	margin-bottom: 20rpx;
}

.city-icon {
	font-size: 36rpx;
	color: #d4a574;
	display: flex;
	align-items: center;
	justify-content: center;
}

.city-text {
	font-size: 28rpx;
	color: #333;
	// font-weight: bold;
	letter-spacing: 4rpx;
}

.history-record-card {
	background-color: #ffffff;
	border-radius: 20rpx;
	padding: 24rpx 32rpx;
	margin-bottom: 20rpx;
}

.history-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24rpx;
}

.history-title-wrapper {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.history-icon {
	font-size: 32rpx;
	line-height: 1;
}

.history-title {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

.history-delete {
	padding: 8rpx;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
}

.delete-icon {
	font-size: 32rpx;
	line-height: 1;
}

.history-tags {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 16rpx;
}

.history-tag {
	background-color: #f2f2f2;
	border-radius: 32rpx;
	padding: 12rpx 24rpx;
	cursor: pointer;
	transition: all 0.2s;

	&:active {
		opacity: 0.7;
	}
}

.history-tag-text {
	font-size: 26rpx;
	color: #333;
}

.hot-city-card {
	background-color: #ffffff;
	border-radius: 20rpx;
	padding: 24rpx 32rpx;
	margin-bottom: 20rpx;
}

.hot-city-header {
	margin-bottom: 24rpx;
}

.hot-city-title-wrapper {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.hot-city-icon {
	font-size: 32rpx;
	line-height: 1;
}

.hot-city-title {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

.hot-city-tags {
	// display: grid;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	// grid-template-columns: repeat(4, 1fr);
	gap: 24rpx 32rpx;
}

.hot-city-tag {
	background-color: #f2f2f2;
	border-radius: 32rpx;
	padding: 12rpx 24rpx;
	cursor: pointer;
	transition: all 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 80rpx;
	height: 40rpx;

	&:active {
		opacity: 0.7;
	}
}

.hot-city-tag-text {
	font-size: 26rpx;
	color: #333;
	text-align: center;
}

.search-input-wrapper {
	display: flex;
	align-items: center;
	background-color: #f2f2f2;
	gap: 20rpx;
	padding: 20rpx;
	border-radius: 20rpx;
	// margin-bottom: 20rpx;
}

.search-input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.search-button {
	font-size: 28rpx;
	color: #007aff;
	font-weight: 500;
	cursor: pointer;

	&:active {
		opacity: 0.7;
	}
}

.search-results {
	.result-header {
		padding: 20rpx 0;
	}

	.result-count {
		font-size: 28rpx;
		color: #666;
	}

	.hotel-list {
		display: flex;
		flex-direction: column;
		gap: 30rpx;
	}

	.result-section {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.result-section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		padding: 0 10rpx;
		margin-bottom: 10rpx;
	}

	.search-result-item {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
		display: flex;
		align-items: center;
		justify-content: space-between;

		&:active {
			opacity: 0.8;
			transform: scale(0.98);
		}

		.result-item-left {
			display: flex;
			align-items: center;
			flex: 1;
		}

		.result-item-name {
			font-size: 32rpx;
			color: #333;
			font-weight: 500;
		}

		.result-item-right {
			display: flex;
			align-items: center;
			gap: 16rpx;
			flex-shrink: 0;
		}

		.result-item-count {
			font-size: 26rpx;
			color: #999;
		}
	}

	.city-item {
		margin-bottom: 0;
	}

	.hotel-item-wrapper {
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		cursor: pointer;
		transition: opacity 0.2s;

		&:active {
			opacity: 0.7;
		}
	}

	.loading-wrapper {
		padding: 40rpx 0;
		text-align: center;
	}

	.loading-text {
		font-size: 28rpx;
		color: #999;
	}

	.empty-state {
		padding: 80rpx 0;
		text-align: center;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
	}
}
</style>
