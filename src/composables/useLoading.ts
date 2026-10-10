/**
 * 全局 loading 的响应式封装：状态源在 `@/utils/loading`（纯工具层），
 * 这里只做订阅与只读暴露，保证 http 层与页面拿到的计数是同一份。
 *
 * 用法：
 * ```ts
 * const { visible, pendingCount, withLoading } = useLoading()
 *
 * await withLoading(() => exportReport(), { title: '导出中...' })
 * ```
 *
 * 请求类的 loading 优先用请求层开关，不要手写 begin / end：
 * ```ts
 * http.Post('/order', payload, { meta: { loading: '提交中...' } })
 * ```
 */
import type { LoadingState, RequestLoadingOptions } from '@/utils/loading'
import {
  beginLoading,
  endLoading,
  forceCloseLoading,
  getLoadingState,
  subscribeLoadingState,
  withLoading,
} from '@/utils/loading'

const state = shallowRef<LoadingState>(getLoadingState())
let subscribed = false

/** 模块级单例订阅：首次使用时挂上，随应用生命周期常驻 */
const ensureSubscribed = () => {
  if (subscribed) return

  subscribed = true
  subscribeLoadingState((next) => {
    state.value = next
  })
}

export const useLoading = () => {
  ensureSubscribed()

  return {
    /** 完整状态快照 */
    state: readonly(state),
    /** 进行中的任务数 */
    pendingCount: computed(() => state.value.pendingCount),
    /** loading 是否已经真正显示（未超过延迟阈值时为 false） */
    visible: computed(() => state.value.visible),
    /** 当前文案 */
    title: computed(() => state.value.title),
    beginLoading,
    endLoading,
    /** 兜底关闭，会清空计数 */
    forceCloseLoading,
    withLoading: <T>(task: () => Promise<T> | T, options?: RequestLoadingOptions) => withLoading(task, options),
  }
}
