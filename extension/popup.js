const toolbarDot = document.getElementById("toolbar-dot");
const toolbarValue = document.getElementById("toolbar-value");
const mcpStatus = document.getElementById("mcp-status");
const mcpDot = document.getElementById("mcp-dot");
const mcpValue = document.getElementById("mcp-value");

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
    checkMcpHealth();
  } else {
    toolbarDot.className = "dot inactive";
    toolbarValue.textContent = "Inactive";
    mcpStatus.style.display = "none";
  }
});

function checkMcpHealth() {
  fetch("http://localhost:4747/health")
    .then((res) => {
      if (res.ok) {
        mcpDot.className = "dot active";
        mcpValue.textContent = "Connected";
      } else {
        mcpDot.className = "dot inactive";
        mcpValue.textContent = "Not responding";
      }
    })
    .catch(() => {
      mcpDot.className = "dot inactive";
      mcpValue.textContent = "Not running";
    });
}
