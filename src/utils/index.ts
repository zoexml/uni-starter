/*
 * @Description: 工具函数
 */

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
  // eslint-disable-next-line style/max-statements-per-line
  if (!content) { return content }

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
