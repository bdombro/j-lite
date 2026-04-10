import {debounce} from '@slimr/util'

// export {}

/**
 * Debounced updater: writes `window.innerHeight` to `--dvh` so CSS can avoid classic `100vh`
 * issues when browser chrome resizes (address bar, status bar, etc.).
 */
const setViewportHeight = debounce(() => {
  document.documentElement.style.setProperty('--dvh', `${window.innerHeight}px`)
})
if (!('chrome' in window)) {
  setViewportHeight()
  removeEventListener('resize', setViewportHeight)
  addEventListener('resize', setViewportHeight)
}
