import {
  JiraAdfDoc,
  JiraBootstrap,
  JiraComment,
  JiraIssueDetail,
  JiraIssueListItem,
  JiraLinkedIssue,
  JiraNamedUser,
  JiraProject,
  JiraUser,
} from './types'
import {buildProjectJql, getTenantOrigin, issueKeyCompare} from './url'

/** Row from `/rest/api/3/field` used to resolve custom story-points field ids. */
type JiraField = {
  id?: string
  key?: string
  name?: string
  schema?: {
    custom?: string
    customId?: number
    type?: string
  }
}

/** Minimal user or status object with display-oriented name fields. */
type RawNamedEntity = {
  displayName?: string
  emailAddress?: string
  name?: string
}

/** Issue JSON envelope as returned by Jira REST before normalization. */
type RawIssue = {
  key: string
  fields: Record<string, sany>
}

/** Page size for each Jira search request before following `next` offsets. */
const SEARCH_PAGE_SIZE = 1000
/** Fallback custom field id when `/field` does not expose a story-points field. */
const DEFAULT_STORY_POINTS_FIELD = 'customfield_18557'

/** Resolves the custom field id used for story points from `/field` metadata. */
export function pickStoryPointsField(fields: JiraField[]) {
  const exactMatch = fields.find(field => field.name?.toLowerCase() === 'story point estimate')
  if (exactMatch?.id) return exactMatch.id

  const fuzzyMatch = fields.find(field => field.name?.toLowerCase().includes('story point'))
  if (fuzzyMatch?.id) return fuzzyMatch.id

  return DEFAULT_STORY_POINTS_FIELD
}

/** Same-origin `fetch` to Jira REST with JSON parsing and unified error text. */
async function jiraFetchJson<T>(path: string) {
  const response = await fetch(path, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    let details = ''

    try {
      details = await response.text()
    } catch {
      details = ''
    }

    throw new Error(
      `Jira request failed (${response.status} ${response.statusText})${
        details ? `: ${details}` : ''
      }`
    )
  }

  return (await response.json()) as T
}

/** Current user plus discovered story-points field and tenant origin. */
export async function getBootstrapData(): Promise<JiraBootstrap> {
  const [currentUser, fields] = await Promise.all([
    jiraFetchJson<JiraUser>('/rest/api/3/myself'),
    jiraFetchJson<JiraField[]>('/rest/api/3/field'),
  ])

  return {
    authStrategy: 'same-origin-browser-session',
    currentUser,
    storyPointsFieldId: pickStoryPointsField(fields),
    tenantOrigin: getTenantOrigin(),
  }
}

/** Loads project metadata by key from `/rest/api/3/project/:key`. */
export async function getProject(projectKey: string) {
  return jiraFetchJson<JiraProject>(`/rest/api/3/project/${encodeURIComponent(projectKey)}`)
}

/** Jira user row from `/user/search` including account id for JQL. */
type JiraUserSearchHit = JiraUser & {accountId?: string}

