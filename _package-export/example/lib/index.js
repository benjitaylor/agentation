"use client";

// src/components/page-toolbar/index.tsx
import { useState as useState2, useCallback as useCallback2, useEffect as useEffect2, useRef as useRef2 } from "react";
import { motion as motion3, AnimatePresence as AnimatePresence2 } from "framer-motion";
import { createPortal } from "react-dom";

// src/components/annotation-popup/index.tsx
import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

// src/components/annotation-popup/styles.module.scss
var css = '.styles-module__popup___MBQDV {\n  position: fixed;\n  transform: translateX(-50%);\n  width: 280px;\n  padding: 0.75rem;\n  background: white;\n  border-radius: 0.75rem;\n  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.04);\n  cursor: default;\n  z-index: 100;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n}\n\n.styles-module__header___1q-wa {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 0.5rem;\n}\n\n.styles-module__element___tPxVO {\n  font-size: 0.75rem;\n  font-weight: 500;\n  color: rgba(0, 0, 0, 0.65);\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  flex: 1;\n}\n\n.styles-module__timestamp___t7PEZ {\n  font-size: 0.625rem;\n  font-weight: 500;\n  color: rgba(0, 0, 0, 0.35);\n  font-variant-numeric: tabular-nums;\n  margin-left: 0.5rem;\n  flex-shrink: 0;\n}\n\n.styles-module__quote___uFJyr {\n  font-size: 0.6875rem;\n  font-style: italic;\n  color: rgba(0, 0, 0, 0.5);\n  margin-bottom: 0.5rem;\n  padding: 0.4rem 0.5rem;\n  background: rgba(0, 0, 0, 0.03);\n  border-radius: 0.25rem;\n  line-height: 1.45;\n}\n\n.styles-module__textarea___Pw6C4 {\n  width: 100%;\n  padding: 0.5rem 0.625rem;\n  font-size: 0.8125rem;\n  font-family: inherit;\n  border: 1px solid rgba(0, 0, 0, 0.12);\n  border-radius: 0.375rem;\n  resize: none;\n  outline: none;\n  transition: border-color 0.15s ease;\n}\n.styles-module__textarea___Pw6C4:focus {\n  border-color: #3c82f7;\n}\n.styles-module__textarea___Pw6C4::placeholder {\n  color: rgba(0, 0, 0, 0.35);\n}\n\n.styles-module__actions___bxQCu {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.375rem;\n  margin-top: 0.5rem;\n}\n\n.styles-module__cancel___-xAEc,\n.styles-module__submit___nnXO9 {\n  padding: 0.4rem 0.875rem;\n  font-size: 0.75rem;\n  font-weight: 500;\n  border-radius: 1rem;\n  border: none;\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n\n.styles-module__cancel___-xAEc {\n  background: transparent;\n  color: rgba(0, 0, 0, 0.5);\n}\n.styles-module__cancel___-xAEc:hover {\n  background: rgba(0, 0, 0, 0.05);\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.styles-module__submit___nnXO9 {\n  background: #3c82f7;\n  color: white;\n}\n.styles-module__submit___nnXO9:hover:not(:disabled) {\n  background: #2d6fdf;\n}\n.styles-module__submit___nnXO9:disabled {\n  opacity: 0.4;\n  cursor: not-allowed;\n}\n.styles-module__submit___nnXO9.styles-module__green___zdmke {\n  background: #34C759;\n}\n.styles-module__submit___nnXO9.styles-module__green___zdmke:hover:not(:disabled) {\n  background: #2db84d;\n}';
var classNames = { "popup": "styles-module__popup___MBQDV", "header": "styles-module__header___1q-wa", "element": "styles-module__element___tPxVO", "timestamp": "styles-module__timestamp___t7PEZ", "quote": "styles-module__quote___uFJyr", "textarea": "styles-module__textarea___Pw6C4", "actions": "styles-module__actions___bxQCu", "cancel": "styles-module__cancel___-xAEc", "submit": "styles-module__submit___nnXO9", "green": "styles-module__green___zdmke" };
if (typeof document !== "undefined") {
  let style = document.getElementById("feedback-tool-styles-annotation-popup-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "feedback-tool-styles-annotation-popup-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }
}
var styles_module_default = classNames;

