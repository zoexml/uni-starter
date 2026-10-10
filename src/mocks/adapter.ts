/**
 * alova Mock 适配器。
 *
 * 模板默认不连后端，`VITE_SERVER_BASEURL` 为空时由它接管请求，
 * 这样页面里可以写真实的 `usePagination` / `useRequest` 调用而不是绕过请求层，
 * 接后端时把 adapter 换回 `@alova/adapter-uniapp` 即可，页面代码不用改。
 *
 * 新增 mock 接口的步骤：
 * 1. 在这里用 `defineMock` 补一个接口，handler 直接返回业务数据（不用自己套信封）
 * 2. 页面用 `http.Get('/article/page')` 正常请求
 */
import type { uniappRequestAdapter } from '@alova/adapter-uniapp'
import { createAlovaMockAdapter, defineMock } from '@alova/mock'
import type { ArticleQuery } from '@/mocks/content'
import type { IResponse } from '@/types/index'
import { fetchArticlePage } from '@/mocks/content'

/** mock 响应的默认延迟（ms），用来模拟真实网络耗时 */
const MOCK_DELAY = 300
/** 业务成功码，与 `ResultEnum.Success` 对齐 */
const MOCK_SUCCESS_CODE = 0

/**
 * handler 的入参：`query` 是查询串（值均为字符串），`params` 是路径参数。
 * `@alova/mock` 不会把查询串放进 `params`，取参数时两个都要看。
 */
interface MockHandlerRequest {
  query?: Record<string, unknown>
  params?: Record<string, unknown>
}

/** 取参数：优先查询串，其次路径参数 */
function readParam(request: MockHandlerRequest, key: string) {
  return request.query?.[key] ?? request.params?.[key]
}

/** 把查询参数安全转成数字，非法值回退默认值 */
function toPositiveInt(value: unknown, fallback: number) {
  const parsed = Number(value)

  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

/** 非负整数（允许 0，用于「立即返回」的演示接口） */
function toNonNegativeInt(value: unknown, fallback: number) {
  const parsed = Number(value)

  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : fallback
}

/**
 * 分页资讯接口：收藏页与搜索页共用，演示 usePagination。
 * 与真实后端约定一致：query 带 page / pageSize / keyword，响应为 { list, total }。
 */
const articlePageMock = defineMock({
  '/article/page': (request: MockHandlerRequest) => {
    const keyword = readParam(request, 'keyword')

    const query: ArticleQuery = {
      page: toPositiveInt(readParam(request, 'page'), 1),
      pageSize: toPositiveInt(readParam(request, 'pageSize'), 10),
      keyword: typeof keyword === 'string' ? keyword : '',
    }

    return fetchArticlePage(query)
  },
})

/**
 * 全局 loading 示例用的可控耗时接口：`/example/loading?ms=1500`。
 * 由 handler 自己等待，用于演示「快请求不闪烁 / 慢请求显示 / 并发只显示一次」。
 */
const loadingDemoMock = defineMock({
  '/example/loading': async (request: MockHandlerRequest) => {
    const ms = toNonNegativeInt(readParam(request, 'ms'), 0)

    if (ms > 0) {
      await new Promise(resolve => setTimeout(resolve, ms))
    }

    return { ms, finishedAt: Date.now() }
  },
})

/**
 * handler 直接返回 `{ code, message }` 时视为自带信封，用于演示业务错误码；
 * 其余返回值统一按业务数据处理。
 */
function isBusinessEnvelope(body: unknown): body is IResponse<unknown> {
  return !!body && typeof body === 'object' && 'code' in (body as Record<string, unknown>)
}

/**
 * 把 mock handler 的返回值转成 uni.request 的响应结构。
 *
 * `@alova/mock` 默认按 fetch 的 `Response` 返回，而 `http` 的响应拦截器按
 * uniapp 的 `{ statusCode, data }` 解包，二者不一致会让所有 mock 请求都走到错误分支。
 * 这里显式补回 uniapp 结构，并补一层 `{ code, message, data }` 业务信封，
 * 使 mock 的消费方式与真实后端完全一致。
 */
const buildMockResponse = ({ status, body }: { status: number, body: unknown }) => ({
  response: {
    statusCode: status,
    data: isBusinessEnvelope(body) ? body : { code: MOCK_SUCCESS_CODE, message: 'ok', data: body },
    header: {},
    errMsg: 'request:ok',
  },
  headers: {},
})

/**
 * `@alova/mock` 的泛型基于 fetch，与项目使用的 uniapp 适配器不一致，
 * 这里统一收敛为适配器类型，避免把泛型差异带到 http 实例上。
 */
export function createMockAdapter(): typeof uniappRequestAdapter {
  const options = {
    delay: MOCK_DELAY,
    matchMode: 'pathname',
    onMockResponse: buildMockResponse,
  } as unknown as Parameters<typeof createAlovaMockAdapter>[1]

  return createAlovaMockAdapter([articlePageMock, loadingDemoMock], options) as unknown as typeof uniappRequestAdapter
}

/** 判断当前是否处于 mock 模式（未配置后端地址时） */
export function isMockMode() {
  return !import.meta.env.VITE_SERVER_BASEURL
}
