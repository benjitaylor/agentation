// =============================================================================
// Spatial Context Utility for Layout Mode Output
// =============================================================================

import { labelSection, generateSelector } from "./section-detection";

type SectionRect = { x: number; y: number; width: number; height: number };

export type NearbyElement = {
  label: string;       // human-readable ("Navigation", "h1 'Layout mode test page'")
  selector: string;    // CSS selector
  gap: number;         // pixel gap between edges
};

export type BoundsOverflow = {
  viewport?: ("left" | "right" | "top" | "bottom")[];  // edges that extend past viewport
  container?: { label: string; edges: ("left" | "right" | "top" | "bottom")[] };  // edges outside nearest container
};

export type SpatialContext = {
  above: NearbyElement | null;
  below: NearbyElement | null;
  left: NearbyElement | null;
  right: NearbyElement | null;
  alignment: "left" | "center" | "right" | "full-width";
  containedIn: { label: string; selector: string } | null;
  outOfBounds: BoundsOverflow | null;
};

// Tags/elements to skip when collecting candidates
const SKIP_TAGS = new Set(["script", "style", "noscript", "link", "meta", "br", "hr"]);

/** A spatial candidate with pre-computed viewport-relative rect. */
type Candidate = { label: string; selector: string; top: number; bottom: number; left: number; right: number; area: number };

/**
 * Collect visible page elements (2 levels deep from main/body) as spatial candidates.
 */
function collectDOMCandidates(): Candidate[] {
  const main = document.querySelector("main") || document.body;
  const results: Candidate[] = [];

  const topLevel = Array.from(main.children) as HTMLElement[];
  const roots = main !== document.body && topLevel.length < 3
    ? Array.from(document.body.children) as HTMLElement[]
    : topLevel;

  for (const el of roots) {
    if (!(el instanceof HTMLElement)) continue;
    if (SKIP_TAGS.has(el.tagName.toLowerCase())) continue;
    if (el.hasAttribute("data-feedback-toolbar")) continue;

    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") continue;

    const rect = el.getBoundingClientRect();
    if (rect.height < 10 || rect.width < 10) continue;

    results.push({
      label: labelSection(el),
      selector: generateSelector(el),
      top: rect.top, bottom: rect.bottom,
      left: rect.left, right: rect.right,
      area: rect.width * rect.height,
    });

    // Second level: direct children
    for (const child of Array.from(el.children) as HTMLElement[]) {
      if (!(child instanceof HTMLElement)) continue;
      if (SKIP_TAGS.has(child.tagName.toLowerCase())) continue;
      if (child.hasAttribute("data-feedback-toolbar")) continue;

      const childStyle = window.getComputedStyle(child);
      if (childStyle.display === "none" || childStyle.visibility === "hidden") continue;

      const cr = child.getBoundingClientRect();
      if (cr.height < 10 || cr.width < 10) continue;

      results.push({
        label: labelSection(child),
        selector: generateSelector(child),
        top: cr.top, bottom: cr.bottom,
        left: cr.left, right: cr.right,
        area: cr.width * cr.height,
      });
    }
  }

  return results;
}

/**
 * Convert explicit rect candidates (from rearrange sections) to Candidate format.
 * Rects are page-absolute, so subtract scrollY to get viewport-relative.
 */
export type ExplicitCandidate = { label: string; selector: string; rect: SectionRect };

function explicitToCandidates(items: ExplicitCandidate[]): Candidate[] {
  const scrollY = window.scrollY;
  return items.map(({ label, selector, rect }) => {
    const top = rect.y - scrollY;
    return {
      label, selector,
      top,
      bottom: top + rect.height,
      left: rect.x,
      right: rect.x + rect.width,
      area: rect.width * rect.height,
    };
  });
}

/**
 * Convert a SectionRect (page-absolute) to viewport-relative edges.
 */
