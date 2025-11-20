export interface SearchHotelsRes {
  code: string;
  message: string;
  data: {
    hotelList: {
      id: string;
      name: string;
      nameEn: string;
      code: string;
      globalHotelCode: string;
      sort: string;
      sales: string;
      status: number;
      longitude: string;
      latitude: string;
    }[];
    cityList: {
      id: number;
      pid: number;
      name: string;
      nameEn: string;
      code: string;
      path: string;
      pathName: string;
      pathNameEn: string;
      image: string;
      level: number;
      utc: string;
      hotArea: string;
      hotelCount: number;
      orderCount: number;
      sort: number;
      longitude: Record<string, unknown>;
      latitude: Record<string, unknown>;
      gmtCreate: string;
      gmtUpdate: string;
    }[];
  };
  version: string;
  timestamp: string;
}
// 参数接口
export interface GetHotelsByCityParams {
  /*城市ID */
  cityId: string;

  /*数据配置，可传多个 */
  profiles?: string[];
}

// 响应接口
export interface GetHotelsByCityRes { }
// 参数接口
export interface GetHotelLowestPricesParams {
  /*酒店 ID 列表（批量查询） */
  ids: string[];

  /*入住日期 (格式：yyyy-MM-dd) */
  checkin: string

  /*离店日期 (格式：yyyy-MM-dd) */
  checkout: string

  /*入住的成人数量 */
  adultNum: number;
}

// 响应接口
export interface GetHotelLowestPricesRes { }

// 参数接口
export interface GetHotelRatePlanDetailParams {
  /*入住时间 */
  checkin: string

  /*离店时间 */
  checkout: string

  /*成人数 */
  adultNum: number;

  /*酒店ID */
  hotelId: string;
}

// 响应接口
export interface GetHotelRatePlanDetailRes { }

// 参数接口
export interface GetHotelByIdParams {
  /*酒店ID */
  hotelId: string;

  /*数据配置，可传多个 */
  profiles?: Record<string, unknown>[];
}

// 响应接口
export interface GetHotelByIdRes { }

// 参数接口
export interface CreateHotelOrder_1Params {
  /*酒店ID */
  hotelId: string;

  /*酒店名称 */
  hotelName: string;

  /*房型ID */
  roomTypeId: string;

  /*房型名称 */
  roomTypeName: string;

  /*房价ID */
  rateId: string;

  /*支付类型 */
  payType: string;

  /*房间数 */
  roomNum: number;

  /*每间人数 */
  adultNum: number;

  /*入住时间 */
  checkIn: string;

  /*退房时间 */
  checkOut: string;
    /*信用卡代码 */
  cardCode: string;

  /*信用卡号码 */
  cardNumber: string;

  /*信用卡过期日期 */
  expireDate: string;

  /*信用卡安全码 */
  cardSecurityCode: string;
  /*入住人信息 */
  hotelOrderGuestInfo: {
    /*入住人信息列表 */
    guestInfos: {
      /*姓 */
      lastName: string;

      /*名 */
      firstName: string;
      email:string,
      /*性别 (男/女) */
      sex: string;

      /*手机号 (含区号) */
      phoneNumber: string;
      phoneArea: string
      /*同住人姓 */
      togetherLastname?: string;

      /*同住人名 */
      togetherFirstname?: string;

      /*儿童信息 */
      children?: {
        /*性别 */
        gender: string;

        /*年龄 */
        age: Record<string, unknown>;
      }[];
    }[];
  };
}

// 响应接口
export interface CreateHotelOrder_1Res { }
// 响应接口
export interface QueryBannerInfoRes {
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

    /*Banner图片 */
    bannerImages: {
      /*图片URL */
      imageUrl: string;

      /*轮播图顺序 */
      sort: number;
    }[];
  }[];
}
// 响应接口
export interface QueryHotelReferencePriceInfoRes {
  /* */
  code: string;

  /* */
  message: string;

  /* */
  success: boolean;

  /* */
  data: {
    /*携程价格 */
    ctripPrice: number;

    /*Booking价格 */
    bookingPrice: number;
  };
}
export interface QueryHotelReferencePriceInfoParams {
  hotelCode: string, 
  startAt: string, 
  endAt: string,
   peopleNum: number, 
   roomNum: number
}