// src/components/annotation-popup/index.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var AnnotationPopup = forwardRef(
  function AnnotationPopup2({
    element,
    timestamp,
    selectedText,
    placeholder = "What should change?",
    onSubmit,
    onCancel,
    style,
    variant = "blue"
  }, ref) {
    const [text, setText] = useState("");
    const textareaRef = useRef(null);
    const controls = useAnimation();
    useEffect(() => {
      controls.start({ opacity: 1, scale: 1, y: 0 });
      const timer = setTimeout(() => textareaRef.current?.focus(), 10);
      return () => clearTimeout(timer);
    }, [controls]);
    const shake = useCallback(async () => {
      await controls.start({
        x: [0, -8, 8, -6, 6, -4, 4, 0],
        transition: { duration: 0.4, ease: "easeOut" }
      });
      textareaRef.current?.focus();
    }, [controls]);
    useImperativeHandle(ref, () => ({
      shake
    }), [shake]);
    const handleSubmit = useCallback(() => {
      if (!text.trim()) return;
      onSubmit(text.trim());
    }, [text, onSubmit]);
    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
        if (e.key === "Escape") {
          onCancel();
        }
      },
      [handleSubmit, onCancel]
    );
    return /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: styles_module_default.popup,
        "data-annotation-popup": true,
        initial: { opacity: 0, scale: 0.95, y: 4 },
        animate: controls,
        exit: { opacity: 0, scale: 0.95, y: 4 },
        transition: { type: "spring", stiffness: 500, damping: 35 },
        style,
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxs("div", { className: styles_module_default.header, children: [
            /* @__PURE__ */ jsx("span", { className: styles_module_default.element, children: element }),
            timestamp && /* @__PURE__ */ jsx("span", { className: styles_module_default.timestamp, children: timestamp })
          ] }),
          selectedText && /* @__PURE__ */ jsxs("div", { className: styles_module_default.quote, children: [
            "\u201C",
            selectedText.slice(0, 80),
            selectedText.length > 80 ? "..." : "",
            "\u201D"
          ] }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              ref: textareaRef,
              className: styles_module_default.textarea,
              placeholder,
              value: text,
              onChange: (e) => setText(e.target.value),
              rows: 2,
              onKeyDown: handleKeyDown
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: styles_module_default.actions, children: [
            /* @__PURE__ */ jsx("button", { className: styles_module_default.cancel, onClick: onCancel, children: "Cancel" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: `${styles_module_default.submit} ${variant === "green" ? styles_module_default.green : ""}`,
                onClick: handleSubmit,
                disabled: !text.trim(),
                children: "Add"
              }
            )
          ] })
        ]
      }
    );
  }
);
function AnnotationPopupPresence({
  isOpen,
  ...props
}) {
  return /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsx(AnnotationPopup, { ...props }) });
}

