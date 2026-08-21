/*
 * @Description: 工具函数
 */

// URL 信息结构
export interface UrlInfo {
  protocol: string
  hostname: string
  port: number
  pathname: string
  search: string
  path: string
}

// 解析 URL 字符串，返回组成部分
export function parseURL(url: string): UrlInfo | null {
  const pattern = /^(https?:\/\/)?([\w.-]+)(?::(\d+))?(\/[^\s?]*)?(?:\?(\S*))?$/
  const match = url.match(pattern)
  if (!match) return null

  const [, protocol, hostname, port, pathname, search] = match
  const path = pathname ?? '/'

  return {
    protocol: protocol || 'http://',
    hostname: hostname || '',
    port: port ? Number.parseInt(port, 10) : 0,
    pathname: pathname || '/',
    search: search || '',
    path,
  }
}

// 手机号中间四位脱敏
export function concealPhone(tel: string): string {
  return tel.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
}

// 文本超长截断并追加省略号（按字符数，支持 emoji）
export function wordlimit(str: string, length: number): string {
  const arr = Array.from(str)
  if (arr.length > length) {
    return `${arr.slice(0, length).join('')}...`
  }
  return str
}

// 判断字符串是否为有效 URL
export function isURL(str: string): boolean {
  const pattern = /^(?:https?:\/\/)?[\w.-]+(?::\d+)?(?:[/?#]\S*)?$/i
  return pattern.test(str)
}

// 深拷贝（仅处理 JSON 安全值，不含循环引用 / Date / RegExp）
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  const clone: any = Array.isArray(obj) ? [] : {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone((obj as any)[key])
    }
  }
  return clone as T
}

// 解析微信小程序 scene 参数（用于 mp-weixin 扫码入口）
export function getSceneParams(scene = ''): Record<string, string> {
  const params: Record<string, string> = {}
  decodeURIComponent(scene).split('&').forEach((param) => {
    const [key, value] = param.split('=')
    if (key) params[key] = value || ''
  })
  return params
}

// 把对象转换为查询参数
export function objectToQueryParams(obj: Record<string, any>): string {
  return Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
}

// 示例用法
// const params = { type: 2, name: '中文' }
// const queryParams = objectToQueryParams(params)
// console.log(queryParams) // 输出: type=2&name=John%20Doe

/**
 * 获取页面url参数
 * @return {q} object 解析后的参数对象
 */
export const parseQuery = (url: string) => {
  const q: Record<string, string> = {}
  url.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (q[k] = decodeURIComponent(v)))
  return q
}

// export const ensureDecodeURIComponent = (url: string) => {
//   if (url.startsWith('%')) {
//     return ensureDecodeURIComponent(decodeURIComponent(url))
//   }
//   return url
// }

/**
 * @description: 富文本解析器中图片宽度自适应
 * @return {*}
 */
export const textImageConvert = (platform: string, content?: string): any => {
  if (!content) return content

  switch (platform) {
    case 'mp-weixin':
      return content?.replace(/<img[^>]*>/gi, (match) => {
        return match
          ?.replace(/style="[^"]*"/gi, '')
          .replace(/<img/gi, '<img style="max-width:100%; width: 100%; height:auto;"')
      })
    default:
      return content.replace(/(<img[^>]+)(>)/gi, '$1 width="100%" height="auto"$2')
  }
}
