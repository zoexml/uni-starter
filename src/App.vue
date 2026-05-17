<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { useGlobalErrorHandling } from '@/composables/useGlobalErrorHandling'
// import { useNetworkStatus } from '@/composables/useNetworkStatus'
import { useTheme } from '@/composables/useTheme'

// #ifdef MP-WEIXIN
import { checkMiniProgramUpdate } from './utils/checkUpdate'
// #endif

useGlobalErrorHandling()

// const { refresh } = useNetworkStatus()
const { initializeTheme } = useTheme()

onLaunch(() => {
  console.log('App Launch')
  initializeTheme()
  // void refresh()

  // #ifdef MP-WEIXIN
  checkMiniProgramUpdate()
  // #endif
})
onShow(() => {
  console.log('App Show')
  initializeTheme()
  // void refresh()
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style></style>
