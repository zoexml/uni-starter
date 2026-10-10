import type { uniappRequestAdapter } from '@alova/adapter-uniapp'
import type { Method } from 'alova'
import type { IResponse } from '@/types/index'
import AdapterUniapp from '@alova/adapter-uniapp'
import { createAlova } from 'alova'
import { createServerTokenAuthentication } from 'alova/client'
import VueHook from 'alova/vue'
import { createMockAdapter, isMockMode } from '@/mocks/adapter'
import { useUserStore } from '@/stores'
import { ResultEnum, ShowMessage } from '../common/enum'
import { beginLoading, endLoading, forceCloseLoading } from './loading'
import type { RequestLoadingOptions } from './loading'

const LOGIN_PAGE = '/pages/main/login/index'
const REQUEST_TIMEOUT = 5000

type AuthMode = 'single' | 'double'
interface HttpRequestMeta {
  toast?: boolean
  /**
   * 是否显示全局 loading。并发请求引用计数只显示一次，耗时小于 delay 的请求不显示：
   * - `true`：默认文案与阈值
   * - `string`：自定义文案
   * - 对象：可配置 `title` / `delay` / `mask`
   *
   * 缺省不显示。列表、首屏这类已有骨架屏或组件内 loading 的场景不要开，
   * 提交类请求建议写成 `meta: { loading: '提交中...' }`。
   */
  loading?: boolean | string | RequestLoadingOptions
}

const authMode = (import.meta.env.VITE_AUTH_MODE ?? 'single') as AuthMode

const refreshAlova = createAlova({
  baseURL: import.meta.env.VITE_SERVER_BASEURL,
  timeout: REQUEST_TIMEOUT,
  // 未配置后端地址时由 mock 适配器接管，页面里可以写真实请求代码；
  // 配置 VITE_SERVER_BASEURL 后自动切回真实网络请求
  ...(isMockMode() ? { requestAdapter: createMockAdapter() } : AdapterUniapp()),
  statesHook: VueHook,
})

const callRefreshApi = (refreshToken: string) => {
  return refreshAlova.Post<IResponse<{ token: string, refreshToken: string }>>('/auth/refresh', {
    refreshToken,
  }, {
    meta: { authRole: 'refresh' },
  }).send()
}

const updateTokenPair = (token: string, refreshToken?: string) => {
  const store = useUserStore()

  store.setToken(token)
  if (refreshToken) {
    store.setRefreshToken(refreshToken)
  }
}

const redirectToLogin = async () => {
  const store = useUserStore()

  store.logout()
  // 跳登录页后当前请求的 loading 不会再有人关闭，这里兜底清理，避免遮罩带进登录页
  forceCloseLoading()
  await uni.reLaunch({ url: LOGIN_PAGE })
}

const tryRefreshToken = async () => {
  const store = useUserStore()

  if (authMode !== 'double' || !store.refreshToken) {
    return false
  }

  try {
    const { data } = await callRefreshApi(store.refreshToken)
    if (!data?.token) {
      return false
    }

    updateTokenPair(data.token, data.refreshToken)
    return true
  } catch {
    return false
  }
}

const handleExpiredToken = async () => {
  const refreshed = await tryRefreshToken()
  if (refreshed) {
    return
  }

  await redirectToLogin()
  throw new Error('Token expired')
}

const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication<
  typeof VueHook,
  typeof uniappRequestAdapter
>({
  visitorMeta: { authRole: 'login' },

  assignToken(method) {
    const store = useUserStore()
    if (store.token) {
      method.config.headers = {
        ...method.config.headers,
        Authorization: `Bearer ${store.token}`,
      }
    }
  },

  refreshTokenOnSuccess: {
    isExpired(response) {
      return (response as UniNamespace.RequestSuccessCallbackResult).statusCode === ResultEnum.Unauthorized
    },

    async handler() {
      await handleExpiredToken()
    },
  },
})

type UniappResponse = | UniNamespace.RequestSuccessCallbackResult | UniNamespace.UploadFileSuccessCallbackResult | UniNamespace.DownloadSuccessData

