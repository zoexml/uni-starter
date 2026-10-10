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

const ARTICLE_POOL: ArticleItem[] = [
  { id: 'a1', title: '初次使用必读：三分钟了解整体流程', time: '2026-05-16', category: '新手指南' },
  { id: 'a2', title: '材料准备清单与常见退件原因', time: '2026-05-12', category: '材料准备' },
  { id: 'a3', title: '在线提交后多久能收到反馈', time: '2026-05-08', category: '常见问题' },
  { id: 'a4', title: '如何修改已提交的申请信息', time: '2026-04-28', category: '常见问题' },
  { id: 'a5', title: '费用构成与支付方式说明', time: '2026-04-20', category: '费用说明' },
  { id: 'a6', title: '进度状态的四种含义', time: '2026-04-11', category: '新手指南' },
]

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

/** 搜索页的热门关键词 */
export const HOT_KEYWORDS = ['材料准备', '常见问题', '新手指南', '费用说明']
