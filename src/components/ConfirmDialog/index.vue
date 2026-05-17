<script setup lang="ts">
interface Props {
  cancelText?: string
  closeOnOverlay?: boolean
  confirmText?: string
  message?: string
  modelValue: boolean
  showCancel?: boolean
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  cancelText: '取消',
  closeOnOverlay: true,
  confirmText: '确定',
  message: '',
  showCancel: true,
  title: '提示',
})

const emit = defineEmits<{
  'cancel': []
  'close': []
  'confirm': []
  'update:modelValue': [value: boolean]
}>()

const closeDialog = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (!props.closeOnOverlay) return
  closeDialog()
}

const handleCancel = () => {
  emit('cancel')
  closeDialog()
}

const handleConfirm = () => {
  emit('confirm')
  closeDialog()
}
</script>

<template>
  <view v-if="modelValue" class="e-confirm-dialog">
    <view class="e-confirm-dialog__overlay" @click="handleOverlayClick" />
    <view class="e-confirm-dialog__panel">
      <view class="e-confirm-dialog__header">
        <slot name="title">
          <text class="e-confirm-dialog__title">
            {{ title }}
          </text>
        </slot>
      </view>

      <view class="e-confirm-dialog__body">
        <slot>
          <text class="e-confirm-dialog__message">
            {{ message }}
          </text>
        </slot>
      </view>

      <view class="e-confirm-dialog__footer">
        <button v-if="showCancel" class="e-confirm-dialog__button e-confirm-dialog__button--cancel" @click="handleCancel">
          {{ cancelText }}
        </button>
        <button class="e-confirm-dialog__button e-confirm-dialog__button--confirm" @click="handleConfirm">
          {{ confirmText }}
        </button>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.e-confirm-dialog {
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
    top: 50%;
    left: 50%;
    width: 620rpx;
    overflow: hidden;
    background: #fff;
    border-radius: 16rpx;
    transform: translate(-50%, -50%);
  }

  &__header {
    padding: 36rpx 32rpx 0;
    text-align: center;
  }

  &__title {
    font-size: 34rpx;
    font-weight: 700;
    line-height: 1.4;
    color: #17211d;
  }

  &__body {
    padding: 24rpx 40rpx 36rpx;
    text-align: center;
  }

  &__message {
    font-size: 28rpx;
    line-height: 1.6;
    color: #66736e;
  }

  &__footer {
    display: flex;
    border-top: 1rpx solid #edf1ef;
  }

  &__button {
    flex: 1;
    height: 96rpx;
    padding: 0;
    font-size: 30rpx;
    line-height: 96rpx;
    color: #17211d;
    background: #fff;
    border: 0;
    border-radius: 0;

    &::after {
      border: 0;
    }

    &--cancel {
      color: #66736e;
      border-right: 1rpx solid #edf1ef;
    }

    &--confirm {
      font-weight: 600;
      color: #2f7d54;
    }
  }
}
</style>
