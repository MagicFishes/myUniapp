<template>
	<view class="page">
		<customNavBar :showBackButton="true" :autoBack="true" title="酒店列表"></customNavBar>

		<view class="page-content" :style="{ paddingTop: `${utils.totalSafeAreaHeight + 10}px` }">
			<!-- 搜索栏 -->
			<view class="search-bar">
				<view class="search-bar-left">
					<view class="search-bar-left-text">{{ cityName || '选择城市' }}</view>
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
					<view class="search-bar-right-item" @click="handleSearchClick">
						<uni-icons type="search" size="14" color="#666"></uni-icons>
						<input disabled type="text" placeholder="城市/酒店">
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
				>
					<searchHotelItem :item="item" @clickHotelDetail="handleSelectHotel" />
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
import { ref, computed, onMounted, watch } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { useHotelSearchStore } from '@/store/useHotelSearchStore';
import searchHotelItem from '@/components/search-hotel-item/index.vue';
import customNavBar from '@/components/custom-nav-bar/index.vue';
import CalendarPopup from '@/components/calendar-popup/index.vue';
import utils from '@/utils/utils';
import dayjs from 'dayjs';
import Hotel from '@/api/hotel';

const hotelSearchStore = useHotelSearchStore();

// 日历弹窗显示状态（响应式）
const calendarShow = computed({
	get: () => hotelSearchStore.calendarShow,
	set: (val) => hotelSearchStore.setCalendarShow(val)
});

// 获取日期
const checkInDate = computed(() => hotelSearchStore.getCheckInDate);
const checkOutDate = computed(() => hotelSearchStore.getCheckOutDate);

// 监听日期变化，自动重新请求酒店列表
const isInitialized = ref(false);
watch([checkInDate, checkOutDate], ([newCheckIn, newCheckOut], [oldCheckIn, oldCheckOut]) => {
	// 避免初始化时触发（onLoad 会处理首次加载）
	if (!isInitialized.value) {
		isInitialized.value = true;
		return;
	}
	
	// 只有当日期真正发生变化且都有值时才重新加载
	if (newCheckIn && newCheckOut && (newCheckIn !== oldCheckIn || newCheckOut !== oldCheckOut)) {
		// 确保 cityId 已初始化
		if (!cityId.value) {
			initCityIdFromStore();
		}
		// 重新加载酒店列表
		if (cityId.value) {
			loadHotelList(1, true);
		}
	}
}, { immediate: false });

// 获取城市名称
const cityName = computed(() => {
	const destination = hotelSearchStore.getDestination;
	const cityNameFromStore = hotelSearchStore.getCityName;
	return cityNameFromStore || destination || '';
});

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

