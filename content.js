let targetElement = null;

// Event listerner triggers when user right clicks an element -> Stores in a variables.
document.addEventListener("contextmenu", (event) => {
    targetElement = event.target;
});

// Recieves message from background.js -> removes element when right clicked.w
chrome.runtime.onMessage.addListener((message) => {
    if (message === "remove-it" && targetElement) {
        targetElement.remove();
    }
});