<script setup lang="ts">
type DatePickerType = 'day' | 'month' | 'year'

interface Props {
  cancelText?: string
  confirmText?: string
  maxYear?: number
  minYear?: number
  modelValue?: string
  title?: string
  type?: DatePickerType
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cancelText: '取消',
  confirmText: '确定',
  maxYear: new Date().getFullYear() + 20,
  minYear: 1970,
  modelValue: '',
  title: '选择日期',
  type: 'day',
})

const emit = defineEmits<{
  'cancel': []
  'confirm': [value: string]
  'update:modelValue': [value: string]
  'update:visible': [value: boolean]
}>()

const currentIndexes = shallowRef([0, 0, 0])

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}

const createNumberRange = (start: number, end: number) => {
  if (end < start) return [start]

  return Array.from({ length: end - start + 1 }, (_item, index) => start + index)
}

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate()
}

const yearBounds = computed(() => {
  return {
    max: Math.max(props.minYear, props.maxYear),
    min: Math.min(props.minYear, props.maxYear),
  }
})

const years = computed(() => createNumberRange(yearBounds.value.min, yearBounds.value.max))
const months = computed(() => createNumberRange(1, 12))
const days = computed(() => {
  const year = years.value[currentIndexes.value[0]] ?? yearBounds.value.min
  const month = months.value[currentIndexes.value[1]] ?? 1

  return createNumberRange(1, getDaysInMonth(year, month))
})
const columnCount = computed(() => {
  if (props.type === 'year') return 1
  if (props.type === 'month') return 2

  return 3
})
const pickerValue = computed(() => {
  return currentIndexes.value.slice(0, columnCount.value)
})

const pad = (value: number) => String(value).padStart(2, '0')

const findYearIndex = (year: number) => {
  return Math.max(0, years.value.findIndex(item => item === year))
}

const getDateParts = () => {
  const [year, month, day] = props.modelValue ? props.modelValue.split('-').map(Number) : []
  const now = new Date()

  return {
    day: day || now.getDate(),
    month: month || now.getMonth() + 1,
    year: year || now.getFullYear(),
  }
}

const createIndexes = (year: number, month: number, day: number) => {
  const safeYear = clamp(year, yearBounds.value.min, yearBounds.value.max)
  const safeMonth = clamp(month, 1, 12)
  const dayCount = getDaysInMonth(safeYear, safeMonth)

  return [
    findYearIndex(safeYear),
    safeMonth - 1,
    clamp(day, 1, dayCount) - 1,
  ]
}

const parseModelValue = () => {
  const { day, month, year } = getDateParts()

  currentIndexes.value = createIndexes(year, month, day)
}

const closePicker = () => {
  emit('update:visible', false)
}

const formatValue = () => {
  const year = years.value[currentIndexes.value[0]] ?? props.minYear
  const month = months.value[currentIndexes.value[1]] ?? 1
  const day = days.value[currentIndexes.value[2]] ?? 1

  if (props.type === 'year') return String(year)
  if (props.type === 'month') return `${year}-${pad(month)}`
  return `${year}-${pad(month)}-${pad(day)}`
}

const handleChange = (event: { detail: { value: number[] } }) => {
  const [yearIndex = 0, monthIndex = 0, dayIndex = 0] = event.detail.value
  const safeYearIndex = clamp(yearIndex, 0, years.value.length - 1)
  const safeMonthIndex = clamp(monthIndex, 0, months.value.length - 1)
  const year = years.value[safeYearIndex] ?? yearBounds.value.min
  const month = months.value[safeMonthIndex] ?? 1
  const maxDayIndex = getDaysInMonth(year, month) - 1

  currentIndexes.value = [safeYearIndex, safeMonthIndex, clamp(dayIndex, 0, maxDayIndex)]
}

const handleCancel = () => {
  emit('cancel')
  closePicker()
}

const handleConfirm = () => {
  const value = formatValue()

  emit('update:modelValue', value)
  emit('confirm', value)
  closePicker()
}

watch(
  () => [props.visible, props.modelValue, props.type],
  () => {
    if (props.visible) {
      parseModelValue()
    }
  },
  { immediate: true },
)
</script>

<template>
  <view v-if="visible" class="e-date-picker">
    <view class="e-date-picker__overlay" @click="handleCancel" />
    <view class="e-date-picker__panel">
      <view class="e-date-picker__header">
        <button class="e-date-picker__action e-date-picker__action--cancel" @click="handleCancel">
          {{ cancelText }}
        </button>
        <view class="e-date-picker__title">
          {{ title }}
        </view>
        <button class="e-date-picker__action e-date-picker__action--confirm" @click="handleConfirm">
          {{ confirmText }}
        </button>
      </view>

      <picker-view class="e-date-picker__body" :value="pickerValue" immediate-change @change="handleChange">
        <picker-view-column>
          <view v-for="year in years" :key="year" class="e-date-picker__item">
            {{ year }}年
          </view>
        </picker-view-column>
        <picker-view-column v-if="type !== 'year'">
          <view v-for="month in months" :key="month" class="e-date-picker__item">
            {{ month }}月
          </view>
        </picker-view-column>
        <picker-view-column v-if="type === 'day'">
          <view v-for="day in days" :key="day" class="e-date-picker__item">
            {{ day }}日
          </view>
        </picker-view-column>
      </picker-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.e-date-picker {
  position: fixed;
  inset: 0;
  z-index: 1000;

  &__overlay {
    position: absolute;
    inset: 0;
    background: var(--app-color-overlay);
  }

  &__panel {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    background: var(--app-color-surface);
    border-radius: 24rpx 24rpx 0 0;
  }

  &__header {
    display: flex;
    align-items: center;
    height: 96rpx;
    border-bottom: 1rpx solid var(--app-color-border);
  }

  &__action {
    width: 160rpx;
    height: 96rpx;
    padding: 0;
    font-size: 28rpx;
    line-height: 96rpx;
    background: transparent;
    border: 0;
    border-radius: 0;

    &::after {
      border: 0;
    }

    &--cancel {
      color: var(--app-color-text-secondary);
    }

    &--confirm {
      font-weight: 600;
      color: var(--wot-primary-6);

      &:active {
        color: var(--wot-primary-7);
        background: var(--app-primary-soft);
      }
    }
  }

  &__title {
    flex: 1;
    font-size: 30rpx;
    font-weight: 600;
    color: var(--app-color-text);
    text-align: center;
  }

  &__body {
    width: 100%;
    height: 480rpx;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 96rpx;
    font-size: 30rpx;
    color: var(--app-color-text);
  }
}
</style>
