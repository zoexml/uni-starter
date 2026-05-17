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
import { useTheme } from '@/composables/useTheme'
import { buildWebViewPageRoute } from '@/composables/useWebView'
import { mockLogout } from '@/mocks/auth'
import { useUserStore } from '@/stores'

interface UserMenuItem {
  key: string
  title: string
  desc: string
  icon: string
  permission: string
}

const userStore = useUserStore()
const router = useRouter()

const logoutLoading = shallowRef(false)
const cacheSize = shallowRef('0KB')
const { currentPrimaryColor, currentPrimaryColorLabel, setPrimaryColor, themeColorOptions } = useTheme()

const userInfo = computed(() => userStore.userInfo)
const isLogin = computed(() => userStore.isLogin)
const roleText = computed(() => userStore.roles.length ? userStore.roles.join(' / ') : '未登录')
const maskedPhone = computed(() => {
  const phone = userInfo.value?.phone
  if (!phone) return '未绑定手机号'
  return phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
})

const menuItems = computed<UserMenuItem[]>(() => [
  {
    key: 'settings',
    title: '设置',
    desc: '账号资料、通知偏好',
    icon: 'settings',
    permission: 'settings:view',
  },
  {
    key: 'theme',
    title: '主题色',
    desc: `当前 ${currentPrimaryColorLabel.value}`,
    icon: 'brush',
    permission: 'settings:view',
  },
  {
    key: 'agreement',
    title: '用户协议',
    desc: '查看服务条款',
    icon: 'edit',
    permission: 'agreement:view',
  },
  {
    key: 'privacy',
    title: '隐私政策',
    desc: '查看隐私说明',
    icon: 'lock',
    permission: 'agreement:view',
  },
  {
    key: 'about',
    title: '关于我们',
    desc: '模板版本与项目介绍',
    icon: 'info-circle',
    permission: 'about:view',
  },
  {
    key: 'webview',
    title: 'WebView 示例',
    desc: '打开外部网页容器',
    icon: 'link',
    permission: 'webview:view',
  },
  {
    key: 'cache',
    title: '清缓存',
    desc: `当前约 ${cacheSize.value}`,
    icon: 'delete',
    permission: 'cache:clear',
  },
])

const visibleMenuItems = computed(() => menuItems.value.filter(item => userStore.hasPermission(item.permission)))

function goLogin() {
  router.push({ name: 'login' })
}

function refreshCacheSize() {
  try {
    const storageInfo = uni.getStorageInfoSync()
    cacheSize.value = `${storageInfo.currentSize}KB`
  } catch {
    cacheSize.value = '0KB'
  }
}

function showTemplateModal(title: string, content: string) {
  uni.showModal({
    title,
    content,
    showCancel: false,
  })
}

const handleThemeSelect = () => {
  uni.showActionSheet({
    itemList: themeColorOptions.map(item => item.label),
    success: ({ tapIndex }) => {
      const selectedTheme = themeColorOptions[tapIndex]
      if (!selectedTheme) return

      setPrimaryColor(selectedTheme.value)
      uni.showToast({
        title: `已切换为${selectedTheme.label}`,
        icon: 'none',
      })
    },
  })
}

function handleMenuClick(item: UserMenuItem) {
  if (item.key === 'theme') {
    handleThemeSelect()
    return
  }

  if (item.key === 'webview') {
    router.push(
      buildWebViewPageRoute({
        title: '百度移动版',
        url: 'https://m.baidu.com',
      }),
    )
    return
  }

  if (item.key === 'cache') {
    handleClearCache()
    return
  }

  const contentMap: Record<string, string> = {
    settings: '这里是设置页模板入口，可扩展头像昵称编辑、通知设置、账号安全等能力。',
    agreement: '这里是用户协议模板内容，实际项目可跳转协议详情页。',
    privacy: '这里是隐私政策模板内容，实际项目可跳转隐私政策详情页。',
    about: 'uni-temp 小程序模板，内置登录注册、用户中心、权限扩展基础能力。',
  }

  showTemplateModal(item.title, contentMap[item.key] || '功能开发中')
}

function handleClearCache() {
  uni.showModal({
    title: '清缓存',
    content: '将清理本地业务缓存，并保留当前登录态。',
    success: (res) => {
      if (!res.confirm) return

      try {
        const storageInfo = uni.getStorageInfoSync()
        storageInfo.keys
          .filter(key => key !== 'user')
          .forEach(key => uni.removeStorageSync(key))
        refreshCacheSize()
        uni.showToast({ title: '缓存已清理', icon: 'success' })
      } catch {
        uni.showToast({ title: '清理失败', icon: 'none' })
      }
    },
  })
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
        uni.showToast({ title: '已退出登录', icon: 'success' })
      } finally {
        logoutLoading.value = false
      }
    },
  })
}

onShow(refreshCacheSize)
</script>

