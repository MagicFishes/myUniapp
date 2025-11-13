"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_utils = require("../../utils/utils.js");
if (!Array) {
  const _easycom_u_icon2 = common_vendor.resolveComponent("u-icon");
  _easycom_u_icon2();
}
const _easycom_u_icon = () => "../../uni_modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  _easycom_u_icon();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    title: { default: "" },
    background: { default: "#ffffff" },
    safeAreaInsetTop: { type: Boolean, default: true },
    showBackButton: { type: Boolean, default: true },
    autoBack: { type: Boolean, default: true }
  },
  emits: ["back"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { title, background, safeAreaInsetTop, showBackButton, autoBack } = common_vendor.toRefs(props);
    const navBarStyle = common_vendor.computed(() => {
      const safeTopHeight = safeAreaInsetTop.value ? utils_utils.navMetrics.safeTopHeight : 0;
      const totalHeight = safeTopHeight + utils_utils.navMetrics.customNavBarHeight;
      return {
        backgroundColor: background.value,
        height: `${totalHeight}px`,
        paddingTop: `${safeTopHeight}px`
      };
    });
    const uni = globalThis.uni;
    const handleBack = () => {
      emit("back");
      if (!showBackButton.value) {
        return;
      }
      if (autoBack.value && (uni == null ? void 0 : uni.navigateBack)) {
        uni.navigateBack({
          delta: 1
        });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(showBackButton)
      }, common_vendor.unref(showBackButton) ? {
        b: common_vendor.p({
          name: "arrow-left",
          size: "24",
          color: "#222222"
        })
      } : {}, {
        c: !common_vendor.unref(showBackButton) ? 1 : "",
        d: common_vendor.o(handleBack),
        e: common_vendor.t(common_vendor.unref(title)),
        f: common_vendor.s(navBarStyle.value),
        g: common_vendor.gei(_ctx, "")
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/custom-nav-bar/index.js.map
