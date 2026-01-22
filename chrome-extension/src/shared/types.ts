// =============================================================================
// Shared Types for Chrome Extension
// =============================================================================

export type Annotation = {
  id: string;
  x: number;
  y: number;
  comment: string;
  element: string;
  elementPath: string;
  timestamp: number;
  selectedText?: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
  nearbyText?: string;
  cssClasses?: string;
  nearbyElements?: string;
  computedStyles?: string;
  fullPath?: string;
  accessibility?: string;
  isMultiSelect?: boolean;
  isFixed?: boolean;
};

export type OutputDetailLevel = "compact" | "standard" | "detailed" | "forensic";

export type Settings = {
  outputDetailLevel: OutputDetailLevel;
  autoClear: boolean;
  accentColor: string;
  darkMode: boolean | "system";
};

export type SiteState = {
  enabled: boolean;
  lastUsed: number;
};

// Message types for communication between components
export type MessageType =
  | { type: "GET_ANNOTATIONS"; url: string }
  | { type: "SAVE_ANNOTATIONS"; url: string; annotations: Annotation[] }
  | { type: "GET_SETTINGS" }
  | { type: "SAVE_SETTINGS"; settings: Settings }
  | { type: "GET_SITE_STATE"; hostname: string }
  | { type: "SET_SITE_STATE"; hostname: string; state: SiteState }
  | { type: "TOGGLE_TOOLBAR" }
  | { type: "UPDATE_BADGE"; count: number }
  | { type: "CLEAR_ALL_DATA" }
  | { type: "EXPORT_DATA" }
  | { type: "IMPORT_DATA"; data: ExportData };

export type MessageResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type ExportData = {
  version: string;
  exportedAt: number;
  settings: Settings;
  annotations: Record<string, Annotation[]>;
  siteStates: Record<string, SiteState>;
};

// Default settings
export const DEFAULT_SETTINGS: Settings = {
  outputDetailLevel: "standard",
  autoClear: false,
  accentColor: "#3c82f7",
  darkMode: "system",
};

// Available accent colors
export const ACCENT_COLORS = [
  "#3c82f7", // Blue (default)
  "#34c759", // Green
  "#ff9500", // Orange
  "#ff3b30", // Red
  "#af52de", // Purple
  "#ff2d55", // Pink
  "#5856d6", // Indigo
];
