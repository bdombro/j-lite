import {BrowserCheckToast} from './browser-check-toast'
import {ErrorToast} from './error-toast'
import {OfflineToast} from './offline-toast'
import {Toasts} from './toast'

export * from './toast'

/** Mounts placement stacks plus browser, error, and connectivity listeners. */
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
