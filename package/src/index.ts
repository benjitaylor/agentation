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

// React compatibility wrapper. The toolbar itself is a framework-neutral
// custom element mounted and cleaned up by this lifecycle adapter.
export { Agentation, PageFeedbackToolbarCSS } from "./react";
export type { AgentationProps, DemoAnnotation } from "./react";

// Framework-neutral browser interface
export { defineAgentationElement, mountAgentation } from "./browser/runtime";
export type {
  AgentationConfig,
  AgentationController,
  AgentationElement,
  AgentationEvent,
  AgentationEventDetail,
  ElementMetadata,
  ElementMetadataAdapter,
} from "./browser/types";
export { createReactMetadataAdapter } from "./metadata/react";

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
  // Shadow DOM support
  isInShadowDOM,
  getShadowHost,
  closestCrossingShadow,
} from "./utils/element-identification";

export {
  loadAnnotations,
  saveAnnotations,
  getStorageKey,
} from "./utils/storage";

// Types
export type {
  Annotation,
  FrameworkMetadata,
  OutputDetailLevel,
  SourceLocation,
} from "./types";
