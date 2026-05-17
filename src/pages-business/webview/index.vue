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
import { useWebView } from '@/composables/useWebView'

const {
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
      <view class="webview-page__frame-shell">
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
</style>
