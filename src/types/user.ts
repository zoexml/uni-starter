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
