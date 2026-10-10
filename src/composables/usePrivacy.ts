/**
 * 微信小程序隐私授权（官方《小程序隐私协议开发指南》流程，基础库 2.32.3+）。
 *
 * 三条链路：
 * 1. **被动触发**：隐私接口 / 组件（如 `button open-type="getPhoneNumber"`）被调用
 *    → `wx.onNeedPrivacyAuthorization` → 全局 `PrivacyPopup` 弹出
 *    → 用户点「同意」（`button open-type="agreePrivacyAuthorization"`）
 *    → `resolve({ event: 'agree', buttonId })` → 原接口继续执行；
 * 2. **主动预检**：敏感操作前调用 `requirePrivacyAuthorize()`，未同意时同样走弹窗，
 *    同意后返回 true 再继续，避免「业务弹窗被隐私弹窗盖住」的两层弹窗；
 * 3. **状态查询**：`refreshPrivacyState()` 取 `needAuthorization` 与隐私协议名，
 *    供示例页展示与排查。
 *
 * 非微信端（H5 / App / 其他小程序）全部降级为「视为已授权」，
 * 打开隐私政策时回退到本地协议页，调用方不需要写平台判断。
 */

/** 隐私弹窗中「同意」按钮的 id，`resolve` 时需回传，基础库会校验该按钮是否被真实点击 */
export const PRIVACY_AGREE_BUTTON_ID = 'privacy-agree-btn'

/** 非微信端（或微信侧打开失败）的本地隐私政策页 */
const LOCAL_PRIVACY_PAGE = '/pages/business/agreement/detail?type=privacy'

type PrivacyAuthorizeEvent = { event: 'agree', buttonId: string } | { event: 'disagree' }

interface PrivacySettingResult {
  needAuthorization: boolean
  privacyContractName: string
}

/**
 * 基础库 2.32.3+ 的隐私接口。
 *
 * 当前 `miniprogram-api-typings` 把 `onNeedPrivacyAuthorization` 的回调声明成了
 * 单参数 `(res: GeneralCallbackResult) => void`，与官方文档不符（实际是 `(resolve, eventInfo)`），
 * 这里单独补一份类型，避免回调里的 resolve / eventInfo 失去类型。
 * 各接口均为可选，基础库过低时自然降级。
 */
interface WxPrivacyApi {
  getPrivacySetting?: (option: {
    success?: (res: PrivacySettingResult) => void
    fail?: () => void
    complete?: () => void
  }) => void
  onNeedPrivacyAuthorization?: (listener: (
    resolve: (event: PrivacyAuthorizeEvent) => void,
    eventInfo: { referrer?: string },
  ) => void) => void
  openPrivacyContract?: (option: { success?: () => void, fail?: () => void }) => void
  requirePrivacyAuthorize?: (option: { success?: () => void, fail?: () => void }) => void
}

const visible = shallowRef(false)
const needAuthorization = shallowRef(false)
const privacyContractName = shallowRef('')
/** 最近一次触发隐私授权事件的接口 / 组件名，用于弹窗文案与排查 */
const lastReferrer = shallowRef('')
let registered = false
let pendingResolve: ((event: PrivacyAuthorizeEvent) => void) | undefined

/**
 * 取微信隐私接口集合。
 *
 * 这里用「接口是否存在」做特性检测，而不是判断 `uniPlatform === 'mp-weixin'`：
 * 平台字符串一旦取值不符合预期（不同端/不同版本），整条隐私链路会静默失效 ——
 * 监听注册不上、弹窗不出现，而隐私接口又被平台拦下，表现就是「点了没反应」。
 * 其他端没有 `wx` 全局，自然返回 undefined，调用方按「无需授权」处理。
 */
const getWxPrivacyApi = (): WxPrivacyApi | undefined => {
  if (typeof wx === 'undefined') return undefined

  return wx as unknown as WxPrivacyApi
}

/** 当前平台是否具备隐私授权能力（供示例页展示与文案判断使用） */
const supported = computed(() => Boolean(getWxPrivacyApi()?.openPrivacyContract || getWxPrivacyApi()?.requirePrivacyAuthorize))

/**
 * 注册隐私授权事件监听。
 * 该接口是覆盖式注册（重复注册只有最后一次生效），因此全局只注册一次，
 * 弹窗由 `App.ku.vue` 中的 `PrivacyPopup` 统一渲染。
 */
