import {toast} from './toast'

/** Surfaces a blocking warning when core APIs like `fetch` are missing. */
export function BrowserCheckToast() {
  useEffect(() => {
    const isModern = 'fetch' in window && 'fromEntries' in Object
    if (!isModern) {
      toast({
        dismissable: false,
        message: 'This app requires a more up-to-date browser.',
        key: 'browser-check',
        duration: Infinity,
        placement: 'bottom',
        variant: 'alert',
      })
    }
  })
  return null
}
