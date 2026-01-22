// =============================================================================
// Background Service Worker
// =============================================================================

import { loadAnnotations, saveAnnotations, loadSettings, saveSettings, getSiteState, setSiteState, exportAllData, importData, clearAllData } from "../shared/storage";
import type { MessageType, MessageResponse, ExportData } from "../shared/types";

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener(
  (message: MessageType, sender, sendResponse: (response: MessageResponse) => void) => {
    handleMessage(message, sender).then(sendResponse);
    return true; // Keep channel open for async response
  }
);

async function handleMessage(
  message: MessageType,
  sender: chrome.runtime.MessageSender
): Promise<MessageResponse> {
  try {
    switch (message.type) {
      case "GET_ANNOTATIONS": {
        const annotations = await loadAnnotations(message.url);
        return { success: true, data: annotations };
      }

      case "SAVE_ANNOTATIONS": {
        await saveAnnotations(message.url, message.annotations);
        // Update badge for the sender tab
        if (sender.tab?.id) {
          updateBadge(message.annotations.length, sender.tab.id);
        }
        return { success: true };
      }

      case "GET_SETTINGS": {
        const settings = await loadSettings();
        return { success: true, data: settings };
      }

      case "SAVE_SETTINGS": {
        await saveSettings(message.settings);
        return { success: true };
      }

      case "GET_SITE_STATE": {
        const state = await getSiteState(message.hostname);
        return { success: true, data: state };
      }

      case "SET_SITE_STATE": {
        await setSiteState(message.hostname, message.state);
        return { success: true };
      }

      case "TOGGLE_TOOLBAR": {
        // Get active tab and send toggle message
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
          await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_TOOLBAR" });
        }
        return { success: true };
      }

      case "UPDATE_BADGE": {
        if (sender.tab?.id) {
          updateBadge(message.count, sender.tab.id);
        }
        return { success: true };
      }

      case "CLEAR_ALL_DATA": {
        await clearAllData();
        // Clear badge on all tabs
        const tabs = await chrome.tabs.query({});
        for (const tab of tabs) {
          if (tab.id) {
            updateBadge(0, tab.id);
          }
        }
        return { success: true };
      }

      case "EXPORT_DATA": {
        const data = await exportAllData();
        return { success: true, data };
      }

      case "IMPORT_DATA": {
        await importData(message.data);
        return { success: true };
      }

      default:
        return { success: false, error: "Unknown message type" };
    }
  } catch (error) {
    console.error("Error handling message:", error);
    return { success: false, error: String(error) };
  }
}

// Update badge with annotation count
function updateBadge(count: number, tabId: number): void {
  const text = count > 0 ? String(count) : "";
  const color = count > 0 ? "#3c82f7" : "#888888";

  chrome.action.setBadgeText({ text, tabId });
  chrome.action.setBadgeBackgroundColor({ color, tabId });
}

// Handle keyboard shortcut
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-toolbar") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      try {
        await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_TOOLBAR" });
      } catch (e) {
        // Content script might not be loaded, inject it
        console.log("Content script not ready, attempting to inject...");
      }
    }
  }
});

// Initialize badge when tab is activated
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url) {
      const annotations = await loadAnnotations(tab.url);
      updateBadge(annotations.length, activeInfo.tabId);
    }
  } catch (e) {
    // Tab might have been closed
  }
});

// Update badge when tab URL changes
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    try {
      const annotations = await loadAnnotations(tab.url);
      updateBadge(annotations.length, tabId);
    } catch (e) {
      // Ignore errors
    }
  }
});

console.log("Agentation background service worker initialized");
