const toolbarDot = document.getElementById("toolbar-dot");
const toolbarValue = document.getElementById("toolbar-value");

// Check if the toolbar is active on the current tab by matching
// against the content script patterns from manifest.json
const CONTENT_SCRIPT_PATTERNS = [
  /^http:\/\/localhost(:\d+)?\//,
  /^http:\/\/127\.0\.0\.1(:\d+)?\//,
  /^https:\/\/localhost(:\d+)?\//,
];

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = tabs[0]?.url || "";
  const isActive = CONTENT_SCRIPT_PATTERNS.some((p) => p.test(url));

  if (isActive) {
    toolbarDot.className = "dot active";
    toolbarValue.textContent = "Active";
  } else {
    toolbarDot.className = "dot inactive";
    toolbarValue.textContent = "Inactive";
  }
});
