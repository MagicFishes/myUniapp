"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_utils = require("../../utils/utils.js");
if (!Array) {
  const _component_customNavBar = common_vendor.resolveComponent("customNavBar");
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  const _component_customTabBar = common_vendor.resolveComponent("customTabBar");
  (_component_customNavBar + _easycom_u_icon2 + _component_customTabBar)();
}
const _easycom_u_icon = () => "../../uni_modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  _easycom_u_icon();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const uni = globalThis.uni;
    const actions = [
      { label: "订单记录", icon: "📄" },
      { label: "发票管理", icon: "🧾" },
      { label: "常用出行人", icon: "👤" }
    ];
    const pageContentStyle = common_vendor.computed(() => `margin-top: ${utils_utils.navMetrics.totalSafeAreaHeight}px;`);
    const handleEdit = () => {
      uni.showToast({
        title: "编辑资料功能开发中",
        icon: "none"
      });
    };
    const hideSystemTabBar = () => {
      try {
        uni.hideTabBar({ animation: false });
      } catch (error) {
      }
    };
    common_vendor.onMounted(hideSystemTabBar);
    common_vendor.onShow(hideSystemTabBar);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "",
          showBackButton: false,
          autoBack: false
        }),
        b: common_vendor.p({
          name: "edit-pen",
          size: "30",
          color: "#007aff"
        }),
        c: common_vendor.o(handleEdit),
        d: common_vendor.f(actions, (action, k0, i0) => {
          return {
            a: common_vendor.t(action.icon),
            b: common_vendor.t(action.label),
            c: action.label
          };
        }),
        e: common_vendor.s(pageContentStyle.value),
        f: common_vendor.p({
          active: "mine"
        }),
        g: common_vendor.gei(_ctx, "")
      };
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/index.js.map
