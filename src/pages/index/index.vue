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
import { buildWebViewPageRoute } from '@/composables/useWebView'
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

const quickActions = [
  { icon: 'i-carbon-user-avatar', label: '登录 / 我的', action: goLoginEntry },
  { icon: 'i-carbon-code', label: 'Demo 页', action: goDemoPage },
  { icon: 'i-carbon-grid', label: '示例中心', action: goExamplePage },
  { icon: 'i-carbon-application-web', label: 'WebView', action: goWebViewDemo },
] as const

const features = [
  { icon: 'i-carbon-locked', title: 'Mock 登录注册', desc: '内置认证流程，替换真实接口即可' },
  { icon: 'i-carbon-user-role', title: '用户中心与权限', desc: 'roles / permissions 权限判断' },
  { icon: 'i-carbon-analytics', title: '埋点上报', desc: '批量冲刷 + 失败恢复，开箱即用' },
  { icon: 'i-carbon-earth', title: 'WebView 容器', desc: '统一白名单与桥接协议' },
] as const

function goDemoPage() {
  router.push({ name: 'example-demo' })
}

function goExamplePage() {
  router.push({ name: 'example' })
}

function goWebViewDemo() {
  router.push(
    buildWebViewPageRoute({
      title: '百度移动版',
      url: 'https://m.baidu.com',
    }),
  )
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
          <view class="hero-cta-icon i-carbon-arrow-right" />
        </view>
        <view class="hero-decoration hero-decoration--a" />
        <view class="hero-decoration hero-decoration--b" />
      </view>

      <!-- 快捷入口 -->
      <view class="section-card">
        <view class="section-head">
          <view class="section-title">
            快捷入口
          </view>
        </view>
        <view class="quick-grid">
          <view
            v-for="item in quickActions"
            :key="item.label"
            class="quick-item"
            hover-class="quick-item--active"
            @click="item.action()"
          >
            <view class="quick-icon-wrap">
              <view class="quick-icon" :class="item.icon" />
            </view>
            <view class="quick-label">
              {{ item.label }}
            </view>
          </view>
        </view>
      </view>

      <!-- 内置能力 -->
      <view class="section-card">
        <view class="section-head">
          <view class="section-title">
            内置能力
          </view>
          <view class="section-more" @click="goExamplePage">
            查看示例
            <view class="section-more-icon i-carbon-chevron-right" />
          </view>
        </view>
        <view class="feature-list">
          <view
            v-for="item in features"
            :key="item.title"
            class="feature-item"
          >
            <view class="feature-icon-wrap">
              <view class="feature-icon" :class="item.icon" />
            </view>
            <view class="feature-body">
              <view class="feature-title">
                {{ item.title }}
              </view>
              <view class="feature-desc">
                {{ item.desc }}
              </view>
            </view>
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

      .hero-cta-icon {
        width: 28rpx;
        height: 28rpx;
      }
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

        .section-more-icon {
          width: 24rpx;
          height: 24rpx;
        }
      }
    }
  }

  .quick-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;

    .quick-item {
      display: flex;
      flex-direction: column;
      gap: 14rpx;
      align-items: center;
      padding: 22rpx 0;
      cursor: pointer;
      border-radius: 16rpx;
      transition: background-color 0.2s ease;

      &--active {
        background: var(--app-primary-soft);
      }

      .quick-icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 84rpx;
        height: 84rpx;
        background: var(--app-primary-soft);
        border-radius: 50%;

        .quick-icon {
          width: 40rpx;
          height: 40rpx;
          color: var(--wot-primary-6);
        }
      }

      .quick-label {
        font-size: 23rpx;
        color: var(--app-color-text-regular);
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
      background: var(--app-color-surface-muted);
      border-radius: 16rpx;

      .feature-icon-wrap {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 72rpx;
        height: 72rpx;
        background: var(--app-primary-soft);
        border-radius: 16rpx;

        .feature-icon {
          width: 34rpx;
          height: 34rpx;
          color: var(--wot-primary-6);
        }
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
