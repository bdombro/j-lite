import './issue.css'

import {RouteMatch} from '@slimr/router'
import {useEffect} from 'react'

import {
  ADFContent,
  CommentsList,
  InfoGrid,
  IssueTable,
  KeyBreadcrumbs,
  LinkedIssuesTable,
  PageSection,
  StateNotice,
} from '~/components'
import {Layout} from '~/layout/layout-marketing'
import {
  buildIssueHref,
  getBootstrapData,
  getIssuePageData,
  pushRecentView,
  useCachedQuery,
} from '~/util/jira'

/** Full issue detail: overview, children, links, description, and comments. */
export default function IssuePage({route}: {route: RouteMatch}) {
  const issueKey = route.urlParams?.issueKey?.toUpperCase()

  document.title = issueKey ? `${issueKey} - J-Lite` : 'Issue - J-Lite'

  const bootstrap = useCachedQuery({
    cacheKey: 'bootstrap',
    fetcher: getBootstrapData,
  })

  const issue = useCachedQuery({
    cacheKey: `issue:${issueKey}`,
    deps: [issueKey, bootstrap.data?.storyPointsFieldId],
    enabled: Boolean(issueKey && bootstrap.data),
    fetcher: () => getIssuePageData(issueKey!, bootstrap.data?.storyPointsFieldId),
  })

  useEffect(() => {
    if (!issue.data) return
    pushRecentView({
      href: buildIssueHref(issue.data.key),
      key: issue.data.key,
      subtitle: issue.data.status,
      title: issue.data.summary,
      type: 'issue',
    })
  }, [issue.data])

  return (
    <Layout>
      <Layout.Section>
        <article className="issue-page">
          <header className="issue-page__hero">
            <div className="issue-page__hero-row">
              <div className="issue-page__hero-copy">
                <h1>{issue.data?.summary || issueKey || 'Issue'}</h1>
                {issue.data ? (
                  <KeyBreadcrumbs
                    issueKey={issue.data.key}
                    parentKey={issue.data.parentKey}
                    projectKey={issue.data.projectKey}
                  />
                ) : null}
              </div>
              <div className="issue-page__actions">
                {issue.data ? <a href="#" onClick={(e) => {
                  e.preventDefault()
                  window.open(`/browse/${issue.data!.key}`, '_self')
                }
                }>Open in Jira</a> : null}
                <button
                  className="issue-page__secondary-button"
                  onClick={issue.refresh}
                  type="button"
                >
                  Refresh cache
                </button>
              </div>
            </div>

            <StateNotice
              error={bootstrap.error || issue.error}
              fetchedAt={issue.fetchedAt || bootstrap.fetchedAt}
              loading={bootstrap.loading || issue.loading}
              refreshing={bootstrap.refreshing || issue.refreshing}
            />
          </header>

          <section aria-labelledby="issue-overview" className="issue-page__section">
            <h2 id="issue-overview">Overview</h2>
            <InfoGrid
              items={[
                {label: 'Issue Type', value: issue.data?.issueType},
                {label: 'Status', value: issue.data?.status},
                {label: 'Assignee', value: issue.data?.assignee},
                {label: 'Reporter', value: issue.data?.reporter},
                {label: 'Story Points', value: issue.data?.storyPoints?.toString()},
                {label: 'Labels', value: issue.data?.labels?.join(', ') || undefined},
              ]}
            />
          </section>

          <section className="issue-page__section">
            <PageSection title="Children">
              <IssueTable issues={issue.data?.children || []} />
            </PageSection>
          </section>

          <section className="issue-page__section">
            <PageSection title="Linked Issues">
              <LinkedIssuesTable issues={issue.data?.linkedIssues || []} />
            </PageSection>
          </section>

          <section className="issue-page__section">
            <PageSection title="Description">
              <ADFContent doc={issue.data?.description} />
            </PageSection>
          </section>

          <section className="issue-page__section">
            <PageSection title="Comments">
              <CommentsList comments={issue.data?.comments || []} />
            </PageSection>
          </section>
        </article>
      </Layout.Section>
    </Layout>
  )
}
