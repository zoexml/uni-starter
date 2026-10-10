<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { useGlobalErrorHandling } from '@/composables/useGlobalErrorHandling'
import { usePrivacy } from '@/composables/usePrivacy'
import { useTheme } from '@/composables/useTheme'
import { useTracker } from '@/composables/useTracker'
import { forceCloseLoading } from '@/utils/loading'

// #ifdef MP-WEIXIN
import { checkMiniProgramUpdate } from './utils/checkUpdate'
// #endif

useGlobalErrorHandling()

const { initializeTheme } = useTheme()
const { initialize: initializeTracker, flush } = useTracker()
const { initialize: initializePrivacy } = usePrivacy()

onLaunch(() => {
  console.log('App Launch')
  initializeTheme()
  initializeTracker()
  // 注册隐私授权监听并同步一次授权状态（仅微信小程序生效，其他平台为 no-op）
  initializePrivacy()

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
  // 应用退到后台时请求可能不会再回调，兜底关闭 loading 遮罩
  forceCloseLoading()
})
</script>

<style></style>
