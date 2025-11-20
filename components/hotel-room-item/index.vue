<script setup lang="ts">
import { computed, ref } from 'vue';
import HotelRoomDetails from '@/components/hotel-room-details/index.vue';

interface RoomItem {
	id: string;
	name: string;
	nameEn: string;
	image: string;
	formatImages: string[];
	formatAmenities: Array<{
		text: string;
		value: string | null;
	}>;
	hotelRoomDetails: Array<{
		id: string;
		rateId?: string;
		name: string;
		totalPriceCny: number;
		priceUnit: string;
		breakfast: number;
	}>;
}

interface Props {
	roomList?: RoomItem[];
}

// 默认假数据
const defaultRoomList: RoomItem[] = [
	{
		id: '6010291',
		name: '艺术家客房（面积36平）',
		nameEn: 'BEST AVAILABLE RATE - BED AND BREAKFAST - ARTIST ROOM',
		image: 'https://cdn.youxiatrip.com/file/1746777609439.jpg',
		formatImages: [
			'https://cdn.youxiatrip.com/file/1746777609439.jpg',
			'https://cdn.youxiatrip.com/file/1747878145243.jpg'
		],
		formatAmenities: [
			{ text: '面积', value: '36m²' },
			{ text: '大床', value: '1.8m' },
			{ text: '人数', value: '2人' }
		],
		hotelRoomDetails: [
			{
				id: '6693738',
				name: '特价优惠',
				totalPriceCny: 6752.91,
				priceUnit: 'CNY',
				breakfast: 0
			},
			{
				id: '5208590',
				name: '尊享价格',
				totalPriceCny: 13376.5,
				priceUnit: 'CNY',
				breakfast: 1
			}
		]
	},
	{
		id: '6010294',
		name: '豪华典藏客房（特大床或双床/面积40平）',
		nameEn: 'BEST AVAILABLE RATE - ROOM ONLY - UNLIMITED SPA DELUXE COLLECTION ROOM',
		image: 'https://cdn.youxiatrip.com/file/1747878526926.jpg',
		formatImages: [
			'https://cdn.youxiatrip.com/file/1747878526926.jpg',
			'https://cdn.youxiatrip.com/file/1747878507620.jpg'
		],
		formatAmenities: [
			{ text: '面积', value: '40m²' },
			{ text: '大床', value: '2.0m' },
			{ text: '人数', value: '2人' },
			{ text: '景观', value: '城市景观' }
		],
		hotelRoomDetails: [
			{
				id: '6693740',
				name: '特价优惠',
				totalPriceCny: 7580.86,
				priceUnit: 'CNY',
				breakfast: 0
			},
			{
				id: '3002100',
				name: '尊享价格',
				totalPriceCny: 14618.44,
				priceUnit: 'CNY',
				breakfast: 1
			}
		]
	},
	{
		id: '6010300',
		name: '行政客房（特大床或双床/面积45平）',
		nameEn: 'BEST AVAILABLE RATE - BED AND BREAKFAST - EXECUTIVE ROOM',
		image: 'https://cdn.youxiatrip.com/file/1746783754336.jpg',
		formatImages: [
			'https://cdn.youxiatrip.com/file/1746783754336.jpg',
			'https://cdn.youxiatrip.com/file/1746783786851.jpg'
		],
		formatAmenities: [
			{ text: '面积', value: '45m²' },
			{ text: '大床', value: '2.0m' },
			{ text: '人数', value: '2人' },
			{ text: '可加床', value: '是' }
		],
		hotelRoomDetails: [
			{
				id: '6693739',
				name: '特价优惠',
				totalPriceCny: 8408.83,
				priceUnit: 'CNY',
				breakfast: 0
			},
			{
				id: '3002102',
				name: '尊享价格',
				totalPriceCny: 17350.7,
				priceUnit: 'CNY',
				breakfast: 1
			}
		]
	}
];

const props = withDefaults(defineProps<Props>(), {
	roomList: () => []
});

const emit = defineEmits(['clickRoom']);

// 使用传入的数据，如果为空则使用默认数据
const displayRoomList = computed(() => {
	return props.roomList && props.roomList.length > 0 ? props.roomList : defaultRoomList;
});

