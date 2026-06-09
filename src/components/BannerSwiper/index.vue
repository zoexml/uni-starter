<script lang="ts" setup>
import { buildWebViewPageUrl } from '@/composables/useWebView'

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

const props = defineProps({
  banner: {
    type: Object as PropType<BannerConfig | null>,
    default: null,
  },
})

const autoplayEnabled = ref(true)
let resumeTimer: ReturnType<typeof setTimeout> | null = null

const isSingle = computed(() => (props.banner?.items?.length ?? 0) === 1)

const shouldRender = computed(() => {
  return props.banner?.enabled && (props.banner?.items?.length ?? 0) > 0
})

const swiperInterval = computed(() => {
  const interval = props.banner?.interval
  return interval && interval > 0 ? interval : 3000
})

const pauseAndResumeAutoplay = () => {
  if (isSingle.value) return
  autoplayEnabled.value = false
  if (resumeTimer) clearTimeout(resumeTimer)
  resumeTimer = setTimeout(() => {
    autoplayEnabled.value = true
  }, 5000)
}

const handleChange = (e: { detail: { current: number, source?: string } }) => {
  if (e.detail.source === 'touch') {
    pauseAndResumeAutoplay()
  }
}

const handleClick = (item: BannerItem) => {
  if (!item.link) return

  if (item.link.startsWith('http://') || item.link.startsWith('https://')) {
    uni.navigateTo({ url: buildWebViewPageUrl({ url: item.link }) })
  } else if (item.link.startsWith('/')) {
    uni.navigateTo({ url: item.link })
  }
}

onBeforeUnmount(() => {
  if (resumeTimer) clearTimeout(resumeTimer)
})
</script>

<template>
  <view v-if="shouldRender" class="banner-swiper">
    <swiper
      :autoplay="!isSingle && autoplayEnabled"
      :interval="swiperInterval"
      :circular="!isSingle"
      :indicator-dots="!isSingle"
      indicator-color="rgba(255, 255, 255, 0.4)"
      indicator-active-color="rgba(255, 255, 255, 0.9)"
      class="banner-swiper__swiper"
      @change="handleChange"
    >
      <swiper-item v-for="(item, index) in banner!.items" :key="index">
        <image
          :src="item.image"
          mode="aspectFill"
          class="banner-swiper__image"
          @click="handleClick(item)"
        />
      </swiper-item>
    </swiper>
  </view>
</template>

<style lang="scss" scoped>
.banner-swiper {
  width: 100%;

  &__swiper {
    width: 100%;
    height: 300rpx;
  }

  &__image {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
