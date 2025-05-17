import {debounce} from '@slimr/util'

// export {}

/**
 * Set the CSS variable `--dvh` to the height of the viewport.
 *
 * Is more reliable than `100vh` because it takes into account the height of
 * the browser's UI elements (e.g. address bar, status bar, etc).
 */
const setViewportHeight = debounce(() => {
  document.documentElement.style.setProperty('--dvh', `${window.innerHeight}px`)
})
if (!('chrome' in window)) {
  setViewportHeight()
  removeEventListener('resize', setViewportHeight)
  addEventListener('resize', setViewportHeight)
}
