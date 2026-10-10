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
import type { UploadResult, UploadTask } from '@/types/upload'
import { useTracker, useTrackPageView } from '@/composables/useTracker'
import { useUpload } from '@/composables/useUpload'

useShare({ title: '上传示例' })
useTrackPageView()

const { track } = useTracker()

/**
 * 默认走模板 mock 凭证，直传地址为空时会自动走本地模拟上传。
 * 接真实后端时改为：useUpload({ getSignature: fetchUploadSignatureApi })
 */
const { tasks, uploading, uploadFile, uploadFiles, reset, maxSize, formatSize } = useUpload({
  onSuccess: (result: UploadResult) => {
    track('upload_success', { size: result.fileSize })
    uni.showToast({ title: '上传成功', icon: 'success' })
  },
  onError: (error: Error) => {
    uni.showToast({ title: error.message || '上传失败', icon: 'none' })
  },
})

/** 用静态资源模拟「选中的文件」，方便在开发工具里直接跑通流程 */
const demoFilePaths = [
  '/static/images/logo.svg',
  '/static/images/vite.png',
]

const handlePickImage = async () => {
  try {
    const res = await uni.chooseImage({ count: 1, sizeType: ['compressed'] })
    const path = res.tempFilePaths?.[0]
    if (!path) return

    await uploadFile(path)
  } catch (error) {
    // 用户取消选图也会走到这里，非报错时不打扰
    const message = error instanceof Error ? error.message : ''
    if (message && !message.includes('cancel')) {
      uni.showToast({ title: message, icon: 'none' })
    }
  }
}

const handleUploadDemoFile = () => uploadFile(demoFilePaths[0])

const handleUploadBatch = async () => {
  const { success, failed } = await uploadFiles(demoFilePaths)

  uni.showToast({
    title: `成功 ${success.length} 个，失败 ${failed.length} 个`,
    icon: 'none',
  })
}

const statusText: Record<UploadTask['status'], string> = {
  pending: '等待中',
  uploading: '上传中',
  success: '已完成',
  failed: '失败',
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
          useUpload
        </view>
        <view class="upload-card__desc">
          取直传凭证 → uni.uploadFile 直传对象存储 → 统一归一化结果。
          默认走 mock 凭证，返回空 uploadUrl 时自动走本地模拟上传。
        </view>
        <view class="upload-card__meta">
          单文件上限 {{ formatSize(maxSize) }}，仅微信小程序端能上报真实进度。
        </view>
      </view>

      <view class="upload-actions">
        <wd-button type="primary" block :loading="uploading" @click="handlePickImage">
          选择图片上传
        </wd-button>
        <wd-button plain block :loading="uploading" @click="handleUploadDemoFile">
          上传示例文件
        </wd-button>
        <wd-button plain block :loading="uploading" @click="handleUploadBatch">
          批量上传（串行）
        </wd-button>
        <wd-button plain block type="danger" :disabled="uploading" @click="reset">
          清空任务列表
        </wd-button>
      </view>

      <view v-if="tasks.length" class="upload-section">
        <view class="upload-section__title">
          上传任务
        </view>

        <view v-for="(task, index) in tasks" :key="task.path + index" class="upload-task">
          <view class="upload-task__head">
            <text class="upload-task__name">
              {{ task.fileName }}
            </text>
            <text class="upload-task__status" :class="`upload-task__status--${task.status}`">
              {{ statusText[task.status] }}
            </text>
          </view>

          <wd-progress :percentage="task.progress" :show-value="true" />

          <text v-if="task.message" class="upload-task__message">
            {{ task.message }}
          </text>
          <text v-else-if="task.url" class="upload-task__url">
            {{ task.url }}
          </text>
        </view>
      </view>

      <view v-else class="upload-empty">
        <wd-empty title="暂无上传任务" />
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

.upload-actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.upload-section {
  padding: 32rpx;
  background: var(--app-color-surface);
  border: 1rpx solid var(--app-color-border);
  border-radius: 16rpx;

  &__title {
    margin-bottom: 24rpx;
    font-size: 30rpx;
    font-weight: 600;
    line-height: 1.35;
    color: var(--app-color-text);
  }
}

.upload-task {
  padding: 24rpx;
  background: var(--app-color-surface-muted);
  border-radius: 12rpx;

  & + & {
    margin-top: 20rpx;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;
  }

  &__name {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 26rpx;
    color: var(--app-color-text-regular);
    white-space: nowrap;
  }

  &__status {
    flex-shrink: 0;
    margin-left: 16rpx;
    font-size: 22rpx;
    color: var(--app-color-text-tertiary);

    &--uploading {
      color: var(--wot-primary-6);
    }

    &--success {
      color: #07c160;
    }

    &--failed {
      color: var(--app-color-danger);
    }
  }

  &__message {
    display: block;
    margin-top: 12rpx;
    font-size: 22rpx;
    line-height: 1.5;
    color: var(--app-color-danger);
  }

  &__url {
    display: block;
    margin-top: 12rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 22rpx;
    line-height: 1.5;
    color: var(--app-color-text-tertiary);
    white-space: nowrap;
  }
}

.upload-empty {
  padding: 80rpx 0;
}
</style>
