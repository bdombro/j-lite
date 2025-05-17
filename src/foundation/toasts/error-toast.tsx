import {toast} from './toast'

/**
 * A falsey component that is all-effect -- it listens for errors and
 * triggers a toast with a reset button.
 *
 * Is a component and not hook for conveniently calling as a sibling component
 * to the toast component. As a hook, would have to be called in a child.
 */
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
