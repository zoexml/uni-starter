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
  userInfo: MockUserInfo
  roles: string[]
  permissions: string[]
}

export interface MockVerifyCodeResult {
  verifyCode: string
  expiresIn: number
}

const MOCK_VERIFY_CODE = '123456'
const MOCK_DELAY = 400

const basePermissions = [
  'profile:view',
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

export async function mockLogout() {
  return wait(true, 200)
}
