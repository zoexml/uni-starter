<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { onHide } from '@dcloudio/uni-app'

interface Props {
  visible?: boolean
  title?: string
  expandThreshold?: number
  initialRatio?: number
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '',
  expandThreshold: 0.35,
  initialRatio: 0.68,
})

const emit = defineEmits<{
  close: []
}>()

const viewShow = ref(false)
const scrollYable = ref(false)
const disabled = ref(false)
const y = ref(800)
let closeTimer: ReturnType<typeof setTimeout> | null = null

function showSheet() {
  viewShow.value = true
  scrollYable.value = false
  nextTick(() => {
    y.value = 200
  })
}

function hideSheet() {
  y.value = 800
  if (closeTimer) clearTimeout(closeTimer)
  closeTimer = setTimeout(() => {
    viewShow.value = false
    scrollYable.value = false
    emit('close')
  }, 400)
}

watch(() => props.visible, (val) => {
  if (val) showSheet()
  else hideSheet()
}, { immediate: true })

onHide(() => {
  if (props.visible) hideSheet()
})

onBeforeUnmount(() => {
  if (closeTimer) clearTimeout(closeTimer)
})

function onTouchEnd() {
  const query = uni.createSelectorQuery()
  query.select('#touch-dialog-box').boundingClientRect()
  query.exec((res: any) => {
    const rect = res?.[0]
    if (!rect) return
    const windowHeight = uni.getSystemInfoSync().windowHeight
    const topRatio = rect.top / windowHeight
    if (topRatio < props.expandThreshold) {
      y.value = 16
      scrollYable.value = true
    } else if (topRatio > 0.6) {
      hideSheet()
    } else {
      scrollYable.value = false
      y.value = windowHeight * props.initialRatio
    }
  })
}

function onScrollToUpper() {
  disabled.value = false
}

function preventTouchMove() {}

function onClose() {
  hideSheet()
}
</script>

<template>
  <movable-area v-if="viewShow" class="touch-dialog-area">
    <view class="touch-dialog-fixed" @touchmove.stop="preventTouchMove">
      <movable-view
        id="touch-dialog-box"
        class="touch-dialog-move"
        :y="y"
        direction="vertical"
        :disabled="disabled"
        :damping="40"
        @touchend="onTouchEnd"
      >
        <view class="touch-dialog-header">
          <view class="touch-dialog-title">
            {{ title }}
          </view>
          <view class="touch-dialog-close" @tap="onClose">
            ✕
          </view>
        </view>
        <view class="touch-dialog-subtitle">
          <slot name="subtitle" />
        </view>
        <scroll-view
          class="touch-dialog-scroll"
          :scroll-y="scrollYable"
          @scrolltoupper="onScrollToUpper"
        >
          <slot name="content" />
        </scroll-view>
      </movable-view>
    </view>
  </movable-area>
</template>

<style lang="scss" scoped>
.touch-dialog-area {
  position: absolute;
  top: 0;
  z-index: 99;
  width: 100%;
  height: 200vh;
  overflow: hidden;
}

.touch-dialog-fixed {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  width: 100%;
  height: 100%;
}

.touch-dialog-move {
  z-index: 999;
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  padding: 0 42rpx;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  box-shadow: 0 -12rpx 48rpx 0 rgb(20 20 20 / 16%);
}

.touch-dialog-header {
  position: absolute;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: calc(100vw - 84rpx);
  height: 104rpx;
  font-size: 34rpx;
  font-weight: 500;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.touch-dialog-title {
  font-size: 34rpx;
  font-weight: 500;
}

.touch-dialog-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;
  font-size: 36rpx;
  color: #999;
}

.touch-dialog-subtitle {
  padding-bottom: 22rpx;
  margin-top: 130rpx;
}

.touch-dialog-scroll {
  height: 84vh;
}
</style>
