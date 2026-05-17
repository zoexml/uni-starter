import { createRouter } from 'uni-mini-router'
import { useUserStore } from '@/stores'

console.log('🚀 ~ routes----:', ROUTES)
const router = createRouter({
  routes: [...ROUTES], // 路由表信息
})

interface RouteMeta {
  public?: boolean
  requiresAuth?: boolean
  permissions?: string[]
}

interface GuardRoute {
  name?: string
  path?: string
  fullPath?: string
  meta?: RouteMeta
}

const LOGIN_ROUTE_NAME = 'login'
const TABBAR_PATHS = ['/pages/index/index', '/pages/my/index']

function getRoutePath(route: GuardRoute) {
  return route.fullPath || route.path || ''
}

function getCleanPath(path: string) {
  return path.split('?')[0]
}

function createLoginRedirect(to: GuardRoute) {
  const redirect = getRoutePath(to)
  const query = redirect ? { redirect: encodeURIComponent(redirect) } : undefined

  return {
    path: '/pages/login/index',
    query,
  }
}

function isTabbarPath(path: string) {
  return TABBAR_PATHS.includes(getCleanPath(path))
}

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const target = to as GuardRoute
  const meta = target.meta || {}

  if (target.name === LOGIN_ROUTE_NAME || meta.public) {
    next()
    return
  }

  if (meta.requiresAuth && !userStore.isLogin) {
    next(createLoginRedirect(target))
    return
  }

  const requiredPermissions = meta.permissions || []
  const hasRoutePermission = requiredPermissions.every(permission => userStore.hasPermission(permission))

  if (requiredPermissions.length > 0 && !hasRoutePermission) {
    uni.showToast({ title: '暂无访问权限', icon: 'none' })

    const fallbackPath = userStore.isLogin ? '/pages/index/index' : '/pages/login/index'
    next(isTabbarPath(fallbackPath) ? { path: fallbackPath, navType: 'pushTab' } : { path: fallbackPath })
    return
  }

  next()
})
router.afterEach((_to, _from) => {
  // console.log(to)
  // console.log(from)
})

export default router
