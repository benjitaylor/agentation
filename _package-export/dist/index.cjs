"use client";
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Agentation: () => PageFeedbackToolbar,
  AgentationCSS: () => PageFeedbackToolbarCSS,
  AnnotationPopup: () => AnnotationPopup,
  AnnotationPopupCSS: () => AnnotationPopupCSS,
  AnnotationPopupPresence: () => AnnotationPopupPresence,
  CopyMorphIcon: () => CopyMorphIcon,
  EyeMorphIcon: () => EyeMorphIcon,
  FeedbackToolbar: () => PageFeedbackToolbar,
  IconChevronDown: () => IconChevronDown,
  IconClose: () => IconClose,
  IconExternal: () => IconExternal,
  IconFeedback: () => IconFeedback,
  IconPause: () => IconPause,
  IconPlay: () => IconPlay,
  IconPlus: () => IconPlus,
  IconsCSS: () => icons_css_exports,
  PageFeedbackToolbar: () => PageFeedbackToolbar,
  PageFeedbackToolbarCSS: () => PageFeedbackToolbarCSS,
  TrashMorphIcon: () => TrashMorphIcon,
  getElementClasses: () => getElementClasses,
  getElementPath: () => getElementPath,
  getNearbyText: () => getNearbyText,
  getStorageKey: () => getStorageKey,
  identifyAnimationElement: () => identifyAnimationElement,
  identifyElement: () => identifyElement,
  loadAnnotations: () => loadAnnotations,
  saveAnnotations: () => saveAnnotations
});
module.exports = __toCommonJS(index_exports);

// src/components/page-toolbar/index.tsx
var import_react2 = require("react");
var import_framer_motion3 = require("framer-motion");
var import_react_dom = require("react-dom");

// src/components/annotation-popup/index.tsx
var import_react = require("react");
var import_framer_motion = require("framer-motion");

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
var import_jsx_runtime = require("react/jsx-runtime");
var AnnotationPopup = (0, import_react.forwardRef)(
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
    const [text, setText] = (0, import_react.useState)("");
    const textareaRef = (0, import_react.useRef)(null);
    const controls = (0, import_framer_motion.useAnimation)();
    (0, import_react.useEffect)(() => {
      controls.start({ opacity: 1, scale: 1, y: 0 });
      const timer = setTimeout(() => textareaRef.current?.focus(), 10);
      return () => clearTimeout(timer);
    }, [controls]);
    const shake = (0, import_react.useCallback)(async () => {
      await controls.start({
        x: [0, -3, 3, -2, 2, 0],
        transition: { duration: 0.25, ease: "easeOut" }
      });
      textareaRef.current?.focus();
    }, [controls]);
    (0, import_react.useImperativeHandle)(ref, () => ({
      shake
    }), [shake]);
    const handleSubmit = (0, import_react.useCallback)(() => {
      if (!text.trim()) return;
      onSubmit(text.trim());
    }, [text, onSubmit]);
    const handleKeyDown = (0, import_react.useCallback)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_framer_motion.motion.div,
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
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: styles_module_default.header, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: styles_module_default.element, children: element }),
            timestamp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: styles_module_default.timestamp, children: timestamp })
          ] }),
          selectedText && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: styles_module_default.quote, children: [
            "\u201C",
            selectedText.slice(0, 80),
            selectedText.length > 80 ? "..." : "",
            "\u201D"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: styles_module_default.actions, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { className: styles_module_default.cancel, onClick: onCancel, children: "Cancel" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_framer_motion.AnimatePresence, { children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnnotationPopup, { ...props }) });
}

