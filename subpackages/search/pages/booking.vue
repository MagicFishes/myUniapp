<template>
	<view class="page">
		<customNavBar :showBackButton="true" :autoBack="true" title=""></customNavBar>
		<view class="hotel-detail" :style="{ paddingTop: `${utils.totalSafeAreaHeight}px` }">
			<!-- 酒店详情 -->
			<view class="hotel-detail-container">
				<view class="hotel-detail-card">
					<view class="hotel-detail-header">
						<view class="hotel-detail-title-wrapper">
							<view class="hotel-detail-name">{{ hotelInfo?.name ?? '' }}</view>
							<view class="hotel-detail-name-en">{{ hotelInfo?.nameEn ?? '' }}</view>
						</view>
						<view class="hotel-detail-logo">
							<!-- <image class="hotel-logo-img" src="/image/pic/companyLogo.png" mode="aspectFit"></image> -->
						</view>
					</view>
					<view class="hotel-room-info">
						<view class="hotel-room-image-wrapper">
							<image class="hotel-room-image" :src="roomInfo?.formatImages?.[0] || roomInfo?.image || hotelInfo?.image || ''" mode="aspectFill"></image>
						</view>
						<view class="hotel-room-detail">
							<view class="hotel-room-name-wrapper">
								<view class="hotel-room-name">{{ roomInfo?.name ?? '' }}</view>
								<view class="hotel-room-name-en">{{ roomInfo?.nameEn ?? '' }}</view>
							</view>
							<view class="hotel-room-policy">
								<!-- <view class="policy-text">取消政策</view> -->
								<!-- <view class="policy-text">04-01 00:00 前免费取消</view> -->
							</view>
						</view>
					</view>
					<view class="hotel-booking-info">
						<view class="booking-nights">
							共{{ bookingNights }}晚/{{ roomNum }}间
						</view>
						<view class="booking-dates">
							<view class="booking-date-start">{{ startDateFormatted }}</view>
							<view class="booking-date-end">{{ endDateFormatted }}</view>
						</view>
						<view class="booking-times">
							<view class="booking-time-start">下午15:00 后</view>
							<view class="booking-time-end">中午12:00 前</view>
						</view>
					</view>
					<view class="hotel-meal-info">
						<view class="meal-label">餐食</view>
						<view class="meal-value">{{ mealText }}</view>
					</view>
				</view>
				<view class="hotel-price-detail">
					<view class="price-detail-card">
						<view class="price-detail-title">价格详情</view>
						<view class="price-detail-content">
							<!-- 显示选中的价格方案信息 -->
							<template v-if="selectedRate">
								<view class="price-detail-item">
									<view class="price-detail-label">价格方案</view>
									<view class="price-detail-value">{{ selectedRate.name || '标准价格' }}</view>
								</view>
								<view class="price-detail-item">
									<view class="price-detail-label">房费</view>
									<view class="price-detail-value">{{ selectedRate.priceUnit || 'CNY' }} {{ formatPrice((selectedRate.totalPriceCny || selectedRate.totalPrice || 0) - (selectedRate.taxPriceCny || selectedRate.taxPrice || 0)) }}</view>
								</view>
								<view class="price-detail-item" v-if="selectedRate.taxPriceCny || selectedRate.taxPrice">
									<view class="price-detail-label">税及服务费</view>
									<view class="price-detail-value">{{ selectedRate.priceUnit || 'CNY' }} {{ formatPrice(selectedRate.taxPriceCny || selectedRate.taxPrice || 0) }}</view>
								</view>
							</template>
							<view class="price-detail-item price-total">
								<view class="price-detail-label">总额</view>
								<view class="price-detail-value">{{ selectedRate?.priceUnit || 'CNY' }} {{ formatPrice(selectedRate?.totalPriceCny || selectedRate?.totalPrice || 0) }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 表单区域 -->
			<view class="form-container">
				<!-- 入住人信息表单 -->
				<u-form :model="formData" ref="formRef" :rules="rules" label-width="0">
					<view v-for="(item, index) in formData.adultArr" :key="index" class="form-card">
						<view class="card-title-wrapper">
							<view class="card-title">填写入住人信息</view>
							<view class="card-title-number" v-if="formData.adultArr.length > 1">入住人{{ index + 1 }}</view>
						</view>

						<view class="form-item-full">
							<u-form-item prop="surname" :name="`adultArr.${index}.surname`" label="">
								<view class="form-row">
									<view class="form-label-wrapper">
										<text class="form-label">入住人姓氏</text>
									</view>
									<view class="form-input-wrapper">
										<u-input v-model="item.surname" placeholder="请输入入住人姓氏" border="none"
											class="form-input"></u-input>
									</view>
								</view>
							</u-form-item>
						</view>

						<view class="form-item-full">
							<u-form-item prop="name" :name="`adultArr.${index}.name`" label="">
								<view class="form-row">
									<view class="form-label-wrapper">
										<text class="form-label">入住人名字</text>
									</view>
									<view class="form-input-wrapper">
										<u-input v-model="item.name" placeholder="请输入预定人名字" border="none"
											class="form-input"></u-input>
									</view>
								</view>
							</u-form-item>
						</view>

						<view class="form-item-full">
							<u-form-item prop="Email" :name="`adultArr.${index}.Email`" label="">
								<view class="form-row">
									<view class="form-label-wrapper">
										<text class="form-label">Email</text>
									</view>
									<view class="form-input-wrapper">
										<u-input v-model="item.Email" placeholder="请输入邮箱地址" border="none" type="text"
											class="form-input"></u-input>
									</view>
								</view>
							</u-form-item>
						</view>

						<view class="form-item-full">
							<u-form-item prop="phoneNumber" :name="`adultArr.${index}.phoneNumber`" label="">
								<view class="form-row">
									<view class="form-label-wrapper">
										<text class="form-label">手机号码</text>
									</view>
									<view class="form-input-wrapper">
										<u-input v-model="item.phoneNumber" placeholder="请输入手机号码，用于接收通知" border="none"
											type="number" class="form-input"></u-input>
									</view>
								</view>
							</u-form-item>
						</view>
					</view>
				</u-form>

				<!-- 订单价格和支付方式 -->
				<view class="form-card">
					<view class="card-title">订单价格</view>

					<!-- 支付方式 -->
					<view class="payment-section">
						<view class="payment-label">支付方式</view>
						<view class="payment-options">
							<view v-for="(item, index) in payTypeList" :key="index" class="payment-option"
								@click="changePayTypeList(item.value)">
								<view class="checkbox-wrapper">
									<view class="checkbox" :class="{ 'checked': item.value === payType }">
										<text v-if="item.value === payType" class="checkmark">✓</text>
									</view>
								</view>
								<text class="payment-text">{{ item.title }}</text>
							</view>
						</view>
					</view>

					<!-- 信用卡信息 -->
					<view class="card-info-section">
						<view class="section-title">信用卡信息</view>
						<u-form :model="cardFormData" ref="cardFormRef" :rules="cardRules" label-width="0">
							<view class="form-item-full">
								<u-form-item prop="cardType" label="">
									<view class="form-row">
										<view class="form-label-wrapper">
											<text class="form-label">卡种</text>
										</view>
										<view class="form-input-wrapper">
											<picker mode="selector" :range="creditCardTypeOption" range-key="label"
												:value="cardTypeIndex" @change="onCardTypeChange">
												<view class="picker-input">
													<text :class="{ 'placeholder': !cardFormData.cardType }">
														{{cardFormData.cardType ? creditCardTypeOption.find(item =>
															item.value === cardFormData.cardType)?.label ||
														cardFormData.cardType : '请选择信用卡类型' }}
													</text>
													<uni-icons type="arrowdown" size="16" color="#999"></uni-icons>
												</view>
											</picker>
										</view>
									</view>
								</u-form-item>
							</view>

							<view class="form-item-full">
								<u-form-item prop="cardId" label="">
									<view class="form-row">
										<view class="form-label-wrapper">
											<text class="form-label">卡号</text>
										</view>
										<view class="form-input-wrapper">
											<u-input v-model="cardFormData.cardId" placeholder="请输入卡号" border="none"
												type="number" class="form-input"></u-input>
										</view>
									</view>
								</u-form-item>
							</view>

							<view class="form-item-full">
								<u-form-item prop="date" label="">
									<view class="form-row">
										<view class="form-label-wrapper">
											<text class="form-label">有效期</text>
										</view>
										<view class="form-input-wrapper">
											<picker mode="date" fields="month" :value="cardFormData.dateValue"
												@change="onDateChange">
												<view class="picker-input">
													<text :class="{ 'placeholder': !cardFormData.date }">
														{{ cardFormData.date || '选择信用卡有效日期' }}
													</text>
													<uni-icons type="arrowdown" size="16" color="#999"></uni-icons>
												</view>
											</picker>
										</view>
									</view>
								</u-form-item>
							</view>

							<view class="form-item-full">
								<u-form-item prop="cardSafeNumber" label="">
									<view class="form-row">
										<view class="form-label-wrapper">
											<text class="form-label">信用卡安全码</text>
										</view>
										<view class="form-input-wrapper">
											<u-input v-model="cardFormData.cardSafeNumber" placeholder="请填写信用卡安全码"
												border="none" type="number" class="form-input"></u-input>
										</view>
									</view>
								</u-form-item>
							</view>
						</u-form>
					</view>

					<!-- 担保说明 -->
					<view class="guarantee-section">
						<text class="guarantee-label">担保说明</text>
						<text class="guarantee-text">
							此次预定需要信用卡担保，部分酒店会收取费用进行担保，在免费取消日期前取消不收取费用。若您提交的信用卡为无效卡或无法扣款，酒店有权取消且不做任何通知。
						</text>
					</view>
				</view>
			</view>
		</view>


		<!-- 底部提交按钮 -->
		<view class="bottom-bar">
			<!-- 同意条款 -->
			<view class="agree-section">
				<view class="checkbox-wrapper" @click="agreeSubmitType = !agreeSubmitType">
					<view class="checkbox" :class="{ 'checked': agreeSubmitType }">
						<text v-if="agreeSubmitType" class="checkmark">✓</text>
					</view>
				</view>
				<text class="agree-text">
					我同意预订该房间，遵守 <text class="link-text">取消政策</text> 酒店会根据您的付款方式进行预授权和扣除房费。
				</text>
			</view>

			<view class="submit-btn" @click="handleSubmit">
				<text class="submit-btn-text">提交</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import customNavBar from '@/components/custom-nav-bar/index.vue';
import utils from '@/utils/utils';
import { useHotelSearchStore } from '@/store/useHotelSearchStore';
import dayjs from 'dayjs';

const hotelSearchStore = useHotelSearchStore();

// 表单引用
const formRef = ref<any>(null);
const cardFormRef = ref<any>(null);

// 表单数据
const formData = reactive({
	adultArr: [
		{
			surname: '',
			name: '',
			Email: '',
			phoneNumber: ''
		}
	]
});

// 支付方式
const payType = ref<string>('CREDIT');
const payTypeList = ref<any>([
	{
		title: '信用卡支付',
		value: 'CREDIT'
	}
]);

// 切换支付方式
const changePayTypeList = (value: string) => {
	payType.value = value;
};

// 信用卡表单数据
const cardFormData = reactive({
	cardId: '',
	cardType: '',
	date: '', // 显示格式 MM/YY
	dateValue: '', // 用于 picker 的日期值
	cardSafeNumber: ''
});

// 信用卡类型选项
const creditCardTypeOption = ref<any>([
	{
		label: 'VISA',
		value: 'VISA'
	},
	{
		label: 'MASTER',
		value: 'MASTER'
	}
]);

// 卡种选择索引
const cardTypeIndex = ref(0);

// 卡种选择变化
const onCardTypeChange = (e: any) => {
	const index = e.detail.value;
	cardTypeIndex.value = index;
	if (creditCardTypeOption.value[index]) {
		cardFormData.cardType = creditCardTypeOption.value[index].value;
	}
};

// 日期选择
const onDateChange = (e: any) => {
	cardFormData.dateValue = e.detail.value;
	const date = new Date(e.detail.value);
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = String(date.getFullYear()).slice(-2);
	cardFormData.date = `${month}/${year}`;
};

// 同意条款
const agreeSubmitType = ref<boolean>(false);

// 表单验证规则
const rules = reactive({
	surname: [
		{
			required: true,
			message: '请输入入住人姓氏',
			trigger: ['blur', 'change']
		}
	],
	name: [
		{
			required: true,
			message: '请输入预定人名字',
			trigger: ['blur', 'change']
		}
	],
	Email: [
		{
			required: true,
			message: '请输入邮箱地址',
			trigger: ['blur', 'change']
		},
		{
			pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
			message: '请输入正确的邮箱格式（如：user@example.com）',
			trigger: ['blur', 'change']
		}
	],
	phoneNumber: [
		{
			required: true,
			message: '请输入手机号码，用于接收通知',
			trigger: ['blur', 'change']
		},
		{
			pattern: /^1[3-9]\d{9}$/,
			message: '请输入正确的手机号码',
			trigger: ['blur', 'change']
		}
	]
});

// 信用卡表单验证规则
const cardRules = reactive({
	cardType: [
		{
			required: true,
			message: '请选择卡种',
			trigger: ['blur', 'change']
		}
	],
	cardId: [
		{
			required: true,
			message: '请输入卡号',
			trigger: ['blur', 'change']
		}
	],
	date: [
		{
			required: true,
			message: '请选择有效期',
			trigger: ['blur', 'change']
		}
	],
	cardSafeNumber: [
		{
			required: true,
			message: '请填写信用卡安全码',
			trigger: ['blur', 'change']
		}
	]
});

// 页面参数
const roomInfo = ref<any>(null); // 房型基本信息
const selectedRate = ref<any>(null); // 选中的价格方案
const hotelInfo = ref<any>(null);

// 日期格式化函数
const formatDate = (date: string | Date | null | undefined, format: string = 'YYYY/MM/DD'): string => {
	if (!date) return '';
	try {
		const d = new Date(date);
		if (isNaN(d.getTime())) return '';
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return format.replace('YYYY', String(year)).replace('MM', month).replace('DD', day);
	} catch (e) {
		return '';
	}
};

// 计算两个日期之间的晚数
const getNightBetweenTwoDays = (startDate: string | Date | null | undefined, endDate: string | Date | null | undefined): number => {
	if (!startDate || !endDate) return 0;
	try {
		const start = new Date(startDate);
		const end = new Date(endDate);
		if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
		const diffTime = end.getTime() - start.getTime();
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		return diffDays > 0 ? diffDays : 0;
	} catch (e) {
		return 0;
	}
};

// 格式化价格
const formatPrice = (price: number | string | null | undefined): string => {
	if (price === null || price === undefined || price === '') return '0';
	const num = Number(price);
	if (isNaN(num)) return '0';
	return num.toLocaleString('zh-CN');
};

// 计算属性：入住晚数（从 store 获取）
const bookingNights = computed(() => {
	const checkInDate = hotelSearchStore.getCheckInDate;
	const checkOutDate = hotelSearchStore.getCheckOutDate;
	if (!checkInDate || !checkOutDate) return 0;
	try {
		const checkIn = dayjs(checkInDate);
		const checkOut = dayjs(checkOutDate);
		const diffDays = checkOut.diff(checkIn, 'day');
		return diffDays > 0 ? diffDays : 0;
	} catch (e) {
		return 0;
	}
});

// 计算属性：开始日期格式化（从 store 获取）
const startDateFormatted = computed(() => {
	const checkInDate = hotelSearchStore.getCheckInDate;
	if (!checkInDate) return '';
	try {
		return dayjs(checkInDate).format('YYYY/MM/DD');
	} catch (e) {
		return checkInDate;
	}
});

// 计算属性：结束日期格式化（从 store 获取）
const endDateFormatted = computed(() => {
	const checkOutDate = hotelSearchStore.getCheckOutDate;
	if (!checkOutDate) return '';
	try {
		return dayjs(checkOutDate).format('YYYY/MM/DD');
	} catch (e) {
		return checkOutDate;
	}
});

// 计算属性：房间数量（从 roomInfo 获取，默认为 1）
const roomNum = computed(() => {
	return roomInfo.value?.roomNum || 1;
});

// 计算属性：餐食文本（从选中的价格方案中获取）
const mealText = computed(() => {
	if (selectedRate.value) {
		// 如果价格方案名称包含"早餐"或"含早"，显示含早
		if (selectedRate.value.name && (selectedRate.value.name.includes('早餐') || selectedRate.value.name.includes('含早'))) {
			return '含早';
		}
		// 也可以从 breakfast 字段判断
		if (selectedRate.value.breakfast === 1) {
			return '单早';
		}
		if (selectedRate.value.breakfast === 0) {
			return '无早';
		}
	}
	return '无早';
});

// 提交表单
const handleSubmit = async () => {
	if (!formRef.value || !cardFormRef.value) return;

	try {
		// 1. 验证入住人表单
		await formRef.value.validate();

		// 2. 验证信用卡表单
		await cardFormRef.value.validate();

		// 3. 检查是否同意条款
		if (!agreeSubmitType.value) {
			uni.showToast({
				title: '请勾选同意预订条款',
				icon: 'none'
			});
			return;
		}

		// TODO: 调用下单接口
		console.log('提交订单数据:', {
			roomInfo: roomInfo.value,
			hotelInfo: hotelInfo.value,
			formData: formData.adultArr,
			cardFormData: cardFormData,
			payType: payType.value
		});

		uni.showToast({
			title: '订单提交成功',
			icon: 'success'
		});

		// 延迟跳转到订单详情页
		setTimeout(() => {
			uni.navigateBack();
			// 或者跳转到订单详情页
			// uni.redirectTo({
			// 	url: `/subpackages/order/pages/detail/index?orderId=xxx`
			// });
		}, 1500);
	} catch (error: any) {
		console.error('表单验证失败:', error);
		if (error && error.length > 0) {
			uni.showToast({
				title: error[0].message || '请完善表单信息',
				icon: 'none'
			});
		} else {
			uni.showToast({
				title: '请完善表单信息',
				icon: 'none'
			});
		}
	}
};

// 页面加载
onLoad(() => {
	// 从 store 获取酒店详情
	const storeHotelDetail = hotelSearchStore.getHotelDetail;
	if (storeHotelDetail) {
		hotelInfo.value = storeHotelDetail;
	}
	
	// 从本地存储获取房型数据（使用固定的 key）
	try {
		const storedData = uni.getStorageSync('booking_roomInfo');
		if (storedData && storedData.roomInfo && storedData.selectedRate) {
			roomInfo.value = storedData.roomInfo;
			selectedRate.value = storedData.selectedRate;
		} else {
			uni.showToast({
				title: '房型信息不存在，请返回重试',
				icon: 'none'
			});
			setTimeout(() => {
				uni.navigateBack();
			}, 1500);
			return;
		}
	} catch (e) {
		console.error('读取预订数据失败:', e);
		uni.showToast({
			title: '数据读取失败，请返回重试',
			icon: 'none'
		});
		// 如果读取失败，延迟返回上一页
		setTimeout(() => {
			uni.navigateBack();
		}, 1500);
		return;
	}

	// 检查数据是否完整
	if (!roomInfo.value) {
		uni.showToast({
			title: '房型信息不存在，请返回重试',
			icon: 'none'
		});
		setTimeout(() => {
			uni.navigateBack();
		}, 1500);
		return;
	}

	if (!selectedRate.value) {
		uni.showToast({
			title: '价格信息不存在，请返回重试',
			icon: 'none'
		});
		setTimeout(() => {
			uni.navigateBack();
		}, 1500);
		return;
	}

	if (!hotelInfo.value) {
		uni.showToast({
			title: '酒店信息不存在，请返回重试',
			icon: 'none'
		});
		setTimeout(() => {
			uni.navigateBack();
		}, 1500);
		return;
	}

	// 根据人数动态添加入住人信息（从 store 获取人数）
	const personCount = hotelSearchStore.getPersonCount || 1;
	if (personCount > formData.adultArr.length) {
		for (let i = formData.adultArr.length; i < personCount; i++) {
			formData.adultArr.push({
				surname: '',
				name: '',
				Email: '',
				phoneNumber: ''
			});
		}
	}
});

// 页面卸载时不需要清理存储，因为使用固定 key 会被新数据覆盖
</script>

<style scoped lang="scss">
// ==================== 样式配置变量 ====================
// 表单样式配置 - 方便统一修改
:root {
	// 标签宽度
	--form-label-width: 180rpx;

	// 输入框样式
	--input-height: 80rpx;              // 输入框高度（与支付选项高度一致）
	--input-padding-vertical: 0rpx; // 上下内边距
	--input-padding-horizontal: 14rpx; // 左右内边距
	--input-border-radius: 12rpx; // 圆角
	--input-font-size: 28rpx; // 字体大小
	--input-bg-color: #f6f6f6; // 背景色

	// 标签样式
	--label-font-size: 28rpx; // 字体大小
	--label-color: #333; // 文字颜色
	--label-font-weight: 500; // 字重

	// 间距
	// --form-item-margin: 40rpx;           // 表单项之间的间距
	// --label-input-gap: 24rpx;           // 标签与输入框之间的间距

	// 卡片样式
	--card-border-radius: 20rpx; // 卡片圆角
	--card-padding-vertical: 40rpx; // 卡片上下内边距
	--card-padding-horizontal: 32rpx; // 卡片左右内边距
	--card-margin-bottom: 30rpx; // 卡片底部间距
	--card-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04); // 阴影

	// 标题样式
	--title-font-size: 36rpx; // 卡片标题字体大小
	--page-title-font-size: 40rpx; // 页面标题字体大小
}

