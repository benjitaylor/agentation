import { closestCrossingShadow } from "./element-identification";
import { frameDocument, frameGeometry, isShadowRoot, viewportRect } from "./frame-dom";
import { withDisabledControlsHittable } from "./disabled-controls";

const TOOLBAR = "agentation-toolbar, [data-agentation-root], [data-feedback-toolbar], [data-annotation-popup], [data-annotation-marker]";
const CONTAINERS = new Set([
  "DIV", "SPAN", "SECTION", "ARTICLE", "MAIN", "ASIDE", "HEADER", "FOOTER", "NAV",
]);

/** Ordinary picking crosses open shadow roots, but keeps the topmost element. */
export function deepElementFromPoint(x: number, y: number): HTMLElement | null {
  return withDisabledControlsHittable(() => deepElementFromPointNow(x, y));
}

function deepElementFromPointNow(x: number, y: number): HTMLElement | null {
  let element = document.elementFromPoint(x, y);
  const visited = new Set<Element>();
  while (element && !visited.has(element)) {
    visited.add(element);
    const frame = frameDocument(element);
    let deeper: Element | null | undefined;
    if (frame) {
      const box = frameGeometry(element as HTMLIFrameElement);
      x = (x - box.x) / box.sx; y = (y - box.y) / box.sy;
      deeper = frame.elementFromPoint?.(x, y);
    } else deeper = element.shadowRoot?.elementFromPoint?.(x, y);
    if (!deeper || deeper === element) break;
    element = deeper;
  }
  return element as HTMLElement | null;
}

function isVisible(element: Element): boolean {
  if (typeof element.checkVisibility === "function") {
    return element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
  }
  // Older engines need the same opacity check across shadow boundaries.
  const style = getComputedStyle(element);
  if (style.visibility === "hidden" || style.visibility === "collapse") return false;
  let current: Element | null = element;
  while (current) {
    const currentStyle = getComputedStyle(current);
    if (currentStyle.opacity === "0" || currentStyle.display === "none" ||
        currentStyle.contentVisibility === "hidden") return false;
    const root = current.getRootNode();
    current = current.parentElement || (isShadowRoot(root) ? root.host : null);
  }
  return true;
}

function elementsAtPoint(x: number, y: number): Element[] {
  return withDisabledControlsHittable(() => elementsAtPointNow(x, y));
}

function elementsAtPointNow(x: number, y: number): Element[] {
  const candidates: Element[] = [];
  const seen = new Set<Element>();
  const visit = (elements: Element[], localX: number, localY: number) => {
    for (const element of elements) {
      if (seen.has(element)) continue;
      seen.add(element);
      if (element.shadowRoot) {
        const root = element.shadowRoot;
        const inner = root.elementsFromPoint?.(localX, localY) ?? [];
        visit(inner.length ? inner : [root.elementFromPoint?.(localX, localY)].filter(Boolean) as Element[], localX, localY);
      }
      const frame = frameDocument(element);
      if (frame) {
        const box = frameGeometry(element as HTMLIFrameElement);
        const childX = (localX - box.x) / box.sx, childY = (localY - box.y) / box.sy;
        visit(frame.elementsFromPoint?.(childX, childY) ?? [frame.elementFromPoint?.(childX, childY)].filter(Boolean) as Element[], childX, childY);
      }
      if (element !== element.ownerDocument.body && element !== element.ownerDocument.documentElement &&
          !closestCrossingShadow(element, TOOLBAR) && isVisible(element)) {
        candidates.push(element);
      }
    }
  };
  visit(document.elementsFromPoint?.(x, y) ?? [document.elementFromPoint(x, y)].filter(Boolean) as Element[], x, y);

  return candidates;
}

/** Recover saved targets through both page overlays and our own feedback markers. */
export function annotationElementFromPoint(
  x: number, y: number, box: { width: number; height: number },
): HTMLElement | null {
  if (box.width <= 0 || box.height <= 0) return null;
  let best: Element | null = null;
  let score = Infinity;
  for (const element of elementsAtPoint(x, y)) {
    const rect = viewportRect(element);
    const widthRatio = rect.width / box.width;
    const heightRatio = rect.height / box.height;
    if (widthRatio < 0.5 || widthRatio > 2 || heightRatio < 0.5 || heightRatio > 2) continue;
    const difference = Math.abs(Math.log(widthRatio)) + Math.abs(Math.log(heightRatio));
    if (difference < score) { best = element; score = difference; }
  }
  return best as HTMLElement | null;
}

/** Deep selection follows #119: prefer direct content, then the smallest visual target. */
export function pierceElementFromPoint(x: number, y: number): HTMLElement | null {
  const top = deepElementFromPoint(x, y);
  if (!top || closestCrossingShadow(top, TOOLBAR)) return null;
  const candidates = elementsAtPoint(x, y);

  for (const element of candidates) {
    if ((!CONTAINERS.has(element.tagName) && !element.shadowRoot) ||
        Array.from(element.childNodes).some(node =>
          node.nodeType === Node.TEXT_NODE && node.textContent?.trim())) {
      return element as HTMLElement;
    }
  }

  let smallest: Element | null = null;
  let smallestArea = Infinity;
  for (const element of candidates) {
    const rect = viewportRect(element);
    const area = rect.width * rect.height;
    if (area > 0 && area < smallestArea) {
      smallest = element;
      smallestArea = area;
    }
  }
  return smallest as HTMLElement | null;
}
