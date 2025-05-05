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

const clickLeft = () => {
  uni.navigateBack()
}
</script>

<template>
  <wd-navbar :title="props.title" :leftArrow="props?.leftArrow" safe-area-inset-top placeholder fixed :bordered="false" v-bind="attrs" @click-left="clickLeft">
    <!-- <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot v-bind="slotData || {}" :name="name" />
    </template> -->
  </wd-navbar>
</template>

<style lang="scss" scoped>
//
</style>
