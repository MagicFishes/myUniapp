"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  props: {
    item: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      var _a, _b, _c, _d;
      return {
        a: ((_a = props.item) == null ? void 0 : _a.image) || "https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg",
        b: common_vendor.t(((_b = props.item) == null ? void 0 : _b.name) || "未命名"),
        c: common_vendor.t(((_c = props.item) == null ? void 0 : _c.price) || "0"),
        d: common_vendor.f(((_d = props.item) == null ? void 0 : _d.label) || [], (label, index, i0) => {
          return {
            a: common_vendor.t(label),
            b: index
          };
        }),
        e: common_vendor.gei(_ctx, "")
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-89fc403d"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/hotel-item/index.js.map
