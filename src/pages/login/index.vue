<route lang="json5" type="page">
{
  name: 'login',
  meta: {
    public: true,
  },
  style: {
    navigationBarTitleText: '登录注册',
  },
}
</route>

<script lang="ts" setup>
import { mockLoginByPhone, mockLoginByWechat, mockSendVerifyCode } from '@/mocks/auth'
import { useTracker, useTrackPageView } from '@/composables/useTracker'
import { useLoginRedirect } from '@/composables/useLoginRedirect'
import { useUserStore } from '@/stores'

const { track } = useTracker()
useShare({ title: '登录注册' })
useTrackPageView()

const userStore = useUserStore()
const { goAfterLogin } = useLoginRedirect()

const phone = shallowRef('')
const verifyCode = shallowRef('')
const agreed = shallowRef(false)
const loginLoading = shallowRef(false)
const wechatLoading = shallowRef(false)
const codeLoading = shallowRef(false)
const countdown = shallowRef(0)

let countdownTimer: ReturnType<typeof setInterval> | undefined

const codeButtonText = computed(() => countdown.value > 0 ? `${countdown.value}s 后重发` : '获取验证码')
const canSendCode = computed(() => /^1[3-9]\d{9}$/.test(phone.value) && countdown.value === 0 && !codeLoading.value)
const codeButtonState = computed(() => {
  if (countdown.value > 0) return 'counting'
  return canSendCode.value ? 'active' : 'disabled'
})

const clearCountdown = () => {
  if (!countdownTimer) return
  clearInterval(countdownTimer)
  countdownTimer = undefined
}

const startCountdown = (seconds = 60) => {
  countdown.value = seconds
  clearCountdown()
  countdownTimer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      countdown.value = 0
      clearCountdown()
    }
  }, 1000)
}

const ensureAgreement = () => {
  if (agreed.value) return true
  uni.showToast({ title: '请先阅读并同意用户协议', icon: 'none' })
  return false
}

const handleSendCode = async () => {
  if (!canSendCode.value) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
    return
  }

  try {
    codeLoading.value = true
    const result = await mockSendVerifyCode(phone.value)
    verifyCode.value = result.verifyCode
    startCountdown(60)
    uni.showToast({ title: `Mock 验证码：${result.verifyCode}`, icon: 'none' })
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '验证码发送失败', icon: 'none' })
  } finally {
    codeLoading.value = false
  }
}

const handlePhoneLogin = async () => {
  if (!ensureAgreement()) return

  try {
    loginLoading.value = true
    const session = await mockLoginByPhone(phone.value, verifyCode.value)
    userStore.setLoginSession(session)
    track('user_login', { method: 'phone' })
    uni.showToast({ title: '登录成功', icon: 'success' })
    goAfterLogin()
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '登录失败', icon: 'none' })
  } finally {
    loginLoading.value = false
  }
}

const handleWechatLogin = async () => {
  if (!ensureAgreement()) return

  try {
    wechatLoading.value = true
    const session = await mockLoginByWechat()
    userStore.setLoginSession(session)
    track('user_login', { method: 'wechat' })
    uni.showToast({ title: '微信授权成功', icon: 'success' })
    goAfterLogin()
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '微信授权失败', icon: 'none' })
  } finally {
    wechatLoading.value = false
  }
}

const openAgreement = (type: 'user' | 'privacy') => {
  uni.showModal({
    title: type === 'user' ? '用户协议' : '隐私政策',
    content: '这里是模板协议内容，实际项目中可替换为协议详情页或富文本内容。',
    showCancel: false,
  })
}

onUnmounted(clearCountdown)

/** 无导航栏，顶部渐变需要自己让出状态栏（H5 端状态栏高度为 0，由 safe-area 兜底） */
const statusBarTop = (() => {
  try {
    return uni.getSystemInfoSync().statusBarHeight || 0
  } catch {
    return 0
  }
})()
</script>

