<template>
	<view
		class="custom-nav-bar"
		:style="navBarStyle"
	>
		<view
			class="nav-left"
			:class="{ 'is-disabled': !showBackButton }"
			@click="handleBack"
		>
			<slot name="left">
				<!-- 返回 -->
				<u-icon v-if="showBackButton" name="arrow-left" size="24" color="#222222"  />
			</slot>
		</view>
		<view class="nav-title">
			<slot name="title">
				<text class="title-text">
					{{ title }}
				</text>
			</slot>
		</view>
		<view class="nav-right">
			<slot name="right" />
		</view>
	</view>
</template>

<script lang="ts" setup>
import { computed, toRefs, getCurrentInstance } from 'vue'
import navMetrics from '../../utils/utils.js'

type CustomNavBarProps = {
	title?: string
	background?: string
	safeAreaInsetTop?: boolean
	showBackButton?: boolean
	autoBack?: boolean
}

const props = withDefaults(defineProps<CustomNavBarProps>(), {
	title: '',
	background: '#ffffff',
	safeAreaInsetTop: true,
	showBackButton: true,
	autoBack: true
})

const emit = defineEmits<{
	(e: 'back'): void
}>()

const { title, background, safeAreaInsetTop, showBackButton, autoBack } = toRefs(props)

const navBarStyle = computed(() => {
	const safeTopHeight = safeAreaInsetTop.value ? navMetrics.safeTopHeight : 0
	const totalHeight = safeTopHeight + navMetrics.customNavBarHeight

	return {
		backgroundColor: background.value,
		height: `${totalHeight}px`,
		paddingTop: `${safeTopHeight}px`
	}
})

const handleBack = () => {
	if (!showBackButton.value) {
		return
	}

	// 默认执行返回逻辑
	const performBack = () => {
		if (autoBack.value) {
			// 使用全局的 uni 对象
			if (typeof uni !== 'undefined' && uni.navigateBack) {
				const pages = getCurrentPages()
				if (pages.length > 1) {
					uni.navigateBack({
						delta: 1
					})
				} else {
					// 如果没有上一页，跳转到首页
					uni.redirectTo({
						url: '/pages/home/index'
					})
				}
			}
		}
	}

	// 检查是否有监听 back 事件
	// 如果有监听，emit 事件（让父组件可以做一些额外处理）
	// 无论是否有监听，都执行默认返回（除非 autoBack 为 false）
	try {
		const instance = getCurrentInstance()
		// 检查是否有监听 back 事件（通过 vnode.props 或 context.attrs）
		if (instance) {
			// 在 Vue 3 中，可以通过 instance.vnode.props 检查
			const hasListener = instance.vnode?.props && ('onBack' in instance.vnode.props)
			if (hasListener) {
				// 如果有监听 back 事件，emit 事件
				emit('back')
			}
		}
		// 执行默认返回逻辑
		performBack()
	} catch (e) {
		// 如果检查失败，直接执行默认返回
		performBack()
	}
}
</script>

<style lang="scss">
.custom-nav-bar {
	// height: calc(44px + var(--status-bar-height));
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 999;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 15px;
	// padding-top: var(--status-bar-height);
	background-color: #ffffff;
	box-sizing: border-box;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.nav-left,
.nav-right {
	display: flex;
	align-items: center;
	min-width: 60px;
	height: 44px;
}

.nav-left {
	justify-content: flex-start;
}

.nav-left.is-disabled {
	pointer-events: none;
}

.nav-right {
	justify-content: flex-end;
}

.nav-title {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 44px;
	text-align: center;
}

.title-text {
	font-size: 18px;
	font-weight: 600;
	color: #222222;
}

.back-icon {
	width: 24px;
	height: 24px;
}
</style>