"use client";
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

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
        x: [0, -3, 3, -2, 2, 0],
        transition: { duration: 0.25, ease: "easeOut" }
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
var IconFeedback = ({ size = 18 }) => /* @__PURE__ */ jsxs2("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", children: [
  /* @__PURE__ */ jsx2("path", { d: "M12,4c4.97,0,8.9,4.56,7.82,9.72c-0.68,3.23-3.4,5.74-6.67,6.2c-1.59,0.22-3.14-0.01-4.58-0.7 c-0.27-0.13-0.56-0.19-0.86-0.19c-0.19,0-0.38,0.03-0.56,0.08l-2.31,0.68c-0.38,0.11-0.74-0.24-0.63-0.63l0.7-2.39 c0.13-0.45,0.07-0.92-0.14-1.35C4.26,14.34,4,13.18,4,12C4,7.59,7.59,4,12,4 M12,2C6.48,2,2,6.48,2,12c0,1.54,0.36,2.98,0.97,4.29 l-1.46,4.96C1.29,22,2,22.71,2.76,22.48l4.96-1.46c1.66,0.79,3.56,1.15,5.58,0.89c4.56-0.59,8.21-4.35,8.66-8.92 C22.53,7.03,17.85,2,12,2L12,2z" }),
  /* @__PURE__ */ jsx2("path", { d: "M12,8L12,8c-0.55,0-1,0.45-1,1v2H9c-0.55,0-1,0.45-1,1v0c0,0.55,0.45,1,1,1h2v2 c0,0.55,0.45,1,1,1h0c0.55,0,1-0.45,1-1v-2h2c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1h-2V9C13,8.45,12.55,8,12,8z", fillRule: "evenodd" })
] });
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
  /* @__PURE__ */ jsx2("path", { d: "M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" }),
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
var CopyMorphIcon = ({ size = 16, checked }) => /* @__PURE__ */ jsxs2("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", children: [
  /* @__PURE__ */ jsx2(
    motion2.path,
    {
      d: "M14.17,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V9.83c0-0.53-0.21-1.04-0.59-1.41l-4.83-4.83 C15.21,3.21,14.7,3,14.17,3L14.17,3z M8,15h8c0.55,0,1,0.45,1,1v0c0,0.55-0.45,1-1,1H8c-0.55,0-1-0.45-1-1v0C7,15.45,7.45,15,8,15z M8,11h8c0.55,0,1,0.45,1,1v0c0,0.55-0.45,1-1,1H8c-0.55,0-1-0.45-1-1v0C7,11.45,7.45,11,8,11z M8,7h5c0.55,0,1,0.45,1,1v0 c0,0.55-0.45,1-1,1H8C7.45,9,7,8.55,7,8v0C7,7.45,7.45,7,8,7z",
      initial: false,
      animate: { opacity: checked ? 0 : 1 },
      transition: { duration: 0.15 }
    }
  ),
  /* @__PURE__ */ jsx2(
    motion2.path,
    {
      d: "M6 12.5l3.5 3.5L18 7",
      stroke: "currentColor",
      strokeWidth: "2.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "none",
      initial: false,
      animate: { opacity: checked ? 1 : 0, scale: checked ? 1 : 0.5 },
      transition,
      style: { transformOrigin: "12px 12px" }
    }
  )
] });
var TrashMorphIcon = ({ size = 16, checked }) => /* @__PURE__ */ jsxs2("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", children: [
  /* @__PURE__ */ jsx2(
    motion2.path,
    {
      d: "M17.65 6.35c-1.63-1.63-3.94-2.57-6.48-2.31-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20c3.19 0 5.93-1.87 7.21-4.56.32-.67-.16-1.44-.9-1.44-.37 0-.72.2-.88.53-1.13 2.43-3.84 3.97-6.8 3.31-2.22-.49-4.01-2.3-4.48-4.52C5.31 9.44 8.26 6 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z",
      initial: false,
      animate: { opacity: checked ? 0 : 1 },
      transition: { duration: 0.15 }
    }
  ),
  /* @__PURE__ */ jsx2(
    motion2.path,
    {
      d: "M6 12.5l3.5 3.5L18 7",
      stroke: "currentColor",
      strokeWidth: "2.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "none",
      initial: false,
      animate: { opacity: checked ? 1 : 0, scale: checked ? 1 : 0.5 },
      transition,
      style: { transformOrigin: "12px 12px" }
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
var css2 = '.styles-module__toolbar___50aIA {\n  position: fixed;\n  bottom: 1.25rem;\n  right: 1.25rem;\n  z-index: 100000;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n}\n\n.styles-module__toggleButton___kgnvI {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 44px;\n  height: 44px;\n  border-radius: 22px;\n  border: none;\n  background: #1a1a1a;\n  color: #fff;\n  cursor: pointer;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1);\n  transition: all 0.15s ease;\n}\n.styles-module__toggleButton___kgnvI svg {\n  margin-top: -1px;\n}\n.styles-module__toggleButton___kgnvI:hover {\n  background: #2a2a2a;\n}\n\n.styles-module__badge___WRMxo {\n  position: absolute;\n  top: -4px;\n  right: -4px;\n  min-width: 18px;\n  height: 18px;\n  padding: 0 5px;\n  border-radius: 9px;\n  background: #3c82f7;\n  color: white;\n  font-size: 0.625rem;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);\n}\n\n.styles-module__controls___2-kD- {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0.375rem;\n  border-radius: 1.5rem;\n  background: #1a1a1a;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1);\n}\n\n.styles-module__controlButton___RB3R5 {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  border: none;\n  background: transparent;\n  color: rgba(255, 255, 255, 0.85);\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.styles-module__controlButton___RB3R5:hover:not(:disabled) {\n  background: rgba(255, 255, 255, 0.12);\n  color: #fff;\n}\n.styles-module__controlButton___RB3R5:active:not(:disabled) {\n  transform: scale(0.92);\n}\n.styles-module__controlButton___RB3R5:disabled {\n  opacity: 0.35;\n  cursor: not-allowed;\n}\n.styles-module__controlButton___RB3R5[data-active=true] {\n  color: #3c82f7;\n  background: rgba(60, 130, 247, 0.25);\n}\n.styles-module__controlButton___RB3R5[data-danger]:hover:not(:disabled) {\n  background: rgba(255, 59, 48, 0.25);\n  color: #ff3b30;\n}\n\n.styles-module__divider___yO3YX {\n  width: 1px;\n  height: 20px;\n  background: rgba(255, 255, 255, 0.15);\n  margin: 0 0.125rem;\n}\n\n.styles-module__overlay___pQK74 {\n  position: fixed;\n  inset: 0;\n  z-index: 99999;\n  pointer-events: none;\n}\n.styles-module__overlay___pQK74 > * {\n  pointer-events: auto;\n}\n\n.styles-module__hoverHighlight___iUTDq {\n  position: fixed;\n  border: 2px solid rgba(60, 130, 247, 0.5);\n  border-radius: 4px;\n  pointer-events: none !important;\n  background: rgba(60, 130, 247, 0.04);\n  box-sizing: border-box;\n  will-change: opacity;\n  contain: layout style;\n}\n\n.styles-module__hoverTooltip___eOid- {\n  position: fixed;\n  font-size: 0.6875rem;\n  font-weight: 500;\n  color: #fff;\n  background: rgba(0, 0, 0, 0.85);\n  padding: 0.35rem 0.6rem;\n  border-radius: 0.375rem;\n  pointer-events: none !important;\n  white-space: nowrap;\n  max-width: 200px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.styles-module__markersLayer___RFGiE {\n  position: fixed;\n  inset: 0;\n  z-index: 99998;\n  pointer-events: none;\n}\n.styles-module__markersLayer___RFGiE > * {\n  pointer-events: auto;\n}\n\n.styles-module__marker___XNegd {\n  position: fixed;\n  width: 22px;\n  height: 22px;\n  background: #3c82f7;\n  color: white;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.6875rem;\n  font-weight: 600;\n  transform: translate(-50%, -50%);\n  cursor: pointer;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);\n  transition: background 0.15s ease;\n  user-select: none;\n}\n.styles-module__marker___XNegd.styles-module__pending___h4sf4 {\n  background: #3c82f7;\n}\n.styles-module__marker___XNegd.styles-module__hovered___WMoLv {\n  background: #ff3b30;\n}\n\n.styles-module__markerTooltip___pbJGs {\n  position: absolute;\n  top: calc(100% + 10px);\n  left: 50%;\n  transform: translateX(-50%);\n  background: white;\n  padding: 0.625rem 0.75rem;\n  border-radius: 0.5rem;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04);\n  min-width: 160px;\n  max-width: 280px;\n  pointer-events: none;\n  cursor: default;\n}\n\n.styles-module__markerQuote___bZuZt {\n  display: block;\n  font-size: 0.6875rem;\n  font-style: italic;\n  color: rgba(0, 0, 0, 0.5);\n  margin-bottom: 0.375rem;\n  line-height: 1.4;\n}\n\n.styles-module__markerNote___AvTvH {\n  display: block;\n  font-size: 0.75rem;\n  font-weight: 450;\n  line-height: 1.4;\n  color: #333;\n  white-space: normal;\n}\n\n.styles-module__markerHint___drxqW {\n  display: block;\n  font-size: 0.625rem;\n  font-weight: 400;\n  color: rgba(0, 0, 0, 0.3);\n  margin-top: 0.375rem;\n}';
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
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 },
          transition: {
            type: "spring",
            stiffness: 500,
            damping: 30,
            mass: 0.8
          },
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
          initial: { opacity: 0, scale: 0.85, y: 8 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.85, y: 8 },
          transition: {
            type: "spring",
            stiffness: 600,
            damping: 35,
            mass: 0.6
          },
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
            initial: { opacity: 0, scale: 0.98 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.98 },
            transition: { duration: 0.12, ease: "easeOut" },
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
            initial: { opacity: 0, scale: 0.95, y: 4 },
            animate: { opacity: 1, scale: 1, y: 0 },
            exit: { opacity: 0, scale: 0.95, y: 4 },
            transition: { duration: 0.1, ease: "easeOut" },
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
              initial: { scale: 0, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              exit: { scale: 0, opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
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

// src/components/page-toolbar/index-css.tsx
import { useState as useState4, useCallback as useCallback4, useEffect as useEffect4, useRef as useRef4 } from "react";
import { createPortal as createPortal2 } from "react-dom";

// src/components/annotation-popup/index-css.tsx
import { useState as useState3, useRef as useRef3, useEffect as useEffect3, useCallback as useCallback3, forwardRef as forwardRef2, useImperativeHandle as useImperativeHandle2 } from "react";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var cssAnimationStyles = `
@keyframes agentation-popup-in {
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.95) translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1) translateY(0);
  }
}

@keyframes agentation-popup-shake {
  0%, 100% { transform: translateX(-50%); }
  15% { transform: translateX(-50%) translateX(-3px); }
  30% { transform: translateX(-50%) translateX(3px); }
  45% { transform: translateX(-50%) translateX(-2px); }
  60% { transform: translateX(-50%) translateX(2px); }
  75% { transform: translateX(-50%) translateX(-1px); }
  90% { transform: translateX(-50%) translateX(1px); }
}

.agentation-popup-animate-in {
  animation: agentation-popup-in 0.2s ease-out forwards;
}

.agentation-popup-shake {
  animation: agentation-popup-shake 0.3s ease-out forwards !important;
}
`;
if (typeof document !== "undefined") {
  if (!document.getElementById("agentation-popup-css-animations")) {
    const style = document.createElement("style");
    style.id = "agentation-popup-css-animations";
    style.textContent = cssAnimationStyles;
    document.head.appendChild(style);
  }
}
var AnnotationPopupCSS = forwardRef2(
  function AnnotationPopupCSS2({
    element,
    timestamp,
    selectedText,
    placeholder = "What should change?",
    onSubmit,
    onCancel,
    style,
    variant = "blue"
  }, ref) {
    const [text, setText] = useState3("");
    const [hasAnimatedIn, setHasAnimatedIn] = useState3(false);
    const textareaRef = useRef3(null);
    const containerRef = useRef3(null);
    useEffect3(() => {
      const timer = setTimeout(() => textareaRef.current?.focus(), 10);
      return () => clearTimeout(timer);
    }, []);
    const shake = useCallback3(() => {
      const el = containerRef.current;
      if (!el) return;
      el.classList.remove("agentation-popup-shake");
      void el.offsetWidth;
      el.classList.add("agentation-popup-shake");
    }, []);
    const handleAnimationEnd = useCallback3((e) => {
      if (e.animationName === "agentation-popup-in") {
        setHasAnimatedIn(true);
      }
      if (e.animationName === "agentation-popup-shake") {
        textareaRef.current?.focus();
      }
    }, []);
    useImperativeHandle2(ref, () => ({ shake }), [shake]);
    const handleSubmit = useCallback3(() => {
      if (!text.trim()) return;
      onSubmit(text.trim());
    }, [text, onSubmit]);
    const handleKeyDown = useCallback3(
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
    return /* @__PURE__ */ jsxs4(
      "div",
      {
        ref: containerRef,
        className: `${styles_module_default.popup} ${!hasAnimatedIn ? "agentation-popup-animate-in" : ""}`,
        "data-annotation-popup": true,
        style,
        onClick: (e) => e.stopPropagation(),
        onAnimationEnd: handleAnimationEnd,
        children: [
          /* @__PURE__ */ jsxs4("div", { className: styles_module_default.header, children: [
            /* @__PURE__ */ jsx4("span", { className: styles_module_default.element, children: element }),
            timestamp && /* @__PURE__ */ jsx4("span", { className: styles_module_default.timestamp, children: timestamp })
          ] }),
          selectedText && /* @__PURE__ */ jsxs4("div", { className: styles_module_default.quote, children: [
            "\u201C",
            selectedText.slice(0, 80),
            selectedText.length > 80 ? "..." : "",
            "\u201D"
          ] }),
          /* @__PURE__ */ jsx4(
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
          /* @__PURE__ */ jsxs4("div", { className: styles_module_default.actions, children: [
            /* @__PURE__ */ jsx4("button", { className: styles_module_default.cancel, onClick: onCancel, children: "Cancel" }),
            /* @__PURE__ */ jsx4(
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

// src/components/icons-css.tsx
var icons_css_exports = {};
__export(icons_css_exports, {
  CopyMorphIcon: () => CopyMorphIcon2,
  EyeMorphIcon: () => EyeMorphIcon2,
  IconChevronDown: () => IconChevronDown2,
  IconClose: () => IconClose2,
  IconExternal: () => IconExternal2,
  IconFeedback: () => IconFeedback2,
  IconPause: () => IconPause2,
  IconPlay: () => IconPlay2,
  IconPlus: () => IconPlus2,
  TrashMorphIcon: () => TrashMorphIcon2
});
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var IconFeedback2 = ({ size = 18 }) => /* @__PURE__ */ jsxs5("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", children: [
  /* @__PURE__ */ jsx5("path", { d: "M12,4c4.97,0,8.9,4.56,7.82,9.72c-0.68,3.23-3.4,5.74-6.67,6.2c-1.59,0.22-3.14-0.01-4.58-0.7 c-0.27-0.13-0.56-0.19-0.86-0.19c-0.19,0-0.38,0.03-0.56,0.08l-2.31,0.68c-0.38,0.11-0.74-0.24-0.63-0.63l0.7-2.39 c0.13-0.45,0.07-0.92-0.14-1.35C4.26,14.34,4,13.18,4,12C4,7.59,7.59,4,12,4 M12,2C6.48,2,2,6.48,2,12c0,1.54,0.36,2.98,0.97,4.29 l-1.46,4.96C1.29,22,2,22.71,2.76,22.48l4.96-1.46c1.66,0.79,3.56,1.15,5.58,0.89c4.56-0.59,8.21-4.35,8.66-8.92 C22.53,7.03,17.85,2,12,2L12,2z" }),
  /* @__PURE__ */ jsx5("path", { d: "M12,8L12,8c-0.55,0-1,0.45-1,1v2H9c-0.55,0-1,0.45-1,1v0c0,0.55,0.45,1,1,1h2v2 c0,0.55,0.45,1,1,1h0c0.55,0,1-0.45,1-1v-2h2c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1h-2V9C13,8.45,12.55,8,12,8z", fillRule: "evenodd" })
] });
var IconPlay2 = ({ size = 16 }) => /* @__PURE__ */ jsx5("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsx5(
  "path",
  {
    d: "M5 3.5v9l7-4.5-7-4.5z",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round"
  }
) });
var IconPause2 = ({ size = 16 }) => /* @__PURE__ */ jsx5("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsx5("path", { d: "M5.5 4v8M10.5 4v8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) });
var EyeMorphIcon2 = ({ size = 16, visible }) => /* @__PURE__ */ jsxs5("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", children: [
  /* @__PURE__ */ jsx5("path", { d: "M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" }),
  /* @__PURE__ */ jsxs5("g", { style: { opacity: visible ? 0 : 1, transition: "opacity 0.15s ease" }, children: [
    /* @__PURE__ */ jsx5("line", { x1: "4", y1: "20", x2: "20", y2: "4", stroke: "white", strokeWidth: "4", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx5("line", { x1: "4", y1: "20", x2: "20", y2: "4", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
  ] })
] });
var CopyMorphIcon2 = ({ size = 16, checked }) => /* @__PURE__ */ jsxs5("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", children: [
  /* @__PURE__ */ jsx5(
    "path",
    {
      d: "M14.17,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V9.83c0-0.53-0.21-1.04-0.59-1.41l-4.83-4.83 C15.21,3.21,14.7,3,14.17,3L14.17,3z M8,15h8c0.55,0,1,0.45,1,1v0c0,0.55-0.45,1-1,1H8c-0.55,0-1-0.45-1-1v0C7,15.45,7.45,15,8,15z M8,11h8c0.55,0,1,0.45,1,1v0c0,0.55-0.45,1-1,1H8c-0.55,0-1-0.45-1-1v0C7,11.45,7.45,11,8,11z M8,7h5c0.55,0,1,0.45,1,1v0 c0,0.55-0.45,1-1,1H8C7.45,9,7,8.55,7,8v0C7,7.45,7.45,7,8,7z",
      style: { opacity: checked ? 0 : 1, transition: "opacity 0.15s ease" }
    }
  ),
  /* @__PURE__ */ jsx5(
    "path",
    {
      d: "M6 12.5l3.5 3.5L18 7",
      stroke: "currentColor",
      strokeWidth: "2.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      fill: "none",
      style: {
        opacity: checked ? 1 : 0,
        transform: checked ? "scale(1)" : "scale(0.5)",
        transformOrigin: "12px 12px",
        transition: "opacity 0.2s ease, transform 0.2s ease"
      }
    }
  )
] });
var TrashMorphIcon2 = ({ size = 16, checked }) => /* @__PURE__ */ jsx5(
  "svg",
  {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    style: {
      transform: checked ? "rotate(360deg)" : "rotate(0deg)",
      transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
    },
    children: /* @__PURE__ */ jsx5("path", { d: "M17.65 6.35c-1.63-1.63-3.94-2.57-6.48-2.31-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20c3.19 0 5.93-1.87 7.21-4.56.32-.67-.16-1.44-.9-1.44-.37 0-.72.2-.88.53-1.13 2.43-3.84 3.97-6.8 3.31-2.22-.49-4.01-2.3-4.48-4.52C5.31 9.44 8.26 6 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z" })
  }
);
var IconExternal2 = ({ size = 16 }) => /* @__PURE__ */ jsx5("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsx5(
  "path",
  {
    d: "M6 3h7v7M13 3L6 10",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }
) });
var IconChevronDown2 = ({ size = 16 }) => /* @__PURE__ */ jsx5("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsx5(
  "path",
  {
    d: "M4 6l4 4 4-4",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }
) });
var IconClose2 = ({ size = 16 }) => /* @__PURE__ */ jsx5("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsx5("path", { d: "M4 4l8 8M12 4l-8 8", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) });
var IconPlus2 = ({ size = 16 }) => /* @__PURE__ */ jsx5("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ jsx5("path", { d: "M8 3v10M3 8h10", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) });

// src/components/page-toolbar/index-css.tsx
import { Fragment as Fragment2, jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var cssAnimationStyles2 = `
/* Toolbar toggle button - calmer animation */
@keyframes agentation-toggle-in {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

.agentation-toggle-enter {
  animation: agentation-toggle-in 0.2s ease-out forwards;
}

/* Controls bar - calmer animation */
@keyframes agentation-controls-in {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

.agentation-controls-enter {
  animation: agentation-controls-in 0.2s ease-out forwards;
}

/* Hover highlight - simple fast fade */
.agentation-highlight-animate {
  animation: agentation-fade-in 0.08s ease-out forwards;
}

@keyframes agentation-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Marker animations */
@keyframes agentation-marker-in {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

@keyframes agentation-marker-out {
  from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  to { opacity: 0; transform: translate(-50%, -50%) scale(0); }
}

.agentation-marker-enter {
  animation: agentation-marker-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.agentation-marker-exit {
  animation: agentation-marker-out 0.15s ease-in forwards;
  pointer-events: none;
}

/* Pending marker animation */
@keyframes agentation-pending-in {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

@keyframes agentation-pending-out {
  from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  to { opacity: 0; transform: translate(-50%, -50%) scale(0); }
}

.agentation-pending-enter {
  animation: agentation-pending-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.agentation-pending-exit {
  animation: agentation-pending-out 0.15s ease-in forwards;
  pointer-events: none;
}

/* Tooltip animations */
@keyframes agentation-tooltip-in {
  from { opacity: 0; transform: translateX(-50%) translateY(4px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.agentation-tooltip-animate {
  animation: agentation-tooltip-in 0.1s ease-out forwards;
}

/* Hover tooltip fade */
.agentation-hover-tooltip-animate {
  animation: agentation-fade-in 0.08s ease-out forwards;
}
`;
if (typeof document !== "undefined") {
  if (!document.getElementById("agentation-toolbar-css-animations")) {
    const style = document.createElement("style");
    style.id = "agentation-toolbar-css-animations";
    style.textContent = cssAnimationStyles2;
    document.head.appendChild(style);
  }
}
function generateOutput2(annotations, pathname, format = "standard") {
  if (annotations.length === 0) return "";
  const viewport = typeof window !== "undefined" ? `${window.innerWidth}\xD7${window.innerHeight}` : "unknown";
  if (format === "compact") {
    let output2 = `## Feedback: ${pathname}

`;
    annotations.forEach((a, i) => {
      const selector = a.cssClasses ? `.${a.cssClasses.split(" ")[0]}` : a.elementPath;
      output2 += `${i + 1}. **${selector}**`;
      if (a.selectedText) output2 += ` ("${a.selectedText.slice(0, 30)}...")`;
      output2 += `
   ${a.comment}

`;
    });
    return output2.trim();
  }
  if (format === "detailed") {
    let output2 = `## Page Feedback: ${pathname}
`;
    output2 += `**Viewport:** ${viewport}
`;
    output2 += `**URL:** ${typeof window !== "undefined" ? window.location.href : pathname}
`;
    output2 += `**User Agent:** ${typeof navigator !== "undefined" ? navigator.userAgent.split(" ").slice(-2).join(" ") : "unknown"}

`;
    output2 += `---

`;
    annotations.forEach((a, i) => {
      output2 += `### ${i + 1}. ${a.element}

`;
      output2 += `**Selector:** \`${a.elementPath}\`
`;
      if (a.cssClasses) {
        const classes = a.cssClasses.split(" ").map((c) => `.${c}`).join(", ");
        output2 += `**Classes:** \`${classes}\`
`;
      }
      if (a.boundingBox) {
        output2 += `**Bounding box:** x:${Math.round(a.boundingBox.x)}, y:${Math.round(a.boundingBox.y)}, ${Math.round(a.boundingBox.width)}\xD7${Math.round(a.boundingBox.height)}px
`;
      }
      if (a.selectedText) {
        output2 += `**Selected text:** "${a.selectedText}"
`;
      }
      if (a.nearbyText) {
        output2 += `**Nearby text:** "${a.nearbyText.slice(0, 150)}"
`;
      }
      output2 += `
**Issue:** ${a.comment}

`;
      output2 += `---

`;
    });
    output2 += `**Search tips:** Use the class names or selectors above to find these elements in your codebase. Try \`grep -r "className.*submit-btn"\` or search for the nearby text content.
`;
    return output2.trim();
  }
  let output = `## Page Feedback: ${pathname}
`;
  output += `**Viewport:** ${viewport}

`;
  annotations.forEach((a, i) => {
    output += `### ${i + 1}. ${a.element}
`;
    output += `**Selector:** \`${a.elementPath}\`
`;
    if (a.cssClasses) {
      output += `**Classes:** \`${a.cssClasses}\`
`;
    }
    if (a.boundingBox) {
      output += `**Position:** ${Math.round(a.boundingBox.x)}, ${Math.round(a.boundingBox.y)} (${Math.round(a.boundingBox.width)}\xD7${Math.round(a.boundingBox.height)})
`;
    }
    if (a.selectedText) {
      output += `**Selected:** "${a.selectedText}"
`;
    } else if (a.nearbyText) {
      output += `**Context:** "${a.nearbyText.slice(0, 80)}"
`;
    }
    output += `**Feedback:** ${a.comment}

`;
  });
  return output.trim();
}
function PageFeedbackToolbarCSS() {
  const [isActive, setIsActive] = useState4(false);
  const [annotations, setAnnotations] = useState4([]);
  const [markersWithState, setMarkersWithState] = useState4([]);
  const [showMarkers, setShowMarkers] = useState4(true);
  const [hoverInfo, setHoverInfo] = useState4(null);
  const [hoverPosition, setHoverPosition] = useState4({ x: 0, y: 0 });
  const [pendingAnnotation, setPendingAnnotation] = useState4(null);
  const [pendingExiting, setPendingExiting] = useState4(false);
  const [copied, setCopied] = useState4(false);
  const [cleared, setCleared] = useState4(false);
  const [hoveredMarkerId, setHoveredMarkerId] = useState4(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState4(null);
  const [scrollY, setScrollY] = useState4(0);
  const [mounted, setMounted] = useState4(false);
  const [isFrozen, setIsFrozen] = useState4(false);
  const [markersExiting, setMarkersExiting] = useState4(false);
  const popupRef = useRef4(null);
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  useEffect4(() => {
    setMarkersWithState(annotations.map((a) => ({ ...a, exiting: false })));
  }, [annotations]);
  useEffect4(() => {
    setMounted(true);
    setScrollY(window.scrollY);
    const stored = loadAnnotations(pathname);
    setAnnotations(stored);
  }, [pathname]);
  useEffect4(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect4(() => {
    if (mounted && annotations.length > 0) {
      saveAnnotations(pathname, annotations);
    } else if (mounted && annotations.length === 0) {
      localStorage.removeItem(getStorageKey(pathname));
    }
  }, [annotations, pathname, mounted]);
  const freezeAnimations = useCallback4(() => {
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
  const unfreezeAnimations = useCallback4(() => {
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
  const toggleFreeze = useCallback4(() => {
    if (isFrozen) unfreezeAnimations();
    else freezeAnimations();
  }, [isFrozen, freezeAnimations, unfreezeAnimations]);
  const handleCloseToolbar = useCallback4(() => {
    if (markersWithState.length > 0) {
      setMarkersWithState((prev) => prev.map((m) => ({ ...m, exiting: true })));
      setTimeout(() => {
        setIsActive(false);
      }, 150);
    } else {
      setIsActive(false);
    }
  }, [markersWithState.length]);
  useEffect4(() => {
    if (!isActive) {
      setPendingAnnotation(null);
      setHoverInfo(null);
      if (isFrozen) unfreezeAnimations();
    }
  }, [isActive, isFrozen, unfreezeAnimations]);
  useEffect4(() => {
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
  useEffect4(() => {
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
  const addAnnotation = useCallback4((comment) => {
    if (!pendingAnnotation) return;
    const newId = Date.now().toString();
    const newAnnotation = {
      id: newId,
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
    setRecentlyAddedId(newId);
    setTimeout(() => setRecentlyAddedId(null), 300);
  }, [pendingAnnotation]);
  const cancelAnnotation = useCallback4(() => {
    setPendingExiting(true);
    setTimeout(() => {
      setPendingExiting(false);
      setPendingAnnotation(null);
    }, 150);
  }, []);
  const deleteAnnotation = useCallback4((id) => {
    setMarkersWithState(
      (prev) => prev.map((m) => m.id === id ? { ...m, exiting: true } : m)
    );
    setTimeout(() => {
      setAnnotations((prev) => prev.filter((a) => a.id !== id));
    }, 150);
  }, []);
  const copyOutput = useCallback4(async () => {
    const output = generateOutput2(annotations, pathname);
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  }, [annotations, pathname]);
  const clearAll = useCallback4(() => {
    setAnnotations([]);
    localStorage.removeItem(getStorageKey(pathname));
    setCleared(true);
    setTimeout(() => setCleared(false), 1500);
  }, [pathname]);
  useEffect4(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        if (isActive) {
          handleCloseToolbar();
        } else {
          setIsActive(true);
        }
        return;
      }
      if (e.key === "Escape") {
        if (pendingAnnotation) {
        } else if (isActive) {
          handleCloseToolbar();
        }
        return;
      }
      if (isActive && !isTyping && !pendingAnnotation) {
        switch (e.key.toLowerCase()) {
          case "p":
            e.preventDefault();
            toggleFreeze();
            break;
          case "h":
            e.preventDefault();
            setShowMarkers((prev) => !prev);
            break;
          case "c":
            if (annotations.length > 0) {
              e.preventDefault();
              copyOutput();
            }
            break;
          case "x":
            if (annotations.length > 0) {
              e.preventDefault();
              clearAll();
            }
            break;
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, pendingAnnotation, handleCloseToolbar, toggleFreeze, annotations.length, copyOutput, clearAll]);
  if (!mounted) return null;
  const hasAnnotations = annotations.length > 0;
  const toViewportY = (absoluteY) => absoluteY - scrollY;
  return createPortal2(
    /* @__PURE__ */ jsxs6(Fragment2, { children: [
      /* @__PURE__ */ jsxs6("div", { className: styles_module_default2.toolbar, "data-feedback-toolbar": true, children: [
        !isActive && /* @__PURE__ */ jsxs6(
          "button",
          {
            className: `${styles_module_default2.toggleButton} agentation-toggle-enter`,
            onClick: (e) => {
              e.stopPropagation();
              setIsActive(true);
            },
            title: "Start feedback mode (\u2318\u21E7A)",
            children: [
              /* @__PURE__ */ jsx6(IconFeedback2, { size: 18 }),
              hasAnnotations && /* @__PURE__ */ jsx6("span", { className: styles_module_default2.badge, children: annotations.length })
            ]
          }
        ),
        isActive && /* @__PURE__ */ jsxs6("div", { className: `${styles_module_default2.controls} agentation-controls-enter`, children: [
          /* @__PURE__ */ jsx6(
            "button",
            {
              className: styles_module_default2.controlButton,
              onClick: (e) => {
                e.stopPropagation();
                toggleFreeze();
              },
              title: isFrozen ? "Resume animations (P)" : "Pause animations (P)",
              "data-active": isFrozen,
              children: isFrozen ? /* @__PURE__ */ jsx6(IconPlay2, { size: 16 }) : /* @__PURE__ */ jsx6(IconPause2, { size: 16 })
            }
          ),
          /* @__PURE__ */ jsx6(
            "button",
            {
              className: styles_module_default2.controlButton,
              onClick: (e) => {
                e.stopPropagation();
                setShowMarkers(!showMarkers);
              },
              title: showMarkers ? "Hide markers (H)" : "Show markers (H)",
              children: /* @__PURE__ */ jsx6(EyeMorphIcon2, { size: 16, visible: showMarkers })
            }
          ),
          /* @__PURE__ */ jsx6(
            "button",
            {
              className: styles_module_default2.controlButton,
              onClick: (e) => {
                e.stopPropagation();
                copyOutput();
              },
              disabled: !hasAnnotations,
              title: "Copy feedback (C)",
              children: /* @__PURE__ */ jsx6(CopyMorphIcon2, { size: 16, checked: copied })
            }
          ),
          /* @__PURE__ */ jsx6(
            "button",
            {
              className: styles_module_default2.controlButton,
              onClick: (e) => {
                e.stopPropagation();
                clearAll();
              },
              disabled: !hasAnnotations,
              title: "Clear all (X)",
              "data-danger": true,
              children: /* @__PURE__ */ jsx6(TrashMorphIcon2, { size: 16, checked: cleared })
            }
          ),
          /* @__PURE__ */ jsx6("div", { className: styles_module_default2.divider }),
          /* @__PURE__ */ jsx6(
            "button",
            {
              className: styles_module_default2.controlButton,
              onClick: (e) => {
                e.stopPropagation();
                handleCloseToolbar();
              },
              title: "Exit feedback mode (Esc)",
              children: /* @__PURE__ */ jsx6(IconChevronDown2, { size: 16 })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx6("div", { className: styles_module_default2.markersLayer, "data-feedback-toolbar": true, children: isActive && showMarkers && markersWithState.map((annotation, index) => {
        const viewportY = toViewportY(annotation.y);
        const isVisible = viewportY > -30 && viewportY < window.innerHeight + 30;
        if (!isVisible) return null;
        const isHovered = hoveredMarkerId === annotation.id;
        const isExiting = annotation.exiting || markersExiting;
        return /* @__PURE__ */ jsxs6(
          "div",
          {
            className: `${styles_module_default2.marker} ${isHovered ? styles_module_default2.hovered : ""} ${isExiting ? "agentation-marker-exit" : "agentation-marker-enter"}`,
            "data-annotation-marker": true,
            style: {
              left: `${annotation.x}%`,
              top: viewportY,
              animationDelay: isExiting ? "0s" : `${index * 0.03}s`
            },
            onMouseEnter: () => !isExiting && annotation.id !== recentlyAddedId && setHoveredMarkerId(annotation.id),
            onMouseLeave: () => setHoveredMarkerId(null),
            onClick: (e) => {
              e.stopPropagation();
              if (!isExiting) deleteAnnotation(annotation.id);
            },
            children: [
              isHovered ? /* @__PURE__ */ jsx6(IconClose2, { size: 10 }) : index + 1,
              isHovered && !isExiting && /* @__PURE__ */ jsxs6("div", { className: `${styles_module_default2.markerTooltip} agentation-tooltip-animate`, children: [
                annotation.selectedText && /* @__PURE__ */ jsxs6("span", { className: styles_module_default2.markerQuote, children: [
                  "\u201C",
                  annotation.selectedText.slice(0, 50),
                  annotation.selectedText.length > 50 ? "..." : "",
                  "\u201D"
                ] }),
                /* @__PURE__ */ jsx6("span", { className: styles_module_default2.markerNote, children: annotation.comment }),
                /* @__PURE__ */ jsx6("span", { className: styles_module_default2.markerHint, children: "Click to remove" })
              ] })
            ]
          },
          annotation.id
        );
      }) }),
      isActive && /* @__PURE__ */ jsxs6("div", { className: styles_module_default2.overlay, "data-feedback-toolbar": true, children: [
        hoverInfo?.rect && !pendingAnnotation && /* @__PURE__ */ jsx6(
          "div",
          {
            className: `${styles_module_default2.hoverHighlight} agentation-highlight-animate`,
            style: {
              left: hoverInfo.rect.left,
              top: hoverInfo.rect.top,
              width: hoverInfo.rect.width,
              height: hoverInfo.rect.height
            }
          },
          `${hoverInfo.rect.left}-${hoverInfo.rect.top}-${hoverInfo.rect.width}`
        ),
        hoverInfo && !pendingAnnotation && /* @__PURE__ */ jsx6(
          "div",
          {
            className: `${styles_module_default2.hoverTooltip} agentation-hover-tooltip-animate`,
            style: {
              left: Math.min(hoverPosition.x, window.innerWidth - 150),
              top: Math.max(hoverPosition.y - 32, 8)
            },
            children: hoverInfo.element
          }
        ),
        (pendingAnnotation || pendingExiting) && /* @__PURE__ */ jsxs6(Fragment2, { children: [
          /* @__PURE__ */ jsx6(
            "div",
            {
              className: `${styles_module_default2.marker} ${styles_module_default2.pending} ${pendingExiting ? "agentation-pending-exit" : "agentation-pending-enter"}`,
              style: {
                left: `${pendingAnnotation?.x ?? 0}%`,
                top: pendingAnnotation?.clientY ?? 0
              },
              children: /* @__PURE__ */ jsx6(IconPlus2, { size: 12 })
            }
          ),
          pendingAnnotation && !pendingExiting && /* @__PURE__ */ jsx6(
            AnnotationPopupCSS,
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
        ] })
      ] })
    ] }),
    document.body
  );
}
export {
  PageFeedbackToolbar as Agentation,
  PageFeedbackToolbarCSS as AgentationCSS,
  AnnotationPopup,
  AnnotationPopupCSS,
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
  icons_css_exports as IconsCSS,
  PageFeedbackToolbar,
  PageFeedbackToolbarCSS,
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