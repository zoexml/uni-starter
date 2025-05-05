<route lang="json5" type="page">
{
  layout: 'default',
  name: 'demo',
  style: {
    navigationBarTitleText: 'demo',
  },
}
</route>

<script lang="ts" setup>
const paging = ref(null)

// v-model绑定的这个变量不要在分页请求结束中自己赋值，直接使用即可
const dataList = ref(40)

const queryList = async (pageNo: number, pageSize: number) => {
  try {
    const queryParams = {
      IsNotPage: false,
      CurrentPage: pageNo,
      PageSize: pageSize,
    }

    console.log('queryParams----', queryParams)
    // const res = await QueryMyToDoTaskAPI(queryParams)
    // 将请求结果通过complete传给z-paging处理,同时也代表请求结束，这一行必须调用
    // paging.value?.complete(res?.Data)
  } catch (error) {
    console.log(error)
    // paging.value?.complete(false)
  }
}
</script>

<template>
  <z-paging ref="paging" @query="queryList">
    <template #top>
      <ENavbar title="标题" />
    </template>
    <!-- 页面内容 -->

    <view v-for="(item, index) in dataList" :key="index" class="item">
      <view class="item-title">
        {{ item }}
      </view>
    </view>

    <template #bottom>
      <!-- 不使用z-paging 的 safe-area-inset-bottom -->
      <view class="bottom-box p-x-44rpx pt-10rpx pb-safe">
        <button class="bottom-btn">
          底部按钮
        </button>
      </view>
    </template>
  </z-paging>
</template>

<style lang="scss" scoped>
.bottom-box {
  @apply flex-center;

  width: 100%;
  background: #fff;

  .bottom-btn {
    @apply flex-center;

    width: 100%;
    height: 78rpx;
    background: #ab927f;
    border-radius: 10rpx;
  }
}
</style>
