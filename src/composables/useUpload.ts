/**
 * 文件上传封装：取直传凭证 → `uni.uploadFile` 直传对象存储 → 归一化结果。
 *
 * 设计目标：
 * 1. 前端不中转文件流，避免占用业务服务器带宽；
 * 2. 凭证获取与上传解耦，凭证接口可替换；
 * 3. 统一处理进度、失败原因与结果结构，页面层只需关心 url。
 *
 * 默认使用模板 mock（`@/mocks/upload`）。对接真实后端时注入 apis/upload 的签名接口：
 * `useUpload({ getSignature: fetchUploadSignatureApi })`
 *
 * mock 签名返回的 uploadUrl 为空字符串，此时走本地模拟上传（按步进推进度），
 * 方便没有对象存储时也能完整演示流程。
 */
import type { UploadResult, UploadSignature, UploadSignatureParams, UploadTask } from '@/types/upload'
import { mockFetchUploadSignature } from '@/mocks/upload'
import { getRuntimePlatform } from '@/utils/tracker'

export interface UseUploadOptions {
  /** 取直传凭证，默认走模板 mock */
  getSignature?: (params: UploadSignatureParams) => Promise<UploadSignature>
  /** 单文件大小上限（字节），默认 5MB */
  maxSize?: number
  /** 进度回调，页面可用它驱动进度条 */
  onProgress?: (task: UploadTask) => void
  /** 成功回调 */
  onSuccess?: (result: UploadResult) => void
  /** 失败回调 */
  onError?: (error: Error, task: UploadTask) => void
}

/** 仅微信小程序能拿到 uploadTask，H5 / App 端 uni.uploadFile 不支持进度上报 */
const supportsUploadProgress = () => getRuntimePlatform() === 'mp-weixin'

const MOCK_PROGRESS_STEP = 20
const MOCK_PROGRESS_INTERVAL = 120

/** 从路径里取文件名，兼容 iOS 返回的完整临时路径 */
export function getFileName(path: string) {
  const cleanPath = path.split('?')[0]
  return cleanPath.slice(cleanPath.lastIndexOf('/') + 1) || 'file'
}

function getFileType(fileName: string) {
  return fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase()
}

function formatSize(size: number) {
  if (!size) return '未知大小'
  if (size < 1024) return `${size}B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`
  return `${(size / 1024 / 1024).toFixed(1)}MB`
}

/** `{path}` 占位符替换：优先用直传 key，其次用本地文件名 */
function resolvePublicUrl(publicUrl?: string, formData?: Record<string, string>, fileName?: string) {
  if (!publicUrl) return ''
  return publicUrl.replace('{path}', formData?.key || fileName || '')
}

/** 无后端时的模拟上传：按步进推进度后返回签名里的占位地址 */
function mockUploadTask(signature: UploadSignature, task: UploadTask, onProgress?: (task: UploadTask) => void) {
  return new Promise<UploadResult>((resolve, reject) => {
    const timer = setInterval(() => {
      task.progress = Math.min(100, task.progress + MOCK_PROGRESS_STEP)
      task.status = task.progress >= 100 ? 'success' : 'uploading'
      onProgress?.({ ...task })

      if (task.progress < 100) return

      clearInterval(timer)
      const url = resolvePublicUrl(signature.publicUrl, signature.formData, task.fileName)

      if (!url) {
        reject(new Error('上传成功但未拿到可访问地址，请检查签名接口是否返回 publicUrl'))
        return
      }

      resolve({ url, fileName: task.fileName, fileSize: task.fileSize, response: signature })
    }, MOCK_PROGRESS_INTERVAL)
  })
}

