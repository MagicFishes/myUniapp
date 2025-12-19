// uniapp 使用 uni.request 而不是 axios
const DEFAULT_TIMEOUT = 120000
const STORAGE_TOKEN_KEY = 'token'
const TIMEOUT_MESSAGE = '系统出错了，已经自动提交到管理员那里，请等待修复。'

const resolveBaseURL = () => {
	if (import.meta?.env?.VITE_BASE_URL) {
		return import.meta.env.VITE_BASE_URL
	}
	if (import.meta?.env?.VITE_URL) {
		return import.meta.env.VITE_URL
	}
	return ''
}

const safeGetToken = () => {
	try {
		if (typeof uni !== 'undefined' && uni.getStorageSync) {
			return uni.getStorageSync(STORAGE_TOKEN_KEY) || ''
		}
		if (typeof localStorage !== 'undefined') {
			return localStorage.getItem(STORAGE_TOKEN_KEY) || ''
		}
	} catch (error) {
		console.warn('get token failed', error)
	}
	return ''
}

const safeSetToken = (token) => {
	try {
		if (typeof uni !== 'undefined' && uni.setStorageSync) {
			uni.setStorageSync(STORAGE_TOKEN_KEY, token)
			return
		}
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_TOKEN_KEY, token)
		}
	} catch (error) {
		console.warn('set token failed', error)
	}
}

const safeClearToken = () => {
	try {
		if (typeof uni !== 'undefined' && uni.removeStorageSync) {
			uni.removeStorageSync(STORAGE_TOKEN_KEY)
			return
		}
		if (typeof localStorage !== 'undefined') {
			localStorage.removeItem(STORAGE_TOKEN_KEY)
		}
	} catch (error) {
		console.warn('clear token failed', error)
	}
}

// 处理 401 错误
const handle401 = () => {
	safeClearToken()
	if (typeof uni !== 'undefined' && uni.showToast) {
		uni.showToast({
			title: '登录会话已过期，请重新登录',
			icon: 'none'
		})
	}
	// TODO: 在此处根据实际路由跳转到登录页
	// if (typeof uni !== 'undefined' && uni.reLaunch) {
	//   uni.reLaunch({
	//     url: '/pages/login/index'
	//   })
	// }
}

// 将 uni.request 封装成类似 axios 的接口
const request = (config) => {
	const baseURL = resolveBaseURL()
	const token = safeGetToken()
	
	// 构建完整的 URL
	let url = config.url
	if (baseURL && !url.startsWith('http://') && !url.startsWith('https://')) {
		url = baseURL + url
	}
	
	// 合并 params 和 url 中已有的 query 参数（GET 请求）
	if ((config.method === 'get' || config.method === 'GET') && config.params) {
		const queryString = Object.keys(config.params)
			.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(config.params[key])}`)
			.join('&')
		if (queryString) {
			url += (url.includes('?') ? '&' : '?') + queryString
		}
	}
	
	// 构建请求头
	const headers = {
		'Content-Type': 'application/json',
		...(config.headers || {})
	}
	
	if (token) {
		headers.Authorization = `Bearer ${token}`
	}
	
	// 处理请求数据
	const data = config.data || {}
	
	return new Promise((resolve) => {
		uni.request({
			url,
			method: config.method || 'GET',
			data,
			header: headers,
			timeout: config.timeout || DEFAULT_TIMEOUT,
			success: (res) => {
				console.log('uni.request success response:', res)
				console.log('response data:', res.data)
				
				// 登录时从响应头获取 token 并保存
				const responseToken = res.header?.authorization || res.header?.Authorization
				if (config.url === '/auth/login' && responseToken) {
					safeSetToken(responseToken)
				}
				
				// 统一处理响应格式，使其与 axios 响应格式类似
				const response = {
					data: res.data, // 这里直接返回接口的原始数据，不做任何处理
					status: res.statusCode,
					statusText: res.statusCode === 200 ? 'OK' : 'Error',
					headers: res.header,
					config: config
				}
				
				console.log('final response:', response)
				resolve(response)
			},
			fail: (err) => {
				console.log('error', err)
				
				const errorResponse = {
					success: false,
					code: err.statusCode || 500,
					message: err.errMsg || '网络请求失败',
					data: null
				}
				
				console.log('errorResponse', errorResponse)
				
				// 401 错误处理
				if (errorResponse.code === 401) {
					handle401()
					// 返回 resolved Promise（与 request.ts 保持一致）
					return resolve({
						...err,
						data: errorResponse,
						status: 401
					})
				}
				
				// 强制返回 resolved Promise（与 request.ts 保持一致）
				resolve({
					...err,
					data: errorResponse,
					status: errorResponse.code
				})
			}
		})
	}).then(response => {
		console.log('response interceptor received:', response)
		// 处理响应中的错误状态码（HTTP 状态码）
		if (response.status >= 200 && response.status < 300) {
			// HTTP 请求成功，直接返回响应（业务逻辑的成功/失败由业务代码判断）
			console.log('HTTP success, returning response as-is')
			return response
		} else {
			// HTTP 状态码错误，但保留原始响应数据，让业务代码判断如何处理
			// 如果原始响应数据为空或无效，才构造错误响应
			const originalData = response.data
			let errorResponse
			
			// 如果原始数据已经是错误格式（有 success 字段），直接使用
			if (originalData && typeof originalData === 'object' && 'success' in originalData) {
				errorResponse = originalData
			} else {
				// 否则构造错误响应，但保留原始数据
				const statusMessages = {
					400: '请求参数错误',
					401: '未授权，请重新登录',
					403: '拒绝访问',
					404: '请求的资源不存在',
					500: '服务器内部错误',
					502: '网关错误，服务器暂时不可用',
					503: '服务暂时不可用',
					504: '网关超时'
				}
				
				errorResponse = {
					success: false,
					code: response.status || 500,
					message: originalData?.message || statusMessages[response.status] || '请求失败',
					data: originalData || null
				}
			}
			
			console.log('errorResponse', errorResponse)
			
			if (errorResponse.code === 401) {
				handle401()
			}
			
			// 强制返回 resolved Promise（与 request.ts 保持一致），但保留原始响应结构
			return {
				...response,
				data: errorResponse
			}
		}
	})
}

// 导出常用函数

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 * @param headers
 * @param responseType
 */
export function post(url, data = {}, params = {}, headers = {}, responseType = undefined) {
	return request({
		method: 'post',
		url,
		data,
		params,
		headers,
		responseType
	})
}

/**
 * @param {string} url
 * @param {object} params
 * @param headers
 * @param responseType
 */
export function get(url, params = {}, headers = {}, responseType = undefined) {
	return request({
		method: 'get',
		url,
		params,
		headers,
		responseType
	})
}

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 * @param headers
 */
export function put(url, data = {}, params = {}, headers = {}) {
	return request({
		method: 'put',
		url,
		data,
		params,
		headers
	})
}

/**
 * @param {string} url
 * @param {object} params
 * @param {object} data
 * @param headers
 */
export function _delete(url, params = {}, data = {}, headers = {}) {
	return request({
		method: 'delete',
		url,
		params,
		data,
		headers
	})
}

// 为了保持向后兼容，也导出 del
export const del = _delete

export default {
	request,
	get,
	post,
	put,
	delete: _delete,
	del
}