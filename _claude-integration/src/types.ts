/**
 * Annotation type - matches the core agentation package
 */
export interface Annotation {
  id: string;
  x: number;
  y: number;
  comment: string;
  element: string;
  elementPath: string;
  timestamp: number;
  selectedText?: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
  nearbyText?: string;
  cssClasses?: string;
  nearbyElements?: string;
  computedStyles?: string;
  fullPath?: string;
  accessibility?: string;
  isMultiSelect?: boolean;
  isFixed?: boolean;
}

/**
 * Page feedback - annotations grouped by URL
 */
export interface PageFeedback {
  url: string;
  pathname: string;
  viewport?: { width: number; height: number };
  userAgent?: string;
  timestamp: number;
  annotations: Annotation[];
}

/**
 * Payload sent from browser to server
 */
export interface SyncPayload {
  url: string;
  pathname: string;
  viewport?: { width: number; height: number };
  userAgent?: string;
  annotations: Annotation[];
}

/**
 * Server configuration
 */
export interface ServerConfig {
  httpPort: number;
  verbose: boolean;
}
