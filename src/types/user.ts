export interface MockUserInfo {
  id: string
  name: string
  nickname: string
  phone: string
  avatar: string
  roleName: string
  orgName: string
  openid?: string
}

export interface MockAuthSession {
  token: string
  refreshToken: string
  userInfo: MockUserInfo
  roles: string[]
  permissions: string[]
}

export interface RefreshTokenResult {
  token: string
  refreshToken: string
}

export interface MockVerifyCodeResult {
  verifyCode: string
  expiresIn: number
}

/**
 * 微信手机号授权凭证。
 * 基础库 2.21.2 起回调返回 `code`（推荐，服务端用 code 换取手机号）；
 * 更早版本只返回 `encryptedData` + `iv`，需服务端配合 session_key 解密。
 */
export interface PhoneAuthPayload {
  code?: string
  encryptedData?: string
  iv?: string
}

export type PhoneAuthFailReason = 'deny' | 'unsupported' | 'invalid' | 'error'

export interface PhoneAuthFailPayload {
  reason: PhoneAuthFailReason
  message: string
}
