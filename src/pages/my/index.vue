<route lang="json5" type="page">
{
  name: 'my',
  style: {
    navigationBarTitleText: '我的',
  },
}
</route>

<script lang="ts" setup>
//
</script>

<template>
  <z-paging>
    <template #top>
      <ENavbar title="我的" :leftArrow="false" />
    </template>
    <!-- 页面内容 -->
    <ELoading />
  </z-paging>
</template>

<style lang="scss" scoped>
//
</style>
