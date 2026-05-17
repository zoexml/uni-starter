import type { SerializedError } from '@/types/error'

export type { ErrorContext, SerializedError } from '@/types/error'

export interface ErrorRuntimeConfig {
  appEnv: string
  enableRemoteReport: boolean
  isDev: boolean
  isProd: boolean
  release?: string
  reportUrl?: string
  sentryDsn?: string
}

export interface SentryDsnConfig {
  dsn: string
  envelopeEndpoint: string
  host: string
  path: string
  projectId: string
  protocol: string
  publicKey: string
}

const NON_ERROR_NAME = 'NonErrorException'
const SENTRY_DSN_ERROR = 'Invalid Sentry DSN'

const safeJsonStringify = (value: unknown) => {
  const cache = new WeakSet<object>()

  try {
    return JSON.stringify(value, (_key, currentValue) => {
      if (typeof currentValue !== 'object' || currentValue === null) {
        return currentValue
      }

      if (cache.has(currentValue)) {
        return '[Circular]'
      }

      cache.add(currentValue)

      return currentValue
    })
  } catch {
    return String(value)
  }
}

export const createErrorRuntimeConfig = (
  env: Partial<ImportMetaEnv & {
    DEV: boolean
    MODE: string
    PROD: boolean
  }> = {},
): ErrorRuntimeConfig => {
  const sentryDsn = env.VITE_SENTRY_DSN?.trim() || undefined
  const reportUrl = env.VITE_ERROR_REPORT_URL?.trim() || undefined
  const isProd = env.PROD === true || env.MODE === 'production'
  const isDev = env.DEV === true || !isProd
  const enableRemoteReport = isProd
    && env.VITE_ENABLE_ERROR_REPORT !== 'false'
    && Boolean(sentryDsn || reportUrl)

  return {
    appEnv: env.VITE_APP_ENV?.trim() || env.MODE || (isProd ? 'production' : 'development'),
    enableRemoteReport,
    isDev,
    isProd,
    release: env.VITE_SENTRY_RELEASE?.trim() || undefined,
    reportUrl,
    sentryDsn,
  }
}

export const normalizeError = (value: unknown): Error => {
  if (value instanceof Error) {
    return value
  }

  const message = typeof value === 'string' ? value : safeJsonStringify(value)
  const error = new Error(message || 'Unknown error')

  error.name = NON_ERROR_NAME

  return error
}

export const serializeError = (value: unknown): SerializedError => {
  const error = normalizeError(value)

  return {
    message: error.message,
    name: error.name,
    stack: error.stack,
  }
}

export const parseSentryDsn = (dsn: string): SentryDsnConfig => {
  const url = new URL(dsn)
  const pathSegments = url.pathname.split('/').filter(Boolean)
  const projectId = pathSegments.at(-1)

  if (!projectId || !url.username) {
    throw new Error(SENTRY_DSN_ERROR)
  }

  const path = pathSegments.length > 1 ? `/${pathSegments.slice(0, -1).join('/')}` : ''

  return {
    dsn,
    envelopeEndpoint: `${url.protocol}//${url.host}${path}/api/${projectId}/envelope/`,
    host: url.host,
    path,
    projectId,
    protocol: url.protocol,
    publicKey: url.username,
  }
}
