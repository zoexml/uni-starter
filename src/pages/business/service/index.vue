<route lang="json5" type="page">
{
  layout: 'default',
  name: 'service',
  meta: {
    public: true,
  },
  style: {
    navigationBarTitleText: '客服会话',
  },
}
</route>

<script lang="ts" setup>
import type { ChatMessage, ChatSession } from '@/mocks/service'
import type { UploadResult } from '@/types/upload'
import { CHAT_SESSIONS, CHAT_WELCOME, mockSendMessage } from '@/mocks/service'
import { useTrackPageView } from '@/composables/useTracker'
import { getErrorMessage } from '@/utils'
import { useUpload } from '@/composables/useUpload'

useShare({ title: '客服会话' })
useTrackPageView()

const router = useRouter()

const sessions = ref<ChatSession[]>(CHAT_SESSIONS)
const activeSession = shallowRef<ChatSession | null>(null)
const messages = ref<ChatMessage[]>([...CHAT_WELCOME])
const draft = shallowRef('')
const sending = shallowRef(false)

const QUICK_REPLIES = ['怎么退款？', '什么时候发货？', '帮我转人工']

/** 滚动到底部：最后一条消息 id 变化时触发 */
const lastMessageId = computed(() => messages.value.at(-1)?.id || '')

const handleSelectSession = (session: ChatSession) => {
  activeSession.value = session
  // 进入会话清零未读数
  sessions.value = sessions.value.map(item =>
    item.id === session.id ? { ...item, unread: 0 } : item,
  )
}

const handleBack = () => {
  if (activeSession.value) {
    activeSession.value = null
    return
  }
  router.back()
}

/** 悬浮客服入口：在会话列表态点击时直接进入首个会话 */
const handleOpenService = () => {
  const first = sessions.value[0]
  if (!first) return

  handleSelectSession(first)
}

/** 会话列表为空时直接展示欢迎语 */
const showWelcome = computed(() => !activeSession.value && messages.value.length === CHAT_WELCOME.length)

const { uploadFile, uploading: imageUploading } = useUpload({
  onSuccess: (result: UploadResult) => {
    pushMessage('service', `[图片] ${result.url}`)
  },
  onError: (error: Error) => {
    uni.showToast({ title: error.message || '图片上传失败', icon: 'none' })
  },
})

const currentTime = () => {
  const date = new Date()
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function pushMessage(role: ChatMessage['role'], content: string, status?: ChatMessage['status']) {
  messages.value = [...messages.value, { id: `m${Date.now()}`, role, content, time: currentTime(), status }]
}

const handleSend = async () => {
  const content = draft.value.trim()
  if (!content || sending.value) return

  draft.value = ''
  sending.value = true
  pushMessage('user', content, 'sending')

  try {
    const reply = await mockSendMessage(content)
    messages.value = messages.value.map(item =>
      item.role === 'user' && item.status === 'sending' ? { ...item, status: 'sent' } : item,
    )
    pushMessage('service', reply)
  } catch {
    messages.value = messages.value.map(item =>
      item.role === 'user' && item.status === 'sending' ? { ...item, status: 'failed' } : item,
    )
  } finally {
    sending.value = false
  }
}

const handleSendImage = async () => {
  try {
    const res = await uni.chooseImage({ count: 1, sizeType: ['compressed'] })
    const path = res.tempFilePaths?.[0]
    if (!path) return

    await uploadFile(path)
  } catch (error) {
    // 同头像页：uni API 失败抛的是 { errMsg }，用 getErrorMessage 取文案，避免静默
    const message = getErrorMessage(error, '发送图片失败')
    if (!message.includes('cancel')) {
      uni.showToast({ title: message, icon: 'none' })
    }
  }
}

const handleQuickReply = (text: string) => {
  draft.value = text
}
</script>

<template>
  <view class="service-page">
    <!-- 始终显示返回箭头：列表态返回上一页，会话态返回会话列表 -->
    <Navbar title="客服会话" left-arrow @click-left="handleBack" />

    <view class="service-body">
      <!-- 会话列表 -->
      <view v-if="!activeSession" class="session-list">
        <view class="session-list__header">
          <text class="session-list__title">
            我的会话
          </text>
          <text class="session-list__count">
            {{ sessions.length }} 个会话
          </text>
        </view>

        <view
          v-for="session in sessions"
          :key="session.id"
          class="session-item"
          hover-class="session-item--hover"
          @click="handleSelectSession(session)"
        >
          <view class="session-item__main">
            <text class="session-item__title">
              {{ session.title }}
            </text>
            <text class="session-item__desc">
              {{ session.lastMessage }}
            </text>
          </view>
          <view class="session-item__extra">
            <text class="session-item__time">
              {{ session.time }}
            </text>
            <wd-badge v-if="session.unread" :value="session.unread" />
          </view>
        </view>

        <view class="session-list__footer">
          <wd-button type="primary" block @click="handleSelectSession(sessions[0]!)">
            进入第一个会话
          </wd-button>
        </view>
      </view>

      <!-- 消息流 -->
      <template v-else>
        <scroll-view class="message-list" scroll-y :scroll-into-view="lastMessageId">
          <view v-if="showWelcome" class="message-welcome">
            <wd-icon name="headset" custom-style="font-size: 56rpx; color: #b8c0bc;" />
            <text class="message-welcome__text">
              选择左侧会话，或直接发送消息开始咨询
            </text>
          </view>

          <view
            v-for="message in messages"
            :id="message.id"
            :key="message.id"
            class="message"
            :class="`message--${message.role}`"
          >
            <view class="message__bubble">
              <text class="message__text">
                {{ message.content }}
              </text>
              <view class="message__meta">
                <text class="message__time">
                  {{ message.time }}
                </text>
                <text v-if="message.role === 'user' && message.status" class="message__status">
                  {{ message.status === 'sending' ? '发送中' : message.status === 'sent' ? '已送达' : '发送失败' }}
                </text>
              </view>
            </view>
          </view>
        </scroll-view>

        <view class="quick-reply">
          <text
            v-for="item in QUICK_REPLIES"
            :key="item"
            class="quick-reply__item"
            @click="handleQuickReply(item)"
          >
            {{ item }}
          </text>
        </view>

        <view class="service-input">
          <wd-button :loading="imageUploading" @click="handleSendImage">
            <wd-icon v-if="!imageUploading" name="picture" custom-style="font-size: 32rpx" />
          </wd-button>
          <wd-input
            v-model="draft"
            class="service-input__field"
            placeholder="输入咨询内容"
            custom-style="flex: 1; min-width: 0;"
            @enter="handleSend"
          />
          <wd-button
            type="primary"
            :disabled="!draft.trim()"
            :loading="sending"
            @click="handleSend"
          >
            发送
          </wd-button>
        </view>
      </template>
    </view>

    <FloatingService label="客服" @click="handleOpenService" />
  </view>
</template>

<style lang="scss" scoped>
.service-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--app-color-surface-muted);
}

