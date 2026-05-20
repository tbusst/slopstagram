// creates blank styling to hide page content during redirect
const style = document.createElement("style");
style.textContent = "body { visibility: hidden !important; }";

let observer;
let contentHideEnabled;
let pageRedirectEnabled;
let isRedirecting = false;

// redirects to messages page if not already on it
function checkPath() {
  if (isRedirecting) return; // debounce
  if (!window.location.pathname.startsWith("/direct")) {
    isRedirecting = true;
    document.documentElement.appendChild(style); // re-adds style in case of escape attempt!
    window.location.href = "https://www.instagram.com/direct/inbox/";
  } else {
    style.remove();
  }
}

// hides content
function applyState(enabled) {
  document.body.style.border = enabled ? "5px solid red" : "";
}

observer = new MutationObserver(() => {
  if (pageRedirectEnabled) checkPath();
});
observer.observe(document.documentElement, { childList: true, subtree: true });

(async () => {
    ({ contentHideEnabled, pageRedirectEnabled } = await browser.storage.local.get([
        "contentHideEnabled", 
        "pageRedirectEnabled"
    ]));

    if (pageRedirectEnabled) { 
        document.documentElement.appendChild(style); 
        checkPath(); 
    }

    applyState(contentHideEnabled ?? true);

    // updates local storage when toggle changes
    browser.storage.onChanged.addListener((changes) => {
        if (changes.contentHideEnabled) applyState(changes.contentHideEnabled.newValue);
        if (changes.pageRedirectEnabled) pageRedirectEnabled = changes.pageRedirectEnabled.newValue;
    });
})();