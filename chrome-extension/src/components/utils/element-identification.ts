// =============================================================================
// Element Identification Utilities
// =============================================================================

/**
 * Gets a readable path for an element (e.g., "article > section > p")
 */
export function getElementPath(target: HTMLElement, maxDepth = 4): string {
  const parts: string[] = [];
  let current: HTMLElement | null = target;
  let depth = 0;

  while (current && depth < maxDepth) {
    const tag = current.tagName.toLowerCase();

    // Skip generic wrappers
    if (tag === "html" || tag === "body") break;

    // Get identifier
    let identifier = tag;
    if (current.id) {
      identifier = `#${current.id}`;
    } else if (current.className && typeof current.className === "string") {
      const meaningfulClass = current.className
        .split(/\s+/)
        .find(c => c.length > 2 && !c.match(/^[a-z]{1,2}$/) && !c.match(/[A-Z0-9]{5,}/));
      if (meaningfulClass) {
        identifier = `.${meaningfulClass.split("_")[0]}`;
      }
    }

    parts.unshift(identifier);
    current = current.parentElement;
    depth++;
  }

  return parts.join(" > ");
}

/**
 * Identifies an element and returns a human-readable name + path
 */
export function identifyElement(target: HTMLElement): { name: string; path: string } {
  const path = getElementPath(target);

  if (target.dataset.element) {
    return { name: target.dataset.element, path };
  }

  const tag = target.tagName.toLowerCase();

  // SVG elements
  if (["path", "circle", "rect", "line", "g"].includes(tag)) {
    const svg = target.closest("svg");
    if (svg) {
      const parent = svg.parentElement;
      if (parent) {
        const parentName = identifyElement(parent).name;
        return { name: `graphic in ${parentName}`, path };
      }
    }
    return { name: "graphic element", path };
  }
  if (tag === "svg") {
    const parent = target.parentElement;
    if (parent?.tagName.toLowerCase() === "button") {
      const btnText = parent.textContent?.trim();
      return { name: btnText ? `icon in "${btnText}" button` : "button icon", path };
    }
    return { name: "icon", path };
  }

  // Interactive elements
  if (tag === "button") {
    const text = target.textContent?.trim();
    const ariaLabel = target.getAttribute("aria-label");
    if (ariaLabel) return { name: `button [${ariaLabel}]`, path };
    return { name: text ? `button "${text.slice(0, 25)}"` : "button", path };
  }
  if (tag === "a") {
    const text = target.textContent?.trim();
    const href = target.getAttribute("href");
    if (text) return { name: `link "${text.slice(0, 25)}"`, path };
    if (href) return { name: `link to ${href.slice(0, 30)}`, path };
    return { name: "link", path };
  }
  if (tag === "input") {
    const type = target.getAttribute("type") || "text";
    const placeholder = target.getAttribute("placeholder");
    const name = target.getAttribute("name");
    if (placeholder) return { name: `input "${placeholder}"`, path };
    if (name) return { name: `input [${name}]`, path };
    return { name: `${type} input`, path };
  }

  // Headings
  if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) {
    const text = target.textContent?.trim();
    return { name: text ? `${tag} "${text.slice(0, 35)}"` : tag, path };
  }

  // Text elements
  if (tag === "p") {
    const text = target.textContent?.trim();
    if (text) return { name: `paragraph: "${text.slice(0, 40)}${text.length > 40 ? '...' : ''}"`, path };
    return { name: "paragraph", path };
  }
  if (tag === "span" || tag === "label") {
    const text = target.textContent?.trim();
    if (text && text.length < 40) return { name: `"${text}"`, path };
    return { name: tag, path };
  }
  if (tag === "li") {
    const text = target.textContent?.trim();
    if (text && text.length < 40) return { name: `list item: "${text.slice(0, 35)}"`, path };
    return { name: "list item", path };
  }
  if (tag === "blockquote") return { name: "blockquote", path };
  if (tag === "code") {
    const text = target.textContent?.trim();
    if (text && text.length < 30) return { name: `code: \`${text}\``, path };
    return { name: "code", path };
  }
  if (tag === "pre") return { name: "code block", path };

  // Media
  if (tag === "img") {
    const alt = target.getAttribute("alt");
    return { name: alt ? `image "${alt.slice(0, 30)}"` : "image", path };
  }
  if (tag === "video") return { name: "video", path };

  // Containers - try to infer meaningful name
  if (["div", "section", "article", "nav", "header", "footer", "aside", "main"].includes(tag)) {
    const className = target.className;
    const role = target.getAttribute("role");
    const ariaLabel = target.getAttribute("aria-label");

    if (ariaLabel) return { name: `${tag} [${ariaLabel}]`, path };
    if (role) return { name: `${role}`, path };

    if (typeof className === "string" && className) {
      const words = className
        .split(/[\s_-]+/)
        .map((c) => c.replace(/[A-Z0-9]{5,}.*$/, ""))
        .filter((c) => c.length > 2 && !/^[a-z]{1,2}$/.test(c))
        .slice(0, 2);
      if (words.length > 0) return { name: words.join(" "), path };
    }

    return { name: tag === "div" ? "container" : tag, path };
  }

  return { name: tag, path };
}

