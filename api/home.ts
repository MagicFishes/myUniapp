import {get,post} from "@/utils/request";
import { 
  SearchHotelsRes,
   GetHotelsByCityParams,
   GetHotelsByCityRes,
   GetHotelLowestPricesParams,
   GetHotelLowestPricesRes,
   GetHotelRatePlanDetailParams,
   GetHotelRatePlanDetailRes,
   GetHotelByIdParams,
   GetHotelByIdRes,
   CreateHotelOrder_1Params,
   CreateHotelOrder_1Res,
   QueryBannerInfoRes,
   QueryHotelReferencePriceInfoRes,
   QueryHotelReferencePriceInfoParams
  } from "@/api/types/home";
export default class Home{
    /** 
 * 城市或酒店搜索提示
 * @param {string} searchKey 
  * @returns
 */
static async searchHotels(searchKey: string) {
    return post<SearchHotelsRes>(`/youxia/hotel/suggest?searchKey=${searchKey}`);
  }
/** 
 * 根据城市 ID 查询酒店列表
 * @param {object} params YouXiaHotelCityQueryReq
 * @param {string} params.cityId 城市ID
 * @param {array} params.profiles 数据配置，可传多个
 * @returns
 */
static async getHotelsByCity(params: GetHotelsByCityParams) {
  return post<GetHotelsByCityRes>(`/youxia/hotel/getHotelsByCity`, params);
}


/** 
 * 查询酒店最低价格
 * @param {object} params YouXiaHotelLowestPriceReq
 * @param {array} params.ids 酒店 ID 列表（批量查询）
 * @param {object} params.checkin 入住日期 (格式：yyyy-MM-dd)
 * @param {object} params.checkout 离店日期 (格式：yyyy-MM-dd)
 * @param {number} params.adultNum 入住的成人数量
 * @returns
 */
static async getHotelLowestPrices(params: GetHotelLowestPricesParams) {
  return post<GetHotelLowestPricesRes>(`/youxia/hotel/lowestPrice`, params);
}

/** 
 * 获取酒店房型房价详情
 * @param {object} params YouXiaHotelRatePlanDetailReq
 * @param {object} params.checkin 入住时间
 * @param {object} params.checkout 离店时间
 * @param {number} params.adultNum 成人数
 * @param {number} params.hotelId 酒店ID
 * @returns
 */
static async getHotelRatePlanDetail(params: GetHotelRatePlanDetailParams) {
  return post<GetHotelRatePlanDetailRes>(`/youxia/hotel/ratePlanDetail`, params);
}


/** 
 * 根据酒店 ID 查询酒店详情
 * @param {object} params YouXiaHotelDetailQueryReq
 * @param {string} params.hotelId 酒店ID
 * @param {array} params.profiles 数据配置，可传多个
 * @returns
 */
static async getHotelById(params: GetHotelByIdParams) {
  return post<GetHotelByIdRes>(`/youxia/hotel/getHotelById`, params);
}


/** 
 * 创建酒店订单
 * @param {object} params CreateHotelOrderRequest
 * @param {string} params.hotelId 酒店ID
 * @param {string} params.hotelName 酒店名称
 * @param {string} params.roomTypeId 房型ID
 * @param {string} params.roomTypeName 房型名称
 * @param {string} params.rateId 房价ID
 * @param {string} params.payType 支付类型
 * @param {number} params.roomNum 房间数
 * @param {number} params.adultNum 每间人数
 * @param {object} params.checkIn 入住时间
 * @param {object} params.checkOut 退房时间
 * @param {object} params.hotelOrderGuestInfo 入住人信息
 * @returns
 */
static async createHotelOrder_1(params: CreateHotelOrder_1Params) {
  return post<CreateHotelOrder_1Res>(`/hotel/order/create`, params);
}

/** 
 * 查询Banner
 * @param {string} sectionTypeParam 
  * @returns
 */
static async queryBannerInfo(sectionTypeParam: string) {
  return get<QueryBannerInfoRes>(`/banner?sectionTypeParam=${sectionTypeParam}`);
}

/** 
 * 查询酒店参考价格
 * @param {string} hotelCode 酒店代码
  * @param {string} startAt 开始日期
  * @param {string} endAt 结束日期
  * @param {string} peopleNum 人数
  * @param {string} roomNum 房间数量
  * @returns
 */
static async queryHotelReferencePriceInfo(params:QueryHotelReferencePriceInfoParams) {
  return get<QueryHotelReferencePriceInfoRes>(`/hotel/reference/price`,params);
}
}

