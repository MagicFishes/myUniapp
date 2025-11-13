<template>
	<view class="page">
		<customNavBar
			title=""
			:showBackButton="false"
			:autoBack="false"
		>
			<!-- <template #right>
				<view class="nav-right">
					<view
						class="nav-chip"
						@click="handleSync"
					>
						<u-icon
							name="refresh"
							size="32"
							color="#007aff"
						/>
						<text class="nav-chip-text">同步信息</text>
					</view>
				</view>
			</template> -->
		</customNavBar>

		<view
			class="page-content"
			:style="pageContentStyle"
		>
			<view class="section-header">
				<text class="section-title">合作品牌展示</text>
				<view class="header-meta">
					<view class="meta-dot" />
					<text class="meta-text">共 {{ brands.length }} 个合作方</text>
				</view>
			</view>
			<view class="brand-list">
				<view
					v-for="brand in brands"
					:key="brand.name"
					class="brand-card"
				>
					<view class="brand-logo">{{ brand.initial }}</view>
					<view class="brand-info">
						<text class="brand-name">{{ brand.name }}</text>
						<text class="brand-desc">{{ brand.desc }}</text>
					</view>
				</view>
			</view>
		</view>
		<customTabBar active="brand" />
	</view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import navMetrics from '../../utils/utils.js'

const uni = (globalThis as any).uni

const brands = [
	{ name: 'Anydoor 精选', initial: 'A', desc: '差旅精选供应商集合' },
	{ name: '全球酒店联盟', initial: 'G', desc: '全球连锁酒店合作伙伴' },
	{ name: '航空伙伴', initial: 'F', desc: '常旅客航空计划' }
]

const pageContentStyle = computed(() => `margin-top: ${navMetrics.totalSafeAreaHeight}px;`)

const handleSync = () => {
	uni.showToast({
		title: '品牌信息已刷新',
		icon: 'none'
	})
}

const hideSystemTabBar = () => {
	try {
		uni.hideTabBar({ animation: false })
	} catch (error) {
		// ignore
	}
}

onMounted(hideSystemTabBar)
onShow(hideSystemTabBar)
</script>

<style lang="scss">
.page {
	min-height: 100vh;
	background: #f5f5f5;
	display: flex;
	flex-direction: column;
}

.page-content {
	padding: 24rpx 32rpx 48rpx;
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 24rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #333;
}

.nav-right {
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.nav-chip {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	padding: 12rpx 24rpx;
	border-radius: 32rpx;
	background: rgba(0, 122, 255, 0.12);
	color: #007aff;
	font-size: 24rpx;
}

.nav-chip-text {
	font-size: 24rpx;
	color: #007aff;
}

.header-meta {
	display: flex;
	align-items: center;
	gap: 12rpx;
	color: #666;
	font-size: 24rpx;
}

.meta-dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 8rpx;
	background: #007aff;
}

.brand-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.brand-card {
	display: flex;
	align-items: center;
	gap: 24rpx;
	padding: 24rpx;
	border-radius: 20rpx;
	background: #fff;
	box-shadow: 0 10rpx 24rpx rgba(0, 0, 0, 0.05);
}

.brand-logo {
	width: 88rpx;
	height: 88rpx;
	border-radius: 24rpx;
	background: #f2f3f8;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	font-weight: 600;
	color: #007aff;
}

.brand-info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	flex: 1;
}

.brand-name {
	font-size: 32rpx;
	color: #333;
	font-weight: 500;
}

.brand-desc {
	font-size: 26rpx;
	color: #888;
}
</style>

