<route lang="json5" type="page">
{
  layout: 'default',
  name: 'settings',
  meta: {
    requiresAuth: true,
    permissions: ['settings:view'],
  },
  style: {
    navigationBarTitleText: '设置',
  },
}
</route>

<script lang="ts" setup>
import { mockLogout } from '@/mocks/auth'
import { useTheme } from '@/composables/useTheme'
import { useTrackPageView } from '@/composables/useTracker'
import { useUserStore } from '@/stores'

useShare({ title: '设置' })
useTrackPageView()

const router = useRouter()
const userStore = useUserStore()
const { currentPrimaryColorLabel, setPrimaryColor, themeColorOptions } = useTheme()

const logoutLoading = shallowRef(false)
const cacheSize = shallowRef('0KB')

/**
 * 清缓存时保留的 key，避免把用户数据一起清掉：
 * - user：user store 的持久化数据（登录态）
 * - app-theme-primary-color：主题色（useTheme）
 * - search-history：搜索页历史记录
 * - tracker_queue：埋点失败待重试队列
 */
const PRESERVED_STORAGE_KEYS = ['user', 'app-theme-primary-color', 'search-history', 'tracker_queue']

const readCacheSize = () => {
  try {
    const { currentSize } = uni.getStorageInfoSync()
    cacheSize.value = `${currentSize}KB`
  } catch {
    cacheSize.value = '0KB'
  }
}

onLoad(readCacheSize)

const handleThemeChange = () => {
  uni.showActionSheet({
    itemList: themeColorOptions.map(item => item.label),
    success: ({ tapIndex }) => {
      const selected = themeColorOptions[tapIndex]
      if (selected) setPrimaryColor(selected.value)
    },
  })
}

const handleClearCache = () => {
  uni.showModal({
    title: '清除缓存',
    content: '将清除接口数据与临时文件等缓存，登录状态、主题色和搜索历史会保留。',
    success: ({ confirm }) => {
      if (!confirm) return

      try {
        const { keys } = uni.getStorageInfoSync()
        keys
          .filter(key => !PRESERVED_STORAGE_KEYS.includes(key))
          .forEach(key => uni.removeStorageSync(key))

        readCacheSize()
        uni.showToast({ title: '已清除', icon: 'success' })
      } catch {
        uni.showToast({ title: '清除失败', icon: 'none' })
      }
    },
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确认退出当前账号？',
    success: async ({ confirm }) => {
      if (!confirm) return

      try {
        logoutLoading.value = true
        await mockLogout()
        userStore.logout()
        uni.showToast({ title: '已退出登录', icon: 'success' })
        setTimeout(() => {
          router.push({ name: 'login' })
        }, 600)
      } finally {
        logoutLoading.value = false
      }
    },
  })
}
</script>

<template>
  <z-paging :show-scrollbar="false">
    <template #top>
      <Navbar title="设置" />
    </template>

    <view class="settings-page">
      <wd-cell-group border custom-class="settings-page__group">
        <wd-cell title="主题色" :value="currentPrimaryColorLabel" clickable @click="handleThemeChange" />
        <wd-cell title="清除缓存" :value="cacheSize" clickable @click="handleClearCache" />
      </wd-cell-group>

      <wd-cell-group border custom-class="settings-page__group">
        <wd-cell title="关于我们" is-link @click="router.push({ name: 'about' })" />
        <wd-cell title="协议与条款" is-link @click="router.push({ name: 'agreement' })" />
      </wd-cell-group>

      <view v-if="userStore.isLogin" class="settings-page__footer">
        <wd-button plain block type="danger" :loading="logoutLoading" @click="handleLogout">
          退出登录
        </wd-button>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.settings-page {
  min-height: 100%;
  padding: 32rpx;
  background: var(--app-color-surface-muted);

  &__group {
    overflow: hidden;
    border: 1rpx solid var(--app-color-border);
    border-radius: 16rpx;

    & + & {
      margin-top: 24rpx;
    }
  }

  &__footer {
    margin-top: 48rpx;
  }
}
</style>