.page {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 300rpx;
	width: 100%;
	box-sizing: border-box;
	overflow-x: hidden;
}

.hotel-detail {
	width: 100%;
	box-sizing: border-box;
	overflow-x: hidden;
}

// 酒店详情区域
.hotel-detail-container {
	padding: 24rpx;
	box-sizing: border-box;
	width: 100%;
}

.hotel-detail-card {
	width: 100%;
	padding: 32rpx;
	border: 1rpx solid #f0f0f0;
	border-radius: 24rpx;
	background-color: #fff;
	margin-bottom: 24rpx;
	box-sizing: border-box;
	box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
}

.hotel-detail-header {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	border-bottom: 1rpx solid #f5f5f5;
	padding-bottom: 24rpx;
	margin-bottom: 24rpx;
	width: 100%;
	box-sizing: border-box;
}

.hotel-detail-title-wrapper {
	flex: 1;
	display: flex;
	flex-direction: column;
	min-width: 0;
	box-sizing: border-box;
	gap: 8rpx;
}

.hotel-detail-name {
	font-size: 32rpx;
	color: #1a1a1a;
	font-weight: 600;
	word-break: break-word;
	overflow-wrap: break-word;
	line-height: 1.4;
}

.hotel-detail-name-en {
	font-size: 24rpx;
	color: #999;
	margin-top: 0;
	word-break: break-word;
	overflow-wrap: break-word;
	line-height: 1.4;
}

