<template>
	<view class="page">
		<customNavBar title="个人信息" />
		
		<view class="content">
			<!-- 头像选择 -->
			<view class="info-item">
				<text class="label">头像</text>
				<view class="avatar-wrapper">
					<!-- 微信小程序使用 button 包裹，通过 open-type="chooseAvatar" 获取头像 -->
					<!-- #ifdef MP-WEIXIN -->
					<button 
						class="avatar-btn" 
						open-type="chooseAvatar" 
						@chooseavatar="onChooseAvatar"
					>
						<image 
							v-if="avatarUrl" 
							:src="avatarUrl" 
							class="avatar-image"
							mode="aspectFill"
						/>
						<view v-else class="avatar-placeholder">
							<text>点击选择头像</text>
						</view>
					</button>
					<!-- #endif -->
					
					<!-- 其他平台使用普通选择 -->
					<!-- #ifndef MP-WEIXIN -->
					<view class="avatar-btn" @click="chooseImage">
						<image 
							v-if="avatarUrl" 
							:src="avatarUrl" 
							class="avatar-image"
							mode="aspectFill"
						/>
						<view v-else class="avatar-placeholder">
							<text>点击选择头像</text>
						</view>
					</view>
					<!-- #endif -->
				</view>
			</view>

			<!-- 手机号获取 -->
			<view class="info-item">
				<text class="label">手机号</text>
				<view class="phone-wrapper">
					<text v-if="phoneNumber" class="phone-text">{{ phoneNumber }}</text>
					<!-- 微信小程序使用 button 包裹，通过 open-type="getPhoneNumber" 获取手机号 -->
					<!-- #ifdef MP-WEIXIN -->
					<button 
						v-else
						class="phone-btn" 
						open-type="getPhoneNumber" 
						@getphonenumber="onGetPhoneNumber"
					>
						获取手机号
					</button>
					<!-- #endif -->
					
					<!-- 其他平台 -->
					<!-- #ifndef MP-WEIXIN -->
					<view v-else class="phone-btn" @click="inputPhone">
						<text>输入手机号</text>
					</view>
					<!-- #endif -->
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 头像 URL
const avatarUrl = ref<string>('')
// 手机号
const phoneNumber = ref<string>('')
// 用户 token（登录后获取）
const token = ref<string>('')

// 页面加载时进行登录
onMounted(() => {
	// 检查是否已有 token
	const savedToken = uni.getStorageSync('token')
	if (savedToken) {
		token.value = savedToken
	} else {
		// 如果没有 token，进行登录
		login()
	}
})

// 用户登录（使用 wx.login）
const login = async () => {
	try {
		// 调用 uni.login 获取登录 code
		const loginRes = await new Promise<UniApp.LoginRes>((resolve, reject) => {
			uni.login({
				provider: 'weixin',
				success: resolve,
				fail: reject
			})
		})

		// 将登录 code 发送到后端，获取 token
		const res = await uni.request({
			url: 'https://your-api.com/user/login', // 替换为你的登录接口
			method: 'POST',
			header: {
				'Content-Type': 'application/json'
			},
			data: {
				code: loginRes.code // wx.login 返回的 code
			}
		})

		const loginData = res.data as any
		if (loginData.code === 200) {
			token.value = loginData.data.token
			// 保存 token 到本地
			uni.setStorageSync('token', token.value)
		}
	} catch (error: any) {
		console.error('登录失败:', error)
		// 登录失败不影响页面使用，可以稍后重试
	}
}

// 微信小程序选择头像
const onChooseAvatar = (e: any) => {
	console.log('选择头像事件:', e)
	const { avatarUrl: tempAvatarUrl } = e.detail
	avatarUrl.value = tempAvatarUrl
	
	// 如果需要上传到服务器
	uploadAvatar(tempAvatarUrl)
}

// 上传头像到服务器
const uploadAvatar = async (filePath: string) => {
	try {
		uni.showLoading({ title: '上传中...' })
		
		// 使用 uni.uploadFile 上传头像
		const uploadRes = await new Promise<any>((resolve, reject) => {
			uni.uploadFile({
				url: 'https://your-api.com/upload/avatar', // 替换为你的上传接口
				filePath: filePath,
				name: 'avatar',
				header: {
					// 添加必要的请求头，如 token
					// 'Authorization': 'Bearer ' + token
				},
				success: (res) => {
					try {
						const data = JSON.parse(res.data)
						resolve(data)
					} catch (e) {
						reject(e)
					}
				},
				fail: (err) => {
					reject(err)
				}
			})
		})
		
		uni.hideLoading()
		
		if (uploadRes.code === 200) {
			// 保存服务器返回的头像 URL
			avatarUrl.value = uploadRes.data.avatarUrl
			uni.showToast({
				title: '头像上传成功',
				icon: 'success'
			})
		} else {
			throw new Error(uploadRes.message || '上传失败')
		}
	} catch (error: any) {
		uni.hideLoading()
		uni.showToast({
			title: error.message || '上传失败',
			icon: 'none'
		})
	}
}

