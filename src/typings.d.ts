// 全局要用的类型放到这里

declare global {
  // uni.uploadFile文件上传参数
  interface IUniUploadFileOptions {
    file?: File
    files?: UniApp.UploadFileOptionFiles[]
    filePath?: string
    name?: string
    formData?: any
  }

}

interface ImportMetaEnv {
  readonly VITE_APP_ENV?: string
  readonly VITE_ENABLE_ERROR_REPORT?: string
  readonly VITE_ERROR_REPORT_URL?: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_SENTRY_RELEASE?: string
}

export {} // 防止模块污染
