import { useUserStore } from '@/stores'
import AdapterUniapp from '@alova/adapter-uniapp'
import { createAlova } from 'alova'

// 请求基地址
export const baseURL = import.meta.env.VITE_SERVER_BASEURL
// 接口白名单(无需携带token)
// eslint-disable-next-line unused-imports/no-unused-vars
const whiteList = ['/login']

interface ApiResponse<T> {
  code: string
  message: string
  result: T
}

type UniappResponse = UniNamespace.RequestSuccessCallbackResult | UniNamespace.UploadFileSuccessCallbackResult | UniNamespace.DownloadSuccessData

export const http = createAlova({
  baseURL,
  timeout: 5000,
  ...AdapterUniapp(),

  // 拦截器配置
  // eslint-disable-next-line unused-imports/no-unused-vars
  async beforeRequest({ config, url, meta }) {
    // console.log('🚀 ~ beforeRequest ~ config, url, meta:', config, url, meta)

    // eslint-disable-next-line unused-imports/no-unused-vars
    const store = useUserStore()
    // 判断是否有 token，且不是白名单中的接口
    // const token = userStore?.userInfo?.Token

    // if (store.token && whiteList.includes(config.url!) === false) {
    //   // 在请求头中添加 token
    //   config.header = {
    //     ...config.header, // 展开运算符，保留请求头原本的参数
    //     Authorization: `Bearer ${store.token}`,
    //   }
    // }
  },

  responded: {
    // 请求成功的拦截器
    // 第二个参数为当前请求的method实例
    onSuccess: async <T>(response: UniappResponse) => {
      const { data, statusCode } = response as UniNamespace.RequestSuccessCallbackResult
      // console.log('🚀 ~ response:', response)
      const { code, message, result } = data as ApiResponse<T>
      if (statusCode >= 200 && statusCode < 300) {
        // ✅ 判断业务 code 是否为 '1'
        if (code === '1') {
          return result as T
        } else {
          uni.showToast({
            icon: 'none',
            title: message || '业务错误',
          })
          return Promise.reject(new Error(message || '业务错误'))
        }
      } else if (statusCode === 401) {
        return Promise.reject(new Error('Unauthorized'))
      } else {
        // 其他错误 -> 根据后端错误信息轻提示
        uni.showToast({
          icon: 'none',
          title: message || '请求错误',
        })

        return Promise.reject(new Error(message || 'Request failed'))
      }
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