.service-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.session-list {
  flex: 1;
  padding: 24rpx 32rpx;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20rpx;
  }

  &__title {
    font-size: 32rpx;
    font-weight: 700;
    line-height: 1.35;
    color: var(--app-color-text);
  }

  &__count {
    font-size: 24rpx;
    line-height: 1.4;
    color: var(--app-color-text-tertiary);
  }

  &__footer {
    margin-top: 32rpx;
  }
}

.session-item {
  display: flex;
  align-items: center;
  padding: 28rpx;
  margin-bottom: 20rpx;
  background: var(--app-color-surface);
  border: 1rpx solid var(--app-color-border);
  border-radius: 16rpx;

  &--hover {
    background: #eef2f1;
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 30rpx;
    font-weight: 600;
    line-height: 1.4;
    color: var(--app-color-text);
  }

  &__desc {
    display: block;
    margin-top: 8rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 24rpx;
    line-height: 1.4;
    color: var(--app-color-text-secondary);
    white-space: nowrap;
  }

  &__extra {
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    gap: 10rpx;
    align-items: flex-end;
    margin-left: 20rpx;
  }

  &__time {
    font-size: 22rpx;
    line-height: 1.4;
    color: var(--app-color-text-tertiary);
  }
}

.message-list {
  flex: 1;
  min-height: 0;
  padding: 24rpx 32rpx;
}

.message-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0;

  &__text {
    margin-top: 20rpx;
    font-size: 24rpx;
    line-height: 1.5;
    color: var(--app-color-text-tertiary);
  }
}

.message {
  display: flex;
  margin-bottom: 24rpx;

  &--user {
    justify-content: flex-end;
  }

  &__bubble {
    max-width: 74%;
    padding: 20rpx 24rpx;
    background: var(--app-color-surface);
    border: 1rpx solid var(--app-color-border);
    border-radius: 20rpx;
  }

  &--user &__bubble {
    background: var(--app-primary-soft);
    border-color: transparent;
  }

  &__text {
    font-size: 27rpx;
    line-height: 1.6;
    color: var(--app-color-text-regular);
    word-break: break-all;
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 10rpx;
  }

  &__time {
    font-size: 20rpx;
    line-height: 1.4;
    color: var(--app-color-text-tertiary);
  }

  &__status {
    margin-left: 12rpx;
    font-size: 20rpx;
    line-height: 1.4;
    color: var(--app-color-text-tertiary);
  }
}

.quick-reply {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 0 32rpx 16rpx;

  &__item {
    padding: 10rpx 20rpx;
    font-size: 22rpx;
    line-height: 1.4;
    color: var(--wot-primary-6);
    background: var(--app-color-surface);
    border: 1rpx solid var(--app-color-border);
    border-radius: 999rpx;
  }
}

.service-input {
  display: flex;
  gap: 16rpx;
  align-items: center;
  padding: 16rpx 32rpx calc(16rpx + env(safe-area-inset-bottom));
  background: var(--app-color-surface);
  border-top: 1rpx solid var(--app-color-border);

  &__field {
    flex: 1;
    min-width: 0;
  }

  :deep(.wd-input) {
    padding: 0 20rpx;
    background: var(--app-color-surface-muted);
    border-radius: 999rpx;
  }
}
</style>
