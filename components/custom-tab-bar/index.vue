<template>
	<view
		class="custom-tab-bar"
		:class="{ 'has-border': border }"
		:style="{ background }"
	>
		<view class="tab-items">
			<view
				v-for="item in items"
				:key="item.key"
				class="tab-item"
				:class="{ active: resolvedActive === item.key }"
				@click="handleSelect(item)"
			>
				<slot
					name="icon"
					:item="item"
					:is-active="resolvedActive === item.key"
				>
					<image
						v-if="item.iconPath"
						:src="resolvedActive === item.key ? item.selectedIconPath || item.iconPath : item.iconPath"
						class="tab-icon"
						mode="widthFix"
					/>
					<u-icon
						v-else-if="item.icon"
						:name="resolvedActive === item.key ? item.activeIcon || item.icon : item.icon"
						:size="iconSize"
						:color="resolvedActive === item.key ? activeColor : color"
					/>
				</slot> 
				<text
					class="tab-text"
					:style="{ color: resolvedActive === item.key ? activeColor : color }"
				>
					{{ item.text }}
				</text>
			</view>
		</view>
		<view
			v-if="safeBottom > 0"
			class="safe-bottom"
			:style="{ height: safeBottom + 'px' }"
		/>
	</view>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { onMounted, onShow } from '@dcloudio/uni-app'

type TabItem = {
	key: string
	text: string
	icon?: string
	activeIcon?: string
	path?: string
	pagePath?: string
	iconPath?: string
	selectedIconPath?: string
}

type TabBarProps = {
	items: TabItem[]
	active: string
	color?: string
	activeColor?: string
	background?: string
	iconSize?: number | string
	border?: boolean
	hideSystemTabBar?: boolean
}

const props = withDefaults(defineProps<TabBarProps>(), {
	items: () => [
		{
			key: 'home',
			text: '首页',
			path: '/pages/home/index',
			pagePath: 'pages/home/index',
			iconPath: '/static/tabbar/home.png',
			selectedIconPath: '/static/tabbar/home-active.png'
		},
		{
			key: 'brand',
			text: '品牌',
			path: '/pages/brand/index',
			pagePath: 'pages/brand/index',
			iconPath: '/static/tabbar/brand.png',
			selectedIconPath: '/static/tabbar/brand-active.png'
		},
		{
			key: 'mine',
			text: '我的',
			path: '/pages/mine/index',
			pagePath: 'pages/mine/index',
			iconPath: '/static/tabbar/mine.png',
			selectedIconPath: '/static/tabbar/mine-active.png'
		}
	],
	active: '',
	color: '#666666',
	activeColor: '#007aff',
	background: '#ffffff',
	iconSize: 44,
	border: true,
	hideSystemTabBar: true
})

const emit = defineEmits<{
	(event: 'change', key: string): void
}>()

const getPlatformApi = () => ((globalThis as any).uni || (globalThis as any).wx || undefined)

const safeBottom = ref(0)

try {
	const api = getPlatformApi()
	const systemInfo = api?.getSystemInfoSync?.()
	safeBottom.value =
		systemInfo?.safeAreaInsets?.bottom ??
		Math.max(
			0,
			(systemInfo?.screenHeight ?? 0) -
				((systemInfo?.safeArea?.bottom ?? systemInfo?.screenHeight ?? 0))
		)
} catch (error) {
	safeBottom.value = 0
}

const currentRoute = computed(() => {
	try {
		const pages = getCurrentPages()
		return pages[pages.length - 1]?.route
	} catch (error) {
		return ''
	}
})

const normalizePath = (path?: string) => {
	if (!path) return ''
	return path.startsWith('/') ? path : `/${path}`
}

const resolveItemPath = (item: TabItem) => {
	return normalizePath(item.path || item.pagePath)
}

const resolvedActive = computed(() => {
	if (props.active) {
		return props.active
	}

	const currentPath = normalizePath(currentRoute.value)
	const matched = props.items.find((item) => resolveItemPath(item) === currentPath)
	return matched?.key ?? ''
})

const hideSystemTabBar = () => {
	if (!props.hideSystemTabBar) return
	try {
		getPlatformApi()?.hideTabBar?.({ animation: false })
	} catch (error) {
		// ignore
	}
}

onMounted(() => {
	hideSystemTabBar()
})

onShow(() => {
	hideSystemTabBar()
})

watch(
	() => resolvedActive.value,
	() => {
		hideSystemTabBar()
	}
)

const handleSelect = (item: TabItem) => {
	const targetPath = resolveItemPath(item)
	const currentPath = normalizePath(currentRoute.value)
	const isCurrentRoute = currentPath && targetPath && currentPath === targetPath
	const currentActive = resolvedActive.value

	if (currentActive === item.key) {
		emit('change', item.key)
		return
	}

	emit('change', item.key)

	if (!targetPath || isCurrentRoute) {
		return
	}

	const api = getPlatformApi()

	const tryNavigate = (method: 'reLaunch' | 'navigateTo') => {
		const fn = api?.[method]
		if (typeof fn === 'function') {
			try {
				fn({ url: targetPath })
				return true
			} catch (error) {
				return false
			}
		}
		return false
	}

	try {
		api?.switchTab?.({
			url: targetPath,
			fail: () => {
				if (tryNavigate('reLaunch')) return
				tryNavigate('navigateTo')
			}
		})
	} catch (error) {
		if (tryNavigate('reLaunch')) return
		tryNavigate('navigateTo')
	}
}

defineExpose({
	hideSystemTabBar
})
</script>

<style lang="scss">
.custom-tab-bar {
	width: 100%;
	display: flex;
	flex-direction: column;
	margin-top: auto;
	box-sizing: border-box;
	z-index: 95;

	&.has-border {
		border-top: 1rpx solid rgba(0, 0, 0, 0.08);
	}
}

.tab-items {
	display: flex;
	align-items: stretch;
	justify-content: space-around;
	padding: 12rpx 24rpx;
	gap: 12rpx;
}

.tab-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	padding: 16rpx 0;
	border-radius: 24rpx;
	transition: all 0.2s;

	&.active {
		background: rgba(0, 122, 255, 0.08);
	}
}

.tab-text {
	font-size: 24rpx;
}

.tab-icon {
	width: 48rpx;
	height: 48rpx;
}

.safe-bottom {
	width: 100%;
}
</style>

