interface BannerItem {
  image: string
  link: string
}

interface BannerConfig {
  enabled: boolean
  autoplay?: boolean
  interval?: number
  items: BannerItem[]
}

interface SearchBarConfig {
  enabled: boolean
  placeholder: string
  navigateTo: string
}

interface NavGridConfig {
  enabled: boolean
  columns: number
  showRows: number
  items: { icon: string, text: string, link: string }[]
}

interface FeedConfig {
  enabled: boolean
  pageSize: number
  cardStyle: string
  api: { url: string, method: string }
}

interface HomepageConfig {
  searchBar: SearchBarConfig
  banner: BannerConfig
  navGrid: NavGridConfig
  feed: FeedConfig
}

export const homepageConfig: HomepageConfig = {
  searchBar: {
    enabled: false,
    placeholder: '搜索内容',
    navigateTo: '/pages/search/index',
  },
  banner: {
    enabled: true,
    autoplay: true,
    interval: 3000,
    items: [
      { image: '/static/banner/1.jpg', link: '/pages/index/index' },
      { image: '/static/banner/2.jpg', link: 'https://m.baidu.com' },
      { image: '/static/banner/3.jpg', link: '/pages/login/index' },
    ],
  },
  navGrid: {
    enabled: false,
    columns: 4,
    showRows: 2,
    items: [],
  },
  feed: {
    enabled: false,
    pageSize: 10,
    cardStyle: 'image-left',
    api: {
      url: '/api/feed/list',
      method: 'GET',
    },
  },
}
