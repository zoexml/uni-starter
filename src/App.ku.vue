<script setup lang="ts">
import type { ConfigProviderThemeVars } from '@wot-ui/ui'
// import { useNetworkStatus } from '@/composables/useNetworkStatus'

const themeVars = reactive<ConfigProviderThemeVars>({
  // primary6: '#FF5454',
  // tabsNavLineBgColor: 'red',
  // navbarColor: '#ffffff',
})

// const { isOffline, isOnline, networkType } = useNetworkStatus()

// watch(isOnline, (online, previousOnline) => {
//   if (online && previousOnline === false) {
//     uni.showToast({
//       title: '网络已恢复',
//       icon: 'none',
//     })
//   }
// })
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
  <wd-config-provider :theme-vars="themeVars" custom-style="background-color: #F9F9F8;min-height: 100vh">
    <!-- <OfflineBanner :visible="isOffline" :network-type="networkType" /> -->
    <KuRootView />
    <wd-notify />
    <wd-toast />
    <wd-dialog />
  </wd-config-provider>
</template>
