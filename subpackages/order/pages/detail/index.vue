<template>
	<view class="page">
		<view class="header">
			<view class="title">订单详情</view>
			<view class="subtitle">敬请期待功能完善</view>
		</view>

		<view class="card">
			<view class="card-title">订单信息</view>
			<view class="info">
				<view class="row">
					<view class="label">订单号</view>
					<view class="value">--</view>
				</view>
				<view class="row">
					<view class="label">状态</view>
					<view class="value status">待完善</view>
				</view>
				<view class="row">
					<view class="label">创建时间</view>
					<view class="value">--</view>
				</view>
			</view>
		</view>

		<view class="card">
			<view class="card-title">旅客信息</view>
			<view class="placeholder">功能开发中，敬请期待。</view>
		</view>
	</view>
</template>

<script setup lang="ts">
// 预留页面，可在 onLoad 中接受参数请求详情数据
</script>

<style lang="scss">
.page {
	padding: 32rpx;
	display: flex;
	flex-direction: column;
	gap: 32rpx;
	min-height: 100vh;
	box-sizing: border-box;
	background: #f5f5f5;
}

.header {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.title {
	font-size: 36rpx;
	font-weight: 600;
	color: #222;
}

.subtitle {
	font-size: 26rpx;
	color: #666;
}

.card {
	background: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	display: flex;
	flex-direction: column;
	gap: 24rpx;
	box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.05);
}

.card-title {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
}

.info {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.row {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.label {
	font-size: 26rpx;
	color: #666;
}

.value {
	font-size: 28rpx;
	color: #333;
}

.status {
	color: #f59e0b;
}

.placeholder {
	font-size: 26rpx;
	color: #888;
	background: #f8f9fb;
	padding: 24rpx;
	border-radius: 20rpx;
}
</style>

