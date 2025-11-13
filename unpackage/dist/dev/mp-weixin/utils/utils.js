"use strict";
const common_vendor = require("../common/vendor.js");
function getSafeTopHeight() {
  const safeAreaInsets = common_vendor.index.getSystemInfoSync().safeAreaInsets;
  common_vendor.index.__f__("log", "at utils/utils.js:8", safeAreaInsets, "safeAreaInsets");
  return safeAreaInsets.top || 20;
}
function getCustomNavBarHeight() {
  common_vendor.index.__f__("log", "at utils/utils.js:14", common_vendor.index.getMenuButtonBoundingClientRect(), "uni.getMenuButtonBoundingClientRect()");
  return common_vendor.index.getMenuButtonBoundingClientRect().height || 44;
}
const safeTopHeight = getSafeTopHeight();
const customNavBarHeight = getCustomNavBarHeight();
const totalSafeAreaHeight = safeTopHeight + customNavBarHeight;
const navMetrics = {
  // getSafeTopHeight,
  safeTopHeight,
  totalSafeAreaHeight,
  customNavBarHeight
};
exports.navMetrics = navMetrics;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/utils.js.map
