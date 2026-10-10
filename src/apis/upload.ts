import type { UploadSignature, UploadSignatureParams } from '@/types/upload'
import { http } from '@/utils/http'

/**
 * 获取对象存储直传凭证。
 *
 * 后端返回 uploadUrl / fileField / formData / header / publicUrl，
 * 前端用 `uni.uploadFile` 直传，不经自己的服务器中转。
 */
export function fetchUploadSignatureApi(params: UploadSignatureParams) {
  return http.Post<UploadSignature>('/upload/signature', params, {
    meta: { authRole: 'login' },
  })
}