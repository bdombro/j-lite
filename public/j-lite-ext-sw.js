function injectJiraLite(tabId) {
  chrome.scripting.executeScript({
    target: {tabId: tabId},
    files: ['j-lite-inject.js'],
  })
}

chrome.action.onClicked.addListener(tab => {
  if (tab.id) {
    injectJiraLite(tab.id)
  }
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    if (tab.url && tab.url.includes('atlassian.net/j-lite')) {
      injectJiraLite(tabId)
    }
  }
})

chrome.tabs.onActivated.addListener(activeInfo => {
  // No longer inject on tab activation
})