function toViewportEdges(r: SectionRect) {
  const scrollY = window.scrollY;
  const top = r.y - scrollY;
  const left = r.x;
  return {
    top,
    bottom: top + r.height,
    left,
    right: left + r.width,
    area: r.width * r.height,
  };
}

/**
 * Get spatial context for a given rect (page-absolute coordinates).
 *
 * By default, queries the live DOM for candidates (2 levels deep).
 * Pass `siblings` to use explicit candidates instead — useful for rearrange mode
 * where the moved sections themselves are the best spatial reference.
 */
export function getSpatialContext(
  targetRect: SectionRect,
  siblings?: ExplicitCandidate[],
): SpatialContext {
  const candidates = siblings ? explicitToCandidates(siblings) : collectDOMCandidates();
  const target = toViewportEdges(targetRect);

  let above: (NearbyElement & { _dist: number }) | null = null;
  let below: (NearbyElement & { _dist: number }) | null = null;
  let left: (NearbyElement & { _dist: number }) | null = null;
  let right: (NearbyElement & { _dist: number }) | null = null;
  let containedIn: { label: string; selector: string; _area: number } | null = null;

  for (const c of candidates) {
    // Skip if the candidate IS the target (rects match closely)
    if (
      Math.abs(c.left - target.left) < 2 &&
      Math.abs(c.top - target.top) < 2 &&
      Math.abs((c.right - c.left) - targetRect.width) < 2 &&
      Math.abs((c.bottom - c.top) - targetRect.height) < 2
    ) {
      continue;
    }

    // Check containment: candidate fully contains target
    if (
      c.left <= target.left + 2 &&
      c.right >= target.right - 2 &&
      c.top <= target.top + 2 &&
      c.bottom >= target.bottom - 2 &&
      c.area > target.area * 1.5
    ) {
      if (!containedIn || c.area < containedIn._area) {
        containedIn = { label: c.label, selector: c.selector, _area: c.area };
      }
    }

    // Horizontal overlap — elements share some x-range
    const hOverlap = target.right > c.left + 5 && target.left < c.right - 5;
    // Vertical overlap — elements share some y-range (same row)
    const vOverlap = target.bottom > c.top + 5 && target.top < c.bottom - 5;

    // Above: candidate bottom is at or above target top
    if (hOverlap && c.bottom <= target.top + 5) {
      const gap = Math.round(target.top - c.bottom);
      if (!above || gap < above._dist) {
        above = { label: c.label, selector: c.selector, gap: Math.max(0, gap), _dist: gap };
      }
    }

    // Below: candidate top is at or below target bottom
    if (hOverlap && c.top >= target.bottom - 5) {
      const gap = Math.round(c.top - target.bottom);
      if (!below || gap < below._dist) {
        below = { label: c.label, selector: c.selector, gap: Math.max(0, gap), _dist: gap };
      }
    }

    // Left: candidate is to the left, same row
    if (vOverlap && c.right <= target.left + 5) {
      const gap = Math.round(target.left - c.right);
      if (!left || gap < left._dist) {
        left = { label: c.label, selector: c.selector, gap: Math.max(0, gap), _dist: gap };
      }
    }

    // Right: candidate is to the right, same row
    if (vOverlap && c.left >= target.right - 5) {
      const gap = Math.round(c.left - target.right);
      if (!right || gap < right._dist) {
        right = { label: c.label, selector: c.selector, gap: Math.max(0, gap), _dist: gap };
      }
    }
  }

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const alignment = getAlignment(targetRect, viewportWidth);

  const clean = (n: (NearbyElement & { _dist: number }) | null): NearbyElement | null => {
    if (!n) return null;
    return { label: n.label, selector: n.selector, gap: n.gap };
  };

  // Bounds detection
  const outOfBounds = detectBoundsOverflow(
    target,
    targetRect,
    viewportWidth,
    viewportHeight,
    containedIn ? { label: containedIn.label, selector: containedIn.selector, _area: containedIn._area } : null,
    candidates,
  );

  return {
    above: clean(above),
    below: clean(below),
    left: clean(left),
    right: clean(right),
    alignment,
    containedIn: containedIn ? { label: containedIn.label, selector: containedIn.selector } : null,
    outOfBounds,
  };
}

