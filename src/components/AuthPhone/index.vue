<script setup lang="ts">
import type { PhoneAuthFailPayload, PhoneAuthPayload } from '@/types/user'
import type { PhoneAuthEventDetail } from '@/utils/phone-auth'
import { parsePhoneAuthEvent } from '@/utils/phone-auth'

interface Props {
  /** 非微信端是否允许走开发态兜底（便于在 H5 调试完整登录链路） */
  allowDevFallback?: boolean
  closeOnOverlay?: boolean
  confirmText?: string
  desc?: string
  /** 登录请求进行中，用于禁用授权按钮防止重复触发 */
  loading?: boolean
  modelValue: boolean
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  allowDevFallback: true,
  closeOnOverlay: true,
  confirmText: '授权',
  desc: '授权您的手机号',
  loading: false,
  title: '获得以下权限',
})

const emit = defineEmits<{
  'close': []
  'fail': [payload: PhoneAuthFailPayload]
  'success': [payload: PhoneAuthPayload]
  'update:modelValue': [value: boolean]
}>()

const fail = (reason: PhoneAuthFailPayload['reason'], message: string) => {
  emit('fail', { reason, message })
}

const closePopup = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (!props.closeOnOverlay) return
  closePopup()
}

/** 微信侧授权回调：解析逻辑与登录页共用（@/utils/phone-auth） */
const handleGetPhoneNumber = (event: unknown) => {
  const result = parsePhoneAuthEvent((event as { detail?: PhoneAuthEventDetail })?.detail)

  if (!result.ok) {
    fail(result.fail.reason, result.fail.message)
    return
  }

  emit('success', result.payload)
}

/** 非微信端没有 open-type="getPhoneNumber"，由 allowDevFallback 决定提示还是兜底 */
const handleUnsupported = () => {
  if (!props.allowDevFallback) {
    fail('unsupported', '当前平台不支持微信手机号授权')
    return
  }

  emit('success', { code: 'dev_fallback_phone_code' })
}
</script>

<template>
  <view v-if="modelValue" class="e-auth-phone">
    <view class="e-auth-phone__overlay" @click="handleOverlayClick" />
    <view class="e-auth-phone__panel">
      <view class="e-auth-phone__header">
        <text class="e-auth-phone__title">
          {{ title }}
        </text>
        <view class="e-auth-phone__close" @click="closePopup">
          ✕
        </view>
      </view>

      <view class="e-auth-phone__body">
        <text class="e-auth-phone__desc">
          {{ desc }}
        </text>
      </view>

      <view class="e-auth-phone__footer">
        <!-- #ifdef MP-WEIXIN -->
        <button
          class="e-auth-phone__button"
          open-type="getPhoneNumber"
          :disabled="loading"
          @getphonenumber="handleGetPhoneNumber"
        >
          {{ confirmText }}
        </button>
        <!-- #endif -->
        <!-- #ifndef MP-WEIXIN -->
        <button class="e-auth-phone__button" :disabled="loading" @click="handleUnsupported">
          {{ confirmText }}
        </button>
        <!-- #endif -->
      </view>

      <view class="e-auth-phone__safe-area" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.e-auth-phone {
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
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--app-color-surface);
    border-radius: 24rpx 24rpx 0 0;
  }

  &__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 104rpx;
    padding: 0 96rpx;
  }

  &__title {
    font-size: 34rpx;
    font-weight: 600;
    line-height: 1.4;
    color: var(--app-color-text);
    text-align: center;
  }

  &__close {
    position: absolute;
    top: 50%;
    right: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48rpx;
    height: 48rpx;
    font-size: 32rpx;
    color: var(--app-color-text-tertiary);
    transform: translateY(-50%);
  }

  &__body {
    padding: 0 64rpx;
    text-align: center;
  }

  &__desc {
    font-size: 28rpx;
    line-height: 1.6;
    color: var(--app-color-text-secondary);
  }

  &__footer {
    padding: 56rpx 64rpx 0;
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 88rpx;
    padding: 0;
    font-size: 32rpx;
    font-weight: 500;
    line-height: 88rpx;
    color: #fff;
    background: var(--wot-primary-6);
    border: 0;
    border-radius: 44rpx;

    &::after {
      border: 0;
    }

    &:active {
      background: var(--wot-primary-7);
    }

    &[disabled] {
      color: #fff;
      background: var(--app-color-text-disabled);
    }
  }

  &__safe-area {
    height: env(safe-area-inset-bottom);
    min-height: 32rpx;
  }
}
</style>
