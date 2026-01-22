// =============================================================================
// Chrome Storage Utilities
// =============================================================================

import type { Annotation, Settings, SiteState, ExportData } from "./types";
import { DEFAULT_SETTINGS } from "./types";

const STORAGE_PREFIX = "agentation";
const ANNOTATIONS_PREFIX = `${STORAGE_PREFIX}:annotations:`;
const SITE_STATE_PREFIX = `${STORAGE_PREFIX}:site:`;
const SETTINGS_KEY = `${STORAGE_PREFIX}:settings`;

// 7 days retention
const RETENTION_DAYS = 7;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

// =============================================================================
// Annotations
// =============================================================================

function getAnnotationKey(url: string): string {
  try {
    const { hostname, pathname } = new URL(url);
    return `${ANNOTATIONS_PREFIX}${hostname}${pathname}`;
  } catch {
    return `${ANNOTATIONS_PREFIX}${url}`;
  }
}

export async function loadAnnotations(url: string): Promise<Annotation[]> {
  const key = getAnnotationKey(url);
  try {
    const result = await chrome.storage.local.get(key);
    const annotations = result[key] as Annotation[] | undefined;
    if (!annotations) return [];
    
    // Filter by retention
    const cutoff = Date.now() - RETENTION_MS;
    return annotations.filter((a) => a.timestamp > cutoff);
  } catch (e) {
    console.error("Error loading annotations:", e);
    return [];
  }
}

export async function saveAnnotations(url: string, annotations: Annotation[]): Promise<void> {
  const key = getAnnotationKey(url);
  try {
    if (annotations.length === 0) {
      await chrome.storage.local.remove(key);
    } else {
      await chrome.storage.local.set({ [key]: annotations });
    }
  } catch (e) {
    console.error("Error saving annotations:", e);
  }
}

export async function getAllAnnotations(): Promise<Record<string, Annotation[]>> {
  try {
    const result = await chrome.storage.local.get(null);
    const annotations: Record<string, Annotation[]> = {};
    
    for (const [key, value] of Object.entries(result)) {
      if (key.startsWith(ANNOTATIONS_PREFIX)) {
        const url = key.slice(ANNOTATIONS_PREFIX.length);
        annotations[url] = value as Annotation[];
      }
    }
    
    return annotations;
  } catch (e) {
    console.error("Error getting all annotations:", e);
    return {};
  }
}

// =============================================================================
// Settings
// =============================================================================

export async function loadSettings(): Promise<Settings> {
  try {
    const result = await chrome.storage.sync.get(SETTINGS_KEY);
    return { ...DEFAULT_SETTINGS, ...result[SETTINGS_KEY] };
  } catch (e) {
    console.error("Error loading settings:", e);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    await chrome.storage.sync.set({ [SETTINGS_KEY]: settings });
  } catch (e) {
    console.error("Error saving settings:", e);
  }
}

// =============================================================================
// Site State (enabled/disabled per site)
// =============================================================================

export async function getSiteState(hostname: string): Promise<SiteState> {
  const key = `${SITE_STATE_PREFIX}${hostname}`;
  try {
    const result = await chrome.storage.local.get(key);
    return result[key] || { enabled: true, lastUsed: Date.now() };
  } catch (e) {
    console.error("Error getting site state:", e);
    return { enabled: true, lastUsed: Date.now() };
  }
}

export async function setSiteState(hostname: string, state: SiteState): Promise<void> {
  const key = `${SITE_STATE_PREFIX}${hostname}`;
  try {
    await chrome.storage.local.set({ [key]: state });
  } catch (e) {
    console.error("Error setting site state:", e);
  }
}

export async function getAllSiteStates(): Promise<Record<string, SiteState>> {
  try {
    const result = await chrome.storage.local.get(null);
    const states: Record<string, SiteState> = {};
    
    for (const [key, value] of Object.entries(result)) {
      if (key.startsWith(SITE_STATE_PREFIX)) {
        const hostname = key.slice(SITE_STATE_PREFIX.length);
        states[hostname] = value as SiteState;
      }
    }
    
    return states;
  } catch (e) {
    console.error("Error getting all site states:", e);
    return {};
  }
}

// =============================================================================
// Export/Import
// =============================================================================

export async function exportAllData(): Promise<ExportData> {
  const [settings, annotations, siteStates] = await Promise.all([
    loadSettings(),
    getAllAnnotations(),
    getAllSiteStates(),
  ]);

  return {
    version: "1.0.0",
    exportedAt: Date.now(),
    settings,
    annotations,
    siteStates,
  };
}

export async function importData(data: ExportData): Promise<void> {
  // Import settings
  await saveSettings(data.settings);

  // Import annotations
  for (const [url, annotations] of Object.entries(data.annotations)) {
    const key = `${ANNOTATIONS_PREFIX}${url}`;
    await chrome.storage.local.set({ [key]: annotations });
  }

  // Import site states
  for (const [hostname, state] of Object.entries(data.siteStates)) {
    await setSiteState(hostname, state);
  }
}

export async function clearAllData(): Promise<void> {
  try {
    await chrome.storage.local.clear();
    await chrome.storage.sync.clear();
  } catch (e) {
    console.error("Error clearing all data:", e);
  }
}
