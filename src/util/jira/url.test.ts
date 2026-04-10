import {beforeEach, describe, expect, it} from 'vitest'

import {buildProjectJql, issueKeyCompare, parseSourceHref} from './url'

describe('jira url helpers', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      value: new URL('https://demo.atlassian.net/j-lite'),
    })
  })

  it('builds project jql with optional extra filters', () => {
    expect(buildProjectJql('FC')).toBe('project=FC')
    expect(buildProjectJql('FC', 'status="To Do"')).toBe('project=FC AND status="To Do"')
  })

  it('parses browse urls into issue app links', () => {
    expect(parseSourceHref('https://demo.atlassian.net/browse/FC-123')).toEqual({
      appHref: '/j-lite/issues/FC-123',
      jiraHref: 'https://demo.atlassian.net/browse/FC-123',
      label: 'FC-123',
      type: 'issue',
    })
  })

  it('parses browse urls with trailing slash', () => {
    expect(parseSourceHref('https://demo.atlassian.net/browse/FC-123/')).toEqual({
      appHref: '/j-lite/issues/FC-123',
      jiraHref: 'https://demo.atlassian.net/browse/FC-123/',
      label: 'FC-123',
      type: 'issue',
    })
  })

  it('sorts issue keys numerically', () => {
    expect(['FC-20', 'FC-3', 'FC-100'].sort(issueKeyCompare)).toEqual(['FC-3', 'FC-20', 'FC-100'])
  })
})
