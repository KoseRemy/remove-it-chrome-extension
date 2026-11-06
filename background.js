const storageKey = "storage"

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "cleanNow") {
        deleteHistoryForKeyWords().then((count) => sendResponse({ count: count }));
        return true;
    }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab)  => {
    console.log("update:", changeInfo.title, tab.url);
    // "tab" parameter by chrome : contains url
    let title = changeInfo.title;
    if (!title) return;
    let url = tab.url;
    let keyWords = await getKeyWords();


    const isMatch = keyWords.some((word) =>
        title.toLowerCase().includes(word.toLowerCase()) 
        || url.toLowerCase().includes(word.toLowerCase()));
    console.log("update:", changeInfo.title, tab.url);
    if(isMatch){
        chrome.history.deleteUrl({url: tab.url});
    }
})

async function deleteHistoryForKeyWords(){
    let keyWords = await getKeyWords();
    let deletedCount = 0;
    for (const keyword of keyWords) {
        let results = await chrome.history.search({startTime: 0, text: keyword, maxResults: 1000000});
        for (const result of results) {
            await chrome.history.deleteUrl({url: result.url});
            deletedCount++;
        }
    }
    return deletedCount;
}

async function getKeyWords() {
    let result  = await chrome.storage.local.get([storageKey]);
    return result[storageKey] || []
}