<template>
  <view class="login-page" :style="{ '--login-status-bar': `${statusBarTop}px` }">
    <view class="login-hero">
      <view class="login-hero__deco login-hero__deco--left" />
      <view class="login-hero__deco login-hero__deco--right" />

      <view class="login-hero__brand">
        <view class="login-hero__badge">
          <image class="login-hero__logo" src="/static/images/logo.svg" mode="aspectFit" />
        </view>
        <text class="login-hero__brand-text">
          uni-starter
        </text>
      </view>

      <text class="login-hero__title">
        欢迎回来
      </text>
      <text class="login-hero__desc">
        手机号即可登录，未注册的手机号将自动创建账号
      </text>
    </view>

    <view class="login-body">
      <view class="login-card">
        <text class="login-card__title">
          验证码登录
        </text>
        <text class="login-card__subtitle">
          未注册的手机号验证后将自动创建账号
        </text>

        <view class="login-field">
          <view class="login-field__icon">
            <wd-icon name="mobile" custom-style="font-size: 32rpx" />
          </view>
          <text class="login-field__prefix">
            +86
          </text>
          <wd-input
            v-model="phone"
            compact
            type="number"
            :maxlength="11"
            placeholder="请输入手机号"
            placeholder-style="color: #9aa5a0"
            clearable
            custom-style="flex: 1; min-width: 0;"
          />
        </view>

        <view class="login-field">
          <view class="login-field__icon">
            <wd-icon name="lock" custom-style="font-size: 32rpx" />
          </view>
          <wd-input
            v-model="verifyCode"
            compact
            type="number"
            :maxlength="6"
            placeholder="请输入验证码"
            placeholder-style="color: #9aa5a0"
            clearable
            custom-style="flex: 1; min-width: 0;"
          >
            <template #suffix>
              <view
                class="login-code"
                :class="`login-code--${codeButtonState}`"
                @click="handleSendCode"
              >
                {{ codeButtonText }}
              </view>
            </template>
          </wd-input>
        </view>

        <view
          class="login-submit"
          hover-class="login-submit--hover"
          :hover-stay-time="80"
          @click="handlePhoneLogin"
        >
          <wd-loading v-if="loginLoading" :size="18" color="#ffffff" />
          <text class="login-submit__text">
            {{ loginLoading ? '登录中…' : '登录 / 注册' }}
          </text>
        </view>

        <view class="login-alt">
          <view class="login-alt__line" />
          <text class="login-alt__text">
            其他登录方式
          </text>
          <view class="login-alt__line" />
        </view>

        <view
          class="login-wechat"
          hover-class="login-wechat--hover"
          :hover-stay-time="80"
          @click="handleWechatLogin"
        >
          <wd-loading v-if="wechatLoading" :size="16" color="#07c160" />
          <wd-icon v-else name="message" custom-style="font-size: 32rpx; color: #07c160;" />
          <text class="login-wechat__text">
            微信授权登录
          </text>
        </view>

        <view class="login-agreement">
          <wd-checkbox v-model="agreed" custom-class="login-agreement__check" />
          <view class="login-agreement__text" @click="agreed = !agreed">
            <text class="login-agreement__plain">
              我已阅读并同意
            </text>
            <text class="login-agreement__link" @click.stop="openAgreement('user')">
              《用户协议》
            </text>
            <text class="login-agreement__plain">
              和
            </text>
            <text class="login-agreement__link" @click.stop="openAgreement('privacy')">
              《隐私政策》
            </text>
          </view>
        </view>
      </view>

      <view class="login-safe">
        <wd-icon name="safe" custom-style="font-size: 24rpx" />
        <text class="login-safe__text">
          全站 HTTPS 加密传输，不会存储你的明文密码
        </text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login-page {
  display: flex;
  flex-direction: column;

  // min-height 保证内容不足一屏时底色也铺满到底部，背景通栏不露白
  min-height: 100vh;
  background: var(--app-color-surface-muted);
}

.login-hero {
  position: relative;
  flex-shrink: 0;

  // 无导航栏，顶部需自行让出状态栏（H5 端状态栏高度为 0，由 safe-area 兜底）
  padding: calc(var(--login-status-bar, 0px) + env(safe-area-inset-top, 0px) + 48rpx) 48rpx 132rpx;
  overflow: hidden;
  color: #fff;
  background: linear-gradient(135deg, var(--wot-primary-6) 0%, var(--wot-primary-5) 100%);
  border-radius: 0 0 48rpx 48rpx;

  &__deco {
    position: absolute;
    background: rgb(255 255 255 / 12%);
    border-radius: 50%;

    &--left {
      top: -96rpx;
      left: -72rpx;
      width: 280rpx;
      height: 280rpx;
    }

    &--right {
      right: -64rpx;
      bottom: -40rpx;
      width: 220rpx;
      height: 220rpx;
      background: rgb(255 255 255 / 8%);
    }
  }

  &__brand {
    display: flex;
    align-items: center;

    &-text {
      margin-left: 20rpx;
      font-size: 28rpx;
      font-weight: 600;
      line-height: 1.4;
      color: rgb(255 255 255 / 92%);
      letter-spacing: 1rpx;
    }
  }

  &__badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 84rpx;
    height: 84rpx;
    background: rgb(255 255 255 / 18%);
    border: 1rpx solid rgb(255 255 255 / 32%);
    border-radius: 24rpx;
  }

  &__logo {
    width: 56rpx;
    height: 56rpx;
  }

  &__title {
    display: block;
    margin-top: 40rpx;
    font-size: 52rpx;
    font-weight: 700;
    line-height: 1.25;
    color: #fff;
    letter-spacing: 2rpx;
  }

  &__desc {
    display: block;
    margin-top: 14rpx;
    font-size: 26rpx;
    line-height: 1.5;
    color: rgb(255 255 255 / 82%);
  }
}

