<script lang="ts" setup>
defineProps<{
  data: { label: string }[]
}>()

const emit = defineEmits<{
  // (e: 'change', active: number): void
  change: [active: number]
}>()

const active = ref(0)
const changeTab = (index: number) => {
  active.value = index
  emit('change', index)
}
</script>

<template>
  <view class="custom-tabs">
    <view
      v-for="(item, index) in data"
      :key="index"
      class="custom-tabs-bar"
      :class="{ active: index === active }"
      @click="changeTab(index)"
    >
      <text class="tabbar-text">
        {{ item.label }}
      </text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
  // 自定义tabbar
  .custom-tabs {
    position: relative;
    display: flex;
    padding: 0 30rpx;
  }

  .custom-tabs-bar {
    position: relative;
    height: 80rpx;
    margin-right: 30rpx;
    line-height: 80rpx;
    color: #979797;

    &.active {
      font-weight: 500;
      color: #121826;
      border-bottom: 2px solid #2cb5a5;
    }
  }

  .tabbar-text {
    font-size: 30rpx;
  }

  .custom-tabs-cursor {
    position: absolute;
    bottom: 3px;
    left: 20px;
    width: 20px;
    height: 2px;
    background-color: #2cb5a5;
    border-radius: 2px;
    transition: all 0.3s ease-out;
  }
</style>
