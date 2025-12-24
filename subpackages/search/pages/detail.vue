<template>
	<view class="page">
		<customNavBar :showBackButton="true" :autoBack="true" title="酒店详情"></customNavBar>
		<!-- 加载状态 -->

		<view class="detail-container" :style="{ paddingTop: `${utils.totalSafeAreaHeight}px` }">
			<view class="loading-wrapper" v-if="isLoading">
				<text class="loading-text">加载中...</text>
			</view>
			<!-- 酒店详情内容 -->
			<view class="detail-content" v-else-if="hotelDetail">
				<!-- 图片轮播区域 -->
				<view class="image-swiper-wrapper">
					<up-swiper 
						:circular="true" 
						:indicatorMode="'dot'"
						:indicatorStyle="{ bottom: '80rpx', right: '20rpx' }" 
						:indicator="true" 
						height="500rpx"
						:list="hotelImagesList" 
						mode="aspectFill"
						@change="onSwiperChange">
					</up-swiper>
					
					<!-- 图片页码 -->
					<!-- <view class="swiper-indicator">
						<text class="indicator-text">{{ currentImageIndex + 1 }}/{{ hotelImages.length }}</text>
					</view> -->
				</view>

				<!-- 会员专享礼遇区域 -->
				<!-- <view class="member-benefits">
					<view class="benefits-header">
						<view class="benefits-title">
							<text class="title-main">会员专享礼遇</text>
							<text class="title-sub">秒懂专享价</text>
						</view>
						<view class="more-benefits-btn" @click="handleMoreBenefits">
							<text>更多会员权益<uni-icons type="right" size="16" color="#d4ab62"></uni-icons></text>
						</view>
					</view>
					<view class="benefits-list">
						<view v-for="(benefit, index) in memberBenefits" :key="index" class="benefit-item">
							<view class="benefit-icon">
								<uni-icons :type="benefit.icon" size="20" color="#d4ab62"></uni-icons>
							</view>
							<text class="benefit-text">{{ benefit.text }}</text>
						</view>
					</view>
				</view> -->

				<!-- 酒店基本信息 -->
				<view class="hotel-info">
					<!-- 专享价标签 -->
					<view class="exclusive-tag" v-if="hotelDetail.exclusivePrice">
						<view class="exclusive-tag-content">
							<text class="tag-text">专享价</text>
							<text class="tag-offer" v-if="hotelDetail.exclusiveOffer">{{ hotelDetail.exclusiveOffer
							}}</text>
						</view>
						<view class="exclusive-action-link">
							<text>优惠</text>
							<uni-icons type="right" size="16" color="#caa261"></uni-icons>
						</view>
					</view>

					<!-- 酒店名称 -->
					<view class="hotel-name-section">
						<view class="hotel-name-row">
							<text class="hotel-name-cn">{{ hotelDetail.name }}</text>
							<view class="hotel-detail-link" @click="handleDetails">
								<text>详情</text>
								<uni-icons type="right" size="16" color="#999"></uni-icons>
							</view>
						</view>
						<view class="hotel-name-row">
							<text class="hotel-name-en" v-if="hotelDetail.nameEn">{{ hotelDetail.nameEn }}</text>
							<view class="hotel-brand-link" v-if="hotelDetail.brand" @click="handleBrand">
								<text>{{ hotelDetail.brand }}</text>
								<uni-icons type="right" size="16" color="#999"></uni-icons>
							</view>
						</view>
					</view>

					<!-- 特色标签 -->
					<view class="hotel-features" v-if="hotelDetail.features && hotelDetail.features.length > 0">
						<view v-for="(feature, index) in hotelDetail.features" :key="index" class="feature-tag">
							<text>{{ feature }}</text>
						</view>
					</view>

					<!-- 地址和电话 -->
					<view class="hotel-contact">
						<view class="contact-item" v-if="hotelDetail.address">
							<uni-icons type="location" size="16" color="#666"></uni-icons>
							<text class="contact-text">{{ hotelDetail.address }}</text>
						</view>
						<view class="contact-item" v-if="hotelDetail.phone">
							<uni-icons type="phone" size="16" color="#666"></uni-icons>
							<text class="contact-text">{{ hotelDetail.phone }}</text>
						</view>
					</view>

					<!-- 右侧操作链接 -->
					<!-- <view class="hotel-actions">
					<view class="action-link" @click="handleOffers">
						<text>优惠 ></text>
					</view>
					<view class="action-link" @click="handleDetails">
						<text>详情 ></text>
					</view>
					<view class="action-link" v-if="hotelDetail.brand" @click="handleBrand">
						<text>{{ hotelDetail.brand }} ></text>
					</view>
				</view> -->
				</view>
			</view>

			<!-- 空状态 -->
			<view class="empty-state" v-else>
				<text class="empty-text">酒店信息不存在</text>
			</view>

			<!-- 预订信息 -->
			<view class="booking-info" v-if="hotelDetail && !isLoading">
				<view class="booking-dates">
					<view  @click="handleOpenCalendar" class="booking-dates-time">
						<ChooseTimeData :height="100"></ChooseTimeData>
					</view>
					<view class="booking-dates-line"></view>
					<view class="booking-dates-person">
						<personCounter></personCounter>
					</view>
				</view>
				<!-- 酒店房型加载中 -->
				<view v-if="isLoadingRoomList" class="room-loading-wrapper">
					<text class="room-loading-text">房型加载中...</text>
				</view>
				<!-- 酒店房型信息（加载完成后展示） -->
				<view class="hotel-room-info" v-else-if="roomList && roomList.length > 0">
					<HotelRoomItem :roomList="roomList" @clickRoom="handleClickRoom"></HotelRoomItem>
				</view>
				<!-- 房型列表为空时的提示 -->
				<view v-else class="room-empty-wrapper">
					<text class="room-empty-text">暂无可用房型</text>
				</view>
			</view>
		</view>

		<!-- 酒店详情弹窗 -->
		<up-popup 
			:show="showHotelInfoModal" 
			mode="center" 
			round="20"
			@close="showHotelInfoModal = false"
		>
			<view class="hotel-info-modal" v-if="hotelInfoForModal">
				<!-- 标题行：名称 + 关闭 -->
				<view class="modal-header">
					<view class="modal-title-wrapper">
						<text class="modal-title">{{ hotelInfoForModal.name }}</text>
						<text class="modal-title-en" v-if="hotelInfoForModal.nameEn">{{ hotelInfoForModal.nameEn }}</text>
					</view>
					<view class="modal-close" @click="showHotelInfoModal = false">
						<uni-icons type="close" size="20" color="#999"></uni-icons>
					</view>
				</view>

				<!-- 关键信息标签 -->
				<view class="modal-tags">
					<view class="modal-tag" v-if="hotelInfoForModal.brandName || hotelInfoForModal.brand">
						<text>{{ hotelInfoForModal.brandName || hotelInfoForModal.brand }}</text>
					</view>
					<view class="modal-tag" v-if="hotelInfoForModal.groupName">
						<text>{{ hotelInfoForModal.groupName }}</text>
					</view>
					<view class="modal-tag" v-if="hotelInfoForModal.rating">
						<text>评分 {{ hotelInfoForModal.rating }}</text>
					</view>
					<view class="modal-tag" v-if="hotelInfoForModal.exclusivePrice">
						<text>会员专享价</text>
					</view>
				</view>

				<!-- 位置信息 -->
				<view class="modal-section" v-if="hotelInfoForModal.cityPath || hotelInfoForModal.cityName">
					<view class="modal-section-title">
						<text>位置信息</text>
					</view>
					<view class="modal-section-item" v-if="hotelInfoForModal.cityPath">
						<uni-icons type="location" size="18" color="#666"></uni-icons>
						<text class="modal-section-text">{{ hotelInfoForModal.cityPath }}</text>
					</view>
					<view class="modal-section-item" v-if="hotelInfoForModal.cityName">
						<text class="modal-section-label">城市：</text>
						<text class="modal-section-text">{{ hotelInfoForModal.cityName }}</text>
						<text class="modal-section-text-en" v-if="hotelInfoForModal.cityEnName">({{ hotelInfoForModal.cityEnName }})</text>
					</view>
				</view>

				<!-- 地址信息 -->
				<view class="modal-section" v-if="hotelInfoForModal.address || hotelInfoForModal.addressEn">
					<view class="modal-section-title">
						<text>地址信息</text>
					</view>
					<view class="modal-section-item" v-if="hotelInfoForModal.address">
						<uni-icons type="location" size="18" color="#666"></uni-icons>
						<text class="modal-section-text">{{ hotelInfoForModal.address }}</text>
					</view>
					<view class="modal-section-item" v-if="hotelInfoForModal.addressEn">
						<text class="modal-section-text-en">{{ hotelInfoForModal.addressEn }}</text>
					</view>
				</view>

				<!-- 联系方式 -->
				<view class="modal-section" v-if="hotelInfoForModal.phone || hotelInfoForModal.email">
					<view class="modal-section-title">
						<text>联系方式</text>
					</view>
					<view class="modal-section-item" v-if="hotelInfoForModal.phone">
						<uni-icons type="phone" size="18" color="#666"></uni-icons>
						<text class="modal-section-text">{{ hotelInfoForModal.phone }}</text>
					</view>
					<view class="modal-section-item" v-if="hotelInfoForModal.email">
						<uni-icons type="email" size="18" color="#666"></uni-icons>
						<text class="modal-section-text">{{ hotelInfoForModal.email }}</text>
					</view>
				</view>

				<!-- 品牌信息 -->
				<view class="modal-section" v-if="hotelInfoForModal.brandName || hotelInfoForModal.brandEnName || hotelInfoForModal.groupName || hotelInfoForModal.groupEnName">
					<view class="modal-section-title">
						<text>品牌信息</text>
					</view>
					<view class="modal-info-row" v-if="hotelInfoForModal.brandName">
						<text class="modal-info-label">品牌：</text>
						<text class="modal-info-value">{{ hotelInfoForModal.brandName }}</text>
						<text class="modal-info-value-en" v-if="hotelInfoForModal.brandEnName">({{ hotelInfoForModal.brandEnName }})</text>
					</view>
					<view class="modal-info-row" v-if="hotelInfoForModal.groupName">
						<text class="modal-info-label">集团：</text>
						<text class="modal-info-value">{{ hotelInfoForModal.groupName }}</text>
						<text class="modal-info-value-en" v-if="hotelInfoForModal.groupEnName">({{ hotelInfoForModal.groupEnName }})</text>
					</view>
				</view>

				<!-- 坐标信息 -->
				<view class="modal-section" v-if="hotelInfoForModal.latitude || hotelInfoForModal.longitude">
					<view class="modal-section-title">
						<text>地理位置</text>
					</view>
					<view class="modal-info-row">
						<text class="modal-info-label">经纬度：</text>
						<text class="modal-info-value" v-if="hotelInfoForModal.latitude && hotelInfoForModal.longitude">
							{{ hotelInfoForModal.latitude }}, {{ hotelInfoForModal.longitude }}
						</text>
					</view>
				</view>

				<!-- 特色标签 -->
				<view class="modal-section" v-if="hotelInfoForModal.features && hotelInfoForModal.features.length">
					<view class="modal-section-title">
						<text>酒店亮点</text>
					</view>
					<view class="modal-feature-list">
						<view 
							v-for="(feature, index) in hotelInfoForModal.features" 
							:key="index"
							class="modal-feature-item"
						>
							<text>{{ feature }}</text>
						</view>
					</view>
				</view>

				<!-- 简介 -->
				<view class="modal-section" v-if="hotelInfoForModal.content || hotelInfoForModal.description">
					<view class="modal-section-title">
						<text>酒店简介</text>
					</view>
					<view class="modal-description">
						<text>{{ hotelInfoForModal.content || hotelInfoForModal.description }}</text>
					</view>
				</view>

				<!-- 建筑信息 -->
				<view class="modal-section" v-if="hotelInfoForModal.buildInfo">
					<view class="modal-section-title">
						<text>建筑信息</text>
					</view>
					<view class="modal-description">
						<text>{{ hotelInfoForModal.buildInfo }}</text>
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
import { onLoad } from '@dcloudio/uni-app';
import { useHotelSearchStore } from '@/store/useHotelSearchStore';
import dayjs from 'dayjs';
import customNavBar from '@/components/custom-nav-bar/index.vue';
import ChooseTimeData from '@/components/choose-time-data/index.vue';
import CalendarPopup from '@/components/calendar-popup/index.vue';
import HotelRoomItem from '@/components/hotel-room-item/index.vue';
import personCounter from '@/components/person-counter/index.vue';
import utils from '@/utils/utils';
import Hotel from '@/api/hotel';
import Home from '@/api/home';
const hotelSearchStore = useHotelSearchStore();

