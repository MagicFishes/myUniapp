<script setup lang="ts">
import { computed, ref } from 'vue';

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
		totalPrice?: number;
		totalPriceCny?: number;
		priceUnit?: string;
		breakfast?: number;
	}>;
}

interface Props {
	roomList?: RoomItem[];
}

const props = withDefaults(defineProps<Props>(), {
	roomList: () => []
});

const emit = defineEmits(['clickRoom']);

// 获取最低价格
const getLowestPrice = (room: RoomItem) => {
	if (!room.hotelRoomDetails || room.hotelRoomDetails.length === 0) {
		return null;
	}
	const prices = room.hotelRoomDetails.map(detail => detail.totalPriceCny || detail.totalPrice || 0);
	const minPrice = Math.min(...prices);
	const minDetail = room.hotelRoomDetails.find(detail => (detail.totalPriceCny || detail.totalPrice || 0) === minPrice);
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
		event.stopPropagation(); // 阻止事件冒泡，避免触发其他事件
	}
	if (expandedRooms.value.has(roomId)) {
		expandedRooms.value.delete(roomId);
	} else {
		expandedRooms.value.add(roomId);
	}
};

// 处理整个item的点击（只有多个价格方案时才可点击）
const handleItemClick = (room: RoomItem, event?: any) => {
	if (room.hotelRoomDetails && room.hotelRoomDetails.length > 0) {
		toggleExpand(room.id, event);
	}
};

// 格式化价格显示
const formatPrice = (price: number): string => {
	if (!price || price === 0) return '--';
	return Number(price).toLocaleString('zh-CN', { maximumFractionDigits: 2 });
};

// 获取房间图片列表
const getRoomImages = (room: RoomItem): string[] => {
	if (room.formatImages && room.formatImages.length > 0) {
		return room.formatImages;
	}
	if (room.image) {
		const images = room.image.split(',').filter(img => img.trim());
		return images;
	}
	return [];
};

// 判断是否展开
const isExpanded = (roomId: string) => {
	return expandedRooms.value.has(roomId);
};

// 处理预订
const handleBook = (room: RoomItem, detail?: any) => {
	if (detail) {
		emit('clickRoom', { room, detail });
	} else {
		const lowestPriceDetail = room.hotelRoomDetails?.[0];
		if (lowestPriceDetail) {
			emit('clickRoom', { room, detail: lowestPriceDetail });
		} else {
			emit('clickRoom', room);
		}
	}
};

// 处理分享
const handleShare = (room: RoomItem, event?: any) => {
	if (event) {
		event.stopPropagation();
	}
	// TODO: 实现分享功能
	console.log('分享房间', room);
};

// 处理担保
const handleGuarantee = (room: RoomItem, event?: any) => {
	if (event) {
		event.stopPropagation();
	}
	// TODO: 实现担保功能
	console.log('担保房间', room);
};

// 轮播图当前索引
const currentImageIndex = ref<Record<string, number>>({});

// 设置轮播图索引
const setImageIndex = (roomId: string, e: any) => {
	// up-swiper 的 change 事件可能返回索引或对象，需要根据实际情况处理
	let index = 0;
	if (typeof e === 'number') {
		index = e;
	} else if (e && typeof e === 'object' && e.current !== undefined) {
		index = e.current;
	} else if (e && typeof e === 'object' && e.detail && e.detail.current !== undefined) {
		index = e.detail.current;
	}
	currentImageIndex.value[roomId] = index;
};

// 获取当前索引
const getCurrentIndex = (roomId: string) => {
	return currentImageIndex.value[roomId] || 0;
};
</script>

