<route lang="json5" type="page">
{
  name: 'login',
  style: {
    navigationBarTitleText: '登录注册',
  },
}
</route>

<script lang="ts" setup>
import { mockLoginByPhone, mockLoginByWechat, mockSendVerifyCode } from '@/mocks/auth'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

const phone = shallowRef('')
const verifyCode = shallowRef('')
const agreed = shallowRef(false)
const loginLoading = shallowRef(false)
const wechatLoading = shallowRef(false)
const codeLoading = shallowRef(false)
const countdown = shallowRef(0)

let countdownTimer: ReturnType<typeof setInterval> | undefined

const codeButtonText = computed(() => countdown.value > 0 ? `${countdown.value}s` : '获取验证码')
const canSendCode = computed(() => /^1[3-9]\d{9}$/.test(phone.value) && countdown.value === 0 && !codeLoading.value)

function toggleAgreement() {
  agreed.value = !agreed.value
}

function clearCountdown() {
  if (!countdownTimer) return
  clearInterval(countdownTimer)
  countdownTimer = undefined
}

function startCountdown(seconds = 60) {
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

function ensureAgreement() {
  if (agreed.value) return true
  uni.showToast({ title: '请先阅读并同意用户协议', icon: 'none' })
  return false
}

function goUserCenter() {
  uni.switchTab({ url: '/pages/my/index' })
}

async function handleSendCode() {
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

async function handlePhoneLogin() {
  if (!ensureAgreement()) return

  try {
    loginLoading.value = true
    const session = await mockLoginByPhone(phone.value, verifyCode.value)
    userStore.setLoginSession(session)
    uni.showToast({ title: '登录成功', icon: 'success' })
    goUserCenter()
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '登录失败', icon: 'none' })
  } finally {
    loginLoading.value = false
  }
}

async function handleWechatLogin() {
  if (!ensureAgreement()) return

  try {
    wechatLoading.value = true
    const session = await mockLoginByWechat()
    userStore.setLoginSession(session)
    uni.showToast({ title: '微信授权成功', icon: 'success' })
    goUserCenter()
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '微信授权失败', icon: 'none' })
  } finally {
    wechatLoading.value = false
  }
}

function openAgreement(type: 'user' | 'privacy') {
  uni.showModal({
    title: type === 'user' ? '用户协议' : '隐私政策',
    content: '这里是模板协议内容，实际项目中可替换为协议详情页或富文本内容。',
    showCancel: false,
  })
}

onUnmounted(clearCountdown)
</script>

<template>
  <z-paging>
    <template #top>
      <Navbar title="登录注册" />
    </template>

    <view class="login-page">
      <view class="login-header">
        <image class="login-logo" src="/static/images/logo.svg" mode="aspectFit" />
        <view class="login-title">
          欢迎使用 uni-temp
        </view>
        <view class="login-desc">
          手机号验证码登录，未注册手机号将自动创建 mock 账号
        </view>
      </view>

      <view class="login-panel">
        <wd-cell-group border>
          <wd-input v-model="phone" label="手机号" clearable type="number" :maxlength="11" placeholder="请输入手机号" />
          <wd-input v-model="verifyCode" label="验证码" clearable type="number" :maxlength="6" placeholder="模板验证码 123456">
            <template #suffix>
              <wd-button size="small" :disabled="!canSendCode" :loading="codeLoading" @click="handleSendCode">
                {{ codeButtonText }}
              </wd-button>
            </template>
          </wd-input>
        </wd-cell-group>

        <wd-button custom-class="login-submit" block type="primary" :loading="loginLoading" @click="handlePhoneLogin">
          手机号登录 / 注册
        </wd-button>

        <wd-button custom-class="wechat-submit" plain block :loading="wechatLoading" @click="handleWechatLogin">
          微信授权登录
        </wd-button>

        <view class="agreement-row" @click="toggleAgreement">
          <view class="agreement-check" :class="{ 'agreement-check--active': agreed }" />
          <text class="agreement-text">
            我已阅读并同意
          </text>
          <text class="agreement-link" @click.stop="openAgreement('user')">
            《用户协议》
          </text>
          <text class="agreement-link" @click.stop="openAgreement('privacy')">
            《隐私政策》
          </text>
        </view>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.login-page {
  min-height: 100%;
  padding: 48rpx 32rpx 80rpx;
  background: #f6f8f7;

  .login-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 36rpx 0 48rpx;

    .login-logo {
      width: 120rpx;
      height: 120rpx;
      margin-bottom: 24rpx;
    }

    .login-title {
      font-size: 42rpx;
      font-weight: 700;
      line-height: 1.3;
      color: #17211d;
    }

    .login-desc {
      max-width: 560rpx;
      margin-top: 16rpx;
      font-size: 26rpx;
      line-height: 1.5;
      color: #66736e;
      text-align: center;
    }
  }

  .login-panel {
    padding: 28rpx;
    background: #fff;
    border: 1rpx solid #edf1ef;
    border-radius: 16rpx;

    :deep(.login-submit) {
      margin-top: 36rpx;
    }

    :deep(.wechat-submit) {
      margin-top: 20rpx;
    }

    .agreement-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      margin-top: 28rpx;
      font-size: 24rpx;
      line-height: 1.7;
      color: #77827e;

      .agreement-check {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28rpx;
        height: 28rpx;
        margin-right: 12rpx;
        border: 2rpx solid #b7c2bd;
        border-radius: 50%;

        &--active {
          color: #fff;
          background: var(--wot-primary-6);
          border-color: var(--wot-primary-6);
        }
      }

      .agreement-text {
        margin-right: 4rpx;
      }

      .agreement-link {
        color: var(--wot-primary-6);
      }
    }
  }
}
</style>
