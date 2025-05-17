import {Device} from '@capacitor/device'

// export {}

declare global {
  interface Navigator {
    msMaxTouchPoints: number
  }
  interface Window {
    isSoftKeyboardOpen: boolean
    isTouchEnabled: boolean
    os: Os
    capacitorPlatform: Platform
    prefersDark: boolean
  }
}

/**
 * Add Capacitor platform when available. Can be web, ios, or android. Does not
 * indicate operating system if running in a browser vs native app.
 *
 * Is useful for styling platform-specific elements when running in capacitor.
 */
Device.getInfo().then(info => {
  window.capacitorPlatform = info.platform as Platform
  document.documentElement.classList.add(`capacitor-platform-${info.platform}`)
})
enum Platform {
  android = 'android',
  ios = 'ios',
  web = 'web',
}

/**
 * Detect if touch screen is enabled.
 */
window.isTouchEnabled =
  'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
document.documentElement.classList.add('touch')

/**
 * Detect the operating system via Browser API.
 */
enum Os {
  android = 'android',
  iphone = 'iphone',
  ipad = 'ipad',
  linux = 'linux',
  macintosh = 'mac',
  unix = 'unix',
  unknown = 'unknown',
  windows = 'windows',
}
window.os = Os.unknown
const av = navigator.appVersion
if (av.includes('Android')) {
  window.os = Os.android
} else if (av.includes('iPhone')) {
  window.os = Os.iphone
} else if (av.includes('Linux')) {
  window.os = Os.linux
} else if (av.includes('Macintosh')) {
  if (window.isTouchEnabled) {
    window.os = Os.ipad
  } else {
    window.os = Os.macintosh
  }
} else if (av.includes('Windows')) {
  window.os = Os.windows
} else if (av.includes('X11')) {
  window.os = Os.unix
}
// alert('ontouchstart' in window ? 'true' : 'false')
document.documentElement.classList.add(`os-${window.os}`)

/**
 * Add a class to the documentElement when the app is running in chrome
 */
if ('chrome' in window) {
  document.documentElement.classList.add('browser-chrome')
} else if ('GestureEvent' in window) {
  document.documentElement.classList.add('browser-webkit')
} else {
  document.documentElement.classList.add('browser-unknown')
}
