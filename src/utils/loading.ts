/**
 * 全局 loading 纯工具层（同 `tracker.ts` 的定位：不依赖 Vue，便于单测）。
 *
 * 解决三件事：
 * 1. **引用计数**：并发请求只弹一次 loading，最后一个请求结束才关闭；
 * 2. **延迟显示**：请求快于阈值时不显示，避免页面切换、缓存命中时 loading 一闪而过；
 * 3. **状态订阅**：`useLoading` 通过 `subscribeLoadingState` 拿响应式快照，避免状态源有两份。
 *
 * 页面通常不需要直接调用这里：请求层用 `meta.loading` 自动接管，
 * 非请求类异步任务用 `withLoading` 包裹。
 */

export interface RequestLoadingOptions {
  /** 展示文案，默认「加载中...」 */
  title?: string
  /** 延迟显示阈值（ms），实际耗时小于该值的请求不显示 loading，默认 400 */
  delay?: number
  /** 是否显示透明遮罩（阻断点击，避免重复提交），默认 true */
  mask?: boolean
}

export interface LoadingState {
  /** 进行中的任务数 */
  pendingCount: number
  /** loading 是否已经真正显示（未超过延迟阈值时为 false） */
  visible: boolean
  /** 当前文案 */
  title: string
}

export const DEFAULT_LOADING_TITLE = '加载中...'
export const DEFAULT_LOADING_DELAY = 400

let pendingCount = 0
let visible = false
let currentTitle = DEFAULT_LOADING_TITLE
let currentMask = true
let showTimer: ReturnType<typeof setTimeout> | undefined

const listeners = new Set<(state: LoadingState) => void>()

export const getLoadingState = (): LoadingState => ({
  pendingCount,
  visible,
  title: currentTitle,
})

const emit = () => {
  const state = getLoadingState()
  listeners.forEach(listener => listener(state))
}

/** 订阅状态变化（订阅时立即回调一次当前状态），返回取消订阅函数 */
export const subscribeLoadingState = (listener: (state: LoadingState) => void) => {
  listeners.add(listener)
  listener(getLoadingState())

  return () => {
    listeners.delete(listener)
  }
}

const showLoading = () => {
  showTimer = undefined

  if (visible || pendingCount <= 0) return

  visible = true
  uni.showLoading({ title: currentTitle, mask: currentMask })
  emit()
}

const hideLoading = () => {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = undefined
  }

  if (!visible) return

  visible = false
  uni.hideLoading()
  emit()
}

const resetOptions = () => {
  currentTitle = DEFAULT_LOADING_TITLE
  currentMask = true
}

/** 任务开始：计数 +1，首个任务按延迟阈值决定何时真正显示 */
export const beginLoading = (options: RequestLoadingOptions = {}) => {
  pendingCount += 1

  if (options.title) currentTitle = options.title
  if (typeof options.mask === 'boolean') currentMask = options.mask

  if (!visible) {
    const delay = options.delay ?? DEFAULT_LOADING_DELAY

    if (delay <= 0) {
      showLoading()
    } else if (!showTimer) {
      showTimer = setTimeout(showLoading, delay)
    }
  }

  emit()
}

/** 任务结束：计数 -1，归零时关闭并复位文案与遮罩配置 */
export const endLoading = () => {
  if (pendingCount === 0) return

  pendingCount -= 1

  if (pendingCount === 0) {
    hideLoading()
    resetOptions()
    emit()
  } else {
    emit()
  }
}

/** 兜底关闭：仅在异常路径（如 401 跳登录、App 隐藏）使用，会清空计数 */
export const forceCloseLoading = () => {
  pendingCount = 0
  hideLoading()
  resetOptions()
  emit()
}

/** 包裹任意异步任务，自动配对 beginLoading / endLoading */
export const withLoading = async <T>(
  task: () => Promise<T> | T,
  options?: RequestLoadingOptions,
): Promise<T> => {
  beginLoading(options)

  try {
    return await task()
  } finally {
    endLoading()
  }
}
