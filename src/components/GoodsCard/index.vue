<script setup lang="ts">
export interface GoodsCardItem {
  desc?: string
  id?: string | number
  image?: string
  originPrice?: string | number
  price?: string | number
  title: string
}

interface Props {
  item: GoodsCardItem
}

defineProps<Props>()

const emit = defineEmits<{
  click: [item: GoodsCardItem]
}>()

const handleClick = (item: GoodsCardItem) => {
  emit('click', item)
}
</script>

<template>
  <view class="e-goods-card" @click="handleClick(item)">
    <image class="e-goods-card__image" :src="item.image" mode="aspectFill" />
    <view class="e-goods-card__content">
      <view class="e-goods-card__title">
        {{ item.title }}
      </view>
      <view v-if="item.desc" class="e-goods-card__desc">
        {{ item.desc }}
      </view>
      <view class="e-goods-card__price">
        <text class="e-goods-card__price-symbol">
          ￥
        </text>
        <text class="e-goods-card__price-current">
          {{ item.price }}
        </text>
        <text v-if="item.originPrice" class="e-goods-card__price-origin">
          ￥{{ item.originPrice }}
        </text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.e-goods-card {
  display: flex;
  overflow: hidden;
  background: var(--app-color-surface);
  border: 1rpx solid var(--app-color-border);
  border-radius: 16rpx;

  &__image {
    flex: 0 0 220rpx;
    width: 220rpx;
    height: 220rpx;
    background: var(--app-primary-soft);
  }

  &__content {
    flex: 1;
    min-width: 0;
    padding: 24rpx;
  }

  &__title {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 30rpx;
    font-weight: 700;
    line-height: 1.35;
    color: var(--app-color-text);
    white-space: nowrap;
  }

  &__desc {
    display: -webkit-box;
    margin-top: 12rpx;
    overflow: hidden;
    -webkit-line-clamp: 2;
    font-size: 24rpx;
    line-height: 1.5;
    color: var(--app-color-text-secondary);
    -webkit-box-orient: vertical;
  }

  &__price {
    display: flex;
    align-items: baseline;
    margin-top: 24rpx;
    color: var(--wot-primary-6);

    &-symbol {
      font-size: 22rpx;
      line-height: 1;
    }

    &-current {
      font-size: 36rpx;
      font-weight: 800;
      line-height: 1;
    }

    &-origin {
      margin-left: 12rpx;
      font-size: 22rpx;
      line-height: 1;
      color: var(--app-color-text-placeholder);
      text-decoration: line-through;
    }
  }
}
</style>
