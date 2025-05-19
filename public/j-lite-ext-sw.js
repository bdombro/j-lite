function isJiraUrl(tabUrl) {
  return Boolean(tabUrl && /^https:\/\/[^/]+\.atlassian\.net\//.test(tabUrl))
}

function isJLiteUrl(tabUrl) {
  if (!isJiraUrl(tabUrl)) return false

  try {
    return new URL(tabUrl).pathname.startsWith('/j-lite')
  } catch {
    return false
  }
}

function injectJiraLite(tabId) {
  chrome.scripting.executeScript({
    target: {tabId: tabId},
    files: ['j-lite-inject.js'],
  })
}

chrome.action.onClicked.addListener(tab => {
  if (tab.id && isJiraUrl(tab.url)) {
    injectJiraLite(tab.id)
  }
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && isJLiteUrl(tab.url)) {
    injectJiraLite(tabId)
  }
})
