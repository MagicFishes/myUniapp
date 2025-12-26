<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'

onLaunch(() => {
	console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
	console.log('App Launch')
})

onShow(() => {
	console.log('App Show')
})

onHide(() => {
	console.log('App Hide')
})
</script>

<template>
</template>

<style lang="scss">
/* 注意要写在第一行，注意不能引入至uni.scss，同时给style标签加入lang="scss"属性 */
@import "@/uni_modules/uview-plus/index.scss";
/*每个页面公共css */
@import '@/uni_modules/uni-scss/index.scss';
/* #ifndef APP-NVUE */
@import '@/static/customicons.css';

// 设置整个项目的背景色
page {
	background-color: #f5f5f5;
}

/* #endif */
.example-info {
	font-size: 14px;
	color: #333;
	padding: 10px;
}

// 全局样式：确保日历弹窗层级高于导航栏和底部导航栏
// 顶部导航栏的 z-index 是 1，底部导航栏的 z-index 是 100
// 所以弹窗需要更高的 z-index（至少 > 100）
// z-index 层级顺序：遮罩层 < 弹窗内容容器 < 弹窗内容
// 使用 !important 确保优先级最高

// 弹窗容器（必须高于所有导航栏）
.u-popup {
	z-index: 10010 !important;
}

// 遮罩层（应该最低，在弹窗内容下方，但也要高于导航栏）
.u-overlay {
	z-index: 10008 !important;
	position: fixed !important;
}

// u-transition 组件（弹窗的动画容器）
.u-transition {
	z-index: 10010 !important;
}

// 弹窗内容容器（u-transition，应该在遮罩层之上）
view[class*="u-popup__content"][class*="transition"],
view.u-transition {
	z-index: 10010 !important;
	position: fixed !important;
}

// 弹窗内容（应该最高，在遮罩层、容器和所有导航栏之上）
.u-popup__content {
	z-index: 10011 !important;
	position: relative !important;
}

// 确保弹窗在所有 fixed 定位元素之上（包括顶部和底部导航栏）
view.u-popup,
view[class*="u-popup"] {
	z-index: 10010 !important;
}

// 确保日历组件内的所有元素都有正确的层级
.u-calendar {
	z-index: 10011 !important;
	position: relative !important;
}

// 确保底部导航栏的 z-index 不会覆盖弹窗
.custom-tab-bar {
	z-index: 100 !important;
}
</style>
