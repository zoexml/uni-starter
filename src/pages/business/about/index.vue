<route lang="json5" type="page">
{
  layout: 'default',
  name: 'about',
  meta: {
    public: true,
  },
  style: {
    navigationBarTitleText: '关于我们',
  },
}
</route>

<script lang="ts" setup>
import pkg from '../../../../package.json'
import { useTrackPageView } from '@/composables/useTracker'

useShare({ title: '关于我们' })
useTrackPageView()

// 版本号直接读 package.json，与 manifest 的 versionName / versionCode 保持同源
const APP_VERSION = pkg.version

const APP_NAME = 'uni-starter'

const APP_INTRO = [
  'uni-app 通用启动模板，内置请求层、状态管理、主题系统、埋点上报与 WebView 容器，帮助新项目跳过重复的基建搭建。',
  '组件、组合式逻辑与业务分包按职责分层，页面只负责编排，便于长期维护与多端一致性。',
]
</script>

<template>
  <z-paging :show-scrollbar="false">
    <template #top>
      <Navbar title="关于我们" />
    </template>

    <view class="about-page">
      <view class="about-page__brand">
        <image class="about-page__logo" src="/static/images/logo.svg" mode="aspectFit" />
        <text class="about-page__name">
          {{ APP_NAME }}
        </text>
        <text class="about-page__version">
          v{{ APP_VERSION }}
        </text>
      </view>

      <view class="about-page__intro">
        <text v-for="(paragraph, index) in APP_INTRO" :key="index" class="about-page__paragraph">
          {{ paragraph }}
        </text>
      </view>

      <view class="about-page__footer">
        <text class="about-page__copyright">
          © 2026 uni-starter
        </text>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.about-page {
  min-height: 100%;
  padding: 48rpx 32rpx calc(48rpx + env(safe-area-inset-bottom));
  background: var(--app-color-surface-muted);

  &__brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32rpx 0 40rpx;
  }

  &__logo {
    width: 128rpx;
    height: 128rpx;
  }

  &__name {
    margin-top: 24rpx;
    font-size: 36rpx;
    font-weight: 700;
    line-height: 1.3;
    color: var(--app-color-text);
  }

  &__version {
    margin-top: 8rpx;
    font-size: 24rpx;
    line-height: 1.4;
    color: var(--app-color-text-tertiary);
  }

  &__intro {
    padding: 32rpx;
    background: var(--app-color-surface);
    border: 1rpx solid var(--app-color-border);
    border-radius: 16rpx;
  }

  &__paragraph {
    display: block;
    font-size: 28rpx;
    line-height: 1.8;
    color: var(--app-color-text-secondary);

    & + & {
      margin-top: 20rpx;
    }
  }

  &__footer {
    padding-top: 48rpx;
    text-align: center;
  }

  &__copyright {
    font-size: 24rpx;
    line-height: 1.4;
    color: var(--app-color-text-tertiary);
  }
}
</style>
