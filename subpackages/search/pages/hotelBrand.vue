<template>
	<view class="page">
		<customNavBar :showBackButton="true" :autoBack="true" title="酒店品牌" />

		<view class="page-content" :style="{ paddingTop: `${utils.totalSafeAreaHeight}px` }">
			<!-- 搜索栏 -->
			<view class="search-header">
				<view class="search-input-wrapper">
					<uni-icons type="search" size="20" color="#999" />
					<input
						class="search-input"
						v-model="keyword"
						placeholder="关键词/位置/品牌/酒店名"
						@confirm="handleSearch"
					/>
				</view>
			</view>

			<template v-if="!keyword">
				<!-- 当前城市 -->
				<view class="current-city-card">
					<text class="current-city-label">当前城市：</text>
					<text class="current-city-name">{{ currentCity }}</text>
				</view>

				<!-- 历史记录 -->
				<view class="history-record-card" v-if="historyList.length">
					<view class="history-header">
						<view class="history-title-wrapper">
							<text class="history-icon">🕒</text>
							<text class="history-title">历史记录</text>
						</view>
						<view class="history-delete" @click="clearHistory">
							<text class="delete-icon">🗑️</text>
						</view>
					</view>
					<view class="history-tags">
						<view
							v-for="(item, index) in historyList"
							:key="index"
							class="history-tag"
							@click="handleHistoryClick(item)"
						>
							<text class="history-tag-text">{{ item }}</text>
						</view>
					</view>
				</view>

				<!-- 酒店集团 -->
				<!-- <view class="group-section">
					<view class="section-header">
						<text class="section-title">酒店集团</text>
					</view>
					<view class="brand-group-list">
						<view
							v-for="group in brandGroups"
							:key="group.id"
							class="brand-group-row"
						>
							<view class="brand-card" v-for="brand in group.brands" :key="brand.id">
								<view class="brand-card-left" :style="{ backgroundColor: brand.bgColor }">
									<image
										class="brand-logo"
										:src="brand.logo"
										mode="aspectFit"
									/>
								</view>
								<view class="brand-card-right" :style="{ backgroundColor: brand.rightColor }">
									<text class="brand-name">{{ brand.name }}</text>
								</view>
							</view>
						</view>
					</view>
				</view> -->

				<!-- 酒店品牌标签 -->
				<view class="simple-brand-section">
					<view class="section-header">
						<text class="section-title">酒店品牌</text>
					</view>
					<view class="simple-brand-tags">
						<view
							v-for="(name, index) in simpleBrands"
							:key="index"
							class="simple-brand-tag"
							:class="{ active: selectedBrand === name }"
							@click="toggleSimpleBrand(name)"
						>
							<text class="simple-brand-text">{{ name }}</text>
						</view>
					</view>
				</view>
			</template>

			<!-- 这里可以根据 keyword 展示搜索结果，后续接入接口 -->

			<!-- 底部确认按钮 -->
			<view class="footer">
				<button class="confirm-button" @click="handleConfirm">确定</button>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import customNavBar from '@/components/custom-nav-bar/index.vue'
import utils from '@/utils/utils'

const keyword = ref('')
const currentCity = ref('香港')
const historyList = ref<string[]>(['香港', '万豪', '洲际'])
const selectedBrand = ref<string>('')

// 示例数据：酒店集团 + 品牌卡片
const brandGroups = ref([
	{
		id: 1,
		brands: [
			{
				id: 'marriott',
				name: '万豪',
				logo: 'https://dummyimage.com/160x60/ffffff/000000&text=Marriott',
				bgColor: '#1f2341',
				rightColor: '#c88a3a'
			},
			{
				id: 'ihg',
				name: '洲际',
				logo: 'https://dummyimage.com/160x60/ffffff/000000&text=IHG',
				bgColor: '#f5f0e6',
				rightColor: '#d3813c'
			}
		]
	},
	{
		id: 2,
		brands: [
			{
				id: 'hilton',
				name: '希尔顿',
				logo: 'https://dummyimage.com/160x60/ffffff/000000&text=Hilton',
				bgColor: '#00205b',
				rightColor: '#1f7ad6'
			},
			{
				id: 'accor',
				name: '雅高',
				logo: 'https://dummyimage.com/160x60/ffffff/000000&text=ACCOR',
				bgColor: '#10152a',
				rightColor: '#4d5aa7'
			}
		]
	}
])

