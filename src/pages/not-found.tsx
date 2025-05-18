import {Layout} from '~/layout/layout-marketing'

/**
 * A page shown when a route is not found
 */
export default function NotFound() {
  document.title = 'Not Found'
  return (
    <Layout>
      <Layout.Section _textAlign="center">
        <Icon name="error" size={120} />
        <h1 style={{marginTop: 20}}>Page Not Found</h1>
        <p>Sorry, we can't find a page with that url</p>
      </Layout.Section>
    </Layout>
  )
}
