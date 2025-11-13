"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const uni_modules_uviewPlus_index = require("./uni_modules/uview-plus/index.js");
const store_index = require("./store/index.js");
if (!Math) {
  "./pages/home/index.js";
  "./pages/brand/index.js";
  "./pages/mine/index.js";
  "./subpackages/order/pages/detail/index.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("warn", "at App.vue:4", "当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！");
    common_vendor.index.__f__("log", "at App.vue:5", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:8", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:11", "App Hide");
  },
  onload: function() {
    common_vendor.index.__f__("log", "at App.vue:14", "App Onload");
  }
};
const customNavBar = () => "./components/custom-nav-bar/index.js";
const customTabBar = () => "./components/custom-tab-bar/index.js";
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(store_index.pinia);
  app.use(uni_modules_uviewPlus_index.uviewPlus);
  app.component("customNavBar", customNavBar);
  app.component("customTabBar", customTabBar);
  return {
    app,
    pinia: store_index.pinia
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