// src/components/icons.tsx
import { motion as motion2 } from "framer-motion";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var transition = { type: "spring", stiffness: 500, damping: 30 };
var IconFeedback = ({ size = 18 }) => /* @__PURE__ */ jsx2("svg", { width: size, height: size, viewBox: "0 0 18 18", fill: "none", children: /* @__PURE__ */ jsx2(
  "path",
  {
    d: "M3 4h12v8H5l-2 2V4z",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round"
  }
) });
var IconPlay = ({ size = 16 }) => /* @__PURE__ */ jsx2("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsx2(
  "path",
  {
    d: "M5 3.5v9l7-4.5-7-4.5z",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round"
  }
) });
var IconPause = ({ size = 16 }) => /* @__PURE__ */ jsx2("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsx2("path", { d: "M5.5 4v8M10.5 4v8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) });
var EyeMorphIcon = ({ size = 16, visible }) => /* @__PURE__ */ jsxs2("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", children: [
  /* @__PURE__ */ jsx2("path", { d: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" }),
  /* @__PURE__ */ jsxs2(
    motion2.g,
    {
      initial: false,
      animate: { opacity: visible ? 0 : 1 },
      transition: { duration: 0.15 },
      children: [
        /* @__PURE__ */ jsx2("line", { x1: "4", y1: "20", x2: "20", y2: "4", stroke: "white", strokeWidth: "4", strokeLinecap: "round" }),
        /* @__PURE__ */ jsx2("line", { x1: "4", y1: "20", x2: "20", y2: "4", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
      ]
    }
  )
] });
var CopyMorphIcon = ({ size = 16, checked }) => /* @__PURE__ */ jsxs2("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: [
  /* @__PURE__ */ jsxs2(motion2.g, { initial: false, animate: { opacity: checked ? 0 : 1 }, transition: { duration: 0.15 }, children: [
    /* @__PURE__ */ jsx2("rect", { x: "3", y: "2", width: "7", height: "9", rx: "1", stroke: "currentColor", strokeWidth: "1.5", fill: "none" }),
    /* @__PURE__ */ jsx2("rect", { x: "6", y: "5", width: "7", height: "9", rx: "1", stroke: "currentColor", strokeWidth: "1.5", fill: "white" })
  ] }),
  /* @__PURE__ */ jsx2(
    motion2.path,
    {
      d: "M4 8.5l2.5 2.5L12 5",
      stroke: "currentColor",
      strokeWidth: "1.75",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "none",
      initial: false,
      animate: { opacity: checked ? 1 : 0, scale: checked ? 1 : 0.5 },
      transition,
      style: { transformOrigin: "8px 8px" }
    }
  )
] });
var TrashMorphIcon = ({ size = 16, checked }) => /* @__PURE__ */ jsxs2("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: [
  /* @__PURE__ */ jsxs2(motion2.g, { initial: false, animate: { opacity: checked ? 0 : 1 }, transition: { duration: 0.15 }, children: [
    /* @__PURE__ */ jsx2("path", { d: "M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx2("path", { d: "M4.5 4.5l.7 8.5a1 1 0 001 .9h3.6a1 1 0 001-.9l.7-8.5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" })
  ] }),
  /* @__PURE__ */ jsx2(
    motion2.path,
    {
      d: "M4 8.5l2.5 2.5L12 5",
      stroke: "currentColor",
      strokeWidth: "1.75",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "none",
      initial: false,
      animate: { opacity: checked ? 1 : 0, scale: checked ? 1 : 0.5 },
      transition,
      style: { transformOrigin: "8px 8px" }
    }
  )
] });
var IconExternal = ({ size = 16 }) => /* @__PURE__ */ jsx2("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsx2(
  "path",
  {
    d: "M6 3h7v7M13 3L6 10",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }
) });
var IconChevronDown = ({ size = 16 }) => /* @__PURE__ */ jsx2("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsx2(
  "path",
  {
    d: "M4 6l4 4 4-4",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }
) });
var IconClose = ({ size = 16 }) => /* @__PURE__ */ jsx2("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsx2("path", { d: "M4 4l8 8M12 4l-8 8", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) });
var IconPlus = ({ size = 16 }) => /* @__PURE__ */ jsx2("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsx2("path", { d: "M8 3v10M3 8h10", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) });

// src/utils/element-identification.ts
function getElementPath(target, maxDepth = 4) {
  const parts = [];
  let current = target;
  let depth = 0;
  while (current && depth < maxDepth) {
    const tag = current.tagName.toLowerCase();
    if (tag === "html" || tag === "body") break;
    let identifier = tag;
    if (current.id) {
      identifier = `#${current.id}`;
    } else if (current.className && typeof current.className === "string") {
      const meaningfulClass = current.className.split(/\s+/).find((c) => c.length > 2 && !c.match(/^[a-z]{1,2}$/) && !c.match(/[A-Z0-9]{5,}/));
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
function identifyElement(target) {
  const path = getElementPath(target);
  if (target.dataset.element) {
    return { name: target.dataset.element, path };
  }
  const tag = target.tagName.toLowerCase();
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
  if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) {
    const text = target.textContent?.trim();
    return { name: text ? `${tag} "${text.slice(0, 35)}"` : tag, path };
  }
  if (tag === "p") {
    const text = target.textContent?.trim();
    if (text && text.length < 50) return { name: `paragraph: "${text.slice(0, 40)}"`, path };
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
  if (tag === "img") {
    const alt = target.getAttribute("alt");
    return { name: alt ? `image "${alt.slice(0, 30)}"` : "image", path };
  }
  if (tag === "video") return { name: "video", path };
  if (["div", "section", "article", "nav", "header", "footer", "aside", "main"].includes(tag)) {
    const className = target.className;
    const role = target.getAttribute("role");
    const ariaLabel = target.getAttribute("aria-label");
    if (ariaLabel) return { name: `${tag} [${ariaLabel}]`, path };
    if (role) return { name: `${role}`, path };
    if (typeof className === "string" && className) {
      const words = className.split(/[\s_-]+/).map((c) => c.replace(/[A-Z0-9]{5,}.*$/, "")).filter((c) => c.length > 2 && !/^[a-z]{1,2}$/.test(c)).slice(0, 2);
      if (words.length > 0) return { name: words.join(" "), path };
    }
    return { name: tag === "div" ? "container" : tag, path };
  }
  return { name: tag, path };
}
function getNearbyText(element) {
  const texts = [];
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
function identifyAnimationElement(target) {
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
      const words = className.split(/[\s_-]+/).map((c) => c.replace(/[A-Z0-9]{5,}.*$/, "")).filter((c) => c.length > 2 && !/^[a-z]{1,2}$/.test(c)).slice(0, 2);
      if (words.length > 0) {
        return words.join(" ");
      }
    }
    return "container";
  }
  return tag;
}
function getElementClasses(target) {
  const className = target.className;
  if (typeof className !== "string" || !className) return "";
  const classes = className.split(/\s+/).filter((c) => c.length > 0).map((c) => {
    const match = c.match(/^([a-zA-Z][a-zA-Z0-9_-]*?)(?:_[a-zA-Z0-9]{5,})?$/);
    return match ? match[1] : c;
  }).filter((c, i, arr) => arr.indexOf(c) === i);
  return classes.join(", ");
}

// src/utils/storage.ts
var STORAGE_PREFIX = "feedback-annotations-";
var DEFAULT_RETENTION_DAYS = 7;
function getStorageKey(pathname) {
  return `${STORAGE_PREFIX}${pathname}`;
}
function loadAnnotations(pathname) {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(getStorageKey(pathname));
    if (!stored) return [];
    const data = JSON.parse(stored);
    const cutoff = Date.now() - DEFAULT_RETENTION_DAYS * 24 * 60 * 60 * 1e3;
    return data.filter((a) => !a.timestamp || a.timestamp > cutoff);
  } catch {
    return [];
  }
}
function saveAnnotations(pathname, annotations) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getStorageKey(pathname), JSON.stringify(annotations));
  } catch {
  }
}

