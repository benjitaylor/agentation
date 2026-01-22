// =============================================================================
// Agentation - Svelte Version
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
export { default as Agentation } from "./components/page-toolbar-css/PageFeedbackToolbarCSS.svelte";
export { default as PageFeedbackToolbarCSS } from "./components/page-toolbar-css/PageFeedbackToolbarCSS.svelte";
export type { DemoAnnotation } from "./components/page-toolbar-css/PageFeedbackToolbarCSS.svelte";

// Shared components (for building custom UIs)
export { default as AnnotationPopupCSS } from "./components/annotation-popup-css/AnnotationPopupCSS.svelte";

// Icons (Svelte components)
export {
  IconClose,
  IconPlus,
  IconCheck,
  IconCheckSmall,
  IconListSparkle,
  IconHelp,
  IconCheckSmallAnimated,
  IconCopyAlt,
  IconCopyAnimated,
  IconEye,
  IconEyeAlt,
  IconEyeClosed,
  IconEyeAnimated,
  IconPausePlayAnimated,
  IconEyeMinus,
  IconGear,
  IconPauseAlt,
  IconPause,
  IconPlayAlt,
  IconTrashAlt,
  IconChatEllipsis,
  IconCheckmark,
  IconCheckmarkLarge,
  IconCheckmarkCircle,
  IconXmark,
  IconXmarkLarge,
  IconSun,
  IconMoon,
  AnimatedBunny,
} from "./components/icons.svelte";

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
