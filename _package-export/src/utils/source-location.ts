// =============================================================================
// Source Location Detection Utilities
// =============================================================================
//
// This module provides utilities for detecting React source file locations from
// DOM elements. It works by accessing React's internal fiber tree and extracting
// _debugSource information that's available in development builds.
//
// Compatibility:
// - React 16.8+ (Hooks era)
// - React 17.x
// - React 18.x
// - React 19.x (with fallbacks for changed internals)
//
// Limitations:
// - Only works in development builds (production builds strip _debugSource)
// - Requires React DevTools-style fiber access
// - Some bundlers may strip debug info even in development
// =============================================================================

/**
 * Source location information for a React component
 */
export interface SourceLocation {
  /** Absolute or relative file path */
  fileName: string;
  /** Line number (1-indexed) */
  lineNumber: number;
  /** Column number (0-indexed, may be undefined) */
  columnNumber?: number;
  /** Component display name if available */
  componentName?: string;
  /** React version detected */
  reactVersion?: string;
}

/**
 * Result of source location detection
 */
export interface SourceLocationResult {
  /** Whether source location was found */
  found: boolean;
  /** Source location data (if found) */
  source?: SourceLocation;
  /** Reason if not found */
  reason?: SourceLocationNotFoundReason;
  /** Whether the app appears to be a React app */
  isReactApp: boolean;
  /** Whether running in production mode */
  isProduction: boolean;
}

/**
 * Reasons why source location might not be found
 */
export type SourceLocationNotFoundReason =
  | "not-react-app"
  | "production-build"
  | "no-fiber"
  | "no-debug-source"
  | "react-19-changed"
  | "element-not-in-react-tree"
  | "unknown";

/**
 * React Fiber node structure (partial, for type safety)
 * Based on React's internal FiberNode type
 */
interface ReactFiber {
  // Debug source info (only in development)
  _debugSource?: {
    fileName: string;
    lineNumber: number;
    columnNumber?: number;
  };
  // Owner info (React 19 may use this differently)
  _debugOwner?: ReactFiber;
  // Component type
  type?: {
    name?: string;
    displayName?: string;
    // For class components
    prototype?: {
      isReactComponent?: boolean;
    };
  } | string | null;
  // Element type for built-in elements
  elementType?: unknown;
  // Tag indicating fiber type
  tag?: number;
  // Fiber tree navigation
  return?: ReactFiber | null;
  child?: ReactFiber | null;
  sibling?: ReactFiber | null;
  // Memoized props (for context)
  memoizedProps?: Record<string, unknown>;
  // State node for class components
  stateNode?: unknown;
}

/**
 * Extended HTMLElement with React fiber properties
 */
interface ReactDOMElement extends HTMLElement {
  // React 16-17 fiber key
  __reactFiber$?: string;
  // React 18+ fiber key pattern
  __reactFiber?: ReactFiber;
  // React internal instance (older pattern)
  __reactInternalInstance$?: string;
  // Alternative patterns
  _reactRootContainer?: unknown;
}

// React fiber tag constants (for reference)
const FIBER_TAGS = {
  FunctionComponent: 0,
  ClassComponent: 1,
  IndeterminateComponent: 2,
  HostRoot: 3,
  HostPortal: 4,
  HostComponent: 5,
  HostText: 6,
  Fragment: 7,
  Mode: 8,
  ContextConsumer: 9,
  ContextProvider: 10,
  ForwardRef: 11,
  Profiler: 12,
  SuspenseComponent: 13,
  MemoComponent: 14,
  SimpleMemoComponent: 15,
  LazyComponent: 16,
} as const;

/**
 * Checks if the page appears to be running a React application
 *
 * @returns Object with detection results
 */
