// 参数接口
export interface LoginParams {
  /*账号 */
  account: string;

  /*验证码 */
  verifyCode: string;
}

// 响应接口
export interface LoginRes {
    // data:{}
    token:string
}
// 响应接口
export interface SendVerifyCodeRes {}
// 响应接口
export interface LogoutRes {}

