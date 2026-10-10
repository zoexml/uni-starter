<route lang="json5" type="page">
{
  layout: 'default',
  name: 'example-tracker',
  meta: {
    public: true,
  },
  style: {
    navigationBarTitleText: '埋点示例',
  },
}
</route>

<script lang="ts" setup>
import { useTracker, useTrackPageView } from '@/composables/useTracker'
import { registerTrackerAdapter } from '@/utils/tracker'
import { createConsoleTrackerAdapter } from '@/utils/tracker-console-adapter'

useShare({ title: '埋点示例' })
useTrackPageView()
const { flush, isEnabled, isFlushing, lastEvent, queueSize, track } = useTracker()

/**
 * 演示自定义适配器：注册一个控制台适配器，
 * 之后每次 flush 的批次都会额外打到控制台（不影响内置 HTTP 适配器）。
 * 接神策 / 友盟时把 createConsoleTrackerAdapter 换成对应实现即可。
 */
const consoleAdapter = createConsoleTrackerAdapter()
registerTrackerAdapter(consoleAdapter)

const lastEventText = computed(() => {
  const event = lastEvent.value
  if (!event) return '暂无事件'

  const location = event.pagePath ? ` @ ${event.pagePath}` : ''
  const params = event.params ? ` ${JSON.stringify(event.params)}` : ''

  return `${event.event}${location}${params}`
})

const handleTrack = () => {
  track('demo_button_click', { source: 'example' })
}

const handleFlush = () => {
  void flush()
}

const handleTrackWithConsole = () => {
  track('adapter_demo_event', { source: 'console-adapter' })
  void flush()
}

onUnmounted(() => {
  // 注册表是模块级的，示例页离开时关掉输出即可，无需注销（注销会影响其它适配器）
  consoleAdapter.setEnabled(false)
})
</script>

<template>
  <z-paging :show-scrollbar="true">
    <template #top>
      <Navbar title="埋点示例" />
    </template>

    <view class="tracker-page">
      <view class="tracker-section">
        <view class="tracker-section__title">
          运行状态
        </view>
        <view class="tracker-row">
          <text class="tracker-row__label">
            埋点开关
          </text>
          <text class="tracker-row__value">
            {{ isEnabled ? '已启用' : '未启用' }}
          </text>
        </view>
        <view class="tracker-row">
          <text class="tracker-row__label">
            待上报事件数
          </text>
          <text class="tracker-row__value">
            {{ queueSize }}
          </text>
        </view>
        <view class="tracker-row">
          <text class="tracker-row__label">
            上报中
          </text>
          <text class="tracker-row__value">
            {{ isFlushing ? '是' : '否' }}
          </text>
        </view>
        <view class="tracker-row tracker-row--column">
          <text class="tracker-row__label">
            最近事件
          </text>
          <text class="tracker-row__event">
            {{ lastEventText }}
          </text>
        </view>
      </view>

      <view class="tracker-section">
        <view class="tracker-section__title">
          操作
        </view>
        <view class="tracker-section__actions">
          <wd-button type="primary" block @click="handleTrack">
            触发示例事件
          </wd-button>
          <wd-button plain block @click="handleFlush">
            手动上报
          </wd-button>
        </view>
      </view>

      <view class="tracker-section">
        <view class="tracker-section__title">
          自定义适配器
        </view>
        <view class="tracker-section__desc">
          本页已注册一个控制台适配器：触发事件并手动上报后，控制台会打印该批次。接三方平台（神策 / 友盟等）时实现 TrackerAdapter 并 registerTrackerAdapter 即可，队列与重试逻辑无需重写。
        </view>
        <view class="tracker-section__actions">
          <wd-button plain block @click="handleTrackWithConsole">
            触发事件并输出批次
          </wd-button>
        </view>
      </view>

      <view class="tracker-section">
        <view class="tracker-section__title">
          说明
        </view>
        <view class="tracker-section__desc">
          事件默认在内存队列中累积，达到 VITE_TRACKER_BATCH_SIZE 或间隔 VITE_TRACKER_FLUSH_INTERVAL 时批量冲刷；配置 VITE_TRACKER_URL 后经 HTTP 适配器上报。开发环境未配置 URL 时，事件以 [tracker] 前缀打印到控制台，不真正上报。
        </view>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.tracker-page {
  min-height: 100%;
  padding: 32rpx;
  background: #f6f8f7;

  .tracker-section {
    padding: 28rpx;
    margin-bottom: 24rpx;
    background: #fff;
    border: 1rpx solid #edf1ef;
    border-radius: 16rpx;

    &__title {
      margin-bottom: 20rpx;
      font-size: 30rpx;
      font-weight: 700;
      line-height: 1.4;
      color: #17211d;
    }

    &__actions {
      display: flex;
      flex-direction: column;
      gap: 18rpx;
    }

    &__desc {
      font-size: 24rpx;
      line-height: 1.7;
      color: #66736e;
    }
  }

  .tracker-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 56rpx;

    &--column {
      flex-direction: column;
      gap: 8rpx;
      align-items: stretch;
    }

    &__label {
      font-size: 26rpx;
      color: #77827e;
    }

    &__value {
      font-size: 26rpx;
      font-weight: 600;
      color: #17211d;
    }

    &__event {
      padding: 12rpx 16rpx;
      font-size: 24rpx;
      line-height: 1.6;
      color: #17211d;
      word-break: break-all;
      background: #f6f8f7;
      border-radius: 8rpx;
    }
  }
}
</style>
