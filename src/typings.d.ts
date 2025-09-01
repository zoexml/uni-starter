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

export {} // 防止模块污染
