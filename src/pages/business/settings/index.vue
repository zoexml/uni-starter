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
import { useTheme } from '@/composables/useTheme'
import { useTrackPageView } from '@/composables/useTracker'
import { buildAgreementDetailRoute } from '@/utils/agreement'
import { clearAppCache, readStorageSize } from '@/utils/storage'

useShare({ title: '设置' })
useTrackPageView()

const router = useRouter()
const { currentPrimaryColor, currentPrimaryColorLabel, setPrimaryColor, themeColorOptions } = useTheme()

const cacheSize = shallowRef('0KB')

/** 缓存占用与清理逻辑统一在 @/utils/storage，避免与「我的」页各写一套 */
const readCacheSize = () => {
  cacheSize.value = readStorageSize()
}

onLoad(readCacheSize)

/** 协议与隐私直接进详情页，不再经过协议列表页 */
const openAgreement = (type: 'user' | 'privacy') => {
  router.push(buildAgreementDetailRoute(type))
}

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
        clearAppCache()
        readCacheSize()
        uni.showToast({ title: '已清除', icon: 'success' })
      } catch {
        uni.showToast({ title: '清除失败', icon: 'none' })
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
      <view class="settings-page__group">
        <wd-cell-group border>
          <wd-cell title="主题色" clickable @click="handleThemeChange">
            <!-- 默认插槽落在右侧 value 区：把当前颜色以圆点形式呈现出来，而不是只显示名字 -->
            <view class="settings-page__color">
              <view class="settings-page__color-dot" :style="{ backgroundColor: currentPrimaryColor }" />
              <text>{{ currentPrimaryColorLabel }}</text>
            </view>
          </wd-cell>
          <wd-cell title="清除缓存" :value="cacheSize" clickable @click="handleClearCache" />
        </wd-cell-group>
      </view>

      <view class="settings-page__group">
        <wd-cell-group border>
          <wd-cell title="关于我们" is-link @click="router.push({ name: 'about' })" />
          <wd-cell title="用户协议" is-link @click="openAgreement('user')" />
          <wd-cell title="隐私政策" is-link @click="openAgreement('privacy')" />
        </wd-cell-group>
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

  &__color {
    display: flex;
    gap: 12rpx;
    align-items: center;
    justify-content: flex-end;
  }

  &__color-dot {
    width: 28rpx;
    height: 28rpx;
    border: 1rpx solid var(--app-color-border);
    border-radius: 50%;
  }
}
</style>
