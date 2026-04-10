import {parseJLiteIssueHref, prefetchIssuePage} from '~/util/jira'

export {}

/** Active `requestAnimationFrame` id for debounced link scanning, or zero if idle. */
let scanRaf = 0
/** Observes DOM mutations so new in-view issue links can be considered for prefetch. */
let scanObserver: MutationObserver | undefined

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  startWatching()
}

/** Subscribes to scroll, route, resize, and DOM mutations to trigger prefetch passes. */
function startWatching() {
  document.removeEventListener('scroll', scheduleVisibleIssuePrefetch, true)
  document.addEventListener('scroll', scheduleVisibleIssuePrefetch, true)

  removeEventListener('locationchange', scheduleVisibleIssuePrefetch)
  addEventListener('locationchange', scheduleVisibleIssuePrefetch)

  removeEventListener('resize', scheduleVisibleIssuePrefetch)
  addEventListener('resize', scheduleVisibleIssuePrefetch)

  if (document.body) {
    scanObserver?.disconnect()
    scanObserver = new MutationObserver(() => scheduleVisibleIssuePrefetch())
    scanObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
  } else {
    addEventListener(
      'DOMContentLoaded',
      () => {
        startWatching()
      },
      {once: true}
    )
  }

  scheduleVisibleIssuePrefetch()
}

/** Coalesces prefetch work into the next animation frame. */
function scheduleVisibleIssuePrefetch() {
  if (scanRaf) cancelAnimationFrame(scanRaf)
  scanRaf = requestAnimationFrame(() => {
    scanRaf = 0
    prefetchVisibleIssueLinks()
  })
}

/** Prefetches cached issue payloads for every in-view J-Lite issue anchor. */
function prefetchVisibleIssueLinks() {
  const issueKeys = getVisibleIssueKeys()
  issueKeys.forEach(issueKey => {
    void prefetchIssuePage(issueKey).catch(() => undefined)
  })
}

/** Collects unique issue keys from anchors intersecting the main viewport slice. */
function getVisibleIssueKeys() {
  const visibleIssueKeys = new Set<string>()
  const container = document.querySelector('main')
  const bounds = getVisibleBounds(container)
  const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href]')

  anchors.forEach(anchor => {
    const issueKey = parseJLiteIssueHref(anchor.href)
    if (!issueKey) return
    if (!isVisibleInBounds(anchor, bounds)) return
    visibleIssueKeys.add(issueKey)
  })

  return [...visibleIssueKeys]
}

/** Viewport rectangle used to test anchor visibility (main element or window). */
function getVisibleBounds(container: Element | null) {
  if (!container) {
    return {
      bottom: window.innerHeight,
      left: 0,
      right: window.innerWidth,
      top: 0,
    }
  }

  return container.getBoundingClientRect()
}

/** True when an element’s bounding box overlaps the given bounds. */
function isVisibleInBounds(
  element: Element,
  bounds: Pick<DOMRect, 'top' | 'right' | 'bottom' | 'left'>
) {
  const rect = element.getBoundingClientRect()

  return (
    rect.bottom >= bounds.top &&
    rect.top <= bounds.bottom &&
    rect.right >= bounds.left &&
    rect.left <= bounds.right
  )
}
