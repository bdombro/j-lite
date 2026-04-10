/** In-app path for a given issue key under `/j-lite/issues/`. */
export function buildIssueHref(issueKey: string) {
  return `/j-lite/issues/${encodeURIComponent(issueKey)}`
}

/** In-app path for a project; optional JQL is stored as a `jql` query param. */
export function buildProjectHref(projectKey: string, jql?: string) {
  const href = `/j-lite/projects/${encodeURIComponent(projectKey)}`
  if (!jql) return href
  const url = new URL(href, location.origin)
  url.searchParams.set('jql', jql)
  return url.pathname + url.search
}

/** Absolute app path to the settings screen. */
export function buildSettingsHref() {
  return '/j-lite/settings'
}

/** Combines `project=KEY` with an optional extra JQL fragment via `AND`. */
export function buildProjectJql(projectKey: string, extraJql?: string) {
  return ['project=' + projectKey, extraJql].filter(Boolean).join(' AND ')
}

/** Preset JQL snippets for open work, todo bucket, or current assignee. */
export function getQuickFilterJql(filter: 'open' | 'todo' | 'currentUser') {
  if (filter === 'open') return 'NOT status="Done"'
  if (filter === 'todo') return 'status="To Do"'
  return 'assignee=currentUser()'
}

/** Current page origin (Atlassian tenant host in production). */
export function getTenantOrigin() {
  return location.origin
}

/** Reads the `from` query param, used when opening J-Lite from a Jira tab. */
export function getFromHref(url = new URL(location.href)) {
  return url.searchParams.get('from') || undefined
}

/** Maps a Jira browse or board URL into deep links back into J-Lite when possible. */
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

/** Sorts keys by project prefix then numeric suffix (e.g. `PROJ-2` before `PROJ-10`). */
export function issueKeyCompare(a: string, b: string) {
  const matchA = a.match(/^([A-Z]+)-(\d+)$/i)
  const matchB = b.match(/^([A-Z]+)-(\d+)$/i)

  if (!matchA || !matchB) return a.localeCompare(b)
  if (matchA[1] !== matchB[1]) return matchA[1].localeCompare(matchB[1])
  return Number(matchA[2]) - Number(matchB[2])
}