/**
 * Gets text content from element and siblings for context
 */
export function getNearbyText(element: HTMLElement): string {
  const texts: string[] = [];

  const ownText = element.textContent?.trim();
  if (ownText && ownText.length < 100) {
    texts.push(ownText);
  }

  const prev = element.previousElementSibling;
  if (prev) {
    const prevText = prev.textContent?.trim();
    if (prevText && prevText.length < 50) {
      texts.unshift(`[before: "${prevText.slice(0, 40)}"]`);
    }
  }

  const next = element.nextElementSibling;
  if (next) {
    const nextText = next.textContent?.trim();
    if (nextText && nextText.length < 50) {
      texts.push(`[after: "${nextText.slice(0, 40)}"]`);
    }
  }

  return texts.join(" ");
}

/**
 * Simplified element identifier for animation feedback
 */
export function identifyAnimationElement(target: HTMLElement): string {
  if (target.dataset.element) return target.dataset.element;

  const tag = target.tagName.toLowerCase();

  if (tag === "path") return "path";
  if (tag === "circle") return "circle";
  if (tag === "rect") return "rectangle";
  if (tag === "line") return "line";
  if (tag === "ellipse") return "ellipse";
  if (tag === "polygon") return "polygon";
  if (tag === "g") return "group";
  if (tag === "svg") return "svg";

  if (tag === "button") {
    const text = target.textContent?.trim();
    return text ? `button "${text}"` : "button";
  }
  if (tag === "input") {
    const type = target.getAttribute("type") || "text";
    return `input (${type})`;
  }

  if (tag === "span" || tag === "p" || tag === "label") {
    const text = target.textContent?.trim();
    if (text && text.length < 30) return `"${text}"`;
    return "text";
  }

  if (tag === "div") {
    const className = target.className;
    if (typeof className === "string" && className) {
      const words = className
        .split(/[\s_-]+/)
        .map(c => c.replace(/[A-Z0-9]{5,}.*$/, ""))
        .filter(c => c.length > 2 && !/^[a-z]{1,2}$/.test(c))
        .slice(0, 2);
      if (words.length > 0) {
        return words.join(" ");
      }
    }
    return "container";
  }

  return tag;
}

/**
 * Gets nearby sibling elements for structural context
 */
export function getNearbyElements(element: HTMLElement): string {
  const parent = element.parentElement;
  if (!parent) return "";

  const siblings = Array.from(parent.children).filter(
    (child) => child !== element && child instanceof HTMLElement
  ) as HTMLElement[];

  if (siblings.length === 0) return "";

  const siblingIds = siblings.slice(0, 4).map((sib) => {
    const tag = sib.tagName.toLowerCase();
    const className = sib.className;

    let cls = "";
    if (typeof className === "string" && className) {
      const meaningful = className
        .split(/\s+/)
        .map((c) => c.replace(/[_][a-zA-Z0-9]{5,}.*$/, ""))
        .find((c) => c.length > 2 && !/^[a-z]{1,2}$/.test(c));
      if (meaningful) cls = `.${meaningful}`;
    }

    if (tag === "button" || tag === "a") {
      const text = sib.textContent?.trim().slice(0, 15);
      if (text) return `${tag}${cls} "${text}"`;
    }

    return `${tag}${cls}`;
  });

  const parentTag = parent.tagName.toLowerCase();
  let parentId = parentTag;
  if (typeof parent.className === "string" && parent.className) {
    const parentCls = parent.className
      .split(/\s+/)
      .map((c) => c.replace(/[_][a-zA-Z0-9]{5,}.*$/, ""))
      .find((c) => c.length > 2 && !/^[a-z]{1,2}$/.test(c));
    if (parentCls) parentId = `.${parentCls}`;
  }

  const total = parent.children.length;
  const suffix = total > siblingIds.length + 1 ? ` (${total} total in ${parentId})` : "";

  return siblingIds.join(", ") + suffix;
}

/**
 * Gets CSS class names from an element (cleaned of module hashes)
 */
