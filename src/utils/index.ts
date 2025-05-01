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
