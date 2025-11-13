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
import { computed, toRefs } from 'vue'
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

const uni = (globalThis as any).uni

const handleBack = () => {
	emit('back')

	if (!showBackButton.value) {
		return
	}

	if (autoBack.value && uni?.navigateBack) {
		uni.navigateBack({
			delta: 1
		})
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