// 获取最低价格
const getLowestPrice = (room: RoomItem) => {
	if (!room.hotelRoomDetails || room.hotelRoomDetails.length === 0) {
		return null;
	}
	const prices = room.hotelRoomDetails.map(detail => detail.totalPriceCny);
	const minPrice = Math.min(...prices);
	const minDetail = room.hotelRoomDetails.find(detail => detail.totalPriceCny === minPrice);
	return {
		price: minPrice,
		unit: minDetail?.priceUnit || 'CNY',
		breakfast: minDetail?.breakfast || 0
	};
};

// 点击房型
const handleClickRoom = (room: RoomItem) => {
	emit('clickRoom', room);
};

// 获取房型主图
const getMainImage = (room: RoomItem) => {
	if (room.formatImages && room.formatImages.length > 0) {
		return room.formatImages[0];
	}
	if (room.image) {
		const images = room.image.split(',');
		return images[0] || '';
	}
	return '';
};

// 过滤有效的设施信息
const getValidAmenities = (amenities: Array<{ text: string; value: string | null }>) => {
	return amenities.filter(item => item.value && item.value !== '' && item.value !== 'undefinedm²');
};

// 折叠状态管理（每个房型独立）
const expandedRooms = ref<Set<string>>(new Set());

// 切换折叠状态
const toggleExpand = (roomId: string, event?: any) => {
	if (event) {
		event.stopPropagation(); // 阻止事件冒泡，避免触发房型点击
	}
	if (expandedRooms.value.has(roomId)) {
		expandedRooms.value.delete(roomId);
	} else {
		expandedRooms.value.add(roomId);
	}
};

// 判断是否展开
const isExpanded = (roomId: string) => {
	return expandedRooms.value.has(roomId);
};

// 处理价格详情预订
const handleDetailConfirm = (room: RoomItem, detail: any) => {
	emit('clickRoom', { room, detail });
};
</script>

