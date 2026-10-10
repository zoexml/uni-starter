<route lang="json5" type="page">
{
  layout: 'default',
  name: 'search',
  meta: {
    public: true,
  },
  style: {
    navigationBarTitleText: '搜索',
  },
}
</route>

<script lang="ts" setup>
import type { ArticleItem, PageResult } from '@/mocks/content'
import { usePagination } from 'alova/client'
import { HOT_KEYWORDS } from '@/mocks/content'
import { useTrackPageView } from '@/composables/useTracker'
import { http } from '@/utils/http'

useShare({ title: '搜索' })
useTrackPageView()

const HISTORY_KEY = 'search-history'
const HISTORY_MAX = 10

const keyword = shallowRef('')
const searched = shallowRef(false)
const history = shallowRef<string[]>([])

/**
 * 搜索结果同样走 usePagination：keyword 变化后 reload() 重新从第一页拉取，
 * 触底用 send(page + 1) 追加下一页。
 */
const { data, loading, page, isLastPage, send, reload } = usePagination(
  (currentPage, currentPageSize) =>
    http.Get<PageResult<ArticleItem>>('/article/page', {
      params: { page: currentPage, pageSize: currentPageSize, keyword: keyword.value },
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

const readHistory = () => {
  try {
    const stored = uni.getStorageSync(HISTORY_KEY)
    history.value = Array.isArray(stored) ? stored : []
  } catch {
    history.value = []
  }
}

const writeHistory = (next: string[]) => {
  history.value = next
  try {
    uni.setStorageSync(HISTORY_KEY, next)
  } catch {
    // 存储失败不影响搜索本身
  }
}

const pushHistory = (value: string) => {
  const next = [value, ...history.value.filter(item => item !== value)].slice(0, HISTORY_MAX)
  writeHistory(next)
}

/** 执行搜索：先更新 keyword，再 reload 让分页回到第一页 */
const runSearch = async (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) {
    uni.showToast({ title: '请输入搜索关键词', icon: 'none' })
    return
  }

  keyword.value = trimmed
  pushHistory(trimmed)
  searched.value = true
  await reload()
}

/** z-paging 触底加载下一页 */
const handleLoadMore = () => {
  if (loading.value || isLastPage.value) return
  void send(page.value + 1)
}

const handleSearch = () => {
  runSearch(keyword.value)
}

const handleTapKeyword = (value: string) => {
  runSearch(value)
}

const handleClearHistory = () => {
  uni.showModal({
    title: '清空搜索历史',
    content: '确认清空全部搜索历史？',
    success: ({ confirm }) => {
      if (confirm) writeHistory([])
    },
  })
}

const handleArticleClick = (item: { title: string }) => {
  uni.showToast({ title: `打开：${item.title}`, icon: 'none' })
}

onLoad(readHistory)
</script>

<template>
  <z-paging
    :show-scrollbar="false"
    :auto-clean-list-when-reload="false"
    @complete="handleLoadMore"
  >
    <template #top>
      <Navbar title="搜索" />
      <view class="search-page__bar">
        <wd-search v-model="keyword" placeholder="搜索资讯或关键词" hide-cancel @search="handleSearch" @clear="searched = false" />
      </view>
    </template>

    <view class="search-page">
      <view v-if="loading && !list.length" class="search-page__loading">
        <Loading />
      </view>

      <template v-else-if="searched">
        <wd-empty v-if="!list.length" tip="没有找到相关内容" />

        <view v-else class="search-page__list">
          <InformationCard
            v-for="item in list"
            :key="item.id"
            :item="item"
            @click="handleArticleClick"
          />

          <view class="search-page__footer">
            <text v-if="loading" class="search-page__tip">
              加载中...
            </text>
            <text v-else-if="isLastPage" class="search-page__tip">
              没有更多了
            </text>
          </view>
        </view>
      </template>

      <template v-else>
        <view v-if="history.length" class="search-page__section">
          <view class="search-page__section-head">
            <text class="search-page__section-title">
              搜索历史
            </text>
            <text class="search-page__section-action" @click="handleClearHistory">
              清空
            </text>
          </view>
          <view class="search-page__tags">
            <view
              v-for="item in history"
              :key="item"
              class="search-page__tag"
              @click="handleTapKeyword(item)"
            >
              {{ item }}
            </view>
          </view>
        </view>

        <view class="search-page__section">
          <view class="search-page__section-head">
            <text class="search-page__section-title">
              热门搜索
            </text>
          </view>
          <view class="search-page__tags">
            <view
              v-for="item in HOT_KEYWORDS"
              :key="item"
              class="search-page__tag"
              @click="handleTapKeyword(item)"
            >
              {{ item }}
            </view>
          </view>
        </view>
      </template>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.search-page {
  min-height: 100%;
  padding: 32rpx;
  background: var(--app-color-surface-muted);

  &__bar {
    padding: 0 32rpx 20rpx;
    background: var(--app-color-surface-muted);
  }

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 120rpx 0;
  }

  &__section {
    & + & {
      margin-top: 40rpx;
    }
  }

  &__section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;
  }

  &__section-title {
    font-size: 28rpx;
    font-weight: 600;
    line-height: 1.4;
    color: var(--app-color-text);
  }

  &__section-action {
    padding: 8rpx 0 8rpx 24rpx;
    font-size: 26rpx;
    line-height: 1.4;
    color: var(--app-color-text-tertiary);

    &:active {
      opacity: 0.6;
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
  }

  &__tag {
    padding: 16rpx 28rpx;
    font-size: 26rpx;
    line-height: 1.4;
    color: var(--app-color-text-regular);
    background: var(--app-color-surface);
    border: 1rpx solid var(--app-color-border);
    border-radius: 999rpx;

    &:active {
      background: var(--app-color-surface-muted);
    }
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
    padding: 8rpx 0 16rpx;
    text-align: center;
  }

  &__tip {
    font-size: 24rpx;
    line-height: 1.5;
    color: var(--app-color-text-tertiary);
  }
}
</style>