export function detectReactApp(): {
  isReact: boolean;
  version?: string;
  isProduction: boolean;
} {
  if (typeof window === "undefined") {
    return { isReact: false, isProduction: true };
  }

  // Check for React DevTools hook (most reliable)
  const devToolsHook = (window as unknown as Record<string, unknown>).__REACT_DEVTOOLS_GLOBAL_HOOK__;

  if (devToolsHook && typeof devToolsHook === "object") {
    const hook = devToolsHook as Record<string, unknown>;

    // Check for renderers (React 16+)
    const renderers = hook.renderers as Map<number, { version?: string }> | undefined;
    if (renderers && renderers.size > 0) {
      // Get version from first renderer
      const firstRenderer = renderers.values().next().value;
      const version = firstRenderer?.version;

      // Check for production mode via lack of development tools
      const isProduction = !hook.supportsFiber;

      return {
        isReact: true,
        version: version || "unknown",
        isProduction,
      };
    }
  }

  // Fallback: Check for React root markers on DOM
  const hasReactRoot = document.querySelector("[data-reactroot]") !== null;
  const hasReactContainer = document.getElementById("root")?._reactRootContainer !== undefined;

  // Check for fiber keys on body's children
  const bodyChildren = document.body.children;
  let hasFiberKey = false;

  for (let i = 0; i < bodyChildren.length && !hasFiberKey; i++) {
    const child = bodyChildren[i];
    const keys = Object.keys(child);
    hasFiberKey = keys.some(
      (key) => key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$")
    );
  }

  if (hasReactRoot || hasReactContainer || hasFiberKey) {
    return {
      isReact: true,
      version: "unknown",
      // Assume production if we can't detect dev tools
      isProduction: !devToolsHook,
    };
  }

  return { isReact: false, isProduction: true };
}

/**
 * Gets the React fiber node associated with a DOM element
 *
 * @param element - DOM element to get fiber for
 * @returns React fiber node or null if not found
 */
export function getFiberFromElement(element: HTMLElement): ReactFiber | null {
  if (!element || typeof element !== "object") {
    return null;
  }

  const keys = Object.keys(element);

  // React 18+ uses __reactFiber$ prefix
  const fiberKey = keys.find((key) => key.startsWith("__reactFiber$"));
  if (fiberKey) {
    return (element as unknown as Record<string, ReactFiber>)[fiberKey] || null;
  }

  // React 16-17 uses __reactInternalInstance$ prefix
  const instanceKey = keys.find((key) => key.startsWith("__reactInternalInstance$"));
  if (instanceKey) {
    return (element as unknown as Record<string, ReactFiber>)[instanceKey] || null;
  }

  // React 19 may use different patterns - check for any fiber-like object
  const possibleFiberKey = keys.find((key) => {
    if (!key.startsWith("__react")) return false;
    const value = (element as unknown as Record<string, unknown>)[key];
    return value && typeof value === "object" && "_debugSource" in (value as object);
  });

  if (possibleFiberKey) {
    return (element as unknown as Record<string, ReactFiber>)[possibleFiberKey] || null;
  }

  return null;
}

/**
 * Gets the display name of a React component from its fiber
 *
 * @param fiber - React fiber node
 * @returns Component name or null
 */
function getComponentName(fiber: ReactFiber): string | null {
  if (!fiber.type) {
    return null;
  }

  // String type means host component (div, span, etc.)
  if (typeof fiber.type === "string") {
    return null; // We want React component names, not HTML tags
  }

  // Function/class component
  if (typeof fiber.type === "object" || typeof fiber.type === "function") {
    const type = fiber.type as { displayName?: string; name?: string };

    // Prefer displayName (set by React DevTools or manually)
    if (type.displayName) {
      return type.displayName;
    }

    // Fall back to function/class name
    if (type.name) {
      return type.name;
    }
  }

  return null;
}

/**
 * Walks up the fiber tree to find the nearest component with _debugSource
 *
 * @param fiber - Starting fiber node
 * @param maxDepth - Maximum tree depth to traverse (default: 50)
 * @returns Object with source info and component name, or null
 */
function findDebugSource(
  fiber: ReactFiber,
  maxDepth = 50
): { source: ReactFiber["_debugSource"]; componentName: string | null } | null {
  let current: ReactFiber | null | undefined = fiber;
  let depth = 0;

  while (current && depth < maxDepth) {
    // Check current fiber for debug source
    if (current._debugSource) {
      return {
        source: current._debugSource,
        componentName: getComponentName(current),
      };
    }

    // Check debug owner (for components that wrap the element)
    if (current._debugOwner?._debugSource) {
      return {
        source: current._debugOwner._debugSource,
        componentName: getComponentName(current._debugOwner),
      };
    }

    // Move up the tree
    current = current.return;
    depth++;
  }

  return null;
}

/**
 * Attempts to find source location using React 19's potentially different structure
 *
 * @param fiber - Starting fiber node
 * @returns Source location info or null
 */