const normalizeRequestError = (error: unknown) => {
  if (error instanceof Error) return error

  return new Error(typeof error === 'string' ? error : '网络请求失败')
}

const getRequestMeta = (method: Method) => {
  return (method.meta ?? method.config.meta ?? {}) as HttpRequestMeta
}

const shouldShowToast = (method: Method) => {
  return getRequestMeta(method).toast !== false
}

/**
 * 归一化 `meta.loading`：返回 undefined 表示该请求不接管全局 loading。
 * 请求前后各调用一次，保证 begin / end 精确配对（不依赖 method 实例引用）。
 */
const resolveLoadingOptions = (method: Method): RequestLoadingOptions | undefined => {
  const { loading } = getRequestMeta(method)

  if (!loading) return undefined
  if (loading === true) return {}
  if (typeof loading === 'string') return { title: loading }

  return loading
}

/** 请求结束时释放 loading；与 resolveLoadingOptions 判断一致，未开启的请求不会误减计数 */
const releaseRequestLoading = (method: Method) => {
  if (resolveLoadingOptions(method)) {
    endLoading()
  }
}

const showRequestToast = (title: string) => {
  uni.showToast({ title, icon: 'none' })
}

const isUploadOrDownloadRequest = (method: Method) => {
  return ['upload', 'download'].includes(method.config.requestType)
}

const isSuccessfulStatusCode = (statusCode: number) => {
  return statusCode >= 200 && statusCode < 300
}

const normalizeResponseErrorMessage = (errMsg?: string) => {
  return errMsg || '请求失败'
}

const normalizeBusinessCode = (code: IResponse<unknown>['code']) => {
  return Number(code)
}

const handleHttpStatusError = async (method: Method, statusCode: number, errMsg: string) => {
  const errorMessage = ShowMessage(statusCode) || `HTTP请求错误[${statusCode}]`
  console.error('errorMessage===>', errorMessage)
  if (shouldShowToast(method)) {
    showRequestToast(errorMessage)
  }

  return Promise.reject(new Error(`${errorMessage}：${errMsg}`))
}

const handleBusinessError = (method: Method, code: number, message: string) => {
  if (shouldShowToast(method)) {
    showRequestToast(message)
  }

  return Promise.reject(new Error(`请求错误[${code}]：${message}`))
}

const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_SERVER_BASEURL,
  shareRequest: true,
  timeout: REQUEST_TIMEOUT,
  ...AdapterUniapp(),
  statesHook: VueHook,

  beforeRequest: onAuthRequired((method) => {
    // 全局 loading：按 meta.loading 开启，无该字段的请求不接管
    const loadingOptions = resolveLoadingOptions(method)
    if (loadingOptions) {
      beginLoading(loadingOptions)
    }
  }),

  responded: onResponseRefreshToken({
    onSuccess: async <T>(response: UniappResponse, method: Method) => {
      // 先释放 loading 再处理业务，避免后续 toast 被 hideLoading 一起关掉
      releaseRequestLoading(method)

      if (isUploadOrDownloadRequest(method)) return response

      const { data: rawData, statusCode, errMsg } = response as UniNamespace.RequestSuccessCallbackResult

      if (!isSuccessfulStatusCode(statusCode)) {
        return handleHttpStatusError(method, statusCode, normalizeResponseErrorMessage(errMsg))
      }

      // 处理业务逻辑错误
      const { code, message, data } = rawData as IResponse<T>
      const businessCode = normalizeBusinessCode(code)
      if (businessCode !== ResultEnum.Success) {
        return handleBusinessError(method, businessCode, message)
      }

      // 处理成功响应，返回业务数据
      return data as T
    },

    // 请求失败的拦截器
    // 第二个参数为当前请求的method实
    onError: async (err, method) => {
      releaseRequestLoading(method)
      console.log('🚀 ~ err:', err, method)

      if (shouldShowToast(method)) {
        showRequestToast('网络异常，请检查连接后重试')
      }

      throw normalizeRequestError(err)
    },
  }),
})

export const http = alovaInstance
