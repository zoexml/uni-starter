/**
 * 客服会话 mock 数据。
 *
 * 会话列表与消息体都为模板占位，实际项目替换为客服系统接口；
 * 消息发送走 mockSendMessage，模拟一条延迟的自动回复。
 */

export type ChatMessageRole = 'user' | 'service'

export interface ChatMessage {
  id: string
  role: ChatMessageRole
  content: string
  time: string
  /** 发送中 / 已发送 / 失败，失败时消息旁可展示重试 */
  status?: 'sending' | 'sent' | 'failed'
}

export interface ChatSession {
  id: string
  title: string
  lastMessage: string
  time: string
  unread: number
}

export const CHAT_SESSIONS: ChatSession[] = [
  {
    id: 's1',
    title: '售前咨询',
    lastMessage: '好的，已为你转接人工客服，稍等一下～',
    time: '10:24',
    unread: 2,
  },
  {
    id: 's2',
    title: '退款进度',
    lastMessage: '退款申请已提交，预计 1-3 个工作日到账。',
    time: '昨天',
    unread: 0,
  },
  {
    id: 's3',
    title: '账号问题',
    lastMessage: '请提供注册手机号，我们会帮你核对账号状态。',
    time: '周一',
    unread: 0,
  },
]

export const CHAT_WELCOME: ChatMessage[] = [
  {
    id: 'm0',
    role: 'service',
    content: '你好，我是智能客服小助手，有问题可以直接问我。',
    time: '10:20',
  },
]

const AUTO_REPLIES = [
  '这个问题我帮你记录一下，稍后让客服同学跟进～',
  '好的，已为你转接人工客服，稍等一下～',
  '你可以先看一下这里：订单详情页右上角可以申请退款。',
]

/** 模拟发送消息后客服的自动回复 */
export function mockSendMessage(_content: string) {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)])
    }, 800)
  })
}
