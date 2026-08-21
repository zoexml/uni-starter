/**
 * 内置 HTTP 批量上报适配器：一次 flush 通过 uni.request POST 一个事件数组。
 * endpoint 由 useTracker 初始化时通过 initialize() 注入（来自 VITE_TRACKER_URL）。
 * 其他三方平台（友盟/神策等）可实现 TrackerAdapter 后 registerTrackerAdapter 接入。
 */
import type { TrackerAdapter, TrackerEvent } from '@/utils/tracker'

export const createHttpTrackerAdapter = (): TrackerAdapter => {
  let endpoint = ''

  return {
    name: 'http',
    initialize: ({ endpoint: nextEndpoint }) => {
      endpoint = nextEndpoint
    },
    async trackBatch(events: readonly TrackerEvent[]) {
      if (!endpoint) {
        throw new Error('[tracker] http 适配器未配置上报地址')
      }

      const res = await uni.request({
        data: events as unknown as UniApp.RequestOptions['data'],
        header: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        url: endpoint,
      })

      if (res.statusCode >= 400) {
        throw new Error(`[tracker] http 上报失败，HTTP ${res.statusCode}`)
      }
    },
  }
}
