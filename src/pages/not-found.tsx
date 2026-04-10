import {Layout} from '~/layout/layout-marketing'

/** 404 inside `/j-lite` vs elsewhere, with layout matched to each context. */
export default function NotFound() {
  const isJLite = location.pathname.startsWith('/j-lite')
  document.title = isJLite ? 'Not Found - J-Lite' : 'Not Found'

  if (isJLite) {
    return (
      <Layout>
        <Layout.Section>
          <div className="marketing-panel marketing-stack">
            <h1>Page not found</h1>
            <p>
              J-Lite does not have a screen for <code>{location.pathname}</code>.
            </p>
            <p>
              <a href="/j-lite">Go to dashboard</a>
            </p>
          </div>
        </Layout.Section>
      </Layout>
    )
  }

  return (
    <Layout>
      <Layout.Section _textAlign="center">
        <div className="marketing-panel marketing-stack">
          <Icon className="marketing-icon" name="error" size={120} />
          <h1>Page Not Found</h1>
          <p>Sorry, we can't find a page with that url</p>
        </div>
      </Layout.Section>
    </Layout>
  )
}
