import {get,post} from '@/utils/request'
import { QueryRecommendHotelInfoRes} from './types/hotel'
export default class Hotel{
    /** 
 * 查询推荐酒店信息
 * @param {string} sectionTypeParam 内容模块类型
  * @returns
 */
static async queryRecommendHotelInfo(sectionTypeParam: string) {
  return get<QueryRecommendHotelInfoRes>(`/hotel/recommend?sectionTypeParam=${sectionTypeParam}`);
}
}

