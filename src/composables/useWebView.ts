import { useUserStore } from '@/stores'

export const WEBVIEW_BRIDGE_SOURCE = 'uni-starter-webview'
export const WEBVIEW_BRIDGE_VERSION = 1
export const WEBVIEW_PAGE_PATH = '/pages-business/webview/index'
export const WEBVIEW_INIT_QUERY_KEY = '__uniStarterBridge'

export const WEBVIEW_BRIDGE_METHODS = [
  'setTitle',
  'close',
  'navigate',
  'share',
  'getToken',
  'getUserInfo',
  'getEnv',
] as const

export type WebViewBridgeMethod = (typeof WEBVIEW_BRIDGE_METHODS)[number]

export interface WebViewAccessRule {
  bridgeMethods: readonly WebViewBridgeMethod[]
  hosts: readonly string[]
  id: string
  pathPattern?: string
  requiresAuth?: boolean
  title?: string
}

export interface OpenWebViewOptions {
  title?: string
  url: string
}

export interface WebViewRouteLocation {
  name: 'webview'
  params: Record<string, string>
}

export interface WebViewBridgePayload {
  id: string
  method: WebViewBridgeMethod
  params: Record<string, unknown>
  source: string
  version: number
}

export interface WebViewInitUserInfo {
  avatar?: string
  name?: string
  nickname?: string
  orgName?: string
  phone?: string
  roleName?: string
}

export interface NormalizedWebViewUrl {
  hostname: string
  href: string
  origin: string
  pathname: string
  protocol: string
  search: string
  toString: () => string
}

interface ResolveWebViewAccessOptions {
  isDev: boolean
  isLoggedIn: boolean
  rules: readonly WebViewAccessRule[]
}

interface ResolveWebViewAccessResult {
  allowed: boolean
  code?: 'AUTH_REQUIRED' | 'INVALID_URL' | 'UNSUPPORTED_PROTOCOL' | 'URL_NOT_ALLOWED'
  rule?: WebViewAccessRule
  url?: NormalizedWebViewUrl
}

interface NormalizePayloadResult {
  error?: {
    code: 'INVALID_PAYLOAD'
    message: string
  }
  ok: boolean
  value?: WebViewBridgePayload
}

interface BuildWebViewInitContextOptions {
  bridgeMethods: readonly WebViewBridgeMethod[]
  isLogin: boolean
  platform: string
  route: string
  token?: string
  userInfo?: WebViewInitUserInfo | null
}

interface ParseWebViewRouteQueryResult {
  title?: string
  url: string
}

const httpProtocols = ['http:', 'https:'] as const
const maskedPhonePattern = /^(\d{3})\d+(\d{4})$/
const protocolPattern = /^([a-z][a-z\d+.-]*:)/i

// Template defaults for demo and local debugging. Replace these with real business domains.
export const DEFAULT_WEBVIEW_ACCESS_RULES: readonly WebViewAccessRule[] = [
  {
    bridgeMethods: ['setTitle', 'close', 'navigate', 'getEnv'],
    hosts: ['localhost', '127.0.0.1'],
    id: 'local-dev',
    pathPattern: '/**',
    requiresAuth: false,
    title: '本地调试页',
  },
  {
    bridgeMethods: ['setTitle', 'close', 'navigate', 'getEnv'],
    hosts: ['uniapp.dcloud.net.cn'],
    id: 'uni-docs',
    pathPattern: '/**',
    requiresAuth: false,
    title: 'uni-app 文档',
  },
] as const

const isAllowedMethod = (value: string): value is WebViewBridgeMethod => {
  return WEBVIEW_BRIDGE_METHODS.includes(value as WebViewBridgeMethod)
}

const isAllowedProtocol = (protocol: string, isDev: boolean) => {
  if (protocol === 'https:') return true
  return isDev && httpProtocols.includes(protocol as (typeof httpProtocols)[number])
}

const escapeRegExp = (value: string) => {
  return value.replaceAll(/[|\\{}()[\]^$+?.]/g, '\\$&')
}

const toPathRegExp = (pattern?: string) => {
  const source = pattern || '/**'
  const normalized = source.startsWith('/') ? source : `/${source}`
  const escaped = normalized
    .split('**')
    .map(part => part.split('*').map(segment => escapeRegExp(segment)).join('[^/]*'))
    .join('.*')

  return new RegExp(`^${escaped}$`)
}

