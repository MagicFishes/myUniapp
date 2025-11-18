<template>
	<view class="page">
		<!-- <customNavBar  :showBackButton="false" :autoBack="false" title=""></customNavBar> -->
		<!-- :style="`margin-top: ${navMetrics.totalSafeAreaHeight}px;`" -->
		<view class="page-content" :style="{ paddingBottom: `${utils.bottomNavHeight}px` }">
			<view class="nav-banner">
				<up-swiper :circular="true" :indicatorMode="'dot'"
					:indicatorStyle="{ bottom: '130rpx', right: '50rpx' }" :indicator="true" height="600rpx"
					:list="list1" mode="aspectFill">
				</up-swiper>
			</view>
			<!-- 搜索栏 -->
			<view class="Content">
				<view class="content-search">
					<view class="content-search-position" @click="goToSearchPage">
						<view class="content-search-position-text">
							目的地
						</view>
						<view class="content-search-position-icon">
							<uni-icons type="location" size="20" color="#999"></uni-icons>
							<view class="content-search-position-icon-text">
								我的定位
							</view>
						</view>
					</view>
					<view class="content-search-date">
						<ChooseTimeData :height="100"></ChooseTimeData>
					</view>
					<view class="content-search-hotel">
						<view class="content-search-hotel-text">
							关键词/品牌/酒店名
						</view>
						<view class="content-search-hotel-icon">
							<uni-icons type="search" size="20" color="#999"></uni-icons>
						</view>
					</view>
					<view class="content-search-button" @click="goToHotelList">
						酒店查询
					</view>
				</view>
				<!-- 礼遇 -->
				<!-- 酒店推荐 -->
				<view class="content-search-hotel-recommend">
					<view v-for="(item, index) in hotelItemList" :key="item.id || index"
						class="content-search-hotel-recommend-item">
						<HotelItem :item="item" />
					</view>
				</view>
			</view>
		
		</view>
			<!-- 底部导航栏 -->
			<customTabBar />
		<!-- 日历弹窗 - 提升到页面级别，和底部导航栏同级 -->
		<!-- 使用 v-if 条件渲染，只在需要时渲染，优化性能 -->
		<CalendarPopup v-if="calendarShow" v-model:show="calendarShow" />
	</view>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import ChooseTimeData from '@/components/choose-time-data/index.vue';
import HotelItem from '@/components/hotel-item/index.vue';
import CalendarPopup from '@/components/calendar-popup/index.vue';
import utils from '@/utils/utils';
import { useHotelSearchStore } from '@/store/useHotelSearchStore';

const hotelSearchStore = useHotelSearchStore();

// 日历弹窗显示状态（响应式）
const calendarShow = computed({
	get: () => hotelSearchStore.calendarShow,
	set: (val) => hotelSearchStore.setCalendarShow(val)
});

// 页面显示时执行（每次显示都会执行）
onShow(() => {
	console.log('首页显示')
	// 刷新数据，比如：获取最新行程列表、更新用户信息等
	// 例如：fetchTripList()
	// 例如：updateUserInfo()
})

// 跳转到搜索页面
const goToSearchPage = () => {
	uni.navigateTo({
		url: '/subpackages/search/pages/index'
	})
}

// 跳转到酒店列表页面
const goToHotelList = () => {
	uni.navigateTo({
		url: '/subpackages/search/pages/list'
	})
}



// 使用 reactive 创建响应式数组  
const list1 = reactive([
	'https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg',
	'https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg',
	'https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg',
	'https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg',
	'https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg',
]);
const hotelItemList = reactive([
	{
		id: 1, // 添加 id 字段
		image: 'https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg',
		name: '酒店名称1',
		price: '100',
		label: ['住3付2', '享奢旅积分', '享奢旅积分', '享奢旅积分', '享奢旅积分'],
	},
	{
		id: 2, // 添加 id 字段
		image: 'https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg',
		name: '酒店名称2',
		price: '200',
		label: ['住3付2', '享奢旅积分'],
	},
	{
		id: 3, // 添加 id 字段
		image: 'https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg',
		name: '酒店名称3',
		price: '300',
		label: ['住3付2', '享奢旅积分'],
	}
]);
</script>

<style scoped lang="scss">
.page {
	min-height: 100vh; // 改为 min-height，允许内容超出
	display: flex;
	width: 100vw;
	flex-direction: column;
	position: relative;
	z-index: 1;

	.page-content {
		flex: 1;
		box-sizing: border-box;

		.nav-banner {
			position: relative;
			z-index: 1; // 让轮播图在搜索栏下方
			// height: 600rpx;
			padding-bottom: -100rpx;
		}

		.Content {
			margin-top: -100rpx;
			width: 100%;
			padding: 20rpx;
			box-sizing: border-box; // 让padding包含在宽度内
			display: flex;
			flex-direction: column;
			// gap: 20rpx;
			justify-content: start;
			align-items: center;

			position: relative;
			z-index: 2;
			.content-search {
				width: 95%; // 现在100%会自动减去父元素的padding
				display: flex;
				flex: none; // 改为 none，不占据所有空间，让后续元素可以显示
				min-height: 300rpx;
				background-color: #fff;
				border-radius: 20rpx;
				padding: 40rpx 30rpx;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;

				.content-search-position {
					width: 100%;
					height: 100rpx;
					border-bottom: 1rpx solid #e5e5e5;
					display: flex;
					justify-content: space-between;
					align-items: center;
					// cursor: pointer;

					// transition: opacity 0.2s;
					// &:active {
					// 	opacity: 0.7;
					// }
					.content-search-position-text {
						font-size: 40rpx;
						font-weight: bold;
						letter-spacing: 2rpx;
					}

					.content-search-position-icon {
						height: 100%;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-direction: column;

						.content-search-position-icon-text {
							font-size: 20rpx;
							color: #999;
						}
					}
				}

				.content-search-date {
					width: 100%;
					// height: 100rpx; // 给父元素设置明确高度，子元素的100%才能计算
					border-bottom: 1rpx solid #e5e5e5;
					display: flex;
					flex-direction: column; // 设置为列布局
					align-items: stretch; // 让子元素撑满宽度（默认值，但明确设置更清晰）
				}

				.content-search-hotel {
					width: 100%;
					height: 100rpx;
					border-bottom: 1rpx solid #e5e5e5;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.content-search-hotel-text {
						font-size: 30rpx;
						color: #c3c3c3;
						letter-spacing: 2rpx;
					}

					.content-search-hotel-icon {
						height: 100%;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-direction: column;
					}
				}

				.content-search-button {
					width: 100%;
					margin-top: 30rpx;
					height: 100rpx;
					border-radius: 60rpx;
					background-color: #000;
					color: #fff;
					font-size: 30rpx;
					letter-spacing: 2rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
				}
			}

			// 酒店推荐 一行两个
			.content-search-hotel-recommend {
				width: 95%; // 与 .content-search 保持一致
				margin-top: 30rpx;
				border-radius: 20rpx;
				box-sizing: border-box;
				display: grid;
				grid-template-columns: repeat(2, 1fr); // 一行两个
				// grid-template-rows: repeat(2, 1fr); // 移除固定行数，让内容自适应
				grid-column-gap: 30rpx;
				grid-row-gap: 30rpx;

				.content-search-hotel-recommend-item {
					width: 100%;
					height: 500rpx;
					background-color: #fff; // 添加背景色，方便查看
					border-radius: 20rpx;
					overflow: hidden; // 确保圆角生效
				}
			}
		}
	}
}
</style>
