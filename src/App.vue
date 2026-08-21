<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { useGlobalErrorHandling } from '@/composables/useGlobalErrorHandling'
import { useTheme } from '@/composables/useTheme'
import { useTracker } from '@/composables/useTracker'

// #ifdef MP-WEIXIN
import { checkMiniProgramUpdate } from './utils/checkUpdate'
// #endif

useGlobalErrorHandling()

const { initializeTheme } = useTheme()
const { initialize, flush } = useTracker()

onLaunch(() => {
  console.log('App Launch')
  initializeTheme()
  initialize()

  // #ifdef MP-WEIXIN
  checkMiniProgramUpdate()
  // #endif
})
onShow(() => {
  console.log('App Show')
  initializeTheme()
})
onHide(() => {
  console.log('App Hide')
  flush()
})
</script>

<style></style>
