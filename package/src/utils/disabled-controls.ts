import { useEffect } from "react";
import type { createPageEvents } from "./frame-dom";

/**
 * Browsers never dispatch `click` on disabled form controls, and Safari also
 * swallows the other mouse events, so a document-level listener never hears
 * about them. While the toolbar is active, disabled controls are made
 * transparent to the pointer so the click lands on an ancestor, and hit
 * testing briefly restores them so the picked element is still the control.
 */
const STYLE_ID = "agentation-disabled-controls";
const HIT_TEST_ATTR = "data-agentation-hit-test";
const CSS =
  `:disabled{pointer-events:none !important}` +
  `[${HIT_TEST_ATTR}] :disabled{pointer-events:auto !important}`;

const installed = new Set<Document>();

/** Route pointer events past disabled controls in the given document. */
export function passThroughDisabledControls(doc: Document): void {
  if (installed.has(doc) || !doc.head) return;
  const style = doc.createElement("style");
  style.id = STYLE_ID;
  style.textContent = CSS;
  doc.head.appendChild(style);
  installed.add(doc);
}

/** Restore native pointer behaviour everywhere it was changed. */
export function restoreDisabledControls(): void {
  for (const doc of installed) {
    doc.getElementById(STYLE_ID)?.remove();
    doc.documentElement?.removeAttribute(HIT_TEST_ATTR);
  }
  installed.clear();
}

/** Run a hit test with disabled controls temporarily visible to the pointer. */
export function withDisabledControlsHittable<T>(hitTest: () => T): T {
  if (installed.size === 0) return hitTest();
  const roots: Element[] = [];
  for (const doc of installed) {
    const root = doc.documentElement;
    if (root) { root.setAttribute(HIT_TEST_ATTR, ""); roots.push(root); }
  }
  try {
    return hitTest();
  } finally {
    for (const root of roots) root.removeAttribute(HIT_TEST_ATTR);
  }
}

/**
 * Pass the pointer through disabled controls while active. Frames are covered
 * as the pointer enters them, which always happens before a click can land.
 */
export function useDisabledControlsPassThrough(
  active: boolean,
  pageEvents: ReturnType<typeof createPageEvents>,
): void {
  useEffect(() => {
    if (!active) return;
    passThroughDisabledControls(document);
    const install = (e: PointerEvent) => {
      const doc = (e.target as Node | null)?.ownerDocument;
      if (doc) passThroughDisabledControls(doc);
    };
    pageEvents.addEventListener("pointerover", install);
    return () => {
      pageEvents.removeEventListener("pointerover", install);
      restoreDisabledControls();
    };
  }, [active, pageEvents]);
}
