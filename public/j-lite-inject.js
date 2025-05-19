if (!window.location.href.includes('j-lite')) {
  window.location.href =
    'https://underarmour.atlassian.net/j-lite?from=' + encodeURIComponent(window.location.href)
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