.hotel-detail-logo {
	flex-shrink: 0;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin-left: 20rpx;
}

.hotel-logo-img {
	width: 60%;
}

.hotel-room-info {
	width: 100%;
	display: flex;
	justify-content: space-between;
	min-height: 360rpx;
	margin-top: 0;
	margin-bottom: 24rpx;
	box-sizing: border-box;
	gap: 24rpx;
	padding: 24rpx;
	background-color: #fafafa;
	border-radius: 16rpx;
}

.hotel-room-image-wrapper {
	flex-shrink: 0;
	width: 40%;
	height: 360rpx;
	box-sizing: border-box;
	overflow: hidden;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
}

.hotel-room-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 12rpx;
}

.hotel-room-detail {
	flex: 1;
	display: flex;
	flex-direction: column;
	padding: 0;
	justify-content: space-between;
	min-width: 0;
	box-sizing: border-box;
}

.hotel-room-name-wrapper {
	flex: 1;
	display: flex;
	flex-direction: column;
	min-width: 0;
	gap: 8rpx;
}

.hotel-room-name {
	font-size: 30rpx;
	font-weight: 600;
	letter-spacing: 1rpx;
	color: #1a1a1a;
	word-break: break-word;
	overflow-wrap: break-word;
	line-height: 1.4;
}

