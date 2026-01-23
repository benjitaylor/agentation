// =============================================================================
// Agentation
// =============================================================================
//
// A floating toolbar for annotating web pages and collecting structured feedback
// for AI coding agents.
//
// Usage:
//   import { Agentation } from 'agentation';
//   <Agentation />
//
// =============================================================================

// Main components
// CSS-only version (default - zero runtime deps)
export { PageFeedbackToolbarCSS as Agentation } from "./components/page-toolbar-css";
export { PageFeedbackToolbarCSS } from "./components/page-toolbar-css";
export type { DemoAnnotation, AgentationProps } from "./components/page-toolbar-css";

// Shared components (for building custom UIs)
export { AnnotationPopupCSS } from "./components/annotation-popup-css";
export type {
  AnnotationPopupCSSProps,
  AnnotationPopupCSSHandle,
} from "./components/annotation-popup-css";

// Icons (same for both versions - they're pure SVG)
export * from "./components/icons";

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
