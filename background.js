// Adds a button upon right click.
chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
      id: "remove-it",
      title: "💢 remove-it",
      type: 'normal',
      contexts: ['all']
    });
});

// Tells contentscript to do its job when relevant button is clicked.
// .sendMessage auto sends msg to content script in that tab.
chrome.contextMenus.onClicked.addListener((item, tab) => {
    if (item.menuItemId === "remove-it") {
        chrome.tabs.sendMessage(tab.id, "remove-it");
    }
});