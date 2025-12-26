/**
 * 微信小程序授权相关工具函数
 */

/**
 * 上传头像到服务器
 * @param filePath 头像临时文件路径
 * @param uploadUrl 上传接口地址
 * @param token 用户 token（可选）
 * @returns Promise<string> 返回服务器返回的头像 URL
 */
export const uploadAvatar = async (
	filePath: string,
	uploadUrl: string,
	token?: string
): Promise<string> => {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: uploadUrl,
			filePath: filePath,
			name: 'avatar',
			header: token
				? {
						Authorization: 'Bearer ' + token
					}
				: {},
			success: (res) => {
				try {
					const data = JSON.parse(res.data as string)
					if (data.code === 200 || data.success) {
						resolve(data.data?.avatarUrl || data.data?.url || data.url)
					} else {
						reject(new Error(data.message || '上传失败'))
					}
				} catch (e) {
					reject(new Error('解析响应数据失败'))
				}
			},
			fail: (err) => {
				reject(new Error(err.errMsg || '上传失败'))
			}
		})
	})
}

/**
 * 获取手机号（通过后端接口）
 * @param code 微信返回的 code
 * @param apiUrl 后端接口地址
 * @param token 用户 token（可选）
 * @returns Promise<string> 返回手机号
 */
export const getPhoneNumber = async (
	code: string,
	apiUrl: string,
	token?: string
): Promise<string> => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: apiUrl,
			method: 'POST',
			header: {
				'Content-Type': 'application/json',
				...(token ? { Authorization: 'Bearer ' + token } : {})
			},
			data: {
				code: code
			},
			success: (res) => {
				const data = res.data as any
				if (data.code === 200 || data.success) {
					resolve(
						data.data?.phoneNumber ||
							data.data?.phone ||
							data.phoneNumber ||
							data.phone
					)
				} else {
					reject(new Error(data.message || '获取手机号失败'))
				}
			},
			fail: (err) => {
				reject(new Error(err.errMsg || '请求失败'))
			}
		})
	})
}

/**
 * 处理选择头像事件
 * @param e 事件对象
 * @param uploadUrl 上传接口地址
 * @param token 用户 token（可选）
 * @returns Promise<string> 返回上传后的头像 URL
 */
export const handleChooseAvatar = async (
	e: any,
	uploadUrl: string,
	token?: string
): Promise<string> => {
	const { avatarUrl } = e.detail
	if (!avatarUrl) {
		throw new Error('未获取到头像')
	}
	return await uploadAvatar(avatarUrl, uploadUrl, token)
}

/**
 * 处理获取手机号事件
 * @param e 事件对象
 * @param apiUrl 后端接口地址
 * @param token 用户 token（可选）
 * @returns Promise<string> 返回手机号
 */
export const handleGetPhoneNumber = async (
	e: any,
	apiUrl: string,
	token?: string
): Promise<string> => {
	// 用户拒绝授权
	if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
		throw new Error('用户拒绝授权')
	}

	const { code } = e.detail
	if (!code) {
		throw new Error('获取 code 失败')
	}

	return await getPhoneNumber(code, apiUrl, token)
}

