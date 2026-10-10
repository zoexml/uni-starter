<route lang="json5" type="page">
{
  layout: 'default',
  name: 'example-bridge',
  meta: {
    public: true,
  },
  style: {
    navigationBarTitleText: '桥接示例',
  },
}
</route>

<script lang="ts" setup>
import { buildWebViewPageRoute, WEBVIEW_BRIDGE_METHODS } from '@/composables/useWebView'
import { useTrackPageView } from '@/composables/useTracker'

useShare({ title: '桥接示例' })
useTrackPageView()

const router = useRouter()

interface BridgeMethodDoc {
  method: string
  summary: string
  payload: string
  returns: string
}

/** 与 useWebView 中实现的桥接方法保持一致，作为网页侧对接参考 */
const bridgeDocs: BridgeMethodDoc[] = [
  {
    method: 'getEnv',
    summary: '获取运行环境',
    payload: '{}',
    returns: '{ platform, responseMode, bridgeVersion, route }',
  },
  {
    method: 'getUserInfo',
    summary: '获取当前用户信息，未登录会返回 UNAUTHORIZED',
    payload: '{}',
    returns: '{ userInfo }',
  },
  {
    method: 'getToken',
    summary: '获取登录 token，未登录会返回 UNAUTHORIZED',
    payload: '{}',
    returns: '{ token }',
  },
  {
    method: 'setTitle',
    summary: '修改容器标题',
    payload: '{ title: "新标题" }',
    returns: '{ title }',
  },
  {
    method: 'navigate',
    summary: '跳转内部页面或外部网页，内部页面需在白名单内',
    payload: '{ url: "/pages/main/my/index", title?:string }',
    returns: '{ internal, url }',
  },
  {
    method: 'close',
    summary: '关闭容器，无页面栈时回退首页',
    payload: '{}',
    returns: '{ closed: true }',
  },
  {
    method: 'share',
    summary: '占位方法，提示使用系统分享',
    payload: '{}',
    returns: '{ supported: false }',
  },
]

const responseShape = `{
  "id": "调用ID",
  "ok": true,
  "data": {}
}`

/** 打开带调试面板的容器页 */
const handleOpenDebug = () => {
  router.push(buildWebViewPageRoute({
    title: '桥接调试',
    url: 'https://m.baidu.com',
    debug: true,
  }))
}

const handleCopySnippet = (snippet: string) => {
  uni.setClipboardData({
    data: snippet,
    success: () => {
      uni.showToast({ title: '已复制', icon: 'none' })
    },
  })
}
</script>

<template>
  <z-paging :show-scrollbar="false">
    <template #top>
      <Navbar title="WebView 桥接" />
    </template>

    <view class="bridge-page">
      <view class="bridge-card">
        <view class="bridge-card__title">
          网页 → 原生桥接
        </view>
        <view class="bridge-card__desc">
          网页侧通过 postMessage 调用原生能力。协议版本 v{{ WEBVIEW_BRIDGE_METHODS.length }} 个方法，
          容器页带 debug=1 打开时会实时显示每次调用的入参与结果。
        </view>
        <view class="bridge-card__actions">
          <wd-button type="primary" block @click="handleOpenDebug">
            打开调试容器（带调用日志）
          </wd-button>
        </view>
      </view>

      <view class="bridge-section">
        <view class="bridge-section__title">
          调用方式
        </view>
        <view class="bridge-section__desc">
          H5 端通过 window.postMessage 发送，小程序端通过 uni.web-view 的 postMessage 通道发送；
          两者请求结构一致，原生侧由 useWebView 统一处理与校验。
        </view>
      </view>

      <view class="bridge-section">
        <view class="bridge-section__title">
          支持的方法（{{ WEBVIEW_BRIDGE_METHODS.length }}）
        </view>
        <view v-for="doc in bridgeDocs" :key="doc.method" class="bridge-method">
          <view class="bridge-method__head">
            <text class="bridge-method__name">
              {{ doc.method }}
            </text>
            <text class="bridge-method__summary">
              {{ doc.summary }}
            </text>
          </view>
          <view class="bridge-method__row">
            <text class="bridge-method__label">
              入参
            </text>
            <text class="bridge-method__code">
              {{ doc.payload }}
            </text>
          </view>
          <view class="bridge-method__row">
            <text class="bridge-method__label">
              返回
            </text>
            <text class="bridge-method__code">
              {{ doc.returns }}
            </text>
          </view>
        </view>
      </view>

      <view class="bridge-section">
        <view class="bridge-section__title">
          响应结构
        </view>
        <view class="bridge-section__code" @click="handleCopySnippet(responseShape)">
          {{ responseShape }}
        </view>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.bridge-page {
  min-height: 100%;
  padding: 32rpx;
  background: var(--app-color-surface-muted);
}

.bridge-card {
  padding: 32rpx;
  margin-bottom: 24rpx;
  background: var(--app-color-surface);
  border: 1rpx solid var(--app-color-border);
  border-radius: 16rpx;

  &__title {
    font-size: 32rpx;
    font-weight: 600;
    line-height: 1.35;
    color: var(--app-color-text);
  }

  &__desc {
    margin-top: 12rpx;
    font-size: 24rpx;
    line-height: 1.6;
    color: var(--app-color-text-secondary);
  }

  &__actions {
    margin-top: 28rpx;
  }
}

.bridge-section {
  padding: 32rpx;
  margin-bottom: 24rpx;
  background: var(--app-color-surface);
  border: 1rpx solid var(--app-color-border);
  border-radius: 16rpx;

  &__title {
    margin-bottom: 20rpx;
    font-size: 30rpx;
    font-weight: 600;
    line-height: 1.35;
    color: var(--app-color-text);
  }

  &__desc {
    font-size: 24rpx;
    line-height: 1.6;
    color: var(--app-color-text-secondary);
  }

  &__code {
    padding: 24rpx;
    font-family: monospace;
    font-size: 22rpx;
    line-height: 1.6;
    color: var(--app-color-text-regular);
    white-space: pre-wrap;
    background: var(--app-color-surface-muted);
    border-radius: 12rpx;
  }
}

.bridge-method {
  padding: 24rpx;
  background: var(--app-color-surface-muted);
  border-radius: 12rpx;

  & + & {
    margin-top: 20rpx;
  }

  &__head {
    margin-bottom: 12rpx;
  }

  &__name {
    font-size: 26rpx;
    font-weight: 600;
    line-height: 1.4;
    color: var(--wot-primary-6);
  }

  &__summary {
    display: block;
    margin-top: 4rpx;
    font-size: 22rpx;
    line-height: 1.5;
    color: var(--app-color-text-secondary);
  }

  &__row {
    display: flex;
    align-items: flex-start;

    & + & {
      margin-top: 8rpx;
    }
  }

  &__label {
    flex-shrink: 0;
    width: 80rpx;
    font-size: 22rpx;
    line-height: 1.6;
    color: var(--app-color-text-tertiary);
  }

  &__code {
    flex: 1;
    min-width: 0;
    font-size: 22rpx;
    line-height: 1.6;
    color: var(--app-color-text-regular);
    word-break: break-all;
  }
}
</style>
