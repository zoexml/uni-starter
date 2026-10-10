<route lang="json5" type="page">
{
  layout: 'default',
  name: 'webview',
  meta: {
    public: true,
  },
  style: {
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: '网页容器',
    navigationStyle: 'default',
  },
}
</route>

<script lang="ts" setup>
import { useTrackPageView } from '@/composables/useTracker'
import { useWebView } from '@/composables/useWebView'

useShare({ title: '网页容器' })
useTrackPageView()

const route = useRoute()

const {
  bridgeEnv,
  bridgeLogs,
  clearBridgeLogs,
  errorMessage,
  errorTitle,
  handleFrameError,
  handleFrameLoad,
  handleWebViewMessage,
  hasError,
  iframeAllow,
  iframeSandbox,
  pageLoaded,
  pageReady,
  pageTitle,
  pageUrl,
  retry,
} = useWebView()

/** 带 debug=1 打开时展示桥接面板，便于验证网页侧调 bridge 的效果 */
const debugMode = computed(() => route.query?.debug === '1' || route.query?.debug === 1)

const bridgeEnvItems = computed(() => {
  const env = bridgeEnv.value

  return [
    { label: '平台', value: env.platform },
    { label: '桥接版本', value: `v${env.bridgeVersion}` },
    { label: '响应模式', value: env.responseMode },
    { label: '登录态', value: env.isLogin ? '已登录' : '未登录' },
    { label: '开放方法', value: env.supportedMethods.join('、') || '未开放任何方法' },
  ]
})

