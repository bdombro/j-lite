import {getBootstrapData, getIssuePageData} from './api'
import {readCachedValue, writeCachedValue} from './cache'
import {JiraBootstrap, JiraIssueDetail} from './types'

/** Matches in-app issue URLs so keys can be extracted for warm-cache prefetch. */
const ISSUE_PATH_RE = /^\/j-lite\/issues\/([^/?#]+)$/i
/** `localStorage` key used when reusing bootstrap metadata across prefetch calls. */
const BOOTSTRAP_CACHE_KEY = 'bootstrap'

/** Holds the single in-flight bootstrap fetch, if any, to avoid duplicate calls. */
let bootstrapRequest: Promise<JiraBootstrap> | undefined
/** Dedupes concurrent prefetch promises per issue cache key. */
const issueRequests = new Map<string, Promise<void>>()

/** Extracts an uppercased issue key from in-app or Atlassian issue URLs, if supported. */
export function parseJLiteIssueHref(href: string, baseHref = location.href) {
  try {
    const parsed = new URL(href, baseHref)
    const issueMatch = parsed.pathname.match(ISSUE_PATH_RE)
    const isSupportedHost =
      href.startsWith('/') ||
      parsed.hostname === location.hostname ||
      parsed.hostname.endsWith('.atlassian.net')

    if (!issueMatch || !isSupportedHost) return undefined
    return decodeURIComponent(issueMatch[1]).toUpperCase()
  } catch {
    return undefined
  }
}

/** Returns bootstrap from cache or a single in-flight network request. */
async function getCachedBootstrap() {
  const cached = readCachedValue<JiraBootstrap>(BOOTSTRAP_CACHE_KEY)
  if (cached?.data) return cached.data

  if (!bootstrapRequest) {
    bootstrapRequest = getBootstrapData()
      .then(data => {
        writeCachedValue(BOOTSTRAP_CACHE_KEY, data)
        return data
      })
      .finally(() => {
        bootstrapRequest = undefined
      })
  }

  return bootstrapRequest
}

/** Warms the issue cache for a key when links scroll into view (deduped). */
export async function prefetchIssuePage(issueKey: string) {
  const normalizedIssueKey = issueKey.toUpperCase()
  const cacheKey = `issue:${normalizedIssueKey}`
  const cached = readCachedValue<JiraIssueDetail>(cacheKey)
  if (cached?.data) return

  const inFlight = issueRequests.get(cacheKey)
  if (inFlight) return inFlight

  const request = getCachedBootstrap()
    .then(bootstrap => getIssuePageData(normalizedIssueKey, bootstrap.storyPointsFieldId))
    .then(issue => {
      writeCachedValue(cacheKey, issue)
    })
    .finally(() => {
      issueRequests.delete(cacheKey)
    })

  issueRequests.set(cacheKey, request)
  return request
}
