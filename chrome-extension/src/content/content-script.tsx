import React from "react";
import { createRoot } from "react-dom/client";
import { PageFeedbackToolbar } from "./App";

// Create a container for our React app in the page
function createContainer(): HTMLElement {
  const containerId = "agentation-extension-root";
  
  // Check if container already exists
  let container = document.getElementById(containerId);
  if (container) {
    return container;
  }
  
  // Create new container
  container = document.createElement("div");
  container.id = containerId;
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    z-index: 2147483647;
    pointer-events: none;
  `;
  
  document.body.appendChild(container);
  return container;
}

// Initialize the extension
function init() {
  // Don't run on extension pages or if already initialized
  if (
    window.location.protocol === "chrome-extension:" ||
    document.getElementById("agentation-extension-root")
  ) {
    return;
  }

  const container = createContainer();
  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <PageFeedbackToolbar />
    </React.StrictMode>
  );
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Listen for messages from background/popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "TOGGLE_TOOLBAR") {
    // Dispatch custom event to toggle toolbar
    window.dispatchEvent(new CustomEvent("agentation-toggle"));
    sendResponse({ success: true });
  }
  return true;
});
