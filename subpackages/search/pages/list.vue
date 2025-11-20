<template>
	<view class="page">
		<customNavBar :showBackButton="true" :autoBack="true" title="酒店列表"></customNavBar>

		<view class="page-content" :style="{ paddingTop: `${utils.totalSafeAreaHeight + 10}px` }">
			<!-- 搜索栏 -->
			<view class="search-bar">
				<view class="search-bar-left">
					<view class="search-bar-left-text">香港</view>
					<view class="search-bar-left-item-container" @click="handleOpenCalendar">
						<view class="search-bar-left-item">
						<text style="color: #c0c3cc;">住</text>
						<text style="letter-spacing: -1rpx;font-weight: bold;">{{ formatDateDisplay(checkInDate) }}</text>
					</view>
					<view class="search-bar-left-item">
						<text style="color: #c0c3cc;">离</text>
						<text style="letter-spacing: -1rpx;font-weight: bold;">{{ formatDateDisplay(checkOutDate) }}</text>
					</view>
					</view>
					<view>
						<!-- 下箭头 -->
						<uni-icons type="down" size="14" color="#666"></uni-icons>
					</view>
				</view>
				<view class="search-bar-right">
					<!-- 搜索 -->
					<view class="search-bar-right-item">
						<uni-icons type="search" size="14" color="#666"></uni-icons>
						<input disabled type="text" placeholder="关键词/品牌/酒店名">
					</view>

				</view>
			</view>
			<!-- 加载状态 -->
			<view class="loading-wrapper" v-if="isLoading">
				<text class="loading-text">加载中...</text>
			</view>

			<!-- 酒店列表 -->
			<view class="hotel-list" v-else>
				<view 
					v-for="(item, index) in hotelList" 
					:key="item.id || index"
					class="hotel-item-wrapper"
					@click="handleSelectHotel(item)"
				>
					<searchHotelItem :item="item" />
				</view>

				<!-- 空状态 -->
				<view class="empty-state" v-if="hotelList.length === 0">
					<text class="empty-text">暂无酒店数据</text>
				</view>

				<!-- 加载更多 -->
				<view class="load-more" v-if="hasMore && hotelList.length > 0" @click="loadMore">
					<text class="load-more-text">加载更多</text>
				</view>

				<!-- 没有更多 -->
				<view class="no-more" v-if="!hasMore && hotelList.length > 0">
					<text class="no-more-text">没有更多了</text>
				</view>
			</view>
		</view>

		<!-- 排序弹窗 -->
		<up-popup v-model:show="showSortModal" mode="bottom" :safeAreaInsetBottom="true">
			<view class="sort-modal">
				<view class="modal-header">
					<text class="modal-title">排序方式</text>
					<uni-icons type="close" size="20" color="#666" @click="showSortModal = false"></uni-icons>
				</view>
				<view class="sort-options">
					<view 
						v-for="option in sortOptions" 
						:key="option.value"
						class="sort-option"
						:class="{ active: currentSort === option.value }"
						@click="handleSortChange(option.value)"
					>
						<text class="sort-option-text">{{ option.label }}</text>
						<uni-icons v-if="currentSort === option.value" type="checkmarkempty" size="18" color="#007aff"></uni-icons>
					</view>
				</view>
			</view>
		</up-popup>

		<!-- 筛选弹窗 -->
		<up-popup v-model:show="showFilterModal" mode="bottom" :safeAreaInsetBottom="true">
			<view class="filter-modal">
				<view class="modal-header">
					<text class="modal-title">筛选条件</text>
					<view class="modal-actions">
						<text class="reset-btn" @click="handleResetFilter">重置</text>
						<text class="confirm-btn" @click="handleConfirmFilter">确定</text>
					</view>
				</view>
				<view class="filter-content">
					<!-- 价格区间 -->
					<view class="filter-section">
						<text class="filter-section-title">价格区间</text>
						<view class="price-range">
							<input 
								class="price-input" 
								type="number" 
								v-model="filterParams.minPrice" 
								placeholder="最低价"
							/>
							<text class="price-separator">-</text>
							<input 
								class="price-input" 
								type="number" 
								v-model="filterParams.maxPrice" 
								placeholder="最高价"
							/>
						</view>
					</view>

					<!-- 标签筛选 -->
					<view class="filter-section">
						<text class="filter-section-title">标签</text>
						<view class="tag-list">
							<view 
								v-for="tag in tagOptions" 
								:key="tag"
								class="tag-item"
								:class="{ active: filterParams.tags.includes(tag) }"
								@click="toggleTag(tag)"
							>
								<text>{{ tag }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</up-popup>

		<!-- 日历弹窗 -->
		<CalendarPopup v-if="calendarShow" v-model:show="calendarShow" />
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useHotelSearchStore } from '@/store/useHotelSearchStore';
import searchHotelItem from '@/components/search-hotel-item/index.vue';
import customNavBar from '@/components/custom-nav-bar/index.vue';
import CalendarPopup from '@/components/calendar-popup/index.vue';
import utils from '@/utils/utils';
import dayjs from 'dayjs';