// src/components/icons.tsx
var import_framer_motion2 = require("framer-motion");
var import_jsx_runtime2 = require("react/jsx-runtime");
var transition = { type: "spring", stiffness: 500, damping: 30 };
var IconFeedback = ({ size = 18 }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", children: [
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M12,4c4.97,0,8.9,4.56,7.82,9.72c-0.68,3.23-3.4,5.74-6.67,6.2c-1.59,0.22-3.14-0.01-4.58-0.7 c-0.27-0.13-0.56-0.19-0.86-0.19c-0.19,0-0.38,0.03-0.56,0.08l-2.31,0.68c-0.38,0.11-0.74-0.24-0.63-0.63l0.7-2.39 c0.13-0.45,0.07-0.92-0.14-1.35C4.26,14.34,4,13.18,4,12C4,7.59,7.59,4,12,4 M12,2C6.48,2,2,6.48,2,12c0,1.54,0.36,2.98,0.97,4.29 l-1.46,4.96C1.29,22,2,22.71,2.76,22.48l4.96-1.46c1.66,0.79,3.56,1.15,5.58,0.89c4.56-0.59,8.21-4.35,8.66-8.92 C22.53,7.03,17.85,2,12,2L12,2z" }),
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M12,8L12,8c-0.55,0-1,0.45-1,1v2H9c-0.55,0-1,0.45-1,1v0c0,0.55,0.45,1,1,1h2v2 c0,0.55,0.45,1,1,1h0c0.55,0,1-0.45,1-1v-2h2c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1h-2V9C13,8.45,12.55,8,12,8z", fillRule: "evenodd" })
] });
var IconPlay = ({ size = 16 }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
  "path",
  {
    d: "M5 3.5v9l7-4.5-7-4.5z",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round"
  }
) });
var IconPause = ({ size = 16 }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M5.5 4v8M10.5 4v8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) });
var EyeMorphIcon = ({ size = 16, visible }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", children: [
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" }),
  /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    import_framer_motion2.motion.g,
    {
      initial: false,
      animate: { opacity: visible ? 0 : 1 },
      transition: { duration: 0.15 },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("line", { x1: "4", y1: "20", x2: "20", y2: "4", stroke: "white", strokeWidth: "4", strokeLinecap: "round" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("line", { x1: "4", y1: "20", x2: "20", y2: "4", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
      ]
    }
  )
] });
var CopyMorphIcon = ({ size = 16, checked }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", children: [
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_framer_motion2.motion.path,
    {
      d: "M14.17,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V9.83c0-0.53-0.21-1.04-0.59-1.41l-4.83-4.83 C15.21,3.21,14.7,3,14.17,3L14.17,3z M8,15h8c0.55,0,1,0.45,1,1v0c0,0.55-0.45,1-1,1H8c-0.55,0-1-0.45-1-1v0C7,15.45,7.45,15,8,15z M8,11h8c0.55,0,1,0.45,1,1v0c0,0.55-0.45,1-1,1H8c-0.55,0-1-0.45-1-1v0C7,11.45,7.45,11,8,11z M8,7h5c0.55,0,1,0.45,1,1v0 c0,0.55-0.45,1-1,1H8C7.45,9,7,8.55,7,8v0C7,7.45,7.45,7,8,7z",
      initial: false,
      animate: { opacity: checked ? 0 : 1 },
      transition: { duration: 0.15 }
    }
  ),
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_framer_motion2.motion.path,
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
var TrashMorphIcon = ({ size = 16, checked }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", children: [
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_framer_motion2.motion.path,
    {
      d: "M17.65 6.35c-1.63-1.63-3.94-2.57-6.48-2.31-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20c3.19 0 5.93-1.87 7.21-4.56.32-.67-.16-1.44-.9-1.44-.37 0-.72.2-.88.53-1.13 2.43-3.84 3.97-6.8 3.31-2.22-.49-4.01-2.3-4.48-4.52C5.31 9.44 8.26 6 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z",
      initial: false,
      animate: { opacity: checked ? 0 : 1 },
      transition: { duration: 0.15 }
    }
  ),
  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_framer_motion2.motion.path,
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
var IconExternal = ({ size = 16 }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
  "path",
  {
    d: "M6 3h7v7M13 3L6 10",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }
) });
var IconChevronDown = ({ size = 16 }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
  "path",
  {
    d: "M4 6l4 4 4-4",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }
) });
var IconClose = ({ size = 16 }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M4 4l8 8M12 4l-8 8", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) });
var IconPlus = ({ size = 16 }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M8 3v10M3 8h10", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) });

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
var css2 = '.styles-module__toolbar___50aIA {\n  position: fixed;\n  bottom: 1.25rem;\n  right: 1.25rem;\n  z-index: 100000;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n}\n\n.styles-module__toggleButton___kgnvI {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 44px;\n  height: 44px;\n  border-radius: 22px;\n  border: none;\n  background: white;\n  color: rgba(0, 0, 0, 0.5);\n  cursor: pointer;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(0, 0, 0, 0.06);\n  transition: color 0.15s ease;\n}\n.styles-module__toggleButton___kgnvI:hover {\n  color: rgba(0, 0, 0, 0.8);\n}\n\n.styles-module__badge___WRMxo {\n  position: absolute;\n  top: -4px;\n  right: -4px;\n  min-width: 18px;\n  height: 18px;\n  padding: 0 5px;\n  border-radius: 9px;\n  background: #3c82f7;\n  color: white;\n  font-size: 0.625rem;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);\n}\n\n.styles-module__controls___2-kD- {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0.375rem;\n  border-radius: 1.5rem;\n  background: white;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(0, 0, 0, 0.06);\n}\n\n.styles-module__controlButton___RB3R5 {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  border: none;\n  background: transparent;\n  color: rgba(0, 0, 0, 0.5);\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.styles-module__controlButton___RB3R5:hover:not(:disabled) {\n  background: rgba(0, 0, 0, 0.06);\n  color: rgba(0, 0, 0, 0.75);\n}\n.styles-module__controlButton___RB3R5:active:not(:disabled) {\n  transform: scale(0.92);\n}\n.styles-module__controlButton___RB3R5:disabled {\n  opacity: 0.3;\n  cursor: not-allowed;\n}\n.styles-module__controlButton___RB3R5[data-active=true] {\n  color: #3c82f7;\n  background: rgba(60, 130, 247, 0.1);\n}\n.styles-module__controlButton___RB3R5[data-danger]:hover:not(:disabled) {\n  background: rgba(255, 59, 48, 0.1);\n  color: #ff3b30;\n}\n\n.styles-module__divider___yO3YX {\n  width: 1px;\n  height: 20px;\n  background: rgba(0, 0, 0, 0.1);\n  margin: 0 0.125rem;\n}\n\n.styles-module__overlay___pQK74 {\n  position: fixed;\n  inset: 0;\n  z-index: 99999;\n  pointer-events: none;\n}\n.styles-module__overlay___pQK74 > * {\n  pointer-events: auto;\n}\n\n.styles-module__hoverHighlight___iUTDq {\n  position: fixed;\n  border: 2px solid rgba(60, 130, 247, 0.6);\n  border-radius: 4px;\n  pointer-events: none !important;\n  background: rgba(60, 130, 247, 0.06);\n  box-sizing: border-box;\n  transform-origin: center center;\n}\n\n.styles-module__hoverTooltip___eOid- {\n  position: fixed;\n  font-size: 0.6875rem;\n  font-weight: 500;\n  color: #fff;\n  background: rgba(0, 0, 0, 0.85);\n  padding: 0.35rem 0.6rem;\n  border-radius: 0.375rem;\n  pointer-events: none !important;\n  white-space: nowrap;\n  max-width: 200px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.styles-module__markersLayer___RFGiE {\n  position: fixed;\n  inset: 0;\n  z-index: 99998;\n  pointer-events: none;\n}\n.styles-module__markersLayer___RFGiE > * {\n  pointer-events: auto;\n}\n\n.styles-module__marker___XNegd {\n  position: fixed;\n  width: 22px;\n  height: 22px;\n  background: #3c82f7;\n  color: white;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.6875rem;\n  font-weight: 600;\n  transform: translate(-50%, -50%);\n  cursor: pointer;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);\n  transition: background 0.15s ease;\n  user-select: none;\n}\n.styles-module__marker___XNegd.styles-module__pending___h4sf4 {\n  background: #3c82f7;\n}\n.styles-module__marker___XNegd.styles-module__hovered___WMoLv {\n  background: #ff3b30;\n}\n\n.styles-module__markerTooltip___pbJGs {\n  position: absolute;\n  top: calc(100% + 10px);\n  left: 50%;\n  transform: translateX(-50%);\n  background: white;\n  padding: 0.625rem 0.75rem;\n  border-radius: 0.5rem;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04);\n  min-width: 160px;\n  max-width: 280px;\n  pointer-events: none;\n  cursor: default;\n}\n\n.styles-module__markerQuote___bZuZt {\n  display: block;\n  font-size: 0.6875rem;\n  font-style: italic;\n  color: rgba(0, 0, 0, 0.5);\n  margin-bottom: 0.375rem;\n  line-height: 1.4;\n}\n\n.styles-module__markerNote___AvTvH {\n  display: block;\n  font-size: 0.75rem;\n  font-weight: 450;\n  line-height: 1.4;\n  color: #333;\n  white-space: normal;\n}\n\n.styles-module__markerHint___drxqW {\n  display: block;\n  font-size: 0.625rem;\n  font-weight: 400;\n  color: rgba(0, 0, 0, 0.3);\n  margin-top: 0.375rem;\n}';
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
var import_jsx_runtime3 = require("react/jsx-runtime");
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
  const [isActive, setIsActive] = (0, import_react2.useState)(false);
  const [annotations, setAnnotations] = (0, import_react2.useState)([]);
  const [showMarkers, setShowMarkers] = (0, import_react2.useState)(true);
  const [hoverInfo, setHoverInfo] = (0, import_react2.useState)(null);
  const [hoverPosition, setHoverPosition] = (0, import_react2.useState)({ x: 0, y: 0 });
  const [pendingAnnotation, setPendingAnnotation] = (0, import_react2.useState)(null);
  const [copied, setCopied] = (0, import_react2.useState)(false);
  const [cleared, setCleared] = (0, import_react2.useState)(false);
  const [hoveredMarkerId, setHoveredMarkerId] = (0, import_react2.useState)(null);
  const [scrollY, setScrollY] = (0, import_react2.useState)(0);
  const [mounted, setMounted] = (0, import_react2.useState)(false);
  const [isFrozen, setIsFrozen] = (0, import_react2.useState)(false);
  const popupRef = (0, import_react2.useRef)(null);
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  (0, import_react2.useEffect)(() => {
    setMounted(true);
    setScrollY(window.scrollY);
    const stored = loadAnnotations(pathname);
    setAnnotations(stored);
  }, [pathname]);
  (0, import_react2.useEffect)(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  (0, import_react2.useEffect)(() => {
    if (mounted && annotations.length > 0) {
      saveAnnotations(pathname, annotations);
    } else if (mounted && annotations.length === 0) {
      localStorage.removeItem(getStorageKey(pathname));
    }
  }, [annotations, pathname, mounted]);
  const freezeAnimations = (0, import_react2.useCallback)(() => {
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
  const unfreezeAnimations = (0, import_react2.useCallback)(() => {
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
  const toggleFreeze = (0, import_react2.useCallback)(() => {
    if (isFrozen) {
      unfreezeAnimations();
    } else {
      freezeAnimations();
    }
  }, [isFrozen, freezeAnimations, unfreezeAnimations]);
  (0, import_react2.useEffect)(() => {
    if (!isActive) {
      setPendingAnnotation(null);
      setHoverInfo(null);
      if (isFrozen) {
        unfreezeAnimations();
      }
    }
  }, [isActive, isFrozen, unfreezeAnimations]);
  (0, import_react2.useEffect)(() => {
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
  (0, import_react2.useEffect)(() => {
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
  const addAnnotation = (0, import_react2.useCallback)((comment) => {
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
  const cancelAnnotation = (0, import_react2.useCallback)(() => {
    setPendingAnnotation(null);
  }, []);
  const deleteAnnotation = (0, import_react2.useCallback)((id) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  }, []);
  const copyOutput = (0, import_react2.useCallback)(async () => {
    const output = generateOutput(annotations, pathname);
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  }, [annotations, pathname]);
  const clearAll = (0, import_react2.useCallback)(() => {
    setAnnotations([]);
    localStorage.removeItem(getStorageKey(pathname));
    setCleared(true);
    setTimeout(() => setCleared(false), 1500);
  }, [pathname]);
  (0, import_react2.useEffect)(() => {
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
  return (0, import_react_dom.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: styles_module_default2.toolbar, "data-feedback-toolbar": true, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_framer_motion3.AnimatePresence, { mode: "wait", initial: false, children: !isActive ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
        import_framer_motion3.motion.button,
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
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(IconFeedback, { size: 18 }),
            hasAnnotations && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: styles_module_default2.badge, children: annotations.length })
          ]
        },
        "toggle"
      ) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
        import_framer_motion3.motion.div,
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
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              import_framer_motion3.motion.button,
              {
                className: styles_module_default2.controlButton,
                onClick: (e) => {
                  e.stopPropagation();
                  toggleFreeze();
                },
                title: isFrozen ? "Resume animations" : "Pause animations",
                "data-active": isFrozen,
                whileTap: { scale: 0.95 },
                children: isFrozen ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(IconPlay, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(IconPause, { size: 16 })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              import_framer_motion3.motion.button,
              {
                className: styles_module_default2.controlButton,
                onClick: (e) => {
                  e.stopPropagation();
                  setShowMarkers(!showMarkers);
                },
                title: showMarkers ? "Hide markers" : "Show markers",
                whileTap: { scale: 0.95 },
                children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(EyeMorphIcon, { size: 16, visible: showMarkers })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              import_framer_motion3.motion.button,
              {
                className: styles_module_default2.controlButton,
                onClick: (e) => {
                  e.stopPropagation();
                  copyOutput();
                },
                disabled: !hasAnnotations,
                title: "Copy feedback",
                whileTap: { scale: 0.95 },
                children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CopyMorphIcon, { size: 16, checked: copied })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              import_framer_motion3.motion.button,
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
                children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(TrashMorphIcon, { size: 16, checked: cleared })
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: styles_module_default2.divider }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              import_framer_motion3.motion.button,
              {
                className: styles_module_default2.controlButton,
                onClick: (e) => {
                  e.stopPropagation();
                  setIsActive(false);
                },
                title: "Exit feedback mode",
                whileTap: { scale: 0.95 },
                children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(IconChevronDown, { size: 16 })
              }
            )
          ]
        },
        "controls"
      ) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: styles_module_default2.markersLayer, "data-feedback-toolbar": true, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_framer_motion3.AnimatePresence, { children: isActive && showMarkers && annotations.map((annotation, index) => {
        const viewportY = toViewportY(annotation.y);
        const isVisible = viewportY > -30 && viewportY < window.innerHeight + 30;
        if (!isVisible) return null;
        const isHovered = hoveredMarkerId === annotation.id;
        return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          import_framer_motion3.motion.div,
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
              isHovered ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(IconClose, { size: 10 }) : index + 1,
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_framer_motion3.AnimatePresence, { children: isHovered && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
                import_framer_motion3.motion.div,
                {
                  className: styles_module_default2.markerTooltip,
                  initial: { opacity: 0, y: 2, scale: 0.98 },
                  animate: { opacity: 1, y: 0, scale: 1 },
                  exit: { opacity: 0, y: 2, scale: 0.98 },
                  transition: { duration: 0.1, ease: "easeOut" },
                  children: [
                    annotation.selectedText && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("span", { className: styles_module_default2.markerQuote, children: [
                      "\u201C",
                      annotation.selectedText.slice(0, 50),
                      annotation.selectedText.length > 50 ? "..." : "",
                      "\u201D"
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: styles_module_default2.markerNote, children: annotation.comment }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: styles_module_default2.markerHint, children: "Click to remove" })
                  ]
                }
              ) })
            ]
          },
          annotation.id
        );
      }) }) }),
      isActive && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: styles_module_default2.overlay, "data-feedback-toolbar": true, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_framer_motion3.AnimatePresence, { children: hoverInfo?.rect && !pendingAnnotation && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          import_framer_motion3.motion.div,
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
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_framer_motion3.AnimatePresence, { children: hoverInfo && !pendingAnnotation && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          import_framer_motion3.motion.div,
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
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_framer_motion3.AnimatePresence, { children: pendingAnnotation && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            import_framer_motion3.motion.div,
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
              children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(IconPlus, { size: 12 })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
var import_react4 = require("react");
var import_react_dom2 = require("react-dom");

// src/components/annotation-popup/index-css.tsx
var import_react3 = require("react");
var import_jsx_runtime4 = require("react/jsx-runtime");
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
  0%, 100% { transform: translateX(-50%) translateX(0); }
  20% { transform: translateX(-50%) translateX(-3px); }
  40% { transform: translateX(-50%) translateX(3px); }
  60% { transform: translateX(-50%) translateX(-2px); }
  80% { transform: translateX(-50%) translateX(2px); }
}

.agentation-popup-animate-in {
  animation: agentation-popup-in 0.2s ease-out forwards;
}

.agentation-popup-shake {
  animation: agentation-popup-shake 0.25s ease-out;
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
var AnnotationPopupCSS = (0, import_react3.forwardRef)(
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
    const [text, setText] = (0, import_react3.useState)("");
    const [isShaking, setIsShaking] = (0, import_react3.useState)(false);
    const textareaRef = (0, import_react3.useRef)(null);
    const containerRef = (0, import_react3.useRef)(null);
    (0, import_react3.useEffect)(() => {
      const timer = setTimeout(() => textareaRef.current?.focus(), 10);
      return () => clearTimeout(timer);
    }, []);
    const shake = (0, import_react3.useCallback)(() => {
      setIsShaking(true);
    }, []);
    const handleAnimationEnd = (0, import_react3.useCallback)((e) => {
      if (e.animationName === "agentation-popup-shake") {
        setIsShaking(false);
        textareaRef.current?.focus();
      }
    }, []);
    (0, import_react3.useImperativeHandle)(ref, () => ({ shake }), [shake]);
    const handleSubmit = (0, import_react3.useCallback)(() => {
      if (!text.trim()) return;
      onSubmit(text.trim());
    }, [text, onSubmit]);
    const handleKeyDown = (0, import_react3.useCallback)(
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
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
      "div",
      {
        ref: containerRef,
        className: `${styles_module_default.popup} agentation-popup-animate-in ${isShaking ? "agentation-popup-shake" : ""}`,
        "data-annotation-popup": true,
        style,
        onClick: (e) => e.stopPropagation(),
        onAnimationEnd: handleAnimationEnd,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: styles_module_default.header, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: styles_module_default.element, children: element }),
            timestamp && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: styles_module_default.timestamp, children: timestamp })
          ] }),
          selectedText && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: styles_module_default.quote, children: [
            "\u201C",
            selectedText.slice(0, 80),
            selectedText.length > 80 ? "..." : "",
            "\u201D"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: styles_module_default.actions, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: styles_module_default.cancel, onClick: onCancel, children: "Cancel" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
var import_jsx_runtime5 = require("react/jsx-runtime");
var IconFeedback2 = ({ size = 18 }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", children: [
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M12,4c4.97,0,8.9,4.56,7.82,9.72c-0.68,3.23-3.4,5.74-6.67,6.2c-1.59,0.22-3.14-0.01-4.58-0.7 c-0.27-0.13-0.56-0.19-0.86-0.19c-0.19,0-0.38,0.03-0.56,0.08l-2.31,0.68c-0.38,0.11-0.74-0.24-0.63-0.63l0.7-2.39 c0.13-0.45,0.07-0.92-0.14-1.35C4.26,14.34,4,13.18,4,12C4,7.59,7.59,4,12,4 M12,2C6.48,2,2,6.48,2,12c0,1.54,0.36,2.98,0.97,4.29 l-1.46,4.96C1.29,22,2,22.71,2.76,22.48l4.96-1.46c1.66,0.79,3.56,1.15,5.58,0.89c4.56-0.59,8.21-4.35,8.66-8.92 C22.53,7.03,17.85,2,12,2L12,2z" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M12,8L12,8c-0.55,0-1,0.45-1,1v2H9c-0.55,0-1,0.45-1,1v0c0,0.55,0.45,1,1,1h2v2 c0,0.55,0.45,1,1,1h0c0.55,0,1-0.45,1-1v-2h2c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1h-2V9C13,8.45,12.55,8,12,8z", fillRule: "evenodd" })
] });
var IconPlay2 = ({ size = 16 }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
  "path",
  {
    d: "M5 3.5v9l7-4.5-7-4.5z",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round"
  }
) });
var IconPause2 = ({ size = 16 }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M5.5 4v8M10.5 4v8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) });
var EyeMorphIcon2 = ({ size = 16, visible }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", children: [
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" }),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("g", { style: { opacity: visible ? 0 : 1, transition: "opacity 0.15s ease" }, children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "4", y1: "20", x2: "20", y2: "4", stroke: "white", strokeWidth: "4", strokeLinecap: "round" }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("line", { x1: "4", y1: "20", x2: "20", y2: "4", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
  ] })
] });
var CopyMorphIcon2 = ({ size = 16, checked }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", children: [
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    "path",
    {
      d: "M14.17,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V9.83c0-0.53-0.21-1.04-0.59-1.41l-4.83-4.83 C15.21,3.21,14.7,3,14.17,3L14.17,3z M8,15h8c0.55,0,1,0.45,1,1v0c0,0.55-0.45,1-1,1H8c-0.55,0-1-0.45-1-1v0C7,15.45,7.45,15,8,15z M8,11h8c0.55,0,1,0.45,1,1v0c0,0.55-0.45,1-1,1H8c-0.55,0-1-0.45-1-1v0C7,11.45,7.45,11,8,11z M8,7h5c0.55,0,1,0.45,1,1v0 c0,0.55-0.45,1-1,1H8C7.45,9,7,8.55,7,8v0C7,7.45,7.45,7,8,7z",
      style: { opacity: checked ? 0 : 1, transition: "opacity 0.15s ease" }
    }
  ),
  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
