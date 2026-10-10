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
import type { InformationCardItem } from '@/components/InformationCard/index.vue'
import type { ArticleItem, PageResult } from '@/mocks/content'
import { usePagination } from 'alova/client'
import { useTrackPageView } from '@/composables/useTracker'
import { http } from '@/utils/http'

useShare({ title: '我的收藏' })
useTrackPageView()

/**
 * 列表分页走 alova 的 usePagination：
 * 请求经 `@/utils/http` 发出，未配置后端时由 `@/mocks/adapter` 返回 mock 数据，
 * 接后端后只需去掉 mock，页面代码不用改。
 */
const { data, loading, page, pageCount, isLastPage, send, reload } = usePagination(
  (currentPage, currentPageSize) =>
    http.Get<PageResult<ArticleItem>>('/article/page', {
      params: { page: currentPage, pageSize: currentPageSize },
    }),
  {
    initialPage: 1,
    initialPageSize: 5,
    data: response => response.list,
    total: response => response.total,
  },
)

// InformationCard 只要求部分字段，ArticleItem 是它的超集，直接传入即可
const list = computed(() => data.value as ArticleItem[])

/** z-paging 触底时加载下一页 */
const handleLoadMore = () => {
  if (loading.value || isLastPage.value) return
  void send(page.value + 1)
}

/** 下拉刷新重置到第一页 */
const handleRefresh = () => {
  void reload()
}

const handleClick = (item: InformationCardItem) => {
  uni.showToast({ title: `打开：${item.title}`, icon: 'none' })
}
</script>

<template>
  <z-paging
    :show-scrollbar="false"
    :auto-clean-list-when-reload="false"
    @complete="handleLoadMore"
    @query="handleRefresh"
  >
    <template #top>
      <Navbar title="我的收藏" />
    </template>

    <view class="favorites-page">
      <view v-if="loading && !list.length" class="favorites-page__loading">
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

        <view class="favorites-page__footer">
          <text v-if="loading" class="favorites-page__tip">
            加载中...
          </text>
          <text v-else-if="isLastPage" class="favorites-page__tip">
            没有更多了（第 {{ page }} / {{ pageCount ?? 1 }} 页）
          </text>
        </view>
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

  &__footer {
    padding: 16rpx 0 8rpx;
    text-align: center;
  }

  &__tip {
    font-size: 24rpx;
    line-height: 1.5;
    color: var(--app-color-text-tertiary);
  }
}
</style>
