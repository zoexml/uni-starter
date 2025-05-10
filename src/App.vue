<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'

// #ifdef MP-WEIXIN
import { checkMiniProgramUpdate } from './utils/checkUpdate'
// #endif

onLaunch(() => {
  console.log('App Launch')

  // #ifdef MP-WEIXIN
  checkMiniProgramUpdate()
  // #endif
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style></style>
