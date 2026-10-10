/**
 * 控制台适配器：把每次 flush 的批次打到控制台，用于本地调试埋点链路。
 *
 * 内置 HTTP 适配器在未配置 VITE_TRACKER_URL 时会直接丢弃事件，
 * 想在开发工具里看到真实批次就注册这个适配器。
 *
 * 接入三方平台（友盟 / 神策 / GrowingIO 等）时同理：
 * 实现 TrackerAdapter 后在应用启动时 registerTrackerAdapter(adapter)，
 * 队列、批量、失败重试都由 useTracker 处理，适配器只关心「怎么发」。
 *
 * ```ts
 * // 伪代码：神策适配器
 * export const createSensorsAdapter = (): TrackerAdapter => ({
 *   name: 'sensors',
 *   initialize: ({ endpoint, isDev }) => sa.init({ serverUrl: endpoint, debug: isDev }),
 *   trackBatch: events => sa.trackBatch(events.map(toSensorsEvent)),
 * })
 * ```
 */
import type { TrackerAdapter, TrackerEvent } from '@/utils/tracker'

export interface ConsoleTrackerAdapter extends TrackerAdapter {
  /** 开关关闭后适配器仍注册，但不再输出，避免影响其它适配器 */
  setEnabled: (enabled: boolean) => void
  /** 最近一次收到的批次，可在示例页里展示 */
  getLastBatch: () => readonly TrackerEvent[]
}

export const createConsoleTrackerAdapter = (): ConsoleTrackerAdapter => {
  let enabled = true
  let lastBatch: readonly TrackerEvent[] = []

  return {
    name: 'console',
    initialize: ({ isDev }) => {
      enabled = isDev
      console.info('[tracker] console 适配器已注册', { isDev })
    },
    trackBatch(events: readonly TrackerEvent[]) {
      lastBatch = events
      if (!enabled) return

      console.info('[tracker] console 适配器收到事件', events.length)
      console.table(events.map(event => ({
        event: event.event,
        page: event.pagePath,
        params: JSON.stringify(event.params ?? {}),
        userId: event.userId ?? '-',
      })))
    },
    setUser({ userId }) {
      lastBatch = lastBatch.map(event => ({ ...event, userId: userId || event.userId }))
    },
    setEnabled(nextEnabled: boolean) {
      enabled = nextEnabled
    },
    getLastBatch() {
      return lastBatch
    },
  }
}
