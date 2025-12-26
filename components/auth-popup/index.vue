<template>
	<up-popup 
		:show="showAuthModal" 
		mode="center" 
		:closeOnClickOverlay="false"
		:closeable="false"
		:round="20"
		:customStyle="{ width: '600rpx' }"
		@close="handleClose"
		@open="handleOpen"
	>
		<view class="auth-modal">
			<view class="auth-modal-title">手机号授权</view>
			<view class="auth-modal-desc">
				为了给您提供更好的服务体验，需要获取您的手机号
			</view>
			<view class="auth-modal-buttons">
				<up-button 
					text="暂不授权" 
					type="default" 
					plain
					@click="handleCancelAuth"
					:customStyle="{ width: '200rpx', marginRight: '20rpx' }"
				></up-button>
				<button 
					class="phone-auth-button"
					open-type="getPhoneNumber"
					@getphonenumber="handleGetPhoneNumber"
				>
					立即授权
				</button>
			</view>
		</view>
	</up-popup>
</template>

<script lang="ts" setup>
import { computed, watch, onMounted } from 'vue'
import { useAuthStore } from '@/store/useAuthStore'

const authStore = useAuthStore()

// 使用 ref 和 computed 组合，确保响应式
const showAuthModal = computed({
	get: () => {
		const value = authStore.showAuthModal
		console.log('👀 [AuthPopup] computed getter 被调用，值:', value)
		return value
	},
	set: (val) => {
		console.log('👀 [AuthPopup] computed setter 被调用，值:', val)
		authStore.setShowAuthModal(val)
	}
})

// 监听 store 的变化
watch(() => authStore.showAuthModal, (newVal, oldVal) => {
	console.log('👀 [AuthPopup] showAuthModal 状态变化:', oldVal, '->', newVal)
}, { immediate: true })

// 组件挂载时打印（使用 onReady 确保在 uni-app 中正确触发）
import { onReady } from '@dcloudio/uni-app'
onReady(() => {
	console.log('🎯 [AuthPopup] 组件已挂载（onReady），初始状态:', authStore.showAuthModal)
})

onMounted(() => {
	console.log('🎯 [AuthPopup] 组件已挂载（onMounted），初始状态:', authStore.showAuthModal)
})

// 获取登录code
const getLoginCode = () => {
	return new Promise<string>((resolve, reject) => {
		uni.login({
			success: (res) => {
				resolve(res.code)
			},
			fail: (err) => {
				console.error('❌ 获取登录code失败:', err)
				reject(err)
			}
		})
	})
}

// 处理获取手机号授权
const handleGetPhoneNumber = async (e: any) => {
	console.log('📱 获取手机号回调:', e)
	
	if (e.detail.errMsg === 'getPhoneNumber:ok') {
		try {
			// 获取登录code
			const code = await getLoginCode()
			
			// 手机号授权返回的数据
			const phoneData = {
				code: code, // 登录code，可以传给后端换取openid
				encryptedData: e.detail.encryptedData, // 加密数据
				iv: e.detail.iv, // 初始向量
				errMsg: e.detail.errMsg // 返回信息
			}
			
			// 存储手机号授权信息
			authStore.savePhoneAuth(phoneData)
			console.log('💾 手机号授权信息已保存:', phoneData)
			
			// 关闭弹窗
			authStore.setShowAuthModal(false)
			
			// 触发授权成功回调
			authStore.onAuthSuccess?.(phoneData)
			
			// 这里可以调用后端接口，将 code、encryptedData、iv 发送给后端解密获取手机号
			// 例如：await loginApi.wxLogin({ code, encryptedData: phoneData.encryptedData, iv: phoneData.iv })
			
		} catch (error) {
			console.error('❌ 获取登录code失败:', error)
			uni.showToast({
				title: '授权失败，请重试',
				icon: 'none'
			})
		}
	} else if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
		// 用户拒绝授权
		console.log('⚠️ 用户拒绝授权手机号')
		authStore.setShowAuthModal(false)
		uni.showToast({
			title: '已取消授权',
			icon: 'none'
		})
	} else {
		// 其他错误
		console.error('❌ 获取手机号失败:', e.detail.errMsg)
		uni.showToast({
			title: '授权失败，请重试',
			icon: 'none'
		})
	}
}

// 处理取消授权
const handleCancelAuth = () => {
	authStore.setShowAuthModal(false)
	uni.showToast({
		title: '已取消授权',
		icon: 'none'
	})
}

// 处理打开弹窗
const handleOpen = () => {
	console.log('🎉 弹窗已打开，showAuthModal:', showAuthModal.value)
}

// 处理关闭弹窗
const handleClose = () => {
	console.log('❌ [AuthPopup] 弹窗已关闭')
	authStore.setShowAuthModal(false)
}
</script>

<style scoped lang="scss">
// 授权弹窗样式
.auth-modal {
	padding: 60rpx 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-sizing: border-box;

	.auth-modal-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
	}

	.auth-modal-desc {
		font-size: 28rpx;
		color: #666;
		line-height: 1.6;
		text-align: center;
		margin-bottom: 50rpx;
	}

	.auth-modal-buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
}

// 手机号授权按钮样式（与 uview-plus primary 按钮样式一致）
.phone-auth-button {
	width: 200rpx;
	height: 70rpx;
	line-height: 70rpx;
	background-color: #3c9cff;
	color: #fff;
	border-radius: 8rpx;
	font-size: 28rpx;
	text-align: center;
	border: none;
	padding: 0;
	margin: 0;
	box-sizing: border-box;
	
	&::after {
		border: none;
	}
	
	&:active {
		opacity: 0.8;
		background-color: #2b85e4;
	}
}
</style>

