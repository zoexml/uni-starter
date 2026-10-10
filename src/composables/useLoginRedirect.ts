/**
 * 登录后的回跳统一逻辑。
 *
 * 优先回到路由守卫拦截时写进 `redirect` 的目标页，没有则回默认页。
 * 抽成独立 composable 是为了让「验证码登录」和「微信一键手机号授权」共用同一套规则，
 * 避免在页面和 composable 两处维护同一份 redirect 解析。
 */
import { isTabbarPath } from '@/tabbar/config'

const DEFAULT_AFTER_LOGIN_PATH = '/pages/my/index'

export const useLoginRedirect = () => {
  const route = useRoute()

  const getRedirectPath = () => {
    const redirect = route.query?.redirect
    if (typeof redirect !== 'string') return ''

    try {
      return decodeURIComponent(redirect)
    } catch {
      return ''
    }
  }

  const goAfterLogin = (fallbackPath: string = DEFAULT_AFTER_LOGIN_PATH) => {
    const targetPath = getRedirectPath() || fallbackPath

    if (isTabbarPath(targetPath)) {
      uni.switchTab({ url: targetPath as '/pages/index/index' | '/pages/my/index' })
      return
    }

    uni.redirectTo({ url: targetPath })
  }

  return { getRedirectPath, goAfterLogin }
}
