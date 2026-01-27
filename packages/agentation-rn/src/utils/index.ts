export {
  detectComponent,
  formatElementPath,
  formatElementPathWithColumn,
  getComponentType,
  isComponentDetectionAvailable,
  getDetectionErrorMessage,
  detectComponentAtPoint,
} from './componentDetection';

export { generateMarkdown } from './markdownGeneration';

export {
  saveAnnotations,
  loadAnnotations,
  getStorageKey,
  saveSettings,
  loadSettings,
} from './storage';

export {
  getNavigationInfo,
  reactNavigationResolver,
  expoRouterResolver,
} from './navigationDetection';
export type { NavigationInfo, NavigationResolver } from './navigationDetection';

export {
  generateId,
  getTimestamp,
  copyToClipboard,
  formatDetectedElement,
} from './helpers';

export {
  SPRING_BOUNCY,
  SPRING_SMOOTH,
  TIMING,
  DELAYS,
} from './animations';

export { debugLog, debugWarn, debugError } from './debug';
