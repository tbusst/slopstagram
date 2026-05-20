// creates blank styling to hide page content during redirect
const style = document.createElement("style");
style.textContent = "body { visibility: hidden !important; }";
document.documentElement.appendChild(style);

let observer;


// redirects to messages page if not already on it
function checkPath() {
    console.log("slopstagram: checking path", window.location.pathname);
    if (!window.location.pathname.startsWith("/direct")) {
        document.documentElement.appendChild(style); // re-adds style in case of escape attempt!
        window.location.href = "https://www.instagram.com/direct/inbox/";
    } else {
        style.remove();
    }
}

function applyState(enabled) {
    document.body.style.border = enabled ? "5px solid red" : "";
}

observer = new MutationObserver(() => checkPath());
observer.observe(document.documentElement, { childList: true, subtree: true });

(async () => {
    // check on load
    checkPath();

    const { enabled } = await browser.storage.local.get("enabled");
    applyState(enabled ?? true);

    // updates local storage when toggle changes
    browser.storage.onChanged.addListener((changes) => {
        if (changes.enabled) applyState(changes.enabled.newValue);
    });
})();uuuuuuuuuuuuuuutr55