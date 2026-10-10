/**
 * 微信一键手机号授权登录。
 *
 * 只负责「拿到凭证之后的事」：换 session → 写入 user store → 埋点 → 回跳。
 * 授权弹窗的 UI 与微信侧取凭证由 `AuthPhone` 组件负责。
 *
 * 默认走模板 mock，对接真实后端时传入 apis/auth 的 loginByPhoneAuthApi 即可：
 * `usePhoneAuth({ login: loginByPhoneAuthApi })`
 */
import type { MockAuthSession, PhoneAuthFailPayload, PhoneAuthPayload } from '@/types/user'
import { mockLoginByPhoneAuth } from '@/mocks/auth'
import { useUserStore } from '@/stores'
import { useLoginRedirect } from './useLoginRedirect'
import { useTracker } from './useTracker'

interface UsePhoneAuthOptions {
  /** 登录成功后是否自动回跳。组件示例页等只观察状态的场景可置 false */
  autoRedirect?: boolean
  /** 登录实现，默认 mock；换成真实接口即可切到后端 */
  login?: (payload: PhoneAuthPayload) => Promise<MockAuthSession>
  /** 登录成功后的回跳页，缺省沿用路由守卫写入的 redirect */
  fallbackPath?: string
}

export const usePhoneAuth = (options: UsePhoneAuthOptions = {}) => {
  const { autoRedirect = true, login = mockLoginByPhoneAuth, fallbackPath } = options

  const userStore = useUserStore()
  const { track } = useTracker()
  const { goAfterLogin } = useLoginRedirect()

  const visible = shallowRef(false)
  const loading = shallowRef(false)

  const open = () => {
    visible.value = true
  }

  const close = () => {
    visible.value = false
  }

  const handleSuccess = async (payload: PhoneAuthPayload) => {
    if (loading.value) return false

    loading.value = true
    try {
      const session = await login(payload)
      userStore.setLoginSession(session)
      track('user_login', { method: 'phone_auth' })
      close()
      uni.showToast({ title: '登录成功', icon: 'success' })
      if (autoRedirect) goAfterLogin(fallbackPath)
      return true
    } catch (error) {
      uni.showToast({
        title: error instanceof Error ? error.message : '手机号授权登录失败',
        icon: 'none',
      })
      return false
    } finally {
      loading.value = false
    }
  }

  const handleFail = (payload: PhoneAuthFailPayload) => {
    // 用户主动取消授权不打扰，其余情况给出原因
    if (payload.reason === 'deny') return
    uni.showToast({ title: payload.message, icon: 'none' })
  }

  return { visible, loading, open, close, handleSuccess, handleFail }
}
