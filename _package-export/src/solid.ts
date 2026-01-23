// =============================================================================
// Agentation - SolidJS
// =============================================================================
//
// SolidJS version of the Agentation floating toolbar for annotating web pages
// and collecting structured feedback for AI coding agents.
//
// Usage:
//   import { Agentation } from 'agentation/solid';
//   <Agentation />
//
// =============================================================================

// Main components
export { PageFeedbackToolbarCSS as Agentation } from "./components/solid/page-toolbar-css";
export { PageFeedbackToolbarCSS } from "./components/solid/page-toolbar-css";
export type { DemoAnnotation } from "./components/solid/page-toolbar-css";

// Shared components (for building custom UIs)
export { AnnotationPopupCSS } from "./components/solid/annotation-popup-css";
export type {
  AnnotationPopupCSSProps,
  AnnotationPopupCSSHandle,
} from "./components/solid/annotation-popup-css";

// Icons (Solid version)
export * from "./components/solid/icons";

// Utilities (for building custom UIs) - shared with React version
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

// Types - shared with React version
export type { Annotation } from "./types";