<template>
	<view class="hotel-room-list">
		<view 
			v-for="room in props.roomList" 
			:key="room.id" 
			class="room-item"
		>
			<!-- 上半部分：轮播图 -->
			<view class="room-image-section" v-if="getRoomImages(room).length > 0">
				<up-swiper 
					:circular="getRoomImages(room).length > 1"
					:indicatorMode="'dot'"
					:indicatorStyle="{ bottom: '20rpx', right: '20rpx' }"
					:indicator="getRoomImages(room).length > 1"
					height="400rpx"
					:list="getRoomImages(room)"
					mode="aspectFill"
					@change="(e) => setImageIndex(room.id, e)"
				></up-swiper>
			</view>
			
			<!-- 下半部分：信息区域 -->
			<view class="room-info-section">
				<!-- 主信息区域：左侧信息 + 右侧按钮 -->
				<view 
					class="room-info-main"
					:class="{ 'clickable': room.hotelRoomDetails && room.hotelRoomDetails.length > 0}"
					hover-class="none"
					hover-stop-propagation="true"
					@click="handleItemClick(room, $event)"
				>
					<!-- 左侧信息区域 -->
					<view class="room-info-left">
						<!-- 第一行：房型名称（左）和价格（右） -->
						<view class="room-info-row-first">
							<view class="room-name-wrapper">
								<text class="room-name">{{ room.name || '' }}</text>
							</view>
							<view class="room-price-wrapper" v-if="getLowestPrice(room)">
								<text class="price-symbol">¥</text>
								<text class="price-value">{{ formatPrice(getLowestPrice(room)?.price || 0) }}</text>
								<text class="price-suffix">起</text>
								<!-- 折叠箭头 -->
								<view 
									class="expand-arrow"
									:class="{ 'expanded': isExpanded(room.id) }"
									v-if="room.hotelRoomDetails && room.hotelRoomDetails.length > 0"
								>
									<uni-icons type="down" size="16" color="#999"></uni-icons>
								</view>
							</view>
						</view>
						
						<!-- 英文名 -->
						<view class="room-name-en" v-if="room.nameEn">
							<text>{{ room.nameEn }}</text>
						</view>
						
						<!-- 第二行开始：设施信息 -->
						<view class="room-amenities-section" v-if="getValidAmenities(room.formatAmenities || []).length > 0">
							<view 
								v-for="(amenity, index) in getValidAmenities(room.formatAmenities || [])" 
								:key="index"
								class="amenity-item"
							>
								<text>{{ amenity.text }}：{{ amenity.value }}</text>
							</view>
						</view>
						
						<!-- 满房提示 -->
						<view v-if="!getLowestPrice(room)" class="sold-out-hint">
							<text>酒店满房</text>
						</view>
					</view>
					
				</view>
				
				<!-- 展开后的价格详情区域 -->
				<view 
					class="expanded-price-details"
					:class="{ 'show': isExpanded(room.id) }"
					v-if="room.hotelRoomDetails && room.hotelRoomDetails.length > 0"
				>
					<!-- 价格方案列表 -->
					<view class="price-plans">
						<view 
							v-for="(detail, index) in room.hotelRoomDetails" 
							:key="detail.id || index"
							class="price-plan-item"
							:class="{ 'highlight': index === 0 }"
						>
							<!-- 左侧：价格名称和房型信息 -->
							<view class="plan-info-left">
								<view class="plan-name-wrapper">
									<text class="plan-name">{{ detail.name || '标准价格' }}</text>
									<view class="plan-badge" v-if="index === 0 && room.hotelRoomDetails.length > 1">
										<text>推荐</text>
									</view>
								</view>
								<!-- 房型信息（设施信息） -->
								<view class="plan-amenities" v-if="getValidAmenities(room.formatAmenities || []).length > 0">
									<view 
										v-for="(amenity, amenityIndex) in getValidAmenities(room.formatAmenities || [])" 
										:key="amenityIndex"
										class="amenity-item"
									>
										<text>{{ amenity.text }}：{{ amenity.value }}</text>
									</view>
								</view>
							</view>
							
							<!-- 右侧：价格和预订按钮 -->
							<view class="plan-info-right">
								<view class="plan-price">
									<text class="plan-price-symbol">¥</text>
									<text class="plan-price-value">{{ formatPrice(detail.totalPriceCny || detail.totalPrice || 0) }}</text>
									<text class="plan-price-unit">{{ detail.priceUnit || 'CNY' }}</text>
								</view>
								<view 
									class="plan-book-btn"
									:class="{ 'recommended': index === 0 && room.hotelRoomDetails.length > 1 }"
									@click.stop="handleBook(room, detail)"
								>
									<text>预订</text>
								</view>
							</view>
						</view>
					</view>
				</view>
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
	width: 100%;
	overflow: visible;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 0;
	box-sizing: border-box;
	// 外层卡片边框与阴影
	border: 1rpx solid #f0f0f0;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.02);
	transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;

	&:active {
		transform: scale(0.995);
		box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.04);
		border-color: #e5d3a3;
	}
}

