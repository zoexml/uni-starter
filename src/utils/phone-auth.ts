/**
 * 微信手机号授权事件解析。
 *
 * `button open-type="getPhoneNumber"` 的回调 detail 两端形态一致，但基础库版本不同：
 * 2.21.2+ 返回 `code`（推荐，服务端用 code 换手机号），更早版本只给 `encryptedData` + `iv`
 * （需服务端配合 session_key 解密）。
 *
 * 解析逻辑由 `AuthPhone` 组件与登录页共用，抽在这里避免两处各写一份。
 */
import type { PhoneAuthFailPayload, PhoneAuthPayload } from '@/types/user'

export interface PhoneAuthEventDetail {
  errMsg?: string
  code?: string
  encryptedData?: string
  iv?: string
}

export type PhoneAuthEventResult =
  | { ok: true, payload: PhoneAuthPayload }
  | { ok: false, fail: PhoneAuthFailPayload }

/**
 * 解析授权回调：用户取消、凭证缺失都归到 fail，调用方只需处理两个分支。
 *
 * 「用户主动取消」与「其它失败」必须区分开：前者各调用方都静默处理（不打扰用户），
 * 后者要把原始 errMsg 透出来，否则工具不支持 / 无资质 / 额度用尽这类问题
 * 会被当成取消吞掉，表现就是"点了没反应"。
 */
export function parsePhoneAuthEvent(detail?: PhoneAuthEventDetail): PhoneAuthEventResult {
  const errMsg = detail?.errMsg ?? ''

  if (/cancel|deny/i.test(errMsg)) {
    return { ok: false, fail: { reason: 'deny', message: '您已取消手机号授权' } }
  }

  if (!errMsg.includes(':ok')) {
    return { ok: false, fail: { reason: 'error', message: errMsg || '手机号授权失败' } }
  }

  const payload: PhoneAuthPayload = detail?.code
    ? { code: detail.code }
    : { encryptedData: detail?.encryptedData, iv: detail?.iv }

  if (!payload.code && !payload.encryptedData) {
    return { ok: false, fail: { reason: 'invalid', message: '未获取到手机号授权凭证' } }
  }

  return { ok: true, payload }
}
