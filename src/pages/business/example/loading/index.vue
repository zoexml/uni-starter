<route lang="json5" type="page">
{
  layout: 'default',
  name: 'example-loading',
  meta: {
    public: true,
  },
  style: {
    navigationBarTitleText: '请求 loading 示例',
  },
}
</route>

<script lang="ts" setup>
import { useLoading } from '@/composables/useLoading'
import { useTrackPageView } from '@/composables/useTracker'
import { http } from '@/utils/http'

useShare({ title: '请求 loading 示例' })
useTrackPageView()

/** 与 http 层 meta.loading 对齐的三种写法 */
type LoadingMeta = boolean | string | { title?: string, delay?: number, mask?: boolean }

interface LoadingDemoResult {
  ms: number
  finishedAt: number
}

const {
  pendingCount,
  visible,
  title,
  beginLoading,
  forceCloseLoading,
  withLoading,
} = useLoading()

const logs = shallowRef<string[]>([])
/** 自增参数：保证并发请求的参数不同，避免被 alova 的请求共享合并成一次 */
let requestSeq = 0

const pushLog = (message: string) => {
  const at = new Date().toLocaleTimeString('zh-CN', { hour12: false })
  logs.value = [`${at} ${message}`, ...logs.value].slice(0, 6)
}

/** loading 真正显示 / 关闭时记一笔，便于对照「阈值内不显示」的请求 */
watch(visible, (next) => {
  pushLog(next ? `loading 显示：${title.value}` : 'loading 关闭')
})

const callDemoApi = async (ms: number, loading: LoadingMeta, label: string) => {
  pushLog(`发起请求：${label}`)

  const result = await http.Get<LoadingDemoResult>('/example/loading', {
    // seq 让每次请求参数都不同：并发演示时才不会被请求共享合并
    params: { ms, seq: ++requestSeq },
    meta: { loading },
  })

  pushLog(`请求返回：${label}（${result.ms}ms）`)
}

/** 约 300ms 的请求：默认阈值 400ms 内，loading 不会出现，避免闪烁 */
const handleFastRequest = () => {
  void callDemoApi(0, true, '快请求')
    .catch(() => pushLog('快请求失败'))
}

/** 约 1.8s 的请求：超过阈值，全屏 loading 显示到请求结束 */
const handleSlowRequest = () => {
  void callDemoApi(1500, true, '慢请求')
    .catch(() => pushLog('慢请求失败'))
}

/** 提交类请求：自定义文案，比默认「加载中...」更贴合场景 */
const handleCustomTitle = () => {
  void callDemoApi(1200, '提交中...', '自定义文案')
    .catch(() => pushLog('自定义文案请求失败'))
}

/** 提高阈值后，总耗时约 900ms 的请求也不显示 loading（mock 本身还有 300ms 基础延迟） */
const handleCustomDelay = () => {
  void callDemoApi(600, { delay: 1200 }, '阈值 1200ms')
    .catch(() => pushLog('阈值演示失败'))
}

/** 并发：计数 +1 三次只显示一次，最后一个结束才关闭 */
const handleConcurrent = () => {
  const tasks = [600, 1000, 1400].map(ms => callDemoApi(ms, true, `并发 ${ms}ms`))

  void Promise.all(tasks).catch(() => pushLog('并发请求有失败'))
}

/** 非请求类异步任务：用 withLoading 包裹，同样参与引用计数 */
const handleLocalTask = () => {
  pushLog('发起本地任务（1.2s）')

  void withLoading(
    () => new Promise(resolve => setTimeout(resolve, 1200)),
    { title: '本地任务处理中...' },
  ).then(() => pushLog('本地任务完成'))
}

/** 故意只 begin 不 end，模拟异常路径下计数未归零 */
const handleLeakLoading = () => {
  beginLoading({ title: '不会被自动关闭', delay: 0 })
  pushLog('手动 beginLoading（未配对 end）')
}

const handleForceClose = () => {
  forceCloseLoading()
  pushLog('forceCloseLoading 兜底关闭')
}
</script>

