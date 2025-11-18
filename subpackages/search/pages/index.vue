<template>
	<view class="page">
		<customNavBar  :showBackButton="true" :autoBack="true" title="搜索" ></customNavBar>

		<view class="page-content" :style="{ paddingTop: `${utils.totalSafeAreaHeight+10}px` }">
			<!-- 搜索栏 -->
			<view class="search-header">
				<view class="search-input-wrapper">
					<uni-icons type="search" size="20" color="#999"></uni-icons>
					<input 
						class="search-input" 
						v-model="searchKeyword" 
						placeholder="关键词/品牌/酒店名"
						@confirm="handleSearch"
					/>
					<view class="search-button" @click="handleSearch">搜索</view>
				</view>
			</view>

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
					<view 
						v-for="(item, index) in hotelList" 
						:key="item.id || index"
						class="hotel-item-wrapper"
						@click="handleSelectHotel(item)"
					>
						<HotelItem :item="item" />
					</view>
					<!-- 空状态 -->
					<view class="empty-state" v-if="hotelList.length === 0">
						<text class="empty-text">暂无搜索结果</text>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useHotelSearchStore } from '@/store/useHotelSearchStore';
import HotelItem from '@/components/hotel-item/index.vue';
import customNavBar from '@/components/custom-nav-bar/index.vue';
import utils from '@/utils/utils';


const hotelSearchStore = useHotelSearchStore();
const searchKeyword = ref('');
const hasSearched = ref(false);
const hotelList = ref<any[]>([]);
const isLoading = ref(false);

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

	// 更新 store 中的酒店名称
	hotelSearchStore.setHotelName(searchKeyword.value);

	// 执行搜索（这里应该调用实际的搜索 API）
	performSearch();
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
});
</script>

<style scoped lang="scss">
.page {
	min-height: 100vh;
	background-color: #f5f5f5;
}

.page-content {
	padding: 20rpx;
}

.search-header {
	background-color: #fff;
	border-radius: 20rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
}

.search-input-wrapper {
	display: flex;
	align-items: center;
	gap: 20rpx;
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

