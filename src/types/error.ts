export interface ErrorContext {
  componentName?: string
  extras?: Record<string, unknown>
  info?: string
  route?: string
  source: 'app' | 'promise' | 'vue'
  tags?: Record<string, string>
}

export interface SerializedError {
  message: string
  name: string
  stack?: string
}