function findDebugSourceReact19(
  fiber: ReactFiber
): { source: ReactFiber["_debugSource"]; componentName: string | null } | null {
  // React 19 may store debug info differently
  // This is a forward-compatible attempt based on React 19 RFCs

  let current: ReactFiber | null | undefined = fiber;
  let depth = 0;
  const maxDepth = 50;

  while (current && depth < maxDepth) {
    // Check for new React 19 debug patterns
    const anyFiber = current as unknown as Record<string, unknown>;

    // Possible React 19 locations for debug info
    const possibleSourceKeys = [
      "_debugSource",
      "__source",
      "_source",
      "debugSource",
    ];

    for (const key of possibleSourceKeys) {
      const source = anyFiber[key];
      if (source && typeof source === "object" && "fileName" in source) {
        return {
          source: source as ReactFiber["_debugSource"],
          componentName: getComponentName(current),
        };
      }
    }

    // Check if debug info is in the element itself
    if (current.memoizedProps) {
      const props = current.memoizedProps as Record<string, unknown>;
      if (props.__source && typeof props.__source === "object") {
        const source = props.__source as { fileName?: string; lineNumber?: number };
        if (source.fileName && source.lineNumber) {
          return {
            source: {
              fileName: source.fileName,
              lineNumber: source.lineNumber,
              columnNumber: (source as { columnNumber?: number }).columnNumber,
            },
            componentName: getComponentName(current),
          };
        }
      }
    }

    current = current.return;
    depth++;
  }

  return null;
}

/**
 * Gets the source file location for a DOM element in a React application
 *
 * This function attempts to extract the source file path and line number
 * where a React component is defined. This only works in development mode
 * as production builds strip debug information.
 *
 * @param element - DOM element to get source location for
 * @returns SourceLocationResult with location info or reason for failure
 *
 * @example
 * ```ts
 * const result = getSourceLocation(element);
 * if (result.found && result.source) {
 *   console.log(`${result.source.fileName}:${result.source.lineNumber}`);
 *   // Output: "/src/components/Button.tsx:42"
 * }
 * ```
 */
export function getSourceLocation(element: HTMLElement): SourceLocationResult {
  // Detect React environment
  const reactInfo = detectReactApp();

  if (!reactInfo.isReact) {
    return {
      found: false,
      reason: "not-react-app",
      isReactApp: false,
      isProduction: true,
    };
  }

  if (reactInfo.isProduction) {
    return {
      found: false,
      reason: "production-build",
      isReactApp: true,
      isProduction: true,
    };
  }

  // Get fiber from element
  const fiber = getFiberFromElement(element);

  if (!fiber) {
    // Element might not be part of React tree (e.g., injected by extension)
    return {
      found: false,
      reason: "no-fiber",
      isReactApp: true,
      isProduction: false,
    };
  }

  // Try standard React 16-18 debug source finding
  let debugInfo = findDebugSource(fiber);

  // If not found, try React 19 patterns
  if (!debugInfo) {
    debugInfo = findDebugSourceReact19(fiber);
  }

  if (!debugInfo || !debugInfo.source) {
    // Check if this might be React 19 with changed internals
    const majorVersion = reactInfo.version?.split(".")[0];
    if (majorVersion === "19") {
      return {
        found: false,
        reason: "react-19-changed",
        isReactApp: true,
        isProduction: false,
      };
    }

    return {
      found: false,
      reason: "no-debug-source",
      isReactApp: true,
      isProduction: false,
    };
  }

  return {
    found: true,
    source: {
      fileName: debugInfo.source.fileName,
      lineNumber: debugInfo.source.lineNumber,
      columnNumber: debugInfo.source.columnNumber,
      componentName: debugInfo.componentName || undefined,
      reactVersion: reactInfo.version,
    },
    isReactApp: true,
    isProduction: false,
  };
}

/**
 * Formats a source location as a clickable file path string
 *
 * @param source - Source location object
 * @param format - Output format: "vscode" for VSCode URL, "path" for file:line format
 * @returns Formatted string
 *
 * @example
 * ```ts
 * formatSourceLocation(source, "path")
 * // Returns: "src/components/Button.tsx:42:8"
 *
 * formatSourceLocation(source, "vscode")
 * // Returns: "vscode://file/absolute/path/src/components/Button.tsx:42:8"
 * ```
 */
