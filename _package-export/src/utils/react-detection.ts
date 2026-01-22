// =============================================================================
// React Component Name Detection
// Uses React DevTools techniques to extract component names from fiber nodes
// =============================================================================

/**
 * React Fiber node type (minimal subset we care about)
 * Based on React internal structure
 */
interface ReactFiber {
  tag: number;
  type: ComponentType | string | null;
  elementType: ComponentType | null;
  return: ReactFiber | null;
}

interface ComponentType {
  name?: string;
  displayName?: string;
  render?: { name?: string; displayName?: string };
  type?: ComponentType;
  _context?: { displayName?: string };
  _status?: number;
  _result?: ComponentType;
  $$typeof?: symbol;
}

/**
 * Fiber tags from React source (stable across versions)
 * https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactWorkTags.js
 */
const FiberTags = {
  FunctionComponent: 0,
  ClassComponent: 1,
  IndeterminateComponent: 2,
  HostRoot: 3,
  HostPortal: 4,
  HostComponent: 5, // DOM elements like <div>
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

// =============================================================================
// Default Filter Configuration
// =============================================================================

/**
 * Default exact names to always skip (React internals)
 */
export const DEFAULT_SKIP_EXACT = new Set([
  "Component",
  "PureComponent",
  "Fragment",
  "Suspense",
  "Profiler",
  "StrictMode",
  "Routes",
  "Route",
  "Outlet",
]);

/**
 * Default patterns for framework internals
 */
export const DEFAULT_SKIP_PATTERNS: RegExp[] = [
  /Boundary$/, // ErrorBoundary, RedirectBoundary
  /Provider$/, // ThemeProvider, Context.Provider
  /Consumer$/, // Context.Consumer
  /^(Inner|Outer)/, // InnerLayoutRouter
  /Router$/, // AppRouter, BrowserRouter
  /^Client(Page|Segment)/, // ClientPageRoot
  /^Server/, // ServerRoot
  /^RSC/, // RSCComponent
  /Context$/, // LayoutRouterContext
  /^(Hot|Dev|React)/, // HotReload, DevTools, ReactDevOverlay
  /Overlay$/, // ReactDevOverlay, ErrorOverlay
  /Handler$/, // ScrollAndFocusHandler
  /^With[A-Z]/, // withRouter, WithAuth (HOCs)
  /Wrapper$/, // Generic wrappers
];

/**
 * Patterns that indicate likely user-defined components
 * Used as fallback in 'dom-correlated' mode
 */
const DEFAULT_USER_PATTERNS: RegExp[] = [
  /Page$/, // HomePage, InstallPage
  /View$/, // ListView, DetailView
  /Screen$/, // HomeScreen
  /Section$/, // HeroSection
  /Card$/, // ProductCard
  /List$/, // UserList
  /Item$/, // ListItem, MenuItem
  /Form$/, // LoginForm
  /Modal$/, // ConfirmModal
  /Dialog$/, // AlertDialog
  /Button$/, // SubmitButton (but not all buttons)
  /Nav$/, // SideNav, TopNav
  /Header$/, // PageHeader
  /Footer$/, // PageFooter
  /Layout$/, // MainLayout (careful - could be framework)
  /Panel$/, // SidePanel
  /Tab$/, // SettingsTab
  /Menu$/, // DropdownMenu
];

// =============================================================================
// Configuration Types
// =============================================================================

export type ReactDetectionMode = "all" | "filtered" | "dom-correlated";

export interface ReactDetectionConfig {
  /**
   * How many component names to collect
   * @default 3
   */
  maxComponents?: number;

  /**
   * Maximum fiber depth to traverse
   * @default 25
   */
  maxDepth?: number;

  /**
   * Detection mode:
   * - 'dom-correlated': Only show components that correlate with DOM classes (default)
   * - 'filtered': Skip known framework internals
   * - 'all': Show all components (no filtering)
   * @default 'dom-correlated'
   */
  mode?: ReactDetectionMode;

  /**
   * Additional exact names to skip (merged with defaults in 'filtered' mode)
   */
  skipExact?: Set<string> | string[];

  /**
   * Additional patterns to skip (merged with defaults in 'filtered' mode)
   */
  skipPatterns?: RegExp[];

  /**
   * Patterns for user components (used as fallback in 'dom-correlated' mode)
   */
  userPatterns?: RegExp[];

  /**
   * Custom filter function for full control
   * Return true to INCLUDE the component, false to skip
   */
  filter?: (name: string, depth: number) => boolean;
}

/**
 * Resolved configuration with all defaults applied
 */
interface ResolvedConfig {
  maxComponents: number;
  maxDepth: number;
  mode: ReactDetectionMode;
  skipExact: Set<string>;
  skipPatterns: RegExp[];
  userPatterns: RegExp[];
  filter?: (name: string, depth: number) => boolean;
}

function resolveConfig(config?: ReactDetectionConfig): ResolvedConfig {
  const mode = config?.mode ?? "filtered";

  // Convert skipExact to Set if array
  let skipExact = DEFAULT_SKIP_EXACT;
  if (config?.skipExact) {
    const additional =
      config.skipExact instanceof Set
        ? config.skipExact
        : new Set(config.skipExact);
    skipExact = new Set([...DEFAULT_SKIP_EXACT, ...additional]);
  }

  return {
    maxComponents: config?.maxComponents ?? 6,
    maxDepth: config?.maxDepth ?? 30,
    mode,
    skipExact,
    skipPatterns: config?.skipPatterns
      ? [...DEFAULT_SKIP_PATTERNS, ...config.skipPatterns]
      : DEFAULT_SKIP_PATTERNS,
    userPatterns: config?.userPatterns ?? DEFAULT_USER_PATTERNS,
    filter: config?.filter,
  };
}

// =============================================================================
// Filter Logic
// =============================================================================

/**
 * Normalize a component name to match CSS class conventions
 * SideNav -> side-nav, LinkComponent -> link-component
 */
function normalizeComponentName(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

/**
 * Collect CSS classes from an element and its ancestors
 */
function getAncestorClasses(element: HTMLElement, maxDepth = 10): Set<string> {
  const classes = new Set<string>();
  let current: HTMLElement | null = element;
  let depth = 0;

  while (current && depth < maxDepth) {
    if (current.className && typeof current.className === "string") {
      current.className.split(/\s+/).forEach((cls) => {
        if (cls.length > 1) {
          // Normalize: remove CSS module hashes, convert to lowercase
          const normalized = cls
            .replace(/[_][a-zA-Z0-9]{5,}.*$/, "")
            .toLowerCase();
          if (normalized.length > 1) {
            classes.add(normalized);
          }
        }
      });
    }
    current = current.parentElement;
    depth++;
  }

  return classes;
}

/**
 * Check if a component name correlates with any DOM class
 */
function componentCorrelatesWithDOM(
  componentName: string,
  domClasses: Set<string>,
): boolean {
  const normalized = normalizeComponentName(componentName);

  for (const cls of domClasses) {
    // Exact match: SideNav -> side-nav
    if (cls === normalized) return true;

    // Contains match: LinkComponent -> nav-link contains "link"
    // Split both by hyphens and check for word overlaps
    const componentWords = normalized.split("-").filter((w) => w.length > 2);
    const classWords = cls.split("-").filter((w) => w.length > 2);

    for (const cWord of componentWords) {
      for (const dWord of classWords) {
        if (cWord === dWord || cWord.includes(dWord) || dWord.includes(cWord)) {
          return true;
        }
      }
    }
  }

  return false;
}

function shouldIncludeComponent(
  name: string,
  depth: number,
  config: ResolvedConfig,
  domClasses?: Set<string>,
): boolean {
  // Custom filter takes precedence
  if (config.filter) {
    return config.filter(name, depth);
  }

  // Always apply basic skip patterns first (framework internals)
  if (config.skipExact.has(name)) return false;
  if (config.skipPatterns.some((p) => p.test(name))) return false;

  switch (config.mode) {
    case "all":
      return true;

    case "filtered":
      return true; // Already passed skip checks

    case "dom-correlated":
      // Prefer components that correlate with DOM classes
      if (domClasses && componentCorrelatesWithDOM(name, domClasses)) {
        return true;
      }
      // Also include if it matches common user component patterns
      if (config.userPatterns.some((p) => p.test(name))) {
        return true;
      }
      // For deeper components (depth > 2), include anyway if not filtered
      // This ensures we show the component tree, not just the closest match
      return depth > 2;

    default:
      return true;
  }
}

// =============================================================================
// React Detection
// =============================================================================

let reactDetectionCache: boolean | null = null;

/**
 * Checks if React is present on the page
 */
/**
 * Check if an element has React fiber keys
 */
function hasReactFiber(element: Element): boolean {
  return Object.keys(element).some(
    (key) =>
      key.startsWith("__reactFiber$") ||
      key.startsWith("__reactInternalInstance$") ||
      key.startsWith("__reactProps$"),
  );
}

/**
 * Checks if React is present on the page.
 * Scans common React root containers since React typically mounts
 * to #root, #app, #__next, etc. rather than document.body directly.
 */
export function isReactPage(): boolean {
  if (reactDetectionCache !== null) {
    return reactDetectionCache;
  }

  if (typeof document === "undefined") {
    return false;
  }

  // Check body first (some apps mount directly to body)
  if (document.body && hasReactFiber(document.body)) {
    reactDetectionCache = true;
    return true;
  }

  // Check common React root containers
  const commonRoots = ["#root", "#app", "#__next", "[data-reactroot]"];
  for (const selector of commonRoots) {
    const el = document.querySelector(selector);
    if (el && hasReactFiber(el)) {
      reactDetectionCache = true;
      return true;
    }
  }

  // Scan immediate children of body as fallback
  if (document.body) {
    for (const child of document.body.children) {
      if (hasReactFiber(child)) {
        reactDetectionCache = true;
        return true;
      }
    }
  }

  reactDetectionCache = false;
  return false;
}

/**
 * Clears the React detection cache
 */
export function clearReactDetectionCache(): void {
  reactDetectionCache = null;
}

function getReactFiberKey(element: HTMLElement): string | null {
  const keys = Object.keys(element);
  return (
    keys.find(
      (key) =>
        key.startsWith("__reactFiber$") ||
        key.startsWith("__reactInternalInstance$"),
    ) || null
  );
}

function getFiberFromElement(element: HTMLElement): ReactFiber | null {
  const key = getReactFiberKey(element);
  if (!key) return null;
  return (element as unknown as Record<string, unknown>)[
    key
  ] as ReactFiber | null;
}

function getComponentNameFromType(type: ComponentType | null): string | null {
  if (!type) return null;
  if (type.displayName) return type.displayName;
  if (type.name) return type.name;
  return null;
}

function getComponentNameFromFiber(fiber: ReactFiber): string | null {
  const { tag, type, elementType } = fiber;

  // Skip DOM elements
  if (tag === FiberTags.HostComponent || tag === FiberTags.HostText) {
    return null;
  }

  // Skip Fragment, Mode, Profiler
  if (
    tag === FiberTags.Fragment ||
    tag === FiberTags.Mode ||
    tag === FiberTags.Profiler
  ) {
    return null;
  }

  // Handle ForwardRef
  if (tag === FiberTags.ForwardRef) {
    const elType = elementType as ComponentType | null;
    if (elType?.render) {
      const innerName = getComponentNameFromType(elType.render);
      if (innerName) return innerName;
    }
    if (elType?.displayName) return elType.displayName;
    return getComponentNameFromType(type as ComponentType);
  }

  // Handle Memo
  if (
    tag === FiberTags.MemoComponent ||
    tag === FiberTags.SimpleMemoComponent
  ) {
    const elType = elementType as ComponentType | null;
    if (elType?.type) {
      const innerName = getComponentNameFromType(elType.type);
      if (innerName) return innerName;
    }
    if (elType?.displayName) return elType.displayName;
    return getComponentNameFromType(type as ComponentType);
  }

  // Handle Context Provider
  if (tag === FiberTags.ContextProvider) {
    const elType = type as ComponentType | null;
    if (elType?._context?.displayName) {
      return `${elType._context.displayName}.Provider`;
    }
    return null;
  }

  // Handle Context Consumer
  if (tag === FiberTags.ContextConsumer) {
    const elType = type as ComponentType | null;
    if (elType?.displayName) {
      return `${elType.displayName}.Consumer`;
    }
    return null;
  }

  // Handle Lazy
  if (tag === FiberTags.LazyComponent) {
    const elType = elementType as ComponentType | null;
    if (elType?._status === 1 && elType._result) {
      return getComponentNameFromType(elType._result);
    }
    return null;
  }

  // Handle Suspense
  if (tag === FiberTags.SuspenseComponent) {
    return null;
  }

  // Function and Class components
  if (
    tag === FiberTags.FunctionComponent ||
    tag === FiberTags.ClassComponent ||
    tag === FiberTags.IndeterminateComponent
  ) {
    return getComponentNameFromType(type as ComponentType);
  }

  return null;
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Result from React component detection
 */
export interface ReactComponentInfo {
  /** Full component path like "<App> <Layout> <Button>" */
  path: string | null;
  /** Array of component names from innermost to outermost */
  components: string[];
}

/**
 * Walks up the fiber tree to collect React component names
 *
 * @param element - The DOM element to start from
 * @param config - Optional configuration
 * @returns ReactComponentInfo with component path and array
 */
export function getReactComponentName(
  element: HTMLElement,
  config?: ReactDetectionConfig,
): ReactComponentInfo {
  if (!isReactPage()) {
    return { path: null, components: [] };
  }

  const resolved = resolveConfig(config);

  // Collect DOM classes for dom-correlated mode
  const domClasses =
    resolved.mode === "dom-correlated"
      ? getAncestorClasses(element)
      : undefined;

  let fiber = getFiberFromElement(element);
  let depth = 0;
  const components: string[] = [];

  while (
    fiber &&
    depth < resolved.maxDepth &&
    components.length < resolved.maxComponents
  ) {
    const name = getComponentNameFromFiber(fiber);

    if (name && shouldIncludeComponent(name, depth, resolved, domClasses)) {
      components.push(name);
    }

    fiber = fiber.return;
    depth++;
  }

  if (components.length === 0) {
    return { path: null, components: [] };
  }

  // Build path from outermost to innermost: <App> <Layout> <Button>
  const path = components
    .slice()
    .reverse()
    .map((c) => `<${c}>`)
    .join(" ");

  return { path, components };
}
