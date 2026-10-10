import type { MockAuthSession, MockVerifyCodeResult, PhoneAuthPayload } from '@/types/user'

export type { MockAuthSession, MockUserInfo, MockVerifyCodeResult } from '@/types/user'

const MOCK_VERIFY_CODE = '123456'
const MOCK_DELAY = 400

const basePermissions = [
  'profile:view',
  'demo:view',
  'webview:view',
  'settings:view',
  'agreement:view',
  'about:view',
  'cache:clear',
]

function wait<T>(data: T, delay = MOCK_DELAY) {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

function assertPhone(phone: string) {
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    throw new Error('请输入正确的手机号')
  }
}

function createToken(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function createPhoneUser(phone: string): MockAuthSession {
  const suffix = phone.slice(-4)

  return {
    token: createToken('mock_phone_token'),
    refreshToken: createToken('mock_phone_refresh'),
    roles: ['member'],
    permissions: [...basePermissions],
    userInfo: {
      id: `mock-user-${suffix}`,
      name: `用户${suffix}`,
      nickname: `用户${suffix}`,
      phone,
      avatar: '/static/images/logo.svg',
      roleName: '普通用户',
      orgName: 'Mock 体验组织',
    },
  }
}

export async function mockSendVerifyCode(phone: string): Promise<MockVerifyCodeResult> {
  assertPhone(phone)

  return wait({
    verifyCode: MOCK_VERIFY_CODE,
    expiresIn: 300,
  })
}

export async function mockLoginByPhone(phone: string, verifyCode: string): Promise<MockAuthSession> {
  assertPhone(phone)

  if (verifyCode !== MOCK_VERIFY_CODE) {
    throw new Error(`验证码错误，模板验证码为 ${MOCK_VERIFY_CODE}`)
  }

  return wait(createPhoneUser(phone))
}

export async function mockLoginByWechat(): Promise<MockAuthSession> {
  return wait({
    token: createToken('mock_wechat_token'),
    refreshToken: createToken('mock_wechat_refresh'),
    roles: ['member', 'wechat_user'],
    permissions: [...basePermissions, 'wechat:profile'],
    userInfo: {
      id: 'mock-wechat-user',
      name: '微信用户',
      nickname: '微信用户',
      phone: '13800000000',
      avatar: '/static/images/logo.svg',
      roleName: '微信用户',
      orgName: 'Mock 体验组织',
      openid: 'mock-openid',
    },
  })
}

/**
 * 微信一键手机号授权登录。
 * 真实环境下 `code` 需由服务端调用 phonenumber.getPhoneNumber 换取手机号，
 * 模板里只校验凭证是否存在，然后返回一个固定的 mock 会话。
 */
export async function mockLoginByPhoneAuth(payload: PhoneAuthPayload): Promise<MockAuthSession> {
  if (!payload?.code && !payload?.encryptedData) {
    throw new Error('未获取到手机号授权凭证')
  }

  return wait({
    token: createToken('mock_phone_auth_token'),
    refreshToken: createToken('mock_phone_auth_refresh'),
    roles: ['member', 'phone_auth'],
    permissions: [...basePermissions, 'wechat:phone'],
    userInfo: {
      id: 'mock-phone-auth-user',
      name: '微信手机号用户',
      nickname: '微信手机号用户',
      phone: '13800000000',
      avatar: '/static/images/logo.svg',
      roleName: '普通用户',
      orgName: 'Mock 体验组织',
      openid: 'mock-phone-auth-openid',
    },
  })
}

export async function mockLogout() {
  return wait(true, 200)
}