const isMatchingHost = (hostname: string, hostPattern: string) => {
  const normalizedPattern = hostPattern.trim().toLowerCase()

  if (!normalizedPattern) return false
  if (normalizedPattern.startsWith('*.')) {
    const baseHost = normalizedPattern.slice(2)
    return hostname === baseHost || hostname.endsWith(`.${baseHost}`)
  }

  return hostname === normalizedPattern
}

const findMatchingRule = (url: NormalizedWebViewUrl, rules: readonly WebViewAccessRule[]) => {
  const hostname = url.hostname.toLowerCase()

  return rules.find((rule) => {
    const isHostMatched = rule.hosts.some(hostPattern => isMatchingHost(hostname, hostPattern))
    const isPathMatched = toPathRegExp(rule.pathPattern).test(url.pathname)

    return isHostMatched && isPathMatched
  })
}

const getHostname = (host: string) => {
  const hostWithoutUserInfo = host.includes('@') ? host.split('@').at(-1) || '' : host

  if (hostWithoutUserInfo.startsWith('[')) {
    return hostWithoutUserInfo.slice(1, hostWithoutUserInfo.indexOf(']')).toLowerCase()
  }

  return hostWithoutUserInfo.split(':')[0].toLowerCase()
}

const createNormalizedUrl = (
  protocol: string,
  host: string,
  pathname = '/',
  search = '',
): NormalizedWebViewUrl => {
  const normalizedPathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  const normalizedSearch = search && search.startsWith('?') ? search : search ? `?${search}` : ''
  const origin = `${protocol}//${host}`
  const href = `${origin}${normalizedPathname}${normalizedSearch}`

  return {
    hostname: getHostname(host),
    href,
    origin,
    pathname: normalizedPathname,
    protocol,
    search: normalizedSearch,
    toString: () => href,
  }
}

const normalizeUrl = (input: string): NormalizedWebViewUrl | null => {
  const value = input.trim()

  if (!value) return null

  const protocolMatch = value.match(protocolPattern)
  if (!protocolMatch) return null

  const protocol = protocolMatch[1].toLowerCase()
  const valueWithoutProtocol = value.slice(protocol.length)

  if (!valueWithoutProtocol.startsWith('//')) {
    return createNormalizedUrl(protocol, '', '/')
  }

  const valueWithoutSlashes = valueWithoutProtocol.slice(2)
  const firstPathIndex = [...'/?#']
    .map(char => valueWithoutSlashes.indexOf(char))
    .filter(index => index >= 0)
    .sort((left, right) => left - right)[0]

  const host = firstPathIndex === undefined
    ? valueWithoutSlashes
    : valueWithoutSlashes.slice(0, firstPathIndex)
  const pathAndQueryWithHash = firstPathIndex === undefined
    ? ''
    : valueWithoutSlashes.slice(firstPathIndex)
  const hashIndex = pathAndQueryWithHash.indexOf('#')
  const pathAndQuery = hashIndex >= 0 ? pathAndQueryWithHash.slice(0, hashIndex) : pathAndQueryWithHash
  const queryIndex = pathAndQuery.indexOf('?')

  if (queryIndex === 0) {
    return createNormalizedUrl(protocol, host, '/', pathAndQuery)
  }

  if (queryIndex > 0) {
    return createNormalizedUrl(protocol, host, pathAndQuery.slice(0, queryIndex), pathAndQuery.slice(queryIndex))
  }

  return createNormalizedUrl(protocol, host, pathAndQuery || '/')
}

const maskPhone = (phone?: string) => {
  if (!phone) return undefined
  return maskedPhonePattern.test(phone) ? phone.replace(maskedPhonePattern, '$1****$2') : phone
}