<template>
  <z-paging :show-scrollbar="false">
    <template #top>
      <Navbar title="请求 loading" />
    </template>

    <view class="loading-page">
      <view class="loading-card">
        <view class="loading-card__title">
          meta.loading 全局 loading
        </view>
        <view class="loading-card__desc">
          引用计数保证并发只显示一次；延迟阈值保证快请求不闪烁。
          请求层开关写在 meta 上，页面不需要手动 showLoading / hideLoading。
        </view>
      </view>

      <view class="loading-section">
        <view class="loading-section__title">
          实时状态
        </view>
        <view class="loading-row">
          <text class="loading-row__label">
            进行中任务数
          </text>
          <text class="loading-row__value">
            {{ pendingCount }}
          </text>
        </view>
        <view class="loading-row">
          <text class="loading-row__label">
            是否已显示
          </text>
          <text class="loading-row__value">
            {{ visible ? '显示中' : '未显示' }}
          </text>
        </view>
        <view class="loading-row">
          <text class="loading-row__label">
            当前文案
          </text>
          <text class="loading-row__value">
            {{ title }}
          </text>
        </view>
      </view>

      <view class="loading-actions">
        <wd-button block :disabled="visible" @click="handleFastRequest">
          快请求 ~300ms（默认阈值内不显示）
        </wd-button>
        <wd-button block type="primary" @click="handleSlowRequest">
          慢请求 ~1.8s（显示 loading）
        </wd-button>
        <wd-button block @click="handleCustomTitle">
          自定义文案 meta: '提交中...'
        </wd-button>
        <wd-button block @click="handleCustomDelay">
          自定义阈值 meta: { delay: 1200 }（约 900ms 也不显示）
        </wd-button>
        <wd-button block @click="handleConcurrent">
          并发 3 个请求（只显示一次）
        </wd-button>
        <wd-button plain block @click="handleLocalTask">
          withLoading 包裹本地任务
        </wd-button>
        <wd-button plain block @click="handleLeakLoading">
          手动 beginLoading（不配对 end）
        </wd-button>
        <wd-button plain block type="warning" @click="handleForceClose">
          forceCloseLoading 兜底
        </wd-button>
      </view>

      <view class="loading-section">
        <view class="loading-section__title">
          事件日志
        </view>
        <view v-if="!logs.length" class="loading-section__desc">
          点击上方按钮后，这里会记录请求与 loading 的开关顺序。
        </view>
        <view v-for="item in logs" :key="item" class="loading-log">
          {{ item }}
        </view>
      </view>

      <view class="loading-section">
        <view class="loading-section__title">
          用法
        </view>
        <view class="loading-section__desc">
          http.Post('/order', payload, { meta: { loading: '提交中...' } })
        </view>
        <view class="loading-section__desc">
          meta.loading 支持 true（默认文案）/ 字符串（自定义文案）/ 对象（title、delay、mask）。
          缺省不显示，列表与首屏这类已有骨架屏的场景不要开启；
          401 跳登录、App 退到后台等异常路径已内置兜底关闭。
        </view>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.loading-page {
  min-height: 100%;
  padding: 32rpx;
  background: var(--app-color-surface-muted);
}

.loading-card {
  padding: 32rpx;
  margin-bottom: 24rpx;
  background: var(--app-color-surface);
  border: 1rpx solid var(--app-color-border);
  border-radius: 16rpx;

  &__title {
    font-size: 32rpx;
    font-weight: 600;
    color: var(--app-color-text);
  }

  &__desc {
    margin-top: 16rpx;
    font-size: 26rpx;
    line-height: 1.7;
    color: var(--app-color-text-secondary);
  }
}

.loading-section {
  padding: 32rpx;
  margin-bottom: 24rpx;
  background: var(--app-color-surface);
  border: 1rpx solid var(--app-color-border);
  border-radius: 16rpx;

  &__title {
    margin-bottom: 20rpx;
    font-size: 30rpx;
    font-weight: 600;
    color: var(--app-color-text);
  }

  &__desc {
    font-size: 26rpx;
    line-height: 1.7;
    color: var(--app-color-text-secondary);

    & + & {
      margin-top: 16rpx;
    }
  }
}

.loading-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;

  & + & {
    border-top: 1rpx solid var(--app-color-border);
  }

  &__label {
    font-size: 27rpx;
    color: var(--app-color-text-secondary);
  }

  &__value {
    font-size: 27rpx;
    color: var(--app-color-text);
  }
}

.loading-actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.loading-log {
  padding: 12rpx 0;
  font-size: 25rpx;
  line-height: 1.6;
  color: var(--app-color-text-regular);

  & + & {
    border-top: 1rpx solid var(--app-color-border);
  }
}
</style>
