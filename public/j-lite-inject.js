const JLITE_PATH_PREFIX = '/j-lite'

if (!window.location.pathname.startsWith(JLITE_PATH_PREFIX)) {
  const nextUrl = new URL(`${window.location.origin}${JLITE_PATH_PREFIX}`)
  nextUrl.searchParams.set('from', window.location.href)
  window.location.href = nextUrl.toString()
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

