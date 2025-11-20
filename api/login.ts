import {get,post} from "@/utils/request";
import { LoginParams,LoginRes,SendVerifyCodeRes,LogoutRes} from './types/login'
export default class Login{

/** 
 * 用户登录
 * @param {object} params UserLoginRequest
 * @param {string} params.account 账号
 * @param {string} params.verifyCode 验证码
 * @returns
 */
    static async login(params: LoginParams) {
  return post<LoginRes>(`/auth/login`, params);
}

/** 
 * 发送登录验证码
 * @param {string} account 
  * @returns
 */
static async sendVerifyCode(account: string) {
  return post<SendVerifyCodeRes>(`/auth/send?account=${account}`);
}
/** 
 * 用户退出
 * @returns
 */
static async logout() {
  return post<LogoutRes>(`/auth/logout`);
}
}

