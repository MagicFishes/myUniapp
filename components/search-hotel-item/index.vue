<script setup lang="ts">
import { computed } from 'vue';
// 定义酒店项的类型
type HotelItemType = {
  id?: number | string;
  image: string;
  name: string;
  nameEn?: string;
  brandName?: string;
  telephone?: string;
  address?: string;
  lowestPrice?: {
    minPrice?: number | string | null;
    initPriceUnit?: string;
  } | null;
}

const props = defineProps<{
  item: HotelItemType
}>();

const emit = defineEmits(['clickHotelDetail']);

const handleClickHotelDetail = () => {
  emit('clickHotelDetail', props.item);
};

// 是否满房（价格已加载且价格 <= 0 视为满房）
const isSoldOut = computed(() => {
  const lowestPrice = props.item?.lowestPrice;
  if (!lowestPrice) return false;

  const price = lowestPrice.minPrice;
  if (price === null || price === undefined) return false;

  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return false;

  return numPrice <= 0;
});

// 格式化价格显示
const formatPrice = (price: number | string | null): string => {
  if (!price || price === 0 || price === '0') return '--';
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(numPrice)) return '--';
  return Number(numPrice).toLocaleString('zh-CN', { maximumFractionDigits: 2 });
};
</script>
<template>
  <!-- 左右结构布局  左图片,右  酒店名称 文字 价格-->
  <view
    class="hotel-item"
    :class="{ 'hotel-item-disabled': isSoldOut }"
    @click="!isSoldOut && handleClickHotelDetail()"
  >
    <view class="hotel-item-left">
      <image
        :src="props.item?.image || 'https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg'"
        mode="aspectFill"></image>
    </view>
    <view class="hotel-item-right">
      <view class="hotel-item-right-top">
        <view class="hotel-item-name">
          <text>{{ props.item?.name || '未命名' }}</text>
          <text v-if="props.item?.brandName" class="hotel-item-brand">-【{{ props.item.brandName }}】</text>
        </view>
        <view class="hotel-item-name-en" v-if="props.item?.nameEn">
          <text>{{ props.item.nameEn }}</text>
        </view>
      </view>
      <view class="hotel-item-right-bottom">
        <view class="hotel-item-info">
          <!-- <view class="hotel-item-info-item" v-if="props.item?.address">
            <image class="hotel-item-icon" src="/static/icon/location.png" mode="aspectFit"></image>
            <text>{{ props.item.address }}</text>
          </view> -->
        </view>
        <view class="hotel-item-price-section">
          <!-- 价格加载状态 -->
          <view v-if="props.item?.lowestPrice?.minPrice == null" class="hotel-item-price-loading">
            <view class="price-loading-item"></view>
            <view class="price-loading-item price-loading-item-small"></view>
          </view>
          <!-- 价格显示 -->
          <view v-else class="hotel-item-price-content">
            <view v-if="Number(props.item?.lowestPrice?.minPrice) > 0" class="hotel-item-price">
              <!-- <text class="hotel-item-price-symbol">¥</text> -->
              <text class="hotel-item-price-value">{{ formatPrice(props.item.lowestPrice?.minPrice) }}</text>
              <text class="hotel-item-price-unit">{{ props.item.lowestPrice?.initPriceUnit || 'CNY' }}</text>
            </view>
            <view v-if="Number(props.item?.lowestPrice?.minPrice) > 0" class="hotel-item-price-desc">
              <text>起/每晚</text>
              <text>包含税金和额外费用</text>
            </view>
            <view v-if="Number(props.item?.lowestPrice?.minPrice) <= 0" class="hotel-item-sold-out-tag">
              <text>酒店满房</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<style scoped lang="scss">
  .hotel-item {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: flex-start;
    width: 100%;
    min-height: 260rpx;
    box-sizing: border-box;
    padding: 20rpx;
    gap: 20rpx;
    background-color: #fff;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
    cursor: pointer;
    transition: all 0.3s;
    -webkit-tap-highlight-color: transparent;
    
    &:active {
      opacity: 0.85;
      transform: scale(0.98);
      box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.08);
    }

    .hotel-item-left {
      width: 280rpx;
      height: 260rpx;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      border-radius: 8rpx;

      image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }

    .hotel-item-right {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0;
      box-sizing: border-box;
      min-width: 0;
      align-items: stretch;
      justify-content: space-between;
      gap: 12rpx;
      min-height: 260rpx;

      .hotel-item-right-top {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex: 1;
        gap: 8rpx;

      .hotel-item-name {
        width: 100%;
        font-size: 30rpx;
        font-weight: 500;
        color: #333;
        line-height: 1.4;
        word-break: break-word;

        .hotel-item-brand {
          font-size: 28rpx;
          color: #666;
        }
      }

      .hotel-item-name-en {
        width: 100%;
        font-size: 22rpx;
        color: #c8cacf;
        line-height: 1.4;
        word-break: break-word;
      }
    }

    .hotel-item-right-bottom {
      display: flex;
      width: 100%;
      justify-content: flex-end;
      align-items: flex-end;
      flex-shrink: 0;
      flex-grow: 0;

      .hotel-item-info {
        display: none;

        .hotel-item-info-item {
          display: flex;
          align-items: center;
          height: 50rpx;
          font-size: 24rpx;
          color: #7a7a7a;

          .hotel-item-icon {
            width: 32rpx;
            height: 32rpx;
            margin-right: 8rpx;
          }

          text {
            font-size: 24rpx;
            color: #7a7a7a;
          }
        }
      }

      .hotel-item-price-section {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: flex-end;
        flex-shrink: 0;

        .hotel-item-price-loading {
          display: flex;
          flex-direction: row;
          align-items: baseline;
          justify-content: flex-end;
          gap: 6rpx;

          .price-loading-item {
            width: 60rpx;
            height: 36rpx;
            background-color: #f0f0f0;
            border-radius: 4rpx;
            opacity: 0.6;
            animation: skeleton-loading 1.5s ease-in-out infinite;

            &.price-loading-item-small {
              width: 100rpx;
              height: 36rpx;
            }
          }

          .price-loading-btn {
            display: none;
          }
        }
        
        @keyframes skeleton-loading {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
        }

        .hotel-item-price-content {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-end;

          .hotel-item-price {
            display: flex;
            flex-direction: row;
            align-items: baseline;
            justify-content: flex-end;
            gap: 6rpx;
            white-space: nowrap;

            .hotel-item-price-symbol {
              font-size: 22rpx;
              font-weight: bold;
              color: #FF8C00;
              align-self: flex-start;
              margin-top: 4rpx;
            }

            .hotel-item-price-value {
              font-size: 32rpx;
              font-weight: bold;
              color: #FF8C00;
              white-space: nowrap;
            }

            .hotel-item-price-unit {
              font-size: 22rpx;
              color: #999;
              white-space: nowrap;
            }
          }

          .hotel-item-price-desc {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            margin-top: 8rpx;

            text {
              font-size: 22rpx;
              color: #c4c4c4;
              letter-spacing: 1rpx;
            }
          }

          .hotel-item-sold-out-tag {
            padding: 8rpx 16rpx;
            background-color: #f5f5f5;
            border-radius: 6rpx;
            display: inline-block;

            text {
              font-size: 24rpx;
              color: #999;
            }
          }
        }
      }
    }
  }
}

.hotel-item-disabled {
  opacity: 0.6;
  pointer-events: none;
}

</style>