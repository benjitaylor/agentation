// =============================================================================
// Storage Utilities
// =============================================================================
//
// TODO: Abstract this to accept a StorageAdapter interface for custom storage
// (IndexedDB, API backend, etc.)
//

import type { Annotation } from "../types";

const STORAGE_PREFIX = "feedback-annotations-";
const DEFAULT_RETENTION_DAYS = 7;

export function getStorageKey(pathname: string): string {
  return `${STORAGE_PREFIX}${pathname}`;
}

export function loadAnnotations<T = Annotation>(pathname: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(getStorageKey(pathname));
    if (!stored) return [];
    const data = JSON.parse(stored);
    const cutoff = Date.now() - DEFAULT_RETENTION_DAYS * 24 * 60 * 60 * 1000;
    return data.filter((a: { timestamp?: number }) => !a.timestamp || a.timestamp > cutoff);
  } catch {
    return [];
  }
}

export function saveAnnotations<T = Annotation>(pathname: string, annotations: T[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getStorageKey(pathname), JSON.stringify(annotations));
  } catch {
    // localStorage might be full or disabled
  }
}

export function clearAnnotations(pathname: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(getStorageKey(pathname));
  } catch {
    // ignore
  }
}
