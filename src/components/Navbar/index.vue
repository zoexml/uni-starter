<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  leftArrow: {
    type: Boolean,
    default: true,
  },
})

const attrs = useAttrs()
// const slots = useSlots()

/**
 * 默认点击左侧箭头返回上一页。
 * 页面通过 @click-left 传入自己的处理时（如客服页「返回会话列表」不再退出页面），
 * 外部 handler 与本方法会被 Vue 合并成数组，两者都会执行，
 * 因此这里检测到外部 handler 就跳过内置返回，避免页面被意外关闭。
 */
const clickLeft = () => {
  if (attrs.onClickLeft) return

  uni.navigateBack()
}
</script>

<template>
  <wd-navbar :title="props.title" :left-arrow="props?.leftArrow" safe-area-inset-top placeholder fixed :bordered="false" v-bind="attrs" @click-left="clickLeft">
    <!-- <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot v-bind="slotData || {}" :name="name" />
    </template> -->
  </wd-navbar>
</template>

<style lang="scss" scoped>
//
</style>
