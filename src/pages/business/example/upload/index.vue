<route lang="json5" type="page">
{
  layout: 'default',
  name: 'example-upload',
  meta: {
    public: true,
  },
  style: {
    navigationBarTitleText: '上传示例',
  },
}
</route>

<script lang="ts" setup>
import type { UploadFileItem, UploadMethod } from '@wot-ui/ui/components/wd-upload/types'
import { useTrackPageView } from '@/composables/useTracker'
import { useUpload } from '@/composables/useUpload'

useShare({ title: '上传示例' })
useTrackPageView()

/**
 * 组件式上传：wd-upload 负责选图、列表、进度与失败态，
 * 真正的上传动作通过 uploadMethod 交给 useUpload，
 * 这样签名获取、直传、错误提示仍复用同一套封装。
 */
const { uploading, uploadFile, formatSize } = useUpload({
  onError: (error: Error) => {
    uni.showToast({ title: error.message || '上传失败', icon: 'none' })
  },
})

/** wd-upload 的文件列表（v-model 双向绑定） */
const fileList = ref<UploadFileItem[]>([])

const MAX_SIZE = 5 * 1024 * 1024

/** 桥接 useUpload：把组件的回调风格转成 Promise 风格 */
const handleUpload: UploadMethod = async (uploadFileItem, _formData, options) => {
  try {
    const result = await uploadFile(uploadFileItem.url, { source: 'wd-upload' })

    // 告诉组件上传成功，组件会把状态置为 success 并显示 url
    options.onSuccess(
      { statusCode: 200, data: JSON.stringify(result.response ?? {}) } as UniApp.UploadFileSuccessCallbackResult,
      uploadFileItem,
      {},
    )
  } catch (error) {
    options.onError(
      { errMsg: error instanceof Error ? error.message : '上传失败' } as UniApp.GeneralCallbackResult,
      uploadFileItem,
      {},
    )
  }
}

/** 选图前的本地校验，避免把明显不合规的文件送去上传 */
const handleBeforeUpload = ({ files }: { files: Record<string, any>[] }) => {
  for (const file of files) {
    const size = Number(file.size ?? 0)
    if (size > MAX_SIZE) {
      uni.showToast({ title: `${file.name || '文件'} 超过 ${formatSize(MAX_SIZE)}`, icon: 'none' })
      return false
    }
  }

  return true
}

/** 统计上传成功的数量，便于展示 */
const finishedCount = computed(() => fileList.value.filter(item => item.status === 'success').length)

const handleRemove = () => {
  uni.showToast({ title: '已移除该文件', icon: 'none' })
}
</script>

<template>
  <z-paging :show-scrollbar="false">
    <template #top>
      <Navbar title="文件上传" />
    </template>

    <view class="upload-page">
      <view class="upload-card">
        <view class="upload-card__title">
          wd-upload + useUpload
        </view>
        <view class="upload-card__desc">
          组件负责选图、文件列表、进度与失败态；上传动作通过 uploadMethod 交给
          useUpload 统一处理签名获取与直传，业务字段可放在第二个参数里一起提交。
        </view>
        <view class="upload-card__meta">
          单文件上限 {{ formatSize(MAX_SIZE) }}，已成功 {{ finishedCount }} 个。
        </view>
      </view>

      <view class="upload-card">
        <wd-upload
          v-model="fileList"
          image
          :limit="5"
          :disabled="uploading"
          :upload-method="handleUpload"
          :before-upload="handleBeforeUpload"
          @remove="handleRemove"
        />
      </view>

      <view class="upload-section">
        <view class="upload-section__title">
          关键参数
        </view>
        <view class="upload-section__desc">
          image 开启图片选择；limit 限制数量；before-upload 在选图后、上传前做本地校验；
          uploadMethod 接管上传实现，调用 options.onSuccess / onError / onProgress
          把结果回传组件，组件据此更新状态与进度。
        </view>
      </view>
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.upload-page {
  min-height: 100%;
  padding: 32rpx;
  background: var(--app-color-surface-muted);
}

.upload-card {
  padding: 32rpx;
  margin-bottom: 24rpx;
  background: var(--app-color-surface);
  border: 1rpx solid var(--app-color-border);
  border-radius: 16rpx;

  &__title {
    font-size: 32rpx;
    font-weight: 600;
    line-height: 1.35;
    color: var(--app-color-text);
  }

  &__desc {
    margin-top: 12rpx;
    font-size: 24rpx;
    line-height: 1.6;
    color: var(--app-color-text-secondary);
  }

  &__meta {
    margin-top: 12rpx;
    font-size: 22rpx;
    line-height: 1.5;
    color: var(--app-color-text-tertiary);
  }
}

.upload-section {
  padding: 32rpx;
  background: var(--app-color-surface);
  border: 1rpx solid var(--app-color-border);
  border-radius: 16rpx;

  &__title {
    margin-bottom: 16rpx;
    font-size: 30rpx;
    font-weight: 600;
    line-height: 1.35;
    color: var(--app-color-text);
  }

  &__desc {
    font-size: 24rpx;
    line-height: 1.6;
    color: var(--app-color-text-secondary);
  }
}
</style>
