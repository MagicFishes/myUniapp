import axios from 'axios'

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

const instance = axios.create({
	baseURL: resolveBaseURL(),
	timeout: DEFAULT_TIMEOUT,
	withCredentials: false,
	timeoutErrorMessage: TIMEOUT_MESSAGE
})

instance.interceptors.request.use(
	(config) => {
		const token = safeGetToken()
		if (token) {
			config.headers = config.headers || {}
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error) => Promise.reject(error)
)

instance.interceptors.response.use(
	(response) => {
		// 登录时从响应头获取 token 并保存
		const token = response.headers.authorization || response.headers.Authorization
		if (response?.config?.url === '/auth/login' && token) {
			safeSetToken(token)
		}
		return response
	},
	(error) => {
		const { response } = error
		if (!response) {
			return Promise.reject(error)
		}

		if (response.status === 401) {
			safeClearToken()
			if (typeof uni !== 'undefined' && uni.showToast) {
				uni.showToast({
					title: '登录会话已过期，请重新登录',
					icon: 'none'
				})
			}
			// TODO: 在此处根据实际路由跳转到登录页
			return Promise.reject(error)
		}

		if (response?.data?.message) {
			if (typeof uni !== 'undefined' && uni.showToast) {
				uni.showToast({
					title: response.data.message,
					icon: 'none'
				})
			}
		}

		return Promise.reject(error)
	}
)

export const request = (config) => instance({ ...config })

export const get = (url, params = {}, config = {}) =>
	request({
		method: 'get',
		url,
		params,
		...config
	})

export const post = (url, data = {}, config = {}) =>
	request({
		method: 'post',
		url,
		data,
		...config
	})

export const put = (url, data = {}, config = {}) =>
	request({
		method: 'put',
		url,
		data,
		...config
	})

export const del = (url, params = {}, config = {}) =>
	request({
		method: 'delete',
		url,
		params,
		...config
	})

export default instance

