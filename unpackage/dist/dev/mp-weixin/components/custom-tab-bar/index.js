"use strict";
const common_vendor = require("../../common/vendor.js");
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
    items: { default: () => [
      {
        key: "home",
        text: "首页",
        path: "/pages/home/index",
        pagePath: "pages/home/index",
        iconPath: "/static/tabbar/home.png",
        selectedIconPath: "/static/tabbar/home-active.png"
      },
      {
        key: "brand",
        text: "品牌",
        path: "/pages/brand/index",
        pagePath: "pages/brand/index",
        iconPath: "/static/tabbar/brand.png",
        selectedIconPath: "/static/tabbar/brand-active.png"
      },
      {
        key: "mine",
        text: "我的",
        path: "/pages/mine/index",
        pagePath: "pages/mine/index",
        iconPath: "/static/tabbar/mine.png",
        selectedIconPath: "/static/tabbar/mine-active.png"
      }
    ] },
    active: { default: "" },
    color: { default: "#666666" },
    activeColor: { default: "#007aff" },
    background: { default: "#ffffff" },
    iconSize: { default: 44 },
    border: { type: Boolean, default: true },
    hideSystemTabBar: { type: Boolean, default: true }
  },
  emits: ["change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    var _a, _b, _c;
    const props = __props;
    const emit = __emit;
    const getPlatformApi = () => globalThis.uni || globalThis.wx || void 0;
    const safeBottom = common_vendor.ref(0);
    try {
      const api = getPlatformApi();
      const systemInfo = (_a = api == null ? void 0 : api.getSystemInfoSync) == null ? void 0 : _a.call(api);
      safeBottom.value = ((_b = systemInfo == null ? void 0 : systemInfo.safeAreaInsets) == null ? void 0 : _b.bottom) ?? Math.max(
        0,
        ((systemInfo == null ? void 0 : systemInfo.screenHeight) ?? 0) - (((_c = systemInfo == null ? void 0 : systemInfo.safeArea) == null ? void 0 : _c.bottom) ?? (systemInfo == null ? void 0 : systemInfo.screenHeight) ?? 0)
      );
    } catch (error) {
      safeBottom.value = 0;
    }
    const currentRoute = common_vendor.computed(() => {
      var _a2;
      try {
        const pages = getCurrentPages();
        return (_a2 = pages[pages.length - 1]) == null ? void 0 : _a2.route;
      } catch (error) {
        return "";
      }
    });
    const normalizePath = (path) => {
      if (!path)
        return "";
      return path.startsWith("/") ? path : `/${path}`;
    };
    const resolveItemPath = (item) => {
      return normalizePath(item.path || item.pagePath);
    };
    const resolvedActive = common_vendor.computed(() => {
      if (props.active) {
        return props.active;
      }
      const currentPath = normalizePath(currentRoute.value);
      const matched = props.items.find((item) => resolveItemPath(item) === currentPath);
      return (matched == null ? void 0 : matched.key) ?? "";
    });
    const hideSystemTabBar = () => {
      var _a2, _b2;
      if (!props.hideSystemTabBar)
        return;
      try {
        (_b2 = (_a2 = getPlatformApi()) == null ? void 0 : _a2.hideTabBar) == null ? void 0 : _b2.call(_a2, { animation: false });
      } catch (error) {
      }
    };
    hideSystemTabBar();
    common_vendor.watch(
      () => resolvedActive.value,
      () => {
        hideSystemTabBar();
      }
    );
    const handleSelect = (item) => {
      var _a2;
      const targetPath = resolveItemPath(item);
      const currentPath = normalizePath(currentRoute.value);
      const isCurrentRoute = currentPath && targetPath && currentPath === targetPath;
      const currentActive = resolvedActive.value;
      if (currentActive === item.key) {
        emit("change", item.key);
        return;
      }
      emit("change", item.key);
      if (!targetPath || isCurrentRoute) {
        return;
      }
      const api = getPlatformApi();
      const tryNavigate = (method) => {
        const fn = api == null ? void 0 : api[method];
        if (typeof fn === "function") {
          try {
            fn({ url: targetPath });
            return true;
          } catch (error) {
            return false;
          }
        }
        return false;
      };
      try {
        (_a2 = api == null ? void 0 : api.switchTab) == null ? void 0 : _a2.call(api, {
          url: targetPath,
          fail: () => {
            if (tryNavigate("reLaunch"))
              return;
            tryNavigate("navigateTo");
          }
        });
      } catch (error) {
        if (tryNavigate("reLaunch"))
          return;
        tryNavigate("navigateTo");
      }
    };
    __expose({
      hideSystemTabBar
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(_ctx.items, (item, k0, i0) => {
          return common_vendor.e({
            a: item.iconPath
          }, item.iconPath ? {
            b: resolvedActive.value === item.key ? item.selectedIconPath || item.iconPath : item.iconPath
          } : item.icon ? {
            d: "14e78f5e-0-" + i0,
            e: common_vendor.p({
              name: resolvedActive.value === item.key ? item.activeIcon || item.icon : item.icon,
              size: _ctx.iconSize,
              color: resolvedActive.value === item.key ? _ctx.activeColor : _ctx.color
            })
          } : {}, {
            c: item.icon,
            f: "icon-" + i0,
            g: common_vendor.r("icon", {
              item,
              isActive: resolvedActive.value === item.key
            }, i0),
            h: common_vendor.t(item.text),
            i: resolvedActive.value === item.key ? _ctx.activeColor : _ctx.color,
            j: item.key,
            k: resolvedActive.value === item.key ? 1 : "",
            l: common_vendor.o(($event) => handleSelect(item), item.key)
          });
        }),
        b: safeBottom.value > 0
      }, safeBottom.value > 0 ? {
        c: safeBottom.value + "px"
      } : {}, {
        d: _ctx.border ? 1 : "",
        e: _ctx.background,
        f: common_vendor.gei(_ctx, "")
      });
    };
  }
});
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/custom-tab-bar/index.js.map
