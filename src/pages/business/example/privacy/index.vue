<route lang="json5" type="page">
{
  layout: 'default',
  name: 'example-privacy',
  meta: {
    public: true,
  },
  style: {
    navigationBarTitleText: '隐私协议示例',
  },
}
</route>

<script lang="ts" setup>
import { usePrivacy } from '@/composables/usePrivacy'
import { useTrackPageView } from '@/composables/useTracker'

useShare({ title: '隐私协议示例' })
useTrackPageView()

const {
  supported,
  visible,
  needAuthorization,
  privacyContractName,
  lastReferrer,
  refreshPrivacyState,
  requirePrivacyAuthorize,
  openPrivacyContract,
  showDialog,
} = usePrivacy()

const refreshing = shallowRef(false)

/** 状态文案：非微信端不涉及隐私授权，直接说明即可 */
const supportText = computed(() => (supported.value ? '微信小程序' : '当前平台无需隐私授权'))
const authorizationText = computed(() => (needAuthorization.value ? '需要授权' : '无需授权 / 已同意'))
const contractText = computed(() => privacyContractName.value || '未取到（后台未声明收集类型时为空）')
const referrerText = computed(() => lastReferrer.value || '—')

const handleRefresh = async () => {
  refreshing.value = true
  try {
    await refreshPrivacyState()
    uni.showToast({ title: '已刷新', icon: 'success' })
  } finally {
    refreshing.value = false
  }
}

/** 主动预检：业务在调用隐私接口前先确认，返回 false 时应当中断后续操作 */
const handleRequireAuthorize = async () => {
  const authorized = await requirePrivacyAuthorize()
  uni.showToast({
    title: authorized ? '已获得隐私授权' : '用户未同意隐私授权',
    icon: 'none',
  })
}

/** 非微信端用预览按钮查看弹窗 UI 与交互 */
const handlePreview = () => {
  if (supported.value) {
    uni.showToast({ title: '微信端由隐私接口触发，无需手动预览', icon: 'none' })
    return
  }

  showDialog('preview')
}
</script>

<template>
  <z-paging :show-scrollbar="false">
    <template #top>
      <Navbar title="隐私协议示例" />
    </template>

    <view class="privacy-page">
      <view class="privacy-card">
        <view class="privacy-card__title">
          usePrivacy
        </view>
        <view class="privacy-card__desc">
          按微信官方《小程序隐私协议开发指南》实现：隐私接口被调用时由
          onNeedPrivacyAuthorization 拉起全局弹窗，用户同意后原接口才会继续执行。
          非微信端全部降级为「视为已授权」，业务代码不需要写平台判断。
        </view>
        <view class="privacy-card__meta">
          ⚠️ 开关 manifest.config.ts 的 mp-weixin.__usePrivacyCheck__ 当前为关闭（false）：
          关闭时微信不在运行时拦截隐私接口，这里的预检与弹窗都不会被触发。
          开启前请先在公众平台声明收集类型，否则 chooseImage 等接口会直接 fail
        </view>
      </view>

      <view class="privacy-section">
        <view class="privacy-section__title">
          当前状态
        </view>
        <view class="privacy-row">
          <text class="privacy-row__label">
            运行平台
          </text>
          <text class="privacy-row__value">
            {{ supportText }}
          </text>
        </view>
        <view class="privacy-row">
          <text class="privacy-row__label">
            授权状态
          </text>
          <text class="privacy-row__value">
            {{ authorizationText }}
          </text>
        </view>
        <view class="privacy-row">
          <text class="privacy-row__label">
            隐私协议名
          </text>
          <text class="privacy-row__value">
            {{ contractText }}
          </text>
        </view>
        <view class="privacy-row">
          <text class="privacy-row__label">
            最近触发来源
          </text>
          <text class="privacy-row__value">
            {{ referrerText }}
          </text>
        </view>
        <view class="privacy-row">
          <text class="privacy-row__label">
            弹窗是否显示
          </text>
          <text class="privacy-row__value">
            {{ visible ? '显示中' : '未显示' }}
          </text>
        </view>
      </view>

      <view class="privacy-actions">
        <wd-button block :loading="refreshing" @click="handleRefresh">
          刷新状态
        </wd-button>
        <wd-button block type="primary" @click="handleRequireAuthorize">
          主动预检 requirePrivacyAuthorize
        </wd-button>
        <wd-button plain block @click="openPrivacyContract">
          打开微信官方《隐私保护指引》
        </wd-button>
        <wd-button plain block @click="handlePreview">
          预览隐私弹窗（非微信端）
        </wd-button>
      </view>

      <view class="privacy-section">
        <view class="privacy-section__title">
          生效条件
        </view>
        <view class="privacy-section__desc">
          1. manifest.config.ts 中开启 mp-weixin.__usePrivacyCheck__；
          2. 微信公众平台「设置 - 服务内容声明 - 用户隐私保护指引」中声明实际收集的信息类型，
          未声明时 getPrivacySetting 返回 needAuthorization 为 false，弹窗不会出现；
          3. 用真机（基础库 2.32.3+）验证：清掉小程序缓存后再次进入，触发手机号授权等隐私接口即可看到弹窗。
        </view>
      </view>

      <view class="privacy-section">
        <view class="privacy-section__title">
          业务侧怎么用
        </view>
        <view class="privacy-section__desc">
          被动触发无需改代码：隐私接口被调用时，微信回调 onNeedPrivacyAuthorization，
          由 App.ku.vue 全局挂载的弹窗接管。
          需要「先同意再执行」的场景（如手机号授权、选图）可在动作前 await requirePrivacyAuthorize()，
          返回 false 时中断即可 —— 注意它会主动拉起弹窗，所以只在开关开启时才加。
        </view>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.privacy-page {
  min-height: 100%;
  padding: 32rpx;
  background: var(--app-color-surface-muted);
}

.privacy-card {
  padding: 32rpx;
  margin-bottom: 24rpx;
  background: var(--app-color-surface);
  border: 1rpx solid var(--app-color-border);
  border-radius: 16rpx;

  &__title {
    font-size: 32rpx;
    font-weight: 600;
    color: var(--app-color-text);
  }

  &__desc {
    margin-top: 16rpx;
    font-size: 26rpx;
    line-height: 1.7;
    color: var(--app-color-text-secondary);
  }

  &__meta {
    margin-top: 16rpx;
    font-size: 24rpx;
    line-height: 1.6;
    color: var(--app-color-text-tertiary);
  }
}

.privacy-section {
  padding: 32rpx;
  margin-bottom: 24rpx;
  background: var(--app-color-surface);
  border: 1rpx solid var(--app-color-border);
  border-radius: 16rpx;

  &__title {
    margin-bottom: 20rpx;
    font-size: 30rpx;
    font-weight: 600;
    color: var(--app-color-text);
  }

  &__desc {
    font-size: 26rpx;
    line-height: 1.7;
    color: var(--app-color-text-secondary);
  }
}

.privacy-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16rpx 0;

  & + & {
    border-top: 1rpx solid var(--app-color-border);
  }

  &__label {
    flex-shrink: 0;
    font-size: 27rpx;
    color: var(--app-color-text-secondary);
  }

  &__value {
    flex: 1;
    margin-left: 24rpx;
    font-size: 27rpx;
    line-height: 1.5;
    color: var(--app-color-text);
    text-align: right;
    word-break: break-all;
  }
}

.privacy-actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 24rpx;
}
</style>
