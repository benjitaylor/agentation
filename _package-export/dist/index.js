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
  IconCheck: () => IconCheck,
  IconChevronDown: () => IconChevronDown,
  IconClose: () => IconClose,
  IconDocument: () => IconDocument,
  IconExternal: () => IconExternal,
  IconFeedback: () => IconFeedback,
  IconPalette: () => IconPalette,
  IconPause: () => IconPause,
  IconPlay: () => IconPlay,
  IconPlus: () => IconPlus,
  IconSettings: () => IconSettings,
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
var css = '.styles-module__popup___MBQDV {\n  position: fixed;\n  transform: translateX(-50%);\n  width: 280px;\n  padding: 0.75rem;\n  background: white;\n  border-radius: 0.75rem;\n  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.04);\n  cursor: default;\n  z-index: 100;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n}\n\n.styles-module__header___1q-wa {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 0.5rem;\n}\n\n.styles-module__element___tPxVO {\n  font-size: 0.75rem;\n  font-weight: 500;\n  color: rgba(0, 0, 0, 0.65);\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  flex: 1;\n}\n\n.styles-module__timestamp___t7PEZ {\n  font-size: 0.625rem;\n  font-weight: 500;\n  color: rgba(0, 0, 0, 0.35);\n  font-variant-numeric: tabular-nums;\n  margin-left: 0.5rem;\n  flex-shrink: 0;\n}\n\n.styles-module__quote___uFJyr {\n  font-size: 0.6875rem;\n  font-style: italic;\n  color: rgba(0, 0, 0, 0.5);\n  margin-bottom: 0.5rem;\n  padding: 0.4rem 0.5rem;\n  background: rgba(0, 0, 0, 0.03);\n  border-radius: 0.25rem;\n  line-height: 1.45;\n}\n\n.styles-module__textarea___Pw6C4 {\n  width: 100%;\n  padding: 0.5rem 0.625rem;\n  font-size: 0.8125rem;\n  font-family: inherit;\n  border: 1px solid rgba(0, 0, 0, 0.12);\n  border-radius: 0.375rem;\n  resize: none;\n  outline: none;\n  transition: border-color 0.15s ease;\n}\n.styles-module__textarea___Pw6C4:focus {\n  border-color: #3c82f7;\n}\n.styles-module__textarea___Pw6C4.styles-module__green___zdmke:focus {\n  border-color: #34C759;\n}\n.styles-module__textarea___Pw6C4::placeholder {\n  color: rgba(0, 0, 0, 0.35);\n}\n\n.styles-module__actions___bxQCu {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.375rem;\n  margin-top: 0.5rem;\n}\n\n.styles-module__cancel___-xAEc,\n.styles-module__submit___nnXO9 {\n  padding: 0.4rem 0.875rem;\n  font-size: 0.75rem;\n  font-weight: 500;\n  border-radius: 1rem;\n  border: none;\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n\n.styles-module__cancel___-xAEc {\n  background: transparent;\n  color: rgba(0, 0, 0, 0.5);\n}\n.styles-module__cancel___-xAEc:hover {\n  background: rgba(0, 0, 0, 0.05);\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.styles-module__submit___nnXO9 {\n  background: #3c82f7;\n  color: white;\n}\n.styles-module__submit___nnXO9:hover:not(:disabled) {\n  background: #2d6fdf;\n}\n.styles-module__submit___nnXO9:disabled {\n  opacity: 0.4;\n  cursor: not-allowed;\n}\n.styles-module__submit___nnXO9.styles-module__green___zdmke {\n  background: #34C759;\n}\n.styles-module__submit___nnXO9.styles-module__green___zdmke:hover:not(:disabled) {\n  background: #2db84d;\n}';
var classNames = { "popup": "styles-module__popup___MBQDV", "header": "styles-module__header___1q-wa", "element": "styles-module__element___tPxVO", "timestamp": "styles-module__timestamp___t7PEZ", "quote": "styles-module__quote___uFJyr", "textarea": "styles-module__textarea___Pw6C4", "green": "styles-module__green___zdmke", "actions": "styles-module__actions___bxQCu", "cancel": "styles-module__cancel___-xAEc", "submit": "styles-module__submit___nnXO9" };
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
              className: `${styles_module_default.textarea} ${variant === "green" ? styles_module_default.green : ""}`,
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
var IconSettings = ({ size = 16 }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" }) });
var IconDocument = ({ size = 16 }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M14.17 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9.83c0-.53-.21-1.04-.59-1.41l-4.83-4.83c-.37-.38-.88-.59-1.41-.59zM8 15h8c.55 0 1 .45 1 1s-.45 1-1 1H8c-.55 0-1-.45-1-1s.45-1 1-1zm0-4h8c.55 0 1 .45 1 1s-.45 1-1 1H8c-.55 0-1-.45-1-1s.45-1 1-1zm0-4h5c.55 0 1 .45 1 1s-.45 1-1 1H8c-.55 0-1-.45-1-1s.45-1 1-1z" }) });
var IconCheck = ({ size = 16 }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M3 8l3.5 3.5L13 5", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) });
var IconPalette = ({ size = 16 }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.2-.64-1.67-.08-.1-.13-.21-.13-.33 0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" }) });

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
    if (text) return { name: `paragraph: "${text.slice(0, 40)}${text.length > 40 ? "..." : ""}"`, path };
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
var css2 = '.styles-module__toolbar___50aIA {\n  position: fixed;\n  bottom: 1.25rem;\n  right: 1.25rem;\n  z-index: 100000;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n}\n\n.styles-module__toggleButton___kgnvI {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 44px;\n  height: 44px;\n  border-radius: 22px;\n  border: none;\n  background: #1a1a1a;\n  color: #fff;\n  cursor: pointer;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1);\n  transition: all 0.15s ease;\n}\n.styles-module__toggleButton___kgnvI svg {\n  margin-top: -1px;\n}\n.styles-module__toggleButton___kgnvI:hover {\n  background: #2a2a2a;\n}\n\n.styles-module__badge___WRMxo {\n  position: absolute;\n  top: -4px;\n  right: -4px;\n  min-width: 18px;\n  height: 18px;\n  padding: 0 5px;\n  border-radius: 9px;\n  background: #3c82f7;\n  color: white;\n  font-size: 0.625rem;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);\n}\n\n.styles-module__controls___2-kD- {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0.375rem;\n  border-radius: 1.5rem;\n  background: #1a1a1a;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1);\n}\n\n.styles-module__controlButton___RB3R5 {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  border: none;\n  background: transparent;\n  color: rgba(255, 255, 255, 0.85);\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.styles-module__controlButton___RB3R5:hover:not(:disabled) {\n  background: rgba(255, 255, 255, 0.12);\n  color: #fff;\n}\n.styles-module__controlButton___RB3R5:active:not(:disabled) {\n  transform: scale(0.92);\n}\n.styles-module__controlButton___RB3R5:disabled {\n  opacity: 0.35;\n  cursor: not-allowed;\n}\n.styles-module__controlButton___RB3R5[data-active=true] {\n  color: #3c82f7;\n  background: rgba(60, 130, 247, 0.25);\n}\n.styles-module__controlButton___RB3R5[data-danger]:hover:not(:disabled) {\n  background: rgba(255, 59, 48, 0.25);\n  color: #ff3b30;\n}\n\n.styles-module__divider___yO3YX {\n  width: 1px;\n  height: 20px;\n  background: rgba(255, 255, 255, 0.15);\n  margin: 0 0.125rem;\n}\n\n.styles-module__overlay___pQK74 {\n  position: fixed;\n  inset: 0;\n  z-index: 99999;\n  pointer-events: none;\n}\n.styles-module__overlay___pQK74 > * {\n  pointer-events: auto;\n}\n\n.styles-module__hoverHighlight___iUTDq {\n  position: fixed;\n  border: 2px solid rgba(60, 130, 247, 0.5);\n  border-radius: 4px;\n  pointer-events: none !important;\n  background: rgba(60, 130, 247, 0.04);\n  box-sizing: border-box;\n  will-change: opacity;\n  contain: layout style;\n}\n\n.styles-module__hoverTooltip___eOid- {\n  position: fixed;\n  font-size: 0.6875rem;\n  font-weight: 500;\n  color: #fff;\n  background: rgba(0, 0, 0, 0.85);\n  padding: 0.35rem 0.6rem;\n  border-radius: 0.375rem;\n  pointer-events: none !important;\n  white-space: nowrap;\n  max-width: 200px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.styles-module__markersLayer___RFGiE {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 0;\n  z-index: 99998;\n  pointer-events: none;\n}\n.styles-module__markersLayer___RFGiE > * {\n  pointer-events: auto;\n}\n\n.styles-module__fixedMarkersLayer___4Bv-J {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 99998;\n  pointer-events: none;\n}\n.styles-module__fixedMarkersLayer___4Bv-J > * {\n  pointer-events: auto;\n}\n\n.styles-module__marker___XNegd {\n  position: absolute;\n  width: 22px;\n  height: 22px;\n  background: #3c82f7;\n  color: white;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.6875rem;\n  font-weight: 600;\n  transform: translate(-50%, -50%);\n  cursor: pointer;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);\n  transition: background 0.15s ease;\n  user-select: none;\n  will-change: transform;\n  contain: layout style;\n}\n.styles-module__marker___XNegd.styles-module__pending___h4sf4 {\n  position: fixed;\n  background: #3c82f7;\n}\n.styles-module__marker___XNegd.styles-module__fixed___mfaV2 {\n  position: fixed;\n}\n.styles-module__marker___XNegd.styles-module__multiSelect___IK0bi {\n  background: #34C759;\n  width: 26px;\n  height: 26px;\n  border-radius: 6px;\n  font-size: 0.75rem;\n}\n.styles-module__marker___XNegd.styles-module__multiSelect___IK0bi.styles-module__pending___h4sf4 {\n  background: #34C759;\n}\n.styles-module__marker___XNegd.styles-module__hovered___WMoLv {\n  background: #ff3b30;\n}\n\n.styles-module__markerTooltip___pbJGs {\n  position: absolute;\n  top: calc(100% + 10px);\n  left: 50%;\n  transform: translateX(-50%);\n  background: white;\n  padding: 0.625rem 0.75rem;\n  border-radius: 0.5rem;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04);\n  min-width: 160px;\n  max-width: 280px;\n  pointer-events: none;\n  cursor: default;\n}\n\n.styles-module__markerQuote___bZuZt {\n  display: block;\n  font-size: 0.6875rem;\n  font-style: italic;\n  color: rgba(0, 0, 0, 0.5);\n  margin-bottom: 0.375rem;\n  line-height: 1.4;\n}\n\n.styles-module__markerNote___AvTvH {\n  display: block;\n  font-size: 0.75rem;\n  font-weight: 450;\n  line-height: 1.4;\n  color: #333;\n  white-space: normal;\n}\n\n.styles-module__markerHint___drxqW {\n  display: block;\n  font-size: 0.625rem;\n  font-weight: 400;\n  color: rgba(0, 0, 0, 0.3);\n  margin-top: 0.375rem;\n}\n\n.styles-module__settingsPanel___qY0pP {\n  position: absolute;\n  bottom: calc(100% + 0.5rem);\n  right: 0;\n  background: white;\n  border-radius: 0.75rem;\n  padding: 0.75rem;\n  min-width: 200px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04);\n}\n.styles-module__settingsPanel___qY0pP.styles-module__dark___GFqHo {\n  background: #2a2a2a;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);\n}\n.styles-module__settingsPanel___qY0pP.styles-module__dark___GFqHo .styles-module__settingsLabel___Sdxcc {\n  color: rgba(255, 255, 255, 0.6);\n}\n.styles-module__settingsPanel___qY0pP.styles-module__dark___GFqHo .styles-module__settingsOption___1F8GJ {\n  color: rgba(255, 255, 255, 0.85);\n}\n.styles-module__settingsPanel___qY0pP.styles-module__dark___GFqHo .styles-module__settingsOption___1F8GJ:hover {\n  background: rgba(255, 255, 255, 0.1);\n}\n.styles-module__settingsPanel___qY0pP.styles-module__dark___GFqHo .styles-module__settingsOption___1F8GJ.styles-module__selected___qgKlT {\n  background: rgba(60, 130, 247, 0.25);\n  color: rgb(133.4852216749, 177.10591133, 250.0147783251);\n}\n.styles-module__settingsPanel___qY0pP.styles-module__dark___GFqHo .styles-module__toggleLabel___sxWtY {\n  color: rgba(255, 255, 255, 0.85);\n}\n\n.styles-module__settingsSection___i0wns + .styles-module__settingsSection___i0wns {\n  margin-top: 0.75rem;\n  padding-top: 0.75rem;\n  border-top: 1px solid rgba(0, 0, 0, 0.06);\n}\n.styles-module__dark___GFqHo .styles-module__settingsSection___i0wns + .styles-module__settingsSection___i0wns {\n  border-top-color: rgba(255, 255, 255, 0.08);\n}\n\n.styles-module__settingsLabel___Sdxcc {\n  font-size: 0.625rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  color: rgba(0, 0, 0, 0.4);\n  margin-bottom: 0.5rem;\n}\n\n.styles-module__settingsOptions___wp8vq {\n  display: flex;\n  gap: 0.25rem;\n}\n\n.styles-module__settingsOption___1F8GJ {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.25rem;\n  padding: 0.375rem 0.5rem;\n  border: none;\n  border-radius: 0.375rem;\n  background: transparent;\n  font-size: 0.6875rem;\n  font-weight: 500;\n  color: rgba(0, 0, 0, 0.7);\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.styles-module__settingsOption___1F8GJ:hover {\n  background: rgba(0, 0, 0, 0.05);\n}\n.styles-module__settingsOption___1F8GJ.styles-module__selected___qgKlT {\n  background: rgba(60, 130, 247, 0.15);\n  color: #3c82f7;\n}\n\n.styles-module__colorOptions___WQysv {\n  display: flex;\n  gap: 0.375rem;\n}\n\n.styles-module__colorOption___z3mCT {\n  width: 24px;\n  height: 24px;\n  border-radius: 50%;\n  border: 2px solid transparent;\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.styles-module__colorOption___z3mCT:hover {\n  transform: scale(1.1);\n}\n.styles-module__colorOption___z3mCT.styles-module__selected___qgKlT {\n  border-color: white;\n  box-shadow: 0 0 0 2px currentColor;\n}\n\n.styles-module__settingsToggle___OMQlh {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  cursor: pointer;\n}\n.styles-module__settingsToggle___OMQlh input[type=checkbox] {\n  width: 16px;\n  height: 16px;\n  accent-color: #3c82f7;\n  cursor: pointer;\n}\n\n.styles-module__toggleLabel___sxWtY {\n  font-size: 0.75rem;\n  font-weight: 450;\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.styles-module__dragSelection___dI3UK {\n  position: fixed;\n  border: 2px dashed #34C759;\n  border-radius: 4px;\n  background: rgba(52, 199, 89, 0.08);\n  pointer-events: none;\n  z-index: 99997;\n}\n\n.styles-module__dragCount___u2zGa {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background: #34C759;\n  color: white;\n  font-size: 0.875rem;\n  font-weight: 600;\n  padding: 0.25rem 0.5rem;\n  border-radius: 1rem;\n  min-width: 1.5rem;\n  text-align: center;\n}\n\n.styles-module__selectedElementHighlight___3FYSC {\n  position: fixed;\n  border: 2px solid rgba(52, 199, 89, 0.6);\n  border-radius: 4px;\n  background: rgba(52, 199, 89, 0.08);\n  pointer-events: none;\n  z-index: 99996;\n}';
var classNames2 = { "toolbar": "styles-module__toolbar___50aIA", "toggleButton": "styles-module__toggleButton___kgnvI", "badge": "styles-module__badge___WRMxo", "controls": "styles-module__controls___2-kD-", "controlButton": "styles-module__controlButton___RB3R5", "divider": "styles-module__divider___yO3YX", "overlay": "styles-module__overlay___pQK74", "hoverHighlight": "styles-module__hoverHighlight___iUTDq", "hoverTooltip": "styles-module__hoverTooltip___eOid-", "markersLayer": "styles-module__markersLayer___RFGiE", "fixedMarkersLayer": "styles-module__fixedMarkersLayer___4Bv-J", "marker": "styles-module__marker___XNegd", "pending": "styles-module__pending___h4sf4", "fixed": "styles-module__fixed___mfaV2", "multiSelect": "styles-module__multiSelect___IK0bi", "hovered": "styles-module__hovered___WMoLv", "markerTooltip": "styles-module__markerTooltip___pbJGs", "markerQuote": "styles-module__markerQuote___bZuZt", "markerNote": "styles-module__markerNote___AvTvH", "markerHint": "styles-module__markerHint___drxqW", "settingsPanel": "styles-module__settingsPanel___qY0pP", "dark": "styles-module__dark___GFqHo", "settingsLabel": "styles-module__settingsLabel___Sdxcc", "settingsOption": "styles-module__settingsOption___1F8GJ", "selected": "styles-module__selected___qgKlT", "toggleLabel": "styles-module__toggleLabel___sxWtY", "settingsSection": "styles-module__settingsSection___i0wns", "settingsOptions": "styles-module__settingsOptions___wp8vq", "colorOptions": "styles-module__colorOptions___WQysv", "colorOption": "styles-module__colorOption___z3mCT", "settingsToggle": "styles-module__settingsToggle___OMQlh", "dragSelection": "styles-module__dragSelection___dI3UK", "dragCount": "styles-module__dragCount___u2zGa", "selectedElementHighlight": "styles-module__selectedElementHighlight___3FYSC" };
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
var DEFAULT_SETTINGS = {
  outputDetail: "standard",
  autoClearAfterCopy: false,
  annotationColor: "#3c82f7",
  blockInteractions: false
};
var OUTPUT_DETAIL_OPTIONS = [
  { value: "compact", label: "Compact", description: "Minimal output" },
  { value: "standard", label: "Standard", description: "Balanced detail" },
  { value: "detailed", label: "Detailed", description: "Full context" }
];
var COLOR_OPTIONS = [
  { value: "#3c82f7", label: "Blue" },
  { value: "#34C759", label: "Green" },
  { value: "#FF9500", label: "Orange" },
  { value: "#AF52DE", label: "Purple" },
  { value: "#FF2D55", label: "Pink" }
];
function isElementFixed(element) {
  let current = element;
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const position = style.position;
    if (position === "fixed" || position === "sticky") {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}
function generateOutput(annotations, pathname, detailLevel = "standard") {
  if (annotations.length === 0) return "";
  const viewport = typeof window !== "undefined" ? `${window.innerWidth}\xD7${window.innerHeight}` : "unknown";
  let output = `## Page Feedback: ${pathname}
`;
  if (detailLevel !== "compact") {
    output += `**Viewport:** ${viewport}
`;
  }
  output += "\n";
  annotations.forEach((a, i) => {
    if (detailLevel === "compact") {
      output += `${i + 1}. **${a.element}**: ${a.comment}`;
      if (a.selectedText) {
        output += ` (re: "${a.selectedText.slice(0, 30)}${a.selectedText.length > 30 ? "..." : ""}")`;
      }
      output += "\n";
    } else {
      output += `### ${i + 1}. ${a.element}
`;
      output += `**Location:** ${a.elementPath}
`;
      if (detailLevel === "detailed") {
        if (a.cssClasses) {
          output += `**Classes:** ${a.cssClasses}
`;
        }
        if (a.boundingBox) {
          output += `**Position:** ${Math.round(a.boundingBox.x)}px, ${Math.round(a.boundingBox.y)}px (${Math.round(a.boundingBox.width)}\xD7${Math.round(a.boundingBox.height)}px)
`;
        }
      }
      if (a.selectedText) {
        output += `**Selected text:** "${a.selectedText}"
`;
      }
      if (detailLevel === "detailed" && a.nearbyText && !a.selectedText) {
        output += `**Context:** ${a.nearbyText.slice(0, 100)}
`;
      }
      output += `**Feedback:** ${a.comment}

`;
    }
  });
  return output.trim();
}
function PageFeedbackToolbar({
  demoAnnotations,
  demoDelay = 1e3
} = {}) {
  const [isActive, setIsActive] = (0, import_react2.useState)(false);
  const [annotations, setAnnotations] = (0, import_react2.useState)([]);
  const [showMarkers, setShowMarkers] = (0, import_react2.useState)(true);
  const [hoverInfo, setHoverInfo] = (0, import_react2.useState)(null);
  const [hoverPosition, setHoverPosition] = (0, import_react2.useState)({ x: 0, y: 0 });
  const [pendingAnnotation, setPendingAnnotation] = (0, import_react2.useState)(null);
  const [copied, setCopied] = (0, import_react2.useState)(false);
  const [cleared, setCleared] = (0, import_react2.useState)(false);
  const [isClearing, setIsClearing] = (0, import_react2.useState)(false);
  const [hoveredMarkerId, setHoveredMarkerId] = (0, import_react2.useState)(null);
  const [deletingMarkerId, setDeletingMarkerId] = (0, import_react2.useState)(null);
  const [scrollY, setScrollY] = (0, import_react2.useState)(0);
  const [isScrolling, setIsScrolling] = (0, import_react2.useState)(false);
  const [mounted, setMounted] = (0, import_react2.useState)(false);
  const [isFrozen, setIsFrozen] = (0, import_react2.useState)(false);
  const [showSettings, setShowSettings] = (0, import_react2.useState)(false);
  const [settings, setSettings] = (0, import_react2.useState)(DEFAULT_SETTINGS);
  const [isDarkMode, setIsDarkMode] = (0, import_react2.useState)(false);
  const [isDragging, setIsDragging] = (0, import_react2.useState)(false);
  const [dragStart, setDragStart] = (0, import_react2.useState)(
    null
  );
  const [dragCurrent, setDragCurrent] = (0, import_react2.useState)(null);
  const [selectedElements, setSelectedElements] = (0, import_react2.useState)([]);
  const mouseDownPosRef = (0, import_react2.useRef)(null);
  const justFinishedDragRef = (0, import_react2.useRef)(false);
  const lastElementUpdateRef = (0, import_react2.useRef)(0);
  const DRAG_THRESHOLD = 8;
  const ELEMENT_UPDATE_THROTTLE = 50;
  const popupRef = (0, import_react2.useRef)(null);
  const scrollTimeoutRef = (0, import_react2.useRef)(null);
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  (0, import_react2.useEffect)(() => {
    setMounted(true);
    setScrollY(window.scrollY);
    const stored = loadAnnotations(pathname);
    setAnnotations(stored);
    try {
      const storedSettings = localStorage.getItem("feedback-toolbar-settings");
      if (storedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
      }
    } catch (e) {
    }
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeQuery.matches);
    const handleDarkModeChange = (e) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener("change", handleDarkModeChange);
    return () => darkModeQuery.removeEventListener("change", handleDarkModeChange);
  }, [pathname]);
  (0, import_react2.useEffect)(() => {
    if (mounted) {
      localStorage.setItem(
        "feedback-toolbar-settings",
        JSON.stringify(settings)
      );
    }
  }, [settings, mounted]);
  (0, import_react2.useEffect)(() => {
    if (!mounted || !demoAnnotations || demoAnnotations.length === 0) return;
    if (annotations.length > 0) return;
    const timeoutIds = [];
    timeoutIds.push(
      setTimeout(() => {
        setIsActive(true);
      }, demoDelay - 200)
    );
    demoAnnotations.forEach((demo, index) => {
      const annotationDelay = demoDelay + index * 300;
      timeoutIds.push(
        setTimeout(() => {
          const element = document.querySelector(demo.selector);
          if (!element) return;
          const rect = element.getBoundingClientRect();
          const { name, path } = identifyElement(element);
          const newAnnotation = {
            id: `demo-${Date.now()}-${index}`,
            x: (rect.left + rect.width / 2) / window.innerWidth * 100,
            y: rect.top + rect.height / 2 + window.scrollY,
            comment: demo.comment,
            element: name,
            elementPath: path,
            timestamp: Date.now(),
            selectedText: demo.selectedText,
            boundingBox: {
              x: rect.left,
              y: rect.top + window.scrollY,
              width: rect.width,
              height: rect.height
            },
            nearbyText: getNearbyText(element),
            cssClasses: getElementClasses(element)
          };
          setAnnotations((prev) => [...prev, newAnnotation]);
        }, annotationDelay)
      );
    });
    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [mounted, demoAnnotations, demoDelay]);
  (0, import_react2.useEffect)(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
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
    if (!isActive) return;
    const style = document.createElement("style");
    style.id = "feedback-cursor-styles";
    style.textContent = `
      body:not([data-feedback-toolbar]) * {
        cursor: crosshair !important;
      }
      /* Text elements get text cursor */
      p, span, h1, h2, h3, h4, h5, h6, li, td, th, label,
      blockquote, figcaption, caption, legend, dt, dd,
      [contenteditable], pre, code, em, strong, b, i, u, s,
      a, time, address, cite, q, abbr, dfn, mark, small, sub, sup {
        cursor: text !important;
      }
      /* Toolbar and markers keep their cursors */
      [data-feedback-toolbar], [data-feedback-toolbar] * {
        cursor: default !important;
      }
      [data-annotation-marker], [data-annotation-marker] * {
        cursor: pointer !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      const existingStyle = document.getElementById("feedback-cursor-styles");
      if (existingStyle) existingStyle.remove();
    };
  }, [isActive]);
  (0, import_react2.useEffect)(() => {
    if (!isActive || pendingAnnotation) return;
    const handleMouseMove = (e) => {
      if (e.target.closest("[data-feedback-toolbar]")) {
        setHoverInfo(null);
        return;
      }
      const elementUnder = document.elementFromPoint(
        e.clientX,
        e.clientY
      );
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
      if (justFinishedDragRef.current) {
        justFinishedDragRef.current = false;
        return;
      }
      const target = e.target;
      if (target.closest("[data-feedback-toolbar]")) return;
      if (target.closest("[data-annotation-popup]")) return;
      if (target.closest("[data-annotation-marker]")) return;
      if (pendingAnnotation) {
        const isInteractive = target.closest(
          "button, a, input, select, textarea, [role='button'], [onclick]"
        );
        if (isInteractive && !settings.blockInteractions) {
          return;
        }
        e.preventDefault();
        popupRef.current?.shake();
        return;
      }
      if (settings.blockInteractions) {
        const isInteractive = target.closest(
          "button, a, input, select, textarea, [role='button'], [onclick]"
        );
        if (isInteractive) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
      e.preventDefault();
      const elementUnder = document.elementFromPoint(
        e.clientX,
        e.clientY
      );
      if (!elementUnder) return;
      const { name, path } = identifyElement(elementUnder);
      const rect = elementUnder.getBoundingClientRect();
      const x = e.clientX / window.innerWidth * 100;
      const isFixed = isElementFixed(elementUnder);
      const y = isFixed ? e.clientY : e.clientY + window.scrollY;
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
        boundingBox: {
          x: rect.left,
          y: isFixed ? rect.top : rect.top + window.scrollY,
          width: rect.width,
          height: rect.height
        },
        nearbyText: getNearbyText(elementUnder),
        cssClasses: getElementClasses(elementUnder),
        isFixed
      });
      setHoverInfo(null);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isActive, pendingAnnotation]);
  (0, import_react2.useEffect)(() => {
    if (!isActive || pendingAnnotation) return;
    const handleMouseDown = (e) => {
      const target = e.target;
      if (target.closest("[data-feedback-toolbar]")) return;
      if (target.closest("[data-annotation-marker]")) return;
      if (target.closest("[data-annotation-popup]")) return;
      mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isActive, pendingAnnotation]);
  (0, import_react2.useEffect)(() => {
    if (!isActive || pendingAnnotation) return;
    const handleMouseMove = (e) => {
      if (!mouseDownPosRef.current) return;
      const dx = e.clientX - mouseDownPosRef.current.x;
      const dy = e.clientY - mouseDownPosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (!isDragging && distance >= DRAG_THRESHOLD) {
        setIsDragging(true);
        setDragStart(mouseDownPosRef.current);
        setDragCurrent({ x: e.clientX, y: e.clientY });
      }
      if (isDragging || distance >= DRAG_THRESHOLD) {
        setDragCurrent({ x: e.clientX, y: e.clientY });
        const now = Date.now();
        if (now - lastElementUpdateRef.current < ELEMENT_UPDATE_THROTTLE) {
          return;
        }
        lastElementUpdateRef.current = now;
        const startX = mouseDownPosRef.current.x;
        const startY = mouseDownPosRef.current.y;
        const left = Math.min(startX, e.clientX);
        const top = Math.min(startY, e.clientY);
        const right = Math.max(startX, e.clientX);
        const bottom = Math.max(startY, e.clientY);
        const pointsToCheck = [
          [left, top],
          [right, top],
          [left, bottom],
          [right, bottom],
          [(left + right) / 2, (top + bottom) / 2],
          [left, (top + bottom) / 2],
          [right, (top + bottom) / 2],
          [(left + right) / 2, top],
          [(left + right) / 2, bottom]
        ];
        const candidateElements = /* @__PURE__ */ new Set();
        pointsToCheck.forEach(([x, y]) => {
          const elements = document.elementsFromPoint(x, y);
          elements.forEach((el) => {
            if (el instanceof HTMLElement) candidateElements.add(el);
          });
        });
        const nearbyElements = document.querySelectorAll(
          "button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label"
        );
        nearbyElements.forEach((el) => {
          if (el instanceof HTMLElement) {
            const rect = el.getBoundingClientRect();
            if (rect.left < right && rect.right > left && rect.top < bottom && rect.bottom > top) {
              candidateElements.add(el);
            }
          }
        });
        const allMatching = [];
        const meaningfulTags = [
          "button",
          "a",
          "input",
          "img",
          "p",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "li",
          "label",
          "td",
          "th"
        ];
        candidateElements.forEach((el) => {
          if (el.closest("[data-feedback-toolbar]")) return;
          if (el.closest("[data-annotation-marker]")) return;
          const rect = el.getBoundingClientRect();
          if (rect.width > window.innerWidth * 0.8 && rect.height > window.innerHeight * 0.5)
            return;
          if (rect.width < 10 || rect.height < 10) return;
          if (rect.left < right && rect.right > left && rect.top < bottom && rect.bottom > top) {
            const tagName = el.tagName.toLowerCase();
            if (meaningfulTags.includes(tagName)) {
              allMatching.push({ element: el, rect });
            }
          }
        });
        const elementsInSelection = allMatching.filter(({ element: el }) => {
          const containsOther = allMatching.some(
            ({ element: other }) => other !== el && el.contains(other)
          );
          return !containsOther;
        });
        setSelectedElements(elementsInSelection);
      }
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isActive, pendingAnnotation, isDragging, DRAG_THRESHOLD]);
  (0, import_react2.useEffect)(() => {
    if (!isActive) return;
    const handleMouseUp = (e) => {
      const wasDragging = isDragging;
      if (isDragging && selectedElements.length > 0) {
        justFinishedDragRef.current = true;
        const bounds = selectedElements.reduce(
          (acc, { rect }) => ({
            left: Math.min(acc.left, rect.left),
            top: Math.min(acc.top, rect.top),
            right: Math.max(acc.right, rect.right),
            bottom: Math.max(acc.bottom, rect.bottom)
          }),
          {
            left: Infinity,
            top: Infinity,
            right: -Infinity,
            bottom: -Infinity
          }
        );
        const x = e.clientX / window.innerWidth * 100;
        const y = e.clientY + window.scrollY;
        const elementNames = selectedElements.slice(0, 5).map(({ element }) => identifyElement(element).name).join(", ");
        const suffix = selectedElements.length > 5 ? ` +${selectedElements.length - 5} more` : "";
        setPendingAnnotation({
          x,
          y,
          clientY: e.clientY,
          element: `${selectedElements.length} elements: ${elementNames}${suffix}`,
          elementPath: "multi-select",
          boundingBox: {
            x: bounds.left,
            y: bounds.top + window.scrollY,
            width: bounds.right - bounds.left,
            height: bounds.bottom - bounds.top
          },
          isMultiSelect: true
        });
        setHoverInfo(null);
      } else if (wasDragging) {
        justFinishedDragRef.current = true;
      }
      mouseDownPosRef.current = null;
      setIsDragging(false);
      setDragStart(null);
      setDragCurrent(null);
      setSelectedElements([]);
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [isActive, isDragging, selectedElements]);
  const addAnnotation = (0, import_react2.useCallback)(
    (comment) => {
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
        cssClasses: pendingAnnotation.cssClasses,
        isMultiSelect: pendingAnnotation.isMultiSelect,
        isFixed: pendingAnnotation.isFixed
      };
      setAnnotations((prev) => [...prev, newAnnotation]);
      setPendingAnnotation(null);
      window.getSelection()?.removeAllRanges();
    },
    [pendingAnnotation]
  );
  const cancelAnnotation = (0, import_react2.useCallback)(() => {
    setPendingAnnotation(null);
  }, []);
  const deleteAnnotation = (0, import_react2.useCallback)((id) => {
    setDeletingMarkerId(id);
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
    setTimeout(() => setDeletingMarkerId(null), 200);
  }, []);
  const clearAll = (0, import_react2.useCallback)(() => {
    const count = annotations.length;
    if (count === 0) return;
    setIsClearing(true);
    setCleared(true);
    const totalAnimationTime = count * 30 + 200;
    setTimeout(() => {
      setAnnotations([]);
      localStorage.removeItem(getStorageKey(pathname));
      setIsClearing(false);
    }, totalAnimationTime);
    setTimeout(() => setCleared(false), 1500);
  }, [pathname, annotations.length]);
  const copyOutput = (0, import_react2.useCallback)(async () => {
    const output = generateOutput(annotations, pathname, settings.outputDetail);
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
    if (settings.autoClearAfterCopy) {
      setTimeout(() => clearAll(), 500);
    }
  }, [
    annotations,
    pathname,
    settings.outputDetail,
    settings.autoClearAfterCopy,
    clearAll
  ]);
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
  return (0, import_react_dom.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: styles_module_default2.toolbar, "data-feedback-toolbar": true, children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_framer_motion3.AnimatePresence, { mode: "wait", initial: false, children: !isActive ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
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
              hasAnnotations && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "span",
                {
                  className: styles_module_default2.badge,
                  style: { backgroundColor: settings.annotationColor },
                  children: annotations.length
                }
              )
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
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                import_framer_motion3.motion.button,
                {
                  className: styles_module_default2.controlButton,
                  onClick: (e) => {
                    e.stopPropagation();
                    setShowSettings(!showSettings);
                  },
                  title: "Settings",
                  "data-active": showSettings,
                  whileTap: { scale: 0.95 },
                  children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(IconSettings, { size: 16 })
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
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_framer_motion3.AnimatePresence, { children: showSettings && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          import_framer_motion3.motion.div,
          {
            className: `${styles_module_default2.settingsPanel} ${isDarkMode ? styles_module_default2.dark : ""}`,
            initial: { opacity: 0, y: 10, scale: 0.95 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 10, scale: 0.95 },
            transition: { type: "spring", stiffness: 500, damping: 30 },
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: styles_module_default2.settingsSection, children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: styles_module_default2.settingsLabel, children: "Output Detail" }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: styles_module_default2.settingsOptions, children: OUTPUT_DETAIL_OPTIONS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
                  "button",
                  {
                    className: `${styles_module_default2.settingsOption} ${settings.outputDetail === option.value ? styles_module_default2.selected : ""}`,
                    onClick: () => setSettings((s) => ({
                      ...s,
                      outputDetail: option.value
                    })),
                    title: option.description,
                    children: [
                      option.label,
                      settings.outputDetail === option.value && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(IconCheck, { size: 12 })
                    ]
                  },
                  option.value
                )) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: styles_module_default2.settingsSection, children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: styles_module_default2.settingsLabel, children: "Marker Color" }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: styles_module_default2.colorOptions, children: COLOR_OPTIONS.map((color) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "button",
                  {
                    className: `${styles_module_default2.colorOption} ${settings.annotationColor === color.value ? styles_module_default2.selected : ""}`,
                    style: { backgroundColor: color.value },
                    onClick: () => setSettings((s) => ({
                      ...s,
                      annotationColor: color.value
                    })),
                    title: color.label
                  },
                  color.value
                )) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: styles_module_default2.settingsSection, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: styles_module_default2.settingsToggle, children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings.autoClearAfterCopy,
                    onChange: (e) => setSettings((s) => ({
                      ...s,
                      autoClearAfterCopy: e.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: styles_module_default2.toggleLabel, children: "Clear after copy" })
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: styles_module_default2.settingsSection, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("label", { className: styles_module_default2.settingsToggle, children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings.blockInteractions,
                    onChange: (e) => setSettings((s) => ({
                      ...s,
                      blockInteractions: e.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: styles_module_default2.toggleLabel, children: "Block page interactions" })
              ] }) })
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: styles_module_default2.markersLayer, "data-feedback-toolbar": true, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_framer_motion3.AnimatePresence, { children: isActive && showMarkers && annotations.filter((a) => !a.isFixed).map((annotation, index) => {
        const isHovered = hoveredMarkerId === annotation.id;
        const isDeleting = deletingMarkerId === annotation.id;
        const showDeleteState = isHovered || isDeleting;
        const isMulti = annotation.isMultiSelect;
        const markerColor = isMulti ? "#34C759" : settings.annotationColor;
        const globalIndex = annotations.findIndex(
          (a) => a.id === annotation.id
        );
        return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          import_framer_motion3.motion.div,
          {
            className: `${styles_module_default2.marker} ${showDeleteState ? styles_module_default2.hovered : ""} ${isMulti ? styles_module_default2.multiSelect : ""}`,
            "data-annotation-marker": true,
            initial: { scale: 0, opacity: 0 },
            animate: {
              scale: isClearing ? 0 : 1,
              opacity: isClearing ? 0 : 1,
              transition: isClearing ? {
                duration: 0.12,
                ease: "easeIn",
                delay: index * 0.02
              } : {
                type: "spring",
                stiffness: 600,
                damping: 28,
                delay: index * 0.02
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
              top: annotation.y,
              backgroundColor: showDeleteState ? void 0 : markerColor
            },
            onMouseEnter: () => setHoveredMarkerId(annotation.id),
            onMouseLeave: () => setHoveredMarkerId(null),
            onClick: (e) => {
              e.stopPropagation();
              deleteAnnotation(annotation.id);
            },
            children: [
              showDeleteState ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(IconClose, { size: isMulti ? 12 : 10 }) : globalIndex + 1,
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
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: styles_module_default2.fixedMarkersLayer, "data-feedback-toolbar": true, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_framer_motion3.AnimatePresence, { children: isActive && showMarkers && annotations.filter((a) => a.isFixed).map((annotation, index) => {
        const isHovered = hoveredMarkerId === annotation.id;
        const isDeleting = deletingMarkerId === annotation.id;
        const showDeleteState = isHovered || isDeleting;
        const isMulti = annotation.isMultiSelect;
        const markerColor = isMulti ? "#34C759" : settings.annotationColor;
        const globalIndex = annotations.findIndex(
          (a) => a.id === annotation.id
        );
        return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          import_framer_motion3.motion.div,
          {
            className: `${styles_module_default2.marker} ${styles_module_default2.fixed} ${showDeleteState ? styles_module_default2.hovered : ""} ${isMulti ? styles_module_default2.multiSelect : ""}`,
            "data-annotation-marker": true,
            initial: { scale: 0, opacity: 0 },
            animate: {
              scale: isClearing ? 0 : 1,
              opacity: isClearing ? 0 : 1,
              transition: isClearing ? {
                duration: 0.12,
                ease: "easeIn",
                delay: index * 0.02
              } : {
                type: "spring",
                stiffness: 600,
                damping: 28,
                delay: index * 0.02
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
              top: annotation.y,
              backgroundColor: showDeleteState ? void 0 : markerColor
            },
            onMouseEnter: () => setHoveredMarkerId(annotation.id),
            onMouseLeave: () => setHoveredMarkerId(null),
            onClick: (e) => {
              e.stopPropagation();
              deleteAnnotation(annotation.id);
            },
            children: [
              showDeleteState ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(IconClose, { size: isMulti ? 12 : 10 }) : globalIndex + 1,
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
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_framer_motion3.AnimatePresence, { children: hoverInfo?.rect && !pendingAnnotation && !isScrolling && !isDragging && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
              height: hoverInfo.rect.height,
              borderColor: `${settings.annotationColor}80`,
              backgroundColor: `${settings.annotationColor}0A`
            }
          },
          "hover-highlight"
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_framer_motion3.AnimatePresence, { children: hoverInfo && !pendingAnnotation && !isScrolling && !isDragging && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
              className: `${styles_module_default2.marker} ${styles_module_default2.pending} ${pendingAnnotation.isMultiSelect ? styles_module_default2.multiSelect : ""}`,
              initial: { scale: 0, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              exit: {
                scale: 0,
                opacity: 0,
                transition: { duration: 0.15, ease: "easeIn" }
              },
              transition: { type: "spring", stiffness: 500, damping: 30 },
              style: {
                left: `${pendingAnnotation.x}%`,
                top: pendingAnnotation.clientY,
                backgroundColor: pendingAnnotation.isMultiSelect ? "#34C759" : settings.annotationColor
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
              variant: pendingAnnotation.isMultiSelect ? "green" : "blue",
              style: {
                left: `${Math.min(Math.max(pendingAnnotation.x, 15), 85)}%`,
                top: Math.min(
                  pendingAnnotation.clientY + 20,
                  window.innerHeight - 180
                )
              }
            }
          )
        ] }) }),
        isDragging && dragStart && dragCurrent && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "div",
            {
              className: styles_module_default2.dragSelection,
              style: {
                left: Math.min(dragStart.x, dragCurrent.x),
                top: Math.min(dragStart.y, dragCurrent.y),
                width: Math.abs(dragCurrent.x - dragStart.x),
                height: Math.abs(dragCurrent.y - dragStart.y)
              },
              children: selectedElements.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: styles_module_default2.dragCount, children: selectedElements.length })
            }
          ),
          selectedElements.map(({ element, rect }, i) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "div",
            {
              className: styles_module_default2.selectedElementHighlight,
              style: {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
              }
            },
            `${element.tagName}-${i}`
          ))
        ] })
      ] })
    ] }),
    document.body
  );
}

// src/components/page-toolbar-css/index.tsx
var import_react4 = require("react");
var import_react_dom2 = require("react-dom");

// src/components/annotation-popup-css/index.tsx
var import_react3 = require("react");

// src/components/annotation-popup-css/styles.module.scss
var css3 = '@keyframes styles-module__popupEnter___AuQDN {\n  from {\n    opacity: 0;\n    transform: translateX(-50%) scale(0.95) translateY(4px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(-50%) scale(1) translateY(0);\n  }\n}\n@keyframes styles-module__popupExit___JJKQX {\n  from {\n    opacity: 1;\n    transform: translateX(-50%) scale(1) translateY(0);\n  }\n  to {\n    opacity: 0;\n    transform: translateX(-50%) scale(0.95) translateY(4px);\n  }\n}\n@keyframes styles-module__shake___jdbWe {\n  0%, 100% {\n    transform: translateX(-50%) scale(1) translateY(0) translateX(0);\n  }\n  20% {\n    transform: translateX(-50%) scale(1) translateY(0) translateX(-3px);\n  }\n  40% {\n    transform: translateX(-50%) scale(1) translateY(0) translateX(3px);\n  }\n  60% {\n    transform: translateX(-50%) scale(1) translateY(0) translateX(-2px);\n  }\n  80% {\n    transform: translateX(-50%) scale(1) translateY(0) translateX(2px);\n  }\n}\n.styles-module__popup___IhzrD {\n  position: fixed;\n  transform: translateX(-50%);\n  width: 280px;\n  padding: 0.75rem;\n  background: white;\n  border-radius: 0.75rem;\n  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.04);\n  cursor: default;\n  z-index: 100001;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  will-change: transform, opacity;\n  contain: layout style;\n  opacity: 0;\n}\n.styles-module__popup___IhzrD.styles-module__enter___L7U7N {\n  animation: styles-module__popupEnter___AuQDN 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n}\n.styles-module__popup___IhzrD.styles-module__entered___COX-w {\n  opacity: 1;\n  transform: translateX(-50%) scale(1) translateY(0);\n}\n.styles-module__popup___IhzrD.styles-module__exit___5eGjE {\n  animation: styles-module__popupExit___JJKQX 0.15s ease-in forwards;\n}\n.styles-module__popup___IhzrD.styles-module__entered___COX-w.styles-module__shake___jdbWe {\n  animation: styles-module__shake___jdbWe 0.25s ease-out;\n}\n\n.styles-module__header___wWsSi {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 0.5rem;\n}\n\n.styles-module__element___fTV2z {\n  font-size: 0.75rem;\n  font-weight: 500;\n  color: rgba(0, 0, 0, 0.65);\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  flex: 1;\n}\n\n.styles-module__timestamp___Dtpsv {\n  font-size: 0.625rem;\n  font-weight: 500;\n  color: rgba(0, 0, 0, 0.35);\n  font-variant-numeric: tabular-nums;\n  margin-left: 0.5rem;\n  flex-shrink: 0;\n}\n\n.styles-module__quote___mcMmQ {\n  font-size: 0.6875rem;\n  font-style: italic;\n  color: rgba(0, 0, 0, 0.5);\n  margin-bottom: 0.5rem;\n  padding: 0.4rem 0.5rem;\n  background: rgba(0, 0, 0, 0.03);\n  border-radius: 0.25rem;\n  line-height: 1.45;\n}\n\n.styles-module__textarea___jrSae {\n  width: 100%;\n  padding: 0.5rem 0.625rem;\n  font-size: 0.8125rem;\n  font-family: inherit;\n  border: 1px solid rgba(0, 0, 0, 0.12);\n  border-radius: 0.375rem;\n  resize: none;\n  outline: none;\n  transition: border-color 0.15s ease;\n}\n.styles-module__textarea___jrSae:focus {\n  border-color: #3c82f7;\n}\n.styles-module__textarea___jrSae.styles-module__green___99l3h:focus {\n  border-color: #34C759;\n}\n.styles-module__textarea___jrSae::placeholder {\n  color: rgba(0, 0, 0, 0.35);\n}\n\n.styles-module__actions___D6x3f {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.375rem;\n  margin-top: 0.5rem;\n}\n\n.styles-module__cancel___hRjnL,\n.styles-module__submit___K-mIR {\n  padding: 0.4rem 0.875rem;\n  font-size: 0.75rem;\n  font-weight: 500;\n  border-radius: 1rem;\n  border: none;\n  cursor: pointer;\n  transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;\n}\n\n.styles-module__cancel___hRjnL {\n  background: transparent;\n  color: rgba(0, 0, 0, 0.5);\n}\n.styles-module__cancel___hRjnL:hover {\n  background: rgba(0, 0, 0, 0.05);\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.styles-module__submit___K-mIR {\n  color: white;\n}\n.styles-module__submit___K-mIR:hover:not(:disabled) {\n  filter: brightness(0.9);\n}\n.styles-module__submit___K-mIR:disabled {\n  cursor: not-allowed;\n}';
var classNames3 = { "popup": "styles-module__popup___IhzrD", "enter": "styles-module__enter___L7U7N", "popupEnter": "styles-module__popupEnter___AuQDN", "entered": "styles-module__entered___COX-w", "exit": "styles-module__exit___5eGjE", "popupExit": "styles-module__popupExit___JJKQX", "shake": "styles-module__shake___jdbWe", "header": "styles-module__header___wWsSi", "element": "styles-module__element___fTV2z", "timestamp": "styles-module__timestamp___Dtpsv", "quote": "styles-module__quote___mcMmQ", "textarea": "styles-module__textarea___jrSae", "green": "styles-module__green___99l3h", "actions": "styles-module__actions___D6x3f", "cancel": "styles-module__cancel___hRjnL", "submit": "styles-module__submit___K-mIR" };
if (typeof document !== "undefined") {
  let style = document.getElementById("feedback-tool-styles-annotation-popup-css-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "feedback-tool-styles-annotation-popup-css-styles";
    style.textContent = css3;
    document.head.appendChild(style);
  }
}
var styles_module_default3 = classNames3;

// src/components/annotation-popup-css/index.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var AnnotationPopupCSS = (0, import_react3.forwardRef)(
  function AnnotationPopupCSS2({
    element,
    timestamp,
    selectedText,
    placeholder = "What should change?",
    initialValue = "",
    submitLabel = "Add",
    onSubmit,
    onCancel,
    style,
    accentColor = "#3c82f7"
  }, ref) {
    const [text, setText] = (0, import_react3.useState)(initialValue);
    const [isShaking, setIsShaking] = (0, import_react3.useState)(false);
    const [animState, setAnimState] = (0, import_react3.useState)("initial");
    const [isFocused, setIsFocused] = (0, import_react3.useState)(false);
    const textareaRef = (0, import_react3.useRef)(null);
    const popupRef = (0, import_react3.useRef)(null);
    (0, import_react3.useEffect)(() => {
      requestAnimationFrame(() => {
        setAnimState("enter");
      });
      const enterTimer = setTimeout(() => {
        setAnimState("entered");
      }, 200);
      const focusTimer = setTimeout(() => textareaRef.current?.focus(), 50);
      return () => {
        clearTimeout(enterTimer);
        clearTimeout(focusTimer);
      };
    }, []);
    const shake = (0, import_react3.useCallback)(() => {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        textareaRef.current?.focus();
      }, 250);
    }, []);
    (0, import_react3.useImperativeHandle)(ref, () => ({
      shake
    }), [shake]);
    const handleCancel = (0, import_react3.useCallback)(() => {
      setAnimState("exit");
      setTimeout(() => {
        onCancel();
      }, 150);
    }, [onCancel]);
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
          handleCancel();
        }
      },
      [handleSubmit, handleCancel]
    );
    const popupClassName = [
      styles_module_default3.popup,
      animState === "enter" ? styles_module_default3.enter : "",
      animState === "entered" ? styles_module_default3.entered : "",
      animState === "exit" ? styles_module_default3.exit : "",
      isShaking ? styles_module_default3.shake : ""
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
      "div",
      {
        ref: popupRef,
        className: popupClassName,
        "data-annotation-popup": true,
        style,
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: styles_module_default3.header, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: styles_module_default3.element, children: element }),
            timestamp && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: styles_module_default3.timestamp, children: timestamp })
          ] }),
          selectedText && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: styles_module_default3.quote, children: [
            "\u201C",
            selectedText.slice(0, 80),
            selectedText.length > 80 ? "..." : "",
            "\u201D"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            "textarea",
            {
              ref: textareaRef,
              className: styles_module_default3.textarea,
              style: { borderColor: isFocused ? accentColor : void 0 },
              placeholder,
              value: text,
              onChange: (e) => setText(e.target.value),
              onFocus: () => setIsFocused(true),
              onBlur: () => setIsFocused(false),
              rows: 2,
              onKeyDown: handleKeyDown
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: styles_module_default3.actions, children: [
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("button", { className: styles_module_default3.cancel, onClick: handleCancel, children: "Cancel" }),
            /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
              "button",
              {
                className: styles_module_default3.submit,
                style: {
                  backgroundColor: accentColor,
                  opacity: text.trim() ? 1 : 0.4
                },
                onClick: handleSubmit,
                disabled: !text.trim(),
                children: submitLabel
              }
            )
          ] })
        ]
      }
    );
  }
);

// src/components/page-toolbar-css/styles.module.scss
var css4 = '@keyframes styles-module__scaleIn___c-r1K {\n  from {\n    opacity: 0;\n    transform: scale(0.85);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n@keyframes styles-module__scaleOut___Wctwz {\n  from {\n    opacity: 1;\n    transform: scale(1);\n  }\n  to {\n    opacity: 0;\n    transform: scale(0.85);\n  }\n}\n@keyframes styles-module__slideUp___kgD36 {\n  from {\n    opacity: 0;\n    transform: scale(0.85) translateY(8px);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1) translateY(0);\n  }\n}\n@keyframes styles-module__slideDown___zcdje {\n  from {\n    opacity: 1;\n    transform: scale(1) translateY(0);\n  }\n  to {\n    opacity: 0;\n    transform: scale(0.85) translateY(8px);\n  }\n}\n@keyframes styles-module__markerIn___5FaAP {\n  0% {\n    opacity: 0;\n    transform: translate(-50%, -50%) scale(0.3);\n  }\n  100% {\n    opacity: 1;\n    transform: translate(-50%, -50%) scale(1);\n  }\n}\n@keyframes styles-module__markerOut___GU5jX {\n  0% {\n    opacity: 1;\n    transform: translate(-50%, -50%) scale(1);\n  }\n  100% {\n    opacity: 0;\n    transform: translate(-50%, -50%) scale(0.3);\n  }\n}\n@keyframes styles-module__fadeIn___b9qmf {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes styles-module__fadeOut___6Ut6- {\n  from {\n    opacity: 1;\n  }\n  to {\n    opacity: 0;\n  }\n}\n@keyframes styles-module__tooltipIn___0N31w {\n  from {\n    opacity: 0;\n    transform: translateX(-50%) translateY(2px) scale(0.98);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(-50%) translateY(0) scale(1);\n  }\n}\n@keyframes styles-module__hoverHighlightIn___6WYHY {\n  from {\n    opacity: 0;\n    transform: scale(0.98);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n@keyframes styles-module__hoverTooltipIn___FYGQx {\n  from {\n    opacity: 0;\n    transform: scale(0.95) translateY(4px);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1) translateY(0);\n  }\n}\n@keyframes styles-module__settingsPanelIn___MGfO8 {\n  from {\n    opacity: 0;\n    transform: translateY(10px) scale(0.95);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0) scale(1);\n  }\n}\n@keyframes styles-module__settingsPanelOut___Zfymi {\n  from {\n    opacity: 1;\n    transform: translateY(0) scale(1);\n  }\n  to {\n    opacity: 0;\n    transform: translateY(10px) scale(0.95);\n  }\n}\n.styles-module__toolbar___wNsdK {\n  position: fixed;\n  bottom: 1.25rem;\n  right: 1.25rem;\n  z-index: 100000;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n}\n\n.styles-module__toggleButton___2m7Io {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 44px;\n  height: 44px;\n  border-radius: 22px;\n  border: none;\n  background: #1a1a1a;\n  color: #fff;\n  cursor: pointer;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1);\n}\n.styles-module__toggleButton___2m7Io svg {\n  margin-top: -1px;\n}\n.styles-module__toggleButton___2m7Io:hover {\n  background: #2a2a2a;\n}\n.styles-module__toggleButton___2m7Io:active {\n  transform: scale(0.95);\n}\n.styles-module__toggleButton___2m7Io.styles-module__enter___WFIki {\n  animation: styles-module__scaleIn___c-r1K 0.1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n}\n.styles-module__toggleButton___2m7Io.styles-module__exit___fyOJ0 {\n  animation: styles-module__scaleOut___Wctwz 0.2s ease-in forwards;\n}\n\n.styles-module__badge___2XsgF {\n  position: absolute;\n  top: -4px;\n  right: -4px;\n  min-width: 18px;\n  height: 18px;\n  padding: 0 5px;\n  border-radius: 9px;\n  background: #3c82f7;\n  color: white;\n  font-size: 0.625rem;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);\n}\n\n.styles-module__controls___GjxQ2 {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  padding: 0.375rem;\n  border-radius: 1.5rem;\n  background: #1a1a1a;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1);\n}\n.styles-module__controls___GjxQ2.styles-module__enter___WFIki {\n  animation: styles-module__slideUp___kgD36 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n}\n.styles-module__controls___GjxQ2.styles-module__exit___fyOJ0 {\n  animation: styles-module__slideDown___zcdje 0.15s ease-in forwards;\n}\n\n.styles-module__controlButton___8Q0jc {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  border: none;\n  background: transparent;\n  color: rgba(255, 255, 255, 0.85);\n  cursor: pointer;\n  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease;\n}\n.styles-module__controlButton___8Q0jc:hover:not(:disabled) {\n  background: rgba(255, 255, 255, 0.12);\n  color: #fff;\n}\n.styles-module__controlButton___8Q0jc:active:not(:disabled) {\n  transform: scale(0.92);\n}\n.styles-module__controlButton___8Q0jc:disabled {\n  opacity: 0.35;\n  cursor: not-allowed;\n}\n.styles-module__controlButton___8Q0jc[data-active=true] {\n  color: #3c82f7;\n  background: rgba(60, 130, 247, 0.25);\n}\n.styles-module__controlButton___8Q0jc[data-danger]:hover:not(:disabled) {\n  background: rgba(255, 59, 48, 0.25);\n  color: #ff3b30;\n}\n\n.styles-module__divider___c--s1 {\n  width: 1px;\n  height: 20px;\n  background: rgba(255, 255, 255, 0.15);\n  margin: 0 0.125rem;\n}\n\n.styles-module__overlay___Q1O9y {\n  position: fixed;\n  inset: 0;\n  z-index: 99999;\n  pointer-events: none;\n}\n.styles-module__overlay___Q1O9y > * {\n  pointer-events: auto;\n}\n\n.styles-module__hoverHighlight___ogakW {\n  position: fixed;\n  border: 2px solid rgba(60, 130, 247, 0.5);\n  border-radius: 4px;\n  pointer-events: none !important;\n  background: rgba(60, 130, 247, 0.04);\n  box-sizing: border-box;\n  will-change: opacity;\n  contain: layout style;\n}\n.styles-module__hoverHighlight___ogakW.styles-module__enter___WFIki {\n  animation: styles-module__hoverHighlightIn___6WYHY 0.12s ease-out forwards;\n}\n\n.styles-module__multiSelectOutline___cSJ-m {\n  position: fixed;\n  border: 2px dashed rgba(52, 199, 89, 0.6);\n  border-radius: 4px;\n  pointer-events: none !important;\n  background: rgba(52, 199, 89, 0.05);\n  box-sizing: border-box;\n  will-change: opacity;\n}\n.styles-module__multiSelectOutline___cSJ-m.styles-module__enter___WFIki {\n  animation: styles-module__fadeIn___b9qmf 0.15s ease-out forwards;\n}\n.styles-module__multiSelectOutline___cSJ-m.styles-module__exit___fyOJ0 {\n  animation: styles-module__fadeOut___6Ut6- 0.15s ease-out forwards;\n}\n\n.styles-module__singleSelectOutline___QhX-O {\n  position: fixed;\n  border: 2px solid rgba(60, 130, 247, 0.6);\n  border-radius: 4px;\n  pointer-events: none !important;\n  background: rgba(60, 130, 247, 0.05);\n  box-sizing: border-box;\n  will-change: opacity;\n}\n.styles-module__singleSelectOutline___QhX-O.styles-module__enter___WFIki {\n  animation: styles-module__fadeIn___b9qmf 0.15s ease-out forwards;\n}\n.styles-module__singleSelectOutline___QhX-O.styles-module__exit___fyOJ0 {\n  animation: styles-module__fadeOut___6Ut6- 0.15s ease-out forwards;\n}\n\n.styles-module__hoverTooltip___bvLk7 {\n  position: fixed;\n  font-size: 0.6875rem;\n  font-weight: 500;\n  color: #fff;\n  background: rgba(0, 0, 0, 0.85);\n  padding: 0.35rem 0.6rem;\n  border-radius: 0.375rem;\n  pointer-events: none !important;\n  white-space: nowrap;\n  max-width: 200px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.styles-module__hoverTooltip___bvLk7.styles-module__enter___WFIki {\n  animation: styles-module__hoverTooltipIn___FYGQx 0.1s ease-out forwards;\n}\n\n.styles-module__markersLayer___-25j1 {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 0;\n  z-index: 99998;\n  pointer-events: none;\n}\n.styles-module__markersLayer___-25j1 > * {\n  pointer-events: auto;\n}\n\n.styles-module__fixedMarkersLayer___ffyX6 {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 99998;\n  pointer-events: none;\n}\n.styles-module__fixedMarkersLayer___ffyX6 > * {\n  pointer-events: auto;\n}\n\n.styles-module__marker___6sQrs {\n  position: absolute;\n  width: 22px;\n  height: 22px;\n  background: #3c82f7;\n  color: white;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.6875rem;\n  font-weight: 600;\n  transform: translate(-50%, -50%) scale(1);\n  opacity: 1;\n  cursor: pointer;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);\n  user-select: none;\n  will-change: transform, opacity;\n  contain: layout style;\n}\n.styles-module__marker___6sQrs:not(.styles-module__enter___WFIki):not(.styles-module__exit___fyOJ0):not(.styles-module__clearing___FQ--7) {\n  transition: background-color 0.15s ease, transform 0.1s ease;\n}\n.styles-module__marker___6sQrs.styles-module__enter___WFIki {\n  animation: styles-module__markerIn___5FaAP 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;\n}\n.styles-module__marker___6sQrs.styles-module__exit___fyOJ0 {\n  animation: styles-module__markerOut___GU5jX 0.2s ease-out both;\n  pointer-events: none;\n}\n.styles-module__marker___6sQrs.styles-module__clearing___FQ--7 {\n  animation: styles-module__markerOut___GU5jX 0.15s ease-out both;\n  pointer-events: none;\n}\n.styles-module__marker___6sQrs:not(.styles-module__enter___WFIki):not(.styles-module__exit___fyOJ0):not(.styles-module__clearing___FQ--7):hover {\n  transform: translate(-50%, -50%) scale(1.1);\n}\n.styles-module__marker___6sQrs.styles-module__pending___2IHLC {\n  position: fixed;\n  background: #3c82f7;\n}\n.styles-module__marker___6sQrs.styles-module__fixed___dBMHC {\n  position: fixed;\n}\n.styles-module__marker___6sQrs.styles-module__multiSelect___YWiuz {\n  background: #34c759;\n  width: 26px;\n  height: 26px;\n  border-radius: 6px;\n  font-size: 0.75rem;\n}\n.styles-module__marker___6sQrs.styles-module__multiSelect___YWiuz.styles-module__pending___2IHLC {\n  background: #34c759;\n}\n.styles-module__marker___6sQrs.styles-module__hovered___ZgXIy {\n  background: #ff3b30;\n}\n\n.styles-module__markerTooltip___aLJID {\n  position: absolute;\n  top: calc(100% + 10px);\n  left: 50%;\n  transform: translateX(-50%);\n  z-index: 100002;\n  background: white;\n  padding: 0.625rem 0.75rem;\n  border-radius: 0.5rem;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04);\n  min-width: 160px;\n  max-width: 280px;\n  pointer-events: none;\n  cursor: default;\n}\n.styles-module__markerTooltip___aLJID.styles-module__enter___WFIki {\n  animation: styles-module__tooltipIn___0N31w 0.1s ease-out forwards;\n}\n\n.styles-module__markerQuote___FHmrz {\n  display: block;\n  font-size: 0.6875rem;\n  font-style: italic;\n  color: rgba(0, 0, 0, 0.5);\n  margin-bottom: 0.375rem;\n  line-height: 1.4;\n}\n\n.styles-module__markerNote___QkrrS {\n  display: block;\n  font-size: 0.75rem;\n  font-weight: 450;\n  line-height: 1.4;\n  color: #333;\n  white-space: normal;\n}\n\n.styles-module__markerHint___2iF-6 {\n  display: block;\n  font-size: 0.625rem;\n  font-weight: 400;\n  color: rgba(0, 0, 0, 0.3);\n  margin-top: 0.375rem;\n}\n\n.styles-module__settingsPanel___OxX3Y {\n  position: absolute;\n  bottom: calc(100% + 0.5rem);\n  right: 0;\n  background: white;\n  border-radius: 0.75rem;\n  padding: 0.75rem;\n  min-width: 200px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04);\n}\n.styles-module__settingsPanel___OxX3Y.styles-module__enter___WFIki {\n  animation: styles-module__settingsPanelIn___MGfO8 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n}\n.styles-module__settingsPanel___OxX3Y.styles-module__exit___fyOJ0 {\n  animation: styles-module__settingsPanelOut___Zfymi 0.15s ease-in forwards;\n}\n.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf {\n  background: #2a2a2a;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);\n}\n.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__settingsLabel___8UjfX {\n  color: rgba(255, 255, 255, 0.6);\n}\n.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__settingsOption___UNa12 {\n  color: rgba(255, 255, 255, 0.85);\n}\n.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__settingsOption___UNa12:hover {\n  background: rgba(255, 255, 255, 0.1);\n}\n.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__settingsOption___UNa12.styles-module__selected___OwRqP {\n  background: rgba(60, 130, 247, 0.25);\n  color: #7ab3ff;\n}\n.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__toggleLabel___Xm8Aa {\n  color: rgba(255, 255, 255, 0.85);\n}\n\n.styles-module__settingsHeader___pwDY9 {\n  display: flex;\n  align-items: center;\n  gap: 0.375rem;\n  margin-bottom: 0.75rem;\n  padding-bottom: 0.625rem;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.08);\n  color: rgba(255, 255, 255, 0.9);\n}\n\n.styles-module__settingsVersion___TUcFq {\n  font-size: 0.625rem;\n  font-weight: 500;\n  color: rgba(255, 255, 255, 0.4);\n  margin-left: auto;\n}\n\n.styles-module__settingsSection___m-YM2 + .styles-module__settingsSection___m-YM2 {\n  margin-top: 0.75rem;\n  padding-top: 0.75rem;\n  border-top: 1px solid rgba(0, 0, 0, 0.06);\n}\n.styles-module__dark___ILIQf .styles-module__settingsSection___m-YM2 + .styles-module__settingsSection___m-YM2 {\n  border-top-color: rgba(255, 255, 255, 0.08);\n}\n\n.styles-module__settingsLabel___8UjfX {\n  font-size: 0.625rem;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  color: rgba(0, 0, 0, 0.4);\n  margin-bottom: 0.5rem;\n}\n\n.styles-module__settingsOptions___LyrBA {\n  display: flex;\n  gap: 0.25rem;\n}\n\n.styles-module__settingsOption___UNa12 {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.25rem;\n  padding: 0.375rem 0.5rem;\n  border: none;\n  border-radius: 0.375rem;\n  background: transparent;\n  font-size: 0.6875rem;\n  font-weight: 500;\n  color: rgba(0, 0, 0, 0.7);\n  cursor: pointer;\n  transition: background-color 0.15s ease, color 0.15s ease;\n}\n.styles-module__settingsOption___UNa12:hover {\n  background: rgba(0, 0, 0, 0.05);\n}\n.styles-module__settingsOption___UNa12.styles-module__selected___OwRqP {\n  background: rgba(60, 130, 247, 0.15);\n  color: #3c82f7;\n}\n\n.styles-module__sliderContainer___ducXj {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n\n.styles-module__slider___GLdxp {\n  -webkit-appearance: none;\n  appearance: none;\n  width: 100%;\n  height: 4px;\n  background: rgba(255, 255, 255, 0.15);\n  border-radius: 2px;\n  outline: none;\n  cursor: pointer;\n}\n.styles-module__slider___GLdxp::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  appearance: none;\n  width: 14px;\n  height: 14px;\n  background: white;\n  border-radius: 50%;\n  cursor: pointer;\n  transition: transform 0.15s ease, box-shadow 0.15s ease;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);\n}\n.styles-module__slider___GLdxp::-moz-range-thumb {\n  width: 14px;\n  height: 14px;\n  background: white;\n  border: none;\n  border-radius: 50%;\n  cursor: pointer;\n  transition: transform 0.15s ease, box-shadow 0.15s ease;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);\n}\n.styles-module__slider___GLdxp:hover::-webkit-slider-thumb {\n  transform: scale(1.15);\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);\n}\n.styles-module__slider___GLdxp:hover::-moz-range-thumb {\n  transform: scale(1.15);\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);\n}\n\n.styles-module__sliderLabels___FhLDB {\n  display: flex;\n  justify-content: space-between;\n}\n\n.styles-module__sliderLabel___U8sPr {\n  font-size: 0.625rem;\n  font-weight: 500;\n  color: rgba(255, 255, 255, 0.4);\n  cursor: pointer;\n  transition: color 0.15s ease;\n}\n.styles-module__sliderLabel___U8sPr:hover {\n  color: rgba(255, 255, 255, 0.7);\n}\n.styles-module__sliderLabel___U8sPr.styles-module__active___-zoN6 {\n  color: rgba(255, 255, 255, 0.9);\n}\n\n.styles-module__colorOptions___iHCNX {\n  display: flex;\n  gap: 0.375rem;\n}\n\n.styles-module__colorOption___IodiY {\n  width: 24px;\n  height: 24px;\n  border-radius: 50%;\n  border: 2px solid transparent;\n  cursor: pointer;\n  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;\n}\n.styles-module__colorOption___IodiY:hover {\n  transform: scale(1.1);\n}\n.styles-module__colorOption___IodiY.styles-module__selected___OwRqP {\n  border-color: white;\n  box-shadow: 0 0 0 2px currentColor;\n}\n\n.styles-module__settingsToggle___fBrFn {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  cursor: pointer;\n}\n.styles-module__settingsToggle___fBrFn input[type=checkbox] {\n  width: 16px;\n  height: 16px;\n  accent-color: #3c82f7;\n  cursor: pointer;\n}\n\n.styles-module__toggleLabel___Xm8Aa {\n  font-size: 0.75rem;\n  font-weight: 450;\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.styles-module__dragSelection___kZLq2 {\n  position: fixed;\n  top: 0;\n  left: 0;\n  border: 2px solid rgba(52, 199, 89, 0.6);\n  border-radius: 4px;\n  background: rgba(52, 199, 89, 0.08);\n  pointer-events: none;\n  z-index: 99997;\n  will-change: transform, width, height;\n  contain: layout style;\n}\n\n.styles-module__dragCount___KM90j {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background: #34c759;\n  color: white;\n  font-size: 0.875rem;\n  font-weight: 600;\n  padding: 0.25rem 0.5rem;\n  border-radius: 1rem;\n  min-width: 1.5rem;\n  text-align: center;\n}\n\n.styles-module__highlightsContainer___-0xzG {\n  position: fixed;\n  top: 0;\n  left: 0;\n  pointer-events: none;\n  z-index: 99996;\n}\n\n.styles-module__selectedElementHighlight___fyVlI {\n  position: fixed;\n  top: 0;\n  left: 0;\n  border: 2px solid rgba(52, 199, 89, 0.5);\n  border-radius: 4px;\n  background: rgba(52, 199, 89, 0.06);\n  pointer-events: none;\n  will-change: transform, width, height;\n  contain: layout style;\n}';
var classNames4 = { "toolbar": "styles-module__toolbar___wNsdK", "toggleButton": "styles-module__toggleButton___2m7Io", "enter": "styles-module__enter___WFIki", "scaleIn": "styles-module__scaleIn___c-r1K", "exit": "styles-module__exit___fyOJ0", "scaleOut": "styles-module__scaleOut___Wctwz", "badge": "styles-module__badge___2XsgF", "controls": "styles-module__controls___GjxQ2", "slideUp": "styles-module__slideUp___kgD36", "slideDown": "styles-module__slideDown___zcdje", "controlButton": "styles-module__controlButton___8Q0jc", "divider": "styles-module__divider___c--s1", "overlay": "styles-module__overlay___Q1O9y", "hoverHighlight": "styles-module__hoverHighlight___ogakW", "hoverHighlightIn": "styles-module__hoverHighlightIn___6WYHY", "multiSelectOutline": "styles-module__multiSelectOutline___cSJ-m", "fadeIn": "styles-module__fadeIn___b9qmf", "fadeOut": "styles-module__fadeOut___6Ut6-", "singleSelectOutline": "styles-module__singleSelectOutline___QhX-O", "hoverTooltip": "styles-module__hoverTooltip___bvLk7", "hoverTooltipIn": "styles-module__hoverTooltipIn___FYGQx", "markersLayer": "styles-module__markersLayer___-25j1", "fixedMarkersLayer": "styles-module__fixedMarkersLayer___ffyX6", "marker": "styles-module__marker___6sQrs", "clearing": "styles-module__clearing___FQ--7", "markerIn": "styles-module__markerIn___5FaAP", "markerOut": "styles-module__markerOut___GU5jX", "pending": "styles-module__pending___2IHLC", "fixed": "styles-module__fixed___dBMHC", "multiSelect": "styles-module__multiSelect___YWiuz", "hovered": "styles-module__hovered___ZgXIy", "markerTooltip": "styles-module__markerTooltip___aLJID", "tooltipIn": "styles-module__tooltipIn___0N31w", "markerQuote": "styles-module__markerQuote___FHmrz", "markerNote": "styles-module__markerNote___QkrrS", "markerHint": "styles-module__markerHint___2iF-6", "settingsPanel": "styles-module__settingsPanel___OxX3Y", "settingsPanelIn": "styles-module__settingsPanelIn___MGfO8", "settingsPanelOut": "styles-module__settingsPanelOut___Zfymi", "dark": "styles-module__dark___ILIQf", "settingsLabel": "styles-module__settingsLabel___8UjfX", "settingsOption": "styles-module__settingsOption___UNa12", "selected": "styles-module__selected___OwRqP", "toggleLabel": "styles-module__toggleLabel___Xm8Aa", "settingsHeader": "styles-module__settingsHeader___pwDY9", "settingsVersion": "styles-module__settingsVersion___TUcFq", "settingsSection": "styles-module__settingsSection___m-YM2", "settingsOptions": "styles-module__settingsOptions___LyrBA", "sliderContainer": "styles-module__sliderContainer___ducXj", "slider": "styles-module__slider___GLdxp", "sliderLabels": "styles-module__sliderLabels___FhLDB", "sliderLabel": "styles-module__sliderLabel___U8sPr", "active": "styles-module__active___-zoN6", "colorOptions": "styles-module__colorOptions___iHCNX", "colorOption": "styles-module__colorOption___IodiY", "settingsToggle": "styles-module__settingsToggle___fBrFn", "dragSelection": "styles-module__dragSelection___kZLq2", "dragCount": "styles-module__dragCount___KM90j", "highlightsContainer": "styles-module__highlightsContainer___-0xzG", "selectedElementHighlight": "styles-module__selectedElementHighlight___fyVlI" };
if (typeof document !== "undefined") {
  let style = document.getElementById("feedback-tool-styles-page-toolbar-css-styles");
  if (!style) {
    style = document.createElement("style");
    style.id = "feedback-tool-styles-page-toolbar-css-styles";
    style.textContent = css4;
    document.head.appendChild(style);
  }
}
var styles_module_default4 = classNames4;

// src/components/page-toolbar-css/index.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var DEFAULT_SETTINGS2 = {
  outputDetail: "standard",
  autoClearAfterCopy: false,
  annotationColor: "#3c82f7",
  blockInteractions: false
};
var OUTPUT_DETAIL_OPTIONS2 = [
  { value: "compact", label: "Compact" },
  { value: "standard", label: "Standard" },
  { value: "detailed", label: "Detailed" }
];
var COLOR_OPTIONS2 = [
  { value: "#3c82f7", label: "Blue" },
  { value: "#34C759", label: "Green" },
  { value: "#FF9500", label: "Orange" },
  { value: "#AF52DE", label: "Purple" },
  { value: "#FF2D55", label: "Pink" }
];
function isElementFixed2(element) {
  let current = element;
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const position = style.position;
    if (position === "fixed" || position === "sticky") {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}
function generateOutput2(annotations, pathname, detailLevel = "standard") {
  if (annotations.length === 0) return "";
  const viewport = typeof window !== "undefined" ? `${window.innerWidth}\xD7${window.innerHeight}` : "unknown";
  let output = `## Page Feedback: ${pathname}
`;
  if (detailLevel !== "compact") {
    output += `**Viewport:** ${viewport}
`;
  }
  output += "\n";
  annotations.forEach((a, i) => {
    if (detailLevel === "compact") {
      output += `${i + 1}. **${a.element}**: ${a.comment}`;
      if (a.selectedText) {
        output += ` (re: "${a.selectedText.slice(0, 30)}${a.selectedText.length > 30 ? "..." : ""}")`;
      }
      output += "\n";
    } else {
      output += `### ${i + 1}. ${a.element}
`;
      output += `**Location:** ${a.elementPath}
`;
      if (detailLevel === "detailed") {
        if (a.cssClasses) {
          output += `**Classes:** ${a.cssClasses}
`;
        }
        if (a.boundingBox) {
          output += `**Position:** ${Math.round(a.boundingBox.x)}px, ${Math.round(a.boundingBox.y)}px (${Math.round(a.boundingBox.width)}\xD7${Math.round(a.boundingBox.height)}px)
`;
        }
      }
      if (a.selectedText) {
        output += `**Selected text:** "${a.selectedText}"
`;
      }
      if (detailLevel === "detailed" && a.nearbyText && !a.selectedText) {
        output += `**Context:** ${a.nearbyText.slice(0, 100)}
`;
      }
      output += `**Feedback:** ${a.comment}

`;
    }
  });
  return output.trim();
}
function PageFeedbackToolbarCSS({
  demoAnnotations,
  demoDelay = 1e3
} = {}) {
  const [isActive, setIsActive] = (0, import_react4.useState)(false);
  const [isActiveVisible, setIsActiveVisible] = (0, import_react4.useState)(false);
  const [annotations, setAnnotations] = (0, import_react4.useState)([]);
  const [showMarkers, setShowMarkers] = (0, import_react4.useState)(true);
  const [markersVisible, setMarkersVisible] = (0, import_react4.useState)(false);
  const [markersExiting, setMarkersExiting] = (0, import_react4.useState)(false);
  const [hoverInfo, setHoverInfo] = (0, import_react4.useState)(null);
  const [hoverPosition, setHoverPosition] = (0, import_react4.useState)({ x: 0, y: 0 });
  const [pendingAnnotation, setPendingAnnotation] = (0, import_react4.useState)(null);
  const [copied, setCopied] = (0, import_react4.useState)(false);
  const [cleared, setCleared] = (0, import_react4.useState)(false);
  const [isClearing, setIsClearing] = (0, import_react4.useState)(false);
  const [hoveredMarkerId, setHoveredMarkerId] = (0, import_react4.useState)(null);
  const [deletingMarkerId, setDeletingMarkerId] = (0, import_react4.useState)(null);
  const [editingAnnotation, setEditingAnnotation] = (0, import_react4.useState)(
    null
  );
  const [scrollY, setScrollY] = (0, import_react4.useState)(0);
  const [isScrolling, setIsScrolling] = (0, import_react4.useState)(false);
  const [mounted, setMounted] = (0, import_react4.useState)(false);
  const [isFrozen, setIsFrozen] = (0, import_react4.useState)(false);
  const [showSettings, setShowSettings] = (0, import_react4.useState)(false);
  const [showSettingsVisible, setShowSettingsVisible] = (0, import_react4.useState)(false);
  const [settings, setSettings] = (0, import_react4.useState)(DEFAULT_SETTINGS2);
  const [isDarkMode, setIsDarkMode] = (0, import_react4.useState)(false);
  const [animatedMarkers, setAnimatedMarkers] = (0, import_react4.useState)(
    /* @__PURE__ */ new Set()
  );
  const [exitingMarkers, setExitingMarkers] = (0, import_react4.useState)(/* @__PURE__ */ new Set());
  const [pendingExiting, setPendingExiting] = (0, import_react4.useState)(false);
  const [isDragging, setIsDragging] = (0, import_react4.useState)(false);
  const mouseDownPosRef = (0, import_react4.useRef)(null);
  const dragStartRef = (0, import_react4.useRef)(null);
  const dragRectRef = (0, import_react4.useRef)(null);
  const highlightsContainerRef = (0, import_react4.useRef)(null);
  const justFinishedDragRef = (0, import_react4.useRef)(false);
  const lastElementUpdateRef = (0, import_react4.useRef)(0);
  const recentlyAddedIdRef = (0, import_react4.useRef)(null);
  const DRAG_THRESHOLD = 8;
  const ELEMENT_UPDATE_THROTTLE = 50;
  const popupRef = (0, import_react4.useRef)(null);
  const editPopupRef = (0, import_react4.useRef)(null);
  const scrollTimeoutRef = (0, import_react4.useRef)(null);
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  (0, import_react4.useEffect)(() => {
    if (isActive) {
      setIsActiveVisible(true);
    } else if (isActiveVisible) {
      const timer = setTimeout(() => setIsActiveVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isActive, isActiveVisible]);
  (0, import_react4.useEffect)(() => {
    if (showSettings) {
      setShowSettingsVisible(true);
    } else {
      const timer = setTimeout(() => setShowSettingsVisible(false), 150);
      return () => clearTimeout(timer);
    }
  }, [showSettings]);
  const shouldShowMarkers = isActive && showMarkers;
  (0, import_react4.useEffect)(() => {
    if (shouldShowMarkers) {
      setMarkersExiting(false);
      setMarkersVisible(true);
      setAnimatedMarkers(/* @__PURE__ */ new Set());
      const timer = setTimeout(() => {
        setAnimatedMarkers((prev) => {
          const newSet = new Set(prev);
          annotations.forEach((a) => newSet.add(a.id));
          return newSet;
        });
      }, 350);
      return () => clearTimeout(timer);
    } else if (markersVisible) {
      setMarkersExiting(true);
      const timer = setTimeout(() => {
        setMarkersVisible(false);
        setMarkersExiting(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [shouldShowMarkers]);
  (0, import_react4.useEffect)(() => {
    setMounted(true);
    setScrollY(window.scrollY);
    const stored = loadAnnotations(pathname);
    setAnnotations(stored);
    try {
      const storedSettings = localStorage.getItem("feedback-toolbar-settings");
      if (storedSettings) {
        setSettings({ ...DEFAULT_SETTINGS2, ...JSON.parse(storedSettings) });
      }
    } catch (e) {
    }
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeQuery.matches);
    const handleDarkModeChange = (e) => setIsDarkMode(e.matches);
    darkModeQuery.addEventListener("change", handleDarkModeChange);
    return () => darkModeQuery.removeEventListener("change", handleDarkModeChange);
  }, [pathname]);
  (0, import_react4.useEffect)(() => {
    if (mounted) {
      localStorage.setItem(
        "feedback-toolbar-settings",
        JSON.stringify(settings)
      );
    }
  }, [settings, mounted]);
  (0, import_react4.useEffect)(() => {
    if (!mounted || !demoAnnotations || demoAnnotations.length === 0) return;
    if (annotations.length > 0) return;
    const timeoutIds = [];
    timeoutIds.push(
      setTimeout(() => {
        setIsActive(true);
      }, demoDelay - 200)
    );
    demoAnnotations.forEach((demo, index) => {
      const annotationDelay = demoDelay + index * 300;
      timeoutIds.push(
        setTimeout(() => {
          const element = document.querySelector(demo.selector);
          if (!element) return;
          const rect = element.getBoundingClientRect();
          const { name, path } = identifyElement(element);
          const newAnnotation = {
            id: `demo-${Date.now()}-${index}`,
            x: (rect.left + rect.width / 2) / window.innerWidth * 100,
            y: rect.top + rect.height / 2 + window.scrollY,
            comment: demo.comment,
            element: name,
            elementPath: path,
            timestamp: Date.now(),
            selectedText: demo.selectedText,
            boundingBox: {
              x: rect.left,
              y: rect.top + window.scrollY,
              width: rect.width,
              height: rect.height
            },
            nearbyText: getNearbyText(element),
            cssClasses: getElementClasses(element)
          };
          setAnnotations((prev) => [...prev, newAnnotation]);
        }, annotationDelay)
      );
    });
    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [mounted, demoAnnotations, demoDelay]);
  (0, import_react4.useEffect)(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
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
      *:not([data-feedback-toolbar]):not([data-feedback-toolbar] *):not([data-annotation-popup]):not([data-annotation-popup] *):not([data-annotation-marker]):not([data-annotation-marker] *),
      *:not([data-feedback-toolbar]):not([data-feedback-toolbar] *):not([data-annotation-popup]):not([data-annotation-popup] *):not([data-annotation-marker]):not([data-annotation-marker] *)::before,
      *:not([data-feedback-toolbar]):not([data-feedback-toolbar] *):not([data-annotation-popup]):not([data-annotation-popup] *):not([data-annotation-marker]):not([data-annotation-marker] *)::after {
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
    if (isFrozen) {
      unfreezeAnimations();
    } else {
      freezeAnimations();
    }
  }, [isFrozen, freezeAnimations, unfreezeAnimations]);
  (0, import_react4.useEffect)(() => {
    if (!isActive) {
      setPendingAnnotation(null);
      setEditingAnnotation(null);
      setHoverInfo(null);
      setShowSettings(false);
      if (isFrozen) {
        unfreezeAnimations();
      }
    }
  }, [isActive, isFrozen, unfreezeAnimations]);
  (0, import_react4.useEffect)(() => {
    if (!isActive) return;
    const style = document.createElement("style");
    style.id = "feedback-cursor-styles";
    style.textContent = `
      body * {
        cursor: crosshair !important;
      }
      body p, body span, body h1, body h2, body h3, body h4, body h5, body h6,
      body li, body td, body th, body label, body blockquote, body figcaption,
      body caption, body legend, body dt, body dd, body pre, body code,
      body em, body strong, body b, body i, body u, body s, body a,
      body time, body address, body cite, body q, body abbr, body dfn,
      body mark, body small, body sub, body sup, body [contenteditable],
      body p *, body span *, body h1 *, body h2 *, body h3 *, body h4 *,
      body h5 *, body h6 *, body li *, body a *, body label *, body pre *,
      body code *, body blockquote *, body [contenteditable] * {
        cursor: text !important;
      }
      [data-feedback-toolbar], [data-feedback-toolbar] * {
        cursor: default !important;
      }
      [data-annotation-marker], [data-annotation-marker] * {
        cursor: pointer !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      const existingStyle = document.getElementById("feedback-cursor-styles");
      if (existingStyle) existingStyle.remove();
    };
  }, [isActive]);
  (0, import_react4.useEffect)(() => {
    if (!isActive || pendingAnnotation) return;
    const handleMouseMove = (e) => {
      if (e.target.closest("[data-feedback-toolbar]")) {
        setHoverInfo(null);
        return;
      }
      const elementUnder = document.elementFromPoint(
        e.clientX,
        e.clientY
      );
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
      if (justFinishedDragRef.current) {
        justFinishedDragRef.current = false;
        return;
      }
      const target = e.target;
      if (target.closest("[data-feedback-toolbar]")) return;
      if (target.closest("[data-annotation-popup]")) return;
      if (target.closest("[data-annotation-marker]")) return;
      const isInteractive = target.closest(
        "button, a, input, select, textarea, [role='button'], [onclick]"
      );
      if (settings.blockInteractions && isInteractive) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (pendingAnnotation) {
        if (isInteractive && !settings.blockInteractions) {
          return;
        }
        e.preventDefault();
        popupRef.current?.shake();
        return;
      }
      if (editingAnnotation) {
        if (isInteractive && !settings.blockInteractions) {
          return;
        }
        e.preventDefault();
        editPopupRef.current?.shake();
        return;
      }
      e.preventDefault();
      const elementUnder = document.elementFromPoint(
        e.clientX,
        e.clientY
      );
      if (!elementUnder) return;
      const { name, path } = identifyElement(elementUnder);
      const rect = elementUnder.getBoundingClientRect();
      const x = e.clientX / window.innerWidth * 100;
      const isFixed = isElementFixed2(elementUnder);
      const y = isFixed ? e.clientY : e.clientY + window.scrollY;
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
        boundingBox: {
          x: rect.left,
          y: isFixed ? rect.top : rect.top + window.scrollY,
          width: rect.width,
          height: rect.height
        },
        nearbyText: getNearbyText(elementUnder),
        cssClasses: getElementClasses(elementUnder),
        isFixed
      });
      setHoverInfo(null);
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [
    isActive,
    pendingAnnotation,
    editingAnnotation,
    settings.blockInteractions
  ]);
  (0, import_react4.useEffect)(() => {
    if (!isActive || pendingAnnotation) return;
    const handleMouseDown = (e) => {
      const target = e.target;
      if (target.closest("[data-feedback-toolbar]")) return;
      if (target.closest("[data-annotation-marker]")) return;
      if (target.closest("[data-annotation-popup]")) return;
      const textTags = /* @__PURE__ */ new Set([
        "P",
        "SPAN",
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
        "LI",
        "TD",
        "TH",
        "LABEL",
        "BLOCKQUOTE",
        "FIGCAPTION",
        "CAPTION",
        "LEGEND",
        "DT",
        "DD",
        "PRE",
        "CODE",
        "EM",
        "STRONG",
        "B",
        "I",
        "U",
        "S",
        "A",
        "TIME",
        "ADDRESS",
        "CITE",
        "Q",
        "ABBR",
        "DFN",
        "MARK",
        "SMALL",
        "SUB",
        "SUP"
      ]);
      if (textTags.has(target.tagName) || target.isContentEditable) {
        return;
      }
      mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isActive, pendingAnnotation]);
  (0, import_react4.useEffect)(() => {
    if (!isActive || pendingAnnotation) return;
    const handleMouseMove = (e) => {
      if (!mouseDownPosRef.current) return;
      const dx = e.clientX - mouseDownPosRef.current.x;
      const dy = e.clientY - mouseDownPosRef.current.y;
      const distance = dx * dx + dy * dy;
      const thresholdSq = DRAG_THRESHOLD * DRAG_THRESHOLD;
      if (!isDragging && distance >= thresholdSq) {
        dragStartRef.current = mouseDownPosRef.current;
        setIsDragging(true);
      }
      if ((isDragging || distance >= thresholdSq) && dragStartRef.current) {
        if (dragRectRef.current) {
          const left2 = Math.min(dragStartRef.current.x, e.clientX);
          const top2 = Math.min(dragStartRef.current.y, e.clientY);
          const width = Math.abs(e.clientX - dragStartRef.current.x);
          const height = Math.abs(e.clientY - dragStartRef.current.y);
          dragRectRef.current.style.transform = `translate(${left2}px, ${top2}px)`;
          dragRectRef.current.style.width = `${width}px`;
          dragRectRef.current.style.height = `${height}px`;
        }
        const now = Date.now();
        if (now - lastElementUpdateRef.current < ELEMENT_UPDATE_THROTTLE) {
          return;
        }
        lastElementUpdateRef.current = now;
        const startX = dragStartRef.current.x;
        const startY = dragStartRef.current.y;
        const left = Math.min(startX, e.clientX);
        const top = Math.min(startY, e.clientY);
        const right = Math.max(startX, e.clientX);
        const bottom = Math.max(startY, e.clientY);
        const midX = (left + right) / 2;
        const midY = (top + bottom) / 2;
        const candidateElements = /* @__PURE__ */ new Set();
        const points = [
          [left, top],
          [right, top],
          [left, bottom],
          [right, bottom],
          [midX, midY],
          [midX, top],
          [midX, bottom],
          [left, midY],
          [right, midY]
        ];
        for (const [x, y] of points) {
          const elements = document.elementsFromPoint(x, y);
          for (const el of elements) {
            if (el instanceof HTMLElement) candidateElements.add(el);
          }
        }
        const allMatching = [];
        const meaningfulTags = /* @__PURE__ */ new Set([
          "BUTTON",
          "A",
          "INPUT",
          "IMG",
          "P",
          "H1",
          "H2",
          "H3",
          "H4",
          "H5",
          "H6",
          "LI",
          "LABEL",
          "TD",
          "TH"
        ]);
        for (const el of candidateElements) {
          if (el.closest("[data-feedback-toolbar]") || el.closest("[data-annotation-marker]"))
            continue;
          const rect = el.getBoundingClientRect();
          if (rect.width > window.innerWidth * 0.8 && rect.height > window.innerHeight * 0.5)
            continue;
          if (rect.width < 10 || rect.height < 10) continue;
          if (rect.left < right && rect.right > left && rect.top < bottom && rect.bottom > top) {
            if (meaningfulTags.has(el.tagName)) {
              let dominated = false;
              for (const existingRect of allMatching) {
                if (existingRect.left <= rect.left && existingRect.right >= rect.right && existingRect.top <= rect.top && existingRect.bottom >= rect.bottom) {
                  dominated = true;
                  break;
                }
              }
              if (!dominated) allMatching.push(rect);
            }
          }
        }
        if (highlightsContainerRef.current) {
          const container = highlightsContainerRef.current;
          while (container.children.length > allMatching.length) {
            container.removeChild(container.lastChild);
          }
          allMatching.forEach((rect, i) => {
            let div = container.children[i];
            if (!div) {
              div = document.createElement("div");
              div.className = styles_module_default4.selectedElementHighlight;
              container.appendChild(div);
            }
            div.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
            div.style.width = `${rect.width}px`;
            div.style.height = `${rect.height}px`;
          });
        }
      }
    };
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isActive, pendingAnnotation, isDragging, DRAG_THRESHOLD]);
  (0, import_react4.useEffect)(() => {
    if (!isActive) return;
    const handleMouseUp = (e) => {
      const wasDragging = isDragging;
      const dragStart = dragStartRef.current;
      if (isDragging && dragStart) {
        justFinishedDragRef.current = true;
        const left = Math.min(dragStart.x, e.clientX);
        const top = Math.min(dragStart.y, e.clientY);
        const right = Math.max(dragStart.x, e.clientX);
        const bottom = Math.max(dragStart.y, e.clientY);
        const allMatching = [];
        const selector = "button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th";
        document.querySelectorAll(selector).forEach((el) => {
          if (!(el instanceof HTMLElement)) return;
          if (el.closest("[data-feedback-toolbar]") || el.closest("[data-annotation-marker]"))
            return;
          const rect = el.getBoundingClientRect();
          if (rect.width > window.innerWidth * 0.8 && rect.height > window.innerHeight * 0.5)
            return;
          if (rect.width < 10 || rect.height < 10) return;
          if (rect.left < right && rect.right > left && rect.top < bottom && rect.bottom > top) {
            allMatching.push({ element: el, rect });
          }
        });
        const finalElements = allMatching.filter(
          ({ element: el }) => !allMatching.some(
            ({ element: other }) => other !== el && el.contains(other)
          )
        );
        const x = e.clientX / window.innerWidth * 100;
        const y = e.clientY + window.scrollY;
        if (finalElements.length > 0) {
          const bounds = finalElements.reduce(
            (acc, { rect }) => ({
              left: Math.min(acc.left, rect.left),
              top: Math.min(acc.top, rect.top),
              right: Math.max(acc.right, rect.right),
              bottom: Math.max(acc.bottom, rect.bottom)
            }),
            {
              left: Infinity,
              top: Infinity,
              right: -Infinity,
              bottom: -Infinity
            }
          );
          const elementNames = finalElements.slice(0, 5).map(({ element }) => identifyElement(element).name).join(", ");
          const suffix = finalElements.length > 5 ? ` +${finalElements.length - 5} more` : "";
          setPendingAnnotation({
            x,
            y,
            clientY: e.clientY,
            element: `${finalElements.length} elements: ${elementNames}${suffix}`,
            elementPath: "multi-select",
            boundingBox: {
              x: bounds.left,
              y: bounds.top + window.scrollY,
              width: bounds.right - bounds.left,
              height: bounds.bottom - bounds.top
            },
            isMultiSelect: true
          });
        } else {
          const width = Math.abs(right - left);
          const height = Math.abs(bottom - top);
          if (width > 20 && height > 20) {
            setPendingAnnotation({
              x,
              y,
              clientY: e.clientY,
              element: "Area selection",
              elementPath: `region at (${Math.round(left)}, ${Math.round(top)})`,
              boundingBox: {
                x: left,
                y: top + window.scrollY,
                width,
                height
              },
              isMultiSelect: true
            });
          }
        }
        setHoverInfo(null);
      } else if (wasDragging) {
        justFinishedDragRef.current = true;
      }
      mouseDownPosRef.current = null;
      dragStartRef.current = null;
      setIsDragging(false);
      if (highlightsContainerRef.current) {
        highlightsContainerRef.current.innerHTML = "";
      }
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [isActive, isDragging]);
  const addAnnotation = (0, import_react4.useCallback)(
    (comment) => {
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
        cssClasses: pendingAnnotation.cssClasses,
        isMultiSelect: pendingAnnotation.isMultiSelect,
        isFixed: pendingAnnotation.isFixed
      };
      setAnnotations((prev) => [...prev, newAnnotation]);
      recentlyAddedIdRef.current = newAnnotation.id;
      setTimeout(() => {
        recentlyAddedIdRef.current = null;
      }, 300);
      setTimeout(() => {
        setAnimatedMarkers((prev) => new Set(prev).add(newAnnotation.id));
      }, 250);
      setPendingExiting(true);
      setTimeout(() => {
        setPendingAnnotation(null);
        setPendingExiting(false);
      }, 150);
      window.getSelection()?.removeAllRanges();
    },
    [pendingAnnotation]
  );
  const cancelAnnotation = (0, import_react4.useCallback)(() => {
    setPendingExiting(true);
    setTimeout(() => {
      setPendingAnnotation(null);
      setPendingExiting(false);
    }, 150);
  }, []);
  const deleteAnnotation = (0, import_react4.useCallback)((id) => {
    setDeletingMarkerId(id);
    setExitingMarkers((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setAnnotations((prev) => prev.filter((a) => a.id !== id));
      setExitingMarkers((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setDeletingMarkerId(null);
    }, 150);
  }, []);
  const startEditAnnotation = (0, import_react4.useCallback)((annotation) => {
    setEditingAnnotation(annotation);
    setHoveredMarkerId(null);
  }, []);
  const updateAnnotation = (0, import_react4.useCallback)(
    (newComment) => {
      if (!editingAnnotation) return;
      setAnnotations(
        (prev) => prev.map(
          (a) => a.id === editingAnnotation.id ? { ...a, comment: newComment } : a
        )
      );
      setEditingAnnotation(null);
    },
    [editingAnnotation]
  );
  const cancelEditAnnotation = (0, import_react4.useCallback)(() => {
    setEditingAnnotation(null);
  }, []);
  const clearAll = (0, import_react4.useCallback)(() => {
    const count = annotations.length;
    if (count === 0) return;
    setIsClearing(true);
    setCleared(true);
    const totalAnimationTime = count * 30 + 200;
    setTimeout(() => {
      setAnnotations([]);
      setAnimatedMarkers(/* @__PURE__ */ new Set());
      localStorage.removeItem(getStorageKey(pathname));
      setIsClearing(false);
    }, totalAnimationTime);
    setTimeout(() => setCleared(false), 1500);
  }, [pathname, annotations.length]);
  const copyOutput = (0, import_react4.useCallback)(async () => {
    const output = generateOutput2(annotations, pathname, settings.outputDetail);
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
    if (settings.autoClearAfterCopy) {
      setTimeout(() => clearAll(), 500);
    }
  }, [
    annotations,
    pathname,
    settings.outputDetail,
    settings.autoClearAfterCopy,
    clearAll
  ]);
  (0, import_react4.useEffect)(() => {
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
  const visibleAnnotations = annotations.filter(
    (a) => !exitingMarkers.has(a.id)
  );
  const exitingAnnotationsList = annotations.filter(
    (a) => exitingMarkers.has(a.id)
  );
  return (0, import_react_dom2.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: styles_module_default4.toolbar, "data-feedback-toolbar": true, children: [
        !isActiveVisible && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          "button",
          {
            className: `${styles_module_default4.toggleButton} ${!isActive ? styles_module_default4.enter : styles_module_default4.exit}`,
            onClick: (e) => {
              e.stopPropagation();
              setIsActive(true);
            },
            title: "Start feedback mode",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconFeedback, { size: 18 }),
              hasAnnotations && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "span",
                {
                  className: styles_module_default4.badge,
                  style: { backgroundColor: settings.annotationColor },
                  children: annotations.length
                }
              )
            ]
          }
        ),
        isActiveVisible && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          "div",
          {
            className: `${styles_module_default4.controls} ${isActive ? styles_module_default4.enter : styles_module_default4.exit}`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "button",
                {
                  className: styles_module_default4.controlButton,
                  onClick: (e) => {
                    e.stopPropagation();
                    toggleFreeze();
                  },
                  title: isFrozen ? "Resume animations" : "Pause animations",
                  "data-active": isFrozen,
                  children: isFrozen ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconPlay, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconPause, { size: 16 })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "button",
                {
                  className: styles_module_default4.controlButton,
                  onClick: (e) => {
                    e.stopPropagation();
                    setShowMarkers(!showMarkers);
                  },
                  title: showMarkers ? "Hide markers" : "Show markers",
                  children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(EyeMorphIcon, { size: 16, visible: showMarkers })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "button",
                {
                  className: styles_module_default4.controlButton,
                  onClick: (e) => {
                    e.stopPropagation();
                    copyOutput();
                  },
                  disabled: !hasAnnotations,
                  title: "Copy feedback",
                  children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(CopyMorphIcon, { size: 16, checked: copied })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "button",
                {
                  className: styles_module_default4.controlButton,
                  onClick: (e) => {
                    e.stopPropagation();
                    clearAll();
                  },
                  disabled: !hasAnnotations,
                  title: "Clear all",
                  "data-danger": true,
                  children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(TrashMorphIcon, { size: 16, checked: cleared })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "button",
                {
                  className: styles_module_default4.controlButton,
                  onClick: (e) => {
                    e.stopPropagation();
                    setShowSettings(!showSettings);
                  },
                  title: "Settings",
                  "data-active": showSettings,
                  children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconSettings, { size: 16 })
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: styles_module_default4.divider }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "button",
                {
                  className: styles_module_default4.controlButton,
                  onClick: (e) => {
                    e.stopPropagation();
                    setIsActive(false);
                  },
                  title: "Exit feedback mode",
                  children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconChevronDown, { size: 16 })
                }
              )
            ]
          }
        ),
        showSettingsVisible && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
          "div",
          {
            className: `${styles_module_default4.settingsPanel} ${styles_module_default4.dark} ${showSettings ? styles_module_default4.enter : styles_module_default4.exit}`,
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: styles_module_default4.settingsHeader, children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                  "svg",
                  {
                    width: "80",
                    height: "14",
                    viewBox: "0 0 124 22",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    "aria-label": "Agentation",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                        "path",
                        {
                          d: "M114.336 16.72V5.368H116.734V7.304H116.844C116.961 7.01067 117.108 6.732 117.284 6.468C117.475 6.18934 117.702 5.95467 117.966 5.764C118.23 5.55867 118.538 5.39734 118.89 5.28C119.242 5.16267 119.653 5.104 120.122 5.104C121.266 5.104 122.19 5.478 122.894 6.226C123.598 6.974 123.95 8.03734 123.95 9.416V16.72H121.552V9.768C121.552 7.964 120.767 7.062 119.198 7.062C118.89 7.062 118.589 7.106 118.296 7.194C118.003 7.26734 117.739 7.38467 117.504 7.546C117.269 7.70734 117.079 7.91267 116.932 8.162C116.8 8.41134 116.734 8.69734 116.734 9.02V16.72H114.336Z",
                          fill: "currentColor"
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                        "path",
                        {
                          d: "M107.656 16.984C106.82 16.984 106.064 16.8447 105.39 16.566C104.73 16.2873 104.165 15.8913 103.696 15.378C103.241 14.8647 102.889 14.2413 102.64 13.508C102.39 12.7747 102.266 11.9533 102.266 11.044C102.266 10.1347 102.39 9.31334 102.64 8.58C102.889 7.84667 103.241 7.22334 103.696 6.71C104.165 6.19667 104.73 5.80067 105.39 5.522C106.064 5.24334 106.82 5.104 107.656 5.104C108.492 5.104 109.24 5.24334 109.9 5.522C110.574 5.80067 111.139 6.19667 111.594 6.71C112.063 7.22334 112.422 7.84667 112.672 8.58C112.921 9.31334 113.046 10.1347 113.046 11.044C113.046 11.9533 112.921 12.7747 112.672 13.508C112.422 14.2413 112.063 14.8647 111.594 15.378C111.139 15.8913 110.574 16.2873 109.9 16.566C109.24 16.8447 108.492 16.984 107.656 16.984ZM107.656 15.092C108.536 15.092 109.232 14.828 109.746 14.3C110.274 13.7573 110.538 12.958 110.538 11.902V10.186C110.538 9.13 110.274 8.338 109.746 7.81C109.232 7.26734 108.536 6.996 107.656 6.996C106.776 6.996 106.072 7.26734 105.544 7.81C105.03 8.338 104.774 9.13 104.774 10.186V11.902C104.774 12.958 105.03 13.7573 105.544 14.3C106.072 14.828 106.776 15.092 107.656 15.092Z",
                          fill: "currentColor"
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                        "path",
                        {
                          d: "M96.9277 3.30019C96.3117 3.30019 95.879 3.17552 95.6297 2.92619C95.395 2.67685 95.2777 2.36885 95.2777 2.00219V1.54019C95.2777 1.17352 95.395 0.86552 95.6297 0.616187C95.879 0.366854 96.3044 0.242188 96.9057 0.242188C97.5217 0.242188 97.947 0.366854 98.1817 0.616187C98.431 0.86552 98.5557 1.17352 98.5557 1.54019V2.00219C98.5557 2.36885 98.431 2.67685 98.1817 2.92619C97.947 3.17552 97.529 3.30019 96.9277 3.30019ZM91.8457 14.7842H95.7177V7.30419H91.8457V5.36819H98.1157V14.7842H101.746V16.7202H91.8457V14.7842Z",
                          fill: "currentColor"
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                        "path",
                        {
                          d: "M85.4743 16.7203C84.4769 16.7203 83.7436 16.4563 83.2743 15.9283C82.8049 15.3856 82.5703 14.6889 82.5703 13.8383V7.30426H79.0723V5.36826H81.5583C81.9836 5.36826 82.2843 5.28759 82.4603 5.12626C82.6363 4.95026 82.7243 4.64226 82.7243 4.20226V1.36426H84.9683V5.36826H89.8083V7.30426H84.9683V14.7843H89.8083V16.7203H85.4743Z",
                          fill: "currentColor"
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                        "path",
                        {
                          d: "M77.586 16.72C76.8967 16.72 76.376 16.544 76.024 16.192C75.6867 15.84 75.4814 15.378 75.408 14.806H75.298C75.078 15.4953 74.6747 16.0307 74.088 16.412C73.516 16.7933 72.7827 16.984 71.888 16.984C70.7294 16.984 69.8054 16.6833 69.116 16.082C68.4267 15.466 68.082 14.6227 68.082 13.552C68.082 12.452 68.4854 11.616 69.292 11.044C70.1134 10.4573 71.3674 10.164 73.054 10.164H75.232V9.284C75.232 7.744 74.418 6.974 72.79 6.974C72.0567 6.974 71.4627 7.12067 71.008 7.414C70.5534 7.69267 70.172 8.06667 69.864 8.536L68.434 7.37C68.7567 6.754 69.2994 6.226 70.062 5.786C70.8247 5.33134 71.8074 5.104 73.01 5.104C74.4474 5.104 75.5767 5.44867 76.398 6.138C77.2194 6.82734 77.63 7.82467 77.63 9.13V14.828H79.06V16.72H77.586ZM72.57 15.224C73.3474 15.224 73.9854 15.048 74.484 14.696C74.9827 14.344 75.232 13.8893 75.232 13.332V11.682H73.098C71.3674 11.682 70.502 12.2027 70.502 13.244V13.684C70.502 14.1973 70.6854 14.586 71.052 14.85C71.4187 15.0993 71.9247 15.224 72.57 15.224Z",
                          fill: "currentColor"
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                        "path",
                        {
                          d: "M62.6129 16.7203C61.6156 16.7203 60.8823 16.4563 60.4129 15.9283C59.9436 15.3856 59.7089 14.6889 59.7089 13.8383V7.30426H56.2109V5.36826H58.6969C59.1223 5.36826 59.4229 5.28759 59.5989 5.12626C59.7749 4.95026 59.8629 4.64226 59.8629 4.20226V1.36426H62.1069V5.36826H66.9469V7.30426H62.1069V14.7843H66.9469V16.7203H62.6129Z",
                          fill: "currentColor"
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                        "path",
                        {
                          d: "M45.7461 16.72V5.368H48.1441V7.304H48.2541C48.3714 7.01067 48.5181 6.732 48.6941 6.468C48.8848 6.18934 49.1121 5.95467 49.3761 5.764C49.6401 5.55867 49.9481 5.39734 50.3001 5.28C50.6521 5.16267 51.0628 5.104 51.5321 5.104C52.6761 5.104 53.6001 5.478 54.3041 6.226C55.0081 6.974 55.3601 8.03734 55.3601 9.416V16.72H52.9621V9.768C52.9621 7.964 52.1774 7.062 50.6081 7.062C50.3001 7.062 49.9994 7.106 49.7061 7.194C49.4128 7.26734 49.1488 7.38467 48.9141 7.546C48.6794 7.70734 48.4888 7.91267 48.3421 8.162C48.2101 8.41134 48.1441 8.69734 48.1441 9.02V16.72H45.7461Z",
                          fill: "currentColor"
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                        "path",
                        {
                          d: "M39.3091 16.984C38.4438 16.984 37.6664 16.8447 36.9771 16.566C36.2878 16.2873 35.7084 15.8913 35.2391 15.378C34.7698 14.8647 34.4104 14.2487 34.1611 13.53C33.9118 12.7967 33.7871 11.9753 33.7871 11.066C33.7871 10.1567 33.9118 9.33534 34.1611 8.602C34.4251 7.86867 34.7844 7.24534 35.2391 6.732C35.7084 6.204 36.2731 5.80067 36.9331 5.522C37.5931 5.24334 38.3264 5.104 39.1331 5.104C39.9251 5.104 40.6438 5.24334 41.2891 5.522C41.9344 5.786 42.4844 6.16734 42.9391 6.666C43.3938 7.16467 43.7384 7.75867 43.9731 8.448C44.2224 9.13734 44.3471 9.9 44.3471 10.736V11.638H36.2071V12.012C36.2071 12.9067 36.4858 13.64 37.0431 14.212C37.6004 14.7693 38.3704 15.048 39.3531 15.048C40.0864 15.048 40.7098 14.894 41.2231 14.586C41.7511 14.2633 42.1764 13.838 42.4991 13.31L43.9951 14.63C43.6138 15.29 43.0271 15.8473 42.2351 16.302C41.4578 16.7567 40.4824 16.984 39.3091 16.984ZM39.1331 6.93C38.7078 6.93 38.3118 7.00334 37.9451 7.15C37.5931 7.29667 37.2851 7.50934 37.0211 7.788C36.7718 8.052 36.5738 8.36734 36.4271 8.734C36.2804 9.10067 36.2071 9.504 36.2071 9.944V10.098H41.9051V9.878C41.9051 8.98334 41.6484 8.272 41.1351 7.744C40.6364 7.20134 39.9691 6.93 39.1331 6.93Z",
                          fill: "currentColor"
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                        "path",
                        {
                          d: "M33.576 17.9525C33.576 19.1258 33.0847 19.9911 32.102 20.5485C31.1193 21.1058 29.6233 21.3845 27.614 21.3845C26.6313 21.3845 25.8027 21.3185 25.128 21.1865C24.468 21.0691 23.9253 20.8931 23.5 20.6585C23.0893 20.4238 22.7887 20.1378 22.598 19.8005C22.422 19.4631 22.334 19.0818 22.334 18.6565C22.334 18.0405 22.5027 17.5565 22.84 17.2045C23.192 16.8671 23.6833 16.6178 24.314 16.4565V16.2365C23.9327 16.0898 23.6247 15.8845 23.39 15.6205C23.17 15.3565 23.06 15.0118 23.06 14.5865C23.06 14.0291 23.2507 13.6111 23.632 13.3325C24.0133 13.0391 24.5047 12.8191 25.106 12.6725V12.5625C24.4167 12.2398 23.8813 11.7851 23.5 11.1985C23.1187 10.6118 22.928 9.90779 22.928 9.08645C22.928 8.48512 23.038 7.94245 23.258 7.45845C23.478 6.95979 23.786 6.54179 24.182 6.20445C24.5927 5.85245 25.0767 5.58112 25.634 5.39045C26.206 5.19979 26.844 5.10445 27.548 5.10445C28.34 5.10445 29.0513 5.22912 29.682 5.47845V5.10445C29.682 4.66445 29.8067 4.29779 30.056 4.00445C30.3053 3.71112 30.6867 3.56445 31.2 3.56445H33.268V5.45645H30.628V5.98445C31.1266 6.32179 31.508 6.75445 31.772 7.28245C32.036 7.79579 32.168 8.39712 32.168 9.08645C32.168 9.68779 32.058 10.2378 31.838 10.7365C31.618 11.2205 31.3026 11.6385 30.892 11.9905C30.496 12.3278 30.012 12.5918 29.44 12.7825C28.8827 12.9585 28.252 13.0465 27.548 13.0465C27.0493 13.0465 26.58 13.0025 26.14 12.9145C25.876 12.9878 25.612 13.1125 25.348 13.2885C25.084 13.4645 24.952 13.7065 24.952 14.0145C24.952 14.3665 25.1207 14.5865 25.458 14.6745C25.7953 14.7625 26.2133 14.8065 26.712 14.8065H29.264C30.7893 14.8065 31.8893 15.0998 32.564 15.6865C33.2387 16.2585 33.576 17.0138 33.576 17.9525ZM31.332 18.1065C31.332 17.7251 31.178 17.4171 30.87 17.1825C30.562 16.9625 30.0047 16.8525 29.198 16.8525H25.26C24.7027 17.1165 24.424 17.5418 24.424 18.1285C24.424 18.5538 24.6 18.9205 24.952 19.2285C25.3187 19.5365 25.92 19.6905 26.756 19.6905H28.538C29.4473 19.6905 30.1367 19.5511 30.606 19.2725C31.09 19.0085 31.332 18.6198 31.332 18.1065ZM27.548 11.3965C28.3253 11.3965 28.8973 11.2131 29.264 10.8465C29.6307 10.4798 29.814 9.98845 29.814 9.37245V8.77845C29.814 8.16245 29.6307 7.67112 29.264 7.30445C28.8973 6.93779 28.3253 6.75445 27.548 6.75445C26.7707 6.75445 26.1987 6.93779 25.832 7.30445C25.4653 7.67112 25.282 8.16245 25.282 8.77845V9.37245C25.282 9.98845 25.4653 10.4798 25.832 10.8465C26.1987 11.2131 26.7707 11.3965 27.548 11.3965Z",
                          fill: "currentColor"
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                        "path",
                        {
                          d: "M20.4278 16.72C19.7385 16.72 19.2178 16.544 18.8658 16.192C18.5285 15.84 18.3232 15.378 18.2498 14.806H18.1398C17.9198 15.4953 17.5165 16.0307 16.9298 16.412C16.3578 16.7933 15.6245 16.984 14.7298 16.984C13.5712 16.984 12.6472 16.6833 11.9578 16.082C11.2685 15.466 10.9238 14.6227 10.9238 13.552C10.9238 12.452 11.3272 11.616 12.1338 11.044C12.9552 10.4573 14.2092 10.164 15.8958 10.164H18.0738V9.284C18.0738 7.744 17.2598 6.974 15.6318 6.974C14.8985 6.974 14.3045 7.12067 13.8498 7.414C13.3952 7.69267 13.0138 8.06667 12.7058 8.536L11.2758 7.37C11.5985 6.754 12.1412 6.226 12.9038 5.786C13.6665 5.33134 14.6492 5.104 15.8518 5.104C17.2892 5.104 18.4185 5.44867 19.2398 6.138C20.0612 6.82734 20.4718 7.82467 20.4718 9.13V14.828H21.9018V16.72H20.4278ZM15.4118 15.224C16.1892 15.224 16.8272 15.048 17.3258 14.696C17.8245 14.344 18.0738 13.8893 18.0738 13.332V11.682H15.9398C14.2092 11.682 13.3438 12.2027 13.3438 13.244V13.684C13.3438 14.1973 13.5272 14.586 13.8938 14.85C14.2605 15.0993 14.7665 15.224 15.4118 15.224Z",
                          fill: "currentColor"
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                        "path",
                        {
                          d: "M0 19.756L7.414 0H9.548L2.134 19.756H0Z",
                          fill: "#4C74FF"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: styles_module_default4.settingsVersion, children: "v1.0.0" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: styles_module_default4.settingsSection, children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: styles_module_default4.settingsLabel, children: "Output Detail" }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: styles_module_default4.settingsOptions, children: OUTPUT_DETAIL_OPTIONS2.map((option) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
                  "button",
                  {
                    className: `${styles_module_default4.settingsOption} ${settings.outputDetail === option.value ? styles_module_default4.selected : ""}`,
                    onClick: () => setSettings((s) => ({ ...s, outputDetail: option.value })),
                    children: [
                      settings.outputDetail === option.value && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconCheck, { size: 10 }),
                      option.label
                    ]
                  },
                  option.value
                )) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: styles_module_default4.settingsSection, children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: styles_module_default4.settingsLabel, children: "Marker Color" }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: styles_module_default4.colorOptions, children: COLOR_OPTIONS2.map((color) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  "button",
                  {
                    className: `${styles_module_default4.colorOption} ${settings.annotationColor === color.value ? styles_module_default4.selected : ""}`,
                    style: { backgroundColor: color.value },
                    onClick: () => setSettings((s) => ({
                      ...s,
                      annotationColor: color.value
                    })),
                    title: color.label
                  },
                  color.value
                )) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: styles_module_default4.settingsSection, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { className: styles_module_default4.settingsToggle, children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings.autoClearAfterCopy,
                    onChange: (e) => setSettings((s) => ({
                      ...s,
                      autoClearAfterCopy: e.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: styles_module_default4.toggleLabel, children: "Clear after copy" })
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: styles_module_default4.settingsSection, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("label", { className: styles_module_default4.settingsToggle, children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  "input",
                  {
                    type: "checkbox",
                    checked: settings.blockInteractions,
                    onChange: (e) => setSettings((s) => ({
                      ...s,
                      blockInteractions: e.target.checked
                    }))
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: styles_module_default4.toggleLabel, children: "Block page interactions" })
              ] }) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: styles_module_default4.markersLayer, "data-feedback-toolbar": true, children: [
        markersVisible && visibleAnnotations.filter((a) => !a.isFixed).map((annotation, index) => {
          const isHovered = !markersExiting && hoveredMarkerId === annotation.id;
          const isDeleting = deletingMarkerId === annotation.id;
          const showDeleteState = isHovered || isDeleting;
          const isMulti = annotation.isMultiSelect;
          const markerColor = isMulti ? "#34C759" : settings.annotationColor;
          const globalIndex = annotations.findIndex(
            (a) => a.id === annotation.id
          );
          const needsEnterAnimation = !animatedMarkers.has(annotation.id);
          const animClass = markersExiting ? styles_module_default4.exit : isClearing ? styles_module_default4.clearing : needsEnterAnimation ? styles_module_default4.enter : "";
          return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
            "div",
            {
              className: `${styles_module_default4.marker} ${showDeleteState ? styles_module_default4.hovered : ""} ${isMulti ? styles_module_default4.multiSelect : ""} ${animClass}`,
              "data-annotation-marker": true,
              style: {
                left: `${annotation.x}%`,
                top: annotation.y,
                backgroundColor: showDeleteState ? void 0 : markerColor,
                animationDelay: markersExiting ? `${(visibleAnnotations.length - 1 - index) * 20}ms` : `${index * 20}ms`
              },
              onMouseEnter: () => !markersExiting && annotation.id !== recentlyAddedIdRef.current && setHoveredMarkerId(annotation.id),
              onMouseLeave: () => setHoveredMarkerId(null),
              onClick: (e) => {
                e.stopPropagation();
                if (!markersExiting) deleteAnnotation(annotation.id);
              },
              onContextMenu: (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!markersExiting) startEditAnnotation(annotation);
              },
              children: [
                showDeleteState ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconClose, { size: isMulti ? 12 : 10 }) : globalIndex + 1,
                isHovered && !editingAnnotation && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: `${styles_module_default4.markerTooltip} ${styles_module_default4.enter}`, children: [
                  annotation.selectedText && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: styles_module_default4.markerQuote, children: [
                    "\u201C",
                    annotation.selectedText.slice(0, 50),
                    annotation.selectedText.length > 50 ? "..." : "",
                    "\u201D"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: styles_module_default4.markerNote, children: annotation.comment }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: styles_module_default4.markerHint, children: "Click to remove \xB7 Right-click to edit" })
                ] })
              ]
            },
            annotation.id
          );
        }),
        markersVisible && !markersExiting && exitingAnnotationsList.filter((a) => !a.isFixed).map((annotation) => {
          const isMulti = annotation.isMultiSelect;
          return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "div",
            {
              className: `${styles_module_default4.marker} ${styles_module_default4.hovered} ${isMulti ? styles_module_default4.multiSelect : ""} ${styles_module_default4.exit}`,
              "data-annotation-marker": true,
              style: {
                left: `${annotation.x}%`,
                top: annotation.y
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconClose, { size: isMulti ? 12 : 10 })
            },
            annotation.id
          );
        })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: styles_module_default4.fixedMarkersLayer, "data-feedback-toolbar": true, children: [
        markersVisible && visibleAnnotations.filter((a) => a.isFixed).map((annotation, index) => {
          const fixedAnnotations = visibleAnnotations.filter(
            (a) => a.isFixed
          );
          const isHovered = !markersExiting && hoveredMarkerId === annotation.id;
          const isDeleting = deletingMarkerId === annotation.id;
          const showDeleteState = isHovered || isDeleting;
          const isMulti = annotation.isMultiSelect;
          const markerColor = isMulti ? "#34C759" : settings.annotationColor;
          const globalIndex = annotations.findIndex(
            (a) => a.id === annotation.id
          );
          const needsEnterAnimation = !animatedMarkers.has(annotation.id);
          const animClass = markersExiting ? styles_module_default4.exit : isClearing ? styles_module_default4.clearing : needsEnterAnimation ? styles_module_default4.enter : "";
          return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
            "div",
            {
              className: `${styles_module_default4.marker} ${styles_module_default4.fixed} ${showDeleteState ? styles_module_default4.hovered : ""} ${isMulti ? styles_module_default4.multiSelect : ""} ${animClass}`,
              "data-annotation-marker": true,
              style: {
                left: `${annotation.x}%`,
                top: annotation.y,
                backgroundColor: showDeleteState ? void 0 : markerColor,
                animationDelay: markersExiting ? `${(fixedAnnotations.length - 1 - index) * 20}ms` : `${index * 20}ms`
              },
              onMouseEnter: () => !markersExiting && annotation.id !== recentlyAddedIdRef.current && setHoveredMarkerId(annotation.id),
              onMouseLeave: () => setHoveredMarkerId(null),
              onClick: (e) => {
                e.stopPropagation();
                if (!markersExiting) deleteAnnotation(annotation.id);
              },
              onContextMenu: (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!markersExiting) startEditAnnotation(annotation);
              },
              children: [
                showDeleteState ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconClose, { size: isMulti ? 12 : 10 }) : globalIndex + 1,
                isHovered && !editingAnnotation && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: `${styles_module_default4.markerTooltip} ${styles_module_default4.enter}`, children: [
                  annotation.selectedText && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("span", { className: styles_module_default4.markerQuote, children: [
                    "\u201C",
                    annotation.selectedText.slice(0, 50),
                    annotation.selectedText.length > 50 ? "..." : "",
                    "\u201D"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: styles_module_default4.markerNote, children: annotation.comment }),
                  /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: styles_module_default4.markerHint, children: "Click to remove \xB7 Right-click to edit" })
                ] })
              ]
            },
            annotation.id
          );
        }),
        markersVisible && !markersExiting && exitingAnnotationsList.filter((a) => a.isFixed).map((annotation) => {
          const isMulti = annotation.isMultiSelect;
          return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "div",
            {
              className: `${styles_module_default4.marker} ${styles_module_default4.fixed} ${styles_module_default4.hovered} ${isMulti ? styles_module_default4.multiSelect : ""} ${styles_module_default4.exit}`,
              "data-annotation-marker": true,
              style: {
                left: `${annotation.x}%`,
                top: annotation.y
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconClose, { size: isMulti ? 12 : 10 })
            },
            annotation.id
          );
        })
      ] }),
      isActive && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: styles_module_default4.overlay, "data-feedback-toolbar": true, children: [
        hoverInfo?.rect && !pendingAnnotation && !isScrolling && !isDragging && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "div",
          {
            className: `${styles_module_default4.hoverHighlight} ${styles_module_default4.enter}`,
            style: {
              left: hoverInfo.rect.left,
              top: hoverInfo.rect.top,
              width: hoverInfo.rect.width,
              height: hoverInfo.rect.height,
              borderColor: `${settings.annotationColor}80`,
              backgroundColor: `${settings.annotationColor}0A`
            }
          }
        ),
        hoveredMarkerId && !pendingAnnotation && (() => {
          const hoveredAnnotation = annotations.find(
            (a) => a.id === hoveredMarkerId
          );
          if (!hoveredAnnotation?.boundingBox) return null;
          const bb = hoveredAnnotation.boundingBox;
          const isMulti = hoveredAnnotation.isMultiSelect;
          return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "div",
            {
              className: `${isMulti ? styles_module_default4.multiSelectOutline : styles_module_default4.singleSelectOutline} ${styles_module_default4.enter}`,
              style: {
                left: bb.x,
                top: bb.y - scrollY,
                width: bb.width,
                height: bb.height,
                ...isMulti ? {} : {
                  borderColor: `${settings.annotationColor}99`,
                  backgroundColor: `${settings.annotationColor}0D`
                }
              }
            }
          );
        })(),
        hoverInfo && !pendingAnnotation && !isScrolling && !isDragging && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "div",
          {
            className: `${styles_module_default4.hoverTooltip} ${styles_module_default4.enter}`,
            style: {
              left: Math.min(hoverPosition.x, window.innerWidth - 150),
              top: Math.max(hoverPosition.y - 32, 8)
            },
            children: hoverInfo.element
          }
        ),
        pendingAnnotation && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
          pendingAnnotation.boundingBox && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "div",
            {
              className: `${pendingAnnotation.isMultiSelect ? styles_module_default4.multiSelectOutline : styles_module_default4.singleSelectOutline} ${pendingExiting ? styles_module_default4.exit : styles_module_default4.enter}`,
              style: {
                left: pendingAnnotation.boundingBox.x,
                top: pendingAnnotation.boundingBox.y - scrollY,
                width: pendingAnnotation.boundingBox.width,
                height: pendingAnnotation.boundingBox.height,
                ...pendingAnnotation.isMultiSelect ? {} : {
                  borderColor: `${settings.annotationColor}99`,
                  backgroundColor: `${settings.annotationColor}0D`
                }
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "div",
            {
              className: `${styles_module_default4.marker} ${styles_module_default4.pending} ${pendingAnnotation.isMultiSelect ? styles_module_default4.multiSelect : ""} ${pendingExiting ? styles_module_default4.exit : styles_module_default4.enter}`,
              style: {
                left: `${pendingAnnotation.x}%`,
                top: pendingAnnotation.clientY,
                backgroundColor: pendingAnnotation.isMultiSelect ? "#34C759" : settings.annotationColor
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconPlus, { size: 12 })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            AnnotationPopupCSS,
            {
              ref: popupRef,
              element: pendingAnnotation.element,
              selectedText: pendingAnnotation.selectedText,
              placeholder: pendingAnnotation.element === "Area selection" ? "What should change in this area?" : pendingAnnotation.isMultiSelect ? "Feedback for this group of elements..." : "What should change?",
              onSubmit: addAnnotation,
              onCancel: cancelAnnotation,
              accentColor: pendingAnnotation.isMultiSelect ? "#34C759" : settings.annotationColor,
              style: {
                left: `${Math.min(Math.max(pendingAnnotation.x, 15), 85)}%`,
                top: Math.min(
                  pendingAnnotation.clientY + 20,
                  window.innerHeight - 180
                )
              }
            }
          )
        ] }),
        editingAnnotation && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
          editingAnnotation.boundingBox && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "div",
            {
              className: `${editingAnnotation.isMultiSelect ? styles_module_default4.multiSelectOutline : styles_module_default4.singleSelectOutline} ${styles_module_default4.enter}`,
              style: {
                left: editingAnnotation.boundingBox.x,
                top: editingAnnotation.boundingBox.y - scrollY,
                width: editingAnnotation.boundingBox.width,
                height: editingAnnotation.boundingBox.height,
                ...editingAnnotation.isMultiSelect ? {} : {
                  borderColor: `${settings.annotationColor}99`,
                  backgroundColor: `${settings.annotationColor}0D`
                }
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            AnnotationPopupCSS,
            {
              ref: editPopupRef,
              element: editingAnnotation.element,
              selectedText: editingAnnotation.selectedText,
              placeholder: "Edit your feedback...",
              initialValue: editingAnnotation.comment,
              submitLabel: "Save",
              onSubmit: updateAnnotation,
              onCancel: cancelEditAnnotation,
              accentColor: editingAnnotation.isMultiSelect ? "#34C759" : settings.annotationColor,
              style: {
                left: `${Math.min(Math.max(editingAnnotation.x, 15), 85)}%`,
                top: Math.min(
                  (editingAnnotation.isFixed ? editingAnnotation.y : editingAnnotation.y - scrollY) + 20,
                  window.innerHeight - 180
                )
              }
            }
          )
        ] }),
        isDragging && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { ref: dragRectRef, className: styles_module_default4.dragSelection }),
          /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "div",
            {
              ref: highlightsContainerRef,
              className: styles_module_default4.highlightsContainer
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
  IconCheck,
  IconChevronDown,
  IconClose,
  IconDocument,
  IconExternal,
  IconFeedback,
  IconPalette,
  IconPause,
  IconPlay,
  IconPlus,
  IconSettings,
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
//# sourceMappingURL=index.js.map