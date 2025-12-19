import { createPinia } from 'pinia'

const pinia = createPinia()

// 自动持久化插件：监听 hotelSearch store 的变化并保存
pinia.use(({ store }) => {
	if (store.$id === 'hotelSearch') {
		let saveTimer = null
		store.$subscribe((mutation, state) => {
			// 防抖：避免频繁保存
			if (saveTimer) clearTimeout(saveTimer)
			saveTimer = setTimeout(() => {
				try {
					const dataToSave = {
						searchInfo: state.searchInfo,
						selectedDestination: state.selectedDestination,
						cityName: state.cityName,
						selectedHotel: state.selectedHotel,
						calendarMode: state.calendarMode,
						personCount: state.personCount
					}
					uni.setStorageSync('hotelSearchStore', JSON.stringify(dataToSave))
				} catch (e) {
					console.error('保存 store 数据失败:', e)
				}
			}, 100)
		})
	}
})

export default pinia
export * from './useDownloadStore'
export * from './useHotelSearchStore'

