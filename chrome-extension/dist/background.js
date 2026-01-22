import { i as importData, e as exportAllData, c as clearAllData, a as setSiteState, g as getSiteState, b as saveSettings, d as loadSettings, s as saveAnnotations, l as loadAnnotations } from './chunks/storage-BlbiK-hs.js';

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    handleMessage(message, sender).then(sendResponse);
    return true;
  }
);
async function handleMessage(message, sender) {
  try {
    switch (message.type) {
      case "GET_ANNOTATIONS": {
        const annotations = await loadAnnotations(message.url);
        return { success: true, data: annotations };
      }
      case "SAVE_ANNOTATIONS": {
        await saveAnnotations(message.url, message.annotations);
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
function updateBadge(count, tabId) {
  const text = count > 0 ? String(count) : "";
  const color = count > 0 ? "#3c82f7" : "#888888";
  chrome.action.setBadgeText({ text, tabId });
  chrome.action.setBadgeBackgroundColor({ color, tabId });
}
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-toolbar") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      try {
        await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_TOOLBAR" });
      } catch (e) {
        console.log("Content script not ready, attempting to inject...");
      }
    }
  }
});
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url) {
      const annotations = await loadAnnotations(tab.url);
      updateBadge(annotations.length, activeInfo.tabId);
    }
  } catch (e) {
  }
});
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    try {
      const annotations = await loadAnnotations(tab.url);
      updateBadge(annotations.length, tabId);
    } catch (e) {
    }
  }
});
console.log("Agentation background service worker initialized");
