const endpointInput = document.getElementById("endpoint");
const mcpDot = document.getElementById("mcp-dot");
const mcpValue = document.getElementById("mcp-value");

// Load saved endpoint
chrome.storage.local.get(["mcpEndpoint"], (result) => {
  if (result.mcpEndpoint) {
    endpointInput.value = result.mcpEndpoint;
  }
  checkMcpHealth(endpointInput.value);
});

// Save endpoint on change
endpointInput.addEventListener("change", () => {
  const endpoint = endpointInput.value.trim();
  chrome.storage.local.set({ mcpEndpoint: endpoint });
  checkMcpHealth(endpoint);
});

async function checkMcpHealth(endpoint) {
  try {
    const res = await fetch(`${endpoint}/health`);
    if (res.ok) {
      mcpDot.className = "dot active";
      mcpValue.textContent = "Connected";
    } else {
      mcpDot.className = "dot inactive";
      mcpValue.textContent = "Not responding";
    }
  } catch {
    mcpDot.className = "dot inactive";
    mcpValue.textContent = "Not running";
  }
}
