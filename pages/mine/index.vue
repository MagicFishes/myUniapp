<template>
	<view class="page" :style="{ paddingBottom: `${utils.bottomNavHeight}px`,paddingTop: `${utils.totalSafeAreaHeight}px` }">
		<customNavBar
			title="我的"
			:showBackButton="false"
			:autoBack="false"
		/>
		<view class="page-header">
			<view class="user-row">
				<view class="avatar">
					<text class="avatar-icon">👤</text>
				</view>
				<view class="user-info">
					<view class="user-top">
						<text class="user-name">尊贵的会员</text>
						<text class="user-tag">普通会员</text>
					</view>
					<view class="user-bottom">
						<text class="user-growth">成长值 0</text>
						<text class="user-sep">|</text>
						<text class="user-point">可用积分 0</text>
					</view>
				</view>
			</view>

			<view class="asset-row">
				<view class="asset-item">
					<text class="asset-label">我的钱包</text>
					<text class="asset-value">--</text>
				</view>
				<view class="asset-item">
					<text class="asset-label">我的优惠券</text>
					<text class="asset-value">0</text>
				</view>
				<view class="asset-item">
					<text class="asset-label">会员计划</text>
					<text class="asset-value">敬请期待</text>
				</view>
			</view>

			<view class="plus-card">
				<view class="plus-left">
					<view class="plus-tag">PLUS 会员</view>
					<view class="plus-desc">599元/年 尊享价值1688元礼包</view>
				</view>
				<view class="plus-btn">立即开通</view>
			</view>
		</view>
		<view class="page-content" >
			<view class="section">
				<view class="section-header">
					<text class="section-title">会员中心</text>
				</view>
				<view class="section-grid">
					<view
						v-for="item in memberActions"
						:key="item.label"
						class="grid-item"
						@click="handleComingSoon"
					>
						<view class="grid-icon">
							<text>{{ item.icon }}</text>
						</view>
						<text class="grid-label">{{ item.label }}</text>
					</view>
				</view>
			</view>

			<!-- <view class="page-footer-tip">
				<text>更多个人中心功能开发中，敬请期待。</text>
			</view> -->
		</view>
		<!-- 其他内容 -->
		<view class="extra-content">
			<!-- 顶部通知条 -->
			<view class="notice-bar" @click="handleComingSoon">
				<text class="notice-icon">🕓</text>
				<text class="notice-text">酒店促销上新：儿童早餐</text>
			</view>

			<!-- 活动专区 -->
			<!-- <view class="extra-section-header">
				<text class="extra-section-title">活动专区</text>
			</view> -->
			<view class="banner-card" @click="handleComingSoon">
				<image
					class="banner-image"
					src="https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg"
					mode="aspectFill"
				/>
				<view class="banner-dots">
					<view
						v-for="(dot, index) in 3"
						:key="index"
						class="banner-dot"
						:class="{ 'banner-dot-active': index === 0 }"
					/>
				</view>
			</view>

			<!-- 常用服务 -->
			<view class="service-card">
				<view class="service-header">
					<text class="service-title">常用服务</text>
				</view>
				<view class="service-grid">
					<view
						v-for="item in serviceList"
						:key="item.label"
						class="service-item"
						@click="handleComingSoon"
					>
						<view class="service-icon">
							<text>{{ item.icon }}</text>
						</view>
						<text class="service-label">{{ item.label }}</text>
					</view>
				</view>
			</view>
		</view>

		<customTabBar active="mine" />
	</view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import navMetrics from '../../utils/utils.js'
import utils from '@/utils/utils.js'
const pageContentStyle = computed(
	() => `margin-top: ${navMetrics.totalSafeAreaHeight + 0}px;`
)

// 会员中心入口（只做展示，点击统一提示“敬请期待”）
const memberActions = [
	{ label: '我的订单', icon: '📄' },
	{ label: '积分商城', icon: '💰' },
	// { label: '我的常旅卡', icon: '🛫' },
	// { label: '礼宾车', icon: '🚗' }
]

// 常用服务（静态展示）
const serviceList = [
	{ label: '检查更新', icon: '🔄' },
	{ label: '服务协议', icon: '📃' },
	{ label: '新手指南', icon: '📘' },
	{ label: '关于游虾', icon: 'ℹ️' },
	{ label: '发现服务', icon: '✨' },
	{ label: '系统设置', icon: '⚙️' },
	{ label: '活动记录', icon: '📝' },
	{ label: '代办事项', icon: '📌' },
	{ label: '消息订阅', icon: '🔔' }
]

const handleComingSoon = () => {
	uni.showToast({
		title: '功能开发中，敬请期待',
		icon: 'none'
	})
}
</script>

<style lang="scss">
.page {
	// min-height: 100vh;
	background: #f5f5f5;
	display: flex;
	flex-direction: column;
	// padding-bottom: 200rpx;

}