/**
 * Detect if the target rect overflows viewport or its nearest container.
 */
function detectBoundsOverflow(
  targetEdges: { top: number; bottom: number; left: number; right: number },
  targetRect: SectionRect,
  viewportWidth: number,
  viewportHeight: number,
  container: { label: string; selector: string; _area: number } | null,
  candidates: Candidate[],
): BoundsOverflow | null {
  const result: BoundsOverflow = {};
  let hasOverflow = false;

  // Viewport overflow (using viewport-relative edges)
  const vpOverflow: ("left" | "right" | "top" | "bottom")[] = [];
  if (targetEdges.left < -2) vpOverflow.push("left");
  if (targetEdges.right > viewportWidth + 2) vpOverflow.push("right");
  if (targetEdges.top < -2) vpOverflow.push("top");
  if (targetEdges.bottom > viewportHeight + 2) vpOverflow.push("bottom");
  if (vpOverflow.length > 0) {
    result.viewport = vpOverflow;
    hasOverflow = true;
  }

  // Container overflow — check if target extends past its nearest container
  if (container) {
    const cont = candidates.find(c =>
      c.label === container.label &&
      c.selector === container.selector &&
      Math.abs(c.area - container._area) < 10,
    );
    if (cont) {
      const contOverflow: ("left" | "right" | "top" | "bottom")[] = [];
      if (targetEdges.left < cont.left - 2) contOverflow.push("left");
      if (targetEdges.right > cont.right + 2) contOverflow.push("right");
      if (targetEdges.top < cont.top - 2) contOverflow.push("top");
      if (targetEdges.bottom > cont.bottom + 2) contOverflow.push("bottom");
      if (contOverflow.length > 0) {
        result.container = { label: container.label, edges: contOverflow };
        hasOverflow = true;
      }
    }
  }

  return hasOverflow ? result : null;
}

function getAlignment(rect: SectionRect, viewportWidth: number): SpatialContext["alignment"] {
  const ratio = rect.width / viewportWidth;
  if (ratio > 0.85) return "full-width";

  const centerX = rect.x + rect.width / 2;
  const viewportCenter = viewportWidth / 2;
  const offset = centerX - viewportCenter;
  const tolerance = viewportWidth * 0.08;

  if (Math.abs(offset) < tolerance) return "center";
  if (offset < 0) return "left";
  return "right";
}

/**
 * Format alignment as human-readable text.
 */
function formatAlignment(alignment: SpatialContext["alignment"]): string {
  switch (alignment) {
    case "full-width": return "full-width";
    case "center": return "centered";
    case "left": return "left-aligned";
    case "right": return "right-aligned";
  }
}

/**
 * Format a SpatialContext into human-readable description lines.
 * Returns an array of strings, each a markdown line (without leading "  - ").
 */
