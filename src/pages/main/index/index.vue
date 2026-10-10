<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page -->
<route lang="json5" type="home">
{
  layout: 'default',
  name: 'home',
  style: {
    navigationBarTitleText: 'home',
  },
}
</route>

<script setup lang="ts">
import { useTrackPageView } from '@/composables/useTracker'
import { useUserStore } from '@/stores'

useShare({ title: 'uni-starter 小程序模板' })
useTrackPageView()

const userStore = useUserStore()
const router = useRouter()

const greetingText = computed(() => userStore.isLogin
  ? `Hi，${userStore.userInfo?.nickname || userStore.userInfo?.name || '开发者'}`
  : '欢迎来到 uni-starter')

const loginEntryText = computed(() => userStore.isLogin ? '进入用户中心' : '登录 / 注册')

/**
 * 能力直达：每条对应一个真实示例页，点了就走，不做纯说明性罗列。
 * 首页不再另设「快捷入口」四格 —— 那块内容与 hero 的 CTA、「示例中心」入口重复。
 * 图标统一用 Wot UI 内置的 wd-icon，不依赖 UnoCSS 图标集（i-carbon-* 在小程序端解析失败）。
 */
const capabilities = [
  { icon: 'apps', title: '组件与交互', desc: 'Wot UI 组件、反馈、选择器与卡片', routeName: 'example-demo' },
  { icon: 'settings', title: '埋点上报', desc: '批量冲刷 + 失败恢复，开箱即用', routeName: 'example-tracker' },
  { icon: 'folder', title: '文件上传', desc: '直传凭证、进度与头像裁剪', routeName: 'example-upload' },
  { icon: 'link', title: 'WebView 桥接', desc: '统一白名单与前后端桥接协议', routeName: 'example-bridge' },
  { icon: 'loading', title: '请求 loading', desc: '引用计数、延迟阈值与兜底关闭', routeName: 'example-loading' },
] as const

function goCapability(routeName: typeof capabilities[number]['routeName']) {
  router.push({ name: routeName })
}

/** 完整示例清单在示例中心，首页只保留这一个汇总入口 */
function goExampleCenter() {
  router.push({ name: 'example' })
}

function goLoginEntry() {
  if (userStore.isLogin) {
    router.pushTab({ name: 'my' })
    return
  }

  router.push({ name: 'login' })
}
</script>

<template>
  <z-paging :show-scrollbar="true">
    <template #top>
      <Navbar title="首页" :left-arrow="false" />
    </template>
    <view class="home-page">
      <!-- Hero 问候区 -->
      <view class="hero">
        <view class="hero-title">
          {{ greetingText }}
        </view>
        <view class="hero-desc">
          一套开箱即用的 uni-app 3.0 模板，已内置登录、用户中心、权限与埋点能力。
        </view>
        <view class="hero-cta" @click="goLoginEntry">
          {{ loginEntryText }}
          <wd-icon name="right" custom-style="font-size: 32rpx;" />
        </view>
        <view class="hero-decoration hero-decoration--a" />
        <view class="hero-decoration hero-decoration--b" />
      </view>

      <!-- 能力直达：每条都能点，直接进对应示例页 -->
      <view class="section-card">
        <view class="section-head">
          <view class="section-title">
            内置能力
          </view>
          <view class="section-more" @click="goExampleCenter">
            示例中心
            <wd-icon name="right" custom-style="font-size: 28rpx; color: var(--app-color-text-tertiary);" />
          </view>
        </view>
        <view class="feature-list">
          <view
            v-for="item in capabilities"
            :key="item.title"
            class="feature-item"
            hover-class="feature-item--active"
            @click="goCapability(item.routeName)"
          >
            <view class="feature-icon-wrap">
              <wd-icon :name="item.icon" custom-style="font-size: 34rpx;" />
            </view>
            <view class="feature-body">
              <view class="feature-title">
                {{ item.title }}
              </view>
              <view class="feature-desc">
                {{ item.desc }}
              </view>
            </view>
            <wd-icon name="right" custom-style="font-size: 32rpx; color: var(--app-color-text-tertiary);" />
          </view>
        </view>
      </view>

      <view class="footer-hint">
        基于 Vue 3 · TypeScript · Vite · Pinia · Wot Design Uni
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.home-page {
  min-height: 100%;
  padding: 32rpx;

  // 底部固定着自定义 tabbar，需要留出等高空间，否则最后一段内容会被遮挡
  padding-bottom: calc(32rpx + var(--app-tabbar-height) + env(safe-area-inset-bottom));
  background: var(--app-color-surface-muted);

  .hero {
    position: relative;
    padding: 44rpx 40rpx 48rpx;
    overflow: hidden;
    background: linear-gradient(135deg, var(--wot-primary-5), var(--wot-primary-6));
    border-radius: 24rpx;

    .hero-title {
      position: relative;
      z-index: 1;
      font-size: 42rpx;
      font-weight: 700;
      line-height: 1.35;
      color: #fff;
    }

    .hero-desc {
      position: relative;
      z-index: 1;
      max-width: 520rpx;
      margin-top: 14rpx;
      font-size: 25rpx;
      line-height: 1.6;
      color: rgb(255 255 255 / 82%);
    }

    .hero-cta {
      position: relative;
      z-index: 1;
      display: inline-flex;
      gap: 6rpx;
      align-items: center;
      padding: 16rpx 36rpx;
      margin-top: 36rpx;
      font-size: 27rpx;
      font-weight: 600;
      color: var(--wot-primary-6);
      cursor: pointer;
      background: #fff;
      border-radius: 44rpx;
    }

    .hero-decoration {
      position: absolute;
      background: rgb(255 255 255 / 12%);
      border-radius: 50%;

      &--a {
        top: -70rpx;
        right: -40rpx;
        width: 220rpx;
        height: 220rpx;
      }

      &--b {
        right: 110rpx;
        bottom: -90rpx;
        width: 160rpx;
        height: 160rpx;
      }
    }
  }

  .section-card {
    padding: 32rpx 28rpx;
    margin-top: 24rpx;
    background: var(--app-color-surface);
    border: 1rpx solid var(--app-color-border);
    border-radius: 20rpx;

    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 26rpx;

      .section-title {
        font-size: 30rpx;
        font-weight: 600;
        color: var(--app-color-text);
      }

      .section-more {
        display: flex;
        gap: 2rpx;
        align-items: center;
        font-size: 24rpx;
        color: var(--app-color-text-tertiary);
        cursor: pointer;
      }
    }
  }

  .feature-list {
    display: flex;
    flex-direction: column;
    gap: 24rpx;

    .feature-item {
      display: flex;
      gap: 20rpx;
      align-items: center;
      padding: 20rpx;
      cursor: pointer;
      background: var(--app-color-surface-muted);
      border-radius: 16rpx;
      transition: background-color 0.2s ease;

      &--active {
        background: var(--app-primary-soft);
      }

      .feature-icon-wrap {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 72rpx;
        height: 72rpx;
        color: var(--wot-primary-6);
        background: var(--app-primary-soft);
        border-radius: 16rpx;
      }

      .feature-body {
        flex: 1;
        min-width: 0;

        .feature-title {
          font-size: 27rpx;
          font-weight: 600;
          color: var(--app-color-text);
        }

        .feature-desc {
          margin-top: 6rpx;
          font-size: 23rpx;
          line-height: 1.5;
          color: var(--app-color-text-secondary);
        }
      }
    }
  }

  .footer-hint {
    margin-top: 32rpx;
    font-size: 22rpx;
    color: var(--app-color-text-placeholder);
    text-align: center;
  }
}
</style>
