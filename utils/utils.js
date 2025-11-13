/**
 * 获取顶部安全区域的高度（单位：px）
 * 优先使用 safeAreaInsets.top，兼容低版本则回退到状态栏高度。
 */
// 顶部状态栏高度
function getSafeTopHeight() {
  const safeAreaInsets = uni.getSystemInfoSync().safeAreaInsets;
  console.log(safeAreaInsets, 'safeAreaInsets')
  return safeAreaInsets.top || 20;
}
// 自定义导航栏高度
function getCustomNavBarHeight() {
  // return 44
  console.log(uni.getMenuButtonBoundingClientRect(), 'uni.getMenuButtonBoundingClientRect()')
  return uni.getMenuButtonBoundingClientRect().height|| 44;
}
// 获取顶部安全区域的高度（单位：px）
const safeTopHeight = getSafeTopHeight();
const customNavBarHeight = getCustomNavBarHeight();
const totalSafeAreaHeight = safeTopHeight + customNavBarHeight;
export default {
  // getSafeTopHeight,
  safeTopHeight,
  totalSafeAreaHeight,
  customNavBarHeight
};
