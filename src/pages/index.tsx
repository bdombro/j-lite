import {Layout} from '~/layout/layout-marketing'

/**
 * A demo of a home page
 */
export default function Index() {
  document.title = 'Jira Lite'
  // useEffect(() => {
  //   const res = fetch('https://underarmour.atlassian.net/rest/api/3/myself')
  //     .then(r => r.json())
  //     .then(console.log)
  // }, [])
  return (
    <Layout>
      <Layout.Section>
        <h1>Jira Lite</h1>
        <p>coming soon...</p>
      </Layout.Section>
    </Layout>
  )
}
