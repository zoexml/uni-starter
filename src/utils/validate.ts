/*
 * @Description: 表单校验工具函数
 */

import dayjs from 'dayjs'

// ============================================================
// 独立校验函数
// ============================================================

/** 中国大陆手机号（支持 13/14/15/16/17/18/19 号段） */
export function isMobile(value: string): boolean {
  return /^1[3-9]\d{9}$/.test(value)
}

/** 电子邮箱 */
export function isEmail(value: string): boolean {
  return /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i.test(value)
}

/** 中国大陆身份证（18 位，含末位 X） */
export function isIdCard(value: string): boolean {
  return /^[1-9]\d{5}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX]$/i.test(value)
}

/** URL 格式 */
export function isUrl(value: string): boolean {
  return /^(?:(?:https?|ftp):)?\/\/(?:\S+@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4])|(?:[a-z\u00A1-\uFFFF0-9]-*)*[a-z\u00A1-\uFFFF0-9](?:\.(?:[a-z\u00A1-\uFFFF0-9]-*)*[a-z\u00A1-\uFFFF0-9])*\.[a-z\u00A1-\uFFFF]{2,}.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)
}

/** 纯数字 */
export function isDigits(value: string): boolean {
  return /^\d+$/.test(value)
}

/** 十进制数字（含负数和小数） */
export function isNumber(value: string): boolean {
  return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)
}

/** 日期有效性（基于 dayjs 解析） */
export function isDate(value: string): boolean {
  return dayjs(value).isValid()
}

// ============================================================
// 声明式表单校验
// ============================================================

export type ValidationRule =
  | { required: true, message?: string }
  | { mobile: true, message?: string }
  | { email: true, message?: string }
  | { idCard: true, message?: string }
  | { url: true, message?: string }
  | { digits: true, message?: string }
  | { number: true, message?: string }
  | { date: true, message?: string }
  | { minlength: number, message?: string }
  | { maxLength: number, message?: string }
  | { rangeLength: [number, number], message?: string }
  | { min: number, message?: string }
  | { max: number, message?: string }
  | { range: [number, number], message?: string }
  | { pattern: RegExp, message?: string }
  | { equalTo: string, message?: string }

export type ValidationSchema = Record<string, ValidationRule[]>

export interface ValidationError {
  field: string
  message: string
  value: unknown
}

const DEFAULT_MESSAGES: Record<string, string> = {
  required: '这是必填项',
  mobile: '请输入正确的手机号码',
  email: '请输入有效的电子邮件地址',
  idCard: '请输入正确的身份证号码',
  url: '请输入有效的网址',
  digits: '只能输入数字',
  number: '请输入有效的数字',
  date: '请输入有效的日期',
  minlength: '最少输入 {0} 个字符',
  maxLength: '最多输入 {0} 个字符',
  rangeLength: '请输入 {0} 到 {1} 个字符',
  min: '请输入不小于 {0} 的数值',
  max: '请输入不大于 {0} 的数值',
  range: '请输入 {0} 到 {1} 之间的数值',
  pattern: '格式不正确',
  equalTo: '两次输入不一致',
}

function formatMessage(template: string, ...args: unknown[]): string {
  return template.replace(/\{(\d+)\}/g, (_, index) => String(args[Number(index)] ?? ''))
}

const RULE_RUNNERS: Record<string, (value: unknown, param: unknown, data?: Record<string, unknown>) => boolean> = {
  required: (value) => {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim().length > 0
    if (typeof value === 'number') return true
    if (Array.isArray(value)) return value.length > 0
    return !!value
  },
  mobile: value => typeof value === 'string' && isMobile(value),
  email: value => typeof value === 'string' && isEmail(value),
  idCard: value => typeof value === 'string' && isIdCard(value),
  url: value => typeof value === 'string' && isUrl(value),
  digits: value => typeof value === 'string' && isDigits(value),
  number: value => typeof value === 'string' && isNumber(value),
  date: value => typeof value === 'string' && isDate(value),
  minlength: (value, param) => typeof value === 'string' && value.length >= (param as number),
  maxLength: (value, param) => typeof value === 'string' && value.length <= (param as number),
  rangeLength: (value, param) => {
    if (typeof value !== 'string') return false
    const [min, max] = param as [number, number]
    return value.length >= min && value.length <= max
  },
  min: (value, param) => Number(value) >= (param as number),
  max: (value, param) => Number(value) <= (param as number),
  range: (value, param) => {
    const [min, max] = param as [number, number]
    const num = Number(value)
    return num >= min && num <= max
  },
  pattern: (value, param) => typeof value === 'string' && (param as RegExp).test(value),
  equalTo: (value: unknown, param: unknown, data?: Record<string, unknown>) => value === data?.[param as string],
}

function getRuleConfig(rule: ValidationRule): { name: string, param: unknown, message?: string } {
  const entries = Object.entries(rule)
  const [name, rawParam] = entries[0]

  if (name === 'message') {
    return { name: '', param: undefined }
  }

  return {
    name,
    param: typeof rawParam === 'object' && 'message' in (rawParam || {})
      ? undefined
      : name === 'required' || name === 'mobile' || name === 'email' || name === 'idCard'
        || name === 'url' || name === 'digits' || name === 'number' || name === 'date'
        ? undefined
        : rawParam,
    message: typeof rawParam === 'object' && rawParam && 'message' in rawParam
      ? (rawParam as { message: string }).message
      : undefined,
  }
}

/**
 * 根据 schema 校验数据，返回校验错误数组。通过时为空数组。
 *
 * @example
 * ```ts
 * const errors = validateForm({
 *   phone: [
 *     { required: true },
 *     { mobile: true, message: '手机号格式不对' },
 *   ],
 *   name: [{ required: true }, { minlength: 2 }],
 * }, { phone: '', name: 'J' })
 * // => [{ field: 'phone', message: '这是必填项', value: '' }, { field: 'name', message: '最少输入 2 个字符', value: 'J' }]
 * ```
 */
export function validateForm(schema: ValidationSchema, data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = []

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field]

    for (const rule of rules) {
      const { name, param, message: customMessage } = getRuleConfig(rule)
      if (!name) continue

      const runner = RULE_RUNNERS[name]
      if (!runner) continue

      // 非 required 规则且值为空时跳过
      if (name !== 'required') {
        const isEmpty = value === null || value === undefined || (typeof value === 'string' && value.trim() === '')
        if (isEmpty) continue
      }

      const passed = runner(value, param, data)
      if (!passed) {
        const template = customMessage || DEFAULT_MESSAGES[name] || `${name} 校验失败`
        const msg = Array.isArray(param)
          ? formatMessage(template, ...param)
          : formatMessage(template, param)

        errors.push({ field, message: msg, value })
        break // 同一字段只报第一个错误
      }
    }
  }

  return errors
}

/**
 * 校验单个值，返回是否通过。
 * 与 validateForm 不同，此函数只检查单一规则且不收集错误信息。
 */
export function validateValue(rule: ValidationRule, value: unknown, data?: Record<string, unknown>): boolean {
  const { name, param } = getRuleConfig(rule)
  if (!name) return true

  const runner = RULE_RUNNERS[name]
  if (!runner) return true

  return runner(value, param, data)
}
