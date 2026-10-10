/**
 * 登录后的回跳统一逻辑。
 *
 * 优先回到路由守卫拦截时写进 `redirect` 的目标页，没有则回默认页。
 * 抽成独立 composable 是为了让「验证码登录」和「微信一键手机号授权」共用同一套规则，
 * 避免在页面和 composable 两处维护同一份 redirect 解析。
 *
 * `redirect` 可能来自旧链接、分享卡片或外部 WebView 桥接，页面路径调整后就会失效，
 * 因此必须校验目标页是否仍存在于路由表，避免 switchTab/redirectTo 报 page not found。
 */
import { isTabbarPath, switchToHomeTab } from '@/tabbar/config'

const DEFAULT_AFTER_LOGIN_PATH = '/pages/main/my/index'

interface RoutePathItem {
  path?: string
}

/** 目标页是否仍存在于路由表（ROUTES 由 uni-read-pages-vite 在构建时注入） */
function isKnownPagePath(path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const routes = (ROUTES as RoutePathItem[]) || []

  return routes.some(route => `/${route.path?.replace(/^\//, '')}` === normalized)
}

export const useLoginRedirect = () => {
  const route = useRoute()

  const getRedirectPath = () => {
    const redirect = route.query?.redirect
    if (typeof redirect !== 'string') return ''

    try {
      const decoded = decodeURIComponent(redirect)
      return isKnownPagePath(decoded.split('?')[0]) ? decoded : ''
    } catch {
      return ''
    }
  }

  const goAfterLogin = (fallbackPath: string = DEFAULT_AFTER_LOGIN_PATH) => {
    const targetPath = getRedirectPath() || fallbackPath

    if (isTabbarPath(targetPath)) {
      uni.switchTab({
        url: targetPath as '/pages/main/index/index' | '/pages/main/my/index',
        fail: switchToHomeTab,
      })
      return
    }

    uni.redirectTo({ url: targetPath })
  }

  return { getRedirectPath, goAfterLogin }
}