/** Escapes a user id for use inside a JQL quoted string. */
function escapeJqlQuoted(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

/**
 * Resolves a user by email via `/user/search`, then loads all issues where they are assignee.
 */
export async function getUserPageData(emailParam: string, storyPointsFieldId?: string) {
  const email = emailParam.trim()
  if (!email) {
    throw new Error('Email is required')
  }

  const searchUrl = new URL('/rest/api/3/user/search', location.origin)
  searchUrl.searchParams.set('query', email)

  const candidates = await jiraFetchJson<JiraUserSearchHit[]>(
    searchUrl.pathname + searchUrl.search
  )

  const lower = email.toLowerCase()
  let user =
    candidates.find(u => u.emailAddress?.toLowerCase() === lower) ?? undefined

  if (!user) {
    if (candidates.length === 1) {
      user = candidates[0]
    } else if (candidates.length > 1) {
      throw new Error(
        `Several users matched "${email}"; use the exact email shown in Jira for this person`
      )
    }
  }

  if (!user?.accountId) {
    throw new Error(`No Jira user found for ${email}`)
  }

  const jql = `assignee = "${escapeJqlQuoted(user.accountId)}"`
  const issues = await searchAllIssues(jql, getSearchFields(storyPointsFieldId))

  return {
    issueCount: issues.length,
    jql,
    issues: issues.map(issue => normalizeIssue(issue, storyPointsFieldId)),
    user: {
      accountId: user.accountId,
      displayName: user.displayName,
      emailAddress: user.emailAddress ?? email,
    },
  }
}

/** Field ids requested for a single-issue detail request. */
function getIssueFields(storyPointsFieldId?: string) {
  return [
    'assignee',
    'comment',
    'description',
    'issuelinks',
    'issuetype',
    'labels',
    'parent',
    'project',
    'reporter',
    'status',
    'summary',
    storyPointsFieldId,
  ].filter(Boolean) as string[]
}

/** Slimmer field set for JQL search rows (lists and children). */
function getSearchFields(storyPointsFieldId?: string) {
  return [
    'assignee',
    'issuetype',
    'parent',
    'project',
    'status',
    'summary',
    storyPointsFieldId,
  ].filter(Boolean) as string[]
}

/** Human-readable label from Jira user or named entity payloads. */
function getDisplayName(value?: RawNamedEntity | null) {
  return value?.displayName || value?.name || undefined
}

/** User-shaped field from REST (assignee, reporter, comment author). */
function normalizePerson(value?: RawNamedEntity | null): JiraNamedUser | undefined {
  const displayName = getDisplayName(value)
  if (!displayName) return undefined
  const emailAddress =
    value?.emailAddress && typeof value.emailAddress === 'string' ? value.emailAddress : undefined
  return emailAddress ? {displayName, emailAddress} : {displayName}
}

/** Reads numeric or string story points from configured or default custom fields. */
function getStoryPoints(fields: Record<string, sany>, storyPointsFieldId?: string) {
  if (storyPointsFieldId && fields[storyPointsFieldId] != null) return fields[storyPointsFieldId]
  if (fields[DEFAULT_STORY_POINTS_FIELD] != null) return fields[DEFAULT_STORY_POINTS_FIELD]
  return undefined
}

/** Flattens REST issue JSON into the list-row shape used across the UI. */
function normalizeIssue(issue: RawIssue, storyPointsFieldId?: string): JiraIssueListItem {
  const fields = issue.fields || {}
  return {
    assignee: normalizePerson(fields.assignee),
    issueType: getDisplayName(fields.issuetype),
    key: issue.key,
    parentKey: fields.parent?.key,
    projectKey: fields.project?.key || issue.key.split('-')[0],
    status: getDisplayName(fields.status),
    storyPoints: getStoryPoints(fields, storyPointsFieldId),
    summary: fields.summary || issue.key,
  }
}

/** Expands `issuelinks` into directed rows with link type labels, sorted by key. */
function normalizeLinkedIssues(
  links: sany[] | undefined,
  storyPointsFieldId?: string
): JiraLinkedIssue[] {
  if (!links?.length) return []

  return links
    .flatMap(link => {
      const records: JiraLinkedIssue[] = []

      if (link.inwardIssue) {
        records.push({
          ...normalizeIssue(link.inwardIssue, storyPointsFieldId),
          direction: 'inward',
          linkType: link.type?.inward || link.type?.name || 'Linked',
        })
      }

      if (link.outwardIssue) {
        records.push({
          ...normalizeIssue(link.outwardIssue, storyPointsFieldId),
          direction: 'outward',
          linkType: link.type?.outward || link.type?.name || 'Linked',
        })
      }

      return records
    })
    .sort((a, b) => issueKeyCompare(a.key, b.key))
}

/** Maps raw comment objects to author, timestamp, and ADF body. */
function normalizeComments(comments: sany[] | undefined): JiraComment[] {
  if (!comments?.length) return []
  return comments.map(comment => ({
    author: normalizePerson(comment.author),
    body: comment.body as JiraAdfDoc | null,
    created: comment.created,
    id: comment.id,
  }))
}

/** Query string for paginated `/search/jql` calls. */
function buildSearchPath(jql: string, fields: string[], startAt = 0) {
  const url = new URL('/rest/api/3/search/jql', location.origin)
  url.searchParams.set('jql', jql)
  url.searchParams.set('fields', fields.join(','))
  url.searchParams.set('maxResults', SEARCH_PAGE_SIZE.toString())
  if (startAt) url.searchParams.set('startAt', startAt.toString())
  return url.pathname + url.search
}

/** Walks every page of search results until `total` is satisfied. */
async function searchAllIssues(jql: string, fields: string[]) {
  const initial = await jiraFetchJson<{issues: RawIssue[]; total: number}>(
    buildSearchPath(jql, fields)
  )

  let issues = initial.issues || []
  for (let startAt = issues.length; startAt < initial.total; startAt += SEARCH_PAGE_SIZE) {
    const page = await jiraFetchJson<{issues: RawIssue[]}>(buildSearchPath(jql, fields, startAt))
    issues = issues.concat(page.issues || [])
  }

  return issues.sort((a, b) => issueKeyCompare(a.key, b.key))
}

/** Project record plus all issues matching built JQL, normalized for the table. */
export async function getProjectPageData(
  projectKey: string,
  extraJql: string | undefined,
  storyPointsFieldId?: string
) {
  const jql = buildProjectJql(projectKey, extraJql)
  const [project, issues] = await Promise.all([
    getProject(projectKey),
    searchAllIssues(jql, getSearchFields(storyPointsFieldId)),
  ])

  return {
    issueCount: issues.length,
    jql,
    project,
    issues: issues.map(issue => normalizeIssue(issue, storyPointsFieldId)),
  }
}

/** One issue with children, comments, description, links, labels, and reporter. */
export async function getIssuePageData(issueKey: string, storyPointsFieldId?: string) {
  const issueFields = getIssueFields(storyPointsFieldId)
  const issueUrl = new URL(`/rest/api/3/issue/${encodeURIComponent(issueKey)}`, location.origin)
  issueUrl.searchParams.set('fields', issueFields.join(','))

  const [issue, childrenSearch] = await Promise.all([
    jiraFetchJson<RawIssue>(issueUrl.pathname + issueUrl.search),
    searchAllIssues(`parent=${issueKey}`, getSearchFields(storyPointsFieldId)),
  ])

  const normalized = normalizeIssue(issue, storyPointsFieldId)
  const fields = issue.fields || {}

  const detail: JiraIssueDetail = {
    ...normalized,
    children: childrenSearch.map(child => normalizeIssue(child, storyPointsFieldId)),
    comments: normalizeComments(fields.comment?.comments),
    description: fields.description as JiraAdfDoc | null,
    labels: Array.isArray(fields.labels)
      ? (fields.labels as string[]).filter((x): x is string => typeof x === 'string')
      : [],
    linkedIssues: normalizeLinkedIssues(fields.issuelinks, storyPointsFieldId),
    reporter: normalizePerson(fields.reporter),
  }

  return detail
}