export function formatSpatialLines(
  ctx: SpatialContext,
  options: { includeLeftRight?: boolean; includePixelRef?: boolean; pixelRef?: string } = {},
): string[] {
  const lines: string[] = [];

  if (ctx.above) {
    lines.push(`Below \`${ctx.above.label}\`${ctx.above.gap > 0 ? ` (${ctx.above.gap}px gap)` : ""}`);
  }
  if (ctx.below) {
    lines.push(`Above \`${ctx.below.label}\`${ctx.below.gap > 0 ? ` (${ctx.below.gap}px gap)` : ""}`);
  }
  if (options.includeLeftRight) {
    if (ctx.left) {
      lines.push(`Right of \`${ctx.left.label}\`${ctx.left.gap > 0 ? ` (${ctx.left.gap}px gap)` : ""}`);
    }
    if (ctx.right) {
      lines.push(`Left of \`${ctx.right.label}\`${ctx.right.gap > 0 ? ` (${ctx.right.gap}px gap)` : ""}`);
    }
  }

  // Alignment + container on one line
  const alignStr = formatAlignment(ctx.alignment);
  if (ctx.containedIn) {
    lines.push(`${alignStr.charAt(0).toUpperCase() + alignStr.slice(1)} in \`${ctx.containedIn.label}\``);
  } else {
    lines.push(`${alignStr.charAt(0).toUpperCase() + alignStr.slice(1)} in page`);
  }

  if (options.includePixelRef && options.pixelRef) {
    lines.push(`Pixel ref: \`${options.pixelRef}\``);
  }

  // Out-of-bounds warnings
  if (ctx.outOfBounds) {
    if (ctx.outOfBounds.viewport) {
      lines.push(`**Outside viewport** (${ctx.outOfBounds.viewport.join(", ")} edge${ctx.outOfBounds.viewport.length > 1 ? "s" : ""})`);
    }
    if (ctx.outOfBounds.container) {
      lines.push(`**Outside \`${ctx.outOfBounds.container.label}\`** (${ctx.outOfBounds.container.edges.join(", ")} edge${ctx.outOfBounds.container.edges.length > 1 ? "s" : ""})`);
    }
  }

  return lines;
}

/**
 * Describe a position with coordinates and spatial context.
 * Returns a single line like: "at (428, 96), 32×32px: below `Navigation`, left-aligned"
 */
export function formatPositionSummary(
  ctx: SpatialContext,
  coords: { x: number; y: number },
  size?: { width: number; height: number },
): string {
  const parts: string[] = [];

  // Neighbor context (most useful for an implementing agent)
  if (ctx.above) parts.push(`below \`${ctx.above.label}\``);
  if (ctx.below) parts.push(`above \`${ctx.below.label}\``);
  if (ctx.left) parts.push(`right of \`${ctx.left.label}\``);
  if (ctx.right) parts.push(`left of \`${ctx.right.label}\``);

  // Container
  if (ctx.containedIn) parts.push(`inside \`${ctx.containedIn.label}\``);

  // Alignment
  parts.push(formatAlignment(ctx.alignment));

  // Out-of-bounds flag
  if (ctx.outOfBounds?.viewport) {
    parts.push(`**outside viewport** (${ctx.outOfBounds.viewport.join(", ")})`);
  }
  if (ctx.outOfBounds?.container) {
    parts.push(`**outside \`${ctx.outOfBounds.container.label}\`** (${ctx.outOfBounds.container.edges.join(", ")})`);
  }

  const sizeStr = size ? `, ${Math.round(size.width)}×${Math.round(size.height)}px` : "";
  return `at (${Math.round(coords.x)}, ${Math.round(coords.y)})${sizeStr}: ${parts.join(", ")}`;
}

// =============================================================================
// Layout Group Detection
// =============================================================================

export type LayoutGroup = {
  labels: string[];
  type: "row" | "column";
  sharedEdge: number;   // avg y (row) or avg x (column)
  gaps: number[];       // gaps between consecutive members
  avgGap: number;
};

const GROUP_TOLERANCE = 15; // px tolerance for shared edge detection

/**
 * Detect rows and columns from a set of labeled rects.
 * A "row" = 2+ elements with similar y. A "column" = 2+ elements with similar x.
 */
