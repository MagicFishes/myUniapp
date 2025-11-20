import {get,post} from "@/utils/request";
import { QueryActivityBaseInfoRes,QueryActivityInfoByIdRes} from './types/promotions'
export default class Promotions{
    /** 
 * 查询活动信息
 * @param {string} sectionTypeParam 内容模块类型
  * @returns
 */
static async  queryActivityBaseInfo(sectionTypeParam: string) {
  return get<QueryActivityBaseInfoRes>(`/activity?sectionTypeParam=${sectionTypeParam}`);
}

/** 
 * 查询活动详细信息
 * @param {string} id 
  * @returns
 */
static async  queryActivityInfoById(id: string) {
  return get<QueryActivityInfoByIdRes>(`/activity/${id}`);
}



}

