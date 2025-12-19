<template>
<view class="page">
    <customNavBar  :showBackButton="true" :autoBack="true" title="我的订单" ></customNavBar>
    <view class="page-content" :style="{ paddingTop: `${utils.totalSafeAreaHeight+10}px` }">
        <!-- 订单状态选择器 -->
        <view class="status-tabs">
            <view 
                v-for="tab in tabs" 
                :key="tab.value"
                class="tab-item"
                :class="{ active: currentTab === tab.value }"
                @click="handleTabClick(tab.value)"
            >
                <text class="tab-text">{{ tab.label }}</text>
                <view v-if="currentTab === tab.value" class="tab-indicator"></view>
            </view>
        </view>
        
        <view class="order-list">
            
        </view>
    </view>
</view>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import utils from '@/utils/utils'

const tabs = [
    { label: '全部', value: 'all' },
    { label: '待出行', value: 'pending' },
    { label: '待支付', value: 'unpaid' },
    { label: '交易完成', value: 'completed' }
]

const currentTab = ref('all')

const handleTabClick = (value: string) => {
    currentTab.value = value
    // TODO: 根据选中的状态筛选订单列表
}

</script>
<style lang="scss" scoped>

    .page {
        width: 100%;
        height: 100%;
        min-height: 100vh;
        background-color: #fff;
    }

    .page-content {
        display: flex;
        flex-direction: column;
    }

    .status-tabs {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0 32rpx;
        background-color: #fff;
        border-bottom: 1rpx solid #e5e5e5;
    }

    .tab-item {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24rpx 0;
        flex: 1;
    }

    .tab-text {
        font-size: 28rpx;
        color: #999;
        transition: all 0.3s;
    }

    .tab-item.active .tab-text {
        color: #333;
        font-weight: 600;
    }

    .tab-indicator {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 60rpx;
        height: 4rpx;
        background-color: #d4a574;
        border-radius: 2rpx;
    }

    .order-list {
        flex: 1;
        padding: 24rpx 32rpx;
    }
</style>