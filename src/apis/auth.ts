import type { MockAuthSession, PhoneAuthPayload, RefreshTokenResult } from '@/types/user'
import { http } from '@/utils/http'

export function refreshTokenApi(refreshToken: string) {
  const method = http.Post<RefreshTokenResult>('/auth/refresh', {
    refreshToken,
  }, {
    meta: { authRole: 'refresh' },
  })
  return method
}

export function loginApi(phone: string, verifyCode: string) {
  const method = http.Post('/auth/login', {
    phone,
    verifyCode,
  }, {
    meta: { authRole: 'login' },
  })
  return method
}

/**
 * 微信一键手机号授权登录。
 * payload 为 AuthPhone 组件回调出来的凭证，透传给服务端换取 session。
 */
export function loginByPhoneAuthApi(payload: PhoneAuthPayload) {
  const method = http.Post<MockAuthSession>('/auth/login/phone', payload, {
    meta: { authRole: 'login' },
  })
  return method
}

export function logoutApi() {
  return http.Post('/auth/logout')
}