<template>
    <!-- v-if="displayRoomList && displayRoomList.length > 0" -->
	<view class="hotel-room-list" >
		<view 
			v-for="room in displayRoomList" 
			:key="room.id" 
			class="room-item"
		>
			<view class="room-item-content">
				<!-- 左侧图片 -->
				<view class="room-item-left">
					<image 
						:src="getMainImage(room)" 
						mode="aspectFill" 
						class="room-image"
					></image>
				</view>
				
				<!-- 右侧内容区域（上下结构） -->
				<view class="room-item-right">
				<!-- 上半部分：房型信息 -->
				<view class="room-info-top">
					<!-- 房型名称 -->
					<view class="room-name-section">
						<text class="room-name">{{ room.name || '' }}</text>
					</view>
					<!-- 英文名 -->
					<view class="room-name-en" v-if="room.nameEn">
						<text>{{ room.nameEn }}</text>
					</view>
					<!-- 设施信息 -->
					<view class="room-amenities" v-if="getValidAmenities(room.formatAmenities || []).length > 0">
						<view 
							v-for="(amenity, index) in getValidAmenities(room.formatAmenities || [])" 
							:key="index"
							class="amenity-item"
						>
							<text>{{ amenity.text }}：{{ amenity.value }}</text>
						</view>
					</view>
				</view>
				
				<!-- 下半部分：价格和预订 -->
				<view class="room-info-bottom">
					<view v-if="getLowestPrice(room)" class="price-section">
						<!-- 左侧价格信息 -->
						<view class="price-info-left">
							<!-- 价格 -->
							<view class="room-price">
								<text class="price-unit">{{ getLowestPrice(room)?.unit || 'CNY' }}</text>
								<text class="price-value">{{ getLowestPrice(room)?.price || '--' }}</text>
							</view>
							<!-- 价格说明 -->
							<view class="price-desc">
								<text>起/每晚</text>
								<text>包含税金和额外费用</text>
							</view>
						</view>
						<!-- 右侧按钮：选择价格或立即预订 -->
						<view 
							v-if="room.hotelRoomDetails && room.hotelRoomDetails.length > 1"
							class="select-price-btn"
							@click.stop="toggleExpand(room.id, $event)"
						>
							<text>{{ isExpanded(room.id) ? '隐藏价格' : '选择价格' }}</text>
							<uni-icons 
								:type="isExpanded(room.id) ? 'up' : 'down'" 
								size="14" 
								color="#fff"
							></uni-icons>
						</view>
						<view v-else class="book-btn">
							<text>立即预订</text>
						</view>
					</view>
					<view v-else class="sold-out-wrapper">
						<view class="sold-out">
							<text>酒店满房</text>
						</view>
					</view>
				</view>
			</view>
			</view>
			<!-- 展开的价格详情列表（与整个 room-item 平齐） -->
			<view 
				class="price-details-wrapper"
				v-if="isExpanded(room.id) && room.hotelRoomDetails && room.hotelRoomDetails.length > 1"
			>
				<HotelRoomDetails 
					:roomDetails="room.hotelRoomDetails"
					:formatAmenities="room.formatAmenities || []"
					@confirm="(detail) => handleDetailConfirm(room, detail)"
				/>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.hotel-room-list {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.room-item {
	display: flex;
	flex-direction: column;
	min-height: 180rpx;
	margin-bottom: 20rpx;
	width: 100%;
	overflow: visible;
	background-color: #fff;
	border-radius: 12rpx;
	padding: 20rpx;
	box-sizing: border-box;
	
	.room-item-content {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}
}

.room-item-left {
	width: 240rpx;
	flex-shrink: 0;
	overflow: hidden;
	border-radius: 8rpx;
	align-self: stretch;
	display: flex;
	
	.room-image {
		width: 100%;
		height: 100%;
		display: block;
		object-fit: cover;
	}
}

.room-item-right {
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 0 20rpx;
	box-sizing: border-box;
	min-width: 0;
	justify-content: space-between;
	
	.room-info-top {
		display: flex;
		flex-direction: column;
		flex: 1;
		
		.room-name-section {
			width: 100%;
			font-size: 28rpx;
			margin-bottom: 8rpx;
			
			.room-name {
				font-size: 28rpx;
				font-weight: 500;
				color: #333;
				line-height: 1.4;
			}
		}
		
		.room-name-en {
			width: 100%;
			font-size: 24rpx;
			margin-bottom: 12rpx;
			color: #c8cacf;
			
			text {
				font-size: 24rpx;
				color: #c8cacf;
			}
		}
		
		.room-amenities {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 12rpx;
			align-items: center;
			
			.amenity-item {
				font-size: 24rpx;
				color: #7a7a7a;
				white-space: nowrap;
				
				text {
					font-size: 24rpx;
					color: #7a7a7a;
				}
			}
		}
	}
	
	.room-info-bottom {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-top: 20rpx;
		width: 100%;
		
		.price-section {
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: flex-end;
		}
		
		.price-info-left {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			min-width: 0;
		}
		
		.room-price {
			display: flex;
			justify-content: flex-start;
			align-items: baseline;
			margin-bottom: 8rpx;
			
			.price-unit {
				font-size: 24rpx;
				color: #333;
				margin-right: 4rpx;
			}
			
			.price-value {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
			}
		}
		
		.price-details-wrapper {
			width: 100%;
			margin-top: 20rpx;
			align-self: stretch;
			box-sizing: border-box;
		}
		
		.price-desc {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			margin-top: 5rpx;
			
			text {
				font-size: 22rpx;
				color: #c4c4c4;
				letter-spacing: 1rpx;
			}
		}
		
		.book-btn {
			width: 130rpx;
			height: 60rpx;
			background-color: #000;
			color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 8rpx;
			font-size: 24rpx;
			flex-shrink: 0;
			margin-left: 20rpx;
			
			text {
				font-size: 24rpx;
				color: #fff;
			}
		}
		
		.select-price-btn {
			width: 150rpx;
			height: 60rpx;
			background-color: #000;
			color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 8rpx;
			font-size: 24rpx;
			flex-shrink: 0;
			margin-left: 20rpx;
			gap: 8rpx;
			
			text {
				font-size: 24rpx;
				color: #fff;
			}
		}
		
		.sold-out-wrapper {
			width: 100%;
			display: flex;
			justify-content: flex-end;
		}
		
		.sold-out {
			width: 130rpx;
			height: 60rpx;
			background-color: #fff;
			color: #000;
			border: 1rpx solid #969696;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 8rpx;
			position: relative;
			font-size: 24rpx;
			
			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(255, 255, 255, 0.6);
				backdrop-filter: blur(2rpx);
			}
			
			text {
				font-size: 24rpx;
				color: #000;
				position: relative;
				z-index: 1;
			}
		}
	}
}
</style>

