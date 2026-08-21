<route lang="json5" type="page">
{
  layout: 'default',
  name: 'example',
  meta: {
    public: true,
  },
  style: {
    navigationBarTitleText: '示例中心',
  },
}
</route>

<script lang="ts" setup>
import { useShare } from '@/composables/useShare'
import { useTrackPageView } from '@/composables/useTracker'

useShare({ title: '示例中心' })
useTrackPageView()

const router = useRouter()

interface ExampleItem {
  key: string
  title: string
  desc: string
  icon: string
  routeName: string
}

const exampleItems: ExampleItem[] = [
  {
    key: 'demo',
    title: '组件示例',
    desc: 'wot 组件库演示：对话框、动作面板、选择器、日期选择、商品卡片等',
    icon: 'apps',
    routeName: 'example-demo',
  },
  {
    key: 'tracker',
    title: '数据分析 · 埋点示例',
    desc: 'useTracker 埋点上报演示：触发事件、批量冲刷与队列状态',
    icon: 'settings',
    routeName: 'example-tracker',
  },
]

const goExample = (item: ExampleItem) => {
  router.push({ name: item.routeName })
}
</script>

<template>
  <z-paging :show-scrollbar="true">
    <template #top>
      <Navbar title="示例中心" />
    </template>

    <view class="example-page">
      <view class="example-section">
        <view class="example-section__title">
          功能示例
        </view>
        <view
          v-for="item in exampleItems"
          :key="item.key"
          class="example-item"
          @click="goExample(item)"
        >
          <view class="example-item__icon">
            <wd-icon :name="item.icon" size="32rpx" />
          </view>
          <view class="example-item__main">
            <view class="example-item__title">
              {{ item.title }}
            </view>
            <view class="example-item__desc">
              {{ item.desc }}
            </view>
          </view>
          <view class="example-item__arrow">
            <wd-icon name="arrow-right" size="28rpx" />
          </view>
        </view>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.example-page {
  min-height: 100%;
  padding: 32rpx;
  background: #f6f8f7;

  .example-section {
    overflow: hidden;
    background: #fff;
    border: 1rpx solid #edf1ef;
    border-radius: 16rpx;

    &__title {
      padding: 24rpx 28rpx 8rpx;
      font-size: 30rpx;
      font-weight: 700;
      line-height: 1.4;
      color: #17211d;
    }
  }

  .example-item {
    display: flex;
    align-items: center;
    min-height: 112rpx;
    padding: 20rpx 28rpx;
    border-bottom: 1rpx solid #edf1ef;

    &:last-child {
      border-bottom: none;
    }

    &__icon {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 56rpx;
      height: 56rpx;
      margin-right: 20rpx;
      color: var(--wot-primary-6);
      background: var(--app-primary-soft);
      border-radius: 50%;
    }

    &__main {
      flex: 1;
      min-width: 0;
    }

    &__title {
      font-size: 30rpx;
      font-weight: 600;
      line-height: 1.35;
      color: #17211d;
    }

    &__desc {
      margin-top: 6rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 24rpx;
      line-height: 1.35;
      color: #77827e;
      white-space: nowrap;
    }

    &__arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 20rpx;
      color: #a8b2ae;
    }
  }
}
</style>