// 日历弹窗显示状态（响应式）
const calendarShow = computed({
	get: () => hotelSearchStore.calendarShow,
	set: (val) => hotelSearchStore.setCalendarShow(val)
});

// 酒店ID
const hotelId = ref<string>('');
// 酒店详情数据
const hotelDetail = ref<any>(null);
// 房型列表数据
const roomList = ref<any[]>([]);
// 加载状态
const isLoading = ref(false);
// 当前图片索引
const currentImageIndex = ref(0);

// 转换为 up-swiper 需要的格式
const hotelImagesList = computed(() => {
	return hotelImages.value;
});

// 会员权益列表
const memberBenefits = ref([
	{ icon: 'home', text: '客房升级' },
	{ icon: 'spoon', text: '每日早餐' },
	{ icon: 'clock', text: '延迟退房' },
	// { icon: 'wallet', text: '酒店积分' },
	// { icon: 'wallet', text: '酒店积分' },
	// { icon: 'wallet', text: '酒店积分' },
	// { icon: 'wallet', text: '酒店积分' },
	{ icon: 'gift', text: '消费抵扣' }
]);

// 获取日期
const checkInDate = computed(() => hotelSearchStore.getCheckInDate);
const checkOutDate = computed(() => hotelSearchStore.getCheckOutDate);
// 获取人数
const personCount = computed(() => hotelSearchStore.getPersonCount);