/* 顶部大卡区域 */
.page-header {
	background: linear-gradient(135deg, #3b3f54, #1f2230);
	padding: 40rpx 32rpx 120rpx;
	color: #fff;
}

/* 用户信息行 */
.user-row {
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50rpx;
	background: rgba(255, 255, 255, 0.12);
	display: flex;
	align-items: center;
	justify-content: center;
}

.avatar-icon {
	font-size: 56rpx;
}

.user-info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	flex: 1;
}

.user-top {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.user-name {
	font-size: 32rpx;
	font-weight: 600;
}

.user-tag {
	font-size: 22rpx;
	padding: 4rpx 10rpx;
	border-radius: 24rpx;
	background: rgba(255, 255, 255, 0.16);
}

.user-bottom {
	display: flex;
	align-items: center;
	gap: 10rpx;
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
}

.user-sep {
	opacity: 0.6;
}

/* 资产信息 */
.asset-row {
	margin-top: 32rpx;
	display: flex;
	background: rgba(0, 0, 0, 0.2);
	border-radius: 24rpx;
	padding: 20rpx;
	justify-content: space-between;
}

.asset-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	align-items: center;
	color: #fff;
}

.asset-label {
	font-size: 22rpx;
	opacity: 0.8;
}

.asset-value {
	font-size: 26rpx;
	font-weight: 500;
}

/* PLUS 会员卡 */
.plus-card {
	margin-top: 24rpx;
	background: linear-gradient(120deg, #f3c46e, #f0b94e);
	border-radius: 24rpx;
	padding: 24rpx 28rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: #4a2b05;
}

.plus-left {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.plus-tag {
	font-size: 26rpx;
	font-weight: 600;
}

.plus-desc {
	font-size: 22rpx;
	opacity: 0.9;
}

.plus-btn {
	padding: 12rpx 26rpx;
	border-radius: 999rpx;
	background: #fff;
	font-size: 24rpx;
	font-weight: 500;
}

/* 内容区 */
.page-content {
	margin-top: -80rpx; /* 与 header 叠加一点 */
	padding: 0 32rpx 40rpx;
	box-sizing: border-box;
}

/* 区块 */
.section {
	background: #fff;
	border-radius: 24rpx;
	padding: 24rpx 24rpx 12rpx;
	box-shadow: 0 12rpx 30rpx rgba(0, 0, 0, 0.06);
}

.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.section-title {
	font-size: 30rpx;
	font-weight: 500;
	color: #333;
}

/* 宫格入口 */
.section-grid {
	display: flex;
	justify-content: space-between;
	padding-top: 12rpx;
}

.grid-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10rpx;
	color: #333;
}

.grid-icon {
	width: 90rpx;
	height: 90rpx;
	border-radius: 45rpx;
	background: #f8f1dd;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 40rpx;
}

.grid-label {
	font-size: 24rpx;
}

/* 底部提示 */
.page-footer-tip {
	margin-top: 20rpx;
	font-size: 22rpx;
	color: #999;
	text-align: center;
}

/* 其他内容整体容器 */
.extra-content {
	padding: 0 32rpx 40rpx;
	box-sizing: border-box;
}

/* 通知条 */
.notice-bar {
	// margin-top: 16rpx;
	margin-bottom: 24rpx;
	background: #ffffff;
	border-radius: 999rpx;
	padding: 16rpx 24rpx;
	display: flex;
	align-items: center;
	gap: 12rpx;
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.04);
}

.notice-icon {
	font-size: 28rpx;
}

.notice-text {
	font-size: 24rpx;
	color: #333;
}

/* 活动专区 */
.extra-section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.extra-section-title {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

.banner-card {
	background: #ffffff;
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: 0 12rpx 30rpx rgba(0, 0, 0, 0.06);
	margin-bottom: 32rpx;
}

.banner-image {
	width: 100%;
	height: 220rpx;
}

.banner-dots {
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	background: #ffffff;
}

.banner-dot {
	width: 10rpx;
	height: 10rpx;
	border-radius: 50%;
	background: #e0e0e0;
}

.banner-dot-active {
	width: 18rpx;
	border-radius: 999rpx;
	background: #f5b94d;
}

/* 常用服务 */
.service-card {
	background: #ffffff;
	border-radius: 24rpx;
	padding: 24rpx 24rpx 16rpx;
	box-shadow: 0 12rpx 30rpx rgba(0, 0, 0, 0.06);
}

.service-header {
	margin-bottom: 12rpx;
}

.service-title {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

.service-grid {
	display: flex;
	flex-wrap: wrap;
	margin-top: 12rpx;
}

.service-item {
	width: 25%;
	padding: 20rpx 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10rpx;
}

.service-icon {
	width: 72rpx;
	height: 72rpx;
	border-radius: 36rpx;
	background: #f5f7ff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 34rpx;
}

.service-label {
	font-size: 22rpx;
	color: #333;
}
</style>