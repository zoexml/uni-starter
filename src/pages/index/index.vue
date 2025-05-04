<route lang="json5" type="page">
  {
    "name": "home",
    "style": {
      "navigationBarTitleText": "home"
    }
  }
</route>

<script setup lang="ts">
import { getHomeHotAPI } from '@/apis/home'

// 自动请求
const { loading, data: hotList } = useRequest(getHomeHotAPI) //  { immediate: false }
</script>

<template>
  <view>
    <wd-button>主要按钮</wd-button>
    <wd-button type="success">
      成功按钮
    </wd-button>
    <wd-button type="info">
      信息按钮
    </wd-button>

    <view v-if="loading">
      加载中...
    </view>
    <view>请求数据为：{{ hotList }}</view>

    <view class="iconfont icon-peisongjindu text-50rpx" />
  </view>
</template>

<style lang="scss"></style>
