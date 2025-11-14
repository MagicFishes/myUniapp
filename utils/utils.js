/**
 * 工具方法：动态计算并缓存顶部安全区域与自定义导航栏高度。
 * 由于 uni-app 在部分平台存在获取系统信息延迟的问题，此处提供安全兜底和刷新能力。
 */

const DEFAULT_SAFE_TOP = 20
const DEFAULT_NAV_HEIGHT = 44
// 底部导航栏高度  200
const DEFAULT_BOTTOM_NAV_HEIGHT = 110
/**
 * 获取当前可用的平台 API（优先使用 uni）。
 */
const getPlatformApi = () => {
	try {
		if (typeof uni !== 'undefined') {
			return uni
		}
	} catch (error) {
		// ignore
	}
	return undefined
}

/**
 * 计算顶部安全区域高度，优先使用 safeAreaInsets.top，其次回退到状态栏高度或默认值。
 */
const computeSafeTopHeight = () => {
	const api = getPlatformApi()
	if (!api?.getSystemInfoSync) return DEFAULT_SAFE_TOP

	try {
		const info = api.getSystemInfoSync()
		if (info?.safeAreaInsets && typeof info.safeAreaInsets.top === 'number') {
			return info.safeAreaInsets.top
		}
		if (typeof info?.statusBarHeight === 'number') {
			return info.statusBarHeight
		}
	} catch (error) {
		// ignore and fall back
	}

	return DEFAULT_SAFE_TOP
}

/**
 * 计算小程序/多端顶部胶囊按钮区域高度，失败时回退默认高度。
 */
const computeCustomNavBarHeight = () => {
	const api = getPlatformApi()
	if (!api?.getMenuButtonBoundingClientRect) return DEFAULT_NAV_HEIGHT

	try {
		const rect = api.getMenuButtonBoundingClientRect()
		if (rect && typeof rect.height === 'number' && rect.height > 0) {
			return rect.height
		}
	} catch (error) {
		// ignore and fall back
	}

	return DEFAULT_NAV_HEIGHT
}

let cachedSafeTopHeight
let cachedCustomNavBarHeight

/**
 * 获取缓存的 safeTopHeight；若无缓存则重新计算并记录。
 */
const ensureSafeTopHeight = () => {
	if (typeof cachedSafeTopHeight === 'number') {
		return cachedSafeTopHeight
	}
	cachedSafeTopHeight = computeSafeTopHeight()
	return cachedSafeTopHeight
}

/**
 * 获取缓存的 customNavBarHeight；若无缓存则重新计算并记录。
 */
const ensureCustomNavBarHeight = () => {
	if (typeof cachedCustomNavBarHeight === 'number') {
		return cachedCustomNavBarHeight
	}
	cachedCustomNavBarHeight = computeCustomNavBarHeight()
	return cachedCustomNavBarHeight
}

/**
 * 主动刷新缓存，适用于设备旋转或系统信息变化后。
 */
const refreshMetrics = () => {
	cachedSafeTopHeight = undefined
	cachedCustomNavBarHeight = undefined
}

export default {
	/**
	 * 顶部安全区域高度（单位：px）
	 */
	get safeTopHeight() {
		return ensureSafeTopHeight()
	},
	/**
	 * 自定义导航栏高度（单位：px）
	 */
	get customNavBarHeight() {
		return ensureCustomNavBarHeight()
	},
	/**
	 * 顶部安全区域 + 自定义导航栏总高度，便于组件直接使用。
	 */
	get totalSafeAreaHeight() {
		return ensureSafeTopHeight() + ensureCustomNavBarHeight()
	},
	/**
	 * 底部导航栏高度（单位：px）
	 */
	get bottomNavHeight() {
		return DEFAULT_BOTTOM_NAV_HEIGHT
	},
	/**
	 * 主动刷新全部高度信息。
	 */
	refresh: refreshMetrics
}
