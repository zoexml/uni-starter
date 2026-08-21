/**
 * 埋点核心：类型定义、运行时配置、适配器注册表、存储读写与事件工厂。
 * 纯工具层，不依赖 Vue 响应式；队列/冲刷引擎在 src/composables/useTracker.ts。
 * 对照 src/utils/global-error-reporting.ts + src/utils/error-handling.ts 的拆分方式。
 */

/** 归一化后的埋点事件，一次 flush 以一个数组批量投递给适配器 */
export interface TrackerEvent {
  event: string
  /** 页面路径，缺省时由 resolvePagePath() 从 getCurrentPages() 解析 */
  pagePath?: string
  params?: Record<string, unknown>
  /** 事件时间戳，epoch ms */
  timestamp: number
  userId?: string
  platform: string
  appVersion?: string
  /** 每次应用启动生成的会话 id */
  sessionId: string
  /** 事件唯一 id，服务端可据此做幂等去重（at-least-once 投递） */
  eventId: string
}

/** 三方平台适配器契约：一次 flush 投递一个批次，实时 SDK 可在内部循环拆包 */
export interface TrackerAdapter {
  name: string
  initialize?: (options: { endpoint: string, isDev: boolean }) => void | Promise<void>
  trackBatch: (events: readonly TrackerEvent[]) => void | Promise<void>
  setUser?: (user: { userId?: string }) => void | Promise<void>
}

export interface TrackerRuntimeConfig {
  appEnv: string
  /** 队列达到该数量时立即冲刷 */
  batchSize: number
  enabled: boolean
  /** HTTP 上报地址；为空时 dev 打印批次丢弃，prod 仅告警一次 */
  endpoint?: string
  flushIntervalMs: number
  isDev: boolean
  isProd: boolean
}

export const TRACKER_EVENT_NAMES = ['page_view', 'user_login', 'user_logout'] as const
export type TrackerEventName = (typeof TRACKER_EVENT_NAMES)[number]
export const TRACKER_STORAGE_KEY = 'tracker_queue'
export const TRACKER_QUEUE_MAX = 100

export const DEFAULT_TRACKER_BATCH_SIZE = 10
export const DEFAULT_TRACKER_FLUSH_INTERVAL = 5000

const adapterRegistry = new Map<string, TrackerAdapter>()

export const registerTrackerAdapter = (adapter: TrackerAdapter) => {
  adapterRegistry.set(adapter.name, adapter)
}

export const getRegisteredAdapters = () => [...adapterRegistry.values()]

export const clearRegisteredAdapters = () => {
  adapterRegistry.clear()
}

export const createTrackerRuntimeConfig = (
  env: Partial<ImportMetaEnv & {
    DEV: boolean
    MODE: string
    PROD: boolean
  }> = {},
): TrackerRuntimeConfig => {
  const endpoint = env.VITE_TRACKER_URL?.trim() || undefined
  const isProd = env.PROD === true || env.MODE === 'production'
  const isDev = env.DEV === true || !isProd
  const parsedBatchSize = Number.parseInt(env.VITE_TRACKER_BATCH_SIZE ?? '', 10)
  const parsedFlushInterval = Number.parseInt(env.VITE_TRACKER_FLUSH_INTERVAL ?? '', 10)

  return {
    appEnv: env.VITE_APP_ENV?.trim() || env.MODE || (isProd ? 'production' : 'development'),
    batchSize: Number.isFinite(parsedBatchSize) && parsedBatchSize > 0
      ? parsedBatchSize
      : DEFAULT_TRACKER_BATCH_SIZE,
    enabled: env.VITE_TRACKER_ENABLE === 'true',
    endpoint,
    flushIntervalMs: Number.isFinite(parsedFlushInterval) && parsedFlushInterval > 0
      ? parsedFlushInterval
      : DEFAULT_TRACKER_FLUSH_INTERVAL,
    isDev,
    isProd,
  }
}

/** 读取本地缓存的待重试队列；存储异常返回空数组 */
export const readTrackerQueue = (): TrackerEvent[] => {
  try {
    const raw = uni.getStorageSync(TRACKER_STORAGE_KEY)
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw

    return Array.isArray(parsed) ? parsed as TrackerEvent[] : []
  } catch {
    return []
  }
}

/** 持久化待重试队列；写入失败返回 false */
export const writeTrackerQueue = (events: readonly TrackerEvent[]): boolean => {
  try {
    uni.setStorageSync(TRACKER_STORAGE_KEY, JSON.stringify(events))
    return true
  } catch {
    return false
  }
}

const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replaceAll('-', '')
  }

  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2, 18)}`
}

export const createTrackerEventId = createId
export const createSessionId = createId

let cachedRuntimeInfo: { platform: string, appVersion?: string } | undefined

const getRuntimeInfo = () => {
  if (cachedRuntimeInfo) return cachedRuntimeInfo

  try {
    const info = uni.getSystemInfoSync()
    cachedRuntimeInfo = {
      platform: info.uniPlatform,
      appVersion: info.appVersion,
    }
  } catch {
    cachedRuntimeInfo = { platform: 'unknown' }
  }

  return cachedRuntimeInfo
}

export const getRuntimePlatform = () => getRuntimeInfo().platform
export const getRuntimeAppVersion = () => getRuntimeInfo().appVersion

/** 从页面栈解析当前页面路径，无法解析时返回 undefined */
export const resolvePagePath = (): string | undefined => {
  try {
    const pages = getCurrentPages()
    const currentPage = pages.at(-1)

    if (!currentPage) {
      return undefined
    }

    const pageWithRoute = currentPage as { route?: string, $page?: { fullPath?: string } }

    return pageWithRoute.$page?.fullPath || pageWithRoute.route
  } catch {
    return undefined
  }
}
