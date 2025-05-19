import {getBootstrapData, getIssuePageData} from './api'
import {readCachedValue, writeCachedValue} from './cache'
import {JiraBootstrap, JiraIssueDetail} from './types'

const ISSUE_PATH_RE = /^\/j-lite\/issues\/([^/?#]+)$/i
const BOOTSTRAP_CACHE_KEY = 'bootstrap'

let bootstrapRequest: Promise<JiraBootstrap> | undefined
const issueRequests = new Map<string, Promise<void>>()

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
