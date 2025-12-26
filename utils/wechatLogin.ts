/**
 * 微信小程序登录相关工具函数
 */

/**
 * 微信登录（wx.login）
 * @param loginApiUrl 登录接口地址
 * @returns Promise<string> 返回 token
 */
export const wechatLogin = async (loginApiUrl: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		// 调用 uni.login 获取登录 code
		uni.login({
			provider: 'weixin',
			success: async (loginRes) => {
				try {
					// 将登录 code 发送到后端
					const res = await uni.request({
						url: loginApiUrl,
						method: 'POST',
						header: {
							'Content-Type': 'application/json'
						},
						data: {
							code: loginRes.code // wx.login 返回的 code
						}
					})

					const data = res.data as any
					if (data.code === 200 || data.success) {
						const token = data.data?.token || data.token
						if (token) {
							// 保存 token 到本地
							uni.setStorageSync('token', token)
							resolve(token)
						} else {
							reject(new Error('未获取到 token'))
						}
					} else {
						reject(new Error(data.message || '登录失败'))
					}
				} catch (error: any) {
					reject(new Error(error.message || '登录请求失败'))
				}
			},
			fail: (err) => {
				reject(new Error(err.errMsg || '登录失败'))
			}
		})
	})
}

/**
 * 检查并确保用户已登录
 * @param loginApiUrl 登录接口地址
 * @returns Promise<string> 返回 token
 */
export const ensureLogin = async (loginApiUrl: string): Promise<string> => {
	// 先检查本地是否有 token
	const savedToken = uni.getStorageSync('token')
	if (savedToken) {
		return savedToken
	}

	// 如果没有 token，进行登录
	return await wechatLogin(loginApiUrl)
}

