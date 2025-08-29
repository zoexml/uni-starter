/**
 * 转义符换成普通字符
 * @param {*} str 需要转换的字符串
 * @returns 转换后的字符串
 */
export function escape2Html(str: string) {
  if (!str) return str
  const arrEntities: { [key: string]: string } = {
    lt: '<',
    gt: '>',
    nbsp: ' ',
    amp: '&',
    quot: '"',
  }
  return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, (all, t) => {
    return arrEntities[t]
  })
}

/**
 * 普通字符转换成转义符
 * @param {*} sHtml 需要转义的HTML字符串
 * @returns 转义后的字符串
 */
export function html2Escape(sHtml: string): string {
  if (!sHtml) return sHtml
  const escapeMap: { [key: string]: string } = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
  }

  return sHtml.replace(/[<>&"]/g, (c) => {
    return escapeMap[c] || c // 若无匹配则返回原字符，保证返回 string
  })
}
