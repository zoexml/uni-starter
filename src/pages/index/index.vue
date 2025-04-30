<route lang="json5" type="page">
  {
    name: 'home',
  }
  </route>

<script setup lang="ts">
import AppLogos from '@/components/AppLogos.vue'
import InputEntry from '@/components/InputEntry.vue'
</script>

<template>
  <view px-10 py-20 text-center>
    <AppLogos />
    <InputEntry />
  </view>
</template>

<style lang="scss" scoped></style>