const formatLogTime = (time: number) => {
  const date = new Date(time)

  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`
}

const summarizeParams = (params?: Record<string, unknown>) => {
  if (!params || !Object.keys(params).length) return '-'
  return Object.entries(params)
    .map(([key, value]) => `${key}=${typeof value === 'object' ? JSON.stringify(value) : String(value)}`)
    .join(', ')
}
</script>

<template>
  <view class="webview-page">
    <!-- #ifdef H5 -->
    <Navbar :title="pageTitle" />
    <!-- #endif -->

    <view v-if="hasError" class="webview-page__error">
      <view class="webview-page__error-card">
        <view class="webview-page__error-title">
          {{ errorTitle }}
        </view>
        <view class="webview-page__error-message">
          {{ errorMessage }}
        </view>
        <wd-button type="primary" block @click="retry">
          重试
        </wd-button>
      </view>
    </view>

    <template v-else-if="pageReady">
      <!-- #ifdef H5 -->
      <view class="webview-page__frame-shell" :class="{ 'webview-page__frame-shell--debug': debugMode }">
        <view v-if="!pageLoaded" class="webview-page__loading">
          正在加载网页...
        </view>
        <iframe
          class="webview-page__iframe"
          :allow="iframeAllow"
          :sandbox="iframeSandbox"
          :src="pageUrl"
          @error="handleFrameError"
          @load="handleFrameLoad"
        />
      </view>
      <!-- #endif -->

      <!-- #ifndef H5 -->
      <web-view :src="pageUrl" @error="handleFrameError" @load="handleFrameLoad" @message="handleWebViewMessage" />
      <!-- #endif -->

      <!-- 调试面板：仅 debug=1 时出现，小程序端浮在 web-view 之上，H5 端为右侧抽屉 -->
      <view v-if="debugMode" class="bridge-panel">
        <view class="bridge-panel__head">
          <text class="bridge-panel__title">
            桥接调试
          </text>
          <text class="bridge-panel__clear" @click="clearBridgeLogs">
            清空
          </text>
        </view>

        <view class="bridge-panel__env">
          <view v-for="item in bridgeEnvItems" :key="item.label" class="bridge-panel__env-item">
            <text class="bridge-panel__env-label">
              {{ item.label }}
            </text>
            <text class="bridge-panel__env-value">
              {{ item.value }}
            </text>
          </view>
        </view>

        <view class="bridge-panel__logs">
          <view v-if="!bridgeLogs.length" class="bridge-panel__empty">
            暂无桥接调用，网页侧调用 bridge 方法后会实时显示在这里
          </view>
          <view
            v-for="log in bridgeLogs"
            :key="log.id"
            class="bridge-panel__log"
            :class="`bridge-panel__log--${log.status}`"
          >
            <view class="bridge-panel__log-head">
              <text class="bridge-panel__log-method">
                {{ log.method }}
              </text>
              <text class="bridge-panel__log-time">
                {{ formatLogTime(log.time) }}
              </text>
            </view>
            <text class="bridge-panel__log-params">
              {{ summarizeParams(log.params) }}
            </text>
            <text v-if="log.errorMessage" class="bridge-panel__log-error">
              {{ log.errorCode }}: {{ log.errorMessage }}
            </text>
          </view>
        </view>
      </view>
    </template>

    <view v-else class="webview-page__loading webview-page__loading--page">
      正在准备容器...
    </view>
  </view>
</template>

<style lang="scss" scoped>
.webview-page {
  min-height: 100vh;
  background: #f6f8f7;

  &__frame-shell {
    position: relative;
    height: calc(100vh - 88rpx);
    background: #fff;

    &--debug {
      // 调试面板占位：H5 端为右侧抽屉留出空间
      height: calc(100vh - 88rpx - 560rpx);
    }
  }

  &__iframe {
    width: 100%;
    height: 100%;
    background: #fff;
    border: 0;
  }

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26rpx;
    line-height: 1.5;
    color: #66736e;

    &--page {
      min-height: 60vh;
    }
  }

  &__error {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    padding: 32rpx;

    &-card {
      width: 100%;
      padding: 40rpx 32rpx;
      background: #fff;
      border: 1rpx solid #edf1ef;
      border-radius: 20rpx;
    }

    &-title {
      font-size: 34rpx;
      font-weight: 700;
      line-height: 1.4;
      color: #17211d;
    }

    &-message {
      margin-top: 16rpx;
      margin-bottom: 32rpx;
      font-size: 26rpx;
      line-height: 1.6;
      color: #66736e;
    }
  }
}

.bridge-panel {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  max-height: 60vh;
  padding: 24rpx 24rpx calc(24rpx + env(safe-area-inset-bottom));
  overflow-y: auto;
  background: #fff;
  border-top: 1rpx solid #edf1ef;
  box-shadow: 0 -8rpx 24rpx rgb(23 33 29 / 8%);

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    font-size: 28rpx;
    font-weight: 700;
    line-height: 1.4;
    color: #17211d;
  }

  &__clear {
    padding: 8rpx 16rpx;
    font-size: 24rpx;
    line-height: 1.4;
    color: #0055fe;
  }

  &__env {
    padding: 20rpx;
    margin-top: 20rpx;
    background: #f6f8f7;
    border-radius: 12rpx;
  }

  &__env-item {
    display: flex;
    align-items: flex-start;

    & + & {
      margin-top: 10rpx;
    }
  }

  &__env-label {
    flex-shrink: 0;
    width: 140rpx;
    font-size: 24rpx;
    line-height: 1.5;
    color: #77827e;
  }

  &__env-value {
    flex: 1;
    min-width: 0;
    font-size: 24rpx;
    line-height: 1.5;
    color: #17211d;
    word-break: break-all;
  }

  &__logs {
    margin-top: 20rpx;
  }

  &__empty {
    padding: 32rpx 20rpx;
    font-size: 24rpx;
    line-height: 1.6;
    color: #8a9691;
    text-align: center;
    background: #f6f8f7;
    border-radius: 12rpx;
  }

  &__log {
    padding: 20rpx;
    margin-bottom: 16rpx;
    background: #f6f8f7;
    border-left: 6rpx solid #07c160;
    border-radius: 12rpx;

    &--error {
      border-left-color: #cf3d32;
    }

    &-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &-method {
      font-size: 26rpx;
      font-weight: 600;
      line-height: 1.4;
      color: #17211d;
    }

    &-time {
      font-size: 22rpx;
      line-height: 1.4;
      color: #8a9691;
    }

    &-params {
      display: block;
      margin-top: 8rpx;
      font-size: 22rpx;
      line-height: 1.5;
      color: #66736e;
      word-break: break-all;
    }

    &-error {
      display: block;
      margin-top: 8rpx;
      font-size: 22rpx;
      line-height: 1.5;
      color: #cf3d32;
      word-break: break-all;
    }
  }
}
</style>
