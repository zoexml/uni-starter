<route lang="json5" type="page">
{
  name: 'my',
  meta: {
    requiresAuth: true,
    permissions: ['profile:view'],
  },
  style: {
    navigationBarTitleText: '我的',
  },
}
</route>

<script lang="ts" setup>
import { useTracker, useTrackPageView } from '@/composables/useTracker'
import { mockLogout } from '@/mocks/auth'
import { useUserStore } from '@/stores'

const { track } = useTracker()
useShare({ title: '我的' })
useTrackPageView()

interface UserMenuEntry {
  key: string
  title: string
  desc: string
  icon: string
  routeName: string
  /** 需要的权限码，缺省表示所有登录用户可见 */
  permission?: string
}

interface UserMenuGroup {
  key: string
  title: string
  items: UserMenuEntry[]
}

const userStore = useUserStore()
const router = useRouter()

const logoutLoading = shallowRef(false)

const userInfo = computed(() => userStore.userInfo)
const isLogin = computed(() => userStore.isLogin)
const maskedPhone = computed(() => {
  const phone = userInfo.value?.phone
  if (!phone) return '未绑定手机号'
  return phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
})

/**
 * 本页只做用户中心：内容入口 + 一个设置入口。
 * 主题色、清缓存、协议、关于都收敛到设置页，避免同一功能两处维护、行为还不一致。
 * 演示类入口（WebView、埋点、上传等）统一放示例中心，不混在用户菜单里。
 */
const menuGroups: UserMenuGroup[] = [
  {
    key: 'content',
    title: '我的内容',
    items: [
      {
        key: 'favorites',
        title: '我的收藏',
        desc: '收藏的资讯与内容',
        icon: 'star',
        routeName: 'favorites',
        permission: 'profile:view',
      },
      {
        key: 'service',
        title: '客服会话',
        desc: '在线咨询与消息记录',
        icon: 'message',
        routeName: 'service',
      },
    ],
  },
  {
    key: 'common',
    title: '通用',
    items: [
      {
        key: 'settings',
        title: '设置',
        desc: '主题色、清除缓存、协议与关于',
        icon: 'settings',
        routeName: 'settings',
        permission: 'settings:view',
      },
    ],
  },
]

/** 按权限过滤条目，整组都不可见时不渲染该分组 */
const visibleMenuGroups = computed(() => userStore.isLogin
  ? menuGroups
      .map(group => ({
        ...group,
        items: group.items.filter(item => !item.permission || userStore.hasPermission(item.permission)),
      }))
      .filter(group => group.items.length > 0)
  : [])

function goLogin() {
  router.push({ name: 'login' })
}

function handleMenuClick(item: UserMenuEntry) {
  router.push({ name: item.routeName })
}

async function handleLogout() {
  uni.showModal({
    title: '退出登录',
    content: '确认退出当前账号？',
    success: async (res) => {
      if (!res.confirm) return

      try {
        logoutLoading.value = true
        await mockLogout()
        userStore.logout()
        track('user_logout')
        uni.showToast({ title: '已退出登录', icon: 'success' })
      } finally {
        logoutLoading.value = false
      }
    },
  })
}
</script>