const hotelSearchStore = useHotelSearchStore();

// 日历弹窗显示状态（响应式）
const calendarShow = computed({
	get: () => hotelSearchStore.calendarShow,
	set: (val) => hotelSearchStore.setCalendarShow(val)
});

// 获取日期
const checkInDate = computed(() => hotelSearchStore.getCheckInDate);
const checkOutDate = computed(() => hotelSearchStore.getCheckOutDate);

// 格式化日期显示（MM/DD格式）
const formatDateDisplay = (dateStr: string) => {
	if (!dateStr) return '';
	try {
		return dayjs(dateStr).format('MM/DD');
	} catch (e) {
		return dateStr;
	}
};

// 打开日历弹窗
const handleOpenCalendar = () => {
	hotelSearchStore.setCalendarShow(true);
};

// 酒店列表数据
const hotelList = ref<any[]>([]);
const isLoading = ref(false);
const hasMore = ref(true);
const currentPage = ref(1);
const pageSize = ref(10);

// 排序相关
const showSortModal = ref(false);
const currentSort = ref('default');
const sortOptions = [
	{ label: '默认排序', value: 'default' },
	{ label: '价格从低到高', value: 'price_asc' },
	{ label: '价格从高到低', value: 'price_desc' },
	{ label: '评分最高', value: 'rating_desc' }
];

const sortText = computed(() => {
	const option = sortOptions.find(opt => opt.value === currentSort.value);
	return option?.label || '排序';
});

// 筛选相关
const showFilterModal = ref(false);
const filterParams = ref({
	minPrice: '',
	maxPrice: '',
	tags: [] as string[]
});

const tagOptions = ['住3付2', '享奢旅积分', '免费取消', '免费WiFi', '早餐'];

// 获取搜索信息
const searchInfo = computed(() => hotelSearchStore.getSearchInfo);

// 加载酒店列表
const loadHotelList = async (page: number = 1, reset: boolean = false) => {
	if (isLoading.value) return;
	
	isLoading.value = true;
	
	try {
		// 模拟 API 请求延迟
		await new Promise(resolve => setTimeout(resolve, 500));
		
		// TODO: 调用实际的搜索 API
		// const response = await searchHotelListAPI({
		//   page,
		//   pageSize: pageSize.value,
		//   sort: currentSort.value,
		//   ...filterParams.value,
		//   ...searchInfo.value
		// });
		// const newList = response.data.list;
		
		// 模拟数据
		const mockData = generateMockData(page);
		
		if (reset) {
			hotelList.value = mockData;
		} else {
			hotelList.value = [...hotelList.value, ...mockData];
		}
		
		// 判断是否还有更多数据
		hasMore.value = mockData.length === pageSize.value;
		currentPage.value = page;
	} catch (error) {
		console.error('加载失败:', error);
		uni.showToast({
			title: '加载失败，请重试',
			icon: 'none'
		});
	} finally {
		isLoading.value = false;
	}
};

// 生成模拟数据
const generateMockData = (page: number) => {
	const baseId = (page - 1) * pageSize.value;
	const data = [];
	
	for (let i = 0; i < pageSize.value; i++) {
		const id = baseId + i + 1;
		data.push({
			id,
			image: 'https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg',
			name: `酒店名称${id}`,
			price: String(100 + id * 50),
			label: ['住3付2', '享奢旅积分', id % 2 === 0 ? '免费取消' : '免费WiFi']
		});
	}
	
	return data;
};

// 排序变化
const handleSortChange = (sort: string) => {
	currentSort.value = sort;
	showSortModal.value = false;
	// 重新加载数据
	loadHotelList(1, true);
};

// 切换标签
const toggleTag = (tag: string) => {
	const index = filterParams.value.tags.indexOf(tag);
	if (index > -1) {
		filterParams.value.tags.splice(index, 1);
	} else {
		filterParams.value.tags.push(tag);
	}
};

// 重置筛选
const handleResetFilter = () => {
	filterParams.value = {
		minPrice: '',
		maxPrice: '',
		tags: []
	};
};

// 确认筛选
const handleConfirmFilter = () => {
	showFilterModal.value = false;
	// 重新加载数据
	loadHotelList(1, true);
};

// 加载更多
const loadMore = () => {
	if (!hasMore.value || isLoading.value) return;
	loadHotelList(currentPage.value + 1, false);
};

// 选中酒店
const handleSelectHotel = (hotel: any) => {
	// 存储选中的酒店到 store
	hotelSearchStore.setSelectedHotel(hotel);
	
	// 同时更新酒店名称
	if (hotel.name) {
		hotelSearchStore.setHotelName(hotel.name);
	}
	
	// 返回上一页
	// uni.navigateBack({
	// 	delta: 1
	// });
	// 	跳转到酒店详情页面
	uni.navigateTo({
		url: `/subpackages/search/pages/detail?id=${hotel.id}`
	});
};

