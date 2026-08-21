/**
 * useTracker 埋点 composable：模块级单例（同 useTheme），维护事件队列与冲刷引擎。
 *
 * 流程：track() → 归一化 TrackerEvent → 内存队列 → 阈值/定时/App 隐藏触发 flush
 *       → 扇出到所有注册适配器 → 失败持久化到 storage（tracker_queue）→ 下次启动恢复重试。
 * userId 惰性读取 useUserStore()（同 http.ts 模式），登录/登出无需手动调用 setUserId。
 */
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores'
import { createHttpTrackerAdapter } from '@/utils/tracker-http-adapter'
import {
  createSessionId,
  createTrackerEventId,
  createTrackerRuntimeConfig,
  DEFAULT_TRACKER_BATCH_SIZE,
  getRegisteredAdapters,
  getRuntimeAppVersion,
  getRuntimePlatform,
  readTrackerQueue,
  registerTrackerAdapter,
  resolvePagePath,
  TRACKER_QUEUE_MAX,
  writeTrackerQueue,
} from '@/utils/tracker'
import type { TrackerEvent, TrackerEventName, TrackerRuntimeConfig } from '@/utils/tracker'

const trackerEnv = (import.meta as ImportMeta & {
  env?: Partial<ImportMetaEnv & {
    DEV: boolean
    MODE: string
    PROD: boolean
  }>
}).env

const queue = shallowRef<TrackerEvent[]>([])
const isEnabled = shallowRef(false)
const isFlushing = shallowRef(false)
const lastEvent = shallowRef<TrackerEvent | undefined>(undefined)
const queueSize = computed(() => queue.value.length)

let config: TrackerRuntimeConfig | undefined
let sessionId = createSessionId()
let flushTimer: ReturnType<typeof setInterval> | undefined
let hasInitialized = false
let explicitUserId: string | undefined
let flushQueued = false
let warnedNoEndpointInProd = false

const getCurrentUserId = () => {
  try {
    const store = useUserStore()
    return store.userInfo?.id || undefined
  } catch {
    return undefined
  }
}

const buildEvent = (
  event: string,
  params: Record<string, unknown> | undefined,
  pagePath: string | undefined,
): TrackerEvent => {
  return {
    event,
    pagePath: pagePath || resolvePagePath(),
    params,
    timestamp: Date.now(),
    userId: explicitUserId || getCurrentUserId(),
    platform: getRuntimePlatform(),
    appVersion: getRuntimeAppVersion(),
    sessionId,
    eventId: createTrackerEventId(),
  }
}

const flush = async (): Promise<void> => {
  if (isFlushing.value) {
    flushQueued = true
    return
  }

  if (queue.value.length === 0) return

  if (!config?.endpoint) {
    if (config?.isDev) {
      console.info('[tracker] 未配置 VITE_TRACKER_URL，打印批次并丢弃:', queue.value)
    } else if (!warnedNoEndpointInProd) {
      console.warn('[tracker] 生产环境未配置 VITE_TRACKER_URL，事件将被丢弃')
      warnedNoEndpointInProd = true
    }
    queue.value = []
    void writeTrackerQueue([])
    return
  }

  const adapters = getRegisteredAdapters()
  if (adapters.length === 0) {
    if (config?.isDev) {
      console.warn('[tracker] 无可用适配器，事件被丢弃')
    }
    queue.value = []
    void writeTrackerQueue([])
    return
  }

  isFlushing.value = true
  const batch = queue.value
  queue.value = []

  try {
    await Promise.all(adapters.map(adapter => adapter.trackBatch(batch)))
    void writeTrackerQueue([])
  } catch (error) {
    queue.value = [...batch, ...queue.value].slice(-TRACKER_QUEUE_MAX)
    if (config?.isDev) {
      console.warn('[tracker] 上报失败，事件已缓存待重试:', error)
    } else {
      console.error('[tracker] 上报失败，事件已缓存待重试:', error)
    }
    void writeTrackerQueue(queue.value)
  } finally {
    isFlushing.value = false
    if (flushQueued) {
      flushQueued = false
      void flush()
    }
  }
}

const startFlushTimer = () => {
  if (flushTimer || !config?.enabled) return

  flushTimer = setInterval(() => {
    void flush()
  }, config.flushIntervalMs)
}

const initialize = () => {
  if (hasInitialized) return
  hasInitialized = true

  config = createTrackerRuntimeConfig(trackerEnv)
  isEnabled.value = config.enabled

  if (!config.enabled) return

  sessionId = createSessionId()

  registerTrackerAdapter(createHttpTrackerAdapter())
  getRegisteredAdapters().forEach((adapter) => {
    adapter.initialize?.({ endpoint: config!.endpoint || '', isDev: config!.isDev })
  })

  queue.value = readTrackerQueue()
  if (queue.value.length > 0) {
    void flush()
  }

  startFlushTimer()
}

const ensureInitialized = () => {
  if (!hasInitialized) {
    initialize()
  }
}

const enqueue = (eventName: string, params?: Record<string, unknown>, pagePath?: string) => {
  ensureInitialized()

  if (!isEnabled.value) {
    if (config?.isDev) {
      console.info(`[tracker] 埋点未启用，跳过事件: ${eventName}`)
    }
    return
  }

  const event = buildEvent(eventName, params, pagePath)
  queue.value = [...queue.value, event]
  lastEvent.value = event

  if (queue.value.length > TRACKER_QUEUE_MAX) {
    const dropped = queue.value.length - TRACKER_QUEUE_MAX
    queue.value = queue.value.slice(-TRACKER_QUEUE_MAX)
    if (config?.isDev) {
      console.warn(`[tracker] 队列溢出，丢弃最旧的 ${dropped} 个事件`)
    }
  }

  startFlushTimer()

  if (queue.value.length >= (config?.batchSize ?? DEFAULT_TRACKER_BATCH_SIZE)) {
    void flush()
  }
}

const track = (event: TrackerEventName | (string & {}), params?: Record<string, unknown>) => {
  enqueue(event, params)
}

const trackPageView = (pagePath?: string, params?: Record<string, unknown>) => {
  enqueue('page_view', params, pagePath)
}

const setUserId = (userId?: string) => {
  explicitUserId = userId
  getRegisteredAdapters().forEach(adapter => void adapter.setUser?.({ userId }))
}

export const useTracker = () => {
  return {
    initialize,
    track,
    trackPageView,
    setUserId,
    flush,
    isEnabled: readonly(isEnabled),
    isFlushing: readonly(isFlushing),
    lastEvent: readonly(lastEvent),
    queueSize,
  }
}

/** 页面级浏览埋点：onShow 时上报一次 page_view，页面无需感知实现细节 */
export const useTrackPageView = (pagePath?: string) => {
  const { trackPageView } = useTracker()

  onShow(() => {
    trackPageView(pagePath)
  })
}
