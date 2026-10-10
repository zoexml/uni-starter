/**
 * 上传相关 mock 数据。
 *
 * 与 auth / content mock 同风格：真实项目接入后端后，把 `useUpload` 的
 * getSignature 换成 `@/apis/upload` 的 fetchUploadSignatureApi 即可。
 */
import type { UploadSignature, UploadSignatureParams } from '@/types/upload'

const MOCK_DELAY = 600

/** 模拟网络往返，让示例页能看到 loading / 进度变化 */
const wait = <T>(data: T, delay = MOCK_DELAY) => {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay)
  })
}

/** 扩展名白名单校验，与常见后端策略一致 */
export function checkFileExtension(fileName: string) {
  const ext = fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase()
  const allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp']

  return { ext, allowed: allowed.includes(ext) }
}

/**
 * 模拟取直传凭证。
 *
 * 注意返回的 uploadUrl 为空字符串，`useUpload` 会识别为「无后端」并走本地模拟上传，
 * 这样模板在没有对象存储的情况下也能完整演示上传流程与进度。
 */
export async function mockFetchUploadSignature(params: UploadSignatureParams): Promise<UploadSignature> {
  const { ext, allowed } = checkFileExtension(params.fileName)

  if (!allowed) {
    throw new Error(`不支持的文件类型：.${ext}`)
  }

  if (params.fileSize > 5 * 1024 * 1024) {
    throw new Error('文件大小不能超过 5MB')
  }

  return wait({
    // 空 uploadUrl 表示走本地模拟上传
    uploadUrl: '',
    fileField: 'file',
    formData: {
      key: `mock/${Date.now()}-${params.fileName}`,
    },
    // 不返回 publicUrl：mock 场景下 useUpload 会回退到本地临时路径，
    // 这样各端都能直接预览；真实环境请返回对象存储的可访问地址
  })
}
