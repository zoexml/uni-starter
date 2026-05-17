import { onError, onUnhandledRejection } from '@dcloudio/uni-app'
import { captureGlobalError, getPromiseRejectionReason } from '@/utils/global-error-reporting'

export const useGlobalErrorHandling = () => {
  onError((error) => {
    captureGlobalError(error, {
      source: 'app',
      tags: {
        entry: 'onError',
      },
    })
  })

  onUnhandledRejection((event) => {
    const reason = getPromiseRejectionReason(event)

    captureGlobalError(reason, {
      extras: typeof event === 'object' && event !== null ? { hasPromise: 'promise' in event } : undefined,
      info: 'unhandledRejection',
      source: 'promise',
      tags: {
        entry: 'onUnhandledRejection',
      },
    })
  })
}