.hotel-room-name-en {
	font-size: 24rpx;
	color: #999;
	margin-top: 0;
	word-break: break-word;
	overflow-wrap: break-word;
	line-height: 1.4;
}

.hotel-room-policy {
	width: 100%;
	display: flex;
	justify-content: flex-start;
	flex-direction: column;
}

.policy-text {
	font-size: 24rpx;
	color: #A9A9A9;
}

.hotel-booking-info {
	display: flex;
	flex-direction: column;
	margin-top: 0;
	padding-top: 24rpx;
	border-top: 1rpx solid #f5f5f5;
	gap: 16rpx;
}

.booking-nights {
	font-size: 30rpx;
	color: #1a1a1a;
	font-weight: 500;
	word-break: break-word;
}

.booking-dates {
	display: flex;
	justify-content: space-between;
	color: #1a1a1a;
	font-size: 28rpx;
	margin-top: 0;
	width: 100%;
	box-sizing: border-box;
	padding: 12rpx 0;
}

.booking-date-start {
	flex: 1;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	min-width: 0;
	word-break: break-word;
	font-weight: 500;
}

.booking-date-end {
	flex: 1;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	min-width: 0;
	word-break: break-word;
	text-align: right;
	font-weight: 500;
}

.booking-times {
	display: flex;
	justify-content: space-between;
	color: #999;
	font-size: 24rpx;
	margin-top: 0;
	width: 100%;
	box-sizing: border-box;
	padding: 0;
}

