import { get, post } from "@/utils/request";
import {
    QueryHotelOrderInfoRes,
    QueryHotelOrderInfoParams
} from "@/api/types/searchHotelForm";
export default class searchHotelForm {
/** 
 * 查询酒店订单详情
 * @param {string} orderNo 订单编号
  * @param {string} checkIn 入住时间
  * @param {string} firstName 名
  * @param {string} lastName 姓
  * @returns
 */
static async queryHotelOrderInfo(params:QueryHotelOrderInfoParams) {
  return get<QueryHotelOrderInfoRes>(`/hotel/order`,params);
}
}

