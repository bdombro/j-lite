/*

default page: recent projects
project page
issue page

*/

if (!window.location.href.includes('jira-lite')) {
  window.location.href =
    'https://underarmour.atlassian.net/jira-lite?from=' + encodeURIComponent(window.location.href)
}

async function getCurrentUser() {
  const res = await fetch('https://underarmour.atlassian.net/rest/api/3/myself')
  if (res.ok) {
    const data = await res.json()
    return data
  } else {
    throw new Error('Failed to fetch current user')
  }
}

async function load() {
  const urlParams = new URLSearchParams(window.location.search)
  const fromUrl = urlParams.get('from')
  console.log({currentUser: await getCurrentUser()})
  document.body.classList.add('jira-lite')
  if (fromUrl) {
    document.title = 'Jira Lite'
    document.body.innerHTML = `
      <h1>Jira Lite</h1>
      <p>This is a lite version of Jira.</p>
      <p>Redirected from <a href="${fromUrl}">${fromUrl}</a></p>
    `
    document.body.style.display = 'block'
  } else {
    document.title = 'Jira Lite'
    document.body.innerHTML = `
      <div id="root"></div>
    `
    document.body.style.display = 'block'
    bundleJs()
  }
}

const styleElement = document.createElement('style')
styleElement.textContent = styles()
document.head.appendChild(styleElement)

document.body.style.display = 'none'
if (document.readyState === 'complete') {
  load()
} else {
  window.addEventListener('load', load)
}

function styles() {
return `
:root {
  --background-color: #dff;
  --link-color: #0077cc;
  --link-color-active: #04a;
  --text-color: #333;
  @media (prefers-color-scheme: dark) {
    color-scheme: dark;
    --background-color: #141414;
    --link-color: #0099ff;
    --link-color-active: #7af;
    --text-color: #ccc;
  }
}
body {
  background-color: var(--background-color);
  color: var(--text-color);
  margin: 0 40px;
}

th {
  text-align: left;
}

li > p {
  margin: 0.4em 0;
}
a {
  color: var(--link-color);
}
a:active,
.a-active {
  color: var(--link-color-active);
}
`
}

function bundleJs() {
  
}