export function detectGroups(items: { label: string; rect: SectionRect }[]): LayoutGroup[] {
  if (items.length < 2) return [];

  const groups: LayoutGroup[] = [];
  const used = new Set<number>();

  // Find rows (shared y within tolerance)
  for (let i = 0; i < items.length; i++) {
    if (used.has(i)) continue;
    const row = [i];
    for (let j = i + 1; j < items.length; j++) {
      if (used.has(j)) continue;
      if (Math.abs(items[i].rect.y - items[j].rect.y) < GROUP_TOLERANCE) {
        row.push(j);
      }
    }
    if (row.length >= 2) {
      const members = row.map(idx => items[idx]);
      members.sort((a, b) => a.rect.x - b.rect.x);
      const gaps: number[] = [];
      for (let k = 0; k < members.length - 1; k++) {
        gaps.push(Math.round(members[k + 1].rect.x - (members[k].rect.x + members[k].rect.width)));
      }
      const avgY = Math.round(members.reduce((sum, m) => sum + m.rect.y, 0) / members.length);
      groups.push({
        labels: members.map(m => m.label),
        type: "row",
        sharedEdge: avgY,
        gaps,
        avgGap: gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : 0,
      });
      row.forEach(idx => used.add(idx));
    }
  }

  // Find columns (shared x within tolerance) from remaining
  for (let i = 0; i < items.length; i++) {
    if (used.has(i)) continue;
    const col = [i];
    for (let j = i + 1; j < items.length; j++) {
      if (used.has(j)) continue;
      if (Math.abs(items[i].rect.x - items[j].rect.x) < GROUP_TOLERANCE) {
        col.push(j);
      }
    }
    if (col.length >= 2) {
      const members = col.map(idx => items[idx]);
      members.sort((a, b) => a.rect.y - b.rect.y);
      const gaps: number[] = [];
      for (let k = 0; k < members.length - 1; k++) {
        gaps.push(Math.round(members[k + 1].rect.y - (members[k].rect.y + members[k].rect.height)));
      }
      const avgX = Math.round(members.reduce((sum, m) => sum + m.rect.x, 0) / members.length);
      groups.push({
        labels: members.map(m => m.label),
        type: "column",
        sharedEdge: avgX,
        gaps,
        avgGap: gaps.length ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length) : 0,
      });
      col.forEach(idx => used.add(idx));
    }
  }

  return groups;
}

/**
 * Analyze how layout groupings changed between original and current positions.
 * Returns markdown lines describing structural changes (row→column, dissolved groups, etc.)
 */