// 页面加载
onLoad(() => {
	// 初始加载数据
	loadHotelList(1, true);
});
</script>

<style scoped lang="scss">
.page {
	min-height: 100vh;
	background-color: #f5f5f5;

	.page-content {
		padding: 20rpx;
		// 搜索栏
		.search-bar{
			display: flex;
			align-items: center;
			justify-content: space-between;
			background-color: #fff;
			border-radius: 40rpx;
			padding:0rpx 20rpx;
			margin-bottom: 20rpx;
			gap: 20rpx;
			
			.search-bar-left{
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 20rpx;
				.search-bar-left-text{
					//  min-width: 100rpx;
					font-size:30rpx;
					font-weight: bold;
					padding: 0 5rpx;
					display: block;
					flex-shrink: 0;
					color:#d4ab62;
				}
				.search-bar-left-item-container{
					display: flex;
					align-items: center;
					justify-content: space-between;
					// padding: 0 5rpx;
					flex-direction: column;
					.search-bar-left-item{
						font-size:24rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
					}
				}
				
			}
			.search-bar-right{
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 10rpx;
				padding: 10rpx 0;
				flex-direction: row;
				flex: 1;
				// width: 100%;
				.search-bar-right-item{
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 10rpx;
					padding: 10rpx 0;
					flex-direction: row;
				}
			}
		}
	}
}

.filter-bar {
	display: flex;
	background-color: #fff;
	border-radius: 20rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	gap: 20rpx;

	.filter-item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10rpx;
		padding: 10rpx 0;

		.filter-text {
			font-size: 28rpx;
			color: #333;
		}
	}
}

.result-header {
	padding: 20rpx 0;

	.result-count {
		font-size: 28rpx;
		color: #666;
	}
}

.loading-wrapper {
	padding: 40rpx 0;
	text-align: center;

	.loading-text {
		font-size: 28rpx;
		color: #999;
	}
}

.hotel-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;

	.hotel-item-wrapper {
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		transition: opacity 0.2s;
		
		&:active {
			opacity: 0.7;
		}
	}

	.empty-state {
		padding: 80rpx 0;
		text-align: center;

		.empty-text {
			font-size: 28rpx;
			color: #999;
		}
	}

	.load-more {
		padding: 30rpx 0;
		text-align: center;

		.load-more-text {
			font-size: 28rpx;
			color: #007aff;
		}
	}

	.no-more {
		padding: 30rpx 0;
		text-align: center;

		.no-more-text {
			font-size: 24rpx;
			color: #999;
		}
	}
}

// 排序弹窗
.sort-modal {
	padding: 40rpx;
	background-color: #fff;
	border-radius: 30rpx 30rpx 0 0;

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
		margin-bottom: 30rpx;

		.modal-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}

		.modal-actions {
			display: flex;
			gap: 30rpx;

			.reset-btn {
				font-size: 28rpx;
				color: #666;
			}

			.confirm-btn {
				font-size: 28rpx;
				color: #007aff;
				font-weight: 500;
			}
		}
	}

	.sort-options {
		display: flex;
		flex-direction: column;
		gap: 20rpx;

		.sort-option {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx 0;
			
			&.active {
				.sort-option-text {
					color: #007aff;
				}
			}

			.sort-option-text {
				font-size: 30rpx;
				color: #333;
			}
		}
	}
}

// 筛选弹窗
.filter-modal {
	padding: 40rpx;
	background-color: #fff;
	border-radius: 30rpx 30rpx 0 0;
	max-height: 80vh;
	overflow-y: auto;

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
		margin-bottom: 30rpx;

		.modal-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}

		.modal-actions {
			display: flex;
			gap: 30rpx;

			.reset-btn {
				font-size: 28rpx;
				color: #666;
			}

			.confirm-btn {
				font-size: 28rpx;
				color: #007aff;
				font-weight: 500;
			}
		}
	}

	.filter-content {
		display: flex;
		flex-direction: column;
		gap: 40rpx;

		.filter-section {
			display: flex;
			flex-direction: column;
			gap: 20rpx;

			.filter-section-title {
				font-size: 30rpx;
				font-weight: 500;
				color: #333;
			}

			.price-range {
				display: flex;
				align-items: center;
				gap: 20rpx;

				.price-input {
					flex: 1;
					padding: 20rpx;
					background-color: #f5f5f5;
					border-radius: 10rpx;
					font-size: 28rpx;
					color: #333;
				}

				.price-separator {
					font-size: 28rpx;
					color: #666;
				}
			}

			.tag-list {
				display: flex;
				flex-wrap: wrap;
				gap: 20rpx;

				.tag-item {
					padding: 15rpx 30rpx;
					background-color: #f5f5f5;
					border-radius: 30rpx;
					font-size: 26rpx;
					color: #666;
					transition: all 0.2s;
					
					&.active {
						background-color: #007aff;
						color: #fff;
					}
				}
			}
		}
	}
}
</style>

