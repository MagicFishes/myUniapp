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
    const uni = globalThis.uni;
    const brands = [
      { name: "Anydoor 精选", initial: "A", desc: "差旅精选供应商集合" },
      { name: "全球酒店联盟", initial: "G", desc: "全球连锁酒店合作伙伴" },
      { name: "航空伙伴", initial: "F", desc: "常旅客航空计划" }
    ];
    const pageContentStyle = common_vendor.computed(() => `margin-top: ${utils_utils.navMetrics.totalSafeAreaHeight}px;`);
    const hideSystemTabBar = () => {
      try {
        uni.hideTabBar({ animation: false });
      } catch (error) {
      }
    };
    common_vendor.onShow(() => {
      hideSystemTabBar();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "",
          showBackButton: false,
          autoBack: false
        }),
        b: common_vendor.t(brands.length),
        c: common_vendor.f(brands, (brand, k0, i0) => {
          return {
            a: common_vendor.t(brand.initial),
            b: common_vendor.t(brand.name),
            c: common_vendor.t(brand.desc),
            d: brand.name
          };
        }),
        d: common_vendor.s(pageContentStyle.value),
        e: common_vendor.p({
          active: "brand"
        }),
        f: common_vendor.gei(_ctx, "")
      };
    };
  }
});
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/brand/index.js.map