const ensurePrivacyListener = () => {
  if (registered) return

  registered = true
  const { onNeedPrivacyAuthorization } = getWxPrivacyApi() ?? {}
  if (!onNeedPrivacyAuthorization) return

  onNeedPrivacyAuthorization((resolve, eventInfo) => {
    pendingResolve = resolve
    lastReferrer.value = eventInfo?.referrer || ''
    visible.value = true
  })
}

/** 关闭弹窗并清空本次触发上下文 */
const resetDialog = () => {
  visible.value = false
  lastReferrer.value = ''
}

/** 查询当前隐私授权状态与后台配置的协议名 */
const refreshPrivacyState = async () => {
  const { getPrivacySetting } = getWxPrivacyApi() ?? {}

  if (!getPrivacySetting) {
    needAuthorization.value = false
    return
  }

  await new Promise<void>((resolve) => {
    getPrivacySetting({
      success: (res) => {
        needAuthorization.value = Boolean(res.needAuthorization)
        if (res.privacyContractName) {
          privacyContractName.value = res.privacyContractName
        }
      },
      complete: () => resolve(),
      fail: () => resolve(),
    })
  })
}

/**
 * 用户点击「同意」。
 * 必须在 `<button open-type="agreePrivacyAuthorization">` 的
 * `bindagreeprivacyauthorization` 事件触发后再调用 resolve，否则基础库校验不通过。
 */
const agree = () => {
  const resolve = pendingResolve
  pendingResolve = undefined
  resetDialog()

  resolve?.({ event: 'agree', buttonId: PRIVACY_AGREE_BUTTON_ID })
  void refreshPrivacyState()
}

/** 用户拒绝（点遮罩、点「拒绝」按钮均走这里）：原隐私接口会失败并返回未授权错误 */
const disagree = () => {
  const resolve = pendingResolve
  pendingResolve = undefined
  resetDialog()

  resolve?.({ event: 'disagree' })
  void refreshPrivacyState()
}

/**
 * 主动预检：确保用户已同意隐私协议后再调用真正的隐私接口。
 * 返回 false 表示用户拒绝，调用方应中断后续操作。
 */
const requirePrivacyAuthorize = async (): Promise<boolean> => {
  ensurePrivacyListener()

  const { requirePrivacyAuthorize: authorize } = getWxPrivacyApi() ?? {}
  if (!authorize) return true

  await refreshPrivacyState()
  if (!needAuthorization.value) return true

  let authorized = false
  await new Promise<void>((resolve) => {
    authorize({
      success: () => {
        authorized = true
        resolve()
      },
      fail: () => {
        authorized = false
        resolve()
      },
    })
  })

  void refreshPrivacyState()
  return authorized
}

const openLocalPrivacyPage = () => {
  uni.navigateTo({ url: LOCAL_PRIVACY_PAGE })
}

/** 打开隐私政策：微信端打开后台配置的协议，其他平台回退到本地协议页 */
const openPrivacyContract = () => {
  const { openPrivacyContract: open } = getWxPrivacyApi() ?? {}

  if (!open) {
    openLocalPrivacyPage()
    return
  }

  open({ fail: () => openLocalPrivacyPage() })
}

/**
 * 手动唤起弹窗：用于非微信端预览 UI，或在自定义敏感操作前主动提示。
 * 微信端由 `onNeedPrivacyAuthorization` 触发，一般不需要手动调用。
 */
const showDialog = (referrer = '') => {
  lastReferrer.value = referrer
  visible.value = true
}

/** App 启动时调用：注册监听并同步一次授权状态 */
const initialize = () => {
  ensurePrivacyListener()
  void refreshPrivacyState()
}

export const usePrivacy = () => {
  ensurePrivacyListener()

  return {
    /** 弹窗是否显示 */
    visible: readonly(visible),
    /** 是否仍需用户授权 */
    needAuthorization: readonly(needAuthorization),
    /** 后台配置的隐私协议名，为空时用默认文案 */
    privacyContractName: readonly(privacyContractName),
    /** 最近一次触发隐私授权事件的接口 / 组件名 */
    lastReferrer: readonly(lastReferrer),
    /** 当前平台是否支持隐私授权流程 */
    supported,
    initialize,
    refreshPrivacyState,
    requirePrivacyAuthorize,
    openPrivacyContract,
    showDialog,
    agree,
    disagree,
  }
}
