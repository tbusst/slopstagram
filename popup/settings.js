const toggle = document.querySelector("#toggle");

(async () => {
    const { enabled } = await browser.storage.local.get("enabled");
    toggle.checked = enabled ?? true;
})();

toggle.addEventListener("change", () => {
    browser.storage.local.set({ enabled: toggle.checked });
});