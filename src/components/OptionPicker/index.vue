<script setup lang="ts">
export interface OptionPickerItem {
  disabled?: boolean
  label?: string
  value?: string | number
  [key: string]: unknown
}

interface Props {
  cancelText?: string
  confirmText?: string
  labelKey?: string
  modelValue?: string | number
  options: Array<OptionPickerItem | string>
  title?: string
  valueKey?: string
  visible: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cancelText: '取消',
  confirmText: '确定',
  labelKey: 'label',
  modelValue: '',
  title: '请选择',
  valueKey: 'value',
})

const emit = defineEmits<{
  'cancel': []
  'confirm': [value: string | number, item: OptionPickerItem]
  'update:modelValue': [value: string | number]
  'update:visible': [value: boolean]
}>()

const currentIndex = shallowRef(0)

const normalizedOptions = computed<OptionPickerItem[]>(() => {
  return props.options.map((item) => {
    if (typeof item === 'string') {
      return {
        label: item,
        value: item,
      }
    }

    const rawValue = item[props.valueKey] ?? item.value ?? ''

    return {
      ...item,
      label: String(item[props.labelKey] ?? item.label ?? ''),
      value: typeof rawValue === 'number' ? rawValue : String(rawValue),
    }
  })
})

const clampIndex = (index: number) => {
  return Math.min(Math.max(index, 0), Math.max(normalizedOptions.value.length - 1, 0))
}

const pickerValue = computed(() => [currentIndex.value])

const syncCurrentIndex = () => {
  const nextIndex = normalizedOptions.value.findIndex(item => item.value === props.modelValue)
  currentIndex.value = clampIndex(nextIndex >= 0 ? nextIndex : 0)
}

const closePicker = () => {
  emit('update:visible', false)
}

const handleChange = (event: { detail: { value: number[] } }) => {
  currentIndex.value = clampIndex(event.detail.value[0] ?? 0)
}

const handleCancel = () => {
  emit('cancel')
  closePicker()
}

const handleConfirm = () => {
  const item = normalizedOptions.value[currentIndex.value]
  if (!item || item.disabled) return

  const value = item.value ?? ''
  emit('update:modelValue', value)
  emit('confirm', value, item)
  closePicker()
}

watch(
  () => [props.visible, props.modelValue, props.options],
  () => {
    if (props.visible) {
      syncCurrentIndex()
    }
  },
  { immediate: true },
)
</script>

<template>
  <view v-if="visible" class="e-option-picker">
    <view class="e-option-picker__overlay" @click="handleCancel" />
    <view class="e-option-picker__panel">
      <view class="e-option-picker__header">
        <button class="e-option-picker__action e-option-picker__action--cancel" @click="handleCancel">
          {{ cancelText }}
        </button>
        <view class="e-option-picker__title">
          {{ title }}
        </view>
        <button class="e-option-picker__action e-option-picker__action--confirm" @click="handleConfirm">
          {{ confirmText }}
        </button>
      </view>

      <picker-view class="e-option-picker__body" :value="pickerValue" immediate-change @change="handleChange">
        <picker-view-column>
          <view
            v-for="(item, index) in normalizedOptions"
            :key="`${item.value}-${index}`"
            class="e-option-picker__item"
            :class="{ 'e-option-picker__item--disabled': item.disabled }"
          >
            {{ item.label }}
          </view>
        </picker-view-column>
      </picker-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.e-option-picker {
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
    line-height: 1.4;
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

    &--disabled {
      color: var(--app-color-text-disabled);
    }
  }
}
</style>
