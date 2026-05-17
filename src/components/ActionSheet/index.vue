<script setup lang="ts">
export interface ActionSheetItem {
  disabled?: boolean
  name: string
  type?: 'default' | 'danger' | 'cancel'
  value?: string | number
}

interface Props {
  actions: ActionSheetItem[]
  cancelText?: string
  closeOnOverlay?: boolean
  modelValue: boolean
  showCancel?: boolean
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  cancelText: '取消',
  closeOnOverlay: true,
  showCancel: true,
  title: '',
})

const emit = defineEmits<{
  'cancel': []
  'close': []
  'select': [item: ActionSheetItem, index: number]
  'update:modelValue': [value: boolean]
}>()

const closeSheet = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (!props.closeOnOverlay) return
  closeSheet()
}

const handleCancel = () => {
  emit('cancel')
  closeSheet()
}

const handleSelect = (item: ActionSheetItem, index: number) => {
  if (item.disabled) return
  emit('select', item, index)
  closeSheet()
}
</script>

<template>
  <view v-if="modelValue" class="e-action-sheet">
    <view class="e-action-sheet__overlay" @click="handleOverlayClick" />
    <view class="e-action-sheet__panel">
      <view v-if="title" class="e-action-sheet__header">
        {{ title }}
      </view>

      <view class="e-action-sheet__list">
        <button
          v-for="(item, index) in actions"
          :key="`${item.name}-${index}`"
          class="e-action-sheet__item"
          :class="{
            'e-action-sheet__item--danger': item.type === 'danger',
            'e-action-sheet__item--disabled': item.disabled,
          }"
          @click="handleSelect(item, index)"
        >
          {{ item.name }}
        </button>
      </view>

      <button v-if="showCancel" class="e-action-sheet__cancel" @click="handleCancel">
        {{ cancelText }}
      </button>
      <view class="e-action-sheet__safe-area" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.e-action-sheet {
  position: fixed;
  inset: 0;
  z-index: 1000;

  &__overlay {
    position: absolute;
    inset: 0;
    background: rgb(0 0 0 / 45%);
  }

  &__panel {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    background: #f6f8f7;
    border-radius: 24rpx 24rpx 0 0;
  }

  &__header {
    padding: 28rpx 32rpx;
    font-size: 26rpx;
    line-height: 1.5;
    color: #66736e;
    text-align: center;
    background: #fff;
  }

  &__list {
    background: #fff;
  }

  &__item,
  &__cancel {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 104rpx;
    padding: 0;
    font-size: 30rpx;
    line-height: 1.4;
    color: #17211d;
    background: #fff;
    border: 0;
    border-radius: 0;

    &::after {
      border: 0;
    }
  }

  &__item {
    border-top: 1rpx solid #edf1ef;

    &:active {
      background: #f6f8f7;
    }

    &--danger {
      color: #cf3d32;
    }

    &--disabled {
      color: #b8c0bc;
      background: #fff;

      &:active {
        background: #fff;
      }
    }
  }

  &__cancel {
    margin-top: 16rpx;
    font-weight: 500;

    &:active {
      background: #f6f8f7;
    }
  }

  &__safe-area {
    height: env(safe-area-inset-bottom);
    min-height: 16rpx;
    background: #fff;
  }
}
</style>
