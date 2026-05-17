<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import Tabbar from '@/tabbar/index.vue'

const { appThemeStyle, wotThemeVars } = useTheme()
</script>

<script lang="ts">
export default {
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
}
</script>

<template>
  <wd-config-provider :theme-vars="wotThemeVars" :custom-style="appThemeStyle">
    <KuRootView />
    <Tabbar />
    <wd-notify />
    <wd-toast />
    <wd-dialog />
  </wd-config-provider>
</template>
