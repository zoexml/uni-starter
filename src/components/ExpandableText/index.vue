<script setup lang="ts">
interface Props {
  collapseText?: string
  content: string
  expandText?: string
  lines?: number
  threshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  collapseText: '收起',
  expandText: '展开',
  lines: 3,
  threshold: 80,
})

const expanded = shallowRef(false)
const showToggle = computed(() => props.content.length > props.threshold)
const contentStyle = computed(() => expanded.value
  ? {}
  : {
      '-webkit-line-clamp': String(props.lines),
    })

const toggle = () => {
  expanded.value = !expanded.value
}
</script>

<template>
  <view class="e-expandable-text">
    <text class="e-expandable-text__content" :class="{ 'e-expandable-text__content--folded': !expanded }" :style="contentStyle">
      {{ content }}
    </text>
    <button v-if="showToggle" class="e-expandable-text__toggle" @click="toggle">
      {{ expanded ? collapseText : expandText }}
    </button>
  </view>
</template>

<style lang="scss" scoped>
.e-expandable-text {
  &__content {
    display: block;
    font-size: 28rpx;
    line-height: 1.65;
    color: var(--app-color-text-regular);
    white-space: pre-wrap;

    &--folded {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
    }
  }

  &__toggle {
    height: 48rpx;
    padding: 0;
    margin: 12rpx 0 0;
    font-size: 26rpx;
    line-height: 48rpx;
    color: var(--wot-primary-6);
    text-align: left;
    background: transparent;
    border: 0;
    border-radius: 8rpx;

    &::after {
      border: 0;
    }

    &:active {
      color: var(--wot-primary-7);
      background: var(--app-primary-soft);
    }
  }
}
</style>
