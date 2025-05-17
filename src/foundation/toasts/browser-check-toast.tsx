import {toast} from './toast'

/**
 * This component will show a toast if the browser is too old
 */
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
