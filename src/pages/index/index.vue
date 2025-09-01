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
// import { getHomeHotAPI } from '@/apis/home'

// 自动请求
// const { loading, data: hotList } = useRequest(getHomeHotAPI)

const router = useRouter()
const goDemoPage = () => {
  router.push({ name: 'demo' })
}
</script>

<template>
  <z-paging>
    <template #top>
      <ENavbar title="home" :leftArrow="false" />
    </template>
    <!-- 页面内容 -->
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
  </z-paging>
</template>

<style lang="scss">
//
</style>
