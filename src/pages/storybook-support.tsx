import {RouteMatch} from '@slimr/router'
import React, {useLayoutEffect, useMemo} from 'react'

import type {RecentView} from '~/util/jira'
import {writeCachedValue} from '~/util/jira'

import {
  storyCurrentUser,
  storyFieldDefinitions,
  storyIssue,
  storyIssueChildren,
  storyMinimalIssue,
  storyProject,
  storyProjectIssues,
  storyRecentIssues,
  storyRecentProjects,
} from './storybook-fixtures'

export type JiraStoryMode = 'happy' | 'bootstrap-error' | 'project-error' | 'issue-error'
export type StoryRecentsMode = 'none' | 'projects' | 'issues' | 'both'
export type StorySourceMode = 'none' | 'issue' | 'project'
export type ProjectStoryDataset = 'default' | 'empty'
export type ProjectStoryFilter = 'all' | 'open' | 'todo' | 'currentUser'
export type IssueStoryDataset = 'default' | 'minimal'

type JiraStoryEnvironmentProps = {
  children: React.ReactNode
  issueDataset?: IssueStoryDataset
  mode?: JiraStoryMode
  path: string
  projectDataset?: ProjectStoryDataset
  recentIssues?: RecentView[]
  recentProjects?: RecentView[]
}

function makeResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
    },
    status: 200,
    ...init,
  })
}

function getSearchIssues(jql: string | null, projectDataset: ProjectStoryDataset) {
  if (projectDataset === 'empty') return []
  if (!jql) return storyProjectIssues

  if (jql.startsWith('parent=FC-207')) {
    return storyIssueChildren.issues
  }

  if (jql.startsWith('parent=')) {
    return []
  }

  const base = [...storyProjectIssues]

  if (jql.includes('NOT status="Done"')) {
    return base.filter(issue => issue.fields.status.name !== 'Done')
  }

  if (jql.includes('status="To Do"')) {
    return base.filter(issue => issue.fields.status.name === 'To Do')
  }

  if (jql.includes('assignee=currentUser()')) {
    return base.filter(issue => issue.fields.assignee?.displayName === storyCurrentUser.displayName)
  }

  return base
}

function makeFetch(
  mode: JiraStoryMode,
  projectDataset: ProjectStoryDataset,
  issueDataset: IssueStoryDataset
) {
  return async (input: RequestInfo | URL) => {
    const requestUrl = new URL(
      typeof input === 'string' ? input : input.toString(),
      location.origin
    )

    if (mode === 'bootstrap-error' && requestUrl.pathname === '/rest/api/3/myself') {
      return makeResponse(
        {message: 'Storybook bootstrap failure'},
        {status: 500, statusText: 'Error'}
      )
    }

    if (requestUrl.pathname === '/rest/api/3/myself') {
      return makeResponse(storyCurrentUser)
    }

    if (requestUrl.pathname === '/rest/api/3/field') {
      return makeResponse(storyFieldDefinitions)
    }

    if (mode === 'project-error' && requestUrl.pathname.startsWith('/rest/api/3/project/')) {
      return makeResponse(
        {message: 'Project unavailable'},
        {status: 503, statusText: 'Unavailable'}
      )
    }

    if (requestUrl.pathname.startsWith('/rest/api/3/project/')) {
      return makeResponse(storyProject)
    }

    if (mode === 'issue-error' && requestUrl.pathname.startsWith('/rest/api/3/issue/')) {
      return makeResponse({message: 'Issue unavailable'}, {status: 404, statusText: 'Missing'})
    }

    if (requestUrl.pathname.startsWith('/rest/api/3/issue/')) {
      return makeResponse(issueDataset === 'minimal' ? storyMinimalIssue : storyIssue)
    }

    if (mode === 'project-error' && requestUrl.pathname === '/rest/api/3/search/jql') {
      return makeResponse({message: 'Search unavailable'}, {status: 500, statusText: 'Error'})
    }

    if (requestUrl.pathname === '/rest/api/3/search/jql') {
      const issues = getSearchIssues(requestUrl.searchParams.get('jql'), projectDataset)
      return makeResponse({
        issues,
        maxResults: 100,
        startAt: 0,
        total: issues.length,
      })
    }

    return makeResponse(
      {message: `Unhandled Storybook request for ${requestUrl.pathname}`},
      {status: 404}
    )
  }
}

