import type { App, ComponentPublicInstance } from 'vue'
import type { ErrorContext, SerializedError } from '@/utils/error-handling'
import { createErrorRuntimeConfig, normalizeError, parseSentryDsn, serializeError } from '@/utils/error-handling'

interface PromiseRejectionEventLike {
  promise?: Promise<unknown>
  reason?: unknown
}

interface ReportPayload extends SerializedError {
  appEnv: string
  componentName?: string
  extras?: Record<string, unknown>
  info?: string
  route?: string
  source: ErrorContext['source']
  tags?: Record<string, string>
  timestamp: string
}

const ERROR_DEDUPE_WINDOW = 1500

const runtimeConfig = createErrorRuntimeConfig((import.meta as ImportMeta & {
  env?: Partial<ImportMetaEnv & {
    DEV: boolean
    MODE: string
    PROD: boolean
  }>
}).env)

let lastErrorFingerprint = ''
let lastErrorTimestamp = 0

const createEventId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().replaceAll('-', '')
  }

  return `${Date.now().toString(16)}${Math.random().toString(16).slice(2, 18)}`
}

const getRoutePath = () => {
  try {
    const pages = getCurrentPages()
    const currentPage = pages.at(-1)

    if (!currentPage) {
      return undefined
    }

    const pageWithRoute = currentPage as { route?: string, $page?: { fullPath?: string } }

    return pageWithRoute.$page?.fullPath || pageWithRoute.route
  } catch {
    return undefined
  }
}

const getComponentName = (instance: ComponentPublicInstance | null) => {
  if (!instance) {
    return undefined
  }

  const typedInstance = instance as ComponentPublicInstance & {
    $options?: { name?: string }
    type?: { __name?: string, name?: string }
  }

  return typedInstance.type?.name || typedInstance.type?.__name || typedInstance.$options?.name || undefined
}

const buildFingerprint = (error: Error, context: ErrorContext) => {
  return [
    context.source,
    context.info || '',
    context.componentName || '',
    context.route || '',
    error.name,
    error.message,
  ].join('::')
}

const isDuplicateError = (error: Error, context: ErrorContext) => {
  const fingerprint = buildFingerprint(error, context)
  const timestamp = Date.now()

  if (fingerprint === lastErrorFingerprint && timestamp - lastErrorTimestamp < ERROR_DEDUPE_WINDOW) {
    return true
  }

  lastErrorFingerprint = fingerprint
  lastErrorTimestamp = timestamp

  return false
}

const logError = (error: Error, context: ErrorContext) => {
  const label = `[global-error:${context.source}]`
  const payload = {
    appEnv: runtimeConfig.appEnv,
    componentName: context.componentName,
    extras: context.extras,
    info: context.info,
    route: context.route,
    tags: context.tags,
  }

  if (runtimeConfig.isDev && typeof console.groupCollapsed === 'function') {
    console.groupCollapsed(label, context.info || error.message)
    console.error(error)
    console.info(payload)
    console.groupEnd()
    return
  }

  console.error(label, {
    ...payload,
    error: serializeError(error),
  })
}

const postJsonReport = async (reportUrl: string, payload: ReportPayload) => {
  await uni.request({
    data: payload,
    header: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    url: reportUrl,
  })
}

const postSentryReport = async (sentryDsn: string, payload: ReportPayload) => {
  const sentryConfig = parseSentryDsn(sentryDsn)
  const eventId = createEventId()
  const envelope = [
    JSON.stringify({
      dsn: sentryConfig.dsn,
      event_id: eventId,
      sent_at: new Date().toISOString(),
    }),
    JSON.stringify({
      type: 'event',
    }),
    JSON.stringify({
      environment: runtimeConfig.appEnv,
      event_id: eventId,
      exception: {
        values: [
          {
            stacktrace: payload.stack
              ? {
                  frames: [
                    {
                      filename: payload.route || 'unknown',
                      function: payload.info || 'global-error-handler',
                      module: payload.componentName || 'App',
                    },
                  ],
                }
              : undefined,
            type: payload.name,
            value: payload.message,
          },
        ],
      },
      extra: {
        extras: payload.extras,
        info: payload.info,
        route: payload.route,
      },
      level: 'error',
      platform: 'javascript',
      release: runtimeConfig.release,
      tags: payload.tags,
    }),
  ].join('\n')

  await uni.request({
    data: envelope,
    header: {
      'Content-Type': 'text/plain;charset=UTF-8',
    },
    method: 'POST',
    url: sentryConfig.envelopeEndpoint,
  })
}

const reportError = async (error: Error, context: ErrorContext) => {
  if (!runtimeConfig.enableRemoteReport) {
    return
  }

  const serializedError = serializeError(error)
  const payload = {
    ...serializedError,
    appEnv: runtimeConfig.appEnv,
    componentName: context.componentName,
    extras: context.extras,
    info: context.info,
    route: context.route,
    source: context.source,
    tags: context.tags,
    timestamp: new Date().toISOString(),
  } satisfies ReportPayload

  try {
    if (runtimeConfig.sentryDsn) {
      await postSentryReport(runtimeConfig.sentryDsn, payload)
      return
    }

    if (runtimeConfig.reportUrl) {
      await postJsonReport(runtimeConfig.reportUrl, payload)
    }
  } catch (reportError) {
    if (runtimeConfig.isDev) {
      console.error('[global-error:report-failed]', normalizeError(reportError))
    }
  }
}

export const getPromiseRejectionReason = (event: unknown) => {
  if (typeof event === 'object' && event !== null && 'reason' in event) {
    return (event as PromiseRejectionEventLike).reason
  }

  return event
}

export const captureGlobalError = (value: unknown, context: ErrorContext) => {
  const error = normalizeError(value)
  const enrichedContext = {
    ...context,
    route: context.route || getRoutePath(),
  }

  if (isDuplicateError(error, enrichedContext)) {
    return
  }

  logError(error, enrichedContext)
  void reportError(error, enrichedContext)
}

export const installVueErrorHandler = (app: App<Element>) => {
  app.config.errorHandler = (error, instance, info) => {
    captureGlobalError(error, {
      componentName: getComponentName(instance),
      info,
      source: 'vue',
      tags: {
        entry: 'app.config.errorHandler',
      },
    })
  }
}
