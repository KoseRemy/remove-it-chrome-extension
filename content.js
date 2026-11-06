let targetElement = null;

// Event listerner triggers when user right clicks an element -> Stores in a variables.
document.addEventListener("contextmenu", (event) => {
    console.log("right-clicked:", targetElement);
    targetElement = event.target;
});

// Recieves message from background.js -> removes element when right clicked.w
chrome.runtime.onMessage.addListener((message) => {
    console.log("message:", message);
    if (message === "remove-it" && targetElement) {
        targetElement.parentElement.remove();
        // targetElement.remove(); 
    }
});