export function analyzeLayoutPatterns(
  sections: { label: string; originalRect: SectionRect; currentRect: SectionRect }[],
): string[] {
  if (sections.length < 2) return [];

  const origGroups = detectGroups(sections.map(s => ({ label: s.label, rect: s.originalRect })));
  const currGroups = detectGroups(sections.map(s => ({ label: s.label, rect: s.currentRect })));

  const lines: string[] = [];
  const described = new Set<string>();

  // For each original group, find matching current arrangement
  for (const og of origGroups) {
    const ogSet = new Set(og.labels);

    // Find current group with most label overlap
    let bestMatch: LayoutGroup | null = null;
    let bestOverlap = 0;
    for (const cg of currGroups) {
      const overlap = cg.labels.filter(l => ogSet.has(l)).length;
      if (overlap >= 2 && overlap > bestOverlap) {
        bestMatch = cg;
        bestOverlap = overlap;
      }
    }

    if (bestMatch) {
      const sharedLabels = bestMatch.labels.filter(l => ogSet.has(l));
      const names = sharedLabels.join(", ");

      if (bestMatch.type !== og.type) {
        // Layout pattern changed (row → column or column → row)
        const fromAxis = og.type === "row" ? "y" : "x";
        const toAxis = bestMatch.type === "row" ? "y" : "x";
        lines.push(
          `**${names}**: ${og.type} (${fromAxis}≈${og.sharedEdge}, ${og.avgGap}px gaps) → ${bestMatch.type} (${toAxis}≈${bestMatch.sharedEdge}, ${bestMatch.avgGap}px gaps)`,
        );
      } else if (Math.abs(og.sharedEdge - bestMatch.sharedEdge) > 20 || Math.abs(og.avgGap - bestMatch.avgGap) > 5) {
        // Same arrangement type but moved or respaced
        const axis = og.type === "row" ? "y" : "x";
        const posChange = Math.abs(og.sharedEdge - bestMatch.sharedEdge) > 20
          ? ` ${axis}: ${og.sharedEdge} → ${bestMatch.sharedEdge}`
          : "";
        const gapChange = Math.abs(og.avgGap - bestMatch.avgGap) > 5
          ? ` gaps: ${og.avgGap}px → ${bestMatch.avgGap}px`
          : "";
        lines.push(`**${names}**: ${og.type} shifted —${posChange}${gapChange}`);
      }
      sharedLabels.forEach(l => described.add(l));
    } else {
      // Group dissolved
      const names = og.labels.join(", ");
      const axis = og.type === "row" ? "y" : "x";
      lines.push(`**${names}**: ${og.type} (${axis}≈${og.sharedEdge}) dissolved`);
      og.labels.forEach(l => described.add(l));
    }
  }

  // New groups that didn't exist in original
  for (const cg of currGroups) {
    if (cg.labels.every(l => described.has(l))) continue;

    const newLabels = cg.labels.filter(l => !described.has(l));
    if (newLabels.length < 2) continue;

    // Check if these were ungrouped originally
    const wasGrouped = origGroups.some(og => {
      const overlap = og.labels.filter(l => cg.labels.includes(l));
      return overlap.length >= 2;
    });

    if (!wasGrouped) {
      const axis = cg.type === "row" ? "y" : "x";
      lines.push(`**${cg.labels.join(", ")}**: new ${cg.type} (${axis}≈${cg.sharedEdge}, ${cg.avgGap}px gaps)`);
      cg.labels.forEach(l => described.add(l));
    }
  }

  // Shared edge callouts — elements that aren't in a group but share an edge
  const ungroupedCurr = sections.filter(s => !described.has(s.label));
  if (ungroupedCurr.length >= 2) {
    // Check for shared left edges
    const byX: Record<number, string[]> = {};
    for (const s of ungroupedCurr) {
      const x = Math.round(s.currentRect.x / 5) * 5; // round to nearest 5px
      (byX[x] ??= []).push(s.label);
    }
    for (const [x, labels] of Object.entries(byX)) {
      if (labels.length >= 2) {
        lines.push(`**${labels.join(", ")}**: shared left edge at x≈${x}`);
      }
    }
  }

  return lines;
}

// =============================================================================
// Page Layout & CSS Context (for translation formulas)
// =============================================================================

export type PageLayout = {
  viewport: { width: number; height: number };
  contentArea: {
    width: number;
    left: number;
    right: number;
    centerX: number;
    selector: string;
  } | null;
};

/**
 * Detect the page's content container and viewport dimensions.
 * The content area is the narrowest wrapping element that holds the page content
 * (e.g., a centered `max-width` container).
 */
