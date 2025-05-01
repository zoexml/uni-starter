import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  globalStyle: {
    // backgroundColor: '@bgColor',
    // backgroundColorBottom: '@bgColorBottom',
    // backgroundColorTop: '@bgColorTop',
    // backgroundTextStyle: '@bgTxtStyle',
    // navigationBarBackgroundColor: '#000000',
    navigationBarTextStyle: '@navTxtStyle',
    navigationBarTitleText: 'uni-temp',
    navigationStyle: 'custom',
  },
  easycom: {
    autoscan: true,
    custom: {
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)': 'z-paging/components/z-paging$1/z-paging$1.vue',
      '^wd-(.*)': 'wot-design-uni/components/wd-$1/wd-$1.vue',
      // '^Yhc(.*)': '@/components/Yhc$1.vue',
    },
  },
  tabBar: {
    // custom: true,
    color: '#999999',
    selectedColor: '#018d71',
    backgroundColor: '#F8F8F8',
    borderStyle: 'black',
    // height: '0',
    fontSize: '10px',
    iconWidth: '24px',
    spacing: '3px',
    list: [
      {
        text: '首页',
        pagePath: 'pages/index/index',
        iconPath: 'static/tabs/home-default.png',
        selectedIconPath: 'static/tabs/home-active.png',
      },
      {
        text: '我的',
        pagePath: 'pages/my/index',
        iconPath: 'static/tabs/my-default.png',
        selectedIconPath: 'static/tabs/my-active.png',
      },
    ],
  },
})