<template>
  <z-paging :show-scrollbar="true">
    <template #top>
      <Navbar title="我的" :left-arrow="false" />
    </template>

    <view class="my-page">
      <view v-if="!isLogin" class="guest-panel">
        <image class="guest-logo" src="/static/images/logo.svg" mode="aspectFit" />
        <view class="guest-title">
          登录后体验完整模板功能
        </view>
        <view class="guest-desc">
          支持手机号验证码登录兼注册、微信授权登录和本地 mock 权限数据。
        </view>
        <wd-button custom-class="guest-button" type="primary" block @click="goLogin">
          去登录 / 注册
        </wd-button>
      </view>

      <view v-else class="profile-panel">
        <view class="profile-card">
          <image class="profile-avatar" :src="userInfo?.avatar" mode="aspectFill" />
          <view class="profile-main">
            <view class="profile-name">
              {{ userInfo?.nickname || userInfo?.name }}
            </view>
            <view class="profile-meta">
              {{ maskedPhone }}
            </view>
            <view class="profile-tags">
              <text class="profile-tag">
                {{ userInfo?.roleName }}
              </text>
              <text class="profile-tag profile-tag--muted">
                {{ userInfo?.orgName }}
              </text>
            </view>
          </view>
        </view>

        <view class="summary-grid">
          <view class="summary-item">
            <view class="summary-value">
              {{ userStore.permissions.length }}
            </view>
            <view class="summary-label">
              权限码
            </view>
          </view>
          <view class="summary-item">
            <view class="summary-value">
              {{ roleText }}
            </view>
            <view class="summary-label">
              角色
            </view>
          </view>
        </view>

        <view class="menu-panel">
          <view
            v-for="item in visibleMenuItems"
            :key="item.key"
            class="menu-item"
            @click="handleMenuClick(item)"
          >
            <view class="menu-icon">
              <template v-if="item.key === 'theme'">
                <view
                  class="menu-color"
                  :style="{ backgroundColor: currentPrimaryColor }"
                />
              </template>
              <template v-else>
                <wd-icon :name="item.icon" size="32rpx" />
              </template>
            </view>
            <view class="menu-main">
              <view class="menu-title">
                {{ item.title }}
              </view>
              <view class="menu-desc">
                {{ item.desc }}
              </view>
            </view>
            <view class="menu-arrow">
              <wd-icon name="arrow-right" size="28rpx" />
            </view>
          </view>
        </view>

        <wd-button custom-class="logout-button" plain block type="danger" :loading="logoutLoading" @click="handleLogout">
          退出登录
        </wd-button>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.my-page {
  min-height: 100%;
  padding: 32rpx;
  background: #f6f8f7;

  .guest-panel,
  .profile-panel {
    display: flex;
    flex-direction: column;
  }

  .guest-panel {
    align-items: center;
    padding: 72rpx 32rpx 40rpx;
    background: #fff;
    border: 1rpx solid #edf1ef;
    border-radius: 16rpx;

    .guest-logo {
      width: 128rpx;
      height: 128rpx;
      margin-bottom: 28rpx;
    }

    .guest-title {
      font-size: 36rpx;
      font-weight: 700;
      line-height: 1.35;
      color: #17211d;
    }

    .guest-desc {
      max-width: 560rpx;
      margin-top: 16rpx;
      font-size: 26rpx;
      line-height: 1.6;
      color: #66736e;
      text-align: center;
    }

    :deep(.guest-button) {
      margin-top: 40rpx;
    }
  }

  .profile-panel {
    .profile-card {
      display: flex;
      align-items: center;
      padding: 32rpx;
      background: #fff;
      border: 1rpx solid #edf1ef;
      border-radius: 16rpx;

      .profile-avatar {
        flex-shrink: 0;
        width: 132rpx;
        height: 132rpx;
        margin-right: 28rpx;
        overflow: hidden;
        background: #eef5f2;
        border-radius: 50%;
      }

      .profile-main {
        flex: 1;
        min-width: 0;

        .profile-name {
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 38rpx;
          font-weight: 700;
          line-height: 1.3;
          color: #17211d;
          white-space: nowrap;
        }

        .profile-meta {
          margin-top: 8rpx;
          font-size: 26rpx;
          color: #66736e;
        }

        .profile-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 12rpx;
          margin-top: 18rpx;

          .profile-tag {
            max-width: 260rpx;
            padding: 6rpx 14rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 22rpx;
            line-height: 1.4;
            color: var(--wot-primary-6);
            white-space: nowrap;
            background: var(--app-primary-soft);
            border-radius: 999rpx;

            &--muted {
              color: #66736e;
              background: #f0f3f2;
            }
          }
        }
      }
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 20rpx;
      margin-top: 24rpx;

      .summary-item {
        padding: 26rpx 28rpx;
        background: #fff;
        border: 1rpx solid #edf1ef;
        border-radius: 16rpx;

        .summary-value {
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 32rpx;
          font-weight: 700;
          line-height: 1.35;
          color: #17211d;
          white-space: nowrap;
        }

        .summary-label {
          margin-top: 8rpx;
          font-size: 24rpx;
          color: #77827e;
        }
      }
    }

    .menu-panel {
      margin-top: 24rpx;
      overflow: hidden;
      background: #fff;
      border: 1rpx solid #edf1ef;
      border-radius: 16rpx;

      .menu-item {
        display: flex;
        align-items: center;
        min-height: 112rpx;
        padding: 20rpx 28rpx;
        border-bottom: 1rpx solid #edf1ef;

        &:last-child {
          border-bottom: none;
        }

        .menu-icon {
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

          .menu-color {
            width: 30rpx;
            height: 30rpx;
            border: 4rpx solid #fff;
            border-radius: 50%;
            box-shadow: 0 0 0 1rpx var(--wot-primary-6);
          }
        }

        .menu-main {
          flex: 1;
          min-width: 0;

          .menu-title {
            font-size: 30rpx;
            font-weight: 600;
            line-height: 1.35;
            color: #17211d;
          }

          .menu-desc {
            margin-top: 6rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 24rpx;
            line-height: 1.35;
            color: #77827e;
            white-space: nowrap;
          }
        }

        .menu-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 20rpx;
          color: #a8b2ae;
        }
      }
    }

    :deep(.logout-button) {
      margin-top: 32rpx;
    }
  }
}
</style>