// 其他平台选择图片
const chooseImage = () => {
	uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			avatarUrl.value = res.tempFilePaths[0]
			uploadAvatar(res.tempFilePaths[0])
		}
	})
}

// 微信小程序获取手机号
const onGetPhoneNumber = async (e: any) => {
	console.log('获取手机号事件:', e)
	
	// 用户拒绝授权
	if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
		uni.showToast({
			title: '用户拒绝授权',
			icon: 'none'
		})
		return
	}
	
	// 检查是否已登录
	if (!token.value) {
		uni.showToast({
			title: '请先登录',
			icon: 'none'
		})
		// 尝试重新登录
		await login()
		if (!token.value) {
			return
		}
	}
	
	// 获取 getPhoneNumber 返回的 code（与 wx.login 的 code 不同）
	const { code } = e.detail
	
	if (!code) {
		uni.showToast({
			title: '获取手机号失败',
			icon: 'none'
		})
		return
	}
	
	try {
		uni.showLoading({ title: '获取中...' })
		
		// 调用后端接口获取手机号
		// 注意：
		// 1. 这里使用的是 getPhoneNumber 返回的 code，不是 wx.login 的 code
		// 2. 手机号解密必须在后端进行，前端无法直接解密
		// 3. 后端需要先验证 token，然后将手机号与用户账号关联
		const res = await uni.request({
			url: 'https://your-api.com/user/getPhoneNumber', // 替换为你的接口
			method: 'POST',
			header: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + token.value // 使用登录时获取的 token
			},
			data: {
				code // getPhoneNumber 返回的 code，专门用于获取手机号
			}
		})
		
		uni.hideLoading()
		
		const phoneData = res.data as any
		if (phoneData.code === 200) {
			phoneNumber.value = phoneData.data.phoneNumber
			uni.showToast({
				title: '获取成功',
				icon: 'success'
			})
		} else {
			throw new Error(phoneData.message || '获取失败')
		}
	} catch (error: any) {
		uni.hideLoading()
		uni.showToast({
			title: error.message || '获取失败',
			icon: 'none'
		})
	}
}

// 其他平台输入手机号
const inputPhone = () => {
	uni.showModal({
		title: '输入手机号',
		editable: true,
		placeholderText: '请输入手机号',
		success: (res) => {
			if (res.confirm && res.content) {
				// 简单验证手机号格式
				const phoneReg = /^1[3-9]\d{9}$/
				if (phoneReg.test(res.content)) {
					phoneNumber.value = res.content
					// 可以调用接口保存手机号
					savePhoneNumber(res.content)
				} else {
					uni.showToast({
						title: '手机号格式不正确',
						icon: 'none'
					})
				}
			}
		}
	})
}

// 保存手机号到服务器
const savePhoneNumber = async (phone: string) => {
	try {
		const res = await uni.request({
			url: 'https://your-api.com/user/updatePhone', // 替换为你的接口
			method: 'POST',
			header: {
				'Content-Type': 'application/json',
				// 'Authorization': 'Bearer ' + token
			},
			data: {
				phoneNumber: phone
			}
		})
		
		const saveData = res.data as any
		if (saveData.code === 200) {
			uni.showToast({
				title: '保存成功',
				icon: 'success'
			})
		}
	} catch (error: any) {
		uni.showToast({
			title: error.message || '保存失败',
			icon: 'none'
		})
	}
}
</script>

<style lang="scss" scoped>
.page {
	min-height: 100vh;
	background: #f5f5f5;
}

.content {
	padding: 32rpx;
}

.info-item {
	background: #fff;
	border-radius: 24rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.label {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
}

.avatar-wrapper {
	display: flex;
	align-items: center;
}

.avatar-btn {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	overflow: hidden;
	padding: 0;
	margin: 0;
	background: transparent;
	border: none;
	line-height: normal;
	
	&::after {
		border: none;
	}
}

.avatar-image {
	width: 100%;
	height: 100%;
}

.avatar-placeholder {
	width: 100%;
	height: 100%;
	background: #f0f0f0;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	color: #999;
}

.phone-wrapper {
	display: flex;
	align-items: center;
}

.phone-text {
	font-size: 30rpx;
	color: #333;
}

.phone-btn {
	padding: 12rpx 24rpx;
	background: #007aff;
	color: #fff;
	border-radius: 8rpx;
	font-size: 28rpx;
	border: none;
	line-height: normal;
	
	&::after {
		border: none;
	}
}
</style>

