<template>
	<view class="page">
		<customNavBar :showBackButton="true" :autoBack="true" title="搜索"></customNavBar>

		<view class="page-content" :style="{ paddingTop: `${utils.totalSafeAreaHeight}px` }">
			<!-- 搜索栏 -->
			<view class="search-header">
				<view class="search-input-wrapper">
					<uni-icons type="search" size="20" color="#999"></uni-icons>
					<input class="search-input" v-model="searchKeyword" placeholder="关键词/品牌/酒店名"
						@confirm="handleSearch" />
					<!-- <view class="search-button" @click="handleSearch">搜索</view> -->
				</view>
				<!-- 亚洲等区域 -->
				<view v-if="!searchKeyword" class="region-list">
					<view class="region-item" v-for="item in regionList" :key="item.id"
						:class="{ active: selectedRegionId === item.id }" @click="handleRegionClick(item.id)">
						<text class="region-item-text">{{ item.name }}</text>
						<view v-if="selectedRegionId === item.id" class="region-indicator"></view>
					</view>
				</view>

			</view>
			<template v-if="!searchKeyword">
				<!-- 当前城市 -->
				<view class="current-city-card">
					<view class="city-icon"></view>
					<text class="city-text">当前城市: {{ currentCity }}</text>
				</view>
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
				<!-- 热门城市 -->
				<view class="hot-city-card">
					<view class="hot-city-header">
						<view class="hot-city-title-wrapper">
							<text class="hot-city-icon">🔥</text>
							<text class="hot-city-title">热门城市</text>
						</view>
					</view>
					<view class="hot-city-tags">
						<view class="hot-city-tag" v-for="(city, index) in hotCities" :key="index"
							@click="handleCityClick(city)">
							<text class="hot-city-tag-text">{{ city }}</text>
						</view>
					</view>
				</view>
			</template>
			<template v-if="searchKeyword">
				<!-- 搜索结果 -->
				<view class="search-results" v-if="hasSearched">
					<view class="result-header">
						<text class="result-count">找到 {{ hotelList.length }} 家酒店</text>
					</view>
					<!-- 加载状态 -->
					<view class="loading-wrapper" v-if="isLoading">
						<text class="loading-text">搜索中...</text>
					</view>
					<!-- 搜索结果列表 -->
					<view class="hotel-list" v-else>
						<view v-for="(item, index) in hotelList" :key="item.id || index" class="hotel-item-wrapper"
							@click="handleSelectHotel(item)">
							<HotelItem :item="item" />
						</view>
						<!-- 空状态 -->
						<view class="empty-state" v-if="hotelList.length === 0">
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

// 获取搜索信息
const searchInfo = computed(() => hotelSearchStore.getSearchInfo);

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

// 执行搜索（模拟搜索接口）
const performSearch = async () => {
	isLoading.value = true;
	hasSearched.value = true;

	try {
		// 模拟 API 请求延迟
		await new Promise(resolve => setTimeout(resolve, 500));

		// TODO: 调用实际的搜索 API
		// const response = await searchHotelAPI({
		//   keyword: searchKeyword.value,
		//   destination: searchInfo.value.destination,
		//   checkInDate: searchInfo.value.checkInDate,
		//   checkOutDate: searchInfo.value.checkOutDate
		// });
		// hotelList.value = response.data;

		// 模拟数据：根据关键词返回不同的结果
		const mockData = [
			{
				id: 1,
				image: 'https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg',
				name: `${searchKeyword.value || '酒店'}名称1`,
				price: '100',
				label: ['住3付2', '享奢旅积分'],
			},
			{
				id: 2,
				image: 'https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg',
				name: `${searchKeyword.value || '酒店'}名称2`,
				price: '200',
				label: ['住3付2', '享奢旅积分'],
			},
			{
				id: 3,
				image: 'https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg',
				name: `${searchKeyword.value || '酒店'}名称3`,
				price: '300',
				label: ['住3付2', '享奢旅积分', '免费取消'],
			},
			{
				id: 4,
				image: 'https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg',
				name: `${searchKeyword.value || '酒店'}名称4`,
				price: '400',
				label: ['住3付2'],
			},
			{
				id: 5,
				image: 'https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg',
				name: `${searchKeyword.value || '酒店'}名称5`,
				price: '500',
				label: ['享奢旅积分', '免费WiFi'],
			}
		];

		hotelList.value = mockData;
	} catch (error) {
		console.error('搜索失败:', error);
		uni.showToast({
			title: '搜索失败，请重试',
			icon: 'none'
		});
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
const handleCityClick = (city: string) => {
	searchKeyword.value = city;
	handleSearch();
};

// 选中酒店
const handleSelectHotel = (hotel: any) => {
	// 存储选中的酒店到 store
	hotelSearchStore.setSelectedHotel(hotel);

	// 同时更新酒店名称
	if (hotel.name) {
		hotelSearchStore.setHotelName(hotel.name);
	}

	// 使用 redirectTo 返回上一页，确保当前页面被销毁
	// 获取页面栈
	const pages = getCurrentPages();
	if (pages.length > 1) {
		// 如果页面栈中有上一页，使用 navigateBack 并指定 delta
		uni.navigateBack({
			delta: 1
		});
	} else {
		// 如果没有上一页，跳转到首页
		uni.redirectTo({
			url: '/pages/home/index'
		});
	}
};





onMounted(() => {
	// 如果 store 中有酒店名称，自动填充
	if (searchInfo.value.hotelName) {
		searchKeyword.value = searchInfo.value.hotelName;
	}

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
	padding: 20rpx 30rpx;
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
	margin-bottom: 20rpx;
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
		gap: 20rpx;
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
