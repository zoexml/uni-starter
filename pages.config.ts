import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'
import { tabBar } from './src/tabbar/config'

export default defineUniPages({
  globalStyle: {
    // backgroundColor: '@bgColor',
    // backgroundColorBottom: '@bgColorBottom',
    // backgroundColorTop: '@bgColorTop',
    // backgroundTextStyle: '@bgTxtStyle',
    // navigationBarBackgroundColor: '#000000', // 导航栏背景颜色（同状态栏背景色）
    navigationBarTextStyle: '@navTxtStyle',
    navigationBarTitleText: 'uni-temp',
    navigationStyle: 'custom',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)': 'z-paging/components/z-paging$1/z-paging$1.vue',
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
    },
  },
  // tabbar 的配置统一在 “./src/tabbar/config.ts” 文件中
  tabBar: tabBar as any,
})
