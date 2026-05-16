// badge 显示一个数字或 小红点（样式可以直接在 tabbar/index.vue 里面修改）
export type CustomTabBarItemBadge = number | 'dot'

export interface CustomTabBarItem {
  text?: string
  pagePath: string
  iconType?: 'uniUi' | 'uiLib' | 'unocss' | 'iconfont' | 'image' // 不建议用 image 模式，需要配置2张图
  icon?: any // 其实是 string 类型，这里是为了避免 ts 报错 (tabbar/index.vue 里面 uni-icons 那行)
  iconActive?: string // 只有在 image 模式下才需要，传递的是高亮的图片（PS： 不建议用 image 模式）
  badge?: CustomTabBarItemBadge
  isBulge?: boolean // 是否是中间的鼓包tabbarItem
}