.booking-time-start {
	flex: 1;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	min-width: 0;
}

.booking-time-end {
	flex: 1;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	min-width: 0;
	text-align: right;
}

.hotel-meal-info {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-top: 24rpx;
	padding-top: 24rpx;
	border-top: 1rpx solid #f5f5f5;
	width: 100%;
	box-sizing: border-box;
}

.meal-label {
	font-size: 28rpx;
	color: #666;
	flex-shrink: 0;
	font-weight: 400;
}

.meal-value {
	font-size: 28rpx;
	font-weight: 600;
	color: #1a1a1a;
	word-break: break-word;
	text-align: right;
}

.hotel-price-detail {
	display: flex;
	margin-top: 0;
	width: 100%;
	box-sizing: border-box;
}

.price-detail-card {
	display: flex;
	flex-direction: column;
	border: 1rpx solid #f0f0f0;
	padding: 32rpx;
	width: 100%;
	border-radius: 24rpx;
	background-color: #fff;
	box-sizing: border-box;
	box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.04);
}

.price-detail-title {
	font-size: 32rpx;
	color: #1a1a1a;
	font-weight: 600;
	margin-bottom: 24rpx;
	padding-bottom: 16rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.price-detail-content {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.price-detail-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: #1a1a1a;
	font-size: 28rpx;
	margin-top: 0;
	width: 100%;
	box-sizing: border-box;
	padding: 12rpx 0;

	&.price-total {
		margin-top: 8rpx;
		padding-top: 24rpx;
		padding-bottom: 0;
		border-top: 2rpx solid #f0f0f0;
	
	
		border-radius: 0 0 24rpx 24rpx;
	}
}

.price-detail-label {
	flex: 1;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	min-width: 0;
	word-break: break-word;
	color: #666;
	font-weight: 400;

	.price-total & {
		color: #1a1a1a;
		font-weight: 600;
		font-size: 30rpx;
	}
}

.price-detail-value {
	flex: 1;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	min-width: 0;
	word-break: break-word;
	text-align: right;
	color: #1a1a1a;
	font-weight: 500;

	.price-total & {
		font-weight: 700;
		color: #1a1a1a;
		font-size: 32rpx;
	}
}

.form-container {
	padding: 0rpx 24rpx;
}

.form-card {
	background-color: #fff;
	border-radius: var(--card-border-radius);
	padding: var(--card-padding-vertical) var(--card-padding-horizontal);
	margin-bottom: var(--card-margin-bottom);
	border: 1rpx solid #e5e5e5;
	box-shadow: var(--card-shadow);

	.card-title-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--form-item-margin);
		padding-bottom: 24rpx;
		border-bottom: 2rpx solid #f0f0f0;
		width: 100%;
		box-sizing: border-box;
	}

	.card-title {
		font-size: var(--title-font-size);
		font-weight: bold;
		color: #333;
		letter-spacing: 0.5rpx;
		flex-shrink: 0;
	}

	.card-title-number {
		font-size: var(--title-font-size);
		font-weight: bold;
		color: #333;
		letter-spacing: 0.5rpx;
		flex-shrink: 0;
	}
}

