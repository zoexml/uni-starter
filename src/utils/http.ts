import type { uniappRequestAdapter } from '@alova/adapter-uniapp'
import type { Method } from 'alova'
import type { IResponse } from '@/types/index'
import AdapterUniapp from '@alova/adapter-uniapp'
import { createAlova } from 'alova'
import { createServerTokenAuthentication } from 'alova/client'
import VueHook from 'alova/vue'
import { useUserStore } from '@/stores'
import { ResultEnum, ShowMessage } from '../common/enum'

const LOGIN_PAGE = '/pages/login/index'
const REQUEST_TIMEOUT = 5000

export const API_DOMAINS = {
  DEFAULT: import.meta.env.VITE_SERVER_BASEURL,
  SECONDARY: import.meta.env.VITE_API_SECONDARY_URL,
}

type AuthMode = 'single' | 'double'
interface HttpRequestMeta {
  toast?: boolean
}

const authMode = (import.meta.env.VITE_AUTH_MODE ?? 'single') as AuthMode

const refreshAlova = createAlova({
  baseURL: import.meta.env.VITE_SERVER_BASEURL,
  timeout: REQUEST_TIMEOUT,
  ...AdapterUniapp(),
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

const shouldShowToast = (method: Method) => {
  const meta = (method.meta ?? method.config.meta ?? {}) as HttpRequestMeta

  return meta.toast !== false
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

  beforeRequest: onAuthRequired((_method) => {
    // 自定义请求前逻辑（如需要可在此扩展）
  }),

  responded: onResponseRefreshToken({
    onSuccess: async <T>(response: UniappResponse, method: Method) => {
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
      console.log('🚀 ~ err:', err, method)

      if (shouldShowToast(method)) {
        showRequestToast('网络异常，请检查连接后重试')
      }

      throw normalizeRequestError(err)
    },
  }),
})

export const http = alovaInstance
