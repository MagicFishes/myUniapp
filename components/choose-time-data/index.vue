<script setup lang="ts">
import { useHotelSearchStore } from '@/store/useHotelSearchStore';
import { computed } from 'vue';
import dayjs from 'dayjs';
const hotelSearchStore = useHotelSearchStore();

// 格式化日期显示为 "M月D日" 格式（如：1月20日）
const formatDisplayDate = (dateStr: string) => {
	if (!dateStr) return '';
	try {
		return dayjs(dateStr).format('M月D日');
	} catch (e) {
		return dateStr;
	}
};

const checkInDate = computed(() => hotelSearchStore.getCheckInDate ?? '');
const checkOutDate = computed(() => hotelSearchStore.getCheckOutDate ?? '');
const checkInDateDisplay = computed(() => formatDisplayDate(checkInDate.value));
const checkOutDateDisplay = computed(() => formatDisplayDate(checkOutDate.value));
const diffDays = computed(() => {
	if (!checkInDate.value || !checkOutDate.value) return 0;
	try {
		return dayjs(checkOutDate.value).diff(dayjs(checkInDate.value), 'day');
	} catch (e) {
		return 0;
	}
});
// 高度可传递
const props = withDefaults(defineProps<{
    height?: number
}>(), {
    height: 100
})

// 点击显示日历
const handleClick = () => {
	hotelSearchStore.setCalendarShow(true);
};

</script>
<template>
    <!-- 左中右布局 -->
    <view @click="handleClick" class="choose-time-data" :style="{ height: props.height + 'rpx' }"    >
        <view class="choose-time-data-left">
            <span class="choose-time-data-left-date">{{ checkInDateDisplay }}</span>
            <span class="choose-time-data-left-label">入住</span>
        </view>
        <view class="choose-time-data-center">
            <span class="choose-time-data-center-text">{{ diffDays }}晚</span>
        </view>
        <view class="choose-time-data-right">
            <span class="choose-time-data-right-date">{{ checkOutDateDisplay }}</span>
            <span class="choose-time-data-right-label">离店</span>
        </view>
    </view>
</template>
<style scoped lang="scss">
.choose-time-data{
  
    width: 100%;
    min-width: 0; // 在flex容器中，允许子元素收缩
    // height: 100%; // 移除，使用内联样式传入的高度
    box-sizing: border-box;
    display: flex;
    flex: 1; // 在flex容器中，使用flex:1撑满宽度
    justify-content: space-between;
    align-items: center;
    .choose-time-data-left{
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: center;
        align-items: flex-start;
        font-weight: bold;
        letter-spacing: 2rpx;
        .choose-time-data-left-date{
            font-size: 28rpx;
            font-weight: bold;
            letter-spacing: 2rpx;
            color: #333;
            margin-bottom: 4rpx;
        }
        .choose-time-data-left-label{
            font-size: 24rpx;
            font-weight: normal;
            letter-spacing: 2rpx;
            color: #999;
        }
    }
    .choose-time-data-center{
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        letter-spacing: 2rpx;
        .choose-time-data-center-text{
            font-size: 24rpx;
            font-weight: bold;
            letter-spacing: 2rpx;
            color: #999;
            background-color: #f0f0f0;
            padding: 5rpx 20rpx;
            border-radius: 20rpx;
        }
    }
    .choose-time-data-right{
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: center;
        align-items: flex-end;
        font-weight: bold;
        letter-spacing: 2rpx;
        .choose-time-data-right-date{
            font-size: 28rpx;
            font-weight: bold;
            letter-spacing: 2rpx;
            color: #333;
            margin-bottom: 4rpx;
        }
        .choose-time-data-right-label{
            font-size: 24rpx;
            font-weight: normal;
            letter-spacing: 2rpx;
            color: #999;
        }
    }
}
</style>