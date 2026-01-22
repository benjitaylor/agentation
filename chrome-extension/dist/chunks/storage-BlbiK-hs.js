const DEFAULT_SETTINGS = {
  outputDetailLevel: "standard",
  autoClear: false,
  accentColor: "#3c82f7",
  darkMode: "system"
};
const ACCENT_COLORS = [
  "#3c82f7",
  // Blue (default)
  "#34c759",
  // Green
  "#ff9500",
  // Orange
  "#ff3b30",
  // Red
  "#af52de",
  // Purple
  "#ff2d55",
  // Pink
  "#5856d6"
  // Indigo
];

const STORAGE_PREFIX = "agentation";
const ANNOTATIONS_PREFIX = `${STORAGE_PREFIX}:annotations:`;
const SITE_STATE_PREFIX = `${STORAGE_PREFIX}:site:`;
const SETTINGS_KEY = `${STORAGE_PREFIX}:settings`;
const RETENTION_DAYS = 7;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1e3;
function getAnnotationKey(url) {
  try {
    const { hostname, pathname } = new URL(url);
    return `${ANNOTATIONS_PREFIX}${hostname}${pathname}`;
  } catch {
    return `${ANNOTATIONS_PREFIX}${url}`;
  }
}
async function loadAnnotations(url) {
  const key = getAnnotationKey(url);
  try {
    const result = await chrome.storage.local.get(key);
    const annotations = result[key];
    if (!annotations) return [];
    const cutoff = Date.now() - RETENTION_MS;
    return annotations.filter((a) => a.timestamp > cutoff);
  } catch (e) {
    console.error("Error loading annotations:", e);
    return [];
  }
}
async function saveAnnotations(url, annotations) {
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
async function getAllAnnotations() {
  try {
    const result = await chrome.storage.local.get(null);
    const annotations = {};
    for (const [key, value] of Object.entries(result)) {
      if (key.startsWith(ANNOTATIONS_PREFIX)) {
        const url = key.slice(ANNOTATIONS_PREFIX.length);
        annotations[url] = value;
      }
    }
    return annotations;
  } catch (e) {
    console.error("Error getting all annotations:", e);
    return {};
  }
}
async function loadSettings() {
  try {
    const result = await chrome.storage.sync.get(SETTINGS_KEY);
    return { ...DEFAULT_SETTINGS, ...result[SETTINGS_KEY] };
  } catch (e) {
    console.error("Error loading settings:", e);
    return DEFAULT_SETTINGS;
  }
}
async function saveSettings(settings) {
  try {
    await chrome.storage.sync.set({ [SETTINGS_KEY]: settings });
  } catch (e) {
    console.error("Error saving settings:", e);
  }
}
async function getSiteState(hostname) {
  const key = `${SITE_STATE_PREFIX}${hostname}`;
  try {
    const result = await chrome.storage.local.get(key);
    return result[key] || { enabled: true, lastUsed: Date.now() };
  } catch (e) {
    console.error("Error getting site state:", e);
    return { enabled: true, lastUsed: Date.now() };
  }
}
async function setSiteState(hostname, state) {
  const key = `${SITE_STATE_PREFIX}${hostname}`;
  try {
    await chrome.storage.local.set({ [key]: state });
  } catch (e) {
    console.error("Error setting site state:", e);
  }
}
async function getAllSiteStates() {
  try {
    const result = await chrome.storage.local.get(null);
    const states = {};
    for (const [key, value] of Object.entries(result)) {
      if (key.startsWith(SITE_STATE_PREFIX)) {
        const hostname = key.slice(SITE_STATE_PREFIX.length);
        states[hostname] = value;
      }
    }
    return states;
  } catch (e) {
    console.error("Error getting all site states:", e);
    return {};
  }
}
async function exportAllData() {
  const [settings, annotations, siteStates] = await Promise.all([
    loadSettings(),
    getAllAnnotations(),
    getAllSiteStates()
  ]);
  return {
    version: "1.0.0",
    exportedAt: Date.now(),
    settings,
    annotations,
    siteStates
  };
}
async function importData(data) {
  await saveSettings(data.settings);
  for (const [url, annotations] of Object.entries(data.annotations)) {
    const key = `${ANNOTATIONS_PREFIX}${url}`;
    await chrome.storage.local.set({ [key]: annotations });
  }
  for (const [hostname, state] of Object.entries(data.siteStates)) {
    await setSiteState(hostname, state);
  }
}
async function clearAllData() {
  try {
    await chrome.storage.local.clear();
    await chrome.storage.sync.clear();
  } catch (e) {
    console.error("Error clearing all data:", e);
  }
}

export { ACCENT_COLORS as A, DEFAULT_SETTINGS as D, setSiteState as a, saveSettings as b, clearAllData as c, loadSettings as d, exportAllData as e, getAllAnnotations as f, getSiteState as g, importData as i, loadAnnotations as l, saveAnnotations as s };
