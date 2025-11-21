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
import { ref, computed, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
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

// 城市ID（可以从路由参数或store获取）
const cityId = ref<string | number>('');

// 生成假数据
const generateMockHotelData = (page: number) => {
	const baseId = (page - 1) * pageSize.value;
	const mockHotels = [
		{
			id: '4802',
			name: '巴黎丽兹酒店',
			nameEn: 'Ritz Paris',
			image: 'https://cdn.youxiatrip.com/hotel/040ff6fe-b03a-42cb-8385-d548470d387b.jpg',
			telephone: '33-1-43163030',
			address: '',
			addressEn: '15 Place Vendome Paris France 75001',
			brandName: '立鼎世',
			tagName: []
		},
		{
			id: '4809',
			name: '莱佛士皇家巴黎梦索酒店',
			nameEn: 'Le Royal Monceau Raffles',
			image: 'https://cdn.youxiatrip.com/upload/image/uals0f3zggeqk9uyjxow.jpg',
			telephone: '33-1-42998800',
			address: '',
			addressEn: '37 Avenue Hoche Paris France 75008',
			brandName: '莱佛士',
			tagName: ['住几付几', '其他', '保证升级']
		},
		{
			id: '4816',
			name: '巴黎瑞瑟夫酒店',
			nameEn: 'LA RESERVE PARIS HOTEL AND SPA',
			image: 'https://cdn.youxiatrip.com/upload/image/dlng3ljtzharcn2ajpia.jpg',
			telephone: '33-1-58366060',
			address: '',
			addressEn: '42 AVENUE GABRIEL   PARIS FR 75008',
			brandName: '立鼎世',
			tagName: []
		},
		{
			id: '4823',
			name: '巴黎香格里拉酒店',
			nameEn: 'SHANGRI LA PARIS',
			image: 'https://cdn.youxiatrip.com/file/1648116487594.jpg',
			telephone: '(33) 1 53 67 19 64',
			address: '',
			addressEn: '10 AVENUE D IENA   PARIS FR 75116',
			brandName: '香格里拉',
			tagName: ['保证升级', '其他', '住几付几']
		},
		{
			id: '4830',
			name: '巴黎文华东方酒店',
			nameEn: 'Mandarin Oriental Paris',
			image: 'https://cdn.youxiatrip.com/upload/image/zpagc4ik6pk4zxjc6kxq.jpg',
			telephone: '33-1-70987888',
			address: '',
			addressEn: '251 Rue Saint Honore Paris France 75001',
			brandName: '文华东方',
			tagName: ['住几付几', '其他', '额外礼遇']
		},
		{
			id: '4837',
			name: '巴黎半岛酒店',
			nameEn: 'The Peninsula Paris',
			image: 'https://cdn.youxiatrip.com/upload/image/hxzmkznspbc1ryxhuvwv.jpg',
			telephone: '33 1 58 12 28 88',
			address: '巴黎市中心克勒贝尔大街19号 (Avenue Kléber)',
			addressEn: '19 Avenue Kleber. Paris France 75116',
			brandName: '半岛',
			tagName: ['其他', '住几付几']
		},
		{
			id: '4844',
			name: '巴黎德加勒王子豪华精选酒店',
			nameEn: 'Prince de Galles, a Luxury Collection Hotel, Paris',
			image: 'https://cdn.youxiatrip.com/upload/image/k2lvm5gkp9n9rmztuhlo.jpg',
			telephone: '33-1-53237777',
			address: '',
			addressEn: '33 Avenue George V Paris France 75008',
			brandName: '豪华精选',
			tagName: []
		},
		{
			id: '4858',
			name: '巴黎洲际大酒店',
			nameEn: 'InterContinental Paris Le Grand Hotel',
			image: 'https://cdn.youxiatrip.com/upload/image/e71vn10c0xo6woclhca2.jpg',
			telephone: '33-1-40073232',
			address: '',
			addressEn: '2 Rue Scribe Paris France 75009',
			brandName: '洲际',
			tagName: ['住几付几']
		},
		{
			id: '4865',
			name: '巴里尔富凯巴黎酒店',
			nameEn: 'Hotel Barriere Le Fouquet\'s',
			image: 'https://cdn.youxiatrip.com/upload/image/bp8gurepgcp8waipghcp.jpg',
			telephone: '33 970 809 111',
			address: '',
			addressEn: '46 Avenue George V Paris France 75008',
			brandName: '立鼎世',
			tagName: ['保证升级', '住几付几']
		},
		{
			id: '4872',
			name: '巴黎欧特家布里斯托尔酒店',
			nameEn: 'Le Bristol Paris',
			image: 'https://cdn.youxiatrip.com/upload/image/yaf5t5okzemxnlc813pg.jpg',
			telephone: '33-1-53434300',
			address: '',
			addressEn: '112 Rue Du Faubourg St Honore Paris France 75008',
			brandName: '欧特家',
			tagName: []
		},
		{
			id: '4879',
			name: '巴黎柏悦酒店',
			nameEn: 'Park Hyatt Paris-Vendome',
			image: 'https://cdn.youxiatrip.com/upload/image/nybusjqlof23fghvxitz.jpg',
			telephone: '33-1-58711234',
			address: '',
			addressEn: '5 Rue De La Paix Paris France 75002',
			brandName: '柏悦',
			tagName: []
		}
	];
	
	// 根据页码返回对应的数据
	const startIndex = (page - 1) * pageSize.value;
	const endIndex = startIndex + pageSize.value;
	const pageData = mockHotels.slice(startIndex, endIndex);
	
	// 处理图片（取第一张）
	pageData.forEach((item: any) => {
		item.lowestPrice = null; // 初始化为null，显示加载状态
		if (item.image && item.image.includes(',')) {
			item.image = item.image.split(',')[0];
		}
	});
	
	return pageData;
};

// 生成假价格数据（符合真实接口格式）
const generateMockPriceData = (hotelIds: (string | number)[]) => {
	// 模拟价格接口返回的数据
	return hotelIds.map((id, index) => {
		// 模拟部分酒店有价格，部分没有价格
		if (index % 5 === 0) {
			// 每5个酒店中有一个满房（没有价格）
			return {
				id: String(id),
				initMinPrice: null,
				initPriceUnit: '',
				minPrice: null
			};
		} else {
			// 随机生成价格单位（CNY或EUR）
			const priceUnit = Math.random() > 0.8 ? 'EUR' : 'CNY';
			
			if (priceUnit === 'EUR') {
				// EUR价格在300-2500之间
				const eurPrice = Math.random() * 2200 + 300;
				const cnyPrice = Math.floor(eurPrice * 8.23); // 汇率约8.23
				return {
					id: String(id),
					initMinPrice: Math.round(eurPrice * 100) / 100,
					initPriceUnit: 'EUR',
					minPrice: cnyPrice
				};
			} else {
				// CNY价格在2000-30000之间
				const cnyPrice = Math.random() * 28000 + 2000;
				return {
					id: String(id),
					initMinPrice: Math.round(cnyPrice * 100) / 100,
					initPriceUnit: 'CNY',
					minPrice: Math.floor(cnyPrice)
				};
			}
		}
	});
};

// 加载酒店列表
const loadHotelList = async (page: number = 1, reset: boolean = false) => {
	if (isLoading.value) return;
	
	isLoading.value = true;
	
	try {
		// 模拟接口延迟
		await new Promise(resolve => setTimeout(resolve, 500));
		
		// 使用假数据
		const mockData = generateMockHotelData(page);
		
		if (reset) {
			hotelList.value = mockData;
		} else {
			hotelList.value = [...hotelList.value, ...mockData];
		}
		
		// 创建ID到索引的映射（同时支持字符串和数字类型的ID）
		const hotelIndexMap = hotelList.value.reduce((acc: any, cur: any, index: number) => {
			const idKey = String(cur.id);
			acc[idKey] = index;
			return acc;
		}, {});
		
		// 模拟获取价格接口（延迟1.5秒，模拟加载状态）
		// 注意：真实接口调用时会使用 store 中的 personCount 作为 adultNum 参数
		// const checkInDate = hotelSearchStore.getCheckInDate;
		// const checkOutDate = hotelSearchStore.getCheckOutDate;
		// const personCount = hotelSearchStore.personCount; // 直接使用store中的人数
		setTimeout(() => {
			const hotelIds = hotelList.value.map((item: any) => item.id);
			const mockPriceData = generateMockPriceData(hotelIds);
			
			// 匹配价格到对应的酒店
			mockPriceData.forEach((priceItem: any) => {
				const priceId = String(priceItem.id);
				if (hotelIndexMap[priceId] !== undefined) {
					const hotelIndex = hotelIndexMap[priceId];
					if (priceItem.minPrice === null || priceItem.minPrice === undefined) {
						// 没有价格（满房）
						hotelList.value[hotelIndex].lowestPrice = {
							minPrice: null,
							initPriceUnit: ''
						};
					} else {
						// 有价格
						hotelList.value[hotelIndex].lowestPrice = {
							minPrice: priceItem.minPrice,
							initPriceUnit: priceItem.initPriceUnit || 'CNY'
						};
					}
				}
			});
			
			// 对于没有匹配到价格的酒店，设置为默认值（满房）
			hotelList.value.forEach((item: any) => {
				if (item.lowestPrice === null) {
					item.lowestPrice = {
						minPrice: null,
						initPriceUnit: ''
					};
				}
			});
		}, 1500);
		
		// 判断是否还有更多数据
		hasMore.value = mockData.length === pageSize.value;
		currentPage.value = page;
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
onLoad((options: any) => {
	// 从路由参数获取cityId（如果有）
	if (options?.cityId) {
		cityId.value = options.cityId;
	}
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

