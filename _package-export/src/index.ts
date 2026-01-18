// =============================================================================
// @benji/feedback-tool
// =============================================================================
//
// A floating toolbar for annotating web pages and collecting structured feedback.
//
// Usage:
//   import { FeedbackToolbar } from '@benji/feedback-tool';
//   <FeedbackToolbar />
//
// =============================================================================

// Main component
export { PageFeedbackToolbar as FeedbackToolbar } from "./components/page-toolbar";
export { PageFeedbackToolbar } from "./components/page-toolbar"; // backwards compat

// Shared components (for building custom UIs)
export { AnnotationPopup, AnnotationPopupPresence } from "./components/annotation-popup";
export type { AnnotationPopupProps, AnnotationPopupHandle } from "./components/annotation-popup";

// Icons (for building custom UIs)
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
