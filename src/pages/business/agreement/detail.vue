<route lang="json5" type="page">
{
  layout: 'default',
  name: 'agreement-detail',
  meta: {
    public: true,
  },
  style: {
    navigationBarTitleText: '协议详情',
  },
}
</route>

<script lang="ts" setup>
import type { AgreementType } from '@/mocks/content'
import { fetchAgreementContent } from '@/mocks/content'
import { useTrackPageView } from '@/composables/useTracker'

useTrackPageView()

const route = useRoute()

const title = shallowRef('协议详情')
const content = shallowRef('')
const loading = shallowRef(true)

const type = computed<AgreementType>(() => (route.query?.type === 'privacy' ? 'privacy' : 'user'))

/**
 * mp-html 渲染的是自建节点，父页面的 scoped 样式匹配不进去（同 custom-class 那个坑），
 * 所以段落/标题的排版在这里给，单位用 px —— 内联样式里的 rpx 在 H5 端不会被转换。
 * 正文的字号/行高/颜色由外层容器继承，无需重复声明。
 */
const richTagStyle = {
  h3: 'margin: 32px 0 12px; font-size: 16px; font-weight: 600;',
  p: 'margin: 0 0 12px;',
  img: 'max-width: 100%; height: auto; border-radius: 8px;',
}

useShare({ title: title.value })

onLoad(async (options) => {
  const queryTitle = options?.title
  if (typeof queryTitle === 'string' && queryTitle) {
    title.value = decodeURIComponent(queryTitle)
  }

  try {
    content.value = await fetchAgreementContent(type.value)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <z-paging :show-scrollbar="false">
    <template #top>
      <Navbar :title="title" />
    </template>

    <view class="agreement-detail">
      <view v-if="loading" class="agreement-detail__loading">
        <Loading />
      </view>

      <view v-else class="agreement-detail__body">
        <!-- mp-html：小程序端渲染完整 HTML 标签，图片宽度、表格、代码块等都比原生 rich-text 可控 -->
        <mp-html class="agreement-detail__rich" :content="content" :tag-style="richTagStyle" />
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.agreement-detail {
  min-height: 100%;
  padding: 32rpx;
  background: var(--app-color-surface-muted);

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 120rpx 0;
  }

  &__body {
    padding: 40rpx 32rpx;
    background: var(--app-color-surface);
    border: 1rpx solid var(--app-color-border);
    border-radius: 16rpx;
  }

  &__rich {
    font-size: 28rpx;
    line-height: 1.8;
    color: var(--app-color-text-secondary);
  }
}
</style>