// 酒店图片列表
const hotelImages = computed(() => {
	if (!hotelDetail.value) return [];
	const images = hotelDetail.value.images || [];
	if (images.length === 0 && hotelDetail.value.image) {
		return [hotelDetail.value.image];
	}
	return images.length > 0 ? images : [
		'https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg'
	];
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

// 计算入住天数
const calculateNights = () => {
	if (!checkInDate.value || !checkOutDate.value) return 0;
	try {
		const checkIn = dayjs(checkInDate.value);
		const checkOut = dayjs(checkOutDate.value);
		return checkOut.diff(checkIn, 'day');
	} catch (e) {
		return 0;
	}
};

// 计算总价
const calculateTotalPrice = () => {
	if (!hotelDetail.value || !hotelDetail.value.price) return '0';
	const nights = calculateNights();
	const price = parseFloat(hotelDetail.value.price) || 0;
	return String(Math.round(price * nights));
};

// 酒店信息弹窗显示状态
const showHotelInfoModal = ref(false);

// 计算弹窗中展示的酒店信息（优先使用当前详情）
const hotelInfoForModal = computed(() => {
	return hotelDetail.value || hotelSearchStore.getHotelDetail || null;
});

// 加载酒店详情（不使用本地缓存兜底，避免出现错乱的酒店信息）
const loadHotelDetail = async (id: string) => {
	if (isLoading.value) return;

	isLoading.value = true;

	try {
		// 调用实际的酒店详情 API
		const { data } = await Hotel.getHotelById({
			hotelId: id
		} as any);

		if (data?.success && data.data) {
			// 存储到本地 ref
			hotelDetail.value = data.data;
			// 同时存储到 store 中（作为下次进入的初始值，而不是兜底）
			hotelSearchStore.setHotelDetail(data.data);
			console.log('酒店详情已加载并存储:', data.data);
		} else {
			throw new Error(data?.message || '获取酒店详情失败');
		}
	} catch (error: any) {
		console.error('加载失败:', error);
		uni.showToast({
			title: error?.message || '加载失败，请重试',
			icon: 'none'
		});
		// 加载失败时不再使用缓存，避免展示错误酒店信息
	} finally {
		isLoading.value = false;
	}
};

// 加载房型列表
const isLoadingRoomList = ref(false);
const loadRoomList = async () => {
	if (!hotelId.value || !checkInDate.value || !checkOutDate.value) {
		return;
	}

	if (isLoadingRoomList.value) return;

	isLoadingRoomList.value = true;

	try {
		const { data } = await Home.getHotelRatePlanDetail({
			hotelId: hotelId.value,
			checkin: checkInDate.value,
			checkout: checkOutDate.value,
			adultNum: personCount.value
		} as any);

		if (data?.success && Array.isArray(data.data)) {
			// 处理房型数据，添加折叠状态等
			roomList.value = data.data.map((item: any) => {
				return {
					...item,
					foldingShow: false // 默认折叠
				};
			});
			console.log('房型列表已加载:', roomList.value);
		} else {
			roomList.value = [];
			console.warn('获取房型列表失败:', data?.message || '未知错误');
		}
	} catch (error: any) {
		console.error('加载房型列表异常:', error);
		roomList.value = [];
	} finally {
		isLoadingRoomList.value = false;
	}
};

// 防抖函数
const debounce = (fn: Function, delay: number) => {
	let timer: any = null;
	return function(...args: any[]) {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			fn.apply(this, args);
		}, delay);
	};
};

