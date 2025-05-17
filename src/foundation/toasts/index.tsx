import {BrowserCheckToast} from './browser-check-toast'
import {ErrorToast} from './error-toast'
import {OfflineToast} from './offline-toast'
import {Toasts} from './toast'

export * from './toast'

/**
 * All of the browser state toasts in one component
 */
export function ToastPack() {
  return (
    <>
      <Toasts />
      <BrowserCheckToast />
      <ErrorToast />
      <OfflineToast />
    </>
  )
}
