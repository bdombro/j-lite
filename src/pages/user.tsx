import './issue.css'
import './user.css'

import {RouteMatch} from '@slimr/router'

import {IssueTable, PageSection, StateNotice} from '~/components'
import {Layout} from '~/layout/layout-marketing'
import {getBootstrapData, getUserPageData, useCachedQuery} from '~/util/jira'

function decodeEmailParam(raw: string | undefined) {
  if (!raw) return undefined
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

/** User profile: display name, email, and issues assigned to that Jira user (from URL email). */
export default function UserPage({route}: {route: RouteMatch}) {
  const email = decodeEmailParam(route.urlParams?.email)?.trim()
  const cacheEmail = email?.toLowerCase() || ''

  document.title = email ? `${email} - J-Lite` : 'User - J-Lite'

  const bootstrap = useCachedQuery({
    cacheKey: 'bootstrap',
    fetcher: getBootstrapData,
  })

  const userPage = useCachedQuery({
    cacheKey: `user:${cacheEmail}`,
    deps: [cacheEmail, bootstrap.data?.storyPointsFieldId],
    enabled: Boolean(cacheEmail && bootstrap.data),
    fetcher: () => getUserPageData(email!, bootstrap.data?.storyPointsFieldId),
  })

  return (
    <Layout>
      <Layout.Section>
        <article className="issue-page issue-page--user">
          <header className="issue-page__hero">
            <div className="issue-page__hero-row">
              <div className="issue-page__hero-copy">
                <h1>
                  {userPage.data?.user.displayName || email || 'User'}
                </h1>
                {email ? (
                  <p>Email: {userPage.data?.user.emailAddress ?? email}</p>
                ) : null}
                <StateNotice
                  error={
                    !email
                      ? 'Missing email in the URL. Use /j-lite/users/ followed by a URL-encoded address (for example /j-lite/users/you%40company.com).'
                      : bootstrap.error || userPage.error
                  }
                  fetchedAt={email ? userPage.fetchedAt || bootstrap.fetchedAt : undefined}
                  loading={Boolean(email) && (bootstrap.loading || userPage.loading)}
                  refreshing={Boolean(email) && (bootstrap.refreshing || userPage.refreshing)}
                />
              </div>
              <div className="issue-page__actions">
                {userPage.data?.user.accountId ? (
                  <a
                    href="#"
                    onClick={e => {
                      e.preventDefault()
                      window.open(
                        `/jira/people/${encodeURIComponent(userPage.data!.user.accountId)}`,
                        '_self'
                      )
                    }}
                  >
                    Open in Jira
                  </a>
                ) : null}
                <button
                  className="issue-page__secondary-button"
                  onClick={userPage.refresh}
                  type="button"
                >
                  Refresh cache
                </button>
              </div>
            </div>
          </header>

          {userPage.data ? (
            <>
              <section className="issue-page__section">
                <PageSection title="Assigned issues">
                  <IssueTable
                    caption={
                      userPage.data
                        ? `${userPage.data.issueCount} issue${
                            userPage.data.issueCount === 1 ? '' : 's'
                          }`
                        : undefined
                    }
                    issues={userPage.data.issues}
                    showAssignee={false}
                  />
                </PageSection>
              </section>
            </>
          ) : null}
        </article>
      </Layout.Section>
    </Layout>
  )
}
