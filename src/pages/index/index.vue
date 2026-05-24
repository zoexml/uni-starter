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
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const router = useRouter()
const loginEntryText = computed(() => userStore.isLogin ? '进入用户中心' : '登录 / 注册')

const goDemoPage = () => {
  router.push({ name: 'demo' })
}

const goWebViewDemo = () => {
  router.push(
    buildWebViewPageRoute({
      title: '百度移动版',
      url: 'https://m.baidu.com',
    }),
  )
}

const goLoginEntry = () => {
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
      <Navbar title="home" :left-arrow="false" />
    </template>
    <view class="home-page">
      <view class="home-panel">
        <view class="home-title">
          uni-starter 小程序模板
        </view>
        <view class="home-desc">
          已内置 mock 登录注册、用户中心和权限数据，可直接替换为真实接口。
        </view>

        <view class="home-actions">
          <wd-button type="primary" block @click="goLoginEntry">
            {{ loginEntryText }}
          </wd-button>
          <wd-button plain block @click="goDemoPage">
            进入 demo 页
          </wd-button>
          <wd-button plain block @click="goWebViewDemo">
            打开 WebView 示例
          </wd-button>
        </view>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.home-page {
  min-height: 100%;
  padding: 32rpx;
  background: #f6f8f7;

  .home-panel {
    padding: 36rpx 32rpx;
    background: #fff;
    border: 1rpx solid #edf1ef;
    border-radius: 16rpx;

    .home-title {
      font-size: 40rpx;
      font-weight: 700;
      line-height: 1.35;
      color: #17211d;
    }

    .home-desc {
      margin-top: 16rpx;
      font-size: 26rpx;
      line-height: 1.6;
      color: #66736e;
    }

    .home-actions {
      display: flex;
      flex-direction: column;
      gap: 20rpx;
      margin-top: 36rpx;
    }
  }
}
</style>
