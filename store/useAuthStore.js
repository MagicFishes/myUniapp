import { defineStore } from 'pinia'

const USER_PHONE_KEY = 'userPhone' // 存储用户手机号的key

export const useAuthStore = defineStore('auth', {
	state: () => ({
		showAuthModal: false, // 授权弹窗显示状态
		onAuthSuccess: null, // 授权成功回调函数
	}),
	getters: {
		// 检查是否已经授权过
		isAuthorized: () => {
			try {
				const userPhone = uni.getStorageSync(USER_PHONE_KEY)
				return !!userPhone
			} catch (error) {
				console.error('检查用户授权状态失败:', error)
				return false
			}
		},
		// 获取已保存的手机号授权信息
		getPhoneAuth: () => {
			try {
				return uni.getStorageSync(USER_PHONE_KEY) || null
			} catch (error) {
				console.error('获取手机号授权信息失败:', error)
				return null
			}
		}
	},
	actions: {
		// 设置授权弹窗显示状态
		setShowAuthModal(show) {
			this.showAuthModal = show
		},
		// 显示授权弹窗
		showAuthPopup(callback = null) {
			this.onAuthSuccess = callback
			this.showAuthModal = true
		},
		// 隐藏授权弹窗
		hideAuthPopup() {
			this.showAuthModal = false
		},
		// 保存手机号授权信息
		savePhoneAuth(phoneData) {
			try {
				uni.setStorageSync(USER_PHONE_KEY, phoneData)
				console.log('💾 手机号授权信息已保存:', phoneData)
			} catch (error) {
				console.error('保存手机号授权信息失败:', error)
			}
		},
		// 清除授权信息
		clearAuth() {
			try {
				uni.removeStorageSync(USER_PHONE_KEY)
				console.log('✅ 授权信息已清除')
				uni.showToast({
					title: '已清除授权信息',
					icon: 'success'
				})
			} catch (error) {
				console.error('清除授权信息失败:', error)
			}
		},
		// 检查授权状态，如果未授权则显示弹窗
		checkAndShowAuth(callback = null) {
			if (!this.isAuthorized) {
				this.showAuthPopup(callback)
				return false
			}
			return true
		}
	}
})

