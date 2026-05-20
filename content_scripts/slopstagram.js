function applyState(enabled) {
  document.body.style.border = enabled ? "5px solid red" : "";
}

(async () => {
  const { enabled } = await browser.storage.local.get("enabled");
  applyState(enabled ?? true);

  browser.storage.onChanged.addListener((changes) => {
    if (changes.enabled) applyState(changes.enabled.newValue);
  });
})();