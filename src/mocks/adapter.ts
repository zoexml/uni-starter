/**
 * alova Mock 适配器。
 *
 * 模板默认不连后端，`VITE_SERVER_BASEURL` 为空时由它接管请求，
 * 这样页面里可以写真实的 `usePagination` / `useRequest` 调用而不是绕过请求层，
 * 接后端时把 adapter 换回 `@alova/adapter-uniapp` 即可，页面代码不用改。
 *
 * 新增 mock 接口的步骤：
 * 1. 在这里用 `defineMock` 补一个接口
 * 2. 页面用 `http.Get('/article/page')` 正常请求
 */
import type { uniappRequestAdapter } from '@alova/adapter-uniapp'
import { createAlovaMockAdapter, defineMock } from '@alova/mock'
import type { ArticleQuery } from '@/mocks/content'
import { fetchArticlePage } from '@/mocks/content'

/** 把查询参数安全转成数字，非法值回退默认值 */
function toPositiveInt(value: unknown, fallback: number) {
  const parsed = Number(value)

  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

/**
 * 分页资讯接口：收藏页与搜索页共用，演示 usePagination。
 * 与真实后端约定一致：query 带 page / pageSize / keyword，响应为 { list, total }。
 */
const articlePageMock = defineMock({
  '/article/page': ({ params }: { params: Record<string, unknown> }) => {
    const query: ArticleQuery = {
      page: toPositiveInt(params.page, 1),
      pageSize: toPositiveInt(params.pageSize, 10),
      keyword: typeof params.keyword === 'string' ? params.keyword : '',
    }

    return fetchArticlePage(query)
  },
})

/**
 * `@alova/mock` 的泛型基于 fetch，与项目使用的 uniapp 适配器不一致，
 * 这里统一收敛为适配器类型，避免把泛型差异带到 http 实例上。
 */
export function createMockAdapter(): typeof uniappRequestAdapter {
  return createAlovaMockAdapter([articlePageMock], {
    delay: 300,
    matchMode: 'pathname',
  }) as unknown as typeof uniappRequestAdapter
}

/** 判断当前是否处于 mock 模式（未配置后端地址时） */
export function isMockMode() {
  return !import.meta.env.VITE_SERVER_BASEURL
}