export const sanitizeWebViewUserInfo = (
  userInfo?: Record<string, unknown> | WebViewInitUserInfo | null,
): WebViewInitUserInfo | undefined => {
  if (!userInfo) return undefined

  const sanitized = {
    avatar: typeof userInfo.avatar === 'string' ? userInfo.avatar : undefined,
    name: typeof userInfo.name === 'string' ? userInfo.name : undefined,
    nickname: typeof userInfo.nickname === 'string' ? userInfo.nickname : undefined,
    orgName: typeof userInfo.orgName === 'string' ? userInfo.orgName : undefined,
    phone: maskPhone(typeof userInfo.phone === 'string' ? userInfo.phone : undefined),
    roleName: typeof userInfo.roleName === 'string' ? userInfo.roleName : undefined,
  }

  return Object.fromEntries(
    Object.entries(sanitized).filter(([, value]) => value !== undefined),
  ) as WebViewInitUserInfo
}

export const buildWebViewInitContext = (options: BuildWebViewInitContextOptions) => {
  const canReadToken = options.bridgeMethods.includes('getToken')
  const canReadUserInfo = options.bridgeMethods.includes('getUserInfo')

  return {
    env: {
      bridgeVersion: String(WEBVIEW_BRIDGE_VERSION),
      isLogin: options.isLogin,
      platform: options.platform,
      route: options.route,
    },
    token: canReadToken ? options.token : undefined,
    userInfo: canReadUserInfo ? sanitizeWebViewUserInfo(options.userInfo ?? undefined) : undefined,
  }
}

export const buildWebViewInitQueryValue = (options: BuildWebViewInitContextOptions) => {
  return JSON.stringify({
    bridgeMethods: options.bridgeMethods,
    bridgeSource: WEBVIEW_BRIDGE_SOURCE,
    bridgeVersion: WEBVIEW_BRIDGE_VERSION,
    env: buildWebViewInitContext(options).env,
  })
}

export const buildWebViewPageParams = (options: OpenWebViewOptions) => {
  const params: Record<string, string> = {
    url: encodeURIComponent(options.url),
  }

  if (options.title) {
    params.title = encodeURIComponent(options.title)
  }

  return params
}

export const buildWebViewPageUrl = (options: OpenWebViewOptions) => {
  const params = Object.entries(buildWebViewPageParams(options))
    .map(([key, value]) => `${key}=${value}`)

  return `${WEBVIEW_PAGE_PATH}?${params.join('&')}`
}

export const buildWebViewPageRoute = (options: OpenWebViewOptions): WebViewRouteLocation => {
  return {
    name: 'webview',
    params: buildWebViewPageParams(options),
  }
}

const decodeRouteValue = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export const parseWebViewRouteQuery = (query?: Record<string, unknown> | null): ParseWebViewRouteQueryResult | null => {
  if (!query) return null

  const rawUrl = typeof query.url === 'string' ? decodeRouteValue(query.url) : ''
  const rawTitle = typeof query.title === 'string' ? decodeRouteValue(query.title) : ''

  if (!rawUrl) return null

  return {
    title: rawTitle || undefined,
    url: rawUrl,
  }
}

export const buildWebViewRuntimeUrl = (url: NormalizedWebViewUrl, initQueryValue: string) => {
  const separator = url.search ? '&' : '?'

  return `${url.toString()}${separator}${WEBVIEW_INIT_QUERY_KEY}=${encodeURIComponent(initQueryValue)}`
}

export const normalizeWebViewBridgePayload = (payload: unknown): NormalizePayloadResult => {
  if (typeof payload !== 'object' || payload === null) {
    return {
      error: {
        code: 'INVALID_PAYLOAD',
        message: 'Bridge payload must be an object.',
      },
      ok: false,
    }
  }

  const record = payload as Record<string, unknown>
  const id = typeof record.id === 'string' ? record.id.trim() : ''
  const method = typeof record.method === 'string' ? record.method : ''
  const source = typeof record.source === 'string' ? record.source : ''
  const version = typeof record.version === 'number' ? record.version : Number.NaN
  const params = typeof record.params === 'object' && record.params !== null ? record.params as Record<string, unknown> : {}

  if (!id || !isAllowedMethod(method) || source !== WEBVIEW_BRIDGE_SOURCE || version !== WEBVIEW_BRIDGE_VERSION) {
    return {
      error: {
        code: 'INVALID_PAYLOAD',
        message: 'Bridge payload is invalid.',
      },
      ok: false,
    }
  }

  return {
    ok: true,
    value: {
      id,
      method,
      params,
      source,
      version,
    },
  }
}

