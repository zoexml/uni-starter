<script setup lang="ts">
interface Props {
  direction?: 'all' | 'vertical' | 'horizontal' | 'none'
  edgeGap?: number
  icon?: string
  label?: string
  snapToEdge?: boolean
  visible?: boolean
  x?: number
  y?: number
}

const props = withDefaults(defineProps<Props>(), {
  direction: 'all',
  edgeGap: 12,
  icon: '/static/images/logo.svg',
  label: '客服',
  snapToEdge: true,
  visible: true,
  x: 620,
  y: 760,
})

const emit = defineEmits<{
  change: [event: unknown]
  click: []
}>()

const mounted = shallowRef(false)
const dragging = shallowRef(false)
const moved = shallowRef(false)
const viewport = reactive({
  height: 0,
  width: 0,
})
const position = reactive({
  x: 0,
  y: 0,
})
const touchOffset = reactive({
  x: 0,
  y: 0,
})

const buttonSize = 56

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}

const getBounds = () => {
  return {
    maxX: Math.max(props.edgeGap, viewport.width - buttonSize - props.edgeGap),
    maxY: Math.max(props.edgeGap, viewport.height - buttonSize - 24),
    minX: props.edgeGap,
    minY: props.edgeGap,
  }
}

const syncViewport = () => {
  try {
    const systemInfo = uni.getSystemInfoSync()
    viewport.width = systemInfo.windowWidth
    viewport.height = systemInfo.windowHeight
  } catch {
    viewport.width = 375
    viewport.height = 667
  }

  const bounds = getBounds()
  position.x = clamp(props.x, bounds.minX, bounds.maxX)
  position.y = clamp(props.y, bounds.minY, bounds.maxY)
}

const handleClick = () => {
  if (moved.value) {
    moved.value = false
    return
  }

  emit('click')
}

const handleTouchStart = (event: TouchEvent) => {
  if (props.direction === 'none') return

  const touch = event.touches[0]
  if (!touch) return

  dragging.value = true
  moved.value = false
  touchOffset.x = touch.clientX - position.x
  touchOffset.y = touch.clientY - position.y
}

const handleTouchMove = (event: TouchEvent) => {
  if (!dragging.value) return

  const touch = event.touches[0]
  if (!touch) return

  const bounds = getBounds()
  const nextX = clamp(touch.clientX - touchOffset.x, bounds.minX, bounds.maxX)
  const nextY = clamp(touch.clientY - touchOffset.y, bounds.minY, bounds.maxY)

  if (props.direction === 'all' || props.direction === 'horizontal') {
    position.x = nextX
  }

  if (props.direction === 'all' || props.direction === 'vertical') {
    position.y = nextY
  }

  moved.value = true
}

const handleTouchEnd = () => {
  if (!dragging.value) return

  dragging.value = false

  if (props.snapToEdge && (props.direction === 'all' || props.direction === 'horizontal')) {
    const bounds = getBounds()
    const centerX = position.x + buttonSize / 2

    position.x = centerX > viewport.width / 2 ? bounds.maxX : bounds.minX
  }

  emit('change', {
    x: position.x,
    y: position.y,
  })
}

onMounted(() => {
  syncViewport()
  mounted.value = true
})
</script>

<template>
  <view
    v-if="visible && mounted"
    class="e-floating-service"
    :style="{ left: `${position.x}px`, top: `${position.y}px` }"
    @click="handleClick"
    @touchstart.stop="handleTouchStart"
    @touchmove.stop.prevent="handleTouchMove"
    @touchend.stop="handleTouchEnd"
    @touchcancel.stop="handleTouchEnd"
  >
    <image class="e-floating-service__icon" :src="icon" mode="aspectFill" />
    <text class="e-floating-service__label">
      {{ label }}
    </text>
  </view>
</template>

<style lang="scss" scoped>
.e-floating-service {
  position: fixed;
  z-index: 900;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 112rpx;
  height: 112rpx;
  background: var(--app-color-surface);
  border: 1rpx solid var(--app-color-border);
  border-radius: 999rpx;
  box-shadow: 0 12rpx 36rpx rgb(23 33 29 / 14%);

  &__icon {
    width: 44rpx;
    height: 44rpx;
    border-radius: 999rpx;
  }

  &__label {
    margin-top: 4rpx;
    font-size: 20rpx;
    line-height: 1.2;
    color: var(--wot-primary-6);
  }
}
</style>