/** 真实直传：凭证 uploadUrl 非空时走这里 */
function realUpload(
  signature: UploadSignature,
  task: UploadTask,
  extraFormData?: Record<string, string>,
  onProgress?: (progress: number) => void,
) {
  return new Promise<UploadResult>((resolve, reject) => {
    const uploadTask = uni.uploadFile({
      url: signature.uploadUrl,
      filePath: task.path,
      name: signature.fileField || 'file',
      // 签名 formData 与业务字段合并后一起提交
      formData: { ...signature.formData, ...extraFormData },
      header: signature.header,
      success: (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`上传失败，HTTP ${res.statusCode}`))
          return
        }

        let response: unknown = res.data
        try {
          response = JSON.parse(res.data)
        } catch {
          // 非 JSON 响应时保留原始字符串
        }

        const url = resolvePublicUrl(signature.publicUrl, signature.formData, task.fileName)
        if (!url) {
          reject(new Error('上传成功但未拿到可访问地址，请检查签名接口是否返回 publicUrl'))
          return
        }

        resolve({ url, fileName: task.fileName, fileSize: task.fileSize, response })
      },
      fail: (error) => {
        reject(new Error(error?.errMsg || '上传失败'))
      },
    })

    if (uploadTask && supportsUploadProgress()) {
      uploadTask.onProgressUpdate((event) => {
        onProgress?.(event.progress)
      })
    }
  })
}

export const useUpload = (options: UseUploadOptions = {}) => {
  const {
    getSignature = mockFetchUploadSignature,
    maxSize = 5 * 1024 * 1024,
    onProgress,
    onSuccess,
    onError,
  } = options

  const uploading = shallowRef(false)
  const tasks = shallowRef<UploadTask[]>([])

  /** 更新第 index 个任务并返回最新快照 */
  const updateTask = (index: number, patch: Partial<UploadTask>) => {
    tasks.value = tasks.value.map((item, i) => (i === index ? { ...item, ...patch } : item))
    return tasks.value[index]
  }

  const buildSignatureParams = (path: string): UploadSignatureParams => {
    const fileName = getFileName(path)
    return { fileName, fileSize: 0, fileType: getFileType(fileName) }
  }

  const createTask = (path: string): UploadTask => ({
    path,
    fileName: getFileName(path),
    fileSize: 0,
    status: 'uploading',
    progress: 0,
  })

  /** 上传单个文件，extraFormData 会与签名 formData 合并后提交 */
  const uploadFile = (path: string, extraFormData?: Record<string, string>): Promise<UploadResult> => {
    if (!path) {
      return Promise.reject(new Error('缺少文件路径'))
    }

    uploading.value = true
    const task = createTask(path)

    return Promise.resolve()
      .then(() => getSignature(buildSignatureParams(path)))
      .then((signature) => {
        if (!signature.uploadUrl) {
          return mockUploadTask(signature, task, onProgress)
        }

        return realUpload(signature, task, extraFormData, progress =>
          onProgress?.({ ...task, progress }))
      })
      .then((result) => {
        onSuccess?.(result)
        return result
      })
      .catch((error) => {
        const err = error instanceof Error ? error : new Error(String(error))
        onError?.(err, task)
        throw err
      })
      .finally(() => {
        uploading.value = false
      })
  }

  /**
   * 批量上传，串行执行以避免小程序同时发起过多请求。
   * 单个文件失败不中断后续文件，最终返回成功与失败两份结果。
   */
  const uploadFiles = async (paths: string[], extraFormData?: Record<string, string>) => {
    uploading.value = true
    tasks.value = paths.map(path => ({ ...createTask(path), status: 'pending' }))

    const success: UploadResult[] = []
    const failed: Array<{ path: string, message: string }> = []

    for (const [index, path] of paths.entries()) {
      const current = updateTask(index, { status: 'uploading' })
      onProgress?.({ ...current })

      try {
        const signature = await getSignature(buildSignatureParams(path))
        const result = signature.uploadUrl
          ? await realUpload(signature, current, extraFormData, progress =>
              updateTask(index, { progress }))
          : await mockUploadTask(signature, updateTask(index, {}), task => onProgress?.({ ...task }))

        updateTask(index, { status: 'success', progress: 100, url: result.url })
        success.push(result)
      } catch (error) {
        const message = error instanceof Error ? error.message : '上传失败'
        updateTask(index, { status: 'failed', message })
        failed.push({ path, message })
        onError?.(new Error(message), tasks.value[index])
      }
    }

    uploading.value = false
    return { success, failed }
  }

  const reset = () => {
    tasks.value = []
    uploading.value = false
  }

  return { tasks, uploading, uploadFile, uploadFiles, reset, maxSize, formatSize }
}
