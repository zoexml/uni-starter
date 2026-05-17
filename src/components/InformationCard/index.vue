<script setup lang="ts">
export interface InformationCardItem {
  id?: string | number
  image?: string
  time?: string
  title: string
}

interface Props {
  item: InformationCardItem
}

defineProps<Props>()

const emit = defineEmits<{
  click: [item: InformationCardItem]
}>()

const handleClick = (item: InformationCardItem) => {
  emit('click', item)
}
</script>

<template>
  <view class="e-information-card" @click="handleClick(item)">
    <view class="e-information-card__main">
      <view class="e-information-card__title">
        {{ item.title }}
      </view>
      <view v-if="item.time" class="e-information-card__time">
        {{ item.time }}
      </view>
    </view>
    <image v-if="item.image" class="e-information-card__image" :src="item.image" mode="aspectFill" />
    <view v-else class="e-information-card__empty">
      资讯
    </view>
  </view>
</template>

<style lang="scss" scoped>
.e-information-card {
  display: flex;
  gap: 24rpx;
  align-items: stretch;
  padding: 24rpx;
  background: var(--app-color-surface);
  border: 1rpx solid var(--app-color-border);
  border-radius: 16rpx;

  &__main {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
  }

  &__title {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    font-size: 30rpx;
    font-weight: 700;
    line-height: 1.45;
    color: var(--app-color-text);
    -webkit-box-orient: vertical;
  }

  &__time {
    margin-top: 20rpx;
    font-size: 24rpx;
    line-height: 1.4;
    color: var(--app-color-text-tertiary);
  }

  &__image,
  &__empty {
    flex: 0 0 180rpx;
    width: 180rpx;
    height: 136rpx;
    border-radius: 12rpx;
  }

  &__image {
    background: var(--app-primary-soft);
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26rpx;
    color: var(--app-color-text-tertiary);
    background: var(--app-primary-soft);
  }
}
</style>
