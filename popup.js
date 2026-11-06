const storageKey = "storage"

const addKeyWord = async (inputWord) => {
    if(!inputWord.trim()){
        return;
    }
    let currList = await getKeyWords();
    currList.push(inputWord);
    await chrome.storage.local.set({ [storageKey]: currList });
};

const removeKeyWord = async (inputWord) => {
    let currList = await getKeyWords();
    const newList = currList.filter((word) => word !== inputWord);
    await chrome.storage.local.set({ [storageKey]: newList });
};

async function getKeyWords() {
    let result  = await chrome.storage.local.get([storageKey]); // Returns object with key-value pair.
    return result[storageKey] || []; // Specifies access to content of object with key.
}

async function renderKeywords(){
    const box = document.getElementById("keywordList"); // get effected element
    box.innerHTML = ""; // clean wipe of elements

    let list = await getKeyWords();
    list.forEach((keyword) => {
        // Create div for each keyword
        const keywordBox = document.createElement("div");
        keywordBox.textContent = keyword;
        keywordBox.className = "px-2";

        // Remove button, styling, appended to container.
        const removeButton = document.createElement("button");
        removeButton.textContent = "x";
        removeButton.className = "px-2 text-red-400 hover:text-red-300 text-sm ml-2";
        keywordBox.appendChild(removeButton);

        removeButton.addEventListener("click", async () => {
            await removeKeyWord(keyword);
            renderKeywords(); // redraw the list
        });

        // add created div to main keyword container
        box.appendChild(keywordBox);
    });
}

async function addKeyWordButton(){
    const input = document.getElementById("addField");
    const button = document.getElementById("addButton");
    
    button.addEventListener("click", async () => {
        await addKeyWord(input.value.toLowerCase()); // Calls addKeyWord to input value in field.
        input.value = "";
        renderKeywords();
    });
}

document.getElementById("removeHistoryButton").addEventListener("click", async () => {
    const button = document.getElementById("removeHistoryButton");
    const response = await chrome.runtime.sendMessage({ action: "cleanNow" });

    const flashColour = response.count > 0 ? "bg-green-600" : "bg-gray-500";
    button.classList.replace("bg-red-600", flashColour);

    setTimeout(() => button.classList.replace(flashColour, "bg-red-600"), 600);
});

addKeyWordButton();
renderKeywords();