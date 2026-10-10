<route lang="json5" type="page">
{
  layout: 'default',
  name: 'favorites',
  meta: {
    requiresAuth: true,
    permissions: ['profile:view'],
  },
  style: {
    navigationBarTitleText: '我的收藏',
  },
}
</route>

<script lang="ts" setup>
import { fetchFavoriteList } from '@/mocks/content'
import { useTrackPageView } from '@/composables/useTracker'

useShare({ title: '我的收藏' })
useTrackPageView()

const loading = shallowRef(true)
const list = shallowRef<Awaited<ReturnType<typeof fetchFavoriteList>>>([])

onLoad(async () => {
  try {
    list.value = await fetchFavoriteList()
  } finally {
    loading.value = false
  }
})

const handleClick = (item: { title: string }) => {
  uni.showToast({ title: `打开：${item.title}`, icon: 'none' })
}
</script>

<template>
  <z-paging :show-scrollbar="false">
    <template #top>
      <Navbar title="我的收藏" />
    </template>

    <view class="favorites-page">
      <view v-if="loading" class="favorites-page__loading">
        <Loading />
      </view>

      <wd-empty v-else-if="!list.length" tip="暂无收藏内容" />

      <view v-else class="favorites-page__list">
        <InformationCard
          v-for="item in list"
          :key="item.id"
          :item="item"
          @click="handleClick"
        />
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.favorites-page {
  min-height: 100%;
  padding: 32rpx;
  background: var(--app-color-surface-muted);

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 120rpx 0;
  }

  &__list {
    :deep(.e-information-card) {
      padding: 24rpx;
      margin-bottom: 20rpx;
      background: var(--app-color-surface);
      border: 1rpx solid var(--app-color-border);
      border-radius: 16rpx;
    }
  }
}
</style>
