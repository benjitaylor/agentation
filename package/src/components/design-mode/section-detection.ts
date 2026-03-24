// =============================================================================
// Section Detection for Rearrange Mode
// =============================================================================

import type { DetectedSection } from "./types";
import { identifyElement } from "../../utils/element-identification";

// Tags that represent meaningful page sections
const SECTION_TAGS = new Set([
  "nav", "header", "main", "section", "article", "footer", "aside",
]);

// ARIA roles that map to section semantics
const SECTION_ROLES: Record<string, string> = {
  banner: "Header",
  navigation: "Navigation",
  main: "Main Content",
  contentinfo: "Footer",
  complementary: "Sidebar",
  region: "Section",
};

// Tag name to human-readable label
const TAG_LABELS: Record<string, string> = {
  nav: "Navigation",
  header: "Header",
  main: "Main Content",
  section: "Section",
  article: "Article",
  footer: "Footer",
  aside: "Sidebar",
};

// Elements to always skip
const SKIP_TAGS = new Set(["script", "style", "noscript", "link", "meta"]);

const MIN_SECTION_HEIGHT = 40;

/**
 * Check if an element is effectively fixed to the viewport.
 * Walks up the DOM tree — if any ancestor is fixed or sticky,
 * the element doesn't scroll with the page.
 */
function isEffectivelyFixed(el: HTMLElement): boolean {
  let current: HTMLElement | null = el;
  while (current && current !== document.body && current !== document.documentElement) {
    const pos = window.getComputedStyle(current).position;
    if (pos === "fixed" || pos === "sticky") return true;
    current = current.parentElement;
  }
  return false;
}

/**
 * Generate a CSS selector that can re-find this element after re-renders.
 */
export function generateSelector(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase();

  // Unique semantic tags (usually only one nav, one footer, etc.)
  if (["nav", "header", "footer", "main"].includes(tag)) {
    // Check if it's unique
    if (document.querySelectorAll(tag).length === 1) {
      return tag;
    }
  }

  // ID selector
  if (el.id) {
    return `#${CSS.escape(el.id)}`;
  }

  // Tag + first meaningful class
  if (el.className && typeof el.className === "string") {
    const classes = el.className.split(/\s+/).filter(c => c.length > 0);
    // Find a class that isn't just a hash
    const meaningful = classes.find(c =>
      c.length > 2 && !/^[a-zA-Z0-9]{6,}$/.test(c) && !/^[a-z]{1,2}$/.test(c)
    );
    if (meaningful) {
      const selector = `${tag}.${CSS.escape(meaningful)}`;
      if (document.querySelectorAll(selector).length === 1) {
        return selector;
      }
    }
  }

  // Fallback: nth-child
  const parent = el.parentElement;
  if (parent) {
    const children = Array.from(parent.children);
    const index = children.indexOf(el) + 1;
    const parentSelector = parent === document.body ? "body" : generateSelector(parent as HTMLElement);
    return `${parentSelector} > ${tag}:nth-child(${index})`;
  }

  return tag;
}

/**
 * Determine a human-readable label for a detected section.
 */
