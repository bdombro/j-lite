import './array'
import './darkTheme'
import './date'
import './dynamicViewHeight'
import './enum'
import './error'
import './fingerPrinting'
import './function'
import './icons'
import './jiraIssuePrefetch'
import './map'
import './math'
import './number'
import './object'
import './promise'
import './react'
import './scrollable'
import './set'
import './softKeyboard'
import './string'
import './styled'

/** Ambient flags and `global` alias after loading all polyfill modules. */
declare global {
  var global: typeof globalThis
  var isNode: boolean
  var isWeb: boolean
  var isTest: boolean
}

globalThis.global = globalThis
global.isTest = import.meta.env.NODE_ENV === 'test'
