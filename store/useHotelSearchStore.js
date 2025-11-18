import { defineStore } from 'pinia'
import dayjs from 'dayjs'

// 获取今天的日期
const getToday = () => {
	return dayjs().format('YYYY-MM-DD')
}

// 获取明天的日期
const getTomorrow = () => {
	return dayjs().add(1, 'day').format('YYYY-MM-DD')
}

export const useHotelSearchStore = defineStore('hotelSearch', {
	state: () => ({
		searchInfo: {
			destination: '', // 目的地
			checkInDate: getToday(), // 入住时间（默认今天）
			checkOutDate: getTomorrow(), // 离店时间（默认明天）
			hotelName: '', // 酒店名称
		},
		selectedHotel: null, // 选中的酒店对象
		calendarShow: false, // 日历弹窗显示状态
		calendarMode: 'range' // 日历模式：range-日期范围选择
	}),
	getters: {
		// 获取完整的搜索信息对象
		getSearchInfo: (state) => state.searchInfo,
		// 获取目的地
		getDestination: (state) => state.searchInfo.destination,
		// 获取入住时间
		getCheckInDate: (state) => state.searchInfo.checkInDate,
		// 获取离店时间
		getCheckOutDate: (state) => state.searchInfo.checkOutDate,
		// 获取酒店名称
		getHotelName: (state) => state.searchInfo.hotelName,
		// 获取选中的酒店对象
		getSelectedHotel: (state) => state.selectedHotel,
		// 获取日历弹窗显示状态
		getCalendarShow: (state) => state.calendarShow,
		// 获取日历模式
		getCalendarMode: (state) => state.calendarMode
	},
	actions: {
		// 设置完整的搜索信息对象
		setSearchInfo(info) {
			this.searchInfo = {
				...this.searchInfo,
				...info
			}
		},
		// 设置目的地
		setDestination(destination) {
			this.searchInfo.destination = destination
		},
		// 设置入住时间
		setCheckInDate(checkInDate) {
			this.searchInfo.checkInDate = checkInDate
		},
		// 设置离店时间
		setCheckOutDate(checkOutDate) {
			this.searchInfo.checkOutDate = checkOutDate
		},
		// 设置酒店名称
		setHotelName(hotelName) {
			this.searchInfo.hotelName = hotelName
		},
		// 设置选中的酒店对象
		setSelectedHotel(hotel) {
			this.selectedHotel = hotel
		},
		// 重置所有搜索信息（重置为默认值：今天和明天）
		resetSearchInfo() {
			this.searchInfo = {
				destination: '',
				checkInDate: getToday(),
				checkOutDate: getTomorrow(),
				hotelName: ''
			}
		},
		// 重置选中的酒店
		resetSelectedHotel() {
			this.selectedHotel = null
		},
		// 设置日历弹窗显示状态
		setCalendarShow(show) {
			this.calendarShow = show
		},
		// 设置日历模式
		setCalendarMode(mode) {
			this.calendarMode = mode
		}
	}
})

