/**
 * 通用内容类 mock 数据：协议富文本、资讯列表。
 * 收藏页与搜索页共用同一份资讯数据，避免两处维护同一套结构。
 */

export interface ArticleItem {
  id: string
  title: string
  time: string
  image?: string
  category: string
}

export type AgreementType = 'user' | 'privacy'

export interface AgreementMeta {
  type: AgreementType
  title: string
}

export const AGREEMENT_LIST: AgreementMeta[] = [
  { type: 'user', title: '用户协议' },
  { type: 'privacy', title: '隐私政策' },
]

const AGREEMENT_CONTENT: Record<AgreementType, string> = {
  user: `
    <h3>一、服务说明</h3>
    <p>本页面为模板占位内容。实际项目中请替换为法务确认后的正式条款，并通过接口下发以便随时更新。</p>
    <h3>二、账号与登录</h3>
    <p>您需通过手机号完成注册与登录。请妥善保管账号信息，因账号泄露造成的损失由用户自行承担。</p>
    <h3>三、用户行为规范</h3>
    <p>您承诺不利用本服务从事任何违反法律法规的活动，不发布违法、侵权或虚假信息。</p>
    <h3>四、服务变更与终止</h3>
    <p>我们可能根据业务需要调整服务内容，调整前会以适当方式通知您。</p>
  `,
  privacy: `
    <h3>一、我们收集的信息</h3>
    <p>本页面为模板占位内容。实际项目中请逐项列明收集的信息类型、用途与保存期限。</p>
    <h3>二、信息的使用</h3>
    <p>我们仅在为您提供服务所必需的范围内使用所收集的信息，不会向无关第三方提供。</p>
    <h3>三、信息的存储与保护</h3>
    <p>我们采用加密传输与访问控制等措施保护您的个人信息安全。</p>
    <h3>四、您的权利</h3>
    <p>您有权查询、更正、删除您的个人信息，并可随时注销账号。</p>
  `,
}

const CATEGORY_POOL = ['新手指南', '材料准备', '常见问题', '费用说明', '办理流程', '政策解读'] as const

const TITLE_POOL = [
  '初次使用必读：三分钟了解整体流程',
  '材料准备清单与常见退件原因',
  '在线提交后多久能收到反馈',
  '如何修改已提交的申请信息',
  '费用构成与支付方式说明',
  '进度状态的四种含义',
  '线上办理需要准备哪些证件',
  '审核不通过的常见原因汇总',
  '补交材料的正确操作方式',
  '办理期间可以修改哪些信息',
  '电子材料是否需要盖章',
  '不同办理渠道的差异对比',
  '高峰期提交会不会影响进度',
  '结果通知会通过哪些渠道发送',
  '证书或结果单的领取方式',
  '对办理结果有疑问如何申诉',
  '代办服务与自行办理的取舍',
  '材料上传失败的排查思路',
  '办理流程图与时间轴说明',
  '常见问题速查：材料篇',
  '常见问题速查：流程篇',
  '常见问题速查：费用篇',
  '政策更新：2026 年办理须知',
  '服务时间与节假日安排',
  '跨地区办理是否需要额外材料',
  '未成年人办理的特殊要求',
  '企业办理与个人办理的区别',
  '补办与更正的操作差异',
  '信息填写错误如何修正',
  '办理进度延迟时的自查步骤',
] as const

/** 构造足量的 mock 资讯，保证分页有翻页效果 */
const buildArticlePool = (size = 30): ArticleItem[] => {
  return Array.from({ length: size }, (_, index) => {
    const title = TITLE_POOL[index % TITLE_POOL.length]!
    const category = CATEGORY_POOL[index % CATEGORY_POOL.length]!
    // 用固定基数构造递减日期，保证 mock 数据稳定可复现
    const day = String(28 - (index % 28)).padStart(2, '0')
    const month = String(6 - Math.floor(index / 28)).padStart(2, '0')

    return {
      id: `a${index + 1}`,
      title: index < TITLE_POOL.length ? title : `${title}（${Math.floor(index / TITLE_POOL.length) + 1}）`,
      time: `2026-${month}-${day}`,
      category,
    }
  })
}

const ARTICLE_POOL = buildArticlePool()

const MOCK_DELAY = 300

const wait = <T>(data: T, delay = MOCK_DELAY) => {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

/** 协议详情富文本 */
export const fetchAgreementContent = (type: AgreementType) => {
  return wait(AGREEMENT_CONTENT[type] ?? '')
}

/** 我的收藏（当前返回固定的一批资讯，便于模板演示） */
export const fetchFavoriteList = () => {
  return wait(ARTICLE_POOL.slice(0, 4))
}

/** 关键词搜索，空关键词返回全部 */
export const searchArticles = (keyword: string) => {
  const trimmed = keyword.trim().toLowerCase()

  if (!trimmed) return wait<ArticleItem[]>([])

  const matched = ARTICLE_POOL.filter(item =>
    item.title.toLowerCase().includes(trimmed) || item.category.toLowerCase().includes(trimmed),
  )

  return wait(matched)
}

/** 分页响应结构，与后端常见格式一致（列表 + 总数） */
export interface PageResult<T> {
  list: T[]
  total: number
}

const paginate = <T>(list: T[], page: number, pageSize: number): PageResult<T> => {
  const start = (page - 1) * pageSize

  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
  }
}

export interface ArticleQuery {
  page: number
  pageSize: number
  /** 关键词，空字符串表示不过滤 */
  keyword?: string
}

const filterArticles = (keyword?: string) => {
  const trimmed = (keyword || '').trim().toLowerCase()
  if (!trimmed) return ARTICLE_POOL

  return ARTICLE_POOL.filter(item =>
    item.title.toLowerCase().includes(trimmed) || item.category.toLowerCase().includes(trimmed),
  )
}

/** 分页拉取资讯：收藏页与搜索页共用，配合 alova 的 usePagination 使用 */
export function fetchArticlePage(query: ArticleQuery) {
  const matched = filterArticles(query.keyword)

  return wait(paginate(matched, query.page, query.pageSize))
}

/** 搜索页的热门关键词 */
export const HOT_KEYWORDS = ['材料准备', '常见问题', '新手指南', '费用说明']
