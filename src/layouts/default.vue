<script lang="ts" setup>
import type { ConfigProviderThemeVars } from '@wot-ui/ui'

const themeVars = reactive<ConfigProviderThemeVars>({
  // primary6: '#FF5454',
  // tabsNavLineBgColor: 'red',
  // navbarColor: '#ffffff',
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
  <wd-config-provider :theme-vars="themeVars" custom-style="background-color: #F9F9F8;min-height: 100vh">
    <slot />
    <wd-notify />
    <wd-toast />
    <wd-dialog />
    <!-- <privacy-popup /> -->
  </wd-config-provider>
</template>