// 防抖后的加载房型列表函数（用于人数变化）
const debouncedLoadRoomList = debounce(loadRoomList, 500);

// 监听日期变化，重新加载房型列表
const isInitialized = ref(false);
watch([checkInDate, checkOutDate], ([newCheckIn, newCheckOut], [oldCheckIn, oldCheckOut]) => {
	// 避免初始化时触发
	if (!isInitialized.value) {
		isInitialized.value = true;
		return;
	}
	
	// 只有当日期真正发生变化且都有值时才重新加载
	if (newCheckIn && newCheckOut && (newCheckIn !== oldCheckIn || newCheckOut !== oldCheckOut)) {
		loadRoomList();
	}
}, { immediate: false });

// 监听人数变化，使用防抖重新加载房型列表
watch(personCount, (newCount, oldCount) => {
	// 避免初始化时触发
	if (!isInitialized.value) {
		return;
	}
	
	// 只有当人数真正发生变化时才重新加载
	if (newCount !== oldCount) {
		debouncedLoadRoomList();
	}
}, { immediate: false });

// 轮播图切换
const onSwiperChange = (e: any) => {
	// up-swiper 的 change 事件可能返回索引或对象，需要根据实际情况处理
	if (typeof e === 'number') {
		currentImageIndex.value = e;
	} else if (e && typeof e === 'object' && e.current !== undefined) {
		currentImageIndex.value = e.current;
	} else if (e && typeof e === 'object' && e.detail && e.detail.current !== undefined) {
		currentImageIndex.value = e.detail.current;
	} else {
		currentImageIndex.value = 0;
	}
};

