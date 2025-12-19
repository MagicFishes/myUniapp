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
							{{ destinationText }}
						</view>
						<!-- <view class="content-search-position-icon">
							<uni-icons type="location" size="20" color="#999"></uni-icons>
							<view class="content-search-position-icon-text">
								我的定位
							</view>
						</view> -->
					</view>
					<view class="content-search-date">
						<view class="content-search-date-time">
							<ChooseTimeData :height="100"></ChooseTimeData>
						</view>
						<view class="content-search-date-line"></view>
						<view class="content-search-date-person">
							<personCounter></personCounter>
						</view>
					</view>
					<!-- <view class="content-search-hotel" @click="goToHotelBrand">
						<view class="content-search-hotel-text">
							关键词/品牌/酒店名
						</view>
						<view class="content-search-hotel-icon">
							<uni-icons type="search" size="20" color="#999"></uni-icons>
						</view>
					</view> -->
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
import { computed, reactive, ref } from 'vue'
import { onShow, onLoad } from '@dcloudio/uni-app'
import ChooseTimeData from '@/components/choose-time-data/index.vue';
import HotelItem from '@/components/hotel-item/index.vue';
import CalendarPopup from '@/components/calendar-popup/index.vue';
import utils from '@/utils/utils';
import { useHotelSearchStore } from '@/store/useHotelSearchStore';
import Home from '@/api/home';
import personCounter from '@/components/person-counter/index.vue';
const hotelSearchStore = useHotelSearchStore();
const goToHotelBrand = () => {
	uni.navigateTo({
		url: '/subpackages/search/pages/hotelBrand'
	})
}
// 日历弹窗显示状态（响应式）
const calendarShow = computed({
	get: () => hotelSearchStore.calendarShow,
	set: (val) => hotelSearchStore.setCalendarShow(val)
});

// 目的地文本（响应式）- 从 store 中获取选中的目的地，如果为空则显示"请选择目的地"
const destinationText = computed(() => {
	const cityName = hotelSearchStore.getCityName;
	return cityName || '请选择目的地';
});

// 页面显示时执行（每次显示都会执行）
onShow(() => {
	console.log('🟢 onShow 生命周期触发 - 首页显示')
	console.log('📋 hasLoadedBanner:', hasLoadedBanner.value)
	console.log('📋 list1 长度:', list1.length)

	// 如果是 tabBar 页面，首次加载时可能不会触发 onLoad，所以在这里也调用一次
	// 使用标志位避免重复调用
	if (!hasLoadedBanner.value) {
		console.log('⚠️ 首次加载，在 onShow 中调用 getBannerList')
		getBannerList()
	} else {
		console.log('✅ 轮播图已加载过，跳过')
	}
})

// 获取轮播图数据
const getBannerList = async () => {
	// 防止重复调用
	if (hasLoadedBanner.value) {
		console.log('⚠️ getBannerList 已调用过，跳过')
		return
	}

	console.log('🚀 getBannerList 函数被调用')
	hasLoadedBanner.value = true // 设置标志位

	try {
		console.log('📡 开始请求轮播图接口...')
		const response = await Home.queryBannerInfo('home_banner')
		console.log('✅ 接口响应:', response)

		if (response.data?.success) {
			const bannerData = response.data.data
			console.log('📦 轮播图数据:', bannerData)

			if (Array.isArray(bannerData) && bannerData.length > 0) {
				// 提取所有 bannerImages 并转换为图片URL数组
				const imageUrls = bannerData
					.flatMap((item: any) => item.bannerImages || [])
					.map((item: any) => item.imageUrl)
					.filter((url: string) => url) // 过滤掉空值

				console.log('🖼️ 提取的图片URL:', imageUrls)

				// 更新 list1 数组
				list1.length = 0
				list1.push(...imageUrls)
				console.log('✅ 轮播图数据已更新，当前数量:', list1.length)

				// 如果没有数据，使用默认图片
				if (list1.length === 0) {
					list1.push('https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg')
					console.log('⚠️ 没有数据，使用默认图片')
				}
			} else {
				console.log('⚠️ 轮播图数据为空')
			}
		} else {
			console.log('❌ 接口返回失败:', response.data)
		}
	} catch (error) {
		console.error('❌ 获取轮播图失败:', error)
		hasLoadedBanner.value = false // 失败时重置标志位，允许重试
		// 如果接口失败，使用默认图片
		if (list1.length === 0) {
			list1.push('https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg')
			console.log('⚠️ 接口失败，使用默认图片')
		}
	}
}

// 页面加载时获取轮播图数据
onLoad((options) => {
	console.log('🎯 ========== onLoad 生命周期触发！==========')
	console.log('📋 页面参数:', options)
	console.log('📋 当前 list1 初始值:', list1)
	console.log('📋 list1 长度:', list1.length)
	getBannerList()
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



// 使用 reactive 创建响应式数组（初始值只有一个默认图片，用于判断是否已加载）
const list1 = reactive([
	'https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg'
]);

// 添加一个标志位，防止重复调用接口
const hasLoadedBanner = ref(false)
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
					height: 100%; // 给父元素设置明确高度，子元素的100%才能计算
					border-bottom: 1rpx solid #e5e5e5;
					display: flex;
					// flex-direction: column; // 设置为列布局
					justify-content: space-between;
					align-items: stretch; // 让子元素撑满宽度（默认值，但明确设置更清晰）

					// padding-right: 20rpx;
					.content-search-date-time {
						flex: 1;

					}

					.content-search-date-line {
						width: 0;
						height: 50rpx;
						align-self: center;
						border-left: 1rpx solid #e2e0e0;
						flex-shrink: 0;
						margin-right: 10rpx;
						margin-left: 10rpx;

					}

					.content-search-date-person {
						// flex: ;
						min-width: 180rpx;
						// height: 100%; // 移除，让 flexbox 的 align-items: stretch 自然拉伸
						display: flex;
						flex-wrap: nowrap;
						justify-content: center;
						align-items: center;
					}
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
