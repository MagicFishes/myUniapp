<template>
	<view class="page">
		<customNavBar
			title=""
			:showBackButton="false"
			:autoBack="false"
		/>

		<view
			class="page-content"
			:style="pageContentStyle"
		>
			<view class="section-header">
				<text class="section-title">个人中心</text>
				<view
					class="header-link"
					@click="handleEdit"
				>
					<u-icon
						name="edit-pen"
						size="30"
						color="#007aff"
					/>
					<text>编辑资料</text>
				</view>
			</view>

			<view class="profile">
				<view class="avatar">A</view>
				<view class="info">
					<text class="name">旅客姓名</text>
					<text class="email">user@example.com</text>
				</view>
			</view>

			<view class="card">
				<text class="card-title">常用操作</text>
				<view class="actions">
					<view
						v-for="action in actions"
						:key="action.label"
						class="action"
					>
						<text class="action-icon">{{ action.icon }}</text>
						<text class="action-label">{{ action.label }}</text>
					</view>
				</view>
			</view>

			<view class="notice">
				<text>更多个人中心功能开发中，敬请期待。</text>
			</view>
		</view>
		<customTabBar active="mine" />
	</view>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import navMetrics from '../../utils/utils.js'

const uni = (globalThis as any).uni

const actions = [
	{ label: '订单记录', icon: '📄' },
	{ label: '发票管理', icon: '🧾' },
	{ label: '常用出行人', icon: '👤' }
]

const pageContentStyle = computed(() => `margin-top: ${navMetrics.totalSafeAreaHeight}px;`)

const handleSettings = () => {
	uni.showToast({
		title: '设置功能开发中',
		icon: 'none'
	})
}

const handleEdit = () => {
	uni.showToast({
		title: '编辑资料功能开发中',
		icon: 'none'
	})
}

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
	gap: 32rpx;
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

.nav-actions {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.nav-icon {
	width: 72rpx;
	height: 72rpx;
	border-radius: 36rpx;
	background: rgba(0, 122, 255, 0.12);
	display: flex;
	align-items: center;
	justify-content: center;
}

.header-actions {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.header-link {
	display: flex;
	align-items: center;
	gap: 12rpx;
	padding: 12rpx 24rpx;
	border-radius: 32rpx;
	background: #ffffff;
	font-size: 24rpx;
	color: #007aff;
	box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.08);
}

.profile {
	display: flex;
	align-items: center;
	gap: 24rpx;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	background: #007aff;
	color: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 48rpx;
	font-weight: 600;
	box-shadow: 0 16rpx 32rpx rgba(0, 122, 255, 0.25);
}

.info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.name {
	font-size: 34rpx;
	font-weight: 600;
	color: #222;
}

.email {
	font-size: 26rpx;
	color: #666;
}

.card {
	background: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.06);
	display: flex;
	flex-direction: column;
	gap: 28rpx;
}

.card-title {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
}

.actions {
	display: flex;
	justify-content: space-between;
}

.action {
	width: 30%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
	color: #333;
}

.action-icon {
	width: 90rpx;
	height: 90rpx;
	border-radius: 30rpx;
	background: #f5f7ff;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 44rpx;
}

.action-label {
	font-size: 26rpx;
}

.notice {
	padding: 24rpx;
	border-radius: 20rpx;
	background: #f5f7ff;
	color: #666;
	font-size: 26rpx;
}
</style>

