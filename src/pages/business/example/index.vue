<route lang="json5" type="page">
{
  layout: 'default',
  name: 'example',
  meta: {
    public: true,
  },
  style: {
    navigationBarTitleText: '示例中心',
  },
}
</route>

<script lang="ts" setup>
import { useTrackPageView } from '@/composables/useTracker'

useShare({ title: '示例中心' })
useTrackPageView()

const router = useRouter()

interface ExampleItem {
  key: string
  title: string
  desc: string
  icon: string
  routeName: string
}

const exampleItems: ExampleItem[] = [
  {
    key: 'demo',
    title: '组件示例',
    desc: 'wot 组件库演示：对话框、动作面板、选择器、日期选择、商品卡片等',
    icon: 'apps',
    routeName: 'example-demo',
  },
  {
    key: 'tracker',
    title: '数据分析 · 埋点示例',
    desc: 'useTracker 埋点上报演示：触发事件、批量冲刷与队列状态',
    icon: 'settings',
    routeName: 'example-tracker',
  },
  {
    key: 'upload',
    title: '文件上传示例',
    desc: 'useUpload 演示：取直传凭证、uni.uploadFile 直传、进度与批量上传',
    icon: 'folder',
    routeName: 'example-upload',
  },
  {
    key: 'form',
    title: '复杂表单示例',
    desc: 'validateForm 声明式校验：动态增删项与数组字段校验',
    icon: 'edit',
    routeName: 'example-form',
  },
  {
    key: 'avatar',
    title: '头像上传示例',
    desc: 'wd-img-cropper 裁剪 + useUpload：选图 → 裁剪 → 上传链路',
    icon: 'camera',
    routeName: 'example-avatar',
  },
  {
    key: 'bridge',
    title: 'WebView 桥接示例',
    desc: '网页调用原生能力的协议说明与桥接调用日志面板',
    icon: 'link',
    routeName: 'example-bridge',
  },
]

const businessItems: ExampleItem[] = [
  {
    key: 'about',
    title: '关于我们',
    desc: '应用信息、版本号与协议入口',
    icon: 'info',
    routeName: 'about',
  },
  {
    key: 'agreement',
    title: '协议与条款',
    desc: '用户协议与隐私政策列表，点击进入富文本详情',
    icon: 'file',
    routeName: 'agreement',
  },
  {
    key: 'settings',
    title: '设置',
    desc: '主题色、清除缓存、退出登录（需登录）',
    icon: 'settings',
    routeName: 'settings',
  },
  {
    key: 'favorites',
    title: '我的收藏',
    desc: '收藏列表与空态，复用 InformationCard（需登录）',
    icon: 'star',
    routeName: 'favorites',
  },
  {
    key: 'search',
    title: '搜索',
    desc: '搜索框、历史记录、热门关键词与结果列表',
    icon: 'search-line',
    routeName: 'search',
  },
  {
    key: 'service',
    title: '客服会话',
    desc: '会话列表、消息收发与快捷回复，衔接 FloatingService 入口',
    icon: 'message',
    routeName: 'service',
  },
]

const goExample = (item: ExampleItem) => {
  router.push({ name: item.routeName })
}
</script>

<template>
  <z-paging :show-scrollbar="true">
    <template #top>
      <Navbar title="示例中心" />
    </template>

    <view class="example-page">
      <view class="example-section">
        <view class="example-section__title">
          功能示例
        </view>
        <view
          v-for="item in exampleItems"
          :key="item.key"
          class="example-item"
          @click="goExample(item)"
        >
          <view class="example-item__icon">
            <!-- 用 custom-style 设字号：wd-icon 的 size 静态属性会被 UnoCSS attributify 当成 class 剥掉 -->
            <wd-icon :name="item.icon" custom-style="font-size: 32rpx" />
          </view>
          <view class="example-item__main">
            <view class="example-item__title">
              {{ item.title }}
            </view>
            <view class="example-item__desc">
              {{ item.desc }}
            </view>
          </view>
          <view class="example-item__arrow">
            <wd-icon name="arrow-right" custom-style="font-size: 28rpx" />
          </view>
        </view>
      </view>

      <view class="example-section">
        <view class="example-section__title">
          通用业务页
        </view>
        <view
          v-for="item in businessItems"
          :key="item.key"
          class="example-item"
          @click="goExample(item)"
        >
          <view class="example-item__icon">
            <wd-icon :name="item.icon" custom-style="font-size: 32rpx" />
          </view>
          <view class="example-item__main">
            <view class="example-item__title">
              {{ item.title }}
            </view>
            <view class="example-item__desc">
              {{ item.desc }}
            </view>
          </view>
          <view class="example-item__arrow">
            <wd-icon name="arrow-right" custom-style="font-size: 28rpx" />
          </view>
        </view>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.example-page {
  min-height: 100%;
  padding: 32rpx;
  background: #f6f8f7;

  .example-section {
    overflow: hidden;
    background: #fff;
    border: 1rpx solid #edf1ef;
    border-radius: 16rpx;

    & + & {
      margin-top: 24rpx;
    }

    &__title {
      padding: 24rpx 28rpx 8rpx;
      font-size: 30rpx;
      font-weight: 700;
      line-height: 1.4;
      color: #17211d;
    }
  }

  .example-item {
    display: flex;
    align-items: center;
    min-height: 112rpx;
    padding: 20rpx 28rpx;
    border-bottom: 1rpx solid #edf1ef;

    &:last-child {
      border-bottom: none;
    }

    &__icon {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 56rpx;
      height: 56rpx;
      margin-right: 20rpx;
      color: var(--wot-primary-6);
      background: var(--app-primary-soft);
      border-radius: 50%;
    }

    &__main {
      flex: 1;
      min-width: 0;
    }

    &__title {
      font-size: 30rpx;
      font-weight: 600;
      line-height: 1.35;
      color: #17211d;
    }

    &__desc {
      margin-top: 6rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 24rpx;
      line-height: 1.35;
      color: #77827e;
      white-space: nowrap;
    }

    &__arrow {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 20rpx;
      color: #a8b2ae;
    }
  }
}
</style>
