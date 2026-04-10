import {toast} from './toast'

/**
 * Listens for `online` / `offline` and mirrors connectivity with toasts.
 *
 * Icons may be missing in dev if not pre-cached; production bundles include them.
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

/** Announces disconnect and pins guidance until back online. */
function onOffline() {
  toast({message: 'Disconnected', variant: 'alert'})
  toast({
    message: 'You are offline. This app works some but not all offline',
    key: 'offline-ready',
    duration: Infinity,
    placement: 'bottom',
  })
}

/** Clears the sticky offline notice and confirms reconnection. */
function onOnline() {
  toast.cancel('offline-ready')
  toast({message: 'Reconnected', variant: 'success'})
}
