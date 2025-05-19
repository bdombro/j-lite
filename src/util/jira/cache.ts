import {CachedValue, RecentView} from './types'

const STORAGE_PREFIX = 'j-lite:v1'
const RECENT_LIMIT = 8

function getStorage() {
  try {
    return window.localStorage
  } catch {
    return undefined
  }
}

function getKey(key: string) {
  return `${STORAGE_PREFIX}:${key}`
}

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

export function writeCachedValue<T>(key: string, data: T) {
  const storage = getStorage()
  const payload: CachedValue<T> = {data, fetchedAt: Date.now()}
  storage?.setItem(getKey(key), JSON.stringify(payload))
  return payload
}

export function removeCachedValue(key: string) {
  getStorage()?.removeItem(getKey(key))
}

export function listJLiteStorageKeys() {
  const storage = getStorage()
  if (!storage) return []
  return Object.keys(storage).filter(key => key.startsWith(STORAGE_PREFIX + ':'))
}

export function clearJLiteStorage() {
  const storage = getStorage()
  if (!storage) return
  listJLiteStorageKeys().forEach(key => storage.removeItem(key))
}

function getRecentKey(type: RecentView['type']) {
  return `recent:${type}`
}

export function getRecentViews(type: RecentView['type']) {
  return readCachedValue<RecentView[]>(getRecentKey(type))?.data || []
}

export function pushRecentView(item: Omit<RecentView, 'viewedAt'>) {
  const next: RecentView = {...item, viewedAt: Date.now()}
  const current = getRecentViews(item.type)
  const deduped = current.filter(existing => existing.href !== item.href)
  writeCachedValue(getRecentKey(item.type), [next, ...deduped].slice(0, RECENT_LIMIT))
}
