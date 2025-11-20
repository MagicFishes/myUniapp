<script setup lang="ts">
// 定义酒店项的类型
type HotelItemType = {
  id?: number; // id 是可选的
  image: string;
  name: string;
  price: string;
  label: string[];
}

const props = defineProps<{
  item: HotelItemType
}>();

// 调试：打印接收到的数据
</script>
<template>
  <!-- 左右结构布局  左图片,右  酒店名称 文字 标签-->
  <view class="hotel-item">
    <view class="hotel-item-left">
      <image
        :src="props.item?.image || 'https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg'"
        mode="aspectFill"></image>
    </view>
    <view class="hotel-item-right">
      <view class="hotel-item-right-text">
        <text>{{ props.item?.name || '未命名' }}</text>
      </view>
      <view class="hotel-item-right-text hotel-item-right-price">
        <text>¥{{ props.item?.price || '0' }}</text>
      </view>
      <!-- 标签 -->
      <view class="hotel-item-right-text hotel-item-right-labels">
        <view v-for="(label, index) in props.item?.label || []" :key="index" class="hotel-item-right-label">
          <text>{{ label }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<style scoped lang="scss">
.hotel-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  box-sizing: border-box;
  padding: 20rpx;
  gap: 20rpx;
  // background-color: #999;

  .hotel-item-left {
    width: 180rpx;
    height: 180rpx;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 12rpx;

    image {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  .hotel-item-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    min-width: 0;
    box-sizing: border-box;

    .hotel-item-right-text {
      width: 100%;
      font-size: 28rpx;
      color: #333;
      letter-spacing: 1rpx;
      padding: 4rpx 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &.hotel-item-right-price {
        font-size: 32rpx;
        font-weight: bold;
        color: #ff6b35;
        margin-top: 8rpx;
        text-align: right;
      }

      &.hotel-item-right-labels {
        display: flex;
        flex-wrap: wrap;
        gap: 10rpx;
        margin-top: 12rpx;
        white-space: normal;
      }

      .hotel-item-right-label {
        display: inline-block;
        border: 1rpx solid #999;
        border-radius: 8rpx;
        padding: 4rpx 12rpx;
        font-size: 20rpx;
        color: #999;
        letter-spacing: 1rpx;
      }
    }
  }
}
</style>