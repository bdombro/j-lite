/*

default page: recent projects
project page
issue page

*/

if (!window.location.href.includes('jira-lite')) {
  window.location.href =
    'https://underarmour.atlassian.net/jira-lite?from=' + encodeURIComponent(window.location.href)
}

async function load() {
  document.body.classList.add('jira-lite')
  document.title = 'Jira Lite'
  document.body.innerHTML = `
    <div id="root"></div>
  `
  document.body.style.display = 'block'
  bundleJs()
}

document.body.style.display = 'none'
if (document.readyState === 'complete') {
  load()
} else {
  window.addEventListener('load', load)
}

function bundleJs() {

