const toggleContent = document.querySelector("#toggle-content");
const toggleRedirect = document.querySelector("#toggle-redirect");
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
    const { contentHideEnabled, pageRedirectEnabled } = await browser.storage.local.get(["contentHideEnabled", "pageRedirectEnabled"]);
    toggleContent.checked = contentHideEnabled ?? true;
    toggleRedirect.checked = pageRedirectEnabled ?? true;
})();

// updates local storage when toggles change
toggleContent.addEventListener("change", () => {
    browser.storage.local.set({ contentHideEnabled: toggleContent.checked });
});

toggleRedirect.addEventListener("change", () => {
    browser.storage.local.set({ pageRedirectEnabled: toggleRedirect.checked });
});