export function labelSection(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase();

  // 1. aria-label
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel;

  // 2. ARIA role mapping
  const role = el.getAttribute("role");
  if (role && SECTION_ROLES[role]) return SECTION_ROLES[role];

  // 3. Semantic tag name
  if (TAG_LABELS[tag]) return TAG_LABELS[tag];

  // 4. First heading child
  const heading = el.querySelector("h1, h2, h3, h4, h5, h6");
  if (heading) {
    const text = heading.textContent?.trim();
    if (text && text.length <= 50) return text;
    if (text) return text.slice(0, 47) + "...";
  }

  // 5. Fallback to identifyElement
  const { name } = identifyElement(el);
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Get the first meaningful class name (strip CSS module hashes).
 */
function getCleanClassName(el: HTMLElement): string | null {
  const className = el.className;
  if (typeof className !== "string" || !className) return null;

  const meaningful = className
    .split(/\s+/)
    .map(c => c.replace(/[_][a-zA-Z0-9]{5,}.*$/, ""))
    .find(c => c.length > 2 && !/^[a-z]{1,2}$/.test(c));

  return meaningful || null;
}

/**
 * Get first ~30 chars of visible text content (for forensic output).
 */
function getTextSnippet(el: HTMLElement): string | null {
  const text = el.textContent?.trim();
  if (!text) return null;
  // Collapse whitespace
  const clean = text.replace(/\s+/g, " ");
  if (clean.length <= 30) return clean;
  return clean.slice(0, 30) + "…";
}

/**
 * Detect significant page sections for rearrange mode.
 */
export function detectPageSections(): DetectedSection[] {
  // Find the main content container — prefer <main>, fall back to <body>
  const main = document.querySelector("main") || document.body;
  const candidates = Array.from(main.children) as HTMLElement[];

  // If <main> has few children, also check <body> direct children
  let allCandidates = candidates;
  if (main !== document.body && candidates.length < 3) {
    allCandidates = Array.from(document.body.children) as HTMLElement[];
  }

  const sections: DetectedSection[] = [];

  allCandidates.forEach((el, index) => {
    if (!(el instanceof HTMLElement)) return;

    const tag = el.tagName.toLowerCase();

    // Skip non-content elements
    if (SKIP_TAGS.has(tag)) return;

    // Skip agentation's own elements
    if (el.hasAttribute("data-feedback-toolbar")) return;
    if (el.closest("[data-feedback-toolbar]")) return;

    // Skip invisible elements
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return;

    const rect = el.getBoundingClientRect();

    // Skip tiny elements
    if (rect.height < MIN_SECTION_HEIGHT) return;

    // Accept: semantic section tags, elements with ARIA roles, or divs with significant height
    const isSemantic = SECTION_TAGS.has(tag);
    const hasRole = el.getAttribute("role") && SECTION_ROLES[el.getAttribute("role")!];
    const isSignificantDiv = tag === "div" && rect.height >= 60;

    if (!isSemantic && !hasRole && !isSignificantDiv) return;

    const scrollY = window.scrollY;
    const isFixed = isEffectivelyFixed(el);

    const sectionRect = {
      x: rect.x,
      y: isFixed ? rect.y : rect.y + scrollY,
      width: rect.width,
      height: rect.height,
    };

    sections.push({
      id: `rs-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      label: labelSection(el),
      tagName: tag,
      selector: generateSelector(el),
      role: el.getAttribute("role"),
      className: getCleanClassName(el),
      textSnippet: getTextSnippet(el),
      originalRect: sectionRect,
      currentRect: { ...sectionRect },
      originalIndex: index,
      isFixed,
    });
  });

  return sections;
}

/**
 * Create a DetectedSection from a single element (for click-to-capture).
 */
export function captureElement(el: HTMLElement): DetectedSection {
  const scrollY = window.scrollY;
  const rect = el.getBoundingClientRect();
  const isFixed = isEffectivelyFixed(el);

  // Fixed elements: store viewport-relative Y (no scroll offset)
  // Normal elements: store page-absolute Y (add scroll offset)
  const sectionRect = {
    x: rect.x,
    y: isFixed ? rect.y : rect.y + scrollY,
    width: rect.width,
    height: rect.height,
  };

  const parent = el.parentElement;
  let originalIndex = 0;
  if (parent) {
    originalIndex = Array.from(parent.children).indexOf(el);
  }

  return {
    id: `rs-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    label: labelSection(el),
    tagName: el.tagName.toLowerCase(),
    selector: generateSelector(el),
    role: el.getAttribute("role"),
    className: getCleanClassName(el),
    textSnippet: getTextSnippet(el),
    originalRect: sectionRect,
    currentRect: { ...sectionRect },
    originalIndex,
    isFixed,
  };
}

