const toggle = document.querySelector("#toggle");
const popupContent = document.querySelector("#popup-content");
const errorContent = document.querySelector("#error-content");

(async () => {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    const url = new URL(tab.url);

    // shows error text if not on instagram
    if (!url?.hostname.includes("instagram.com")) {
        popupContent.classList.add("hidden");
        errorContent.classList.remove("hidden");
        return;
    }

    // sets toggle state from local storage
    const { enabled } = await browser.storage.local.get("enabled");
    toggle.checked = enabled ?? true;
})();

// updates local storage when toggle changes
toggle.addEventListener("change", () => {
    browser.storage.local.set({ enabled: toggle.checked });
});