export function formatSourceLocation(
  source: SourceLocation,
  format: "path" | "vscode" = "path"
): string {
  const { fileName, lineNumber, columnNumber } = source;

  // Build line:column suffix
  let location = `${fileName}:${lineNumber}`;
  if (columnNumber !== undefined) {
    location += `:${columnNumber}`;
  }

  if (format === "vscode") {
    // VSCode can open files via URL protocol
    // Assumes fileName is absolute or can be resolved
    return `vscode://file${fileName.startsWith("/") ? "" : "/"}${location}`;
  }

  return location;
}

/**
 * Gets source locations for multiple elements at once
 *
 * @param elements - Array of DOM elements
 * @returns Array of source location results
 */
export function getSourceLocations(elements: HTMLElement[]): SourceLocationResult[] {
  return elements.map((element) => getSourceLocation(element));
}

/**
 * Finds the nearest React component ancestor that has source info
 *
 * Useful when clicking on a deeply nested element (like text or an icon)
 * and wanting to find the component that contains it.
 *
 * @param element - Starting DOM element
 * @param maxAncestors - Maximum DOM ancestors to check (default: 10)
 * @returns Source location result
 */
export function findNearestComponentSource(
  element: HTMLElement,
  maxAncestors = 10
): SourceLocationResult {
  let current: HTMLElement | null = element;
  let depth = 0;

  while (current && depth < maxAncestors) {
    const result = getSourceLocation(current);

    // Return first successful result
    if (result.found) {
      return result;
    }

    // If we found fiber but no source, keep looking up DOM
    // (might find a parent component with source info)
    current = current.parentElement;
    depth++;
  }

  // Return result for original element (will explain why not found)
  return getSourceLocation(element);
}

/**
 * Gets all component sources in the ancestor chain
 *
 * Useful for understanding the component hierarchy.
 *
 * @param element - Starting DOM element
 * @returns Array of unique source locations from element up to root
 */
export function getComponentHierarchy(element: HTMLElement): SourceLocation[] {
  const fiber = getFiberFromElement(element);
  if (!fiber) {
    return [];
  }

  const sources: SourceLocation[] = [];
  const seenFiles = new Set<string>();

  let current: ReactFiber | null | undefined = fiber;
  let depth = 0;
  const maxDepth = 100;

  while (current && depth < maxDepth) {
    if (current._debugSource) {
      const key = `${current._debugSource.fileName}:${current._debugSource.lineNumber}`;

      // Avoid duplicates
      if (!seenFiles.has(key)) {
        seenFiles.add(key);
        sources.push({
          fileName: current._debugSource.fileName,
          lineNumber: current._debugSource.lineNumber,
          columnNumber: current._debugSource.columnNumber,
          componentName: getComponentName(current) || undefined,
        });
      }
    }

    current = current.return;
    depth++;
  }

  return sources;
}

/**
 * Checks if source location detection is likely to work in the current environment
 *
 * @returns Object describing support status
 */
export function checkSourceLocationSupport(): {
  supported: boolean;
  reason: string;
  suggestions: string[];
} {
  const reactInfo = detectReactApp();

  if (!reactInfo.isReact) {
    return {
      supported: false,
      reason: "No React application detected on this page",
      suggestions: [
        "Ensure you're on a page built with React",
        "The page may use a different framework (Vue, Angular, etc.)",
      ],
    };
  }

  if (reactInfo.isProduction) {
    return {
      supported: false,
      reason: "Production build detected - source info is stripped",
      suggestions: [
        "Run the application in development mode",
        "Set NODE_ENV=development",
        "Ensure your bundler includes source info in development",
      ],
    };
  }

  // Check for DevTools
  const hasDevTools = typeof window !== "undefined" &&
    !!(window as unknown as Record<string, unknown>).__REACT_DEVTOOLS_GLOBAL_HOOK__;

  if (!hasDevTools) {
    return {
      supported: true,
      reason: "Development mode detected, but React DevTools not installed",
      suggestions: [
        "Install React DevTools browser extension for best results",
        "Source detection may still work without it",
      ],
    };
  }

  return {
    supported: true,
    reason: `React ${reactInfo.version || "unknown"} development mode detected`,
    suggestions: [],
  };
}
