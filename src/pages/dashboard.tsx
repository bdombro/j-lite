import './dashboard.css'

import {RouteMatch} from '@slimr/router'
import {useMemo, useState} from 'react'

import {PageSection, StateNotice} from '~/components'
import {Layout} from '~/layout/layout-marketing'
import {
  clearJLiteStorage,
  getBootstrapData,
  getFromHref,
  getRecentViews,
  parseSourceHref,
  useCachedQuery,
} from '~/util/jira'

export default function Dashboard({url}: {route: RouteMatch; url: URL}) {
  document.title = 'J-Lite'
  const [cacheVersion, setCacheVersion] = useState(0)

  const bootstrap = useCachedQuery({
    cacheKey: 'bootstrap',
    fetcher: getBootstrapData,
  })
  const fromInfo = parseSourceHref(getFromHref(url))
  const recentProjects = useMemo(() => getRecentViews('project'), [cacheVersion])
  const recentIssues = useMemo(() => getRecentViews('issue'), [cacheVersion])

  return (
    <Layout>
      <Layout.Section>
        <article className="dashboard-page">
          <header className="dashboard-page__hero">
            <div className="dashboard-page__hero-row">
              <div className="dashboard-page__hero-copy">
                <h1>J-Lite</h1>
                <p className="dashboard-page__lede">
                  Read-only Jira browsing inside your current Atlassian tenant.
                </p>
              </div>
              {fromInfo?.appHref ? (
                <p className="dashboard-page__hero-actions">
                  <a className="dashboard-page__button" href={fromInfo.appHref}>
                    Continue from source tab
                  </a>
                </p>
              ) : null}
            </div>

            <StateNotice
              error={bootstrap.error}
              fetchedAt={bootstrap.fetchedAt}
              loading={bootstrap.loading}
              refreshing={bootstrap.refreshing}
            />
            {bootstrap.data ? (
              <section aria-labelledby="dashboard-session" className="dashboard-page__meta">
                <h2 id="dashboard-session">Current session</h2>
                <dl className="dashboard-page__meta-list">
                  <div>
                    <dt>Signed in as</dt>
                    <dd>{bootstrap.data.currentUser.displayName}</dd>
                  </div>
                  <div>
                    <dt>Authentication</dt>
                    <dd>{bootstrap.data.authStrategy}</dd>
                  </div>
                </dl>
              </section>
            ) : null}

            {fromInfo ? (
              <section aria-labelledby="dashboard-source-tab" className="dashboard-page__source">
                <h2 id="dashboard-source-tab">Source tab</h2>
                <p className="dashboard-page__supporting-text">
                  You opened J-Lite from an existing Jira page.
                </p>
                <p className="dashboard-page__source-link">{fromInfo.jiraHref}</p>
                <p className="dashboard-page__link-row">
                  {fromInfo.appHref ? <a href={fromInfo.appHref}>Open in J-Lite</a> : null}
                  <a href={fromInfo.jiraHref}>Open original Jira page</a>
                </p>
              </section>
            ) : null}
          </header>

          <section aria-labelledby="dashboard-recents" className="dashboard-page__section">
            <PageSection title="Recent views">
              <div className="dashboard-page__recents">
                <RecentList
                  empty="No recently viewed projects yet."
                  items={recentProjects}
                  title="Projects"
                />
                <RecentList
                  empty="No recently viewed issues yet."
                  items={recentIssues}
                  title="Issues"
                />
              </div>
            </PageSection>
          </section>

          <section aria-labelledby="dashboard-cache" className="dashboard-page__section">
            <PageSection
              title="Local Cache"
              actions={
                <button
                  className="dashboard-page__secondary-button"
                  onClick={() => {
                    clearJLiteStorage()
                    setCacheVersion(version => version + 1)
                  }}
                  type="button"
                >
                  Clear cache
                </button>
              }
            >
              <p className="dashboard-page__supporting-text">
                Cached project and issue responses are stored locally so recent screens can open
                faster and still show data during brief outages.
              </p>
            </PageSection>
          </section>
        </article>
      </Layout.Section>
    </Layout>
  )
}

function RecentList({
  empty,
  items,
  title,
}: {
  empty: string
  items: ReturnType<typeof getRecentViews>
  title: string
}) {
  return (
    <section className="page-section">
      <div className="section-header">
        <h3>{title}</h3>
      </div>
      {items.length ? (
        <div className="dashboard-page__recent-list">
          {items.map(item => (
            <a className="dashboard-page__recent-card" href={item.href} key={item.href}>
              <strong>{item.key}</strong>
              <span>{item.title}</span>
              {item.subtitle ? (
                <span className="dashboard-page__recent-subtitle">{item.subtitle}</span>
              ) : null}
            </a>
          ))}
        </div>
      ) : (
        <div className="dashboard-page__empty">{empty}</div>
      )}
    </section>
  )
}
