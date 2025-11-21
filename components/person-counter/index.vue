<script setup lang="ts">
import { computed } from 'vue';
import { useHotelSearchStore } from '@/store/useHotelSearchStore';

interface Props {
	min?: number; // 最小人数
	max?: number; // 最大人数
	unit?: string; // 单位，默认为 "人/间"
}

const props = withDefaults(defineProps<Props>(), {
	min: 1,
	max: 10,
	unit: '人/间'
});

// 使用 store
const hotelSearchStore = useHotelSearchStore();

// 从 store 获取当前人数
const currentValue = computed(() => hotelSearchStore.personCount);

// 是否可以减少
const canDecrease = computed(() => {
	return currentValue.value > props.min;
});

// 是否可以增加
const canIncrease = computed(() => {
	return currentValue.value < props.max;
});

// 减少人数
const decrease = () => {
	if (canDecrease.value) {
		hotelSearchStore.decreasePersonCount();
	}
};

// 增加人数
const increase = () => {
	if (canIncrease.value) {
		hotelSearchStore.increasePersonCount();
	}
};
</script>

<template>
	<view class="person-counter">
		<view 
			class="counter-btn decrease-btn" 
			:class="{ disabled: !canDecrease }"
			@click="decrease"
		>
			<text class="btn-text">-</text>
		</view>
		<view class="counter-value">
			<text>{{ currentValue }}{{ unit }}</text>
		</view>
		<view 
			class="counter-btn increase-btn" 
			:class="{ disabled: !canIncrease }"
			@click="increase"
		>
			<text class="btn-text">+</text>
		</view>
	</view>
</template>

<style scoped lang="scss">
.person-counter {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10rpx;
	height: 100%;
	flex-wrap: nowrap;
	.counter-btn {
		width: 40rpx;
		height: 40rpx;
		border-radius: 8rpx;
		background-color: #f5f5f5;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s;
		
		&:active {
			background-color: #e0e0e0;
		}
		
		&.disabled {
			background-color: #f5f5f5;
			opacity: 0.5;
			cursor: not-allowed;
			
			&:active {
				background-color: #f5f5f5;
			}
		}
		
		.btn-text {
			font-size: 24rpx;
			color: #333;
			font-weight: 500;
		}
	}
	
	.counter-value {
		min-width: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		
		text {
			font-size: 28rpx;
			color: #333;
		}
	}
}
</style>

