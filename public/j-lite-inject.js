const JLITE_PATH_PREFIX = '/j-lite'


if (!window.location.pathname.startsWith(JLITE_PATH_PREFIX)) {
  const deep = jLiteUrlForJiraTab(window.location.href)
  const nextUrl =
    deep ||
    (() => {
      const fallback = new URL(`${window.location.origin}${JLITE_PATH_PREFIX}`)
      fallback.searchParams.set('from', window.location.href)
      return fallback.toString()
    })()
  window.location.href = nextUrl
}

async function load() {
  if (document.body.classList.contains('j-lite')) return
  console.debug('loading j-lite')
  document.body.classList.add('j-lite')
  document.title = 'J-Lite'
  document.body.innerHTML = `
    <div id="root"></div>
  `
  ;(() => {
    const script = document.createElement('script')
    script.src = chrome.runtime.getURL('main.js')
    script.type = 'module'
    document.body.appendChild(script)
  })()
  document.body.style.visibility = 'visible'
}

if (document.readyState === 'complete') {
  load()
} else {
  window.addEventListener('load', load)
}

/**
 * Deep-link into j-lite when the tab is a recognizable Jira page.
 * Keep pathname rules aligned with `parseSourceHref` in `src/util/jira/url.ts`.
 */
function jLiteUrlForJiraTab(href) {
  let url
  try {
    url = new URL(href)
  } catch {
    return null
  }
  const path = url.pathname.replace(/\/+$/, '') || '/'
  const browseMatch = path.match(/^\/browse\/([A-Z][A-Z0-9_]+-\d+)$/i)
  if (browseMatch) {
    const issueKey = browseMatch[1].toUpperCase()
    const next = new URL(
      `${url.origin}${JLITE_PATH_PREFIX}/issues/${encodeURIComponent(issueKey)}`
    )
    next.searchParams.set('from', href)
    return next.toString()
  }
  const projectMatch = path.match(/^\/jira\/software\/projects\/([^/]+)/i)
  if (projectMatch) {
    const projectKey = projectMatch[1].toUpperCase()
    const next = new URL(
      `${url.origin}${JLITE_PATH_PREFIX}/projects/${encodeURIComponent(projectKey)}`
    )
    next.searchParams.set('from', href)
    return next.toString()
  }
  return null
}