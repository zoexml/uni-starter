/**
 * useShare 分享 composable：页面 setup 内调用一次，注册 onShareAppMessage（转发卡片）
 * 与 onShareTimeline（朋友圈），统一分享标题/路径/分享图，避免各页面重复实现。
 *
 * - path 缺省 = 当前页路径（含已有 query，与 tracker.resolvePagePath 同模式），再追加 options.query
 * - imageUrl 缺省时不返回 → 微信自动使用页面截图作为分享图
 * - H5 上 uni 对这两个钩子为 no-op，天然降级
 */
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

export interface ShareOptions {
  /** 分享卡片标题 */
  title: string
  /** 分享页面路径（绝对路径），缺省 = 当前页路径 */
  path?: string
  /** 追加到分享 path / 朋友圈 query 的参数 */
  query?: Record<string, string | number>
  /** 分享图，缺省 → 微信自动截图当前页 */
  imageUrl?: string
}

const resolveCurrentPagePath = (): string => {
  try {
    const pages = getCurrentPages()
    const currentPage = pages.at(-1)

    if (!currentPage) {
      return '/pages/main/index/index'
    }

    const page = currentPage as { route?: string, $page?: { fullPath?: string } }
    const path = page.$page?.fullPath || page.route

    if (!path) {
      return '/pages/main/index/index'
    }

    return path.startsWith('/') ? path : `/${path}`
  } catch {
    return '/pages/main/index/index'
  }
}

const buildQueryString = (query?: ShareOptions['query']): string => {
  if (!query || Object.keys(query).length === 0) return ''

  return Object.entries(query)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')
}

/** 追加 query 到已有路径，正确处理 path 已带 query 的拼接 */
const appendQuery = (path: string, query?: ShareOptions['query']): string => {
  const queryString = buildQueryString(query)
  if (!queryString) return path

  return path.includes('?') ? `${path}&${queryString}` : `${path}?${queryString}`
}

export const useShare = (options: ShareOptions) => {
  onShareAppMessage(() => ({
    title: options.title,
    path: appendQuery(options.path || resolveCurrentPagePath(), options.query),
    ...(options.imageUrl ? { imageUrl: options.imageUrl } : {}),
  }))

  onShareTimeline(() => ({
    title: options.title,
    ...(buildQueryString(options.query) ? { query: buildQueryString(options.query) } : {}),
    ...(options.imageUrl ? { imageUrl: options.imageUrl } : {}),
  }))
}
