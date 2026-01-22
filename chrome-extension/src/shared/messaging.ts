// =============================================================================
// Message Passing Utilities
// =============================================================================

import type { MessageType, MessageResponse } from "./types";

// Send message to background script
export async function sendMessage<T = unknown>(message: MessageType): Promise<MessageResponse<T>> {
  try {
    const response = await chrome.runtime.sendMessage(message);
    return response as MessageResponse<T>;
  } catch (e) {
    console.error("Error sending message:", e);
    return { success: false, error: String(e) };
  }
}

// Send message to content script in specific tab
export async function sendToTab<T = unknown>(tabId: number, message: MessageType): Promise<MessageResponse<T>> {
  try {
    const response = await chrome.tabs.sendMessage(tabId, message);
    return response as MessageResponse<T>;
  } catch (e) {
    console.error("Error sending to tab:", e);
    return { success: false, error: String(e) };
  }
}

// Update extension badge
export async function updateBadge(count: number, tabId?: number): Promise<void> {
  try {
    const text = count > 0 ? String(count) : "";
    const color = count > 0 ? "#3c82f7" : "#888888";

    if (tabId) {
      await chrome.action.setBadgeText({ text, tabId });
      await chrome.action.setBadgeBackgroundColor({ color, tabId });
    } else {
      await chrome.action.setBadgeText({ text });
      await chrome.action.setBadgeBackgroundColor({ color });
    }
  } catch (e) {
    console.error("Error updating badge:", e);
  }
}

// Get current tab
export async function getCurrentTab(): Promise<chrome.tabs.Tab | undefined> {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  } catch {
    return undefined;
  }
}
