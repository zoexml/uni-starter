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
        <rich-text class="agreement-detail__rich" :nodes="content" />
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
