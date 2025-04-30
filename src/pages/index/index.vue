<route lang="json5" type="page">
  {
    name: 'home',
  }
  </route>

<script setup lang="ts">
import { getHomeHotAPI } from '@/apis/home'
import AppLogos from '@/components/AppLogos.vue'
import InputEntry from '@/components/InputEntry.vue'
import { useRequest } from 'alova/client'

const { loading, data: hotList } = useRequest(getHomeHotAPI) //  { immediate: false }
</script>

<template>
  <view px-10 py-20 text-center>
    <AppLogos />
    <InputEntry />

    <view v-if="loading">
      加载中...
    </view>
    <view>请求数据为：{{ hotList }}</view>
  </view>
</template>

<style lang="scss" scoped></style>
