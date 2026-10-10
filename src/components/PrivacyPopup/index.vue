<script setup lang="ts">
/**
 * 微信小程序隐私协议弹窗（全局单例，挂在 App.ku.vue 根组件上）。
 *
 * 触发方式由 `usePrivacy` 决定：
 * - 微信端：隐私接口 / 组件被调用时由 `wx.onNeedPrivacyAuthorization` 拉起；
 * - 其他平台：调用 `showDialog()` 可预览 UI，或业务主动提示。
 *
 * 「同意」按钮在微信端必须用 `<button open-type="agreePrivacyAuthorization">`，
 * 基础库会校验该按钮是否被用户真实点击过，用普通按钮调 resolve 会失败。
 * 点遮罩等同「拒绝」，避免隐私接口永久 pending。
 */
import { PRIVACY_AGREE_BUTTON_ID, usePrivacy } from '@/composables/usePrivacy'

interface Props {
  title?: string
  /** 拿不到触发来源时的兜底说明 */
  desc?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '隐私保护指引',
  desc: '为了向您提供相应服务，需要您阅读并同意隐私保护指引。',
})

const {
  visible,
  privacyContractName,
  lastReferrer,
  agree,
  disagree,
  openPrivacyContract,
} = usePrivacy()

/** 按触发来源给出更具体的说明，让用户理解为什么弹窗 */
const reasonText = computed(() => {
  const referrer = lastReferrer.value

  if (referrer.includes('getPhoneNumber')) return '手机号授权需要您先阅读并同意隐私保护指引。'
  if (referrer.includes('chooseImage') || referrer.includes('chooseMedia')) return '选择图片需要您先阅读并同意隐私保护指引。'
  if (referrer.includes('getLocation') || referrer.includes('chooseLocation')) return '获取位置需要您先阅读并同意隐私保护指引。'

  return props.desc
})

const contractLabel = computed(() => privacyContractName.value || '隐私保护指引')
</script>

<template>
  <view v-if="visible" class="e-privacy-popup">
    <view class="e-privacy-popup__overlay" @click="disagree" />
    <view class="e-privacy-popup__panel">
      <view class="e-privacy-popup__header">
        <text class="e-privacy-popup__title">
          {{ title }}
        </text>
      </view>

      <view class="e-privacy-popup__body">
        <text class="e-privacy-popup__message">
          {{ reasonText }}请阅读
        </text>
        <text class="e-privacy-popup__link" @click="openPrivacyContract">
          《{{ contractLabel }}》
        </text>
        <text class="e-privacy-popup__message">
          后继续使用。
        </text>
      </view>

      <view class="e-privacy-popup__footer">
        <button class="e-privacy-popup__button e-privacy-popup__button--cancel" @click="disagree">
          拒绝
        </button>
        <!-- #ifdef MP-WEIXIN -->
        <button
          :id="PRIVACY_AGREE_BUTTON_ID"
          class="e-privacy-popup__button e-privacy-popup__button--confirm"
          open-type="agreePrivacyAuthorization"
          @agreeprivacyauthorization="agree"
        >
          同意
        </button>
        <!-- #endif -->
        <!-- #ifndef MP-WEIXIN -->
        <button class="e-privacy-popup__button e-privacy-popup__button--confirm" @click="agree">
          同意
        </button>
        <!-- #endif -->
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.e-privacy-popup {
  position: fixed;
  inset: 0;
  z-index: 1100;

  &__overlay {
    position: absolute;
    inset: 0;
    background: var(--app-color-overlay);
  }

  &__panel {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 620rpx;
    overflow: hidden;
    background: var(--app-color-surface);
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
    color: var(--app-color-text);
  }

  &__body {
    padding: 24rpx 40rpx 36rpx;
  }

  &__message {
    font-size: 28rpx;
    line-height: 1.6;
    color: var(--app-color-text-secondary);
  }

  &__link {
    font-size: 28rpx;
    line-height: 1.6;
    color: var(--wot-primary-6);
  }

  &__footer {
    display: flex;
    border-top: 1rpx solid var(--app-color-border);
  }

  &__button {
    flex: 1;
    height: 96rpx;
    padding: 0;
    font-size: 30rpx;
    line-height: 96rpx;
    color: var(--app-color-text);
    background: var(--app-color-surface);
    border: 0;
    border-radius: 0;

    &::after {
      border: 0;
    }

    &--cancel {
      color: var(--app-color-text-secondary);
      border-right: 1rpx solid var(--app-color-border);
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
}
</style>
