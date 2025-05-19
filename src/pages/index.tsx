import {Layout} from '~/layout/layout-marketing'

/**
 * A demo of a home page
 */
export default function Index() {
  document.title = 'J-Lite'
  // useEffect(() => {
  //   const res = fetch('https://underarmour.atlassian.net/rest/api/3/myself')
  //     .then(r => r.json())
  //     .then(console.log)
  // }, [])

  const recentProjects = ['FC']
  const recentIssues = [
    {
      id: 'FC-1',
      summary: 'First Issue',
      status: 'To Do',
      project: 'FC',
    },
  ]

  return (
    <Layout>
      <Layout.Section>
        <h1>J-Lite</h1>
        <p>A lightweight ('lite') Jira project and issue browser</p>

        <h3>Recent Projects</h3>
        <ul>
          {recentProjects.map(project => (
            <li key={project}>
              <a href={`/${project}`}>{project}</a>
            </li>
          ))}
        </ul>

        <h3>Recent Issues</h3>
        <ul>
          {recentIssues.map(issue => (
            <li key={issue.id}>
              <a href={`/${issue.project}/${issue.id}`}>
                {issue.id}: {issue.summary} ({issue.status})
              </a>
            </li>
          ))}
        </ul>

        <p>TODOs:</p>
        <ol>
          <li>Login</li>
          <li>Dashboard</li>
          <li>Project</li>
          <li>Issue</li>
          <li>Search</li>
          <li>Settings</li>
          <li>Offline</li>
        </ol>
      </Layout.Section>
    </Layout>
  )
}
