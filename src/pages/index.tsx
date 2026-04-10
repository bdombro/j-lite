import './index.css'

import {Layout} from '~/layout/layout-marketing'

/** Marketing landing: what J-Lite is and a CTA into the dashboard. */
export default function Index() {
  document.title = 'J-Lite — A Simpler Way to Browse Jira'

  return (
    <Layout>
      <Layout.Section>
        <article className="index-page">
          <header className="index-page__hero">
            <p className="index-page__eyebrow">A simpler way to browse Jira</p>
            <h1>J-Lite</h1>
            <p className="index-page__lede">
              A lightweight, offline-friendly Jira browser that lives right inside your company's
              Atlassian site.
            </p>
            <p>
              Browse projects, view issues, and read comments without the overhead of the full Jira
              interface.
            </p>
          </header>

          <section aria-labelledby="index-what-it-does" className="index-page__section">
            <h2 id="index-what-it-does">What does it do?</h2>
            <p>
              J-Lite gives you a fast, simplified view of your Jira projects and issues. Think of it
              as a quick-reference tool: you can look up work items, check statuses, and read
              details without editing anything or getting lost in menus.
            </p>
          </section>

          <section aria-labelledby="index-who-its-for" className="index-page__section">
            <h2 id="index-who-its-for">Who is it for?</h2>
            <p>
              Anyone on a team that uses Jira, whether you're a developer, designer, project
              manager, or stakeholder. If you just need to check in on progress without wading
              through the full Jira experience, J-Lite is for you.
            </p>
          </section>

          <section aria-labelledby="index-how-it-works" className="index-page__section">
            <h2 id="index-how-it-works">How it works</h2>

            <div className="index-page__feature-grid">
              <section className="index-page__feature">
                <h3>Browse projects</h3>
                <p>See all the issues in a project at a glance, with quick filters for status.</p>
              </section>

              <section className="index-page__feature">
                <h3>View issues</h3>
                <p>
                  Read summaries, descriptions, comments, and linked work items in a clean layout.
                </p>
              </section>

              <section className="index-page__feature">
                <h3>Works offline</h3>
                <p>
                  Recently viewed pages are cached locally, so you can still review them if your
                  connection drops.
                </p>
              </section>

              <section className="index-page__feature">
                <h3>No login required</h3>
                <p>
                  J-Lite piggybacks on your existing Atlassian session. If you're already signed in
                  to Jira, you're good to go.
                </p>
              </section>
            </div>
          </section>

          <section aria-labelledby="index-get-started" className="index-page__cta">
            <h2 id="index-get-started">Get started</h2>
            <p>Open the dashboard to start browsing your projects and issues.</p>
            <p>
              <a className="index-page__button" href="/j-lite">
                Open J-Lite dashboard
              </a>
            </p>
          </section>
        </article>
      </Layout.Section>
    </Layout>
  )
}
