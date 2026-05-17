import type { RefreshTokenResult } from '@/types/user'
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

export function logoutApi() {
  return http.Post('/auth/logout')
}