export const resolveWebViewAccess = (input: string, options: ResolveWebViewAccessOptions): ResolveWebViewAccessResult => {
  const url = normalizeUrl(input)

  if (!url) {
    return {
      allowed: false,
      code: 'INVALID_URL',
    }
  }

  if (!isAllowedProtocol(url.protocol, options.isDev)) {
    return {
      allowed: false,
      code: 'UNSUPPORTED_PROTOCOL',
      url,
    }
  }

  const rule = findMatchingRule(url, options.rules)

  if (!rule) {
    return {
      allowed: false,
      code: 'URL_NOT_ALLOWED',
      url,
    }
  }

  if (rule.requiresAuth && !options.isLoggedIn) {
    return {
      allowed: false,
      code: 'AUTH_REQUIRED',
      rule,
      url,
    }
  }

  return {
    allowed: true,
    rule,
    url,
  }
}

interface BridgeResponse {
  data?: Record<string, unknown>
  error?: {
    code: string
    message: string
  }
  id: string
  source: string
  success: boolean
  version: number
}

interface BridgeRuntimeError {
  code: string
  message: string
}

const tabbarPaths = ['/pages/index/index', '/pages/my/index']
const iframeAllow = 'clipboard-read; clipboard-write; fullscreen; geolocation'
const iframeSandbox = 'allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts'

const createBridgeError = (code: string, message: string): BridgeRuntimeError => ({
  code,
  message,
})

const createBridgeResponse = (id: string, success: boolean, data?: Record<string, unknown>, error?: BridgeRuntimeError): BridgeResponse => ({
  data,
  error,
  id,
  source: WEBVIEW_BRIDGE_SOURCE,
  success,
  version: WEBVIEW_BRIDGE_VERSION,
})

const getRuntimePlatform = () => {
  try {
    return uni.getSystemInfoSync().uniPlatform || 'unknown'
  } catch {
    return 'unknown'
  }
}

const isTabbarPath = (path: string) => {
  return tabbarPaths.includes(path.split('?')[0])
}

const extractWebViewMessagePayload = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.at(-1)
  }

  return value
}

