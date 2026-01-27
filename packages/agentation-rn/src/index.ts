export { Agentation } from './components/Agentation';
export { AgenationView } from './components/AgenationView';
export type { AgenationViewProps } from './components/AgenationView';

export type {
  Annotation,
  DemoAnnotation,
  OutputDetailLevel,
  AgenationProps,
  AgentationProps,
  AnnotationMarkerProps,
  AnnotationPopupProps,
  CodeInfo,
  ComponentDetection,
  MarkdownOutput,
  StorageKey,
  AgenationSettings,
} from './types';

export { DEFAULT_SETTINGS } from './types';

export { useAnnotations } from './hooks/useAnnotations';
export type { UseAnnotationsOptions, UseAnnotationsReturn } from './hooks/useAnnotations';
export { useAgentationScroll } from './hooks/useAgentationScroll';
export type { UseAgentationScrollReturn } from './hooks/useAgentationScroll';

export { AgenationContext } from './context/AgenationContext';
export type { AgenationContextValue } from './context/AgenationContext';

export {
  detectComponent,
  formatElementPath,
  formatElementPathWithColumn,
  getComponentType,
  isComponentDetectionAvailable,
  getDetectionErrorMessage,
  detectComponentAtPoint,
} from './utils/componentDetection';

export {
  detectComponent as identifyElement,
  formatElementPath as getElementPath,
} from './utils/componentDetection';

export { generateMarkdown } from './utils/markdownGeneration';

export {
  saveAnnotations,
  loadAnnotations,
  getStorageKey,
  saveSettings,
  loadSettings,
} from './utils/storage';

export {
  getNavigationInfo,
  reactNavigationResolver,
  expoRouterResolver,
} from './utils/navigationDetection';
export type { NavigationInfo, NavigationResolver } from './utils/navigationDetection';

export {
  generateId,
  getTimestamp,
  copyToClipboard,
} from './utils/helpers';

