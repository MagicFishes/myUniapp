import {get,post} from '@/utils/request'
import { QueryRecommendHotelInfoRes} from './types/hotel'

export interface GetHotelsByCityParams {
  cityId: string | number;
  profiles?: string[];
}

export interface GetHotelsByCityRes {
  success: boolean;
  data: any[];
  message?: string;
}

export interface GetHotelLowestPricesParams {
  ids: (string | number)[];
  checkin: string;
  checkout: string;
  adultNum: number;
}

export interface GetHotelLowestPricesRes {
  success: boolean;
  data: Array<{
    id: string | number;
    minPrice?: number | null;
    initPriceUnit?: string;
  }>;
  message?: string;
}

export default class Hotel{
    /** 
 * 查询推荐酒店信息
 * @param {string} sectionTypeParam 内容模块类型
  * @returns
 */
static async queryRecommendHotelInfo(sectionTypeParam: string) {
  return get<QueryRecommendHotelInfoRes>(`/hotel/recommend?sectionTypeParam=${sectionTypeParam}`);
}

/**
 * 根据城市 ID 查询酒店列表
 * @param {object} params
 * @param {string|number} params.cityId 城市ID
 * @param {array} params.profiles 数据配置，可传多个
 * @returns
 */
static async getHotelsByCity(params: GetHotelsByCityParams) {
  return post<GetHotelsByCityRes>(`/youxia/hotel/getHotelsByCity`, params);
}

/**
 * 查询酒店最低价格
 * @param {object} params
 * @param {array} params.ids 酒店 ID 列表（批量查询）
 * @param {string} params.checkin 入住日期 (格式：yyyy-MM-dd)
 * @param {string} params.checkout 离店日期 (格式：yyyy-MM-dd)
 * @param {number} params.adultNum 入住的成人数量
 * @returns
 */
static async getHotelLowestPrices(params: GetHotelLowestPricesParams) {
  return post<GetHotelLowestPricesRes>(`/youxia/hotel/lowestPrice`, params);
}
}