// 点击搜索框跳转到搜索页面
const handleSearchClick = () => {
	uni.navigateTo({
		url: '/subpackages/search/pages/index'
	});
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

// 城市ID（可以从路由参数或store获取）
const cityId = ref<string | number>('');

// 尝试从 store 初始化 cityId（例如从搜索页返回时）
const initCityIdFromStore = () => {
	if (cityId.value) return;
	const selectedDestination: any = (hotelSearchStore as any).getSelectedDestination || (hotelSearchStore as any).selectedDestination;
	if (selectedDestination && (selectedDestination.id || selectedDestination.cityId)) {
		cityId.value = selectedDestination.id || selectedDestination.cityId;
	}
};

// 获取当前城市ID（从 store 中）
const getCurrentCityIdFromStore = (): string | number | null => {
	const selectedDestination: any = hotelSearchStore.getSelectedDestination;
	if (selectedDestination && (selectedDestination.id || selectedDestination.cityId)) {
		return selectedDestination.id || selectedDestination.cityId;
	}
	return null;
};

// 检测城市是否变化，如果变化则重新加载
const checkCityChangeAndReload = () => {
	const newCityId = getCurrentCityIdFromStore();
	const currentCityId = hotelSearchStore.getCurrentCityId;
	
	// 如果新城市ID存在且与当前记录的不同，说明选择了新城市
	if (newCityId && String(newCityId) !== String(currentCityId)) {
		cityId.value = newCityId;
		// 更新 store 中记录的城市ID
		hotelSearchStore.setCurrentCityId(newCityId);
		// 重新加载酒店列表
		loadHotelList(1, true);
	}
};

// 加载酒店列表（真实接口，一次性获取）
const loadHotelList = async (page: number = 1, reset: boolean = false) => {
	if (isLoading.value) return;

	// 优先从路由参数取，其次从 store 取
	if (!cityId.value) {
		initCityIdFromStore();
		if (!cityId.value) {
			console.warn('cityId 为空，无法加载酒店列表');
			return;
		}
	}

	isLoading.value = true;

	try {
		// 1. 调用城市酒店列表接口
		const { data } = await Hotel.getHotelsByCity({
			cityId: cityId.value
		} as any);

		if (!data?.success) {
			throw new Error(data?.message || '获取酒店列表失败');
		}

		// 后端一次性返回列表，这里不做前端分页
		const pageData = Array.isArray(data.data) ? data.data : [];

		// 初始化图片和最低价字段
		pageData.forEach((item: any) => {
			item.lowestPrice = null;
			if (item.image && typeof item.image === 'string' && item.image.includes(',')) {
				item.image = item.image.split(',')[0];
			}
		});

		if (reset) {
			hotelList.value = pageData;
		} else {
			hotelList.value = [...hotelList.value, ...pageData];
		}

		// 创建 id -> index 映射，方便回填价格
		const hotelIndexMap = hotelList.value.reduce((acc: any, cur: any, index: number) => {
			const idKey = String(cur.id);
			acc[idKey] = index;
			return acc;
		}, {});

		// 2. 调用最低价接口
		const hotelIds = hotelList.value.map((item: any) => item.id);
		if (hotelIds.length > 0) {
			const checkin = hotelSearchStore.getCheckInDate;
			const checkout = hotelSearchStore.getCheckOutDate;
			const adultNum = hotelSearchStore.getPersonCount;

			const { data: priceRes } = await Hotel.getHotelLowestPrices({
				ids: hotelIds,
				checkin,
				checkout,
				adultNum
			} as any);

			if (priceRes?.success && Array.isArray(priceRes.data)) {
				// 匹配最低价到对应酒店
				priceRes.data.forEach((item: any) => {
					const priceId = String(item.id);
					const hotelIndex = hotelIndexMap[priceId];
					if (hotelIndex !== undefined) {
						if (item.minPrice === null || item.minPrice === undefined) {
							hotelList.value[hotelIndex].lowestPrice = {
								minPrice: null,
								initPriceUnit: ''
							};
						} else {
							hotelList.value[hotelIndex].lowestPrice = {
								minPrice: item.minPrice,
								initPriceUnit: item.initPriceUnit || 'CNY'
							};
						}
					}
				});

				// 对于没有匹配到价格的酒店，设置默认“满房”状态
				hotelList.value.forEach((item: any) => {
					if (item.lowestPrice === null) {
						item.lowestPrice = {
							minPrice: null,
							initPriceUnit: ''
						};
					}
				});
			}
		}

		// 本页面不做分页，一次性加载完
		hasMore.value = false;
		currentPage.value = 1;
	} catch (error: any) {
		console.error('加载失败:', error);
		uni.showToast({
			title: error?.message || '加载失败，请重试',
			icon: 'none'
		});
		if (reset) {
			hotelList.value = [];
		}
	} finally {
		isLoading.value = false;
	}
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
	
	// 跳转到酒店详情页面（详情页会调用接口获取详情）
	uni.navigateTo({
		url: `/subpackages/search/pages/detail?id=${hotel.id}`
	});
};

// 页面加载（首次进入时调用）
onLoad((options: any) => {
	// 从路由参数获取cityId（如果有）
	if (options?.cityId) {
		cityId.value = options.cityId;
	}

	// 如果路由没有带 cityId，则尝试从 store 中取
	if (!cityId.value) {
		initCityIdFromStore();
	}

	// 保存当前城市ID到 store（用于后续检测城市变化）
	if (cityId.value) {
		hotelSearchStore.setCurrentCityId(cityId.value);
	}

	// 初始加载数据
	loadHotelList(1, true);
	// 标记已初始化，允许后续日期变化触发重新加载
	isInitialized.value = true;
});

// 页面每次显示时（例如从搜索页返回）
onShow(() => {
	// 检测城市是否变化（从城市选择页面返回时）
	checkCityChangeAndReload();
	
	// 如果当前没有酒店数据且不在加载中，则尝试重新加载
	if (!isLoading.value && hotelList.value.length === 0) {
		loadHotelList(1, true);
	}
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