// src/components/page-toolbar/styles.module.scss
var css2 = '.styles-module__toolbar___50aIA {\n  position: fixed;\n  bottom: 1.25rem;\n  right: 1.25rem;\n  z-index: 100000;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n}\n\n.styles-module__toggleButton___kgnvI {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 44px;\n  height: 44px;\n  border-radius: 22px;\n  border: none;\n  background: white;\n  color: rgba(0, 0, 0, 0.5);\n  cursor: pointer;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(0, 0, 0, 0.06);\n  transition: color 0.15s ease;\n}\n.styles-module__toggleButton___kgnvI:hover {\n  color: rgba(0, 0, 0, 0.8);\n}\n\n.styles-module__badge___WRMxo {\n  position: absolute;\n  top: -4px;\n  right: -4px;\n  min-width: 18px;\n  height: 18px;\n  padding: 0 5px;\n  border-radius: 9px;\n  background: #3c82f7;\n  color: white;\n  font-size: 0.625rem;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);\n}\n\n.styles-module__controls___2-kD- {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0.375rem;\n  border-radius: 1.5rem;\n  background: white;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(0, 0, 0, 0.06);\n}\n\n.styles-module__controlButton___RB3R5 {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  border: none;\n  background: transparent;\n  color: rgba(0, 0, 0, 0.5);\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.styles-module__controlButton___RB3R5:hover:not(:disabled) {\n  background: rgba(0, 0, 0, 0.06);\n  color: rgba(0, 0, 0, 0.75);\n}\n.styles-module__controlButton___RB3R5:active:not(:disabled) {\n  transform: scale(0.92);\n}\n.styles-module__controlButton___RB3R5:disabled {\n  opacity: 0.3;\n  cursor: not-allowed;\n}\n.styles-module__controlButton___RB3R5[data-active=true] {\n  color: #3c82f7;\n  background: rgba(60, 130, 247, 0.1);\n}\n.styles-module__controlButton___RB3R5[data-danger]:hover:not(:disabled) {\n  background: rgba(255, 59, 48, 0.1);\n  color: #ff3b30;\n}\n\n.styles-module__divider___yO3YX {\n  width: 1px;\n  height: 20px;\n  background: rgba(0, 0, 0, 0.1);\n  margin: 0 0.125rem;\n}\n\n.styles-module__overlay___pQK74 {\n  position: fixed;\n  inset: 0;\n  z-index: 99999;\n  pointer-events: none;\n}\n.styles-module__overlay___pQK74 > * {\n  pointer-events: auto;\n}\n\n.styles-module__hoverHighlight___iUTDq {\n  position: fixed;\n  border: 2px solid rgba(60, 130, 247, 0.6);\n  border-radius: 4px;\n  pointer-events: none !important;\n  background: rgba(60, 130, 247, 0.06);\n  box-sizing: border-box;\n}\n\n.styles-module__hoverTooltip___eOid- {\n  position: fixed;\n  font-size: 0.6875rem;\n  font-weight: 500;\n  color: #fff;\n  background: rgba(0, 0, 0, 0.85);\n  padding: 0.35rem 0.6rem;\n  border-radius: 0.375rem;\n  pointer-events: none !important;\n  white-space: nowrap;\n  max-width: 200px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.styles-module__markersLayer___RFGiE {\n  position: fixed;\n  inset: 0;\n  z-index: 99998;\n  pointer-events: none;\n}\n.styles-module__markersLayer___RFGiE > * {\n  pointer-events: auto;\n}\n\n.styles-module__marker___XNegd {\n  position: fixed;\n  width: 22px;\n  height: 22px;\n  background: #3c82f7;\n  color: white;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.6875rem;\n  font-weight: 600;\n  transform: translate(-50%, -50%);\n  cursor: pointer;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);\n  transition: background 0.15s ease;\n  user-select: none;\n}\n.styles-module__marker___XNegd.styles-module__pending___h4sf4 {\n  background: #3c82f7;\n}\n.styles-module__marker___XNegd.styles-module__hovered___WMoLv {\n  background: #ff3b30;\n}\n\n.styles-module__markerTooltip___pbJGs {\n  position: absolute;\n  top: calc(100% + 10px);\n  left: 50%;\n  transform: translateX(-50%);\n  background: white;\n  padding: 0.625rem 0.75rem;\n  border-radius: 0.5rem;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04);\n  min-width: 160px;\n  max-width: 280px;\n  pointer-events: none;\n  cursor: default;\n}\n\n.styles-module__markerQuote___bZuZt {\n  display: block;\n  font-size: 0.6875rem;\n  font-style: italic;\n  color: rgba(0, 0, 0, 0.5);\n  margin-bottom: 0.375rem;\n  line-height: 1.4;\n}\n\n.styles-module__markerNote___AvTvH {\n  display: block;\n  font-size: 0.75rem;\n  font-weight: 450;\n  line-height: 1.4;\n  color: #333;\n  white-space: normal;\n}\n\n.styles-module__markerHint___drxqW {\n  display: block;\n  font-size: 0.625rem;\n  font-weight: 400;\n  color: rgba(0, 0, 0, 0.3);\n  margin-top: 0.375rem;\n}';
var classNames2 = { "toolbar": "styles-module__toolbar___50aIA", "toggleButton": "styles-module__toggleButton___kgnvI", "badge": "styles-module__badge___WRMxo", "controls": "styles-module__controls___2-kD-", "controlButton": "styles-module__controlButton___RB3R5", "divider": "styles-module__divider___yO3YX", "overlay": "styles-module__overlay___pQK74", "hoverHighlight": "styles-module__hoverHighlight___iUTDq", "hoverTooltip": "styles-module__hoverTooltip___eOid-", "markersLayer": "styles-module__markersLayer___RFGiE", "marker": "styles-module__marker___XNegd", "pending": "styles-module__pending___h4sf4", "hovered": "styles-module__hovered___WMoLv", "markerTooltip": "styles-module__markerTooltip___pbJGs", "markerQuote": "styles-module__markerQuote___bZuZt", "markerNote": "styles-module__markerNote___AvTvH", "markerHint": "styles-module__markerHint___drxqW" };
if (typeof document !== "undefined") {
  let style = document.getElementById("feedback-tool-styles-page-toolbar-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "feedback-tool-styles-page-toolbar-styles";
    style.textContent = css2;
    document.head.appendChild(style);
  }
}
var styles_module_default2 = classNames2;