.login-body {
  position: relative;
  flex: 1;

  // 底部安全区与页面底色一致，保证背景通栏铺满到屏幕底部
  padding: 0 32rpx calc(56rpx + env(safe-area-inset-bottom));
  margin-top: -88rpx;
}

.login-card {
  padding: 44rpx 32rpx 36rpx;
  background: var(--app-color-surface);
  border-radius: 28rpx;
  box-shadow: 0 16rpx 40rpx rgb(23 33 29 / 8%);

  &__title {
    display: block;
    font-size: 40rpx;
    font-weight: 700;
    line-height: 1.3;
    color: var(--app-color-text);
  }

  &__subtitle {
    display: block;
    margin-top: 10rpx;
    margin-bottom: 40rpx;
    font-size: 24rpx;
    line-height: 1.5;
    color: var(--app-color-text-tertiary);
  }
}

.login-field {
  display: flex;
  align-items: center;
  height: 96rpx;
  padding: 0 24rpx;
  margin-bottom: 24rpx;
  background: var(--app-color-surface-muted);
  border: 1rpx solid transparent;
  border-radius: 18rpx;

  &__icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    margin-right: 16rpx;
    color: var(--app-color-text-tertiary);
  }

  &__prefix {
    flex-shrink: 0;
    padding-right: 16rpx;
    margin-right: 16rpx;
    font-size: 30rpx;
    line-height: 1.4;
    color: var(--app-color-text);
    border-right: 1rpx solid var(--app-color-border);
  }

  :deep(.wd-input__inner) {
    font-size: 30rpx;
    font-weight: 500;
    color: var(--app-color-text);
  }
}

.login-code {
  flex-shrink: 0;
  padding: 12rpx 0 12rpx 24rpx;
  font-size: 26rpx;
  font-weight: 500;
  line-height: 1.4;
  color: var(--wot-primary-6);

  &:active {
    opacity: 0.6;
  }

  &--counting {
    font-weight: 400;
    color: var(--app-color-text-tertiary);
  }

  &--disabled {
    font-weight: 400;
    color: var(--app-color-text-disabled);
  }
}

.login-submit {
  display: flex;
  gap: 12rpx;
  align-items: center;
  justify-content: center;
  height: 100rpx;
  margin-top: 44rpx;
  background: linear-gradient(135deg, var(--wot-primary-5) 0%, var(--wot-primary-6) 100%);
  border-radius: 999rpx;
  box-shadow: 0 16rpx 32rpx rgb(0 85 254 / 22%);

  &--hover {
    opacity: 0.88;
  }

  &__text {
    font-size: 32rpx;
    font-weight: 600;
    line-height: 1.4;
    color: #fff;
    letter-spacing: 2rpx;
  }
}

.login-alt {
  display: flex;
  align-items: center;
  margin: 40rpx 0 28rpx;

  &__line {
    flex: 1;
    height: 1rpx;
    background: var(--app-color-border);
  }

  &__text {
    padding: 0 20rpx;
    font-size: 24rpx;
    line-height: 1.4;
    color: var(--app-color-text-tertiary);
  }
}

.login-wechat {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 96rpx;
  background: #fff;
  border: 1rpx solid var(--app-color-border);
  border-radius: 999rpx;

  &--hover {
    background: var(--app-color-surface-muted);
  }

  &__text {
    margin-left: 12rpx;
    font-size: 30rpx;
    font-weight: 500;
    line-height: 1.4;
    color: var(--app-color-text-regular);
  }
}

.login-agreement {
  display: flex;
  align-items: flex-start;
  margin-top: 36rpx;

  &__check {
    flex-shrink: 0;
    margin-top: 2rpx;
  }

  &__text {
    flex: 1;
    margin-left: 8rpx;
    font-size: 24rpx;
    line-height: 1.7;
    color: var(--app-color-text-secondary);
  }

  &__plain {
    color: var(--app-color-text-secondary);
  }

  &__link {
    color: var(--wot-primary-6);

    &:active {
      opacity: 0.6;
    }
  }
}

.login-safe {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40rpx;
  color: var(--app-color-text-tertiary);

  &__text {
    margin-left: 8rpx;
    font-size: 22rpx;
    line-height: 1.4;
    color: var(--app-color-text-tertiary);
  }
}
</style>
