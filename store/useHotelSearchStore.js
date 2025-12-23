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

// 从本地存储加载数据
const loadFromStorage = () => {
	try {
		const stored = uni.getStorageSync('hotelSearchStore')
		if (stored) {
			const parsed = JSON.parse(stored)
			return {
				searchInfo: {
					destination: parsed.searchInfo?.destination || '',
					checkInDate: parsed.searchInfo?.checkInDate || getToday(),
					checkOutDate: parsed.searchInfo?.checkOutDate || getTomorrow(),
					hotelName: parsed.searchInfo?.hotelName || '',
				},
		selectedDestination: parsed.selectedDestination || null,
		cityName: parsed.cityName || '',
		selectedHotel: parsed.selectedHotel || null,
		hotelDetail: parsed.hotelDetail || null, // 酒店详情信息
		calendarShow: false, // UI 状态不需要持久化
		calendarMode: parsed.calendarMode || 'range',
		personCount: parsed.personCount || 1,
		currentCityId: parsed.currentCityId || null // 记录当前列表页使用的城市ID，用于检测城市变化
			}
		}
	} catch (e) {
		console.error('加载 store 数据失败:', e)
	}
	return null
}

// 需要持久化的字段列表
const persistFields = ['searchInfo', 'selectedDestination', 'cityName', 'selectedHotel', 'hotelDetail', 'calendarMode', 'personCount', 'currentCityId']

// 保存到本地存储
const saveToStorage = (state) => {
	try {
		const dataToSave = {}
		persistFields.forEach(key => {
			dataToSave[key] = state[key]
		})
		uni.setStorageSync('hotelSearchStore', JSON.stringify(dataToSave))
	} catch (e) {
		console.error('保存 store 数据失败:', e)
	}
}

// 获取初始状态
const getInitialState = () => {
	const loaded = loadFromStorage()
	if (loaded) {
		return loaded
	}
	return {
		searchInfo: {
			destination: '',
			checkInDate: getToday(),
			checkOutDate: getTomorrow(),
			hotelName: '',
		},
		selectedDestination: null,
		cityName: '',
		selectedHotel: null,
		hotelDetail: null, // 酒店详情信息
		calendarShow: false,
		calendarMode: 'range',
		personCount: 1,
		currentCityId: null // 记录当前列表页使用的城市ID，用于检测城市变化
	}
}

export const useHotelSearchStore = defineStore('hotelSearch', {
	state: () => getInitialState(),
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
		// 获取酒店详情信息
		getHotelDetail: (state) => state.hotelDetail,
		// 获取日历弹窗显示状态
		getCalendarShow: (state) => state.calendarShow,
		// 获取日历模式
		getCalendarMode: (state) => state.calendarMode,
		// 获取人数
		getPersonCount: (state) => state.personCount,
		// 获取选中的目的地
		getSelectedDestination: (state) => state.selectedDestination,
		// 获取城市名称
		getCityName: (state) => state.cityName,
		// 获取当前列表页使用的城市ID
		getCurrentCityId: (state) => state.currentCityId
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
		// 设置酒店详情信息
		setHotelDetail(detail) {
			this.hotelDetail = detail
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
		// 设置日历弹窗显示状态（不需要持久化）
		setCalendarShow(show) {
			this.calendarShow = show
		},
		// 设置日历模式
		setCalendarMode(mode) {
			this.calendarMode = mode
		},
		// 设置人数
		setPersonCount(count) {
			this.personCount = count
		},
		// 增加人数（不限制最大值，由组件控制）
		increasePersonCount() {
			this.personCount++
		},
		// 减少人数（不限制最小值，由组件控制）
		decreasePersonCount() {
			this.personCount--
		},
		// 设置选中的目的地（城市对象）
		setSelectedDestination(destination) {
			this.selectedDestination = destination
			// 同时更新城市名称
			if (destination && destination.name) {
				this.cityName = destination.name
			} else if (!destination) {
				this.cityName = ''
			}
		},
		// 设置城市名称
		setCityName(cityName) {
			this.cityName = cityName
		},
		// 设置当前列表页使用的城市ID（用于检测城市变化）
		setCurrentCityId(cityId) {
			this.currentCityId = cityId
		}
	}
})