export function JiraStoryEnvironment({
  children,
  issueDataset = 'default',
  mode = 'happy',
  path,
  projectDataset = 'default',
  recentIssues = [],
  recentProjects = [],
}: JiraStoryEnvironmentProps) {
  const nextUrl = useMemo(() => new URL(path, 'http://localhost'), [path])

  useLayoutEffect(() => {
    const originalFetch = window.fetch.bind(window)
    const previousUrl = location.pathname + location.search + location.hash

    history.replaceState({}, '', nextUrl.pathname + nextUrl.search + nextUrl.hash)
    window.fetch = makeFetch(mode, projectDataset, issueDataset) as typeof window.fetch

    writeCachedValue('recent:project', recentProjects)
    writeCachedValue('recent:issue', recentIssues)

    return () => {
      window.fetch = originalFetch
      history.replaceState({}, '', previousUrl)
      localStorage.removeItem('j-lite:v1:recent:project')
      localStorage.removeItem('j-lite:v1:recent:issue')
    }
  }, [issueDataset, mode, nextUrl, projectDataset, recentIssues, recentProjects])

  return <>{children}</>
}

export function makeRouteMatch(path: string, urlParams: Record<string, string> = {}) {
  return {
    component: (() => null) as React.FC<object>,
    exact: true,
    isMatch: () => urlParams,
    key: 'storybook-route',
    path,
    toPath: () => path,
    urlParams,
  } as RouteMatch
}

export function makeStoryUrl(path: string) {
  return new URL(path, 'http://localhost')
}

export function getRecentStoryData(recents: StoryRecentsMode) {
  if (recents === 'none') {
    return {recentIssues: [], recentProjects: []}
  }

  return {
    recentIssues: recents === 'issues' || recents === 'both' ? storyRecentIssues : [],
    recentProjects: recents === 'projects' || recents === 'both' ? storyRecentProjects : [],
  }
}

export function getSourceHref(source: StorySourceMode) {
  if (source === 'issue') return 'https://demo.atlassian.net/browse/FC-207'
  if (source === 'project') return 'https://demo.atlassian.net/jira/software/projects/FC/board'
  return undefined
}

export function buildDashboardPath(source: StorySourceMode) {
  const from = getSourceHref(source)
  if (!from) return '/j-lite'

  const url = new URL('/j-lite', 'http://localhost')
  url.searchParams.set('from', from)
  return url.pathname + url.search
}

export function buildSettingsPath(source: StorySourceMode) {
  const from = getSourceHref(source)
  if (!from) return '/j-lite/settings'

  const url = new URL('/j-lite/settings', 'http://localhost')
  url.searchParams.set('from', from)
  return url.pathname + url.search
}

export function buildProjectPath(projectKey: string, filter: ProjectStoryFilter) {
  const url = new URL(`/j-lite/projects/${projectKey}`, 'http://localhost')
  if (filter === 'open') url.searchParams.set('jql', 'NOT status="Done"')
  if (filter === 'todo') url.searchParams.set('jql', 'status="To Do"')
  if (filter === 'currentUser') url.searchParams.set('jql', 'assignee=currentUser()')
  return url.pathname + url.search
}

export function getProjectRouteMatch(projectKey: string, filter: ProjectStoryFilter) {
  const urlParams: Record<string, string> = {projectKey}
  if (filter === 'open') urlParams.jql = 'NOT status="Done"'
  if (filter === 'todo') urlParams.jql = 'status="To Do"'
  if (filter === 'currentUser') urlParams.jql = 'assignee=currentUser()'
  return makeRouteMatch(`/j-lite/projects/${projectKey}`, urlParams)
}
