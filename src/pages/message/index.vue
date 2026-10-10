<route lang="json5" type="page">
{
  name: 'message',
  meta: {
    public: true,
  },
  style: {
    navigationBarTitleText: '消息',
  },
}
</route>

<script setup lang="ts">
import { useTrackPageView } from '@/composables/useTracker'

useShare({ title: '消息' })
useTrackPageView()
</script>

<template>
  <z-paging>
    <template #top>
      <Navbar title="消息" :left-arrow="false" />
    </template>

    <view class="placeholder-page">
      <view class="placeholder-card">
        <view class="placeholder-title">
          消息
        </view>
        <view class="placeholder-desc">
          这里是消息中心模板入口，可接入系统通知、互动消息和客服消息。
        </view>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.placeholder-page {
  min-height: 100%;
  padding: 32rpx;

  // 底部固定着自定义 tabbar，需要留出等高空间，否则最后一段内容会被遮挡
  padding-bottom: calc(32rpx + var(--app-tabbar-height) + env(safe-area-inset-bottom));
  background: #f6f8f7;

  .placeholder-card {
    padding: 36rpx 32rpx;
    background: #fff;
    border: 1rpx solid #edf1ef;
    border-radius: 16rpx;

    .placeholder-title {
      font-size: 40rpx;
      font-weight: 700;
      line-height: 1.35;
      color: #17211d;
    }

    .placeholder-desc {
      margin-top: 16rpx;
      font-size: 26rpx;
      line-height: 1.6;
      color: #66736e;
    }
  }
}
</style>