// src/components/page-toolbar/index.tsx
import { Fragment, jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function generateOutput(annotations, pathname) {
  if (annotations.length === 0) return "";
  const viewport = typeof window !== "undefined" ? `${window.innerWidth}\xD7${window.innerHeight}` : "unknown";
  let output = `## Page Feedback: ${pathname}
`;
  output += `**Viewport:** ${viewport}

`;
  annotations.forEach((a, i) => {
    output += `### ${i + 1}. ${a.element}
`;
    output += `**Location:** ${a.elementPath}
`;
    if (a.cssClasses) {
      output += `**Classes:** ${a.cssClasses}
`;
    }
    if (a.boundingBox) {
      output += `**Position:** ${Math.round(a.boundingBox.x)}px, ${Math.round(a.boundingBox.y)}px (${Math.round(a.boundingBox.width)}\xD7${Math.round(a.boundingBox.height)}px)
`;
    }
    if (a.selectedText) {
      output += `**Selected text:** "${a.selectedText}"
`;
    }
    if (a.nearbyText && !a.selectedText) {
      output += `**Context:** ${a.nearbyText.slice(0, 100)}
`;
    }
    output += `**Feedback:** ${a.comment}

`;
  });
  return output.trim();
}
function PageFeedbackToolbar() {
  const [isActive, setIsActive] = useState2(false);
  const [annotations, setAnnotations] = useState2([]);
  const [showMarkers, setShowMarkers] = useState2(true);
  const [hoverInfo, setHoverInfo] = useState2(null);
  const [hoverPosition, setHoverPosition] = useState2({ x: 0, y: 0 });
  const [pendingAnnotation, setPendingAnnotation] = useState2(null);
  const [copied, setCopied] = useState2(false);
  const [cleared, setCleared] = useState2(false);
  const [hoveredMarkerId, setHoveredMarkerId] = useState2(null);
  const [scrollY, setScrollY] = useState2(0);
  const [mounted, setMounted] = useState2(false);
  const [isFrozen, setIsFrozen] = useState2(false);
  const popupRef = useRef2(null);
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  useEffect2(() => {
    setMounted(true);
    setScrollY(window.scrollY);
    const stored = loadAnnotations(pathname);
    setAnnotations(stored);
  }, [pathname]);
  useEffect2(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect2(() => {
    if (mounted && annotations.length > 0) {
      saveAnnotations(pathname, annotations);
    } else if (mounted && annotations.length === 0) {
      localStorage.removeItem(getStorageKey(pathname));
    }
  }, [annotations, pathname, mounted]);
  const freezeAnimations = useCallback2(() => {
    if (isFrozen) return;
    const style = document.createElement("style");
    style.id = "feedback-freeze-styles";
    style.textContent = `
      *, *::before, *::after {
        animation-play-state: paused !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
    document.querySelectorAll("video").forEach((video) => {
      if (!video.paused) {
        video.dataset.wasPaused = "false";
        video.pause();
      }
    });
    setIsFrozen(true);
  }, [isFrozen]);
  const unfreezeAnimations = useCallback2(() => {
    if (!isFrozen) return;
    const style = document.getElementById("feedback-freeze-styles");
    if (style) style.remove();
    document.querySelectorAll("video").forEach((video) => {
      if (video.dataset.wasPaused === "false") {
        video.play();
        delete video.dataset.wasPaused;
      }
    });
    setIsFrozen(false);
  }, [isFrozen]);
  const toggleFreeze = useCallback2(() => {
    if (isFrozen) {
      unfreezeAnimations();
    } else {
      freezeAnimations();
    }
  }, [isFrozen, freezeAnimations, unfreezeAnimations]);
  useEffect2(() => {
    if (!isActive) {
      setPendingAnnotation(null);
      setHoverInfo(null);
      if (isFrozen) {
        unfreezeAnimations();
      }
    }
  }, [isActive, isFrozen, unfreezeAnimations]);
  useEffect2(() => {
    if (!isActive || pendingAnnotation) return;
    const handleMouseMove = (e) => {
      if (e.target.closest("[data-feedback-toolbar]")) {
        setHoverInfo(null);
        return;
      }
      const elementUnder = document.elementFromPoint(e.clientX, e.clientY);
      if (!elementUnder || elementUnder.closest("[data-feedback-toolbar]")) {
        setHoverInfo(null);
        return;
      }
      const { name, path } = identifyElement(elementUnder);
      const rect = elementUnder.getBoundingClientRect();
      setHoverInfo({ element: name, elementPath: path, rect });
      setHoverPosition({ x: e.clientX, y: e.clientY });
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isActive, pendingAnnotation]);
  useEffect2(() => {
    if (!isActive) return;
    const handleClick = (e) => {
      const target = e.target;
      if (target.closest("[data-feedback-toolbar]")) return;
      if (target.closest("[data-annotation-popup]")) return;
      if (target.closest("[data-annotation-marker]")) return;
      e.preventDefault();
      if (pendingAnnotation) {
        popupRef.current?.shake();
        return;
      }
      const elementUnder = document.elementFromPoint(e.clientX, e.clientY);
      if (!elementUnder) return;
      const { name, path } = identifyElement(elementUnder);
      const rect = elementUnder.getBoundingClientRect();
      const x = e.clientX / window.innerWidth * 100;
      const y = e.clientY + window.scrollY;
      const selection = window.getSelection();
      let selectedText;
      if (selection && selection.toString().trim().length > 0) {
        selectedText = selection.toString().trim().slice(0, 500);
      }
      setPendingAnnotation({
        x,
        y,
        clientY: e.clientY,
        element: name,
        elementPath: path,
        selectedText,
        boundingBox: { x: rect.left, y: rect.top + window.scrollY, width: rect.width, height: rect.height },
        nearbyText: getNearbyText(elementUnder),
        cssClasses: getElementClasses(elementUnder)
      });
      setHoverInfo(null);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isActive, pendingAnnotation]);
  const addAnnotation = useCallback2((comment) => {
    if (!pendingAnnotation) return;
    const newAnnotation = {
      id: Date.now().toString(),
      x: pendingAnnotation.x,
      y: pendingAnnotation.y,
      comment,
      element: pendingAnnotation.element,
      elementPath: pendingAnnotation.elementPath,
      timestamp: Date.now(),
      selectedText: pendingAnnotation.selectedText,
      boundingBox: pendingAnnotation.boundingBox,
      nearbyText: pendingAnnotation.nearbyText,
      cssClasses: pendingAnnotation.cssClasses
    };
    setAnnotations((prev) => [...prev, newAnnotation]);
    setPendingAnnotation(null);
    window.getSelection()?.removeAllRanges();
  }, [pendingAnnotation]);
  const cancelAnnotation = useCallback2(() => {
    setPendingAnnotation(null);
  }, []);
  const deleteAnnotation = useCallback2((id) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }, []);
  const copyOutput = useCallback2(async () => {
    const output = generateOutput(annotations, pathname);
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  }, [annotations, pathname]);
  const clearAll = useCallback2(() => {
    setAnnotations([]);
    localStorage.removeItem(getStorageKey(pathname));
    setCleared(true);
    setTimeout(() => setCleared(false), 1500);
  }, [pathname]);
  useEffect2(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (pendingAnnotation) {
        } else if (isActive) {
          setIsActive(false);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, pendingAnnotation]);
  if (!mounted) return null;
  const hasAnnotations = annotations.length > 0;
  const toViewportY = (absoluteY) => absoluteY - scrollY;
  return createPortal(
    /* @__PURE__ */ jsxs3(Fragment, { children: [
      /* @__PURE__ */ jsx3("div", { className: styles_module_default2.toolbar, "data-feedback-toolbar": true, children: /* @__PURE__ */ jsx3(AnimatePresence2, { mode: "wait", initial: false, children: !isActive ? /* @__PURE__ */ jsxs3(
        motion3.button,
        {
          className: styles_module_default2.toggleButton,
          onClick: (e) => {
            e.stopPropagation();
            setIsActive(true);
          },
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.9 },
          transition: { duration: 0.15 },
          title: "Start feedback mode",
          children: [
            /* @__PURE__ */ jsx3(IconFeedback, { size: 18 }),
            hasAnnotations && /* @__PURE__ */ jsx3("span", { className: styles_module_default2.badge, children: annotations.length })
          ]
        },
        "toggle"
      ) : /* @__PURE__ */ jsxs3(
        motion3.div,
        {
          className: styles_module_default2.controls,
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.9 },
          transition: { duration: 0.15 },
          children: [
            /* @__PURE__ */ jsx3(
              motion3.button,
              {
                className: styles_module_default2.controlButton,
                onClick: (e) => {
                  e.stopPropagation();
                  toggleFreeze();
                },
                title: isFrozen ? "Resume animations" : "Pause animations",
                "data-active": isFrozen,
                whileTap: { scale: 0.95 },
                children: isFrozen ? /* @__PURE__ */ jsx3(IconPlay, { size: 16 }) : /* @__PURE__ */ jsx3(IconPause, { size: 16 })
              }
            ),
            /* @__PURE__ */ jsx3(
              motion3.button,
              {
                className: styles_module_default2.controlButton,
                onClick: (e) => {
                  e.stopPropagation();
                  setShowMarkers(!showMarkers);
                },
                title: showMarkers ? "Hide markers" : "Show markers",
                whileTap: { scale: 0.95 },
                children: /* @__PURE__ */ jsx3(EyeMorphIcon, { size: 16, visible: showMarkers })
              }
            ),
            /* @__PURE__ */ jsx3(
              motion3.button,
              {
                className: styles_module_default2.controlButton,
                onClick: (e) => {
                  e.stopPropagation();
                  copyOutput();
                },
                disabled: !hasAnnotations,
                title: "Copy feedback",
                whileTap: { scale: 0.95 },
                children: /* @__PURE__ */ jsx3(CopyMorphIcon, { size: 16, checked: copied })
              }
            ),
            /* @__PURE__ */ jsx3(
              motion3.button,
              {
                className: styles_module_default2.controlButton,
                onClick: (e) => {
                  e.stopPropagation();
                  clearAll();
                },
                disabled: !hasAnnotations,
                title: "Clear all",
                "data-danger": true,
                whileTap: { scale: 0.95 },
                children: /* @__PURE__ */ jsx3(TrashMorphIcon, { size: 16, checked: cleared })
              }
            ),
            /* @__PURE__ */ jsx3("div", { className: styles_module_default2.divider }),
            /* @__PURE__ */ jsx3(
              motion3.button,
              {
                className: styles_module_default2.controlButton,
                onClick: (e) => {
                  e.stopPropagation();
                  setIsActive(false);
                },
                title: "Exit feedback mode",
                whileTap: { scale: 0.95 },
                children: /* @__PURE__ */ jsx3(IconChevronDown, { size: 16 })
              }
            )
          ]
        },
        "controls"
      ) }) }),
      /* @__PURE__ */ jsx3("div", { className: styles_module_default2.markersLayer, "data-feedback-toolbar": true, children: /* @__PURE__ */ jsx3(AnimatePresence2, { children: isActive && showMarkers && annotations.map((annotation, index) => {
        const viewportY = toViewportY(annotation.y);
        const isVisible = viewportY > -30 && viewportY < window.innerHeight + 30;
        if (!isVisible) return null;
        const isHovered = hoveredMarkerId === annotation.id;
        return /* @__PURE__ */ jsxs3(
          motion3.div,
          {
            className: `${styles_module_default2.marker} ${isHovered ? styles_module_default2.hovered : ""}`,
            "data-annotation-marker": true,
            initial: { scale: 0, opacity: 0 },
            animate: {
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 25,
                delay: index * 0.03
              }
            },
            exit: {
              scale: 0,
              opacity: 0,
              transition: { duration: 0.15, ease: "easeIn" }
            },
            whileHover: { scale: 1.1 },
            style: {
              left: `${annotation.x}%`,
              top: viewportY
            },
            onMouseEnter: () => setHoveredMarkerId(annotation.id),
            onMouseLeave: () => setHoveredMarkerId(null),
            onClick: (e) => {
              e.stopPropagation();
              deleteAnnotation(annotation.id);
            },
            children: [
              isHovered ? /* @__PURE__ */ jsx3(IconClose, { size: 10 }) : index + 1,
              /* @__PURE__ */ jsx3(AnimatePresence2, { children: isHovered && /* @__PURE__ */ jsxs3(
                motion3.div,
                {
                  className: styles_module_default2.markerTooltip,
                  initial: { opacity: 0, y: 2, scale: 0.98 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                  exit: { opacity: 0, y: 2, scale: 0.98 },
                  transition: { duration: 0.1, ease: "easeOut" },
                  children: [
                    annotation.selectedText && /* @__PURE__ */ jsxs3("span", { className: styles_module_default2.markerQuote, children: [
                      "\u201C",
                      annotation.selectedText.slice(0, 50),
                      annotation.selectedText.length > 50 ? "..." : "",
                      "\u201D"
                    ] }),
                    /* @__PURE__ */ jsx3("span", { className: styles_module_default2.markerNote, children: annotation.comment }),
                    /* @__PURE__ */ jsx3("span", { className: styles_module_default2.markerHint, children: "Click to remove" })
                  ]
                }
              ) })
            ]
          },
          annotation.id
        );
      }) }) }),
      isActive && /* @__PURE__ */ jsxs3("div", { className: styles_module_default2.overlay, "data-feedback-toolbar": true, children: [
        /* @__PURE__ */ jsx3(AnimatePresence2, { children: hoverInfo?.rect && !pendingAnnotation && /* @__PURE__ */ jsx3(
          motion3.div,
          {
            className: styles_module_default2.hoverHighlight,
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.1 },
            style: {
              left: hoverInfo.rect.left,
              top: hoverInfo.rect.top,
              width: hoverInfo.rect.width,
              height: hoverInfo.rect.height
            }
          },
          "hover-highlight"
        ) }),
        /* @__PURE__ */ jsx3(AnimatePresence2, { children: hoverInfo && !pendingAnnotation && /* @__PURE__ */ jsx3(
          motion3.div,
          {
            className: styles_module_default2.hoverTooltip,
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.1 },
            style: {
              left: Math.min(hoverPosition.x, window.innerWidth - 150),
              top: Math.max(hoverPosition.y - 32, 8)
            },
            children: hoverInfo.element
          },
          "hover-tooltip"
        ) }),
        /* @__PURE__ */ jsx3(AnimatePresence2, { children: pendingAnnotation && /* @__PURE__ */ jsxs3(Fragment, { children: [
          /* @__PURE__ */ jsx3(
            motion3.div,
            {
              className: `${styles_module_default2.marker} ${styles_module_default2.pending}`,
              initial: { scale: 0 },
              animate: { scale: 1 },
              exit: { scale: 0 },
              transition: { type: "spring", stiffness: 500, damping: 30 },
              style: {
                left: `${pendingAnnotation.x}%`,
                top: pendingAnnotation.clientY
              },
              children: /* @__PURE__ */ jsx3(IconPlus, { size: 12 })
            }
          ),
          /* @__PURE__ */ jsx3(
            AnnotationPopup,
            {
              ref: popupRef,
              element: pendingAnnotation.element,
              selectedText: pendingAnnotation.selectedText,
              onSubmit: addAnnotation,
              onCancel: cancelAnnotation,
              style: {
                left: `${Math.min(Math.max(pendingAnnotation.x, 15), 85)}%`,
                top: Math.min(pendingAnnotation.clientY + 20, window.innerHeight - 180)
              }
            }
          )
        ] }) })
      ] })
    ] }),
    document.body
  );
}
export {
  AnnotationPopup,
  AnnotationPopupPresence,
  CopyMorphIcon,
  EyeMorphIcon,
  PageFeedbackToolbar as FeedbackToolbar,
  IconChevronDown,
  IconClose,
  IconExternal,
  IconFeedback,
  IconPause,
  IconPlay,
  IconPlus,
  PageFeedbackToolbar,
  TrashMorphIcon,
  getElementClasses,
  getElementPath,
  getNearbyText,
  getStorageKey,
  identifyAnimationElement,
  identifyElement,
  loadAnnotations,
  saveAnnotations
};
//# sourceMappingURL=index.js.map