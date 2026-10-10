<script setup lang="ts">
import type { CustomTabBarItem } from '@/types/tabbar'
import { onShow } from '@dcloudio/uni-app'
import { useTheme } from '@/composables/useTheme'
import { customTabbarEnable, needHideNativeTabbar, tabbarCacheEnable } from './config'
import { isPageTabbar, tabbarList, tabbarStore } from './store'

// #ifdef MP-WEIXIN
defineOptions({
  virtualHost: true,
})
// #endif

const { currentPrimaryColor } = useTheme()
const isCurrentTabbarPage = shallowRef(false)

const INACTIVE_COLOR = '#666'
const TABBAR_ICON_CLASS = 'wd-tabbar-item__body-icon'

const handleClickBulge = () => {
  uni.showToast({
    title: '点击了中间的鼓包tabbarItem',
    icon: 'none',
  })
}

const handleChange = (event: { value: number | string }) => {
  const index = Number(event.value)
  const item = tabbarList[index]

  if (!item || index === tabbarStore.curIdx) {
    return
  }

  if (item.isBulge) {
    handleClickBulge()
    return
  }

  tabbarStore.setCurIdx(index)

  if (tabbarCacheEnable) {
    uni.switchTab({ url: item.pagePath })
  } else {
    uni.navigateTo({ url: item.pagePath })
  }
}

const getCurrentPagePath = () => {
  const currentPage = getCurrentPages().at(-1)

  if (!currentPage?.route) return ''

  return currentPage.route.startsWith('/') ? currentPage.route : `/${currentPage.route}`
}

const updateCurrentTabbarState = () => {
  const currentPath = getCurrentPagePath()
  isCurrentTabbarPage.value = isPageTabbar(currentPath)

  if (isCurrentTabbarPage.value) {
    tabbarStore.setAutoCurIdx(currentPath)
  }
}

const hideNativeTabbar = () => {
  if (!needHideNativeTabbar) return

  // #ifndef MP-WEIXIN
  uni.hideTabBar({
    fail(err) {
      console.log('hideTabBar fail: ', err)
    },
  })
  // #endif
}

onLoad(() => {
  updateCurrentTabbarState()
  hideNativeTabbar()
})

onShow(updateCurrentTabbarState)

const isImageMode = (item: CustomTabBarItem) => item.iconType === 'image'

const getIconByActive = (item: CustomTabBarItem, active: boolean) => {
  return active && item.iconActive ? item.iconActive : item.icon
}

const getIconColor = (active: boolean) => {
  return active ? currentPrimaryColor.value : INACTIVE_COLOR
}
</script>

<template>
  <wd-tabbar
    v-if="customTabbarEnable && isCurrentTabbarPage"
    :model-value="tabbarStore.curIdx"
    bordered safe-area-inset-bottom placeholder fixed
    :active-color="currentPrimaryColor"
    :inactive-color="INACTIVE_COLOR"
    @change="handleChange"
  >
    <wd-tabbar-item
      v-for="(item, index) in tabbarList"
      :key="index"
      :name="index"
      :title="item.text"
      :value="typeof item.badge === 'number' ? item.badge : undefined"
      :is-dot="item.badge === 'dot'"
    >
      <template #icon="{ active }">
        <view v-if="item.isBulge" class="tabbar-bulge">
          <image class="tabbar-bulge-image" src="/static/tabbar/scan.png" mode="scaleToFill" />
        </view>

        <wd-icon
          v-else-if="item.iconType === 'uiLib' || !item.iconType"
          :name="item.icon"
          :color="getIconColor(active)"
          :custom-class="TABBAR_ICON_CLASS"
        />

        <view
          v-else-if="item.iconType === 'unocss' || item.iconType === 'iconfont'"
          :class="[item.icon, TABBAR_ICON_CLASS]"
          :style="{ color: getIconColor(active) }"
        />

        <image
          v-else-if="isImageMode(item)"
          :src="getIconByActive(item, active)"
          class="tabbar-image-icon"
          mode="scaleToFill"
        />
      </template>
    </wd-tabbar-item>
  </wd-tabbar>
</template>

<style scoped lang="scss">
.tabbar-bulge {
  position: relative;

  .tabbar-bulge-image {
    width: 100rpx;
    height: 100rpx;
    margin-top: 3rpx;
  }
}

.tabbar-image-icon {
  width: 24px;
  height: 24px;
}
</style>
