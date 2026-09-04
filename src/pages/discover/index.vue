<route lang="json5" type="page">
{
  name: 'discover',
  meta: {
    public: true,
  },
  style: {
    navigationBarTitleText: '发现',
  },
}
</route>

<script setup lang="ts">
import { useShare } from '@/composables/useShare'
import { useTrackPageView } from '@/composables/useTracker'

useShare({ title: '发现' })
useTrackPageView()
</script>

<template>
  <z-paging>
    <template #top>
      <Navbar title="发现" :left-arrow="false" />
    </template>

    <view class="placeholder-page">
      <view class="placeholder-card">
        <view class="placeholder-title">
          发现
        </view>
        <view class="placeholder-desc">
          这里是发现页模板入口，可承载活动、推荐内容和运营位。
        </view>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.placeholder-page {
  min-height: 100%;
  padding: 32rpx;
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
