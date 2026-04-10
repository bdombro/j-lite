import {toast} from './toast'

/** Effect-only: global `error` / `unhandledrejection` handler with a recovery toast. */
export function ErrorToast() {
  useEffect(() => {
    const onError = (error: Error) => {
      console.error(error)
      toast({
        dismissable: false,
        key: 'error',
        duration: Infinity,
        icon: null,
        message: (
          <>
            <p style={{paddingTop: 0}}>Something went wrong and you need to reset the page.</p>
            <button
              type="button"
              onClick={() => {
                toast.cancel('error')
                localStorage.clear()
                location.reload()
              }}
            >
              Reset Page
            </button>
          </>
        ),
        // placement: 'center',
      })
    }
    const el = (event: ErrorEvent) => onError(event.error)
    addEventListener('error', el)
    const ul = (event: PromiseRejectionEvent) => onError(event.reason)
    addEventListener('unhandledrejection', ul)
    return () => {
      removeEventListener('error', el)
      removeEventListener('unhandledrejection', ul)
    }
  }, [])

  return null
}
