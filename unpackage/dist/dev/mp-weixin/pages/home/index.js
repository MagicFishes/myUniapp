"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_utils = require("../../utils/utils.js");
if (!Array) {
  const _component_customNavBar = common_vendor.resolveComponent("customNavBar");
  const _component_customTabBar = common_vendor.resolveComponent("customTabBar");
  (_component_customNavBar + _component_customTabBar)();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const shortcuts = common_vendor.ref([
      { label: "行程管理", icon: "🧳" },
      { label: "目的地推荐", icon: "📍" },
      { label: "常用联系人", icon: "👥" }
    ]);
    const filters = common_vendor.ref([
      { label: "全部", value: "all" },
      { label: "差旅", value: "travel" },
      { label: "审批", value: "approve" }
    ]);
    const activeFilter = common_vendor.ref("all");
    const activeFilterLabel = common_vendor.computed(() => {
      const current = filters.value.find((item) => item.value === activeFilter.value);
      return current ? current.label : "";
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          showBackButton: false,
          autoBack: false,
          title: ""
        }),
        b: common_vendor.t(activeFilterLabel.value),
        c: common_vendor.f(shortcuts.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.icon),
            b: common_vendor.t(item.label),
            c: item.label
          };
        }),
        d: common_vendor.s(`margin-top: ${common_vendor.unref(utils_utils.navMetrics).totalSafeAreaHeight}px;`),
        e: common_vendor.gei(_ctx, "")
      };
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/index.js.map
