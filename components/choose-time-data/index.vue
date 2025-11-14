<script setup lang="ts">
// 高度可传递
const props = withDefaults(defineProps<{
    height?: number
}>(), {
    height: 100
})
</script>
<template>
    <!-- 左中右布局 -->
    <view class="choose-time-data" :style="{ height: props.height + 'rpx' }"    >
        <view class="choose-time-data-left">
            <span class="choose-time-data-left-text">11月15日</span>
            <span class="choose-time-data-left-text">入住</span>
        </view>
        <view class="choose-time-data-center">
            <span class="choose-time-data-center-text">4晚</span>
        </view>
        <view class="choose-time-data-right">
            <span class="choose-time-data-right-text">11月19日</span>
            <span class="choose-time-data-right-text">离店</span>
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
        flex: 1;
        justify-content: space-start;
        align-items: center;
        font-weight: bold;
            letter-spacing: 2rpx;
        }
        .choose-time-data-left-text{
            font-size: 28rpx;
            font-weight: bold;
            letter-spacing: 2rpx;
            color: #999;
        }
        .choose-time-data-left-text{
            font-size: 28rpx;
            font-weight: bold;
            letter-spacing: 2rpx;
            color: #999;
        }
    .choose-time-data-center{
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        letter-spacing: 2rpx;
        .choose-time-data-center-text{
            font-size: 28rpx;
            font-weight: bold;
            letter-spacing: 2rpx;
            color: #999;
        }
    }
    .choose-time-data-right{
        display: flex;
        flex: 1;
        justify-content: space-end;
        align-items: center;
        font-weight: bold;
        letter-spacing: 2rpx;
        .choose-time-data-right-text{
            font-size: 28rpx;
            font-weight: bold;
            letter-spacing: 2rpx;
            color: #999;
        }
    }
}
</style>