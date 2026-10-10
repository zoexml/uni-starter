/**
 * 协议详情页路由构造。
 *
 * 原先设置页先跳「协议与条款」列表页、再点进详情，多一层中转；
 * 现在直接进详情，标题与类型一一对应，避免两处各写一份映射。
 */
import type { AgreementType } from '@/mocks/content'

const AGREEMENT_TITLES: Record<AgreementType, string> = {
  user: '用户协议',
  privacy: '隐私政策',
}

export const buildAgreementDetailRoute = (type: AgreementType) => ({
  name: 'agreement-detail',
  query: { type, title: AGREEMENT_TITLES[type] },
})
