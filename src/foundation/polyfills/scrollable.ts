/**
 * Watches the main element for scrollable content and sets a global variable
 *
 * Is used to change styles depending on if scrollable
 */

export {}

declare global {
  interface Window {
    scrollable: boolean
  }
}

removeEventListener('locationchange', checkScrollableAggressive)
addEventListener('locationchange', checkScrollableAggressive)
setInterval(checkScrollable, 5000)
checkScrollableAggressive()

function checkScrollableAggressive() {
  const i = setInterval(checkScrollable, 50)
  setTimeout(() => clearInterval(i), 500)
}

function checkScrollable() {
  const main = document.querySelector('main')
  if (main && main.scrollHeight > main.clientHeight) {
    window.scrollable = true
    document.documentElement.classList.add(`scrollable`)
    document.documentElement.classList.remove(`unscrollable`)
  } else {
    window.scrollable = false
    document.documentElement.classList.remove(`scrollable`)
    document.documentElement.classList.add(`unscrollable`)
  }
}
