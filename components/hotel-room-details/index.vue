<script setup lang="ts">
import { computed } from 'vue';
import { useHotelSearchStore } from '@/store/useHotelSearchStore';

interface RoomDetail {
	id: string;
	rateId?: string;
	name: string;
	totalPriceCny: number;
	priceUnit: string;
	breakfast: number;
}

interface Amenity {
	text: string;
	value: string | null;
}

interface Props {
	roomDetails: RoomDetail[];
	formatAmenities?: Amenity[];
}

const props = withDefaults(defineProps<Props>(), {
	roomDetails: () => [],
	formatAmenities: () => []
});

const emit = defineEmits(['confirm']);

const hotelSearchStore = useHotelSearchStore();

// 计算入住天数
const nights = computed(() => {
	const startDate = hotelSearchStore.startDate;
	const endDate = hotelSearchStore.endDate;
	if (startDate && endDate) {
		const diffTime = endDate.getTime() - startDate.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays > 0 ? diffDays : 1;
	}
	return 1;
});

// 计算每晚价格
const getPricePerNight = (totalPrice: number): number => {
	if (!totalPrice) return 0;
	const pricePerNight = totalPrice / nights.value;
	return Number(pricePerNight.toFixed(2));
};

// 格式化价格显示
const formatPrice = (price: number): string => {
	if (!price || price === 0) return '--';
	return Number(price).toLocaleString('zh-CN', { maximumFractionDigits: 2 });
};

// 获取有效的设施信息
const getValidAmenities = (amenities: Amenity[]) => {
	return amenities.filter(item => item.text && item.value && item.value !== '' && item.value !== 'undefinedm²');
};

// 处理预订
const handleConfirm = (detail: RoomDetail) => {
	emit('confirm', detail);
};

// 获取早餐文本
const getBreakfastText = (breakfast: number) => {
	return breakfast === 0 ? '无早' : breakfast === 1 ? '单早' : '';
};
</script>

<template>
	<view class="hotel-room-details">
		<view 
			v-for="(detail, index) in roomDetails" 
			:key="detail.id || index"
			class="detail-item"
		>
			<!-- 价格名称 -->
			<view class="detail-name">
				<text>{{ detail.name || '标准价格' }}</text>
			</view>
			
			<!-- 早餐和设施信息 -->
			<view class="detail-info">
				<!-- 早餐信息 -->
				<view class="breakfast-info" v-if="detail.breakfast !== undefined">
					<text>{{ getBreakfastText(detail.breakfast) }}</text>
				</view>
				
				<!-- 设施信息 -->
				<view 
					v-for="(amenity, amenityIndex) in getValidAmenities(formatAmenities || [])" 
					:key="amenityIndex"
					class="amenity-tag"
				>
					<text>{{ amenity.text }} {{ amenity.value }}</text>
				</view>
			</view>
			
			<!-- 价格和预订按钮 -->
			<view class="detail-bottom">
				<!-- 价格信息 -->
				<view class="price-info">
					<view class="price-row">
						<text class="price-label">每晚</text>
						<text class="price-value">{{ formatPrice(getPricePerNight(detail.totalPriceCny)) }}</text>
						<text class="price-unit">{{ detail.priceUnit || 'CNY' }}</text>
					</view>
					<text class="price-desc">包含税金和额外费用</text>
				</view>
				
				<!-- 预订按钮 -->
				<view class="book-btn" @click="handleConfirm(detail)">
					<text>立即预订</text>
				</view>
			</view>
		</view>
	</view>
</template>

<style scoped lang="scss">
.hotel-room-details {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	margin-top: 0;
	padding-top: 20rpx;
	// border-top: 1rpx solid #f0f0f0;
	box-sizing: border-box;
	
	.detail-item {
		width: 100%;
		padding: 30rpx;
		border: 1rpx solid #b7b7b7;
		border-radius: 8rpx;
		display: flex;
		flex-direction: column;
		min-height: 210rpx;
		box-sizing: border-box;
		
		.detail-name {
			font-size: 36rpx;
			font-weight: bold;
			color: #cdad76;
			margin-bottom: 10rpx;
			letter-spacing: 2rpx;
		}
		
		.detail-info {
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			gap: 10rpx;
			margin-top: 10rpx;
			
			.breakfast-info {
				font-size: 28rpx;
				color: #383838;
				padding: 5rpx 0;
			}
			
			.amenity-tag {
				font-size: 24rpx;
				color: #383838;
				padding: 5rpx 10rpx;
				border: 1rpx solid #b7b7b7;
				border-radius: 4rpx;
			}
		}
		
		.detail-bottom {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			margin-top: 20rpx;
			flex: 1;
			
			.price-info {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				gap: 5rpx;
				
				.price-row {
					display: flex;
					align-items: baseline;
					gap: 10rpx;
				}
				
				.price-label {
					font-size: 28rpx;
					color: #969696;
				}
				
				.price-value {
					font-size: 40rpx;
					font-weight: bold;
					color: #252525;
				}
				
				.price-unit {
					font-size: 28rpx;
					font-weight: 500;
					color: #252525;
				}
				
				.price-desc {
					font-size: 24rpx;
					color: #969696;
					margin-top: 5rpx;
				}
			}
			
			.book-btn {
				background-color: #000;
				color: #fff;
				padding: 16rpx 60rpx;
				border-radius: 4rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 28rpx;
				flex-shrink: 0;
			}
		}
	}
}
</style>

