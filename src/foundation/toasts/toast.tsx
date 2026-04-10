import './toast.css'

import {useEvent} from '@slimr/react'
import {memo} from 'react'

/** `CustomEvent` name used when enqueueing a new transient message. */
const createEvent = 'toast'
/** `CustomEvent` name used when dismissing an existing message by key. */
const cancelEvent = 'toast-cancel'

/** Configuration for one queued notification (placement, duration, variant, message). */
interface ToastProps {
  /** If true, the toast will be dismissable if duration=Infinity. default = true */
  dismissable: boolean
  /** The duration in milliseconds to display the toast. If Infinity, will show until cancelled. */
  duration: number
  /** The icon to display. If omitted, will use variant default. If null, no icon will be displayed. */
  icon: IconKeys | null
  /**
   * A unique key for the toast. If not provided, a random key will be generated.
   *
   * If a toast with the same key is already in the stack, it will be ignored.
   * Useful for preventing duplicate toasts.
   */
  key: string
  /** The placement of the toast. default = 'right' */
  placement: 'right' | 'bottom' | 'center'
  /** The message to displace */
  message: React.ReactNode
  /** impacts the color and icon. default = info */
  variant: 'info' | 'success' | 'alert' | 'error'
}
/** Dispatch input: `message` required; other toast fields optional with defaults. */
type CreateToastProps = Partial<Omit<ToastProps, 'message'>> & Pick<ToastProps, 'message'>

/** Hosts right, bottom, and center stacks for transient messages. */
export const Toasts = memo(function Toasts() {
  return (
    <>
      <ToastStack placement="right" />
      <ToastStack placement="bottom" />
      <ToastStack placement="center" />
    </>
  )
})

/** Single placement channel: listens for global events and animates one visible toast. */
function ToastStack({placement}: {placement: ToastProps['placement']}) {
  const [toast, setToast] = useState<ToastProps | undefined>(undefined)

  const timeouts = useRef(new Set<NodeJS.Timeout>()).current

  const stackRef = useRef<Map<string, ToastProps>>(new Map())
  const stack = stackRef.current

  const wrapperRef = useRef<HTMLDivElement>(null)
  const wrapper = wrapperRef.current

  const animateIn = () => {
    // setTimeout to start after a couple render cycles, so everything
    // is more likely to be ready (like icons)
    setTimeout(() => {
      if (!wrapper) return
      wrapper.style.display = 'initial'
      wrapper.classList.add('animatedIn')
      wrapper.classList.remove('_hidden')
    }, 20)
  }

  const animateOut = () => {
    if (!wrapper) return
    wrapper?.classList.remove('animatedIn')
    wrapper?.classList.add('animatedOut')
    wrapper?.classList.add('_hidden')

    timeouts.add(
      setTimeout(() => {
        wrapper.classList.remove('animatedOut')
        wrapper.style.display = 'none'
        if (toast) {
          stack.delete(toast.key)
        }
        setToast(undefined)
      }, 450)
    )
  }

  const animateReset = () => {
    if (!wrapper) return
    wrapper.classList.remove('animatedIn')
    wrapper.classList.remove('animatedOut')
    wrapper.style.display = 'none'
    if (toast?.placement === 'right') {
      wrapper.classList.add('_hidden')
    }
  }

  const growThenShrink = () => {
    if (!wrapper) return
    wrapper?.classList.add('grow')
    timeouts.add(
      setTimeout(() => {
        wrapper?.classList.remove('grow')
      }, 100)
    )
  }

  const clearTimeouts = () => {
    if (timeouts.size) {
      timeouts.forEach(t => clearTimeout(t))
      timeouts.clear()
    }
  }

  const findNextToast = () => {
    const arr = Array.from(stack.values())
    const oldest = arr[arr.length - 1]
    const oldestNonInfinite = arr.find(t => t.duration !== Infinity)
    return oldestNonInfinite || oldest
  }

  const putToast = (_toast: ToastProps) => {
    // First check if exact match
    const isPlacementMatch = _toast.placement === placement

    // Now check for responsive match. We swap right for bottom on mobile
    const isMobile = window.innerWidth < 768
    const isPlacementBottomToastRightAndMobile =
      placement === 'bottom' && _toast.placement === 'right' && isMobile
    const isPlacementRightAndMobile = placement === 'right' && isMobile

    if ((isPlacementMatch || isPlacementBottomToastRightAndMobile) && !isPlacementRightAndMobile) {
      stack.set(_toast.key, _toast)
      if (!toast || toast?.duration === Infinity) {
        setToast(_toast)
      }
      if (toast?.key === _toast.key) {
        restartTimer()
        growThenShrink()
      }
    }
  }

  const cancelToast = (key: string) => {
    stack.delete(key)
    if (key === toast?.key) {
      selfDestruct()
    }
  }

  const restartTimer = () => {
    if (!toast || toast.duration === Infinity) return
    clearTimeouts()
    timeouts.add(
      setTimeout(selfDestruct, toast.duration === Infinity ? 100_000_000_000 : toast.duration)
    )
  }

  const selfDestruct = () => {
    if (stack.size > 1) {
      if (toast && toast.duration !== Infinity) {
        stack.delete(toast.key)
      }
      setToast(findNextToast())
      return
    }

    animateOut()
  }

  useEffect(() => {
    animateReset()
    if (toast) {
      animateIn()
      restartTimer()
    } else {
      setToast(findNextToast())
    }
  }, [toast])

  useEvent(createEvent, (event: CustomEvent<ToastProps>) => putToast(event.detail))

  useEvent(cancelEvent, (event: CustomEvent<string>) => cancelToast(event.detail))

  return (
    <div data-placement={placement} className={`toast _hidden ${toast?.variant}`} ref={wrapperRef}>
      {!!toast && (
        <div>
          <div>
            {!!toast?.icon && (
              <div>
                <Icon name={toast.icon} size={40} />
              </div>
            )}
            <div className="message">{toast?.message}</div>
            {toast?.duration === Infinity && toast?.dismissable && (
              <Icon
                className="dismiss"
                name="close"
                onClick={() => cancelToast(toast.key)}
                size={20}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/** Fires a custom event consumed by placement stacks; returns the payload plus `cancel`. */
export function dispatchToast(eventData: CreateToastProps) {
  const {
    dismissable = true,
    duration = 2_000,
    icon,
    key = Math.random().toString(36).substr(2, 9),
    placement = 'right',
    message,
    variant = 'info',
  } = eventData

  const toast: ToastProps = {
    dismissable,
    duration,
    icon: icon !== null ? icon || variant : null,
    key,
    placement,
    message,
    variant,
  }

  dispatchEvent(new CustomEvent(createEvent, {detail: toast}))

  return {
    ...toast,
    cancel: () => dispatchToast.cancel(toast.key),
  }
}
/** Broadcasts dismissal for a specific toast key to all listening stacks. */
dispatchToast.cancel = (key: string) => {
  dispatchEvent(new CustomEvent(cancelEvent, {detail: key}))
}

/** Convenience alias around the same custom-event API. */
export const toast = dispatchToast
