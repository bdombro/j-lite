/** Signed-in person returned from `/myself` and echoed in bootstrap. */
export interface JiraUser {
  accountId?: string
  displayName: string
  emailAddress?: string
}

/**
 * Person shown on issues and comments: display name plus optional email for linking to `/j-lite/users/...`.
 */
export interface JiraNamedUser {
  displayName: string
  emailAddress?: string
}

/** Project metadata from `/project/:key` (key, name, optional type). */
export interface JiraProject {
  id?: string
  key: string
  name: string
  projectTypeKey?: string
}

/** Flattened issue row used in project tables, links, and child lists. */
export interface JiraIssueListItem {
  issueType?: string
  key: string
  parentKey?: string
  projectKey: string
  status?: string
  storyPoints?: number | string
  summary: string
  assignee?: JiraNamedUser
}

/** Single comment with author, timestamp, and optional ADF body. */
export interface JiraComment {
  author?: JiraNamedUser
  body?: JiraAdfDoc | null
  created?: string
  id?: string
}

/** Related issue plus inward/outward direction and human link-type label. */
export interface JiraLinkedIssue extends JiraIssueListItem {
  direction: 'inward' | 'outward'
  linkType: string
}

/** Issue detail view: list fields plus description, comments, links, labels, children. */
export interface JiraIssueDetail extends JiraIssueListItem {
  comments: JiraComment[]
  description?: JiraAdfDoc | null
  labels: string[]
  linkedIssues: JiraLinkedIssue[]
  reporter?: JiraNamedUser
  children: JiraIssueListItem[]
}

/** First-load bundle: auth mode, current user, story-points field id, tenant origin. */
export interface JiraBootstrap {
  authStrategy: 'same-origin-browser-session'
  currentUser: JiraUser
  storyPointsFieldId?: string
  tenantOrigin: string
}

/** Inline mark on ADF text (e.g. strong, em). */
export interface JiraAdfMark {
  type?: string
}

/** Recursive ADF node: type, optional text, marks, attrs, and child nodes. */
export interface JiraAdfNode {
  attrs?: Record<string, sany>
  content?: JiraAdfNode[]
  marks?: JiraAdfMark[]
  text?: string
  type?: string
}

/** Root Atlassian Document Format payload (version, type, top-level content). */
export interface JiraAdfDoc {
  content?: JiraAdfNode[]
  type?: string
  version?: number
}

/** JSON-serializable cache envelope with server snapshot time. */
export interface CachedValue<T> {
  data: T
  fetchedAt: number
}

/** One remembered navigation target shown on the dashboard recents lists. */
export interface RecentView {
  href: string
  key: string
  subtitle?: string
  title: string
  type: 'issue' | 'project'
  viewedAt: number
}