export function getElementClasses(target: HTMLElement): string {
  const className = target.className;
  if (typeof className !== "string" || !className) return "";

  const classes = className
    .split(/\s+/)
    .filter(c => c.length > 0)
    .map(c => {
      const match = c.match(/^([a-zA-Z][a-zA-Z0-9_-]*?)(?:_[a-zA-Z0-9]{5,})?$/);
      return match ? match[1] : c;
    })
    .filter((c, i, arr) => arr.indexOf(c) === i);

  return classes.join(", ");
}

/**
 * Gets key computed styles for an element
 */
export function getComputedStylesSnapshot(target: HTMLElement): string {
  if (typeof window === "undefined") return "";

  const styles = window.getComputedStyle(target);
  const parts: string[] = [];

  const color = styles.color;
  const bg = styles.backgroundColor;
  if (color && color !== "rgb(0, 0, 0)") parts.push(`color: ${color}`);
  if (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") parts.push(`bg: ${bg}`);

  const fontSize = styles.fontSize;
  const fontWeight = styles.fontWeight;
  if (fontSize) parts.push(`font: ${fontSize}`);
  if (fontWeight && fontWeight !== "400" && fontWeight !== "normal") parts.push(`weight: ${fontWeight}`);

  const padding = styles.padding;
  const margin = styles.margin;
  if (padding && padding !== "0px") parts.push(`padding: ${padding}`);
  if (margin && margin !== "0px") parts.push(`margin: ${margin}`);

  const display = styles.display;
  const position = styles.position;
  if (display && display !== "block" && display !== "inline") parts.push(`display: ${display}`);
  if (position && position !== "static") parts.push(`position: ${position}`);

  const borderRadius = styles.borderRadius;
  if (borderRadius && borderRadius !== "0px") parts.push(`radius: ${borderRadius}`);

  return parts.join(", ");
}

/**
 * Gets detailed computed styles for forensic-level debugging
 */
export function getDetailedComputedStyles(target: HTMLElement): Record<string, string> {
  if (typeof window === "undefined") return {};

  const styles = window.getComputedStyle(target);
  const result: Record<string, string> = {};

  const properties = [
    "color", "backgroundColor", "borderColor",
    "fontSize", "fontWeight", "fontFamily", "lineHeight", "letterSpacing", "textAlign",
    "width", "height", "padding", "margin", "border", "borderRadius",
    "display", "position", "top", "right", "bottom", "left", "zIndex",
    "flexDirection", "justifyContent", "alignItems", "gap",
    "opacity", "visibility", "overflow", "boxShadow",
    "transform",
  ];

  for (const prop of properties) {
    const value = styles.getPropertyValue(prop.replace(/([A-Z])/g, "-$1").toLowerCase());
    if (value && value !== "none" && value !== "normal" && value !== "auto" && value !== "0px" && value !== "rgba(0, 0, 0, 0)") {
      result[prop] = value;
    }
  }

  return result;
}

/**
 * Gets accessibility information for an element
 */
export function getAccessibilityInfo(target: HTMLElement): string {
  const parts: string[] = [];

  const role = target.getAttribute("role");
  const ariaLabel = target.getAttribute("aria-label");
  const ariaDescribedBy = target.getAttribute("aria-describedby");
  const tabIndex = target.getAttribute("tabindex");
  const ariaHidden = target.getAttribute("aria-hidden");

  if (role) parts.push(`role="${role}"`);
  if (ariaLabel) parts.push(`aria-label="${ariaLabel}"`);
  if (ariaDescribedBy) parts.push(`aria-describedby="${ariaDescribedBy}"`);
  if (tabIndex) parts.push(`tabindex=${tabIndex}`);
  if (ariaHidden === "true") parts.push("aria-hidden");

  const focusable = target.matches("a, button, input, select, textarea, [tabindex]");
  if (focusable) parts.push("focusable");

  return parts.join(", ");
}

/**
 * Gets full DOM ancestry path (for forensic mode)
 */
export function getFullElementPath(target: HTMLElement): string {
  const parts: string[] = [];
  let current: HTMLElement | null = target;

  while (current && current.tagName.toLowerCase() !== "html") {
    const tag = current.tagName.toLowerCase();
    let identifier = tag;

    if (current.id) {
      identifier = `${tag}#${current.id}`;
    } else if (current.className && typeof current.className === "string") {
      const cls = current.className
        .split(/\s+/)
        .map(c => c.replace(/[_][a-zA-Z0-9]{5,}.*$/, ""))
        .find(c => c.length > 2);
      if (cls) identifier = `${tag}.${cls}`;
    }

    parts.unshift(identifier);
    current = current.parentElement;
  }

  return parts.join(" > ");
}