// 返回
const handleBack = () => {
	uni.navigateBack();
};

// 分享
const handleShare = () => {
	// TODO: 实现分享功能
	uni.showToast({
		title: '分享功能开发中',
		icon: 'none'
	});
};

// 更多
const handleMore = () => {
	// TODO: 实现更多功能
	uni.showToast({
		title: '更多功能开发中',
		icon: 'none'
	});
};

// 更多会员权益
const handleMoreBenefits = () => {
	// TODO: 跳转到会员权益页面
	uni.showToast({
		title: '会员权益页面开发中',
		icon: 'none'
	});
};

// 优惠
const handleOffers = () => {
	// TODO: 跳转到优惠页面
	uni.showToast({
		title: '优惠页面开发中',
		icon: 'none'
	});
};

// 详情：打开酒店信息弹窗
const handleDetails = () => {
	if (!hotelInfoForModal.value) {
		uni.showToast({
			title: '暂无酒店详情信息',
			icon: 'none'
		});
		return;
	}
	showHotelInfoModal.value = true;
};

// 品牌
const handleBrand = () => {
	// TODO: 跳转到品牌页面
	uni.showToast({
		title: '品牌页面开发中',
		icon: 'none'
	});
};

// 立即预订
// 打开日历弹窗
const handleOpenCalendar = () => {
	hotelSearchStore.setCalendarShow(true);
};

// 点击房型
const handleClickRoom = (data: any) => {
	console.log('点击房型:', data);
	
	// 新格式：{ room, detail }
	if (!data || !data.room || !data.detail) {
		uni.showToast({
			title: '数据格式错误',
			icon: 'none'
		});
		return;
	}

	const room = data.room;
	const detail = data.detail;

	// 存储房型基本信息 + 选中的价格方案（detail）
	try {
		// 存储房型基本信息（不包含 hotelRoomDetails）
		const roomInfo = {
			id: room.id,
			name: room.name,
			nameEn: room.nameEn,
			image: room.image,
			formatImages: room.formatImages,
			formatAmenities: room.formatAmenities,
			amenities: room.amenities,
			hotelId: room.hotelId
		};
		
		// 存储选中的价格方案（detail）
		const selectedRate = detail;
		
		// 使用固定的 key 存储，每次覆盖
		uni.setStorageSync('booking_roomInfo', {
			roomInfo: roomInfo,
			selectedRate: selectedRate
		});
		
		// 直接跳转，不需要传递参数
		uni.navigateTo({
			url: `/subpackages/search/pages/booking`
		});
	} catch (e) {
		console.error('存储预订数据失败:', e);
		uni.showToast({
			title: '数据存储失败，请重试',
			icon: 'none'
		});
	}
};

