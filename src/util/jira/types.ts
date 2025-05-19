export interface JiraUser {
  accountId?: string
  displayName: string
  emailAddress?: string
}

export interface JiraProject {
  id?: string
  key: string
  name: string
  projectTypeKey?: string
}

export interface JiraIssueListItem {
  issueType?: string
  key: string
  parentKey?: string
  projectKey: string
  status?: string
  storyPoints?: number | string
  summary: string
  assignee?: string
}

export interface JiraComment {
  author?: string
  body?: JiraAdfDoc | null
  created?: string
  id?: string
}

export interface JiraLinkedIssue extends JiraIssueListItem {
  direction: 'inward' | 'outward'
  linkType: string
}

export interface JiraIssueDetail extends JiraIssueListItem {
  comments: JiraComment[]
  description?: JiraAdfDoc | null
  linkedIssues: JiraLinkedIssue[]
  reporter?: string
  children: JiraIssueListItem[]
}

export interface JiraBootstrap {
  authStrategy: 'same-origin-browser-session'
  currentUser: JiraUser
  storyPointsFieldId?: string
  tenantOrigin: string
}

export interface JiraAdfMark {
  type?: string
}

export interface JiraAdfNode {
  attrs?: Record<string, sany>
  content?: JiraAdfNode[]
  marks?: JiraAdfMark[]
  text?: string
  type?: string
}

export interface JiraAdfDoc {
  content?: JiraAdfNode[]
  type?: string
  version?: number
}

export interface CachedValue<T> {
  data: T
  fetchedAt: number
}

export interface RecentView {
  href: string
  key: string
  subtitle?: string
  title: string
  type: 'issue' | 'project'
  viewedAt: number
}