export function getPageLayout(viewport: { width: number; height: number }): PageLayout {
  if (typeof document === "undefined") return { viewport, contentArea: null };

  // Walk the DOM to find the content container. Check <main>, [role='main'],
  // body children, and walk 3 levels deep to handle framework wrappers (e.g., Next.js __next div).
  const candidates: HTMLElement[] = [];
  const seen = new Set<HTMLElement>();

  const addCandidate = (el: HTMLElement) => {
    if (seen.has(el)) return;
    if (!(el instanceof HTMLElement)) return;
    if (el.hasAttribute("data-feedback-toolbar")) return;
    if (SKIP_TAGS.has(el.tagName.toLowerCase())) return;
    seen.add(el);
    candidates.push(el);
  };

  const main = document.querySelector("main") as HTMLElement | null;
  if (main) addCandidate(main);

  const roleMain = document.querySelector("[role='main']") as HTMLElement | null;
  if (roleMain) addCandidate(roleMain);

  // Walk 3 levels deep from body to catch framework wrappers
  for (const l1 of Array.from(document.body.children) as HTMLElement[]) {
    addCandidate(l1);
    if (l1.children) {
      for (const l2 of Array.from(l1.children) as HTMLElement[]) {
        addCandidate(l2);
        if (l2.children) {
          for (const l3 of Array.from(l2.children) as HTMLElement[]) {
            addCandidate(l3);
          }
        }
      }
    }
  }

  // Find the best content container: prefer elements with explicit max-width,
  // then fall back to elements narrower than the viewport.
  let bestContainer: { el: HTMLElement; rect: DOMRect } | null = null;

  for (const el of candidates) {
    const rect = el.getBoundingClientRect();
    if (rect.height < 50) continue; // skip tiny elements
    const style = getComputedStyle(el);

    // Has explicit max-width — strong signal
    if (style.maxWidth && style.maxWidth !== "none" && style.maxWidth !== "0px") {
      // Prefer the narrowest max-width container (most specific)
      if (!bestContainer || rect.width < bestContainer.rect.width) {
        bestContainer = { el, rect };
      }
      continue;
    }

    // Narrower than viewport — likely a container (only if no max-width match found)
    if (!bestContainer && rect.width < viewport.width - 20 && rect.width > 100) {
      bestContainer = { el, rect };
    }
  }

  if (bestContainer) {
    const { el, rect } = bestContainer;
    return {
      viewport,
      contentArea: {
        width: Math.round(rect.width),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
        centerX: Math.round(rect.left + rect.width / 2),
        selector: generateSelector(el),
      },
    };
  }

  return { viewport, contentArea: null };
}

export type ElementCSSContext = {
  parentDisplay: string;
  parentSelector: string;
  flexDirection?: string;
  gridCols?: string;
  gap?: string;
};

/**
 * Read the CSS layout context of an element's parent container.
 * Returns the parent's display mode, flex/grid properties, and gap.
 */
export function getElementCSSContext(selector: string): ElementCSSContext | null {
  if (typeof document === "undefined") return null;

  const el = document.querySelector(selector) as HTMLElement | null;
  if (!el?.parentElement) return null;

  const ps = getComputedStyle(el.parentElement);

  const result: ElementCSSContext = {
    parentDisplay: ps.display,
    parentSelector: generateSelector(el.parentElement),
  };

  if (ps.display.includes("flex")) {
    result.flexDirection = ps.flexDirection;
  }
  if (ps.display.includes("grid") && ps.gridTemplateColumns !== "none") {
    result.gridCols = ps.gridTemplateColumns;
  }
  if (ps.gap && ps.gap !== "normal" && ps.gap !== "0px") {
    result.gap = ps.gap;
  }

  return result;
}

/**
 * Format CSS-ready position values for an element relative to the content area.
 */
export function formatCSSPosition(
  rect: SectionRect,
  layout: PageLayout,
): string | null {
  const ref = layout.contentArea;
  const containerWidth = ref ? ref.width : layout.viewport.width;
  const containerLeft = ref ? ref.left : 0;
  const containerCenterX = ref ? ref.centerX : Math.round(layout.viewport.width / 2);

  const leftInContainer = Math.round(rect.x - containerLeft);
  const rightInContainer = Math.round((containerLeft + containerWidth) - (rect.x + rect.width));
  const widthPct = (rect.width / containerWidth * 100).toFixed(1);
  const centerX = rect.x + rect.width / 2;
  const isCentered = Math.abs(centerX - containerCenterX) < 20;
  const isFullWidth = rect.width / containerWidth > 0.95;

  const parts: string[] = [];

  if (isFullWidth) {
    parts.push("`width: 100%` of container");
  } else {
    parts.push(`left \`${leftInContainer}px\` in container, right \`${rightInContainer}px\`, width \`${widthPct}%\` (\`${Math.round(rect.width)}px\`)`);
  }

  if (isCentered && !isFullWidth) {
    parts.push("centered — `margin-inline: auto`");
  }

  return parts.join(" — ");
}