.form-item-full {
	width: 100%;

	&:last-child {
		margin-bottom: 0;
	}
}

.form-row {
	display: flex;
	align-items: center;
	gap: 20rpx;
	width: 100%;
	min-height: 60rpx; // 与支付选项高度一致
}

.form-label-wrapper {
	flex: 0 0 var(--form-label-width);
	min-width: var(--form-label-width);
	display: flex;
	align-items: center;
}

.form-label {
	font-size: var(--label-font-size);
	color: var(--label-color);
	font-weight: var(--label-font-weight);
	line-height: 1.4;
	white-space: nowrap;
}

.form-input-wrapper {
	flex: 1;
	min-width: 0;
}

// 输入框统一样式
.form-input {
	background-color: var(--input-bg-color) !important;
	padding: var(--input-padding-vertical) var(--input-padding-horizontal) !important;
	border-radius: var(--input-border-radius) !important;
	font-size: var(--input-font-size) !important;
	height: var(--input-height) !important;
	line-height: var(--input-height) !important;
	box-sizing: border-box !important;
}

// 支付方式区域
.payment-section {
	margin-top: 20rpx;
	padding-bottom: 30rpx;
	border-bottom: 1rpx solid #e5e5e5;
}

.payment-label {
	font-size: var(--label-font-size);
	color: var(--label-color);
	margin-bottom: 24rpx;
	font-weight: var(--label-font-weight);
}