export const useWebView = () => {
  const userStore = useUserStore()
  const route = useRoute()

  const pageTitle = shallowRef('网页容器')
  const pageUrl = shallowRef('')
  const pageReady = shallowRef(false)
  const pageLoaded = shallowRef(false)
  const errorTitle = shallowRef('')
  const errorMessage = shallowRef('')
  const activeRule = shallowRef<WebViewAccessRule | null>(null)
  const activeUrl = shallowRef<NormalizedWebViewUrl | null>(null)
  const redirectedToLogin = shallowRef(false)

  const hasError = computed(() => Boolean(errorTitle.value))
  const isH5 = computed(() => getRuntimePlatform() === 'h5')
  const bridgeEnv = computed(() => {
    const bridgeMethods = activeRule.value?.bridgeMethods || []

    return {
      bridgeSource: WEBVIEW_BRIDGE_SOURCE,
      bridgeVersion: String(WEBVIEW_BRIDGE_VERSION),
      isLogin: userStore.isLogin,
      platform: getRuntimePlatform(),
      responseMode: isH5.value ? 'window-post-message' : 'post-message-only',
      route: WEBVIEW_PAGE_PATH,
      supportedMethods: bridgeMethods,
    }
  })

  const setPageError = (title: string, message: string) => {
    pageReady.value = false
    pageLoaded.value = false
    errorTitle.value = title
    errorMessage.value = message
  }

  const clearPageError = () => {
    errorTitle.value = ''
    errorMessage.value = ''
  }

  const buildProtectedRedirect = () => {
    const currentQuery = parseWebViewRouteQuery(route.query as Record<string, unknown>)

    if (!currentQuery) return ''

    return buildWebViewPageUrl(currentQuery)
  }

  const applyAccess = () => {
    const parsedQuery = parseWebViewRouteQuery(route.query as Record<string, unknown>)

    if (!parsedQuery) {
      setPageError('链接参数缺失', '请通过统一的 WebView 打开方法进入该页面。')
      return
    }

    const resolved = resolveWebViewAccess(parsedQuery.url, {
      isDev: import.meta.env.DEV,
      isLoggedIn: userStore.isLogin,
      rules: DEFAULT_WEBVIEW_ACCESS_RULES,
    })

    if (!resolved.allowed) {
      if (resolved.code === 'AUTH_REQUIRED') {
        const redirect = buildProtectedRedirect()

        if (!redirect || redirectedToLogin.value) {
          setPageError('需要登录', '当前页面要求登录后访问，请先完成登录。')
          return
        }

        redirectedToLogin.value = true
        uni.redirectTo({
          url: `/pages/login/index?redirect=${encodeURIComponent(redirect)}`,
        })
        return
      }

      const errorMap: Record<string, { message: string, title: string }> = {
        INVALID_URL: {
          message: '目标链接格式不正确，无法打开。',
          title: '链接无效',
        },
        UNSUPPORTED_PROTOCOL: {
          message: '仅支持 https 链接；开发环境下可放行本地 http 地址。',
          title: '协议不受支持',
        },
        URL_NOT_ALLOWED: {
          message: '当前链接未命中白名单规则，请先在配置中登记可访问域名和路径。',
          title: '链接不可访问',
        },
      }

      const nextError = errorMap[resolved.code || 'INVALID_URL']

      setPageError(nextError.title, nextError.message)
      return
    }

    redirectedToLogin.value = false
    clearPageError()

    const matchedRule = resolved.rule || null
    const resolvedUrl = resolved.url || null
    const nextTitle = parsedQuery.title?.trim() || matchedRule?.title?.trim() || resolvedUrl?.hostname || '网页容器'
    const initQueryValue = buildWebViewInitQueryValue({
      bridgeMethods: matchedRule?.bridgeMethods || [],
      isLogin: userStore.isLogin,
      platform: getRuntimePlatform(),
      route: WEBVIEW_PAGE_PATH,
    })

    activeRule.value = matchedRule
    activeUrl.value = resolvedUrl
    pageTitle.value = nextTitle
    pageUrl.value = resolvedUrl ? buildWebViewRuntimeUrl(resolvedUrl, initQueryValue) : ''
    pageReady.value = true
    pageLoaded.value = false
  }

  const buildBridgeContext = () => {
    return buildWebViewInitContext({
      bridgeMethods: activeRule.value?.bridgeMethods || [],
      isLogin: userStore.isLogin,
      platform: getRuntimePlatform(),
      route: WEBVIEW_PAGE_PATH,
      token: userStore.token,
      userInfo: userStore.userInfo as WebViewInitUserInfo | null,
    })
  }

  const ensureMethodAllowed = (method: WebViewBridgeMethod) => {
    const bridgeMethods = activeRule.value?.bridgeMethods || []

    if (!bridgeMethods.includes(method)) {
      throw createBridgeError('METHOD_NOT_ALLOWED', `当前链接未开放 ${method} 能力。`)
    }
  }

  const close = () => {
    uni.navigateBack({
      fail: () => {
        uni.switchTab({ url: '/pages/index/index' })
      },
    })
  }

  const navigate = (params: Record<string, unknown>) => {
    const rawUrl = typeof params.url === 'string' ? params.url.trim() : ''
    const nextTitle = typeof params.title === 'string' ? params.title.trim() : undefined

    if (!rawUrl) {
      throw createBridgeError('INVALID_PARAMS', 'navigate 缺少有效的 url 参数。')
    }

    if (rawUrl.startsWith('/pages/') || rawUrl.startsWith('/pages-business/')) {
      if (isTabbarPath(rawUrl)) {
        uni.switchTab({ url: rawUrl as '/pages/index/index' | '/pages/my/index' })
      } else {
        uni.navigateTo({ url: rawUrl })
      }

      return {
        internal: true,
        url: rawUrl,
      }
    }

    const resolved = resolveWebViewAccess(rawUrl, {
      isDev: import.meta.env.DEV,
      isLoggedIn: userStore.isLogin,
      rules: DEFAULT_WEBVIEW_ACCESS_RULES,
    })

    if (!resolved.allowed || !resolved.url) {
      throw createBridgeError('NAVIGATION_BLOCKED', '目标链接未通过白名单校验。')
    }

    uni.navigateTo({
      url: buildWebViewPageUrl({
        title: nextTitle,
        url: resolved.url.toString(),
      }),
    })

    return {
      internal: false,
      url: resolved.url.toString(),
    }
  }

  const share = () => {
    uni.showToast({
      icon: 'none',
      title: '请使用系统或右上角分享能力',
    })

    return {
      supported: false,
    }
  }

  const executeBridgeMethod = async (payload: WebViewBridgePayload) => {
    ensureMethodAllowed(payload.method)

    switch (payload.method) {
      case 'setTitle': {
        const nextTitle = typeof payload.params.title === 'string' ? payload.params.title.trim() : ''

        if (!nextTitle) {
          throw createBridgeError('INVALID_PARAMS', 'setTitle 缺少有效的 title 参数。')
        }

        pageTitle.value = nextTitle

        return {
          title: nextTitle,
        }
      }

      case 'close':
        close()
        return {
          closed: true,
        }

      case 'navigate':
        return navigate(payload.params)

      case 'share':
        return share()

      case 'getToken':
        if (!userStore.isLogin || !userStore.token) {
          throw createBridgeError('UNAUTHORIZED', '当前未登录，无法提供 token。')
        }

        return {
          token: userStore.token,
        }

      case 'getUserInfo': {
        if (!userStore.isLogin || !userStore.userInfo) {
          throw createBridgeError('UNAUTHORIZED', '当前未登录，无法提供用户信息。')
        }

        return {
          userInfo: buildBridgeContext().userInfo,
        }
      }

      case 'getEnv':
        return {
          env: bridgeEnv.value,
        }

      default:
        throw createBridgeError('METHOD_NOT_ALLOWED', '当前方法未实现。')
    }
  }

  const dispatchBridgePayload = async (
    payload: unknown,
    respond?: (response: BridgeResponse) => void,
  ) => {
    const normalized = normalizeWebViewBridgePayload(payload)

    if (!normalized.ok || !normalized.value) {
      if (respond) {
        respond(createBridgeResponse('invalid', false, undefined, normalized.error || createBridgeError('INVALID_PAYLOAD', 'Bridge payload is invalid.')))
      }
      return
    }

    try {
      const data = await executeBridgeMethod(normalized.value)

      if (respond) {
        respond(createBridgeResponse(normalized.value.id, true, data))
      }
    } catch (error) {
      const bridgeError = typeof error === 'object' && error && 'code' in error && 'message' in error
        ? error as BridgeRuntimeError
        : createBridgeError('EXECUTION_FAILED', error instanceof Error ? error.message : '桥接调用失败。')

      if (respond) {
        respond(createBridgeResponse(normalized.value.id, false, undefined, bridgeError))
      }
    }
  }

  const handleH5Message = async (event: MessageEvent) => {
    if (!activeUrl.value || event.origin !== activeUrl.value.origin) return

    await dispatchBridgePayload(event.data, (response) => {
      const targetWindow = event.source as WindowProxy | null

      targetWindow?.postMessage(response, event.origin)
    })
  }

  const handleWebViewMessage = async (event: { detail?: { data?: unknown } }) => {
    const payload = extractWebViewMessagePayload(event.detail?.data)

    await dispatchBridgePayload(payload)
  }

  const handleFrameLoad = () => {
    pageLoaded.value = true
  }

  const handleFrameError = () => {
    setPageError('页面加载失败', '目标网页暂时无法访问，请稍后重试。')
  }

  const retry = () => {
    applyAccess()
  }

  watch(
    [
      () => route.query?.url,
      () => route.query?.title,
      () => userStore.isLogin,
    ],
    applyAccess,
    {
      immediate: true,
    },
  )

  onMounted(() => {
    if (!isH5.value) return
    window.addEventListener('message', handleH5Message)
  })

  onBeforeUnmount(() => {
    if (!isH5.value) return
    window.removeEventListener('message', handleH5Message)
  })

  return {
    bridgeEnv,
    errorMessage,
    errorTitle,
    handleFrameError,
    handleFrameLoad,
    handleWebViewMessage,
    hasError,
    iframeAllow,
    iframeSandbox,
    isH5,
    pageLoaded,
    pageReady,
    pageTitle,
    pageUrl,
    retry,
  }
}
