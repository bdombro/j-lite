import {toast} from './toast'

/**
 * This component will show a toast when the user goes on and offline
 *
 * Note: the icon will be broken when this app is running in dev mode because
 * the icon is not pre-cached, but works in production mode because it is included
 * in previously loaded bundle(s)
 */
export function OfflineToast() {
  useEffect(() => {
    addEventListener('offline', onOffline)
    addEventListener('online', onOnline)
    return () => {
      removeEventListener('offline', onOffline)
      removeEventListener('online', onOnline)
    }
  })
  return null
}

/**
 * Show toasts when the user goes offline
 */
function onOffline() {
  toast({message: 'Disconnected', variant: 'alert'})
  toast({
    message: 'You are offline. This app works some but not all offline',
    key: 'offline-ready',
    duration: Infinity,
    placement: 'bottom',
  })
}

/**
 * Show a toast when the user goes online and cancel the sticky offline toast
 */
function onOnline() {
  toast.cancel('offline-ready')
  toast({message: 'Reconnected', variant: 'success'})
}
