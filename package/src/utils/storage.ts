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

/**
 * Load all annotations from localStorage across all pages.
 * Returns a map of pathname -> annotations.
 */
export function loadAllAnnotations<T = Annotation>(): Map<string, T[]> {
  const result = new Map<string, T[]>();
  if (typeof window === "undefined") return result;

  try {
    const cutoff = Date.now() - DEFAULT_RETENTION_DAYS * 24 * 60 * 60 * 1000;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        const pathname = key.slice(STORAGE_PREFIX.length);
        const stored = localStorage.getItem(key);
        if (stored) {
          const data = JSON.parse(stored);
          const filtered = data.filter(
            (a: { timestamp?: number }) => !a.timestamp || a.timestamp > cutoff
          );
          if (filtered.length > 0) {
            result.set(pathname, filtered);
          }
        }
      }
    }
  } catch {
    // ignore errors
  }

  return result;
}

// =============================================================================
// Sync Marker Utilities
// =============================================================================
//
// These helpers manage the `_syncedTo` field on annotations, which tracks
// whether an annotation has been synced to a particular session/destination.
// The underscore prefix indicates this is an internal field.
//

type AnnotationWithSyncMarker = Annotation & { _syncedTo?: string };

/**
 * Save annotations with a sync marker indicating they've been synced to a session.
 * Adds `_syncedTo: sessionId` to each annotation before saving.
 */
export function saveAnnotationsWithSyncMarker(
  pathname: string,
  annotations: Annotation[],
  sessionId: string
): void {
  const marked = annotations.map((annotation) => ({
    ...annotation,
    _syncedTo: sessionId,
  }));
  saveAnnotations(pathname, marked);
}

/**
 * Get annotations that haven't been synced to the given session.
 * Returns annotations without a `_syncedTo` marker, or with a different session ID.
 * If no sessionId provided, returns annotations without any sync marker.
 */
export function getUnsyncedAnnotations(
  pathname: string,
  sessionId?: string
): Annotation[] {
  const annotations = loadAnnotations<AnnotationWithSyncMarker>(pathname);
  return annotations.filter((annotation) => {
    if (!annotation._syncedTo) return true;
    if (sessionId && annotation._syncedTo !== sessionId) return true;
    return false;
  });
}

/**
 * Remove `_syncedTo` markers from all annotations for a pathname.
 * Useful when resetting sync state or changing sync destination.
 */
export function clearSyncMarkers(pathname: string): void {
  const annotations = loadAnnotations<AnnotationWithSyncMarker>(pathname);
  const cleaned = annotations.map((annotation) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _syncedTo, ...rest } = annotation;
    return rest as Annotation;
  });
  saveAnnotations(pathname, cleaned);
}

// =============================================================================
// Layout Mode Storage
// =============================================================================

const DESIGN_PREFIX = "agentation-design-";

export function loadDesignPlacements<T = unknown>(pathname: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(`${DESIGN_PREFIX}${pathname}`);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveDesignPlacements<T = unknown>(pathname: string, placements: T[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${DESIGN_PREFIX}${pathname}`, JSON.stringify(placements));
  } catch {
    // localStorage might be full or disabled
  }
}

export function clearDesignPlacements(pathname: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${DESIGN_PREFIX}${pathname}`);
  } catch {
    // ignore
  }
}

// =============================================================================
// Rearrange Mode Storage
// =============================================================================

const REARRANGE_PREFIX = "agentation-rearrange-";

export function loadRearrangeState<T = unknown>(pathname: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(`${REARRANGE_PREFIX}${pathname}`);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveRearrangeState<T = unknown>(pathname: string, state: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${REARRANGE_PREFIX}${pathname}`, JSON.stringify(state));
  } catch {
    // localStorage might be full or disabled
  }
}

export function clearRearrangeState(pathname: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${REARRANGE_PREFIX}${pathname}`);
  } catch {
    // ignore
  }
}

// =============================================================================
// Wireframe Storage (persists wireframe state across page refresh)
// =============================================================================

const WIREFRAME_PREFIX = "agentation-wireframe-";

export function loadWireframeState<T = unknown>(pathname: string): { rearrange: T | null; placements: unknown[]; purpose: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(`${WIREFRAME_PREFIX}${pathname}`);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function saveWireframeState(pathname: string, state: { rearrange: unknown; placements: unknown[]; purpose: string }): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${WIREFRAME_PREFIX}${pathname}`, JSON.stringify(state));
  } catch {
    // localStorage might be full or disabled
  }
}

export function clearWireframeState(pathname: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(`${WIREFRAME_PREFIX}${pathname}`);
  } catch {
    // ignore
  }
}

// =============================================================================
// Session Storage
// =============================================================================

const SESSION_PREFIX = "agentation-session-";

export function getSessionStorageKey(pathname: string): string {
  return `${SESSION_PREFIX}${pathname}`;
}

export function loadSessionId(pathname: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(getSessionStorageKey(pathname));
  } catch {
    return null;
  }
}

export function saveSessionId(pathname: string, sessionId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getSessionStorageKey(pathname), sessionId);
  } catch {
    // localStorage might be full or disabled
  }
}

export function clearSessionId(pathname: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(getSessionStorageKey(pathname));
  } catch {
    // ignore
  }
}

// =============================================================================
// Toolbar Visibility (per-tab session)
// =============================================================================

const TOOLBAR_HIDDEN_SESSION_KEY = `${SESSION_PREFIX}toolbar-hidden`;

export function loadToolbarHidden(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(TOOLBAR_HIDDEN_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveToolbarHidden(hidden: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (hidden) {
      sessionStorage.setItem(TOOLBAR_HIDDEN_SESSION_KEY, "1");
    } else {
      sessionStorage.removeItem(TOOLBAR_HIDDEN_SESSION_KEY);
    }
  } catch {
    // ignore
  }
}
