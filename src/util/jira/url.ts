export function buildIssueHref(issueKey: string) {
  return `/j-lite/issues/${encodeURIComponent(issueKey)}`
}

export function buildProjectHref(projectKey: string, jql?: string) {
  const href = `/j-lite/projects/${encodeURIComponent(projectKey)}`
  if (!jql) return href
  const url = new URL(href, location.origin)
  url.searchParams.set('jql', jql)
  return url.pathname + url.search
}

export function buildSettingsHref() {
  return '/j-lite/settings'
}

export function buildProjectJql(projectKey: string, extraJql?: string) {
  return ['project=' + projectKey, extraJql].filter(Boolean).join(' AND ')
}

export function getQuickFilterJql(filter: 'open' | 'todo' | 'currentUser') {
  if (filter === 'open') return 'NOT status="Done"'
  if (filter === 'todo') return 'status="To Do"'
  return 'assignee=currentUser()'
}

export function getTenantOrigin() {
  return location.origin
}

export function getFromHref(url = new URL(location.href)) {
  return url.searchParams.get('from') || undefined
}

export function parseSourceHref(fromHref?: string) {
  if (!fromHref) return undefined

  try {
    const parsed = new URL(fromHref, location.origin)
    const path = parsed.pathname.replace(/\/+$/, '') || '/'
    const browseMatch = path.match(/^\/browse\/([A-Z][A-Z0-9_]+-\d+)$/i)
    if (browseMatch) {
      const issueKey = browseMatch[1].toUpperCase()
      return {
        type: 'issue' as const,
        jiraHref: parsed.href,
        label: issueKey,
        appHref: buildIssueHref(issueKey),
      }
    }

    const projectMatch = path.match(/^\/jira\/software\/projects\/([^/]+)/i)
    if (projectMatch) {
      const projectKey = projectMatch[1].toUpperCase()
      return {
        type: 'project' as const,
        jiraHref: parsed.href,
        label: projectKey,
        appHref: buildProjectHref(projectKey),
      }
    }

    return {
      type: 'other' as const,
      jiraHref: parsed.href,
      label: parsed.pathname,
      appHref: undefined,
    }
  } catch {
    return undefined
  }
}

export function issueKeyCompare(a: string, b: string) {
  const matchA = a.match(/^([A-Z]+)-(\d+)$/i)
  const matchB = b.match(/^([A-Z]+)-(\d+)$/i)

  if (!matchA || !matchB) return a.localeCompare(b)
  if (matchA[1] !== matchB[1]) return matchA[1].localeCompare(matchB[1])
  return Number(matchA[2]) - Number(matchB[2])
}
