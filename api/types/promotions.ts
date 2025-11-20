// 响应接口
export interface QueryActivityBaseInfoRes {
  /* */
  code: string;

  /* */
  message: string;

  /* */
  success: boolean;

  /* */
  data: {
    /*活动页头图 */
    bannerImageUrl: string;

    /*活动标题 */
    activityTitle: string;

    /*活动顺序 */
    sort: number;
  }[];
}
// 响应接口
export interface QueryActivityInfoByIdRes {
  activityContents: any;
  /* */
  code: string;

  /* */
  message: string;

  /* */
  success: boolean;

  /* */
  data: {
    /*内容模块类型 */
    sectionType: string;

    /*活动内容 */
    activityContents: {
      /*活动页头图 */
      bannerImageUrl: string;

      /*活动标题 */
      activityTitle: string;

      /*活动描述 */
      activityDesc: string;

      /*活动内容 */
      activityContent: string;

      /*活动酒店信息 */
      activityHotelInfos: {
        /*酒店ID */
        hotelId: string;

        /*酒店名称 */
        hotelName: string;

        /*酒店图片 */
        hotelImage: string;
      }[];

      /*活动顺序 */
      sort: number;
    }[];
  };
}

