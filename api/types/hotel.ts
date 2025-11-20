// 响应接口
export interface QueryRecommendHotelInfoRes {
  /* */
  code: string;

  /* */
  message: string;

  /* */
  success: boolean;

  /* */
  data: {
    /*酒店ID */
    hotelId: string;

    /*酒店代码 */
    hotelCode: string;

    /*酒店名称 */
    hotelName: string;

    /*酒店英文名称 */
    hotelEnName: string;

    /*酒店图片 */
    hotelImages: string;
  }[];
}

