// =============================================================================
// Agentation
// =============================================================================
//
// A floating toolbar for annotating web pages and collecting structured feedback
// for AI coding agents.
//
// Usage (with framer-motion - smoother animations):
//   import { Agentation } from 'agentation';
//   <Agentation />
//
// Usage (CSS-only - zero runtime deps):
//   import { AgentationCSS } from 'agentation';
//   <AgentationCSS />
//
// =============================================================================

// Main components
// Framer-motion version (default - smoother animations, requires framer-motion peer dep)
export { PageFeedbackToolbar as Agentation } from "./components/page-toolbar";
export { PageFeedbackToolbar as FeedbackToolbar } from "./components/page-toolbar"; // legacy alias
export { PageFeedbackToolbar } from "./components/page-toolbar"; // legacy alias

// CSS-only version (no framer-motion dependency)
export { PageFeedbackToolbarCSS as AgentationCSS } from "./components/page-toolbar/index-css";
export { PageFeedbackToolbarCSS } from "./components/page-toolbar/index-css";

// Shared components (for building custom UIs)
export { AnnotationPopup, AnnotationPopupPresence } from "./components/annotation-popup";
export { AnnotationPopupCSS } from "./components/annotation-popup/index-css";
export type { AnnotationPopupProps, AnnotationPopupHandle } from "./components/annotation-popup";

// Icons
export * from "./components/icons";
export * as IconsCSS from "./components/icons-css";

// Utilities (for building custom UIs)
export {
  identifyElement,
  identifyAnimationElement,
  getElementPath,
  getNearbyText,
  getElementClasses,
} from "./utils/element-identification";

export {
  loadAnnotations,
  saveAnnotations,
  getStorageKey,
} from "./utils/storage";

// Types
export type { Annotation } from "./types";
