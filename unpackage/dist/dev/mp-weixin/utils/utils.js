"use strict";
const common_vendor = require("../common/vendor.js");
const DEFAULT_SAFE_TOP = 20;
const DEFAULT_NAV_HEIGHT = 44;
const DEFAULT_BOTTOM_NAV_HEIGHT = 110;
const getPlatformApi = () => {
  try {
    if (typeof common_vendor.index !== "undefined") {
      return common_vendor.index;
    }
  } catch (error) {
  }
  return void 0;
};
const computeSafeTopHeight = () => {
  const api = getPlatformApi();
  if (!(api == null ? void 0 : api.getSystemInfoSync))
    return DEFAULT_SAFE_TOP;
  try {
    const info = api.getSystemInfoSync();
    if ((info == null ? void 0 : info.safeAreaInsets) && typeof info.safeAreaInsets.top === "number") {
      return info.safeAreaInsets.top;
    }
    if (typeof (info == null ? void 0 : info.statusBarHeight) === "number") {
      return info.statusBarHeight;
    }
  } catch (error) {
  }
  return DEFAULT_SAFE_TOP;
};
const computeCustomNavBarHeight = () => {
  const api = getPlatformApi();
  if (!(api == null ? void 0 : api.getMenuButtonBoundingClientRect))
    return DEFAULT_NAV_HEIGHT;
  try {
    const rect = api.getMenuButtonBoundingClientRect();
    if (rect && typeof rect.height === "number" && rect.height > 0) {
      return rect.height;
    }
  } catch (error) {
  }
  return DEFAULT_NAV_HEIGHT;
};
let cachedSafeTopHeight;
let cachedCustomNavBarHeight;
const ensureSafeTopHeight = () => {
  if (typeof cachedSafeTopHeight === "number") {
    return cachedSafeTopHeight;
  }
  cachedSafeTopHeight = computeSafeTopHeight();
  return cachedSafeTopHeight;
};
const ensureCustomNavBarHeight = () => {
  if (typeof cachedCustomNavBarHeight === "number") {
    return cachedCustomNavBarHeight;
  }
  cachedCustomNavBarHeight = computeCustomNavBarHeight();
  return cachedCustomNavBarHeight;
};
const refreshMetrics = () => {
  cachedSafeTopHeight = void 0;
  cachedCustomNavBarHeight = void 0;
};
const navMetrics = {
  /**
   * 顶部安全区域高度（单位：px）
   */
  get safeTopHeight() {
    return ensureSafeTopHeight();
  },
  /**
   * 自定义导航栏高度（单位：px）
   */
  get customNavBarHeight() {
    return ensureCustomNavBarHeight();
  },
  /**
   * 顶部安全区域 + 自定义导航栏总高度，便于组件直接使用。
   */
  get totalSafeAreaHeight() {
    return ensureSafeTopHeight() + ensureCustomNavBarHeight();
  },
  /**
   * 底部导航栏高度（单位：px）
   */
  get bottomNavHeight() {
    return DEFAULT_BOTTOM_NAV_HEIGHT;
  },
  /**
   * 主动刷新全部高度信息。
   */
  refresh: refreshMetrics
};
exports.navMetrics = navMetrics;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/utils.js.map
