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
    // remove sidebar
    const threadList = document.querySelector('[aria-label="Thread list"]');
    const sidebar = threadList.parentElement.parentElement.parentElement;
    sidebar.style.paddingLeft = enabled ? "0" : "";

    // move conversations over
    const messagesLink = document.querySelector('a[href="/direct/inbox/"]');
    const conversations = messagesLink.closest('div[style*="width: 72px"]');
    conversations.style.display = enabled ? "none" : "";
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