<script setup lang="ts">
import { computed } from 'vue';
import { useHotelSearchStore } from '@/store/useHotelSearchStore';
import dayjs from 'dayjs';

const hotelSearchStore = useHotelSearchStore();

// 接收 show 属性控制显示
const props = defineProps<{
	show: boolean;
}>();

const emit = defineEmits<{
	'update:show': [value: boolean];
}>();

// 日历默认选中的日期范围
const defaultDate = computed(() => {
	const checkInDate = hotelSearchStore.getCheckInDate;
	const checkOutDate = hotelSearchStore.getCheckOutDate;
	if (checkInDate && checkOutDate) {
		return [checkInDate, checkOutDate];
	}
	return [];
});

// 日历确认回调
const handleConfirm = (dates: string[]) => {
	// 对于 range 模式，dates 是一个包含日期字符串的数组
	// 格式为 ['YYYY-MM-DD', 'YYYY-MM-DD', ...]
	if (Array.isArray(dates) && dates.length > 0) {
		// 过滤掉空值并排序，确保第一个是最早的日期，最后一个是最近的日期
		const validDates = dates.filter(date => date && date.trim()).sort();
		
		if (validDates.length > 0) {
			// 第一个日期（最早）作为入住日期
			const startDate = validDates[0];
			// 最后一个日期（最晚）作为离店日期
			const endDate = validDates[validDates.length - 1];
			
			// 设置到 store 中
			if (startDate) {
				hotelSearchStore.setCheckInDate(startDate);
			}
			if (endDate && endDate !== startDate) {
				// 如果结束日期和开始日期不同，设置为离店日期
				hotelSearchStore.setCheckOutDate(endDate);
			} else if (endDate === startDate) {
				// 如果只选择了一天，离店日期应该是入住日期的下一天
				const nextDay = dayjs(startDate).add(1, 'day').format('YYYY-MM-DD');
				hotelSearchStore.setCheckOutDate(nextDay);
			}
		}
	}
	
	// 关闭日历（同步到父组件）
	emit('update:show', false);
};

// 日历关闭回调
const handleClose = () => {
	emit('update:show', false);
};

</script>

<template>
	<!-- 日历弹窗组件 -->
	<up-calendar 
		:show="props.show"
		mode="range"
		:defaultDate="defaultDate"
		:closeOnClickOverlay="true"
		@update:show="(val: boolean) => emit('update:show', val)"
		@confirm="handleConfirm"
		@close="handleClose"
		@cancel="handleClose"
	></up-calendar>
</template>

<style scoped lang="scss">
</style>

