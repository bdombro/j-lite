import {
  JiraAdfDoc,
  JiraBootstrap,
  JiraComment,
  JiraIssueDetail,
  JiraIssueListItem,
  JiraLinkedIssue,
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
    assignee: getDisplayName(fields.assignee),
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
    author: getDisplayName(comment.author),
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
    reporter: getDisplayName(fields.reporter),
  }

  return detail
}