<template>
  <z-paging :show-scrollbar="true">
    <template #top>
      <Navbar title="我的" :left-arrow="false" />
    </template>

    <view class="my-page">
      <view v-if="!isLogin" class="guest-panel">
        <image class="guest-panel__logo" src="/static/images/logo.svg" mode="aspectFit" />
        <view class="guest-panel__title">
          登录后体验完整模板功能
        </view>
        <view class="guest-panel__desc">
          支持手机号验证码登录兼注册、微信授权登录和本地 mock 权限数据。
        </view>
        <wd-button custom-class="guest-panel__button" type="primary" block @click="goLogin">
          去登录 / 注册
        </wd-button>
      </view>

      <template v-else>
        <view class="profile-card">
          <image class="profile-card__avatar" :src="userInfo?.avatar" mode="aspectFill" />
          <view class="profile-card__main">
            <view class="profile-card__name">
              {{ userInfo?.nickname || userInfo?.name }}
            </view>
            <view class="profile-card__meta">
              {{ maskedPhone }}
            </view>
            <view class="profile-card__tags">
              <text class="profile-card__tag">
                {{ userInfo?.roleName || '普通用户' }}
              </text>
              <text v-if="userInfo?.orgName" class="profile-card__tag profile-card__tag--muted">
                {{ userInfo.orgName }}
              </text>
              <text class="profile-card__tag profile-card__tag--muted">
                权限码 {{ userStore.permissions.length }}
              </text>
            </view>
          </view>
        </view>

        <view v-for="group in visibleMenuGroups" :key="group.key" class="menu-group">
          <view class="menu-group__title">
            {{ group.title }}
          </view>
          <view class="menu-group__list">
            <view
              v-for="item in group.items"
              :key="item.key"
              class="menu-item"
              @click="handleMenuClick(item)"
            >
              <view class="menu-item__icon">
                <!-- 用 custom-style 设字号：wd-icon 的 size 静态属性会被 UnoCSS attributify 当成 class 剥掉 -->
                <wd-icon :name="item.icon" custom-style="font-size: 32rpx" />
              </view>
              <view class="menu-item__main">
                <view class="menu-item__title">
                  {{ item.title }}
                </view>
                <view class="menu-item__desc">
                  {{ item.desc }}
                </view>
              </view>
              <wd-icon name="right" custom-style="font-size: 32rpx; color: var(--app-color-text-tertiary);" />
            </view>
          </view>
        </view>

        <wd-button custom-class="my-page__logout" plain block type="danger" :loading="logoutLoading" @click="handleLogout">
          退出登录
        </wd-button>
      </template>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.my-page {
  min-height: 100%;
  padding: 32rpx;

  // 底部固定着自定义 tabbar，需要留出等高空间，否则最后一段内容会被遮挡
  padding-bottom: calc(32rpx + var(--app-tabbar-height) + env(safe-area-inset-bottom));
  background: var(--app-color-surface-muted);

  // wd-button 是子组件，custom-class 在小程序端拿不到父级 scoped 标记，
  // 间距必须用 :deep 编译成后代选择器才生效
  :deep(.my-page__logout) {
    margin-top: 48rpx;
  }
}

.guest-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 72rpx 32rpx 40rpx;
  background: var(--app-color-surface);
  border: 1rpx solid var(--app-color-border);
  border-radius: 16rpx;

  &__logo {
    width: 128rpx;
    height: 128rpx;
    margin-bottom: 28rpx;
  }

  &__title {
    font-size: 36rpx;
    font-weight: 700;
    line-height: 1.35;
    color: var(--app-color-text);
  }

  &__desc {
    max-width: 560rpx;
    margin-top: 16rpx;
    font-size: 26rpx;
    line-height: 1.6;
    color: var(--app-color-text-secondary);
    text-align: center;
  }

  :deep(.guest-panel__button) {
    margin-top: 40rpx;
  }
}

.profile-card {
  display: flex;
  align-items: center;
  padding: 32rpx;
  background: var(--app-color-surface);
  border: 1rpx solid var(--app-color-border);
  border-radius: 16rpx;

  &__avatar {
    flex-shrink: 0;
    width: 132rpx;
    height: 132rpx;
    margin-right: 28rpx;
    overflow: hidden;
    background: var(--app-color-surface-muted);
    border-radius: 50%;
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__name {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 38rpx;
    font-weight: 700;
    line-height: 1.3;
    color: var(--app-color-text);
    white-space: nowrap;
  }

  &__meta {
    margin-top: 8rpx;
    font-size: 26rpx;
    line-height: 1.5;
    color: var(--app-color-text-secondary);
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
    margin-top: 16rpx;
  }

  &__tag {
    padding: 4rpx 16rpx;
    font-size: 22rpx;
    line-height: 1.6;
    color: var(--wot-primary-6);
    background: var(--app-primary-soft);
    border-radius: 8rpx;

    &--muted {
      color: var(--app-color-text-secondary);
      background: var(--app-color-surface-muted);
    }
  }
}

.menu-group {
  margin-top: 32rpx;

  &__title {
    padding: 0 8rpx 16rpx;
    font-size: 26rpx;
    color: var(--app-color-text-secondary);
  }

  &__list {
    overflow: hidden;
    background: var(--app-color-surface);
    border: 1rpx solid var(--app-color-border);
    border-radius: 16rpx;
  }
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 32rpx;

  & + & {
    border-top: 1rpx solid var(--app-color-border);
  }

  &__icon {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 64rpx;
    height: 64rpx;
    margin-right: 24rpx;
    color: var(--wot-primary-6);
    background: var(--app-primary-soft);
    border-radius: 16rpx;
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 30rpx;
    line-height: 1.4;
    color: var(--app-color-text);
  }

  &__desc {
    margin-top: 4rpx;
    font-size: 24rpx;
    line-height: 1.5;
    color: var(--app-color-text-tertiary);
  }
}
</style>
