<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page -->
<route lang="json5" type="home">
{
  layout: 'default',
  name: 'home',
  style: {
    navigationBarTitleText: 'home',
  },
}
</route>

<script setup lang="ts">
import { getHomeHotAPI } from '@/apis/home'

// 自动请求
const { loading, data: hotList } = useRequest(getHomeHotAPI) //  { immediate: false }

const router = useRouter()
const goDemoPage = () => {
  router.push({ name: 'demo' })
}
</script>

<template>
  <view>
    <view v-if="loading">
      加载中...
    </view>
    <view>请求数据为：{{ hotList }}</view>

    <view class="iconfont icon-peisongjindu text-50rpx" />

    <wd-button @click="goDemoPage">
      进入demo页
    </wd-button>
    <wd-button type="success">
      成功按钮
    </wd-button>
    <wd-button type="info">
      信息按钮
    </wd-button>
  </view>
</template>

<style lang="scss">
//
</style>
