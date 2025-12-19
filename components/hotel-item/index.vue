<script setup lang="ts">
// 定义酒店项的类型（根据实际接口返回的数据结构）
type HotelItemType = {
  id?: string | number;
  name: string;
  nameEn?: string;
  code?: string;
  globalHotelCode?: string;
  image?: string; // 图片可选
  price?: string; // 价格可选
  label?: string[]; // 标签可选
  [key: string]: any; // 允许其他字段
}

const props = defineProps<{
  item: HotelItemType
}>();

// 默认图片
const defaultImage = 'https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg'
</script>
<template>
  <!-- 上下结构布局  上图片,下  酒店名称 文字 标签-->
  <view class="hotel-item">
    <view class="hotel-item-top">
      <image
        :src="props.item?.image || defaultImage"
        mode="aspectFill"></image>
    </view>
    <view class="hotel-item-bottom">
      <view class="hotel-item-bottom-text hotel-item-name">
        <text>{{ props.item?.name || '未命名' }}</text>
      </view>
      <view class="hotel-item-bottom-text hotel-item-name-en" v-if="props.item?.nameEn">
        <text>{{ props.item.nameEn }}</text>
      </view>
      <view class="hotel-item-bottom-text hotel-item-price" v-if="props.item?.price">
        <text>¥{{ props.item.price }}</text>
      </view>
      <!-- 标签 -->
      <view class="hotel-item-bottom-text hotel-item-bottom-labels" v-if="props.item?.label && props.item.label.length > 0">
        <view v-for="(label, index) in props.item.label" :key="index" class="hotel-item-bottom-text-label">
          <text>{{ label }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<style scoped lang="scss">
.hotel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  // background-color: #999;

  .hotel-item-top {
    width: 100%;
    height: 60%;
    overflow: hidden; // 确保图片不会溢出
    border-radius: 20rpx 20rpx 0 0; // 顶部圆角

    image {
      width: 100%;
      height: 100%;
      display: block; // 确保图片正确显示
    }
  }

  .hotel-item-bottom {
    width: 100%;
    height: 40%;
    flex-shrink: 0; // 防止被压缩
    overflow-y: auto; // 超出时显示滚动条
    display: flex;
    flex-direction: column;
    align-items: flex-start; // 改为左对齐
    justify-content: flex-start; // 改为顶部对齐，这样才能滚动
    padding: 20rpx;
    box-sizing: border-box;

    .hotel-item-bottom-text {
      width: 100%;
      font-size: 22rpx;
      color: #333;
      letter-spacing: 2rpx;
      padding: 6rpx 0;

      &.hotel-item-name {
        font-size: 28rpx;
        font-weight: 600;
        color: #333;
        padding-bottom: 8rpx;
      }

      &.hotel-item-name-en {
        font-size: 22rpx;
        color: #999;
        padding-bottom: 8rpx;
      }

      &.hotel-item-price {
        font-size: 32rpx;
        font-weight: bold;
        color: #ff6b6b;
        padding: 8rpx 0;
      }

      &.hotel-item-bottom-labels {
        display: flex;
        flex-wrap: wrap;
        gap: 10rpx;
        padding-top: 8rpx;
      }

      .hotel-item-bottom-text-label {
        display: inline-block;
        border: 1rpx solid #999;
        border-radius: 10rpx;
        padding: 6rpx 12rpx;
        font-size: 20rpx;
        color: #999;
        letter-spacing: 1rpx;
      }
    }
  }
}
</style>