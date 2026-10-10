<route lang="json5" type="page">
{
  layout: 'default',
  name: 'example-avatar',
  meta: {
    public: true,
  },
  style: {
    navigationBarTitleText: '头像上传',
  },
}
</route>

<script lang="ts" setup>
import type { UploadResult } from '@/types/upload'
import { getErrorMessage } from '@/utils'
import { useTrackPageView } from '@/composables/useTracker'
import { useUpload } from '@/composables/useUpload'

useShare({ title: '头像上传' })
useTrackPageView()

interface CropperConfirmResult {
  tempFilePath: string
  width: number
  height: number
}

/** 头像上传固定 1:1 裁剪，导出 jpg 压缩体积 */
const CROP_ASPECT_RATIO = '1:1'

const { uploadFile, uploading } = useUpload({
  onError: (error: Error) => {
    uni.showToast({ title: error.message || '上传失败', icon: 'none' })
  },
})

const avatarUrl = shallowRef('')
const cropperVisible = shallowRef(false)
const pickedImage = shallowRef('')
const cropperRef = shallowRef<{ resetImg: () => void, setRotate: (angle: number) => void } | null>(null)

/** 第一步：选图，拿到临时路径后打开裁剪器 */
const handlePickImage = async () => {
  try {
    const res = await uni.chooseImage({ count: 1, sizeType: ['original', 'compressed'] })
    const picked = res.tempFilePaths
    const path = Array.isArray(picked) ? picked[0] : picked
    if (!path) return

    pickedImage.value = path
    cropperVisible.value = true
  } catch (error) {
    // 用户主动取消不打扰；其余失败（含隐私授权未通过）都要提示出来，否则表现为"点了没反应"
    const message = getErrorMessage(error, '选择图片失败')
    if (!message.includes('cancel')) {
      uni.showToast({ title: message, icon: 'none' })
    }
  }
}

/** 第二步：裁剪确认后直接上传 */
const handleCropConfirm = async (result: CropperConfirmResult) => {
  cropperVisible.value = false
  pickedImage.value = ''

  try {
    const uploaded: UploadResult = await uploadFile(result.tempFilePath)
    avatarUrl.value = uploaded.url
    uni.showToast({ title: '头像已更新', icon: 'success' })
  } catch {
    // 失败提示已在 useUpload 的 onError 里处理
  }
}

const handleRotate = () => {
  cropperRef.value?.setRotate(90)
}

const handleResetCrop = () => {
  cropperRef.value?.resetImg()
}

const handleClear = () => {
  avatarUrl.value = ''
  uni.showToast({ title: '已清除', icon: 'none' })
}
</script>

<template>
  <z-paging :show-scrollbar="false">
    <template #top>
      <Navbar title="头像上传" />
    </template>

    <view class="avatar-page">
      <view class="avatar-card">
        <view class="avatar-card__title">
          选图 → 裁剪 → 上传
        </view>
        <view class="avatar-card__desc">
          用 wd-img-cropper 完成 1:1 裁剪与压缩，再交给 useUpload 直传，
          这是头像、封面、证照等场景的通用链路。
        </view>
      </view>

      <view class="avatar-preview">
        <view class="avatar-preview__frame">
          <image
            v-if="avatarUrl"
            class="avatar-preview__image"
            :src="avatarUrl"
            mode="aspectFill"
          />
          <wd-icon v-else name="user" custom-style="font-size: 64rpx; color: #b8c0bc;" />
        </view>
        <view class="avatar-preview__url">
          {{ avatarUrl || '尚未上传' }}
        </view>
      </view>

      <view class="avatar-actions">
        <wd-button type="primary" block :loading="uploading" @click="handlePickImage">
          选择图片并裁剪
        </wd-button>
        <wd-button v-if="avatarUrl" plain block type="danger" @click="handleClear">
          清除头像
        </wd-button>
      </view>

      <view class="avatar-section">
        <view class="avatar-section__title">
          裁剪器能力
        </view>
        <view class="avatar-section__desc">
          裁剪过程中可以旋转图片或重置为初始状态；确认后导出 jpg（质量 0.9）再上传，
          避免把原图直接传到对象存储。
        </view>
        <view class="avatar-section__actions">
          <wd-button size="small" plain :disabled="!cropperVisible" @click="handleRotate">
            旋转 90°
          </wd-button>
          <wd-button size="small" plain :disabled="!cropperVisible" @click="handleResetCrop">
            重置图片
          </wd-button>
        </view>
      </view>

      <wd-img-cropper
        ref="cropperRef"
        v-model="cropperVisible"
        :img-src="pickedImage"
        :aspect-ratio="CROP_ASPECT_RATIO"
        file-type="jpg"
        :quality="0.9"
        :export-scale="2"
        @confirm="handleCropConfirm"
      />
    </view>
  </z-paging>
</template>

<style lang="scss" scoped>
.avatar-page {
  min-height: 100%;
  padding: 32rpx;
  background: var(--app-color-surface-muted);
}

.avatar-card {
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
}

.avatar-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 32rpx;
  margin-bottom: 24rpx;
  background: var(--app-color-surface);
  border: 1rpx solid var(--app-color-border);
  border-radius: 16rpx;

  &__frame {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200rpx;
    height: 200rpx;
    overflow: hidden;
    background: var(--app-color-surface-muted);
    border-radius: 50%;
  }

  &__image {
    width: 100%;
    height: 100%;
  }

  &__url {
    margin-top: 20rpx;
    font-size: 22rpx;
    line-height: 1.5;
    color: var(--app-color-text-tertiary);
    text-align: center;
    word-break: break-all;
  }
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.avatar-section {
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

  &__actions {
    display: flex;
    gap: 20rpx;
    margin-top: 24rpx;
  }
}
</style>
