import {RouteMatch} from '@slimr/router'
import {useState} from 'react'

import {InfoGrid, PageSection, StateNotice} from '~/components'
import {Layout} from '~/layout/layout-marketing'
import {
  clearJLiteStorage,
  getBootstrapData,
  listJLiteStorageKeys,
  useCachedQuery,
} from '~/util/jira'

/** Tenant/session summary and a readout of keys stored in local cache. */
export default function SettingsPage({url}: {route: RouteMatch; url: URL}) {
  document.title = 'Settings - J-Lite'
  const [cacheVersion, setCacheVersion] = useState(0)

  const bootstrap = useCachedQuery({
    cacheKey: 'bootstrap',
    fetcher: getBootstrapData,
  })

  const cacheKeys = listJLiteStorageKeys()

  return (
    <Layout>
      <Layout.Section>
        <div className="page-stack">
          <div className="hero-card">
            <div className="hero-row">
              <div>
                <h1>Settings</h1>
                <p className="muted">Tenant-aware extension details and local storage controls.</p>
              </div>
              <div className="page-actions">
                <button
                  onClick={() => {
                    clearJLiteStorage()
                    setCacheVersion(version => version + 1)
                  }}
                  type="button"
                >
                  Clear cache
                </button>
              </div>
            </div>
            <StateNotice
              error={bootstrap.error}
              fetchedAt={bootstrap.fetchedAt}
              loading={bootstrap.loading}
              refreshing={bootstrap.refreshing}
            />
          </div>

          <PageSection title="Extension Session">
            <InfoGrid
              items={[
                {label: 'Tenant Origin', value: bootstrap.data?.tenantOrigin || location.origin},
                {label: 'User', value: bootstrap.data?.currentUser.displayName},
                {label: 'Story Points Field', value: bootstrap.data?.storyPointsFieldId},
                {label: 'Source Query', value: url.searchParams.get('from') || 'none'},
              ]}
            />
          </PageSection>

          <PageSection title={`Local Cache (${cacheKeys.length})`}>
            <div className="notice-card" key={`cache-${cacheVersion}`}>
              {cacheKeys.length ? (
                <ul>
                  {cacheKeys.map(key => (
                    <li key={key}>{key}</li>
                  ))}
                </ul>
              ) : (
                <p className="muted">No cached entries stored yet.</p>
              )}
            </div>
          </PageSection>
        </div>
      </Layout.Section>
    </Layout>
  )
}
