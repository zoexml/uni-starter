<route lang="json5" type="page">
{
  layout: 'default',
  name: 'agreement',
  meta: {
    public: true,
  },
  style: {
    navigationBarTitleText: '协议与条款',
  },
}
</route>

<script lang="ts" setup>
import { AGREEMENT_LIST } from '@/mocks/content'
import type { AgreementType } from '@/mocks/content'
import { useTrackPageView } from '@/composables/useTracker'

useShare({ title: '协议与条款' })
useTrackPageView()

const router = useRouter()

const openDetail = (type: AgreementType, title: string) => {
  router.push({ name: 'agreement-detail', query: { type, title } })
}
</script>

<template>
  <z-paging :show-scrollbar="false">
    <template #top>
      <Navbar title="协议与条款" />
    </template>

    <view class="agreement-page">
      <wd-cell-group border custom-class="agreement-page__group">
        <wd-cell
          v-for="item in AGREEMENT_LIST"
          :key="item.type"
          :title="item.title"
          is-link
          @click="openDetail(item.type, item.title)"
        />
      </wd-cell-group>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.agreement-page {
  min-height: 100%;
  padding: 32rpx;
  background: var(--app-color-surface-muted);

  &__group {
    overflow: hidden;
    border: 1rpx solid var(--app-color-border);
    border-radius: 16rpx;
  }
}
</style>
