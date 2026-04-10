import {CachedValue, RecentView} from './types'

/** Prefix for every persisted key so J-Lite data stays isolated in storage. */
const STORAGE_PREFIX = 'j-lite:v1'
/** Maximum rows kept per recent-project or recent-issue list. */
const RECENT_LIMIT = 8

/** Safe access to `localStorage`, or `undefined` if unavailable. */
function getStorage() {
  try {
    return window.localStorage
  } catch {
    return undefined
  }
}

/** Namespaced storage key for a logical cache entry. */
function getKey(key: string) {
  return `${STORAGE_PREFIX}:${key}`
}

/** Loads a typed payload and timestamp; drops corrupt JSON entries. */
export function readCachedValue<T>(key: string) {
  const storage = getStorage()
  const raw = storage?.getItem(getKey(key))
  if (!raw) return undefined

  try {
    return JSON.parse(raw) as CachedValue<T>
  } catch {
    storage?.removeItem(getKey(key))
    return undefined
  }
}

/** Persists data with a fresh `fetchedAt` and returns the wrapped value. */
export function writeCachedValue<T>(key: string, data: T) {
  const storage = getStorage()
  const payload: CachedValue<T> = {data, fetchedAt: Date.now()}
  storage?.setItem(getKey(key), JSON.stringify(payload))
  return payload
}

/** Deletes one namespaced entry from storage. */
export function removeCachedValue(key: string) {
  getStorage()?.removeItem(getKey(key))
}

/** All raw `localStorage` keys owned by this app’s prefix. */
export function listJLiteStorageKeys() {
  const storage = getStorage()
  if (!storage) return []
  return Object.keys(storage).filter(key => key.startsWith(STORAGE_PREFIX + ':'))
}

/** Removes every J-Lite-prefixed key in one shot. */
export function clearJLiteStorage() {
  const storage = getStorage()
  if (!storage) return
  listJLiteStorageKeys().forEach(key => storage.removeItem(key))
}

/** Storage key segment for recent project vs issue lists. */
function getRecentKey(type: RecentView['type']) {
  return `recent:${type}`
}

/** Ordered recent navigation entries for projects or issues. */
export function getRecentViews(type: RecentView['type']) {
  return readCachedValue<RecentView[]>(getRecentKey(type))?.data || []
}

/** Inserts or promotes an item at the front of the matching recents list (capped). */
export function pushRecentView(item: Omit<RecentView, 'viewedAt'>) {
  const next: RecentView = {...item, viewedAt: Date.now()}
  const current = getRecentViews(item.type)
  const deduped = current.filter(existing => existing.href !== item.href)
  writeCachedValue(getRecentKey(item.type), [next, ...deduped].slice(0, RECENT_LIMIT))
}
