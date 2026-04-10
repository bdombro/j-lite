import './project.css'

import {RouteMatch} from '@slimr/router'
import {useEffect} from 'react'

import {IssueTable, PageSection, StateNotice} from '~/components'
import {Layout} from '~/layout/layout-marketing'
import {
  buildJiraSoftwareProjectUrl,
  buildProjectHref,
  fullPageSameOriginIfNotJLite,
  getBootstrapData,
  getProjectPageData,
  getQuickFilterJql,
  pushRecentView,
  useCachedQuery,
} from '~/util/jira'

export default function ProjectPage({route}: {route: RouteMatch}) {
  const projectKey = route.urlParams?.projectKey?.toUpperCase()
  const extraJql = route.urlParams?.jql

  document.title = projectKey ? `${projectKey} - J-Lite` : 'Project - J-Lite'

  const bootstrap = useCachedQuery({
    cacheKey: 'bootstrap',
    fetcher: getBootstrapData,
  })

  const project = useCachedQuery({
    cacheKey: `project:${projectKey}:${extraJql || 'all'}`,
    deps: [projectKey, extraJql, bootstrap.data?.storyPointsFieldId],
    enabled: Boolean(projectKey && bootstrap.data),
    fetcher: () => getProjectPageData(projectKey!, extraJql, bootstrap.data?.storyPointsFieldId),
  })

  useEffect(() => {
    if (!project.data) return
    pushRecentView({
      href: buildProjectHref(project.data.project.key, extraJql),
      key: project.data.project.key,
      subtitle: `${project.data.issueCount} issues`,
      title: project.data.project.name,
      type: 'project',
    })
  }, [extraJql, project.data])

  return (
    <Layout>
      <Layout.Section>
        <article className="project-page">
          <header className="project-page__hero">
            <div className="project-page__hero-row">
              <div className="project-page__hero-copy">
                <h1>{project.data?.project.name || projectKey || 'Project'}</h1>
                <p className="project-page__lede">
                  Project key: {project.data?.project.key || projectKey}
                </p>
              </div>
              <div className="project-page__actions">
                {projectKey ? <a href={buildProjectHref(projectKey)}>Reset filters</a> : null}
                {projectKey ? (
                  <a href={buildProjectHref(projectKey, getQuickFilterJql('open'))}>Open</a>
                ) : null}
                {projectKey ? (
                  <a href={buildProjectHref(projectKey, getQuickFilterJql('todo'))}>To Do</a>
                ) : null}
                {projectKey ? (
                  <a href={buildProjectHref(projectKey, getQuickFilterJql('currentUser'))}>
                    Current User
                  </a>
                ) : null}
                {projectKey ? <a href="#" onClick={(e) => {
                  e.preventDefault()
                  window.open(`/browse/${projectKey}`, '_self')
                }
                }>Open in Jira</a> : null}
                <button
                  className="project-page__secondary-button"
                  onClick={project.refresh}
                  type="button"
                >
                  Refresh cache
                </button>
              </div>
            </div>

            <StateNotice
              error={bootstrap.error || project.error}
              fetchedAt={project.fetchedAt || bootstrap.fetchedAt}
              loading={bootstrap.loading || project.loading}
              refreshing={bootstrap.refreshing || project.refreshing}
            />

            {project.data?.jql ? (
              <section aria-labelledby="project-jql" className="project-page__filter-summary">
                <h2 id="project-jql">Active filter</h2>
                <p>{project.data.jql}</p>
              </section>
            ) : null}
          </header>

          <section className="project-page__section">
            <PageSection title="Issues">
              <IssueTable
                caption={
                  project.data
                    ? `${project.data.issueCount} issue${project.data.issueCount === 1 ? '' : 's'}`
                    : undefined
                }
                issues={project.data?.issues || []}
              />
            </PageSection>
          </section>
        </article>
      </Layout.Section>
    </Layout>
  )
}