// 底部简单品牌标签
const simpleBrands = ref<string[]>([
	'康莱德',
	'丽思卡尔顿',
	'香格里拉',
	'W Hotels',
	'JW万豪',
	'瑞吉'
])

const handleSearch = () => {
	if (!keyword.value.trim()) return
	addHistory(keyword.value.trim())
	// TODO: 调用搜索品牌接口
}

const addHistory = (value: string) => {
	const idx = historyList.value.indexOf(value)
	if (idx > -1) historyList.value.splice(idx, 1)
	historyList.value.unshift(value)
	if (historyList.value.length > 10) historyList.value = historyList.value.slice(0, 10)
}

const clearHistory = () => {
	historyList.value = []
}

const handleHistoryClick = (value: string) => {
	keyword.value = value
	handleSearch()
}

const toggleSimpleBrand = (name: string) => {
	selectedBrand.value = selectedBrand.value === name ? '' : name
}

const handleConfirm = () => {
	// TODO: 把选中的品牌回传上一页
	uni.showToast({
		title: selectedBrand.value ? `已选择：${selectedBrand.value}` : '未选择品牌',
		icon: 'none'
	})
}
</script>

<style scoped lang="scss">
.page {
	min-height: 100vh;
	background-color: #f5f5f5;
}

.page-content {
	padding: 20rpx;
	padding-bottom: 120rpx; // 预留给底部按钮
}

.search-header {
	background-color: #ffffff;
	border-radius: 20rpx;
	padding: 20rpx 20rpx;
	margin-bottom: 20rpx;
}

.search-input-wrapper {
	display: flex;
	align-items: center;
	gap: 20rpx;
	background-color: #f2f2f2;
	border-radius: 20rpx;
	padding: 16rpx 20rpx;
}

.search-input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.current-city-card {
	background-color: #ffffff;
	border-radius: 20rpx;
	padding: 20rpx 32rpx;
	margin-bottom: 20rpx;
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.current-city-label {
	font-size: 26rpx;
	color: #666;
}

.current-city-name {
	font-size: 26rpx;
	color: #333;
}

.history-record-card {
	background-color: #ffffff;
	border-radius: 20rpx;
	padding: 24rpx 32rpx;
	margin-bottom: 20rpx;
}

.history-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 20rpx;
}

.history-title-wrapper {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.history-icon {
	font-size: 28rpx;
}

.history-title {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

.history-delete {
	padding: 8rpx;
}

.delete-icon {
	font-size: 28rpx;
}

.history-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.history-tag {
	background-color: #f2f2f2;
	border-radius: 32rpx;
	padding: 12rpx 24rpx;
}

.history-tag-text {
	font-size: 26rpx;
	color: #333;
}

.group-section {
	background-color: #ffffff;
	border-radius: 20rpx;
	padding: 24rpx 32rpx 8rpx;
	margin-bottom: 20rpx;
}

.section-header {
	margin-bottom: 16rpx;
}

.section-title {
	font-size: 28rpx;
	color: #333;
	font-weight: 500;
}

.brand-group-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.brand-group-row {
	display: flex;
	flex-direction: row;
	gap: 16rpx;
}

.brand-card {
	flex: 1;
	display: flex;
	border-radius: 20rpx;
	overflow: hidden;
}

.brand-card-left {
	width: 60%;
	padding: 16rpx 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #222;
}

.brand-logo {
	width: 100%;
	height: 72rpx;
	border-radius: 12rpx;
	background-color: #fff;
}

.brand-card-right {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #c88a3a;
}

.brand-name {
	font-size: 26rpx;
	color: #fff;
	font-weight: 500;
}

.simple-brand-section {
	background-color: #ffffff;
	border-radius: 20rpx;
	padding: 24rpx 32rpx 16rpx;
	margin-bottom: 20rpx;
}

.simple-brand-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}

.simple-brand-tag {
	min-width: 140rpx;
	padding: 16rpx 24rpx;
	border-radius: 32rpx;
	background-color: #f2f2f2;
	text-align: center;
}

.simple-brand-tag.active {
	background-color: #d4a574;
}

.simple-brand-text {
	font-size: 26rpx;
	color: #333;
}

.simple-brand-tag.active .simple-brand-text {
	color: #fff;
}

.footer {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 16rpx 40rpx 32rpx;
	background: linear-gradient(to top, #f5f5f5, rgba(245, 245, 245, 0));
}

.confirm-button {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 44rpx;
	background-color: #d4a574;
	color: #fff;
	font-size: 30rpx;
    margin-bottom: 20rpx;
	border: none;
}
</style>
