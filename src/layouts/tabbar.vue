<script lang="ts" setup>
import { useTheme } from '@/composables/theme/theme'
import { useTabbar } from '@/composables/useTabbar'

const router = useRouter()
const route = useRoute()

const { themeVars, theme } = useTheme()

const { activeTabbar, getTabbarItemValue, setTabbarItemActive, tabbarList } = useTabbar()

function handleTabbarChange({ value }: { value: string }) {
  setTabbarItemActive(value)
  router.pushTab({ name: value })
}

onMounted(() => {
  nextTick(() => {
    if (route.name && route.name !== activeTabbar.value.name) {
      setTabbarItemActive(route.name)
    }
  })
})

onShow(() => {
  // #ifdef APP-PLUS
  uni.hideTabBar()
  // #endif
})
</script>

<script lang="ts">
export default {
  options: {
    addGlobalClass: true,
    virtualHost: true,
    styleIsolation: 'shared',
  },
}
</script>

<template>
  <wd-config-provider :theme-vars="themeVars" custom-style="min-height: 100vh" :theme="theme">
    <wd-navbar :title="activeTabbar.title" safe-area-inset-top placeholder fixed :bordered="false" />

    <slot />

    <wd-tabbar v-model="activeTabbar.name" placeholder bordered safeAreaInsetBottom fixed @change="handleTabbarChange">
      <wd-tabbar-item v-for="(item, index) in tabbarList" :key="index" :name="item.name" :value="getTabbarItemValue(item.name)" :title="item.title" :icon="item.icon" />
    </wd-tabbar>

    <wd-notify />
    <wd-toast />
    <wd-message-box />
    <!-- <privacy-popup /> -->
  </wd-config-provider>
</template>