const handleBook = () => {
	if (!hotelDetail.value) return;

	// TODO: 跳转到预订页面或调用预订API
	uni.showToast({
		title: '预订功能开发中',
		icon: 'none'
	});

	// 示例：跳转到预订页面
	// uni.navigateTo({
	// 	url: `/subpackages/booking/pages/index?id=${hotelDetail.value.id}`
	// });
};

// 页面加载
onLoad(async (options) => {
	if (options.id) {
		hotelId.value = options.id;
		await loadHotelDetail(options.id);
		// 加载完酒店详情后，加载房型列表
		await loadRoomList();
		// 标记已初始化，允许后续日期和人数变化触发重新加载
		isInitialized.value = true;
	} else {
		uni.showToast({
			title: '参数错误',
			icon: 'none'
		});
		setTimeout(() => {
			uni.navigateBack();
		}, 1500);
	}
});
</script>

<style scoped lang="scss">
.page {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 120rpx; // 为底部按钮留出空间

	.loading-wrapper {
		padding: 80rpx 0;
		text-align: center;

		.loading-text {
			font-size: 28rpx;
			color: #999;
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

	.detail-content {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	// 图片轮播区域
	.image-swiper-wrapper {
		position: relative;
		width: 100%;
		height: 500rpx;
		overflow: hidden;

		.swiper-header {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx;
			padding-top: calc(20rpx + env(safe-area-inset-top));
			z-index: 10;

			.header-left {
				width: 60rpx;
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				background-color: rgba(0, 0, 0, 0.3);
				border-radius: 50%;
				backdrop-filter: blur(10rpx);
			}

			.header-right {
				display: flex;
				align-items: center;
				gap: 20rpx;

				.header-icon {
					width: 60rpx;
					height: 60rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: rgba(0, 0, 0, 0.3);
					border-radius: 50%;
					backdrop-filter: blur(10rpx);
				}
			}
		}

		.swiper-indicator {
			position: absolute;
			bottom: 20rpx;
			right: 20rpx;
			background-color: rgba(0, 0, 0, 0.5);
			padding: 8rpx 20rpx;
			border-radius: 30rpx;
			backdrop-filter: blur(10rpx);

			.indicator-text {
				font-size: 24rpx;
				color: #fff;
			}
		}
	}

	// 会员专享礼遇区域
	.member-benefits {
		background: linear-gradient(135deg, #f5e6d3 0%, #f0dcc0 100%);
		padding: 20rpx 20rpx 40rpx 20rpx;
		// margin: 0;
		border-radius: 30rpx 30rpx 0 0;
		margin-top: -50rpx;
		z-index: 1;

		.benefits-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 10rpx;

			.benefits-title {
				display: flex;
				// flex-direction: column;
				gap: 8rpx;
				justify-content: start;
				align-items: center;

				.title-main {
					font-size: 36rpx;
					font-weight: bold;
					color: #a66906;
				}

				.title-sub {
					font-size: 24rpx;
					color: #666;
					margin-left: 20rpx;
					color: #cda66a;
				}
			}

			.more-benefits-btn {
				// padding: 12rpx 24rpx;
				padding: 5rpx 30rpx;

				// background-color: #b37e29;
				// 渐变
				background: linear-gradient(135deg, #d4ab62 0%, #b37e29 100%);
				border-radius: 30rpx;

				text {
					font-size: 24rpx;
					color: #fff;
					font-weight: bold;
					letter-spacing: 3rpx;
				}
			}
		}

		.benefits-list {
			display: flex;
			align-items: center;
			justify-content: flex-start;
			gap: 20rpx;
			flex-wrap: wrap;

			.benefit-item {
				flex: 0 0 auto;
				min-width: calc(20% - 16rpx);
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 10rpx;

				.benefit-icon {
					width: 60rpx;
					height: 60rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: rgba(255, 255, 255, 0.8);
					border-radius: 50%;
				}

				.benefit-text {
					font-size: 22rpx;
					color: #a46500;
					font-weight: bold;
					text-align: center;
				}
			}
		}
	}

	// 酒店基本信息
	.hotel-info {
		background-color: #fff;
		padding: 30rpx 20rpx;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		margin-top: -30rpx;
		border-radius: 30rpx;
		z-index: 1;

		.exclusive-tag {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			gap: 20rpx;

			.exclusive-tag-content {
				gap: 10rpx;
				padding: 8rpx 20rpx;
				background: linear-gradient(135deg, #d4ab62 0%, #b37e29 100%);
				border-radius: 8rpx;
				width: fit-content;
				flex-shrink: 0;
				display: flex;
				align-items: center;
				gap: 10rpx;

				.tag-text {
					font-size: 24rpx;
					color: #fff;
					font-weight: 500;
				}

				.tag-offer {
					font-size: 24rpx;
					color: #fff;
				}
			}

			.exclusive-action-link {
				font-size: 24rpx;
				color: #caa261;
				display: inline-flex;
				flex-direction: row;
				flex-wrap: nowrap;
				gap: 5rpx;
				justify-content: flex-end;
				align-items: center;
				white-space: nowrap;
				flex-shrink: 0;
				min-width: fit-content;

				text {
					white-space: nowrap;
					display: inline-block;
					flex-shrink: 0;
				}
			}
		}

		.hotel-name-section {
			display: flex;
			flex-direction: column;
			gap: 8rpx;

			.hotel-name-row {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				gap: 20rpx;
			}

			.hotel-name-cn {
				font-size: 40rpx;
				font-weight: bold;
				color: #333;
				line-height: 1.4;
				flex: 1;
			}

			.hotel-name-en {
				font-size: 28rpx;
				color: #666;
				line-height: 1.4;
				flex: 1;
			}

			.hotel-detail-link {
				font-size: 24rpx;
				color: #999;
				display: inline-flex;
				flex-direction: row;
				flex-wrap: nowrap;
				gap: 5rpx;
				justify-content: flex-end;
				align-items: center;
				white-space: nowrap;
				flex-shrink: 0;
				min-width: fit-content;

				text {
					white-space: nowrap;
					display: inline-block;
					flex-shrink: 0;
				}
			}

			.hotel-brand-link {
				font-size: 24rpx;
				color: #999;
				display: inline-flex;
				flex-direction: row;
				flex-wrap: nowrap;
				gap: 5rpx;
				justify-content: flex-end;
				align-items: center;
				white-space: nowrap;
				flex-shrink: 0;
				min-width: fit-content;

				text {
					white-space: nowrap;
					display: inline-block;
					flex-shrink: 0;
				}
			}
		}

		.hotel-features {
			display: flex;
			flex-wrap: wrap;
			gap: 10rpx;

			.feature-tag {
				padding: 6rpx 16rpx;
				background-color: #f5f5f5;
				border-radius: 6rpx;

				text {
					font-size: 22rpx;
					color: #666;
				}
			}
		}

		.hotel-contact {
			display: flex;
			// flex-direction: column;
			gap: 12rpx;

			.contact-item {
				display: flex;
				align-items: center;
				gap: 10rpx;

				.contact-text {
					font-size: 26rpx;
					color: #666;
					line-height: 1.5;
				}
			}
		}

		.hotel-actions {
			display: flex;
			align-items: center;
			gap: 30rpx;
			margin-top: 10rpx;

			.action-link {
				text {
					font-size: 26rpx;
					color: #007aff;
				}
			}
		}
	}

	// 预订信息
	.booking-info {
		margin-top: 30rpx;
		border-radius: 30rpx;
		background-color: #fff;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		gap: 20rpx;

		.room-loading-wrapper {
			width: 100%;
			margin-top: 30rpx;
			padding: 40rpx 0;
			text-align: center;
		}

		.room-loading-text {
			font-size: 26rpx;
			color: #999;
		}

		.room-empty-wrapper {
			width: 100%;
			margin-top: 30rpx;
			padding: 40rpx 0;
			text-align: center;
		}

		.room-empty-text {
			font-size: 26rpx;
			color: #999;
		}

		.hotel-room-info {
			width: 100%;
		}

		.booking-info-title {
			font-size: 30rpx;
			font-weight: 500;
			color: #333;
		}

		.booking-dates {
			display: flex;
			width: 100%;
			height: 100rpx;
			justify-content: space-between;
			align-items: stretch;
			border-bottom: 1rpx solid #e5e5e5;

			.booking-dates-time {
				flex: 1;
			}

			.booking-dates-line {
				width: 0;
				height: 50rpx;
				align-self: center;
				border-left: 1rpx solid #e2e0e0;
				flex-shrink: 0;
				margin-right: 10rpx;
				margin-left: 10rpx;
			}

			.booking-dates-person {
				width: 200rpx;
				flex-shrink: 0;
			}

			// ChooseTimeData 组件样式
			:deep(.choose-time-data) {
				width: 100%;
				height: 100%;
			}
		}
	}

	// 酒店详情弹窗
	.hotel-info-modal {
		width: 640rpx;
		max-height: 80vh;
		background-color: #fff;
		border-radius: 24rpx;
		padding: 30rpx 30rpx 40rpx 30rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
		overflow-y: auto;

		.modal-header {
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			gap: 20rpx;
			margin-bottom: 10rpx;

			.modal-title-wrapper {
				flex: 1;
				min-width: 0;
				display: flex;
				flex-direction: column;
				gap: 6rpx;

				.modal-title {
					font-size: 34rpx;
					font-weight: bold;
					color: #333;
					line-height: 1.4;
				}

				.modal-title-en {
					font-size: 24rpx;
					color: #999;
					line-height: 1.4;
				}
			}

			.modal-close {
				width: 48rpx;
				height: 48rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 24rpx;
				background-color: #f5f5f5;
			}
		}

		.modal-tags {
			display: flex;
			flex-wrap: wrap;
			gap: 12rpx;
			margin-bottom: 4rpx;

			.modal-tag {
				padding: 6rpx 14rpx;
				background-color: #f7f2e7;
				border-radius: 999rpx;

				text {
					font-size: 22rpx;
					color: #a57a19;
				}
			}
		}

		.modal-section {
			display: flex;
			flex-direction: column;
			gap: 10rpx;

			& + .modal-section {
				margin-top: 8rpx;
			}

			.modal-section-title {
				font-size: 26rpx;
				color: #333;
				font-weight: 500;
			}

			.modal-section-item {
				display: flex;
				flex-direction: row;
				align-items: flex-start;
				gap: 10rpx;

				.modal-section-label {
					font-size: 24rpx;
					color: #999;
					flex-shrink: 0;
				}

				.modal-section-text {
					font-size: 24rpx;
					color: #666;
					line-height: 1.5;
					flex: 1;
					word-break: break-word;
				}

				.modal-section-text-en {
					font-size: 22rpx;
					color: #999;
					line-height: 1.5;
					flex: 1;
					word-break: break-word;
					margin-top: 4rpx;
				}
			}

			.modal-info-row {
				display: flex;
				flex-direction: row;
				align-items: flex-start;
				gap: 8rpx;
				margin-bottom: 8rpx;

				.modal-info-label {
					font-size: 24rpx;
					color: #999;
					flex-shrink: 0;
				}

				.modal-info-value {
					font-size: 24rpx;
					color: #333;
					line-height: 1.5;
					flex: 1;
				}

				.modal-info-value-en {
					font-size: 22rpx;
					color: #999;
					line-height: 1.5;
				}
			}

			.modal-feature-list {
				display: flex;
				flex-wrap: wrap;
				gap: 10rpx;

				.modal-feature-item {
					padding: 6rpx 14rpx;
					background-color: #f5f5f5;
					border-radius: 999rpx;

					text {
						font-size: 22rpx;
						color: #666;
					}
				}
			}

			.modal-description {
				max-height: 260rpx;
				overflow-y: auto;
				padding-right: 6rpx;

				text {
					font-size: 24rpx;
					color: #666;
					line-height: 1.6;
				}
			}
		}
	}

	// 底部预订栏
	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #fff;
		padding: 20rpx;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20rpx;
		z-index: 100;

		.price-info {
			display: flex;
			flex-direction: column;
			gap: 5rpx;

			.total-price-label {
				font-size: 24rpx;
				color: #999;
			}

			.total-price {
				display: flex;
				align-items: baseline;
				gap: 4rpx;

				.price-symbol {
					font-size: 24rpx;
					font-weight: bold;
					color: #ff6b35;
				}

				.price-value {
					font-size: 36rpx;
					font-weight: bold;
					color: #ff6b35;
				}
			}
		}

		.book-button {
			flex: 1;
			background: linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%);
			border-radius: 50rpx;
			padding: 24rpx 0;
			text-align: center;
			transition: opacity 0.2s;

			&:active {
				opacity: 0.8;
			}

			.book-button-text {
				font-size: 32rpx;
				font-weight: 500;
				color: #fff;
			}
		}
	}
}
</style>
