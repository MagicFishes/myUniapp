"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_utils = require("../../utils/utils.js");
if (!Array) {
  const _easycom_up_swiper2 = common_vendor.resolveComponent("up-swiper");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _component_customTabBar = common_vendor.resolveComponent("customTabBar");
  (_easycom_up_swiper2 + _easycom_uni_icons2 + _component_customTabBar)();
}
const _easycom_up_swiper = () => "../../uni_modules/uview-plus/components/u-swiper/u-swiper.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_up_swiper + _easycom_uni_icons + ChooseTimeData + HotelItem)();
}
const ChooseTimeData = () => "../../components/choose-time-data/index.js";
const HotelItem = () => "../../components/hotel-item/index.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at pages/home/index.vue:71", "首页显示");
    });
    const list1 = common_vendor.reactive([
      "https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg",
      "https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg",
      "https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg",
      "https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg",
      "https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg"
    ]);
    const hotelItemList = common_vendor.reactive([
      {
        id: 1,
        // 添加 id 字段
        image: "https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg",
        name: "酒店名称1",
        price: "100",
        label: ["住3付2", "享奢旅积分", "享奢旅积分", "享奢旅积分", "享奢旅积分"]
      },
      {
        id: 2,
        // 添加 id 字段
        image: "https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg",
        name: "酒店名称2",
        price: "200",
        label: ["住3付2", "享奢旅积分"]
      },
      {
        id: 3,
        // 添加 id 字段
        image: "https://cos.anydoorcloud.com/wusuowei/website/2025-05-19/f34edf1e08494879a9909c3ec90c86fa.jpg",
        name: "酒店名称3",
        price: "300",
        label: ["住3付2", "享奢旅积分"]
      }
    ]);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          circular: true,
          indicatorMode: "dot",
          indicatorStyle: {
            bottom: "130rpx",
            right: "50rpx"
          },
          indicator: true,
          height: "600rpx",
          list: list1,
          mode: "aspectFill"
        }),
        b: common_vendor.p({
          type: "location",
          size: "20",
          color: "#999"
        }),
        c: common_vendor.p({
          height: 100
        }),
        d: common_vendor.p({
          type: "search",
          size: "20",
          color: "#999"
        }),
        e: common_vendor.f(hotelItemList, (item, index, i0) => {
          return {
            a: "4978fed5-4-" + i0,
            b: common_vendor.p({
              item
            }),
            c: item.id || index
          };
        }),
        f: `${common_vendor.unref(utils_utils.navMetrics).bottomNavHeight}px`,
        g: common_vendor.gei(_ctx, "")
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4978fed5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/index.js.map