var TrashMorphIcon2 = ({ size = 16, checked }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
    children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M17.65 6.35c-1.63-1.63-3.94-2.57-6.48-2.31-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20c3.19 0 5.93-1.87 7.21-4.56.32-.67-.16-1.44-.9-1.44-.37 0-.72.2-.88.53-1.13 2.43-3.84 3.97-6.8 3.31-2.22-.49-4.01-2.3-4.48-4.52C5.31 9.44 8.26 6 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z" })
  }
);
var IconExternal2 = ({ size = 16 }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
  "path",
  {
    d: "M6 3h7v7M13 3L6 10",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }
) });
var IconChevronDown2 = ({ size = 16 }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
  "path",
  {
    d: "M4 6l4 4 4-4",
    stroke: "currentColor",
    strokeWidth: "1.75",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }
) });
var IconClose2 = ({ size = 16 }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M4 4l8 8M12 4l-8 8", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) });
var IconPlus2 = ({ size = 16 }) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("path", { d: "M8 3v10M3 8h10", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round" }) });

// src/components/page-toolbar/index-css.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var cssAnimationStyles2 = `
/* Toolbar morphing */
.agentation-toolbar-container {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.3125rem;
  border-radius: 1.5rem;
  background: white;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.08),
    0 4px 16px rgba(0, 0, 0, 0.04),
    inset 0 0 0 1px rgba(0, 0, 0, 0.06);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.agentation-toolbar-container[data-expanded="false"] {
  padding: 0;
}

/* Control buttons fade in/out */
.agentation-control-btn {
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.agentation-toolbar-container[data-expanded="true"] .agentation-control-btn {
  opacity: 1;
  transform: scale(1);
}

.agentation-toolbar-container[data-expanded="true"] .agentation-control-btn:nth-child(1) { transition-delay: 0.02s; }
.agentation-toolbar-container[data-expanded="true"] .agentation-control-btn:nth-child(2) { transition-delay: 0.04s; }
.agentation-toolbar-container[data-expanded="true"] .agentation-control-btn:nth-child(3) { transition-delay: 0.06s; }
.agentation-toolbar-container[data-expanded="true"] .agentation-control-btn:nth-child(4) { transition-delay: 0.08s; }
.agentation-toolbar-container[data-expanded="true"] .agentation-control-btn:nth-child(5) { transition-delay: 0.1s; }
.agentation-toolbar-container[data-expanded="true"] .agentation-control-btn:nth-child(6) { transition-delay: 0.12s; }

/* Main button */
.agentation-main-btn {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.agentation-toolbar-container[data-expanded="true"] .agentation-main-btn {
  transform: scale(0);
  width: 0;
  padding: 0;
  margin: 0;
  opacity: 0;
}

/* Hover highlight - more noticeable animation */
@keyframes agentation-highlight-in {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.agentation-highlight-animate {
  animation: agentation-highlight-in 0.15s ease-out forwards;
  transform-origin: center center;
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
  from { opacity: 0; transform: translateX(-50%) translateY(4px) scale(0.95); }
  to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
}

.agentation-tooltip-animate {
  animation: agentation-tooltip-in 0.1s ease-out forwards;
}

/* Hover tooltip fade */
@keyframes agentation-hover-tooltip-in {
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}

.agentation-hover-tooltip-animate {
  animation: agentation-hover-tooltip-in 0.1s ease-out forwards;
}

/* Button active state */
.agentation-btn-active:active {
  transform: scale(0.95);
}

/* Divider */
.agentation-divider {
  opacity: 0;
  transition: opacity 0.15s ease;
}

.agentation-toolbar-container[data-expanded="true"] .agentation-divider {
  opacity: 1;
  transition-delay: 0.1s;
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
function generateOutput2(annotations, pathname) {
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
function PageFeedbackToolbarCSS() {
  const [isActive, setIsActive] = (0, import_react4.useState)(false);
  const [annotations, setAnnotations] = (0, import_react4.useState)([]);
  const [markersWithState, setMarkersWithState] = (0, import_react4.useState)([]);
  const [showMarkers, setShowMarkers] = (0, import_react4.useState)(true);
  const [hoverInfo, setHoverInfo] = (0, import_react4.useState)(null);
  const [hoverPosition, setHoverPosition] = (0, import_react4.useState)({ x: 0, y: 0 });
  const [pendingAnnotation, setPendingAnnotation] = (0, import_react4.useState)(null);
  const [pendingExiting, setPendingExiting] = (0, import_react4.useState)(false);
  const [copied, setCopied] = (0, import_react4.useState)(false);
  const [cleared, setCleared] = (0, import_react4.useState)(false);
  const [hoveredMarkerId, setHoveredMarkerId] = (0, import_react4.useState)(null);
  const [scrollY, setScrollY] = (0, import_react4.useState)(0);
  const [mounted, setMounted] = (0, import_react4.useState)(false);
  const [isFrozen, setIsFrozen] = (0, import_react4.useState)(false);
  const [markersExiting, setMarkersExiting] = (0, import_react4.useState)(false);
  const popupRef = (0, import_react4.useRef)(null);
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  (0, import_react4.useEffect)(() => {
    setMarkersWithState(annotations.map((a) => ({ ...a, exiting: false })));
  }, [annotations]);
  (0, import_react4.useEffect)(() => {
    setMounted(true);
    setScrollY(window.scrollY);
    const stored = loadAnnotations(pathname);
    setAnnotations(stored);
  }, [pathname]);
  (0, import_react4.useEffect)(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  (0, import_react4.useEffect)(() => {
    if (mounted && annotations.length > 0) {
      saveAnnotations(pathname, annotations);
    } else if (mounted && annotations.length === 0) {
      localStorage.removeItem(getStorageKey(pathname));
    }
  }, [annotations, pathname, mounted]);
  const freezeAnimations = (0, import_react4.useCallback)(() => {
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
  const unfreezeAnimations = (0, import_react4.useCallback)(() => {
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
  const toggleFreeze = (0, import_react4.useCallback)(() => {
    if (isFrozen) unfreezeAnimations();
    else freezeAnimations();
  }, [isFrozen, freezeAnimations, unfreezeAnimations]);
  const handleCloseToolbar = (0, import_react4.useCallback)(() => {
    if (markersWithState.length > 0) {
      setMarkersExiting(true);
      setTimeout(() => {
        setMarkersExiting(false);
        setIsActive(false);
      }, 150);
    } else {
      setIsActive(false);
    }
  }, [markersWithState.length]);
  (0, import_react4.useEffect)(() => {
    if (!isActive) {
      setPendingAnnotation(null);
      setHoverInfo(null);
      if (isFrozen) unfreezeAnimations();
    }
  }, [isActive, isFrozen, unfreezeAnimations]);
  (0, import_react4.useEffect)(() => {
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
  (0, import_react4.useEffect)(() => {
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
  const addAnnotation = (0, import_react4.useCallback)((comment) => {
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
  const cancelAnnotation = (0, import_react4.useCallback)(() => {
    setPendingExiting(true);
    setTimeout(() => {
      setPendingExiting(false);
      setPendingAnnotation(null);
    }, 150);
  }, []);
  const deleteAnnotation = (0, import_react4.useCallback)((id) => {
    setMarkersWithState(
      (prev) => prev.map((m) => m.id === id ? { ...m, exiting: true } : m)
    );
    setTimeout(() => {
      setAnnotations((prev) => prev.filter((a) => a.id !== id));
    }, 150);
  }, []);
  const copyOutput = (0, import_react4.useCallback)(async () => {
    const output = generateOutput2(annotations, pathname);
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  }, [annotations, pathname]);
  const clearAll = (0, import_react4.useCallback)(() => {
    setAnnotations([]);
    localStorage.removeItem(getStorageKey(pathname));
    setCleared(true);
    setTimeout(() => setCleared(false), 1500);
  }, [pathname]);
  (0, import_react4.useEffect)(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (pendingAnnotation) {
        } else if (isActive) {
          handleCloseToolbar();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, pendingAnnotation, handleCloseToolbar]);
  if (!mounted) return null;
  const hasAnnotations = annotations.length > 0;
  const toViewportY = (absoluteY) => absoluteY - scrollY;
  return (0, import_react_dom2.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: styles_module_default2.toolbar, "data-feedback-toolbar": true, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
        "div",
        {
          className: "agentation-toolbar-container",
          "data-expanded": isActive,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
              "button",
              {
                className: `${styles_module_default2.toggleButton} agentation-main-btn`,
                onClick: (e) => {
                  e.stopPropagation();
                  setIsActive(true);
                },
                title: "Start feedback mode",
                style: { display: isActive ? "none" : "flex" },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(IconFeedback2, { size: 18 }),
                  hasAnnotations && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: styles_module_default2.badge, children: annotations.length })
                ]
              }
            ),
            isActive && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                "button",
                {
                  className: `${styles_module_default2.controlButton} agentation-control-btn agentation-btn-active`,
                  onClick: (e) => {
                    e.stopPropagation();
                    toggleFreeze();
                  },
                  title: isFrozen ? "Resume animations" : "Pause animations",
                  "data-active": isFrozen,
                  children: isFrozen ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(IconPlay2, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(IconPause2, { size: 16 })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                "button",
                {
                  className: `${styles_module_default2.controlButton} agentation-control-btn agentation-btn-active`,
                  onClick: (e) => {
                    e.stopPropagation();
                    setShowMarkers(!showMarkers);
                  },
                  title: showMarkers ? "Hide markers" : "Show markers",
                  children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(EyeMorphIcon2, { size: 16, visible: showMarkers })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                "button",
                {
                  className: `${styles_module_default2.controlButton} agentation-control-btn agentation-btn-active`,
                  onClick: (e) => {
                    e.stopPropagation();
                    copyOutput();
                  },
                  disabled: !hasAnnotations,
                  title: "Copy feedback",
                  children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(CopyMorphIcon2, { size: 16, checked: copied })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                "button",
                {
                  className: `${styles_module_default2.controlButton} agentation-control-btn agentation-btn-active`,
                  onClick: (e) => {
                    e.stopPropagation();
                    clearAll();
                  },
                  disabled: !hasAnnotations,
                  title: "Clear all",
                  "data-danger": true,
                  children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(TrashMorphIcon2, { size: 16, checked: cleared })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: `${styles_module_default2.divider} agentation-divider` }),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                "button",
                {
                  className: `${styles_module_default2.controlButton} agentation-control-btn agentation-btn-active`,
                  onClick: (e) => {
                    e.stopPropagation();
                    handleCloseToolbar();
                  },
                  title: "Exit feedback mode",
                  children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(IconChevronDown2, { size: 16 })
                }
              )
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: styles_module_default2.markersLayer, "data-feedback-toolbar": true, children: isActive && showMarkers && markersWithState.map((annotation, index) => {
        const viewportY = toViewportY(annotation.y);
        const isVisible = viewportY > -30 && viewportY < window.innerHeight + 30;
        if (!isVisible) return null;
        const isHovered = hoveredMarkerId === annotation.id;
        const isExiting = annotation.exiting || markersExiting;
        return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
          "div",
          {
            className: `${styles_module_default2.marker} ${isHovered ? styles_module_default2.hovered : ""} ${isExiting ? "agentation-marker-exit" : "agentation-marker-enter"}`,
            "data-annotation-marker": true,
            style: {
              left: `${annotation.x}%`,
              top: viewportY,
              animationDelay: isExiting ? "0s" : `${index * 0.03}s`
            },
            onMouseEnter: () => !isExiting && setHoveredMarkerId(annotation.id),
            onMouseLeave: () => setHoveredMarkerId(null),
            onClick: (e) => {
              e.stopPropagation();
              if (!isExiting) deleteAnnotation(annotation.id);
            },
            children: [
              isHovered ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(IconClose2, { size: 10 }) : index + 1,
              isHovered && !isExiting && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: `${styles_module_default2.markerTooltip} agentation-tooltip-animate`, children: [
                annotation.selectedText && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("span", { className: styles_module_default2.markerQuote, children: [
                  "\u201C",
                  annotation.selectedText.slice(0, 50),
                  annotation.selectedText.length > 50 ? "..." : "",
                  "\u201D"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: styles_module_default2.markerNote, children: annotation.comment }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: styles_module_default2.markerHint, children: "Click to remove" })
              ] })
            ]
          },
          annotation.id
        );
      }) }),
      isActive && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: styles_module_default2.overlay, "data-feedback-toolbar": true, children: [
        hoverInfo?.rect && !pendingAnnotation && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
        hoverInfo && !pendingAnnotation && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
        (pendingAnnotation || pendingExiting) && /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            "div",
            {
              className: `${styles_module_default2.marker} ${styles_module_default2.pending} ${pendingExiting ? "agentation-pending-exit" : "agentation-pending-enter"}`,
              style: {
                left: `${pendingAnnotation?.x ?? 0}%`,
                top: pendingAnnotation?.clientY ?? 0
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(IconPlus2, { size: 12 })
            }
          ),
          pendingAnnotation && !pendingExiting && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Agentation,
  AgentationCSS,
  AnnotationPopup,
  AnnotationPopupCSS,
  AnnotationPopupPresence,
  CopyMorphIcon,
  EyeMorphIcon,
  FeedbackToolbar,
  IconChevronDown,
  IconClose,
  IconExternal,
  IconFeedback,
  IconPause,
  IconPlay,
  IconPlus,
  IconsCSS,
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
});
//# sourceMappingURL=index.cjs.map