// 上半部分：轮播图
.room-image-section {
	width: 100%;
	overflow: hidden;
	border-radius: 12rpx 12rpx 0 0;
}

// 下半部分：信息区域
.room-info-section {
	width: 100%;
	padding: 24rpx;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

// 主信息区域：左侧信息 + 右侧按钮
.room-info-main {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-start;
	width: 100%;
	gap: 20rpx;
	&.clickable {
		cursor: pointer;
		transition: opacity 0.2s;
		-webkit-tap-highlight-color: transparent;
		
		&:active {
			opacity: 0.8;
		}
	}
}

// 左侧信息区域
.room-info-left {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

// 第一行：房型名称（左）和价格（右）
.room-info-row-first {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-start;
	width: 100%;
	gap: 20rpx;
	
	.room-name-wrapper {
		flex: 1;
		min-width: 0;
		
		.room-name {
			font-size: 28rpx;
			font-weight: 500;
			color: #333;
			line-height: 1.4;
			word-break: break-word;
		}
	}
	
	.room-price-wrapper {
		flex-shrink: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 4rpx;
		
		.price-symbol {
			font-size: 24rpx;
			font-weight: bold;
			color: #FF8C00;
			align-self: flex-start;
			margin-top: 4rpx;
		}
		
		.price-value {
			font-size: 32rpx;
			font-weight: bold;
			color: #FF8C00;
		}
		
		.price-suffix {
			font-size: 24rpx;
			color: #333;
		}
		
		// 折叠箭头
		.expand-arrow {
			margin-left: 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: transform 0.3s ease;
			transform: rotate(0deg);
			
			&.expanded {
				transform: rotate(180deg);
			}
		}
	}
}

// 英文名
.room-name-en {
	font-size: 22rpx;
	color: #c8cacf;
	line-height: 1.4;
	word-break: break-word;
	
	text {
		font-size: 22rpx;
		color: #c8cacf;
	}
}

// 第二行开始：设施信息
.room-amenities-section {
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

// 展开提示
.expand-hint {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 8rpx;
	padding: 8rpx 0;
	font-size: 22rpx;
	color: #999;
	cursor: pointer;
	
	text {
		font-size: 22rpx;
		color: #999;
	}
}

// 满房提示
.sold-out-hint {
	font-size: 24rpx;
	color: #999;
	padding: 8rpx 0;
	
	text {
		font-size: 24rpx;
		color: #999;
	}
}

// 右侧按钮区域（垂直堆叠）
.room-actions-right {
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
	align-items: flex-end;
	
	.action-btn {
		width: 120rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 6rpx;
		padding: 12rpx 20rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
		
		text {
			font-size: 24rpx;
		}
		
		&.share-btn {
			background-color: #D4C4A8;
			color: #8B7355;
			
			text {
				color: #8B7355;
			}
		}
		
		&.book-btn {
			background-color: #D4C4A8;
			color: #8B7355;
			
			text {
				color: #8B7355;
			}
		}
		
		&.guarantee-btn {
			background-color: #fff;
			color: #8B7355;
			border: 1rpx solid #D4C4A8;
			
			text {
				color: #8B7355;
			}
		}
	}
}

// 展开后的价格详情区域
.expanded-price-details {
	width: 100%;
	// margin-top: 20rpx;
	// padding-top: 20rpx;
	display: flex;
	flex-direction: column;
	gap: 0;
	max-height: 0;
	overflow: hidden;
	opacity: 0;
	transition: all 0.3s ease;
	
	&.show {
		max-height: 2000rpx;
		opacity: 1;
	}
}

// 展开后的按钮区域
.action-buttons-expanded {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	gap: 12rpx;
	
	.action-btn {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 6rpx;
		padding: 12rpx 24rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
		
		text {
			font-size: 24rpx;
		}
		
		&.share-btn {
			background-color: #D4C4A8;
			color: #8B7355;
			
			text {
				color: #8B7355;
			}
		}
		
		&.book-btn {
			background-color: #D4C4A8;
			color: #8B7355;
			
			text {
				color: #8B7355;
			}
		}
		
		&.guarantee-btn {
			background-color: #fff;
			color: #8B7355;
			border: 1rpx solid #D4C4A8;
			
			text {
				color: #8B7355;
			}
		}
	}
}

// 价格方案列表
.price-plans {
	display: flex;
	flex-direction: column;
	gap: 0;
	
	.price-plan-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		padding: 28rpx 24rpx;
		border-bottom: 1rpx solid #f0f0f0;
		gap: 20rpx;
		background-color: #fff;
		transition: all 0.2s ease;
		
		&:last-child {
			border-bottom: none;
		}
		
		&:hover {
			background-color: #fafafa;
		}
		
		&.highlight {
			background: linear-gradient(135deg, #fff9f0 0%, #fff5e6 100%);
			border-left: 4rpx solid #d4ab62;
			padding-left: 20rpx;
		}
		
		.plan-info-left {
			flex: 1;
			min-width: 0;
			display: flex;
			flex-direction: column;
			gap: 12rpx;
			
			.plan-name-wrapper {
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: 12rpx;
				
				.plan-name {
					font-size: 30rpx;
					font-weight: bold;
					color: #333;
					line-height: 1.5;
				}
				
				.plan-badge {
					padding: 4rpx 12rpx;
					background: linear-gradient(135deg, #d4ab62 0%, #b37e29 100%);
					border-radius: 12rpx;
					
					text {
						font-size: 20rpx;
						color: #fff;
						font-weight: 500;
					}
				}
			}
			
			.plan-amenities {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				gap: 16rpx;
				align-items: center;
				
				.amenity-item {
					font-size: 24rpx;
					color: #666;
					white-space: nowrap;
					
					text {
						font-size: 24rpx;
						color: #666;
						line-height: 1.5;
					}
				}
			}
		}
		
		.plan-info-right {
			flex-shrink: 0;
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			gap: 16rpx;
			
			.plan-price {
				display: flex;
				flex-direction: row;
				align-items: baseline;
				gap: 6rpx;
				
				.plan-price-symbol {
					font-size: 28rpx;
					color: #FF8C00;
					line-height: 1;
					align-self: flex-start;
					margin-top: 4rpx;
				}
				
				.plan-price-value {
					font-size: 32rpx;
					color: #FF8C00;
					line-height: 1;
				}
				
				.plan-price-unit {
					font-size: 24rpx;
					color: #999;
					line-height: 1;
				}
			}
			
			.plan-book-btn {
				width: 130rpx;
				height: 64rpx;
				background: linear-gradient(135deg, #ebbe8b 0%, #dd9d3d 50%, #eed3aa 100%);
				color: #ffffff;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 8rpx;
				font-size: 26rpx;
				cursor: pointer;
				transition: all 0.3s;
				box-shadow: 0 2rpx 8rpx rgba(255, 215, 0, 0.2);
				
				&.recommended {
					background: linear-gradient(135deg, #d4ab62 0%, #b37e29 100%);
					box-shadow: 0 4rpx 12rpx rgba(212, 171, 98, 0.4);
				}
				
				&:active {
					opacity: 0.9;
					transform: scale(0.98);
					box-shadow: 0 1rpx 4rpx rgba(255, 215, 0, 0.3);
				}
				
				text {
					font-size: 26rpx;
					color: #ffffff;
					font-weight: 500;
				}
			}
		}
	}
}
</style>

