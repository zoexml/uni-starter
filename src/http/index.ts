import type { Method } from 'alova'
// import type { uniappRequestAdapter } from '@alova/adapter-uniapp'
import type { IResponse } from './types'
import { useUserStore } from '@/stores'
import AdapterUniapp from '@alova/adapter-uniapp'
import { createAlova } from 'alova'
// import { createServerTokenAuthentication } from 'alova/client'
import VueHook from 'alova/vue'
import { ResultEnum, ShowMessage } from './enum'

// 接口白名单(无需携带token)
// eslint-disable-next-line unused-imports/no-unused-vars
const whiteList = ['/login']

// 配置动态Tag
export const API_DOMAINS = {
  DEFAULT: import.meta.env.VITE_SERVER_BASEURL,
  SECONDARY: import.meta.env.VITE_API_SECONDARY_URL,
}

// const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication<
//   typeof VueHook,
//   typeof uniappRequestAdapter
// >({
//   refreshTokenOnError: {
//     isExpired: (error) => {
//       return error.response?.status === ResultEnum.Unauthorized
//     },
//     handler: async () => {
//       try {
//         // await authLogin();
//       } catch (error) {
//         // 切换到登录页
//         await uni.reLaunch({ url: LOGIN_PAGE })
//         throw error
//       }
//     },
//   },
// })

type UniappResponse = UniNamespace.RequestSuccessCallbackResult | UniNamespace.UploadFileSuccessCallbackResult | UniNamespace.DownloadSuccessData
/**
 * alova 请求实例
 */
const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_SERVER_BASEURL,
  timeout: 5000,
  ...AdapterUniapp(),
  statesHook: VueHook,

  // 拦截器配置
  // eslint-disable-next-line unused-imports/no-unused-vars
  async beforeRequest({ config, url, meta }) {
    // console.log('🚀 ~ beforeRequest ~ config, url, meta:', config, url, meta)

    // eslint-disable-next-line unused-imports/no-unused-vars
    const store = useUserStore()
    // 判断是否有 token，且不是白名单中的接口
    // const token = userStore?.userInfo?.Token

    // if (store.token && whiteList.includes(config.url!) === false) {
    // 在请求头中添加 token
    //   config.header = {
    //     ...config.header,
    //     Authorization: `Bearer ${store.token}`,
    //   }
    // }
  },

  responded: {
    // 请求成功的拦截器
    // 第二个参数为当前请求的method实例
    onSuccess: async <T>(response: UniappResponse, method: Method) => {
      const { config } = method
      const { data: rawData, statusCode, errMsg } = response as UniNamespace.RequestSuccessCallbackResult

      // 处理特殊请求类型（上传/下载）
      if (['upload', 'download'].includes(config.requestType)) return response

      // 处理 HTTP 状态码错误
      if (!(statusCode >= 200 && statusCode < 300)) {
        const errorMessage = ShowMessage(statusCode) || `HTTP请求错误[${statusCode}]`
        console.error('errorMessage===>', errorMessage)
        uni.showToast({ title: errorMessage, icon: 'error' })
        return Promise.reject(new Error(`${errorMessage}：${errMsg}`))
      }

      // 处理业务逻辑错误
      const { code, message, data } = rawData as IResponse<T>
      if (code !== ResultEnum.Success) {
        if (config.meta?.toast !== false) {
          uni.showToast({ title: message, icon: 'none' })
        }
        return Promise.reject(new Error(`请求错误[${code}]：${message}`))
      }

      // 处理成功响应，返回业务数据
      return data as T
    },

    // 请求失败的拦截器
    // 第二个参数为当前请求的method实
    onError: (err, method) => {
      console.log('🚀 ~ err:', err, method)
      uni.showToast({
        icon: 'none',
        title: '网络错误，换个网络试试',
      })

      throw new Error(err)
    },

    // 请求完成的拦截器
    // 当你需要在请求不论是成功、失败、还是命中缓存都需要执行的逻辑时，可以在创建alova实例时指定全局的`onComplete`拦截器，例如关闭请求 loading 状态。
    onComplete: async (_method) => {
      // 处理请求完成逻辑
    },
  },
})

export const http = alovaInstance
