/**
 * 文件上传相关类型。
 *
 * 模板默认走 mock 签名，对接后端时只需替换 `useUpload` 的 getSignature 实现，
 * 类型无需改动（见 src/composables/useUpload.ts）。
 */

/** 上传任务状态 */
export type UploadStatus = 'pending' | 'uploading' | 'success' | 'failed'

/** 后端下发的直传凭证 */
export interface UploadSignature {
  /**
   * 对象存储的直传地址（如 OSS / COS 的 POST 地址）。
   * 为空字符串时 `useUpload` 走本地模拟上传，方便没有后端时跑通全流程。
   */
  uploadUrl: string
  /** 上传文件的表单字段名，默认 `file` */
  fileField?: string
  /** 直传附带的表单字段（如 OSS 的 key / policy / signature） */
  formData?: Record<string, string>
  /** 直传附带的请求头（如 OSS 的 security-token） */
  header?: Record<string, string>
  /** 上传完成后的可访问地址；`{path}` 会被替换为 formData.key 或本地文件名 */
  publicUrl?: string
}

/** 取签名的入参 */
export interface UploadSignatureParams {
  fileName: string
  fileSize: number
  fileType: string
}

/** 单个上传任务的状态对象 */
export interface UploadTask {
  /** 本地临时文件路径，选完文件即可拿到 */
  path: string
  fileName: string
  fileSize: number
  status: UploadStatus
  /** 0 - 100 */
  progress: number
  /** 上传成功后的可访问地址 */
  url?: string
  /** 失败原因 */
  message?: string
}

/** 上传成功后返回的结果 */
export interface UploadResult {
  /** 可直接用于 `<image src>` / `<video src>` 的地址 */
  url: string
  fileName: string
  fileSize: number
  /** 服务端原始响应，便于接入方使用自定义字段 */
  response: unknown
}
