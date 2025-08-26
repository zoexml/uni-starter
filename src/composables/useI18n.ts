// import en from '@/locale/en.json'
// import zh from '@/locale/zh-Hans.json'
// import { useUserStore } from '@/store'
// import { Locale, useCurrentLang } from 'wot-design-uni'

// import enUS from 'wot-design-uni/locale/lang/en-US'
// import zhCN from 'wot-design-uni/locale/lang/zh-CN'

// export const useI18n = () => {
//   const store = useUserStore()
//   const pagePath = getCurrentPages()
//   const pagePathKey = pagePath[pagePath.length - 1].route.replace(/\//g, '.')

//   const t = (key, type?: string) => {
//     /* 如果国际化是元素，直接返回，如果是 ref 中的数据就需要加 computed 不然不会动态变化 */
//     if (type === 'text') {
//       return computed(() => {
//         return (store.getLocale === 'zh-CN' ? zh[pagePathKey][key] : en[pagePathKey][key]) ?? ''
//       })
//     }
//     return (store.getLocale === 'zh-CN' ? zh[pagePathKey][key] : en[pagePathKey][key]) ?? ''
//   }

//   /* 切换 原生元素 语言 */
//   const changeNativeLang = () => {
//     // 切换 顶部导航栏 语言
//     uni.setNavigationBarTitle({
//       title: (store.getLocale === 'zh-CN' ? zh[pagePathKey]?.title : en[pagePathKey]?.title) ?? '',
//     })
//     // 切换 tabBar 语言
//     // ...
//   }

//   /* 切换 UI 库 语言 */
//   const changeUiLang = () => {
//     /* 设置 WotUI 组件语言 */
//     const wotUiCurrentLang = useCurrentLang().value
//     if (wotUiCurrentLang != store.getLocale) {
//       Locale.use(store.getLocale, store.getLocale === 'zh-CN' ? zhCN : enUS)
//     }
//   }

//   const setLocale = () => {
//     /* 切换 语言 */
//     store.setLocale()
//     changeNativeLang()
//     changeUiLang()
//   }

//   /* 页面初始化渲染一次 */
//   changeNativeLang()
//   changeUiLang()

//   return {
//     t,
//     setLocale,
//   }
// }