.payment-options {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.payment-option {
	display: flex;
	align-items: center;
	gap: 10rpx;
}

.checkbox-wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
}

.checkbox {
	width: 30rpx;
	height: 30rpx;
	border: 1rpx solid #999;
	border-radius: 6rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #fff;
	transition: all 0.2s;

	&.checked {
		background-color: #000;
		border-color: #000;
	}

	.checkmark {
		color: #fff;
		font-size: 20rpx;
		font-weight: bold;
	}
}

.payment-text {
	font-size: 28rpx;
	color: #333;
	font-weight: 400;
}

// 信用卡信息区域
.card-info-section {
	margin-top: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 32rpx;
	letter-spacing: 0.5rpx;
}

.picker-input {
	background-color: var(--input-bg-color);
	padding: var(--input-padding-vertical) var(--input-padding-horizontal);
	border-radius: var(--input-border-radius);
	min-height: var(--input-height);
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;

	.placeholder {
		color: #999;
	}

	text {
		font-size: var(--input-font-size);
		color: #333;
		line-height: 1.4;
	}
}

// 担保说明区域
.guarantee-section {
	margin-top: 30rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid #e5e5e5;
}

.guarantee-label {
	font-size: 24rpx;
	color: #B6B6B6;
	display: block;
	margin-bottom: 10rpx;
}

.guarantee-text {
	font-size: 24rpx;
	color: #B6B6B6;
	line-height: 1.6;
	display: block;
}

// 底部提交按钮
.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #fff;
	padding: 20rpx 30rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
	z-index: 100;
}

.agree-section {
	display: flex;
	align-items: flex-start;
	gap: 10rpx;
	margin-bottom: 20rpx;
}

.agree-text {
	font-size: 28rpx;
	color: #979797;
	line-height: 1.5;
	flex: 1;

	.link-text {
		color: #000;
		margin: 0 6rpx;
	}
}

.submit-btn {
	width: 100%;
	background-color: #000;
	border-radius: 8rpx;
	padding: 16rpx 0rpx;
	text-align: center;
	transition: opacity 0.2s;
	margin: 0 auto;

	&:active {
		opacity: 0.8;
	}

	.submit-btn-text {
		font-size: 28rpx;
		font-weight: 500;
		color: #fff;
	}
}
</style>
