<route lang="json5" type="page">
{
  layout: 'default',
  name: 'demo',
  meta: {
    requiresAuth: true,
    permissions: ['demo:view'],
  },
  style: {
    navigationBarTitleText: 'demo',
  },
}
</route>

<script lang="ts" setup>
const confirmVisible = shallowRef(false)
const actionSheetVisible = shallowRef(false)
const optionPickerVisible = shallowRef(false)
const datePickerVisible = shallowRef(false)
const selectedOption = shallowRef('hk')
const selectedDate = shallowRef('2026-05-16')

const actionItems = [
  { name: '拍照上传', value: 'camera' },
  { name: '从相册选择', value: 'album' },
  { name: '删除当前文件', type: 'danger' as const, value: 'delete' },
]

const optionItems = [
  { label: '香港优才', value: 'hk' },
  { label: '高端人才通行证', value: 'top-talent' },
  { label: '企业家计划', value: 'founder' },
]

const goodsItem = {
  desc: '迁移自 diy-mini 商品卡片结构，已改造为 Vue 组件接口。',
  image: '/static/images/logo.svg',
  originPrice: 699,
  price: 399,
  title: '模板组件迁移服务包',
}

const informationItem = {
  image: '/static/images/logo.svg',
  time: '2026-05-16',
  title: 'diy-mini 可复用组件已迁移为 uni-app Vue3 组件',
}

const longText = '这是一段用于测试展开收起能力的长文本。组件迁移时没有直接复制原生小程序 WXML，而是保留交互意图并重写为 Vue 3 单文件组件。这样可以继续沿用当前项目的 TypeScript、组合式 API、SCSS 嵌套写法和 uni-app 多端能力。'

const showToast = (title: string) => {
  uni.showToast({
    icon: 'none',
    title,
  })
}

const handleActionSelect = (item: { name: string }) => {
  showToast(`选择了：${item.name}`)
}

const handleConfirm = () => {
  showToast('已确认')
}

const handleOptionConfirm = (value: string | number) => {
  showToast(`已选择：${value}`)
}

const handleDateConfirm = (value: string) => {
  showToast(`日期：${value}`)
}
</script>

<template>
  <z-paging :show-scrollbar="true">
    <template #top>
      <Navbar title="组件示例" />
    </template>

    <view class="demo-page">
      <view class="demo-section">
        <view class="demo-section__title">
          反馈组件
        </view>
        <view class="demo-section__actions">
          <wd-button type="primary" block @click="confirmVisible = true">
            打开确认弹窗
          </wd-button>
          <wd-button plain block @click="actionSheetVisible = true">
            打开操作面板
          </wd-button>
        </view>
      </view>

      <view class="demo-section">
        <view class="demo-section__title">
          选择器
        </view>
        <view class="demo-section__value">
          当前方案：{{ selectedOption }} / 日期：{{ selectedDate }}
        </view>
        <view class="demo-section__actions">
          <wd-button plain block @click="optionPickerVisible = true">
            打开选项选择器
          </wd-button>
          <wd-button plain block @click="datePickerVisible = true">
            打开日期选择器
          </wd-button>
        </view>
      </view>

      <view class="demo-section">
        <view class="demo-section__title">
          展示组件
        </view>
        <GoodsCard :item="goodsItem" @click="showToast('点击商品卡片')" />
        <InformationCard :item="informationItem" @click="showToast('点击资讯卡片')" />
      </view>

      <view class="demo-section">
        <view class="demo-section__title">
          长文本
        </view>
        <ExpandableText :content="longText" :threshold="48" />
      </view>
    </view>

    <ConfirmDialog
      v-model="confirmVisible"
      title="确认操作"
      message="这是从 diy-mini confirmModal 迁移后的 Vue 组件。"
      @confirm="handleConfirm"
    />
    <ActionSheet v-model="actionSheetVisible" title="上传材料" :actions="actionItems" @select="handleActionSelect" />
    <OptionPicker
      v-model="selectedOption"
      v-model:visible="optionPickerVisible"
      title="选择方案"
      :options="optionItems"
      @confirm="handleOptionConfirm"
    />
    <DatePicker v-model="selectedDate" v-model:visible="datePickerVisible" title="选择日期" @confirm="handleDateConfirm" />
    <FloatingService label="客服" @click="showToast('点击浮动客服')" />
  </z-paging>
</template>

<style lang="scss" scoped>
.demo-page {
  min-height: 100%;
  padding: 32rpx;
  background: #f6f8f7;

  .demo-section {
    padding: 28rpx;
    margin-bottom: 24rpx;
    background: #fff;
    border: 1rpx solid #edf1ef;
    border-radius: 16rpx;

    &__title {
      margin-bottom: 20rpx;
      font-size: 30rpx;
      font-weight: 700;
      line-height: 1.4;
      color: #17211d;
    }

    &__value {
      margin-bottom: 20rpx;
      font-size: 26rpx;
      line-height: 1.5;
      color: #66736e;
    }

    &__actions {
      display: flex;
      flex-direction: column;
      gap: 18rpx;
    }

    :deep(.e-goods-card) {
      margin-bottom: 20rpx;
    }
  }
}
</style>
