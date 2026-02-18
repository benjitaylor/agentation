"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import {
  AnnotationPopupCSS,
  AnnotationPopupCSSHandle,
} from "../annotation-popup-css";
import {
  IconListSparkle,
  IconPlayAlt,
  IconPauseAlt,
  IconClose,
  IconPlus,
  IconGear,
  IconCheck,
  IconCheckSmall,
  IconCheckSmallAnimated,
  IconHelp,
  AnimatedBunny,
  IconEye,
  IconEyeMinus,
  IconCopyAlt,
  IconCopyAnimated,
  IconSendArrow,
  IconTrashAlt,
  IconXmark,
  IconCheckmark,
  IconCheckmarkLarge,
  IconCheckmarkCircle,
  IconPause,
  IconEyeAnimated,
  IconPausePlayAnimated,
  IconSun,
  IconMoon,
  IconXmarkLarge,
  IconEdit,
  IconChevronLeft,
  IconChevronRight,
} from "../icons";
import {
  identifyElement,
  getNearbyText,
  getElementClasses,
  getDetailedComputedStyles,
  getForensicComputedStyles,
  parseComputedStylesString,
  getFullElementPath,
  getAccessibilityInfo,
  getNearbyElements,
  closestCrossingShadow,
} from "../../utils/element-identification";
import {
  loadAnnotations,
  loadAllAnnotations,
  saveAnnotations,
  getStorageKey,
  loadSessionId,
  saveSessionId,
  clearSessionId,
  saveAnnotationsWithSyncMarker,
} from "../../utils/storage";
import {
  createSession,
  getSession,
  syncAnnotation,
  updateAnnotation as updateAnnotationOnServer,
  deleteAnnotation as deleteAnnotationFromServer,
  requestAction,
} from "../../utils/sync";
import { getReactComponentName } from "../../utils/react-detection";
import {
  freeze as freezeAll,
  unfreeze as unfreezeAll,
  originalSetTimeout,
  originalSetInterval,
} from "../../utils/freeze-animations";

import type { Annotation } from "../../types";
import styles from "./styles.module.scss";

/**
 * Composes element identification with React component detection.
 * This is the boundary where we combine framework-agnostic element ID
 * with React-specific component name detection.
 */
function identifyElementWithReact(
  element: HTMLElement,
  reactMode: ReactComponentMode = "filtered",
): {
  /** Combined name for display (React path + element) */
  name: string;
  /** Raw element name without React path */
  elementName: string;
  /** DOM path */
  path: string;
  /** React component path (e.g., '<SideNav> <LinkComponent>') */
  reactComponents: string | null;
} {
  const { name: elementName, path } = identifyElement(element);

  // If React detection is off, just return element info
  if (reactMode === "off") {
    return { name: elementName, elementName, path, reactComponents: null };
  }

  const reactInfo = getReactComponentName(element, { mode: reactMode });

  return {
    name: reactInfo.path ? `${reactInfo.path} ${elementName}` : elementName,
    elementName,
    path,
    reactComponents: reactInfo.path,
  };
}

// Module-level flag to prevent re-animating on SPA page navigation
let hasPlayedEntranceAnimation = false;

// =============================================================================
// Types
// =============================================================================

type HoverInfo = {
  element: string;
  elementName: string;
  elementPath: string;
  rect: DOMRect | null;
  reactComponents?: string | null;
};

type OutputDetailLevel = "compact" | "standard" | "detailed" | "forensic";
// ReactComponentMode is now derived from outputDetail when reactEnabled is true
type ReactComponentMode = "smart" | "filtered" | "all" | "off";
type MarkerClickBehavior = "edit" | "delete";

type ToolbarSettings = {
  outputDetail: OutputDetailLevel;
  autoClearAfterCopy: boolean;
  annotationColor: string;
  blockInteractions: boolean;
  reactEnabled: boolean; // Simple toggle - mode derived from outputDetail
  markerClickBehavior: MarkerClickBehavior;
  webhookUrl: string; // Overrides prop if set
  webhooksEnabled: boolean;
};

const DEFAULT_SETTINGS: ToolbarSettings = {
  outputDetail: "standard",
  autoClearAfterCopy: false,
  annotationColor: "#3c82f7",
  blockInteractions: true,
  reactEnabled: true,
  markerClickBehavior: "edit",
  webhookUrl: "",
  webhooksEnabled: true,
};

// Simple URL validation - checks for valid http(s) URL format
const isValidUrl = (url: string): boolean => {
  if (!url || !url.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

// Maps output detail level to React detection mode
const OUTPUT_TO_REACT_MODE: Record<OutputDetailLevel, ReactComponentMode> = {
  compact: "off",
  standard: "filtered",
  detailed: "smart",
  forensic: "all",
};

const MARKER_CLICK_OPTIONS: {
  value: MarkerClickBehavior;
  label: string;
}[] = [
  { value: "edit", label: "Edit" },
  { value: "delete", label: "Delete" },
];

const OUTPUT_DETAIL_OPTIONS: { value: OutputDetailLevel; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "standard", label: "Standard" },
  { value: "detailed", label: "Detailed" },
  { value: "forensic", label: "Forensic" },
];

const COLOR_OPTIONS = [
  { value: "#AF52DE", label: "Purple" },
  { value: "#3c82f7", label: "Blue" },
  { value: "#5AC8FA", label: "Cyan" },
  { value: "#34C759", label: "Green" },
  { value: "#FFD60A", label: "Yellow" },
  { value: "#FF9500", label: "Orange" },
  { value: "#FF3B30", label: "Red" },
];

// =============================================================================
// Utils
// =============================================================================

/**
 * Recursively pierces shadow DOMs to find the deepest element at a point.
 * document.elementFromPoint() stops at shadow hosts, so we need to
 * recursively check inside open shadow roots to find the actual target.
 */
function deepElementFromPoint(x: number, y: number): HTMLElement | null {
  let element = document.elementFromPoint(x, y) as HTMLElement | null;
  if (!element) return null;

  // Keep drilling down through shadow roots
  while (element?.shadowRoot) {
    const deeper = element.shadowRoot.elementFromPoint(x, y) as HTMLElement | null;
    if (!deeper || deeper === element) break;
    element = deeper;
  }

  return element;
}

function isElementFixed(element: HTMLElement): boolean {
  let current: HTMLElement | null = element;
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const position = style.position;
    if (position === "fixed" || position === "sticky") {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

function truncateUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname;
    // Show path, truncate if too long
    if (path.length > 25) {
      return "..." + path.slice(-22);
    }
    return path || "/";
  } catch {
    // If URL parsing fails, just truncate the string
    if (url.length > 25) {
      return "..." + url.slice(-22);
    }
    return url;
  }
}

function getActiveButtonStyle(
  isActive: boolean,
  color: string,
): React.CSSProperties | undefined {
  if (!isActive) return undefined;
  return {
    color: color,
    backgroundColor: hexToRgba(color, 0.25),
  };
}

function generateOutput(
  annotations: Annotation[],
  pathname: string,
  detailLevel: OutputDetailLevel = "standard",
  reactMode: ReactComponentMode = "filtered",
): string {
  if (annotations.length === 0) return "";

  const viewport =
    typeof window !== "undefined"
      ? `${window.innerWidth}×${window.innerHeight}`
      : "unknown";

  let output = `## Page Feedback: ${pathname}\n`;

  if (detailLevel === "forensic") {
    // Full environment info for forensic mode
    output += `\n**Environment:**\n`;
    output += `- Viewport: ${viewport}\n`;
    if (typeof window !== "undefined") {
      output += `- URL: ${window.location.href}\n`;
      output += `- User Agent: ${navigator.userAgent}\n`;
      output += `- Timestamp: ${new Date().toISOString()}\n`;
      output += `- Device Pixel Ratio: ${window.devicePixelRatio}\n`;
    }
    output += `\n---\n`;
  } else if (detailLevel !== "compact") {
    output += `**Viewport:** ${viewport}\n`;
  }
  output += "\n";

  annotations.forEach((a, i) => {
    if (detailLevel === "compact") {
      output += `${i + 1}. **${a.element}**: ${a.comment}`;
      if (a.selectedText) {
        output += ` (re: "${a.selectedText.slice(0, 30)}${a.selectedText.length > 30 ? "..." : ""}")`;
      }
      output += "\n";
    } else if (detailLevel === "forensic") {
      // Forensic mode - order matches output page example
      output += `### ${i + 1}. ${a.element}\n`;
      if (a.isMultiSelect && a.fullPath) {
        output += `*Forensic data shown for first element of selection*\n`;
      }
      if (a.fullPath) {
        output += `**Full DOM Path:** ${a.fullPath}\n`;
      }
      if (a.cssClasses) {
        output += `**CSS Classes:** ${a.cssClasses}\n`;
      }
      if (a.boundingBox) {
        output += `**Position:** x:${Math.round(a.boundingBox.x)}, y:${Math.round(a.boundingBox.y)} (${Math.round(a.boundingBox.width)}×${Math.round(a.boundingBox.height)}px)\n`;
      }
      output += `**Annotation at:** ${a.x.toFixed(1)}% from left, ${Math.round(a.y)}px from top\n`;
      if (a.selectedText) {
        output += `**Selected text:** "${a.selectedText}"\n`;
      }
      if (a.nearbyText && !a.selectedText) {
        output += `**Context:** ${a.nearbyText.slice(0, 100)}\n`;
      }
      if (a.computedStyles) {
        output += `**Computed Styles:** ${a.computedStyles}\n`;
      }
      if (a.accessibility) {
        output += `**Accessibility:** ${a.accessibility}\n`;
      }
      if (a.nearbyElements) {
        output += `**Nearby Elements:** ${a.nearbyElements}\n`;
      }
      if (a.reactComponents) {
        output += `**React:** ${a.reactComponents}\n`;
      }
      output += `**Feedback:** ${a.comment}\n\n`;
    } else {
      // Standard and detailed modes
      output += `### ${i + 1}. ${a.element}\n`;
      output += `**Location:** ${a.elementPath}\n`;

      // React components in both standard and detailed
      if (a.reactComponents) {
        output += `**React:** ${a.reactComponents}\n`;
      }

      if (detailLevel === "detailed") {
        if (a.cssClasses) {
          output += `**Classes:** ${a.cssClasses}\n`;
        }

        if (a.boundingBox) {
          output += `**Position:** ${Math.round(a.boundingBox.x)}px, ${Math.round(a.boundingBox.y)}px (${Math.round(a.boundingBox.width)}×${Math.round(a.boundingBox.height)}px)\n`;
        }
      }

      if (a.selectedText) {
        output += `**Selected text:** "${a.selectedText}"\n`;
      }

      if (detailLevel === "detailed" && a.nearbyText && !a.selectedText) {
        output += `**Context:** ${a.nearbyText.slice(0, 100)}\n`;
      }

      output += `**Feedback:** ${a.comment}\n\n`;
    }
  });

  return output.trim();
}

// =============================================================================
// Types for Props
// =============================================================================

export type DemoAnnotation = {
  selector: string;
  comment: string;
  selectedText?: string;
};

export type PageFeedbackToolbarCSSProps = {
  demoAnnotations?: DemoAnnotation[];
  demoDelay?: number;
  enableDemoMode?: boolean;
  /** Callback fired when an annotation is added. */
  onAnnotationAdd?: (annotation: Annotation) => void;
  /** Callback fired when an annotation is deleted. */
  onAnnotationDelete?: (annotation: Annotation) => void;
  /** Callback fired when an annotation comment is edited. */
  onAnnotationUpdate?: (annotation: Annotation) => void;
  /** Callback fired when all annotations are cleared. Receives the annotations that were cleared. */
  onAnnotationsClear?: (annotations: Annotation[]) => void;
  /** Callback fired when the copy button is clicked. Receives the markdown output. */
  onCopy?: (markdown: string) => void;
  /** Callback fired when "Send to Agent" is clicked. Receives the markdown output and annotations. */
  onSubmit?: (output: string, annotations: Annotation[]) => void;
  /** Whether to copy to clipboard when the copy button is clicked. Defaults to true. */
  copyToClipboard?: boolean;
  /** Server URL for sync (e.g., "http://localhost:4747"). If not provided, uses localStorage only. */
  endpoint?: string;
  /** Pre-existing session ID to join. If not provided with endpoint, creates a new session. */
  sessionId?: string;
  /** Called when a new session is created (only when endpoint is provided without sessionId). */
  onSessionCreated?: (sessionId: string) => void;
  /** Webhook URL to receive annotation events. */
  webhookUrl?: string;
};

/** Alias for PageFeedbackToolbarCSSProps */
export type AgentationProps = PageFeedbackToolbarCSSProps;

// =============================================================================
// Component
// =============================================================================

export function PageFeedbackToolbarCSS({
  demoAnnotations,
  demoDelay = 1000,
  enableDemoMode = false,
  onAnnotationAdd,
  onAnnotationDelete,
  onAnnotationUpdate,
  onAnnotationsClear,
  onCopy,
  onSubmit,
  copyToClipboard = true,
  endpoint,
  sessionId: initialSessionId,
  onSessionCreated,
  webhookUrl,
}: PageFeedbackToolbarCSSProps = {}) {
  const [isActive, setIsActive] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [showMarkers, setShowMarkers] = useState(true);

  // Unified marker visibility state - controls both toolbar and eye toggle
  const [markersVisible, setMarkersVisible] = useState(false);
  const [markersExiting, setMarkersExiting] = useState(false);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [pendingAnnotation, setPendingAnnotation] = useState<{
    x: number;
    y: number;
    clientY: number;
    element: string;
    elementPath: string;
    selectedText?: string;
    boundingBox?: { x: number; y: number; width: number; height: number };
    nearbyText?: string;
    cssClasses?: string;
    isMultiSelect?: boolean;
    isFixed?: boolean;
    fullPath?: string;
    accessibility?: string;
    computedStyles?: string;
    computedStylesObj?: Record<string, string>;
    nearbyElements?: string;
    reactComponents?: string;
    elementBoundingBoxes?: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
    // Element references for cmd+shift+click multi-select (for live position queries)
    multiSelectElements?: HTMLElement[];
    // Element reference for single-select (for live position queries)
    targetElement?: HTMLElement;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [sendState, setSendState] = useState<
    "idle" | "sending" | "sent" | "failed"
  >("idle");
  const [cleared, setCleared] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [hoveredTargetElement, setHoveredTargetElement] =
    useState<HTMLElement | null>(null);
  const [hoveredTargetElements, setHoveredTargetElements] = useState<
    HTMLElement[]
  >([]); // For cmd+shift+click multi-select hover
  const [deletingMarkerId, setDeletingMarkerId] = useState<string | null>(null);
  const [renumberFrom, setRenumberFrom] = useState<number | null>(null);
  const [editingAnnotation, setEditingAnnotation] = useState<Annotation | null>(
    null,
  );
  const [editingTargetElement, setEditingTargetElement] =
    useState<HTMLElement | null>(null);
  const [editingTargetElements, setEditingTargetElements] = useState<
    HTMLElement[]
  >([]); // For cmd+shift+click multi-select
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSettingsVisible, setShowSettingsVisible] = useState(false);
  const [settingsPage, setSettingsPage] = useState<"main" | "automations">(
    "main",
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [tooltipsHidden, setTooltipsHidden] = useState(false);

  // Cmd+shift+click multi-select state
  const [pendingMultiSelectElements, setPendingMultiSelectElements] = useState<
    Array<{
      element: HTMLElement;
      rect: DOMRect;
      name: string;
      path: string;
      reactComponents?: string;
    }>
  >([]);
  const modifiersHeldRef = useRef({ cmd: false, shift: false });

  // Hide tooltips after button click until mouse leaves
  const hideTooltipsUntilMouseLeave = () => {
    setTooltipsHidden(true);
  };

  const showTooltipsAgain = () => {
    setTooltipsHidden(false);
  };

  // Tooltip component that renders via portal to escape overflow clipping
  const Tooltip = ({
    content,
    children,
  }: {
    content: string;
    children: React.ReactNode;
  }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [visible, setVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const [position, setPosition] = useState({ top: 0, right: 0 });
    const triggerRef = useRef<HTMLSpanElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const updatePosition = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setPosition({
          top: rect.top + rect.height / 2,
          right: window.innerWidth - rect.left + 8,
        });
      }
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
      setShouldRender(true);
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
      updatePosition();
      timeoutRef.current = originalSetTimeout(() => {
        setVisible(true);
      }, 500); // 0.5s delay before showing
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setVisible(false);
      // Keep rendered during exit animation
      exitTimeoutRef.current = originalSetTimeout(() => {
        setShouldRender(false);
      }, 150);
    };

    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current);
      };
    }, []);

    return (
      <>
        <span
          ref={triggerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </span>
        {shouldRender &&
          createPortal(
            <div
              data-feedback-toolbar
              style={{
                position: "fixed",
                top: position.top,
                right: position.right,
                transform: "translateY(-50%)",
                padding: "6px 10px",
                background: "#383838",
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "11px",
                fontWeight: 400,
                lineHeight: "14px",
                borderRadius: "10px",
                width: "180px",
                textAlign: "left" as const,
                zIndex: 100020,
                pointerEvents: "none" as const,
                boxShadow: "0px 1px 8px rgba(0, 0, 0, 0.28)",
                opacity: visible && !isTransitioning ? 1 : 0,
                transition: "opacity 0.15s ease",
              }}
            >
              {content}
            </div>,
            document.body,
          )}
      </>
    );
  };

  const [settings, setSettings] = useState<ToolbarSettings>(DEFAULT_SETTINGS);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showEntranceAnimation, setShowEntranceAnimation] = useState(false);

  // Check if running on localhost - React detection only works locally
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "0.0.0.0" ||
      window.location.hostname.endsWith(".local"));

  // Effective React mode - derived from outputDetail when enabled
  const effectiveReactMode: ReactComponentMode =
    isLocalhost && settings.reactEnabled
      ? OUTPUT_TO_REACT_MODE[settings.outputDetail]
      : "off";

  // Server sync state
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    initialSessionId ?? null,
  );
  const sessionInitializedRef = useRef(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected"
  >(endpoint ? "connecting" : "disconnected");

  // Draggable toolbar state
  const [toolbarPosition, setToolbarPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isDraggingToolbar, setIsDraggingToolbar] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<{
    x: number;
    y: number;
    toolbarX: number;
    toolbarY: number;
  } | null>(null);
  const [dragRotation, setDragRotation] = useState(0);
  const justFinishedToolbarDragRef = useRef(false);

  // For animations - track which markers have animated in and which are exiting
  const [animatedMarkers, setAnimatedMarkers] = useState<Set<string>>(
    new Set(),
  );
  const [exitingMarkers, setExitingMarkers] = useState<Set<string>>(new Set());
  const [pendingExiting, setPendingExiting] = useState(false);
  const [editExiting, setEditExiting] = useState(false);

  // Multi-select drag state - use refs for all drag visuals to avoid re-renders
  const [isDragging, setIsDragging] = useState(false);
  const mouseDownPosRef = useRef<{ x: number; y: number } | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragRectRef = useRef<HTMLDivElement | null>(null);
  const highlightsContainerRef = useRef<HTMLDivElement | null>(null);
  const justFinishedDragRef = useRef(false);
  const lastElementUpdateRef = useRef(0);
  const recentlyAddedIdRef = useRef<string | null>(null);
  const prevConnectionStatusRef = useRef<typeof connectionStatus | null>(null);
  const DRAG_THRESHOLD = 8;
  const ELEMENT_UPDATE_THROTTLE = 50; // Faster updates since no React re-renders

  const popupRef = useRef<AnnotationPopupCSSHandle>(null);
  const editPopupRef = useRef<AnnotationPopupCSSHandle>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";

  // Handle showSettings changes with exit animation
  useEffect(() => {
    if (showSettings) {
      setShowSettingsVisible(true);
    } else {
      // Reset tooltips when settings close (fixes tooltips not showing after closing settings)
      setTooltipsHidden(false);
      // Reset to main page when settings close
      setSettingsPage("main");
      const timer = originalSetTimeout(() => setShowSettingsVisible(false), 0);
      return () => clearTimeout(timer);
    }
  }, [showSettings]);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = originalSetTimeout(() => setIsTransitioning(false), 350);
    return () => clearTimeout(timer);
  }, [settingsPage]);

  // Unified marker visibility - depends on BOTH toolbar active AND showMarkers toggle
  // This single effect handles all marker show/hide animations
  const shouldShowMarkers = isActive && showMarkers;
  useEffect(() => {
    if (shouldShowMarkers) {
      // Show markers - reset animations and make visible
      setMarkersExiting(false);
      setMarkersVisible(true);
      setAnimatedMarkers(new Set());
      // After enter animations complete, mark all as animated
      const timer = originalSetTimeout(() => {
        setAnimatedMarkers((prev) => {
          const newSet = new Set(prev);
          annotations.forEach((a) => newSet.add(a.id));
          return newSet;
        });
      }, 350);
      return () => clearTimeout(timer);
    } else if (markersVisible) {
      // Hide markers - start exit animation, then unmount
      setMarkersExiting(true);
      const timer = originalSetTimeout(() => {
        setMarkersVisible(false);
        setMarkersExiting(false);
      }, 250);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShowMarkers]);

  // Mount and load
  useEffect(() => {
    setMounted(true);
    setScrollY(window.scrollY);
    const stored = loadAnnotations<Annotation>(pathname);
    setAnnotations(stored);

    // Trigger entrance animation only on first load (not on SPA navigation)
    if (!hasPlayedEntranceAnimation) {
      setShowEntranceAnimation(true);
      hasPlayedEntranceAnimation = true;
      // Remove animation class after it completes (toolbar: 500ms, badge: 400ms delay + 300ms)
      originalSetTimeout(() => setShowEntranceAnimation(false), 750);
    }

    try {
      const storedSettings = localStorage.getItem("feedback-toolbar-settings");
      if (storedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
      }
    } catch (e) {
      // Ignore parsing errors
    }

    // Load saved theme preference, default to dark mode
    try {
      const savedTheme = localStorage.getItem("feedback-toolbar-theme");
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === "dark");
      }
      // If no saved preference, keep default (dark mode)
    } catch (e) {
      // Ignore localStorage errors
    }

    // Load saved toolbar position
    try {
      const savedPosition = localStorage.getItem("feedback-toolbar-position");
      if (savedPosition) {
        const pos = JSON.parse(savedPosition);
        if (typeof pos.x === "number" && typeof pos.y === "number") {
          setToolbarPosition(pos);
        }
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [pathname]);

  // Save settings
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(
        "feedback-toolbar-settings",
        JSON.stringify(settings),
      );
    }
  }, [settings, mounted]);

  // Save theme preference
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(
        "feedback-toolbar-theme",
        isDarkMode ? "dark" : "light",
      );
    }
  }, [isDarkMode, mounted]);

  // Save toolbar position when drag ends
  const prevDraggingRef = useRef(false);
  useEffect(() => {
    const wasDragging = prevDraggingRef.current;
    prevDraggingRef.current = isDraggingToolbar;

    // Save position when dragging ends (transition from true to false)
    if (wasDragging && !isDraggingToolbar && toolbarPosition && mounted) {
      localStorage.setItem(
        "feedback-toolbar-position",
        JSON.stringify(toolbarPosition),
      );
    }
  }, [isDraggingToolbar, toolbarPosition, mounted]);

  // Initialize server session (when endpoint is provided)
  useEffect(() => {
    if (!endpoint || !mounted || sessionInitializedRef.current) return;
    sessionInitializedRef.current = true;
    setConnectionStatus("connecting");

    const initSession = async () => {
      try {
        // Check for stored session ID to rejoin on refresh
        const storedSessionId = loadSessionId(pathname);
        const sessionIdToJoin = initialSessionId || storedSessionId;
        let sessionEstablished = false;

        if (sessionIdToJoin) {
          // Join existing session - server annotations are authoritative
          try {
            const session = await getSession(endpoint, sessionIdToJoin);
            setCurrentSessionId(session.id);
            setConnectionStatus("connected");
            saveSessionId(pathname, session.id);
            sessionEstablished = true;

            // Find local annotations that need to be synced:
            // 1. Annotations never synced to any session
            // 2. Annotations synced to a different session
            // 3. Annotations marked as synced to THIS session but missing from server
            //    (handles server-side deletion)
            const allLocalAnnotations = loadAnnotations<Annotation>(pathname);
            const serverIds = new Set(session.annotations.map((a) => a.id));
            const localToMerge = allLocalAnnotations.filter((a) => {
              // If it exists on server, don't re-upload
              if (serverIds.has(a.id)) return false;
              // Otherwise, needs to be synced (whether never synced, synced elsewhere, or missing from server)
              return true;
            });

            // Sync unsynced local annotations to this session
            if (localToMerge.length > 0) {
              const baseUrl =
                typeof window !== "undefined" ? window.location.origin : "";
              const pageUrl = `${baseUrl}${pathname}`;

              const results = await Promise.allSettled(
                localToMerge.map((annotation) =>
                  syncAnnotation(endpoint, session.id, {
                    ...annotation,
                    sessionId: session.id,
                    url: pageUrl,
                  }),
                ),
              );

              const syncedAnnotations = results.map((result, i) => {
                if (result.status === "fulfilled") {
                  return result.value;
                }
                console.warn(
                  "[Agentation] Failed to sync annotation:",
                  result.reason,
                );
                return localToMerge[i];
              });

              // Mark merged annotations as synced
              const allAnnotations = [
                ...session.annotations,
                ...syncedAnnotations,
              ];
              setAnnotations(allAnnotations);
              saveAnnotationsWithSyncMarker(
                pathname,
                allAnnotations,
                session.id,
              );
            } else {
              setAnnotations(session.annotations);
              saveAnnotationsWithSyncMarker(
                pathname,
                session.annotations,
                session.id,
              );
            }
          } catch (joinError) {
            // Session doesn't exist or expired - will create new below
            console.warn(
              "[Agentation] Could not join session, creating new:",
              joinError,
            );
            // Clear the stored session ID since it's invalid
            clearSessionId(pathname);
            // sessionEstablished remains false, will create new session
          }
        }

        // Create new session if we don't have one yet (either no stored ID, or rejoin failed)
        if (!sessionEstablished) {
          // Create new session for current page
          const currentUrl =
            typeof window !== "undefined" ? window.location.href : "/";
          const session = await createSession(endpoint, currentUrl);
          setCurrentSessionId(session.id);
          setConnectionStatus("connected");
          saveSessionId(pathname, session.id);
          onSessionCreated?.(session.id);

          // Only sync annotations that have never been synced (no _syncedTo marker)
          const allAnnotations = loadAllAnnotations<Annotation>();
          const baseUrl =
            typeof window !== "undefined" ? window.location.origin : "";

          // Sync annotations from all pages in parallel
          const syncPromises: Promise<void>[] = [];
          for (const [pagePath, annotations] of allAnnotations) {
            // Filter to only unsynced annotations
            const unsyncedAnnotations = annotations.filter(
              (a) => !(a as Annotation & { _syncedTo?: string })._syncedTo,
            );
            if (unsyncedAnnotations.length === 0) continue;

            const pageUrl = `${baseUrl}${pagePath}`;
            const isCurrentPage = pagePath === pathname;

            syncPromises.push(
              (async () => {
                try {
                  // Use current session for current page, create new sessions for other pages
                  const targetSession = isCurrentPage
                    ? session
                    : await createSession(endpoint, pageUrl);

                  const results = await Promise.allSettled(
                    unsyncedAnnotations.map((annotation) =>
                      syncAnnotation(endpoint, targetSession.id, {
                        ...annotation,
                        sessionId: targetSession.id,
                        url: pageUrl,
                      }),
                    ),
                  );

                  // Mark synced annotations and update local state for current page
                  const syncedAnnotations = results.map((result, i) => {
                    if (result.status === "fulfilled") {
                      return result.value;
                    }
                    console.warn(
                      "[Agentation] Failed to sync annotation:",
                      result.reason,
                    );
                    return unsyncedAnnotations[i];
                  });

                  // Save with sync marker
                  saveAnnotationsWithSyncMarker(
                    pagePath,
                    syncedAnnotations,
                    targetSession.id,
                  );

                  if (isCurrentPage) {
                    const originalIds = new Set(
                      unsyncedAnnotations.map((a) => a.id),
                    );
                    setAnnotations((prev) => {
                      const newDuringSync = prev.filter(
                        (a) => !originalIds.has(a.id),
                      );
                      return [...syncedAnnotations, ...newDuringSync];
                    });
                  }
                } catch (err) {
                  console.warn(
                    `[Agentation] Failed to sync annotations for ${pagePath}:`,
                    err,
                  );
                }
              })(),
            );
          }

          await Promise.allSettled(syncPromises);
        }
      } catch (error) {
        // Network error - continue in local-only mode
        setConnectionStatus("disconnected");
        console.warn(
          "[Agentation] Failed to initialize session, using local storage:",
          error,
        );
      }
    };

    initSession();
  }, [endpoint, initialSessionId, mounted, onSessionCreated, pathname]);

  // Periodic health check for server connection
  useEffect(() => {
    if (!endpoint || !mounted) return;

    const checkHealth = async () => {
      try {
        const response = await fetch(`${endpoint}/health`);
        if (response.ok) {
          setConnectionStatus("connected");
        } else {
          setConnectionStatus("disconnected");
        }
      } catch {
        setConnectionStatus("disconnected");
      }
    };

    // Check immediately, then every 10 seconds
    checkHealth();
    const interval = originalSetInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, [endpoint, mounted]);

  // Listen for server-side annotation updates (e.g. resolved by agent)
  useEffect(() => {
    if (!endpoint || !mounted || !currentSessionId) return;

    const eventSource = new EventSource(
      `${endpoint}/sessions/${currentSessionId}/events`
    );

    const removedStatuses = ["resolved", "dismissed"];

    const handler = (e: MessageEvent) => {
      try {
        const event = JSON.parse(e.data);
        if (removedStatuses.includes(event.payload?.status)) {
          const id = event.payload.id as string;
          // Trigger exit animation then remove
          setExitingMarkers((prev) => new Set(prev).add(id));
          originalSetTimeout(() => {
            setAnnotations((prev) => prev.filter((a) => a.id !== id));
            setExitingMarkers((prev) => {
              const next = new Set(prev);
              next.delete(id);
              return next;
            });
          }, 150);
        }
      } catch {
        // Ignore parse errors
      }
    };

    eventSource.addEventListener("annotation.updated", handler);

    return () => {
      eventSource.removeEventListener("annotation.updated", handler);
      eventSource.close();
    };
  }, [endpoint, mounted, currentSessionId]);

  // Sync local annotations when connection is restored
  useEffect(() => {
    if (!endpoint || !mounted) return;

    // Check if we just reconnected (was disconnected, now connected)
    const wasDisconnected = prevConnectionStatusRef.current === "disconnected";
    const isNowConnected = connectionStatus === "connected";
    prevConnectionStatusRef.current = connectionStatus;

    if (wasDisconnected && isNowConnected) {
      // Sync any local annotations that aren't on the server
      const syncLocalAnnotations = async () => {
        try {
          const localAnnotations = loadAnnotations<Annotation>(pathname);
          if (localAnnotations.length === 0) return;

          const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
          const pageUrl = `${baseUrl}${pathname}`;

          // Get or create session
          let sessionId = currentSessionId;
          let serverAnnotations: Annotation[] = [];

          if (sessionId) {
            // Try to get existing session
            try {
              const session = await getSession(endpoint, sessionId);
              serverAnnotations = session.annotations;
            } catch {
              // Session doesn't exist anymore, create new one
              sessionId = null;
            }
          }

          if (!sessionId) {
            // Create new session
            const newSession = await createSession(endpoint, pageUrl);
            sessionId = newSession.id;
            setCurrentSessionId(sessionId);
            saveSessionId(pathname, sessionId);
          }

          // Find annotations that need syncing
          const serverIds = new Set(serverAnnotations.map((a) => a.id));
          const unsyncedLocal = localAnnotations.filter((a) => !serverIds.has(a.id));

          if (unsyncedLocal.length > 0) {
            const results = await Promise.allSettled(
              unsyncedLocal.map((annotation) =>
                syncAnnotation(endpoint, sessionId!, {
                  ...annotation,
                  sessionId: sessionId!,
                  url: pageUrl,
                })
              )
            );

            const syncedAnnotations = results.map((result, i) => {
              if (result.status === "fulfilled") {
                return result.value;
              }
              console.warn("[Agentation] Failed to sync annotation on reconnect:", result.reason);
              return unsyncedLocal[i];
            });

            // Update local state with server + synced annotations
            const allAnnotations = [...serverAnnotations, ...syncedAnnotations];
            setAnnotations(allAnnotations);
            saveAnnotationsWithSyncMarker(pathname, allAnnotations, sessionId!);
          }
        } catch (err) {
          console.warn("[Agentation] Failed to sync on reconnect:", err);
        }
      };

      syncLocalAnnotations();
    }
  }, [connectionStatus, endpoint, mounted, currentSessionId, pathname]);

  // Demo annotations
  useEffect(() => {
    if (!enableDemoMode) return;
    if (!mounted || !demoAnnotations || demoAnnotations.length === 0) return;
    if (annotations.length > 0) return;

    const timeoutIds: ReturnType<typeof setTimeout>[] = [];

    timeoutIds.push(
      originalSetTimeout(() => {
        setIsActive(true);
      }, demoDelay - 200),
    );

    demoAnnotations.forEach((demo, index) => {
      const annotationDelay = demoDelay + index * 300;

      timeoutIds.push(
        originalSetTimeout(() => {
          const element = document.querySelector(demo.selector) as HTMLElement;
          if (!element) return;

          const rect = element.getBoundingClientRect();
          const { name, path } = identifyElement(element);

          const newAnnotation: Annotation = {
            id: `demo-${Date.now()}-${index}`,
            x: ((rect.left + rect.width / 2) / window.innerWidth) * 100,
            y: rect.top + rect.height / 2 + window.scrollY,
            comment: demo.comment,
            element: name,
            elementPath: path,
            timestamp: Date.now(),
            selectedText: demo.selectedText,
            boundingBox: {
              x: rect.left,
              y: rect.top + window.scrollY,
              width: rect.width,
              height: rect.height,
            },
            nearbyText: getNearbyText(element),
            cssClasses: getElementClasses(element),
          };

          setAnnotations((prev) => [...prev, newAnnotation]);
        }, annotationDelay),
      );
    });

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [enableDemoMode, mounted, demoAnnotations, demoDelay]);

  // Track scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = originalSetTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Save annotations (preserving sync markers if connected to a session)
  useEffect(() => {
    if (mounted && annotations.length > 0) {
      if (currentSessionId) {
        // Connected to session - save with sync marker to prevent re-upload on refresh
        saveAnnotationsWithSyncMarker(pathname, annotations, currentSessionId);
      } else {
        // Not connected - save without markers (will sync when connected)
        saveAnnotations(pathname, annotations);
      }
    } else if (mounted && annotations.length === 0) {
      localStorage.removeItem(getStorageKey(pathname));
    }
  }, [annotations, pathname, mounted, currentSessionId]);

  // Freeze animations (delegates to freeze-animations utility)
  const freezeAnimations = useCallback(() => {
    if (isFrozen) return;
    freezeAll();
    setIsFrozen(true);
  }, [isFrozen]);

  const unfreezeAnimations = useCallback(() => {
    if (!isFrozen) return;
    unfreezeAll();
    setIsFrozen(false);
  }, [isFrozen]);

  const toggleFreeze = useCallback(() => {
    if (isFrozen) {
      unfreezeAnimations();
    } else {
      freezeAnimations();
    }
  }, [isFrozen, freezeAnimations, unfreezeAnimations]);

  // Create pending annotation from cmd+shift+click multi-select
  const createMultiSelectPendingAnnotation = useCallback(() => {
    if (pendingMultiSelectElements.length === 0) return;

    const firstItem = pendingMultiSelectElements[0];
    const firstEl = firstItem.element;
    const isMulti = pendingMultiSelectElements.length > 1;

    // Get fresh rects for all elements
    const freshRects = pendingMultiSelectElements.map((item) =>
      item.element.getBoundingClientRect(),
    );

    if (!isMulti) {
      // Single element - treat as regular annotation (not multi-select)
      const rect = freshRects[0];
      const isFixed = isElementFixed(firstEl);

      setPendingAnnotation({
        x: (rect.left / window.innerWidth) * 100,
        y: isFixed ? rect.top : rect.top + window.scrollY,
        clientY: rect.top,
        element: firstItem.name,
        elementPath: firstItem.path,
        boundingBox: {
          x: rect.left,
          y: isFixed ? rect.top : rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
        },
        isFixed,
        fullPath: getFullElementPath(firstEl),
        accessibility: getAccessibilityInfo(firstEl),
        computedStyles: getForensicComputedStyles(firstEl),
        computedStylesObj: getDetailedComputedStyles(firstEl),
        nearbyElements: getNearbyElements(firstEl),
        cssClasses: getElementClasses(firstEl),
        nearbyText: getNearbyText(firstEl),
        reactComponents: firstItem.reactComponents,
      });
    } else {
      // Multiple elements - multi-select annotation
      const bounds = {
        left: Math.min(...freshRects.map((r) => r.left)),
        top: Math.min(...freshRects.map((r) => r.top)),
        right: Math.max(...freshRects.map((r) => r.right)),
        bottom: Math.max(...freshRects.map((r) => r.bottom)),
      };

      const names = pendingMultiSelectElements
        .slice(0, 5)
        .map((item) => item.name)
        .join(", ");
      const suffix =
        pendingMultiSelectElements.length > 5
          ? ` +${pendingMultiSelectElements.length - 5} more`
          : "";

      const elementBoundingBoxes = freshRects.map((rect) => ({
        x: rect.left,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      }));

      // Position marker near the last selected element (most recent click)
      const lastItem = pendingMultiSelectElements[pendingMultiSelectElements.length - 1];
      const lastEl = lastItem.element;
      const lastRect = freshRects[freshRects.length - 1];
      const lastCenterX = lastRect.left + lastRect.width / 2;
      const lastCenterY = lastRect.top + lastRect.height / 2;
      const lastIsFixed = isElementFixed(lastEl);

      setPendingAnnotation({
        x: (lastCenterX / window.innerWidth) * 100,
        y: lastIsFixed ? lastCenterY : lastCenterY + window.scrollY,
        clientY: lastCenterY,
        element: `${pendingMultiSelectElements.length} elements: ${names}${suffix}`,
        elementPath: "multi-select",
        boundingBox: {
          x: bounds.left,
          y: bounds.top + window.scrollY,
          width: bounds.right - bounds.left,
          height: bounds.bottom - bounds.top,
        },
        isMultiSelect: true,
        isFixed: lastIsFixed,
        elementBoundingBoxes,
        multiSelectElements: pendingMultiSelectElements.map((item) => item.element),
        targetElement: lastEl, // Anchor marker/popup to last clicked element
        fullPath: getFullElementPath(firstEl),
        accessibility: getAccessibilityInfo(firstEl),
        computedStyles: getForensicComputedStyles(firstEl),
        computedStylesObj: getDetailedComputedStyles(firstEl),
        nearbyElements: getNearbyElements(firstEl),
        cssClasses: getElementClasses(firstEl),
        nearbyText: getNearbyText(firstEl),
      });
    }

    setPendingMultiSelectElements([]);
    setHoverInfo(null);
  }, [pendingMultiSelectElements]);

  // Reset state when deactivating
  useEffect(() => {
    if (!isActive) {
      setPendingAnnotation(null);
      setEditingAnnotation(null);
      setEditingTargetElement(null);
      setEditingTargetElements([]);
      setHoverInfo(null);
      setShowSettings(false); // Close settings when toolbar closes
      setPendingMultiSelectElements([]); // Clear multi-select
      modifiersHeldRef.current = { cmd: false, shift: false }; // Reset modifier tracking
      if (isFrozen) {
        unfreezeAnimations();
      }
    }
  }, [isActive, isFrozen, unfreezeAnimations]);

  // Unmount safety — if component is removed while frozen, unfreeze the page
  useEffect(() => {
    return () => {
      unfreezeAll();
    };
  }, []);

  // Custom cursor
  useEffect(() => {
    if (!isActive) return;

    const style = document.createElement("style");
    style.id = "feedback-cursor-styles";
    // Text elements get text cursor (higher specificity with body prefix)
    // Everything else gets crosshair
    style.textContent = `
      body * {
        cursor: crosshair !important;
      }
      body p, body span, body h1, body h2, body h3, body h4, body h5, body h6,
      body li, body td, body th, body label, body blockquote, body figcaption,
      body caption, body legend, body dt, body dd, body pre, body code,
      body em, body strong, body b, body i, body u, body s, body a,
      body time, body address, body cite, body q, body abbr, body dfn,
      body mark, body small, body sub, body sup, body [contenteditable],
      body p *, body span *, body h1 *, body h2 *, body h3 *, body h4 *,
      body h5 *, body h6 *, body li *, body a *, body label *, body pre *,
      body code *, body blockquote *, body [contenteditable] * {
        cursor: text !important;
      }
      [data-feedback-toolbar], [data-feedback-toolbar] * {
        cursor: default !important;
      }
      [data-feedback-toolbar] textarea,
      [data-feedback-toolbar] input[type="text"],
      [data-feedback-toolbar] input[type="url"] {
        cursor: text !important;
      }
      [data-feedback-toolbar] button,
      [data-feedback-toolbar] button *,
      [data-feedback-toolbar] label,
      [data-feedback-toolbar] label *,
      [data-feedback-toolbar] a,
      [data-feedback-toolbar] a *,
      [data-feedback-toolbar] [role="button"],
      [data-feedback-toolbar] [role="button"] * {
        cursor: pointer !important;
      }
      [data-annotation-marker], [data-annotation-marker] * {
        cursor: pointer !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById("feedback-cursor-styles");
      if (existingStyle) existingStyle.remove();
    };
  }, [isActive]);

  // Handle mouse move
  useEffect(() => {
    if (!isActive || pendingAnnotation) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Use composedPath to get actual target inside shadow DOM
      const target = (e.composedPath()[0] || e.target) as HTMLElement;
      if (closestCrossingShadow(target, "[data-feedback-toolbar]")) {
        setHoverInfo(null);
        return;
      }

      const elementUnder = deepElementFromPoint(e.clientX, e.clientY);
      if (
        !elementUnder ||
        closestCrossingShadow(elementUnder, "[data-feedback-toolbar]")
      ) {
        setHoverInfo(null);
        return;
      }

      const { name, elementName, path, reactComponents } =
        identifyElementWithReact(elementUnder, effectiveReactMode);
      const rect = elementUnder.getBoundingClientRect();

      setHoverInfo({
        element: name,
        elementName,
        elementPath: path,
        rect,
        reactComponents,
      });
      setHoverPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isActive, pendingAnnotation, effectiveReactMode]);

  // Handle click
  useEffect(() => {
    if (!isActive) return;

    const handleClick = (e: MouseEvent) => {
      if (justFinishedDragRef.current) {
        justFinishedDragRef.current = false;
        return;
      }

      // Use composedPath to get actual target inside shadow DOM, falling back to e.target
      const target = (e.composedPath()[0] || e.target) as HTMLElement;

      if (closestCrossingShadow(target, "[data-feedback-toolbar]")) return;
      if (closestCrossingShadow(target, "[data-annotation-popup]")) return;
      if (closestCrossingShadow(target, "[data-annotation-marker]")) return;

      // Handle cmd+shift+click for multi-element selection
      if (e.metaKey && e.shiftKey && !pendingAnnotation && !editingAnnotation) {
        e.preventDefault();
        e.stopPropagation();

        const elementUnder = deepElementFromPoint(e.clientX, e.clientY);
        if (!elementUnder) return;

        const rect = elementUnder.getBoundingClientRect();
        const { name, path, reactComponents } = identifyElementWithReact(
          elementUnder,
          effectiveReactMode,
        );

        // Toggle: check if already selected
        const existingIndex = pendingMultiSelectElements.findIndex(
          (item) => item.element === elementUnder,
        );

        if (existingIndex >= 0) {
          // Deselect
          setPendingMultiSelectElements((prev) =>
            prev.filter((_, i) => i !== existingIndex),
          );
        } else {
          // Select
          setPendingMultiSelectElements((prev) => [
            ...prev,
            {
              element: elementUnder,
              rect,
              name,
              path,
              reactComponents: reactComponents ?? undefined,
            },
          ]);
        }
        return;
      }

      const isInteractive = closestCrossingShadow(
        target,
        "button, a, input, select, textarea, [role='button'], [onclick]",
      );

      // Block interactions on interactive elements when enabled
      if (settings.blockInteractions && isInteractive) {
        e.preventDefault();
        e.stopPropagation();
        // Still create annotation on the interactive element
      }

      if (pendingAnnotation) {
        if (isInteractive && !settings.blockInteractions) {
          return;
        }
        e.preventDefault();
        popupRef.current?.shake();
        return;
      }

      if (editingAnnotation) {
        if (isInteractive && !settings.blockInteractions) {
          return;
        }
        e.preventDefault();
        editPopupRef.current?.shake();
        return;
      }

      e.preventDefault();

      const elementUnder = deepElementFromPoint(e.clientX, e.clientY);
      if (!elementUnder) return;

      const { name, path, reactComponents } = identifyElementWithReact(
        elementUnder,
        effectiveReactMode,
      );
      const rect = elementUnder.getBoundingClientRect();
      const x = (e.clientX / window.innerWidth) * 100;

      const isFixed = isElementFixed(elementUnder);
      const y = isFixed ? e.clientY : e.clientY + window.scrollY;

      const selection = window.getSelection();
      let selectedText: string | undefined;
      if (selection && selection.toString().trim().length > 0) {
        selectedText = selection.toString().trim().slice(0, 500);
      }

      // Capture computed styles - filtered for popup, full for forensic output
      const computedStylesObj = getDetailedComputedStyles(elementUnder);
      const computedStylesStr = getForensicComputedStyles(elementUnder);

      setPendingAnnotation({
        x,
        y,
        clientY: e.clientY,
        element: name,
        elementPath: path,
        selectedText,
        boundingBox: {
          x: rect.left,
          y: isFixed ? rect.top : rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
        },
        nearbyText: getNearbyText(elementUnder),
        cssClasses: getElementClasses(elementUnder),
        isFixed,
        fullPath: getFullElementPath(elementUnder),
        accessibility: getAccessibilityInfo(elementUnder),
        computedStyles: computedStylesStr,
        computedStylesObj,
        nearbyElements: getNearbyElements(elementUnder),
        reactComponents: reactComponents ?? undefined,
        targetElement: elementUnder, // Store for live position queries
      });
      setHoverInfo(null);
    };

    // Use capture phase to intercept before element handlers
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [
    isActive,
    pendingAnnotation,
    editingAnnotation,
    settings.blockInteractions,
    effectiveReactMode,
    pendingMultiSelectElements,
  ]);

  // Cmd+shift+click multi-select: keyup listener for modifier release
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Meta") modifiersHeldRef.current.cmd = true;
      if (e.key === "Shift") modifiersHeldRef.current.shift = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const wasHoldingBoth =
        modifiersHeldRef.current.cmd && modifiersHeldRef.current.shift;

      if (e.key === "Meta") modifiersHeldRef.current.cmd = false;
      if (e.key === "Shift") modifiersHeldRef.current.shift = false;

      const nowHoldingBoth =
        modifiersHeldRef.current.cmd && modifiersHeldRef.current.shift;

      // Released modifier while holding elements → trigger popup
      if (
        wasHoldingBoth &&
        !nowHoldingBoth &&
        pendingMultiSelectElements.length > 0
      ) {
        createMultiSelectPendingAnnotation();
      }
    };

    // Reset modifier state AND clear selection when window loses focus (e.g., cmd+tab away)
    const handleBlur = () => {
      modifiersHeldRef.current = { cmd: false, shift: false };
      setPendingMultiSelectElements([]);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isActive, pendingMultiSelectElements, createMultiSelectPendingAnnotation]);

  // Multi-select drag - mousedown
  useEffect(() => {
    if (!isActive || pendingAnnotation) return;

    const handleMouseDown = (e: MouseEvent) => {
      // Use composedPath to get actual target inside shadow DOM
      const target = (e.composedPath()[0] || e.target) as HTMLElement;

      if (closestCrossingShadow(target, "[data-feedback-toolbar]")) return;
      if (closestCrossingShadow(target, "[data-annotation-marker]")) return;
      if (closestCrossingShadow(target, "[data-annotation-popup]")) return;

      // Don't start drag on text elements - allow native text selection
      const textTags = new Set([
        "P",
        "SPAN",
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
        "LI",
        "TD",
        "TH",
        "LABEL",
        "BLOCKQUOTE",
        "FIGCAPTION",
        "CAPTION",
        "LEGEND",
        "DT",
        "DD",
        "PRE",
        "CODE",
        "EM",
        "STRONG",
        "B",
        "I",
        "U",
        "S",
        "A",
        "TIME",
        "ADDRESS",
        "CITE",
        "Q",
        "ABBR",
        "DFN",
        "MARK",
        "SMALL",
        "SUB",
        "SUP",
      ]);

      if (textTags.has(target.tagName) || target.isContentEditable) {
        return;
      }

      mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isActive, pendingAnnotation]);

  // Multi-select drag - mousemove (fully optimized with direct DOM updates)
  useEffect(() => {
    if (!isActive || pendingAnnotation) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseDownPosRef.current) return;

      const dx = e.clientX - mouseDownPosRef.current.x;
      const dy = e.clientY - mouseDownPosRef.current.y;
      const distance = dx * dx + dy * dy;
      const thresholdSq = DRAG_THRESHOLD * DRAG_THRESHOLD;

      if (!isDragging && distance >= thresholdSq) {
        dragStartRef.current = mouseDownPosRef.current;
        setIsDragging(true);
      }

      if ((isDragging || distance >= thresholdSq) && dragStartRef.current) {
        // Direct DOM update for drag rectangle - no React state
        if (dragRectRef.current) {
          const left = Math.min(dragStartRef.current.x, e.clientX);
          const top = Math.min(dragStartRef.current.y, e.clientY);
          const width = Math.abs(e.clientX - dragStartRef.current.x);
          const height = Math.abs(e.clientY - dragStartRef.current.y);
          dragRectRef.current.style.transform = `translate(${left}px, ${top}px)`;
          dragRectRef.current.style.width = `${width}px`;
          dragRectRef.current.style.height = `${height}px`;
        }

        // Throttle element detection (still no React re-renders)
        const now = Date.now();
        if (now - lastElementUpdateRef.current < ELEMENT_UPDATE_THROTTLE) {
          return;
        }
        lastElementUpdateRef.current = now;

        const startX = dragStartRef.current.x;
        const startY = dragStartRef.current.y;
        const left = Math.min(startX, e.clientX);
        const top = Math.min(startY, e.clientY);
        const right = Math.max(startX, e.clientX);
        const bottom = Math.max(startY, e.clientY);
        const midX = (left + right) / 2;
        const midY = (top + bottom) / 2;

        // Sample corners, edges, and center for element detection
        const candidateElements = new Set<HTMLElement>();
        const points = [
          [left, top],
          [right, top],
          [left, bottom],
          [right, bottom],
          [midX, midY],
          [midX, top],
          [midX, bottom],
          [left, midY],
          [right, midY],
        ];

        for (const [x, y] of points) {
          const elements = document.elementsFromPoint(x, y);
          for (const el of elements) {
            if (el instanceof HTMLElement) candidateElements.add(el);
          }
        }

        // Also check nearby elements
        const nearbyElements = document.querySelectorAll(
          "button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th, div, span, section, article, aside, nav",
        );
        for (const el of nearbyElements) {
          if (el instanceof HTMLElement) {
            const rect = el.getBoundingClientRect();
            // Check if element's center point is inside or if it overlaps significantly
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const centerInside =
              centerX >= left &&
              centerX <= right &&
              centerY >= top &&
              centerY <= bottom;

            const overlapX =
              Math.min(rect.right, right) - Math.max(rect.left, left);
            const overlapY =
              Math.min(rect.bottom, bottom) - Math.max(rect.top, top);
            const overlapArea =
              overlapX > 0 && overlapY > 0 ? overlapX * overlapY : 0;
            const elementArea = rect.width * rect.height;
            const overlapRatio =
              elementArea > 0 ? overlapArea / elementArea : 0;

            if (centerInside || overlapRatio > 0.5) {
              candidateElements.add(el);
            }
          }
        }

        const allMatching: DOMRect[] = [];
        const meaningfulTags = new Set([
          "BUTTON",
          "A",
          "INPUT",
          "IMG",
          "P",
          "H1",
          "H2",
          "H3",
          "H4",
          "H5",
          "H6",
          "LI",
          "LABEL",
          "TD",
          "TH",
          "SECTION",
          "ARTICLE",
          "ASIDE",
          "NAV",
        ]);

        for (const el of candidateElements) {
          if (
            closestCrossingShadow(el, "[data-feedback-toolbar]") ||
            closestCrossingShadow(el, "[data-annotation-marker]")
          )
            continue;

          const rect = el.getBoundingClientRect();
          if (
            rect.width > window.innerWidth * 0.8 &&
            rect.height > window.innerHeight * 0.5
          )
            continue;
          if (rect.width < 10 || rect.height < 10) continue;

          if (
            rect.left < right &&
            rect.right > left &&
            rect.top < bottom &&
            rect.bottom > top
          ) {
            const tagName = el.tagName;
            let shouldInclude = meaningfulTags.has(tagName);

            // For divs and spans, only include if they have meaningful content
            if (!shouldInclude && (tagName === "DIV" || tagName === "SPAN")) {
              const hasText =
                el.textContent && el.textContent.trim().length > 0;
              const isInteractive =
                el.onclick !== null ||
                el.getAttribute("role") === "button" ||
                el.getAttribute("role") === "link" ||
                el.classList.contains("clickable") ||
                el.hasAttribute("data-clickable");

              if (
                (hasText || isInteractive) &&
                !el.querySelector("p, h1, h2, h3, h4, h5, h6, button, a")
              ) {
                shouldInclude = true;
              }
            }

            if (shouldInclude) {
              // Check if any existing match contains this element (filter children)
              let dominated = false;
              for (const existingRect of allMatching) {
                if (
                  existingRect.left <= rect.left &&
                  existingRect.right >= rect.right &&
                  existingRect.top <= rect.top &&
                  existingRect.bottom >= rect.bottom
                ) {
                  // Existing rect contains this one - keep the smaller one
                  dominated = true;
                  break;
                }
              }
              if (!dominated) allMatching.push(rect);
            }
          }
        }

        // Direct DOM update for highlights - no React state
        if (highlightsContainerRef.current) {
          const container = highlightsContainerRef.current;
          // Reuse existing divs or create new ones
          while (container.children.length > allMatching.length) {
            container.removeChild(container.lastChild!);
          }
          allMatching.forEach((rect, i) => {
            let div = container.children[i] as HTMLDivElement;
            if (!div) {
              div = document.createElement("div");
              div.className = styles.selectedElementHighlight;
              container.appendChild(div);
            }
            div.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
            div.style.width = `${rect.width}px`;
            div.style.height = `${rect.height}px`;
          });
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isActive, pendingAnnotation, isDragging, DRAG_THRESHOLD]);

  // Multi-select drag - mouseup
  useEffect(() => {
    if (!isActive) return;

    const handleMouseUp = (e: MouseEvent) => {
      const wasDragging = isDragging;
      const dragStart = dragStartRef.current;

      if (isDragging && dragStart) {
        justFinishedDragRef.current = true;

        // Do final element detection for accurate count
        const left = Math.min(dragStart.x, e.clientX);
        const top = Math.min(dragStart.y, e.clientY);
        const right = Math.max(dragStart.x, e.clientX);
        const bottom = Math.max(dragStart.y, e.clientY);

        // Query all meaningful elements and check bounding box intersection
        const allMatching: { element: HTMLElement; rect: DOMRect }[] = [];
        const selector =
          "button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th";

        document.querySelectorAll(selector).forEach((el) => {
          if (!(el instanceof HTMLElement)) return;
          if (
            closestCrossingShadow(el, "[data-feedback-toolbar]") ||
            closestCrossingShadow(el, "[data-annotation-marker]")
          )
            return;

          const rect = el.getBoundingClientRect();
          if (
            rect.width > window.innerWidth * 0.8 &&
            rect.height > window.innerHeight * 0.5
          )
            return;
          if (rect.width < 10 || rect.height < 10) return;

          // Check if element intersects with selection
          if (
            rect.left < right &&
            rect.right > left &&
            rect.top < bottom &&
            rect.bottom > top
          ) {
            allMatching.push({ element: el, rect });
          }
        });

        // Filter out parent elements that contain other matched elements
        const finalElements = allMatching.filter(
          ({ element: el }) =>
            !allMatching.some(
              ({ element: other }) => other !== el && el.contains(other),
            ),
        );

        const x = (e.clientX / window.innerWidth) * 100;
        const y = e.clientY + window.scrollY;

        if (finalElements.length > 0) {
          const bounds = finalElements.reduce(
            (acc, { rect }) => ({
              left: Math.min(acc.left, rect.left),
              top: Math.min(acc.top, rect.top),
              right: Math.max(acc.right, rect.right),
              bottom: Math.max(acc.bottom, rect.bottom),
            }),
            {
              left: Infinity,
              top: Infinity,
              right: -Infinity,
              bottom: -Infinity,
            },
          );

          const elementNames = finalElements
            .slice(0, 5)
            .map(({ element }) => identifyElement(element).name)
            .join(", ");
          const suffix =
            finalElements.length > 5
              ? ` +${finalElements.length - 5} more`
              : "";

          // Capture computed styles from first element - filtered for popup, full for forensic output
          const firstElement = finalElements[0].element;
          const firstElementComputedStyles =
            getDetailedComputedStyles(firstElement);
          const firstElementComputedStylesStr =
            getForensicComputedStyles(firstElement);

          setPendingAnnotation({
            x,
            y,
            clientY: e.clientY,
            element: `${finalElements.length} elements: ${elementNames}${suffix}`,
            elementPath: "multi-select",
            boundingBox: {
              x: bounds.left,
              y: bounds.top + window.scrollY,
              width: bounds.right - bounds.left,
              height: bounds.bottom - bounds.top,
            },
            isMultiSelect: true,
            // Forensic data from first element
            fullPath: getFullElementPath(firstElement),
            accessibility: getAccessibilityInfo(firstElement),
            computedStyles: firstElementComputedStylesStr,
            computedStylesObj: firstElementComputedStyles,
            nearbyElements: getNearbyElements(firstElement),
            cssClasses: getElementClasses(firstElement),
            nearbyText: getNearbyText(firstElement),
          });
        } else {
          // No elements selected, but allow annotation on empty area
          const width = Math.abs(right - left);
          const height = Math.abs(bottom - top);

          // Only create if drag area is meaningful size (not just a click)
          if (width > 20 && height > 20) {
            setPendingAnnotation({
              x,
              y,
              clientY: e.clientY,
              element: "Area selection",
              elementPath: `region at (${Math.round(left)}, ${Math.round(top)})`,
              boundingBox: {
                x: left,
                y: top + window.scrollY,
                width,
                height,
              },
              isMultiSelect: true,
            });
          }
        }
        setHoverInfo(null);
      } else if (wasDragging) {
        justFinishedDragRef.current = true;
      }

      mouseDownPosRef.current = null;
      dragStartRef.current = null;
      setIsDragging(false);
      // Clear highlights container
      if (highlightsContainerRef.current) {
        highlightsContainerRef.current.innerHTML = "";
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [isActive, isDragging]);

  // Fire webhook for annotation events - returns true on success, false on failure
  const fireWebhook = useCallback(
    async (
      event: string,
      payload: Record<string, unknown>,
      force?: boolean,
    ): Promise<boolean> => {
      // Settings webhookUrl overrides prop
      const targetUrl = settings.webhookUrl || webhookUrl;
      // Skip if no URL, or if webhooks disabled (unless force is true for manual sends)
      if (!targetUrl || (!settings.webhooksEnabled && !force)) return false;

      try {
        const response = await fetch(targetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event,
            timestamp: Date.now(),
            url:
              typeof window !== "undefined" ? window.location.href : undefined,
            ...payload,
          }),
        });
        return response.ok;
      } catch (error) {
        console.warn("[Agentation] Webhook failed:", error);
        return false;
      }
    },
    [webhookUrl, settings.webhookUrl, settings.webhooksEnabled],
  );

  // Add annotation
  const addAnnotation = useCallback(
    (comment: string) => {
      if (!pendingAnnotation) return;

      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        x: pendingAnnotation.x,
        y: pendingAnnotation.y,
        comment,
        element: pendingAnnotation.element,
        elementPath: pendingAnnotation.elementPath,
        timestamp: Date.now(),
        selectedText: pendingAnnotation.selectedText,
        boundingBox: pendingAnnotation.boundingBox,
        nearbyText: pendingAnnotation.nearbyText,
        cssClasses: pendingAnnotation.cssClasses,
        isMultiSelect: pendingAnnotation.isMultiSelect,
        isFixed: pendingAnnotation.isFixed,
        fullPath: pendingAnnotation.fullPath,
        accessibility: pendingAnnotation.accessibility,
        computedStyles: pendingAnnotation.computedStyles,
        nearbyElements: pendingAnnotation.nearbyElements,
        reactComponents: pendingAnnotation.reactComponents,
        elementBoundingBoxes: pendingAnnotation.elementBoundingBoxes,
        // Protocol fields for server sync
        ...(endpoint && currentSessionId
          ? {
              sessionId: currentSessionId,
              url:
                typeof window !== "undefined"
                  ? window.location.href
                  : undefined,
              status: "pending" as const,
            }
          : {}),
      };

      setAnnotations((prev) => [...prev, newAnnotation]);
      // Prevent immediate hover on newly added marker
      recentlyAddedIdRef.current = newAnnotation.id;
      originalSetTimeout(() => {
        recentlyAddedIdRef.current = null;
      }, 300);
      // Mark as needing animation (will be set to animated after animation completes)
      originalSetTimeout(() => {
        setAnimatedMarkers((prev) => new Set(prev).add(newAnnotation.id));
      }, 250);

      // Fire callback
      onAnnotationAdd?.(newAnnotation);
      fireWebhook("annotation.add", { annotation: newAnnotation });

      // Animate out the pending annotation UI
      setPendingExiting(true);
      originalSetTimeout(() => {
        setPendingAnnotation(null);
        setPendingExiting(false);
      }, 150);

      window.getSelection()?.removeAllRanges();

      // Sync to server (non-blocking, but update local ID with server's ID)
      if (endpoint && currentSessionId) {
        syncAnnotation(endpoint, currentSessionId, newAnnotation)
          .then((serverAnnotation) => {
            // Update local annotation with server-assigned ID
            if (serverAnnotation.id !== newAnnotation.id) {
              setAnnotations((prev) =>
                prev.map((a) =>
                  a.id === newAnnotation.id
                    ? { ...a, id: serverAnnotation.id }
                    : a,
                ),
              );
              // Also update the animated markers set
              setAnimatedMarkers((prev) => {
                const next = new Set(prev);
                next.delete(newAnnotation.id);
                next.add(serverAnnotation.id);
                return next;
              });
            }
          })
          .catch((error) => {
            console.warn("[Agentation] Failed to sync annotation:", error);
          });
      }
    },
    [
      pendingAnnotation,
      onAnnotationAdd,
      fireWebhook,
      endpoint,
      currentSessionId,
    ],
  );

  // Cancel annotation with exit animation
  const cancelAnnotation = useCallback(() => {
    setPendingExiting(true);
    originalSetTimeout(() => {
      setPendingAnnotation(null);
      setPendingExiting(false);
    }, 150); // Match exit animation duration
  }, []);

  // Delete annotation with exit animation
  const deleteAnnotation = useCallback(
    (id: string) => {
      const deletedIndex = annotations.findIndex((a) => a.id === id);
      const deletedAnnotation = annotations[deletedIndex];

      // Close edit panel with exit animation if deleting the annotation being edited
      if (editingAnnotation?.id === id) {
        setEditExiting(true);
        originalSetTimeout(() => {
          setEditingAnnotation(null);
          setEditingTargetElement(null);
          setEditingTargetElements([]);
          setEditExiting(false);
        }, 150);
      }

      setDeletingMarkerId(id);
      setExitingMarkers((prev) => new Set(prev).add(id));

      // Fire callback
      if (deletedAnnotation) {
        onAnnotationDelete?.(deletedAnnotation);
        fireWebhook("annotation.delete", { annotation: deletedAnnotation });
      }

      // Sync delete to server (non-blocking)
      if (endpoint) {
        deleteAnnotationFromServer(endpoint, id).catch((error) => {
          console.warn(
            "[Agentation] Failed to delete annotation from server:",
            error,
          );
        });
      }

      // Wait for exit animation then remove
      originalSetTimeout(() => {
        setAnnotations((prev) => prev.filter((a) => a.id !== id));
        setExitingMarkers((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setDeletingMarkerId(null);

        // Trigger renumber animation for markers after deleted one
        if (deletedIndex < annotations.length - 1) {
          setRenumberFrom(deletedIndex);
          originalSetTimeout(() => setRenumberFrom(null), 200);
        }
      }, 150);
    },
    [annotations, editingAnnotation, onAnnotationDelete, fireWebhook, endpoint],
  );

  // Start editing an annotation (right-click)
  const startEditAnnotation = useCallback((annotation: Annotation) => {
    setEditingAnnotation(annotation);
    setHoveredMarkerId(null);
    setHoveredTargetElement(null);
    setHoveredTargetElements([]);

    // Try to find elements at the annotation's position(s) for live tracking
    if (annotation.elementBoundingBoxes?.length) {
      // Cmd+shift+click: find element at each bounding box center
      const elements: HTMLElement[] = [];
      for (const bb of annotation.elementBoundingBoxes) {
        const centerX = bb.x + bb.width / 2;
        const centerY = bb.y + bb.height / 2 - window.scrollY;
        const el = deepElementFromPoint(centerX, centerY);
        if (el) elements.push(el);
      }
      setEditingTargetElements(elements);
      setEditingTargetElement(null);
    } else if (annotation.boundingBox) {
      // Single element
      const bb = annotation.boundingBox;
      const centerX = bb.x + bb.width / 2;
      // Convert document coords to viewport coords (unless fixed)
      const centerY = annotation.isFixed
        ? bb.y + bb.height / 2
        : bb.y + bb.height / 2 - window.scrollY;
      const el = deepElementFromPoint(centerX, centerY);

      // Validate found element's size roughly matches stored bounding box
      if (el) {
        const elRect = el.getBoundingClientRect();
        const widthRatio = elRect.width / bb.width;
        const heightRatio = elRect.height / bb.height;
        if (widthRatio < 0.5 || heightRatio < 0.5) {
          setEditingTargetElement(null);
        } else {
          setEditingTargetElement(el);
        }
      } else {
        setEditingTargetElement(null);
      }
      setEditingTargetElements([]);
    } else {
      setEditingTargetElement(null);
      setEditingTargetElements([]);
    }
  }, []);

  // Handle marker hover - finds element(s) for live position tracking
  const handleMarkerHover = useCallback(
    (annotation: Annotation | null) => {
      if (!annotation) {
        setHoveredMarkerId(null);
        setHoveredTargetElement(null);
        setHoveredTargetElements([]);
        return;
      }

      setHoveredMarkerId(annotation.id);

      // Find elements at the annotation's position(s) for live tracking
      if (annotation.elementBoundingBoxes?.length) {
        // Cmd+shift+click: find element at each bounding box center
        const elements: HTMLElement[] = [];
        for (const bb of annotation.elementBoundingBoxes) {
          const centerX = bb.x + bb.width / 2;
          const centerY = bb.y + bb.height / 2 - window.scrollY;
          // Use elementsFromPoint to look through the marker if it's covering
          const allEls = document.elementsFromPoint(centerX, centerY);
          const el = allEls.find(
            (e) => !e.closest('[data-annotation-marker]') && !e.closest('[data-agentation-root]'),
          ) as HTMLElement | undefined;
          if (el) elements.push(el);
        }
        setHoveredTargetElements(elements);
        setHoveredTargetElement(null);
      } else if (annotation.boundingBox) {
        // Single element
        const bb = annotation.boundingBox;
        const centerX = bb.x + bb.width / 2;
        const centerY = annotation.isFixed
          ? bb.y + bb.height / 2
          : bb.y + bb.height / 2 - window.scrollY;
        const el = deepElementFromPoint(centerX, centerY);

        // Validate found element's size roughly matches stored bounding box
        // (prevents using wrong child element when clicking center of a container)
        if (el) {
          const elRect = el.getBoundingClientRect();
          const widthRatio = elRect.width / bb.width;
          const heightRatio = elRect.height / bb.height;
          // If found element is much smaller than stored, it's probably a child - don't use it
          if (widthRatio < 0.5 || heightRatio < 0.5) {
            setHoveredTargetElement(null);
          } else {
            setHoveredTargetElement(el);
          }
        } else {
          setHoveredTargetElement(null);
        }
        setHoveredTargetElements([]);
      } else {
        setHoveredTargetElement(null);
        setHoveredTargetElements([]);
      }
    },
    [],
  );

  // Update annotation (edit mode submit)
  const updateAnnotation = useCallback(
    (newComment: string) => {
      if (!editingAnnotation) return;

      const updatedAnnotation = { ...editingAnnotation, comment: newComment };

      setAnnotations((prev) =>
        prev.map((a) =>
          a.id === editingAnnotation.id ? updatedAnnotation : a,
        ),
      );

      // Fire callback
      onAnnotationUpdate?.(updatedAnnotation);
      fireWebhook("annotation.update", { annotation: updatedAnnotation });

      // Sync update to server (non-blocking)
      if (endpoint) {
        updateAnnotationOnServer(endpoint, editingAnnotation.id, {
          comment: newComment,
        }).catch((error) => {
          console.warn(
            "[Agentation] Failed to update annotation on server:",
            error,
          );
        });
      }

      // Animate out the edit popup
      setEditExiting(true);
      originalSetTimeout(() => {
        setEditingAnnotation(null);
        setEditingTargetElement(null);
        setEditingTargetElements([]);
        setEditExiting(false);
      }, 150);
    },
    [editingAnnotation, onAnnotationUpdate, fireWebhook, endpoint],
  );

  // Cancel editing with exit animation
  const cancelEditAnnotation = useCallback(() => {
    setEditExiting(true);
    originalSetTimeout(() => {
      setEditingAnnotation(null);
      setEditingTargetElement(null);
      setEditingTargetElements([]);
      setEditExiting(false);
    }, 150);
  }, []);

  // Clear all with staggered animation
  const clearAll = useCallback(() => {
    const count = annotations.length;
    if (count === 0) return;

    // Fire callback with all annotations before clearing
    onAnnotationsClear?.(annotations);
    fireWebhook("annotations.clear", { annotations });

    // Sync deletions to server (non-blocking)
    if (endpoint) {
      Promise.all(
        annotations.map((a) =>
          deleteAnnotationFromServer(endpoint, a.id).catch((error) => {
            console.warn(
              "[Agentation] Failed to delete annotation from server:",
              error,
            );
          }),
        ),
      );
    }

    setIsClearing(true);
    setCleared(true);

    const totalAnimationTime = count * 30 + 200;
    originalSetTimeout(() => {
      setAnnotations([]);
      setAnimatedMarkers(new Set()); // Reset animated markers
      localStorage.removeItem(getStorageKey(pathname));
      setIsClearing(false);
    }, totalAnimationTime);

    originalSetTimeout(() => setCleared(false), 1500);
  }, [pathname, annotations, onAnnotationsClear, fireWebhook, endpoint]);

  // Copy output
  const copyOutput = useCallback(async () => {
    const displayUrl =
      typeof window !== "undefined"
        ? window.location.pathname +
          window.location.search +
          window.location.hash
        : pathname;
    const output = generateOutput(
      annotations,
      displayUrl,
      settings.outputDetail,
      effectiveReactMode,
    );
    if (!output) return;

    if (copyToClipboard) {
      try {
        await navigator.clipboard.writeText(output);
      } catch {
        // Clipboard may fail (permissions, not HTTPS, etc.) - continue anyway
      }
    }

    // Fire callback with markdown output (always, regardless of clipboard success)
    onCopy?.(output);

    setCopied(true);
    originalSetTimeout(() => setCopied(false), 2000);

    if (settings.autoClearAfterCopy) {
      originalSetTimeout(() => clearAll(), 500);
    }
  }, [
    annotations,
    pathname,
    settings.outputDetail,
    effectiveReactMode,
    settings.autoClearAfterCopy,
    clearAll,
    copyToClipboard,
    onCopy,
  ]);

  // Send to webhook
  const sendToWebhook = useCallback(async () => {
    const displayUrl =
      typeof window !== "undefined"
        ? window.location.pathname +
          window.location.search +
          window.location.hash
        : pathname;
    const output = generateOutput(
      annotations,
      displayUrl,
      settings.outputDetail,
      effectiveReactMode,
    );
    if (!output) return;

    // Fire onSubmit callback
    if (onSubmit) {
      onSubmit(output, annotations);
    }

    // Start sending (arrow fades)
    setSendState("sending");

    // Brief delay for the fade effect
    await new Promise((resolve) => originalSetTimeout(resolve, 150));

    // Fire webhook and check result (force=true to bypass webhooksEnabled check for manual sends)
    const success = await fireWebhook("submit", { output, annotations }, true);

    // Show result
    setSendState(success ? "sent" : "failed");
    originalSetTimeout(() => setSendState("idle"), 2500);

    // Clear annotations if send succeeded and autoClearAfterCopy is enabled
    if (success && settings.autoClearAfterCopy) {
      originalSetTimeout(() => clearAll(), 500);
    }
  }, [
    onSubmit,
    fireWebhook,
    annotations,
    pathname,
    settings.outputDetail,
    effectiveReactMode,
    settings.autoClearAfterCopy,
    clearAll,
  ]);

  // Toolbar dragging - mousemove and mouseup
  useEffect(() => {
    if (!dragStartPos) return;

    const DRAG_THRESHOLD = 10; // pixels

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartPos.x;
      const deltaY = e.clientY - dragStartPos.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Start dragging once threshold is exceeded
      if (!isDraggingToolbar && distance > DRAG_THRESHOLD) {
        setIsDraggingToolbar(true);
      }

      if (isDraggingToolbar || distance > DRAG_THRESHOLD) {
        // Calculate new position
        let newX = dragStartPos.toolbarX + deltaX;
        let newY = dragStartPos.toolbarY + deltaY;

        // Constrain to viewport
        const padding = 20;
        const wrapperWidth = 297; // .toolbar wrapper width
        const toolbarHeight = 44;

        // Content is right-aligned within wrapper via margin-left: auto
        // Calculate content width based on state
        const contentWidth = isActive
          ? connectionStatus === "connected"
            ? 297
            : 257
          : 44; // collapsed circle

        // Content offset from wrapper left edge
        const contentOffset = wrapperWidth - contentWidth;

        // Min X: content left edge >= padding
        const minX = padding - contentOffset;
        // Max X: wrapper right edge <= viewport - padding
        const maxX = window.innerWidth - padding - wrapperWidth;

        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(
          padding,
          Math.min(window.innerHeight - toolbarHeight - padding, newY),
        );

        setToolbarPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      // If we were actually dragging, set flag to prevent click event
      if (isDraggingToolbar) {
        justFinishedToolbarDragRef.current = true;
      }
      setIsDraggingToolbar(false);
      setDragStartPos(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragStartPos, isDraggingToolbar, isActive, connectionStatus]);

  // Handle toolbar drag start
  const handleToolbarMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only drag when clicking the toolbar background (not buttons or settings)
      if (
        (e.target as HTMLElement).closest("button") ||
        (e.target as HTMLElement).closest(`.${styles.settingsPanel}`)
      ) {
        return;
      }

      // Don't prevent default yet - let onClick work for collapsed state

      // Get toolbar parent's actual current position (toolbarPosition is applied to parent)
      const toolbarParent = (e.currentTarget as HTMLElement).parentElement;
      if (!toolbarParent) return;

      const rect = toolbarParent.getBoundingClientRect();
      const currentX = toolbarPosition?.x ?? rect.left;
      const currentY = toolbarPosition?.y ?? rect.top;

      // Generate random rotation between -5 and 5 degrees
      const randomRotation = (Math.random() - 0.5) * 10; // -5 to +5
      setDragRotation(randomRotation);

      setDragStartPos({
        x: e.clientX,
        y: e.clientY,
        toolbarX: currentX,
        toolbarY: currentY,
      });
      // Don't set isDraggingToolbar yet - wait for actual movement
    },
    [toolbarPosition],
  );

  // Keep toolbar in view on window resize and when toolbar expands/collapses
  useEffect(() => {
    if (!toolbarPosition) return;

    const constrainPosition = () => {
      const padding = 20;
      const wrapperWidth = 297; // .toolbar wrapper width
      const toolbarHeight = 44;

      let newX = toolbarPosition.x;
      let newY = toolbarPosition.y;

      // Content is right-aligned within wrapper via margin-left: auto
      // Calculate content width based on state
      const contentWidth = isActive
        ? connectionStatus === "connected"
          ? 297
          : 257
        : 44; // collapsed circle

      // Content offset from wrapper left edge
      const contentOffset = wrapperWidth - contentWidth;

      // Min X: content left edge >= padding
      const minX = padding - contentOffset;
      // Max X: wrapper right edge <= viewport - padding
      const maxX = window.innerWidth - padding - wrapperWidth;

      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(
        padding,
        Math.min(window.innerHeight - toolbarHeight - padding, newY),
      );

      // Only update if position changed
      if (newX !== toolbarPosition.x || newY !== toolbarPosition.y) {
        setToolbarPosition({ x: newX, y: newY });
      }
    };

    // Constrain immediately when isActive changes or on mount
    constrainPosition();

    window.addEventListener("resize", constrainPosition);
    return () => window.removeEventListener("resize", constrainPosition);
  }, [toolbarPosition, isActive, connectionStatus]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (e.key === "Escape") {
        // Clear multi-select if active
        if (pendingMultiSelectElements.length > 0) {
          setPendingMultiSelectElements([]);
          return;
        }
        if (pendingAnnotation) {
          // Let popup handle
        } else if (isActive) {
          hideTooltipsUntilMouseLeave();
          setIsActive(false);
        }
      }

      // Cmd+Shift+F / Ctrl+Shift+F to toggle feedback mode
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "f" || e.key === "F")) {
        e.preventDefault();
        hideTooltipsUntilMouseLeave();
        setIsActive((prev) => !prev);
        return;
      }

      // Skip other shortcuts if typing or modifier keys are held
      if (isTyping || e.metaKey || e.ctrlKey) return;

      // "P" to toggle pause/freeze
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        hideTooltipsUntilMouseLeave();
        toggleFreeze();
      }

      // "H" to toggle marker visibility
      if (e.key === "h" || e.key === "H") {
        if (annotations.length > 0) {
          e.preventDefault();
          hideTooltipsUntilMouseLeave();
          setShowMarkers((prev) => !prev);
        }
      }

      // "C" to copy output
      if (e.key === "c" || e.key === "C") {
        if (annotations.length > 0) {
          e.preventDefault();
          hideTooltipsUntilMouseLeave();
          copyOutput();
        }
      }

      // "X" to clear all
      if (e.key === "x" || e.key === "X") {
        if (annotations.length > 0) {
          e.preventDefault();
          hideTooltipsUntilMouseLeave();
          clearAll();
        }
      }

      // "S" to send annotations
      if (e.key === "s" || e.key === "S") {
        const hasValidWebhook =
          isValidUrl(settings.webhookUrl) || isValidUrl(webhookUrl || "");
        if (
          annotations.length > 0 &&
          hasValidWebhook &&
          sendState === "idle"
        ) {
          e.preventDefault();
          hideTooltipsUntilMouseLeave();
          sendToWebhook();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isActive,
    pendingAnnotation,
    annotations.length,
    settings.webhookUrl,
    webhookUrl,
    sendState,
    sendToWebhook,
    toggleFreeze,
    copyOutput,
    clearAll,
    pendingMultiSelectElements,
  ]);

  if (!mounted) return null;

  const hasAnnotations = annotations.length > 0;

  // Filter annotations for rendering (exclude exiting ones from normal flow)
  const visibleAnnotations = annotations.filter(
    (a) => !exitingMarkers.has(a.id),
  );
  const exitingAnnotationsList = annotations.filter((a) =>
    exitingMarkers.has(a.id),
  );

  // Helper function to calculate viewport-aware tooltip positioning
  // Helper function to calculate viewport-aware tooltip positioning
  const getTooltipPosition = (annotation: Annotation): React.CSSProperties => {
    // Tooltip dimensions (from CSS)
    const tooltipMaxWidth = 200;
    const tooltipEstimatedHeight = 80; // Estimated max height
    const markerSize = 22;
    const gap = 10;

    // Convert percentage-based x to pixels
    const markerX = (annotation.x / 100) * window.innerWidth;
    const markerY =
      typeof annotation.y === "string"
        ? parseFloat(annotation.y)
        : annotation.y;

    const styles: React.CSSProperties = {};

    // Vertical positioning: flip if near bottom
    const spaceBelow = window.innerHeight - markerY - markerSize - gap;
    if (spaceBelow < tooltipEstimatedHeight) {
      // Show above marker
      styles.top = "auto";
      styles.bottom = `calc(100% + ${gap}px)`;
    }
    // If enough space below, use default CSS (top: calc(100% + 10px))

    // Horizontal positioning: adjust if near edges
    const centerX = markerX - tooltipMaxWidth / 2;
    const edgePadding = 10;

    if (centerX < edgePadding) {
      // Too close to left edge
      const offset = edgePadding - centerX;
      styles.left = `calc(50% + ${offset}px)`;
    } else if (centerX + tooltipMaxWidth > window.innerWidth - edgePadding) {
      // Too close to right edge
      const overflow =
        centerX + tooltipMaxWidth - (window.innerWidth - edgePadding);
      styles.left = `calc(50% - ${overflow}px)`;
    }
    // If centered position is fine, use default CSS (left: 50%)

    return styles;
  };

  return createPortal(
    <>
      {/* Toolbar */}
      <div
        className={styles.toolbar}
        data-feedback-toolbar
        style={
          toolbarPosition
            ? {
                left: toolbarPosition.x,
                top: toolbarPosition.y,
                right: "auto",
                bottom: "auto",
              }
            : undefined
        }
      >
        {/* Morphing container */}
        <div
          className={`${styles.toolbarContainer} ${!isDarkMode ? styles.light : ""} ${isActive ? styles.expanded : styles.collapsed} ${showEntranceAnimation ? styles.entrance : ""} ${isDraggingToolbar ? styles.dragging : ""} ${!settings.webhooksEnabled && (isValidUrl(settings.webhookUrl) || isValidUrl(webhookUrl || "")) ? styles.serverConnected : ""}`}
          onClick={
            !isActive
              ? (e) => {
                  // Don't activate if we just finished dragging
                  if (justFinishedToolbarDragRef.current) {
                    justFinishedToolbarDragRef.current = false;
                    e.preventDefault();
                    return;
                  }
                  setIsActive(true);
                }
              : undefined
          }
          onMouseDown={handleToolbarMouseDown}
          role={!isActive ? "button" : undefined}
          tabIndex={!isActive ? 0 : -1}
          title={!isActive ? "Start feedback mode" : undefined}
          style={{
            ...(isDraggingToolbar && {
              transform: `scale(1.05) rotate(${dragRotation}deg)`,
              cursor: "grabbing",
            }),
          }}
        >
          {/* Toggle content - visible when collapsed */}
          <div
            className={`${styles.toggleContent} ${!isActive ? styles.visible : styles.hidden}`}
          >
            <IconListSparkle size={24} />
            {hasAnnotations && (
              <span
                className={`${styles.badge} ${isActive ? styles.fadeOut : ""} ${showEntranceAnimation ? styles.entrance : ""}`}
                style={{ backgroundColor: settings.annotationColor }}
              >
                {annotations.length}
              </span>
            )}
          </div>

          {/* Controls content - visible when expanded */}
          <div
            className={`${styles.controlsContent} ${isActive ? styles.visible : styles.hidden} ${
              toolbarPosition && toolbarPosition.y < 100
                ? styles.tooltipBelow
                : ""
            } ${tooltipsHidden || showSettings ? styles.tooltipsHidden : ""}`}
            onMouseLeave={showTooltipsAgain}
          >
            <div
              className={`${styles.buttonWrapper} ${
                toolbarPosition && toolbarPosition.x < 120
                  ? styles.buttonWrapperAlignLeft
                  : ""
              }`}
            >
              <button
                className={`${styles.controlButton} ${!isDarkMode ? styles.light : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  hideTooltipsUntilMouseLeave();
                  toggleFreeze();
                }}
                data-active={isFrozen}
              >
                <IconPausePlayAnimated size={24} isPaused={isFrozen} />
              </button>
              <span className={styles.buttonTooltip}>
                {isFrozen ? "Resume animations" : "Pause animations"}
                <span className={styles.shortcut}>P</span>
              </span>
            </div>

            <div className={styles.buttonWrapper}>
              <button
                className={`${styles.controlButton} ${!isDarkMode ? styles.light : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  hideTooltipsUntilMouseLeave();
                  setShowMarkers(!showMarkers);
                }}
                disabled={!hasAnnotations}
              >
                <IconEyeAnimated size={24} isOpen={showMarkers} />
              </button>
              <span className={styles.buttonTooltip}>
                {showMarkers ? "Hide markers" : "Show markers"}
                <span className={styles.shortcut}>H</span>
              </span>
            </div>

            <div className={styles.buttonWrapper}>
              <button
                className={`${styles.controlButton} ${!isDarkMode ? styles.light : ""} ${copied ? styles.statusShowing : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  hideTooltipsUntilMouseLeave();
                  copyOutput();
                }}
                disabled={!hasAnnotations}
                data-active={copied}
              >
                <IconCopyAnimated size={24} copied={copied} />
              </button>
              <span className={styles.buttonTooltip}>
                Copy feedback
                <span className={styles.shortcut}>C</span>
              </span>
            </div>

            {/* Send button - only visible when webhook URL is available AND auto-send is off */}
            <div
              className={`${styles.buttonWrapper} ${styles.sendButtonWrapper} ${!settings.webhooksEnabled && (isValidUrl(settings.webhookUrl) || isValidUrl(webhookUrl || "")) ? styles.sendButtonVisible : ""}`}
            >
              <button
                className={`${styles.controlButton} ${!isDarkMode ? styles.light : ""} ${sendState === "sent" || sendState === "failed" ? styles.statusShowing : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  hideTooltipsUntilMouseLeave();
                  sendToWebhook();
                }}
                disabled={
                  !hasAnnotations ||
                  (!isValidUrl(settings.webhookUrl) &&
                    !isValidUrl(webhookUrl || "")) ||
                  sendState === "sending"
                }
                data-no-hover={sendState === "sent" || sendState === "failed"}
                tabIndex={
                  isValidUrl(settings.webhookUrl) ||
                  isValidUrl(webhookUrl || "")
                    ? 0
                    : -1
                }
              >
                <IconSendArrow size={24} state={sendState} />
                {hasAnnotations && sendState === "idle" && (
                  <span
                    className={`${styles.buttonBadge} ${!isDarkMode ? styles.light : ""}`}
                    style={{ backgroundColor: settings.annotationColor }}
                  >
                    {annotations.length}
                  </span>
                )}
              </button>
              <span className={styles.buttonTooltip}>
                Send Annotations
                <span className={styles.shortcut}>S</span>
              </span>
            </div>

            <div className={styles.buttonWrapper}>
              <button
                className={`${styles.controlButton} ${!isDarkMode ? styles.light : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  hideTooltipsUntilMouseLeave();
                  clearAll();
                }}
                disabled={!hasAnnotations}
                data-danger
              >
                <IconTrashAlt size={24} />
              </button>
              <span className={styles.buttonTooltip}>
                Clear all
                <span className={styles.shortcut}>X</span>
              </span>
            </div>

            <div className={styles.buttonWrapper}>
              <button
                className={`${styles.controlButton} ${!isDarkMode ? styles.light : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  hideTooltipsUntilMouseLeave();
                  setShowSettings(!showSettings);
                }}
              >
                <IconGear size={24} />
              </button>
              {endpoint && connectionStatus !== "disconnected" && (
                <span
                  className={`${styles.mcpIndicator} ${!isDarkMode ? styles.light : ""} ${styles[connectionStatus]} ${showSettings ? styles.hidden : ""}`}
                  title={
                    connectionStatus === "connected"
                      ? "MCP Connected"
                      : "MCP Connecting..."
                  }
                />
              )}
              <span className={styles.buttonTooltip}>Settings</span>
            </div>

            <div
              className={`${styles.divider} ${!isDarkMode ? styles.light : ""}`}
            />

            <div
              className={`${styles.buttonWrapper} ${
                toolbarPosition &&
                typeof window !== "undefined" &&
                toolbarPosition.x > window.innerWidth - 120
                  ? styles.buttonWrapperAlignRight
                  : ""
              }`}
            >
              <button
                className={`${styles.controlButton} ${!isDarkMode ? styles.light : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  hideTooltipsUntilMouseLeave();
                  setIsActive(false);
                }}
              >
                <IconXmarkLarge size={24} />
              </button>
              <span className={styles.buttonTooltip}>
                Exit
                <span className={styles.shortcut}>Esc</span>
              </span>
            </div>
          </div>

          {/* Settings Panel */}
          <div
            className={`${styles.settingsPanel} ${isDarkMode ? styles.dark : styles.light} ${showSettingsVisible ? styles.enter : styles.exit}`}
            onClick={(e) => e.stopPropagation()}
            style={
              toolbarPosition && toolbarPosition.y < 230
                ? {
                    bottom: "auto",
                    top: "calc(100% + 0.5rem)",
                  }
                : undefined
            }
          >
            <div
              className={`${styles.settingsPanelContainer} ${isTransitioning ? styles.transitioning : ""}`}
            >
              <div
                className={`${styles.settingsPage} ${settingsPage === "automations" ? styles.slideLeft : ""}`}
              >
                <div className={styles.settingsHeader}>
                  <span className={styles.settingsBrand}>
                    <span
                      className={styles.settingsBrandSlash}
                      style={{
                        color: settings.annotationColor,
                        transition: "color 0.2s ease",
                      }}
                    >
                      /
                    </span>
                    agentation
                  </span>
                  <span className={styles.settingsVersion}>v{__VERSION__}</span>
                  <button
                    className={styles.themeToggle}
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    title={
                      isDarkMode
                        ? "Switch to light mode"
                        : "Switch to dark mode"
                    }
                  >
                    <span className={styles.themeIconWrapper}>
                      <span
                        key={isDarkMode ? "sun" : "moon"}
                        className={styles.themeIcon}
                      >
                        {isDarkMode ? (
                          <IconSun size={20} />
                        ) : (
                          <IconMoon size={20} />
                        )}
                      </span>
                    </span>
                  </button>
                </div>

                <div className={styles.settingsSection}>
                  <div className={styles.settingsRow}>
                    <div
                      className={`${styles.settingsLabel} ${!isDarkMode ? styles.light : ""}`}
                    >
                      Output Detail
                      <Tooltip content="Controls how much detail is included in the copied output">
                        <span className={styles.helpIcon}>
                          <IconHelp size={20} />
                        </span>
                      </Tooltip>
                    </div>
                    <button
                      className={`${styles.cycleButton} ${!isDarkMode ? styles.light : ""}`}
                      onClick={() => {
                        const currentIndex = OUTPUT_DETAIL_OPTIONS.findIndex(
                          (opt) => opt.value === settings.outputDetail,
                        );
                        const nextIndex =
                          (currentIndex + 1) % OUTPUT_DETAIL_OPTIONS.length;
                        setSettings((s) => ({
                          ...s,
                          outputDetail: OUTPUT_DETAIL_OPTIONS[nextIndex].value,
                        }));
                      }}
                    >
                      <span
                        key={settings.outputDetail}
                        className={styles.cycleButtonText}
                      >
                        {
                          OUTPUT_DETAIL_OPTIONS.find(
                            (opt) => opt.value === settings.outputDetail,
                          )?.label
                        }
                      </span>
                      <span className={styles.cycleDots}>
                        {OUTPUT_DETAIL_OPTIONS.map((option, i) => (
                          <span
                            key={option.value}
                            className={`${styles.cycleDot} ${!isDarkMode ? styles.light : ""} ${settings.outputDetail === option.value ? styles.active : ""}`}
                          />
                        ))}
                      </span>
                    </button>
                  </div>

                  <div
                    className={`${styles.settingsRow} ${styles.settingsRowMarginTop} ${!isLocalhost ? styles.settingsRowDisabled : ""}`}
                  >
                    <div
                      className={`${styles.settingsLabel} ${!isDarkMode ? styles.light : ""}`}
                    >
                      React Components
                      <Tooltip
                        content={
                          !isLocalhost
                            ? "Disabled — production builds minify component names, making detection unreliable. Use on localhost in development mode."
                            : "Include React component names in annotations"
                        }
                      >
                        <span className={styles.helpIcon}>
                          <IconHelp size={20} />
                        </span>
                      </Tooltip>
                    </div>
                    <label
                      className={`${styles.toggleSwitch} ${!isLocalhost ? styles.disabled : ""}`}
                    >
                      <input
                        type="checkbox"
                        checked={isLocalhost && settings.reactEnabled}
                        disabled={!isLocalhost}
                        onChange={() =>
                          setSettings((s) => ({
                            ...s,
                            reactEnabled: !s.reactEnabled,
                          }))
                        }
                      />
                      <span className={styles.toggleSlider} />
                    </label>
                  </div>
                </div>

                <div className={styles.settingsSection}>
                  <div
                    className={`${styles.settingsLabel} ${styles.settingsLabelMarker} ${!isDarkMode ? styles.light : ""}`}
                  >
                    Marker Colour
                  </div>
                  <div className={styles.colorOptions}>
                    {COLOR_OPTIONS.map((color) => (
                      <div
                        key={color.value}
                        role="button"
                        onClick={() =>
                          setSettings((s) => ({
                            ...s,
                            annotationColor: color.value,
                          }))
                        }
                        style={{
                          borderColor:
                            settings.annotationColor === color.value
                              ? color.value
                              : "transparent",
                        }}
                        className={`${styles.colorOptionRing} ${settings.annotationColor === color.value ? styles.selected : ""}`}
                      >
                        <div
                          className={`${styles.colorOption} ${settings.annotationColor === color.value ? styles.selected : ""}`}
                          style={{ backgroundColor: color.value }}
                          title={color.label}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.settingsSection}>
                  <label className={styles.settingsToggle}>
                    <input
                      type="checkbox"
                      id="autoClearAfterCopy"
                      checked={settings.autoClearAfterCopy}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          autoClearAfterCopy: e.target.checked,
                        }))
                      }
                    />
                    <label
                      className={`${styles.customCheckbox} ${settings.autoClearAfterCopy ? styles.checked : ""}`}
                      htmlFor="autoClearAfterCopy"
                    >
                      {settings.autoClearAfterCopy && (
                        <IconCheckSmallAnimated size={14} />
                      )}
                    </label>
                    <span
                      className={`${styles.toggleLabel} ${!isDarkMode ? styles.light : ""}`}
                    >
                      Clear on copy/send
                      <Tooltip content="Automatically clear annotations after copying">
                        <span
                          className={`${styles.helpIcon} ${styles.helpIconNudge2}`}
                        >
                          <IconHelp size={20} />
                        </span>
                      </Tooltip>
                    </span>
                  </label>
                  <label
                    className={`${styles.settingsToggle} ${styles.settingsToggleMarginBottom}`}
                  >
                    <input
                      type="checkbox"
                      id="blockInteractions"
                      checked={settings.blockInteractions}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          blockInteractions: e.target.checked,
                        }))
                      }
                    />
                    <label
                      className={`${styles.customCheckbox} ${settings.blockInteractions ? styles.checked : ""}`}
                      htmlFor="blockInteractions"
                    >
                      {settings.blockInteractions && (
                        <IconCheckSmallAnimated size={14} />
                      )}
                    </label>
                    <span
                      className={`${styles.toggleLabel} ${!isDarkMode ? styles.light : ""}`}
                    >
                      Block page interactions
                    </span>
                  </label>
                </div>

                <div
                  className={`${styles.settingsSection} ${styles.settingsSectionExtraPadding}`}
                >
                  <button
                    className={`${styles.settingsNavLink} ${!isDarkMode ? styles.light : ""}`}
                    onClick={() => setSettingsPage("automations")}
                  >
                    <span>Manage MCP & Webhooks</span>
                    <span className={styles.settingsNavLinkRight}>
                      {endpoint && connectionStatus !== "disconnected" && (
                        <span
                          className={`${styles.mcpNavIndicator} ${styles[connectionStatus]}`}
                        />
                      )}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.5 12.5L12 8L7.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>

              {/* Automations Page */}
              <div
                className={`${styles.settingsPage} ${styles.automationsPage} ${settingsPage === "automations" ? styles.slideIn : ""}`}
              >
                <button
                  className={`${styles.settingsBackButton} ${!isDarkMode ? styles.light : ""}`}
                  onClick={() => setSettingsPage("main")}
                >
                  <IconChevronLeft size={16} />
                  <span>Manage MCP & Webhooks</span>
                </button>

                {/* MCP Connection section */}
                <div className={styles.settingsSection}>
                  <div className={styles.settingsRow}>
                    <span
                      className={`${styles.automationHeader} ${!isDarkMode ? styles.light : ""}`}
                    >
                      MCP Connection
                      <Tooltip content="Connect via Model Context Protocol to let AI agents like Claude Code receive annotations in real-time.">
                        <span
                          className={`${styles.helpIcon} ${styles.helpIconNudgeDown}`}
                        >
                          <IconHelp size={20} />
                        </span>
                      </Tooltip>
                    </span>
                    {endpoint && (
                      <div
                        className={`${styles.mcpStatusDot} ${styles[connectionStatus]}`}
                        title={
                          connectionStatus === "connected"
                            ? "Connected"
                            : connectionStatus === "connecting"
                              ? "Connecting..."
                              : "Disconnected"
                        }
                      />
                    )}
                  </div>
                  <p
                    className={`${styles.automationDescription} ${!isDarkMode ? styles.light : ""}`}
                    style={{ paddingBottom: 6 }}
                  >
                    MCP connection allows agents to receive and act on
                    annotations.{" "}
                    <a
                      href="https://agentation.dev/mcp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.learnMoreLink} ${!isDarkMode ? styles.light : ""}`}
                    >
                      Learn more
                    </a>
                  </p>
                </div>

                {/* Webhooks section */}
                <div
                  className={`${styles.settingsSection} ${styles.settingsSectionGrow}`}
                >
                  <div className={styles.settingsRow}>
                    <span
                      className={`${styles.automationHeader} ${!isDarkMode ? styles.light : ""}`}
                    >
                      Webhooks
                      <Tooltip content="Send annotation data to any URL endpoint when annotations change. Useful for custom integrations.">
                        <span
                          className={`${styles.helpIcon} ${styles.helpIconNoNudge}`}
                        >
                          <IconHelp size={20} />
                        </span>
                      </Tooltip>
                    </span>
                    <div className={styles.autoSendRow}>
                      <span
                        className={`${styles.autoSendLabel} ${!isDarkMode ? styles.light : ""} ${settings.webhooksEnabled ? styles.active : ""}`}
                      >
                        Auto-Send
                      </span>
                      <label
                        className={`${styles.toggleSwitch} ${!settings.webhookUrl ? styles.disabled : ""}`}
                      >
                        <input
                          type="checkbox"
                          checked={settings.webhooksEnabled}
                          disabled={!settings.webhookUrl}
                          onChange={() =>
                            setSettings((s) => ({
                              ...s,
                              webhooksEnabled: !s.webhooksEnabled,
                            }))
                          }
                        />
                        <span className={styles.toggleSlider} />
                      </label>
                    </div>
                  </div>
                  <p
                    className={`${styles.automationDescription} ${!isDarkMode ? styles.light : ""}`}
                  >
                    The webhook URL will receive live annotation changes and
                    annotation data.
                  </p>
                  <textarea
                    className={`${styles.webhookUrlInput} ${!isDarkMode ? styles.light : ""}`}
                    placeholder="Webhook URL"
                    value={settings.webhookUrl}
                    style={
                      {
                        "--marker-color": settings.annotationColor,
                      } as React.CSSProperties
                    }
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        webhookUrl: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Markers layer - normal scrolling markers */}
      <div className={styles.markersLayer} data-feedback-toolbar>
        {markersVisible &&
          visibleAnnotations
            .filter((a) => !a.isFixed)
            .map((annotation, index) => {
              const isHovered =
                !markersExiting && hoveredMarkerId === annotation.id;
              const isDeleting = deletingMarkerId === annotation.id;
              const showDeleteState =
                (isHovered || isDeleting) && !editingAnnotation;
              const isMulti = annotation.isMultiSelect;
              const markerColor = isMulti
                ? "#34C759"
                : settings.annotationColor;
              const globalIndex = annotations.findIndex(
                (a) => a.id === annotation.id,
              );
              const needsEnterAnimation = !animatedMarkers.has(annotation.id);
              const animClass = markersExiting
                ? styles.exit
                : isClearing
                  ? styles.clearing
                  : needsEnterAnimation
                    ? styles.enter
                    : "";

              const showDeleteHover =
                showDeleteState && settings.markerClickBehavior === "delete";
              return (
                <div
                  key={annotation.id}
                  className={`${styles.marker} ${isMulti ? styles.multiSelect : ""} ${animClass} ${showDeleteHover ? styles.hovered : ""}`}
                  data-annotation-marker
                  style={{
                    left: `${annotation.x}%`,
                    top: annotation.y,
                    backgroundColor: showDeleteHover ? undefined : markerColor,
                    animationDelay: markersExiting
                      ? `${(visibleAnnotations.length - 1 - index) * 20}ms`
                      : `${index * 20}ms`,
                  }}
                  onMouseEnter={() =>
                    !markersExiting &&
                    annotation.id !== recentlyAddedIdRef.current &&
                    handleMarkerHover(annotation)
                  }
                  onMouseLeave={() => handleMarkerHover(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!markersExiting) {
                      if (settings.markerClickBehavior === "delete") {
                        deleteAnnotation(annotation.id);
                      } else {
                        startEditAnnotation(annotation);
                      }
                    }
                  }}
                  onContextMenu={(e) => {
                    if (settings.markerClickBehavior === "delete") {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!markersExiting) startEditAnnotation(annotation);
                    }
                  }}
                >
                  {showDeleteState ? (
                    showDeleteHover ? (
                      <IconXmark size={isMulti ? 18 : 16} />
                    ) : (
                      <IconEdit size={16} />
                    )
                  ) : (
                    <span
                      className={
                        renumberFrom !== null && globalIndex >= renumberFrom
                          ? styles.renumber
                          : undefined
                      }
                    >
                      {globalIndex + 1}
                    </span>
                  )}
                  {isHovered && !editingAnnotation && (
                    <div
                      className={`${styles.markerTooltip} ${!isDarkMode ? styles.light : ""} ${styles.enter}`}
                      style={getTooltipPosition(annotation)}
                    >
                      <span className={styles.markerQuote}>
                        {annotation.element}
                        {annotation.selectedText &&
                          ` "${annotation.selectedText.slice(0, 30)}${annotation.selectedText.length > 30 ? "..." : ""}"`}
                      </span>
                      <span className={styles.markerNote}>
                        {annotation.comment}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

        {/* Exiting markers (normal) - individual deletion animations */}
        {markersVisible &&
          !markersExiting &&
          exitingAnnotationsList
            .filter((a) => !a.isFixed)
            .map((annotation) => {
              const isMulti = annotation.isMultiSelect;
              return (
                <div
                  key={annotation.id}
                  className={`${styles.marker} ${styles.hovered} ${isMulti ? styles.multiSelect : ""} ${styles.exit}`}
                  data-annotation-marker
                  style={{
                    left: `${annotation.x}%`,
                    top: annotation.y,
                  }}
                >
                  <IconXmark size={isMulti ? 12 : 10} />
                </div>
              );
            })}
      </div>

      {/* Fixed markers layer */}
      <div className={styles.fixedMarkersLayer} data-feedback-toolbar>
        {markersVisible &&
          visibleAnnotations
            .filter((a) => a.isFixed)
            .map((annotation, index) => {
              const fixedAnnotations = visibleAnnotations.filter(
                (a) => a.isFixed,
              );
              const isHovered =
                !markersExiting && hoveredMarkerId === annotation.id;
              const isDeleting = deletingMarkerId === annotation.id;
              const showDeleteState =
                (isHovered || isDeleting) && !editingAnnotation;
              const isMulti = annotation.isMultiSelect;
              const markerColor = isMulti
                ? "#34C759"
                : settings.annotationColor;
              const globalIndex = annotations.findIndex(
                (a) => a.id === annotation.id,
              );
              const needsEnterAnimation = !animatedMarkers.has(annotation.id);
              const animClass = markersExiting
                ? styles.exit
                : isClearing
                  ? styles.clearing
                  : needsEnterAnimation
                    ? styles.enter
                    : "";

              const showDeleteHover =
                showDeleteState && settings.markerClickBehavior === "delete";
              return (
                <div
                  key={annotation.id}
                  className={`${styles.marker} ${styles.fixed} ${isMulti ? styles.multiSelect : ""} ${animClass} ${showDeleteHover ? styles.hovered : ""}`}
                  data-annotation-marker
                  style={{
                    left: `${annotation.x}%`,
                    top: annotation.y,
                    backgroundColor: showDeleteHover ? undefined : markerColor,
                    animationDelay: markersExiting
                      ? `${(fixedAnnotations.length - 1 - index) * 20}ms`
                      : `${index * 20}ms`,
                  }}
                  onMouseEnter={() =>
                    !markersExiting &&
                    annotation.id !== recentlyAddedIdRef.current &&
                    handleMarkerHover(annotation)
                  }
                  onMouseLeave={() => handleMarkerHover(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!markersExiting) {
                      if (settings.markerClickBehavior === "delete") {
                        deleteAnnotation(annotation.id);
                      } else {
                        startEditAnnotation(annotation);
                      }
                    }
                  }}
                  onContextMenu={(e) => {
                    if (settings.markerClickBehavior === "delete") {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!markersExiting) startEditAnnotation(annotation);
                    }
                  }}
                >
                  {showDeleteState ? (
                    showDeleteHover ? (
                      <IconXmark size={isMulti ? 18 : 16} />
                    ) : (
                      <IconEdit size={16} />
                    )
                  ) : (
                    <span
                      className={
                        renumberFrom !== null && globalIndex >= renumberFrom
                          ? styles.renumber
                          : undefined
                      }
                    >
                      {globalIndex + 1}
                    </span>
                  )}
                  {isHovered && !editingAnnotation && (
                    <div
                      className={`${styles.markerTooltip} ${!isDarkMode ? styles.light : ""} ${styles.enter}`}
                      style={getTooltipPosition(annotation)}
                    >
                      <span className={styles.markerQuote}>
                        {annotation.element}
                        {annotation.selectedText &&
                          ` "${annotation.selectedText.slice(0, 30)}${annotation.selectedText.length > 30 ? "..." : ""}"`}
                      </span>
                      <span className={styles.markerNote}>
                        {annotation.comment}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

        {/* Exiting markers (fixed) - individual deletion animations */}
        {markersVisible &&
          !markersExiting &&
          exitingAnnotationsList
            .filter((a) => a.isFixed)
            .map((annotation) => {
              const isMulti = annotation.isMultiSelect;
              return (
                <div
                  key={annotation.id}
                  className={`${styles.marker} ${styles.fixed} ${styles.hovered} ${isMulti ? styles.multiSelect : ""} ${styles.exit}`}
                  data-annotation-marker
                  style={{
                    left: `${annotation.x}%`,
                    top: annotation.y,
                  }}
                >
                  <IconClose size={isMulti ? 12 : 10} />
                </div>
              );
            })}
      </div>

      {/* Interactive overlay */}
      {isActive && (
        <div
          className={styles.overlay}
          data-feedback-toolbar
          style={
            pendingAnnotation || editingAnnotation
              ? { zIndex: 99999 }
              : undefined
          }
        >
          {/* Hover highlight */}
          {hoverInfo?.rect &&
            !pendingAnnotation &&
            !isScrolling &&
            !isDragging && (
              <div
                className={`${styles.hoverHighlight} ${styles.enter}`}
                style={{
                  left: hoverInfo.rect.left,
                  top: hoverInfo.rect.top,
                  width: hoverInfo.rect.width,
                  height: hoverInfo.rect.height,
                  borderColor: `${settings.annotationColor}80`,
                  backgroundColor: `${settings.annotationColor}0A`,
                }}
              />
            )}

          {/* Cmd+shift+click multi-select highlights (during selection, before releasing modifiers) */}
          {pendingMultiSelectElements
            .filter((item) => document.contains(item.element))
            .map((item, index) => {
              const rect = item.element.getBoundingClientRect();
              // Only show green if 2+ elements selected, otherwise use default blue
              const isMulti = pendingMultiSelectElements.length > 1;
              return (
                <div
                  key={index}
                  className={
                    isMulti
                      ? styles.multiSelectOutline
                      : styles.singleSelectOutline
                  }
                  style={{
                    position: "fixed",
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height,
                    ...(isMulti
                      ? {}
                      : {
                          borderColor: `${settings.annotationColor}99`,
                          backgroundColor: `${settings.annotationColor}0D`,
                        }),
                  }}
                />
              );
            })}

          {/* Marker hover outline (shows bounding box of hovered annotation) */}
          {hoveredMarkerId &&
            !pendingAnnotation &&
            (() => {
              const hoveredAnnotation = annotations.find(
                (a) => a.id === hoveredMarkerId,
              );
              if (!hoveredAnnotation?.boundingBox) return null;

              // Render individual element boxes if available (cmd+shift+click multi-select)
              if (hoveredAnnotation.elementBoundingBoxes?.length) {
                // Use live positions from hoveredTargetElements when available
                if (hoveredTargetElements.length > 0) {
                  return hoveredTargetElements
                    .filter((el) => document.contains(el))
                    .map((el, index) => {
                      const rect = el.getBoundingClientRect();
                      return (
                        <div
                          key={`hover-outline-live-${index}`}
                          className={`${styles.multiSelectOutline} ${styles.enter}`}
                          style={{
                            left: rect.left,
                            top: rect.top,
                            width: rect.width,
                            height: rect.height,
                          }}
                        />
                      );
                    });
                }
                // Fallback to stored bounding boxes
                return hoveredAnnotation.elementBoundingBoxes.map(
                  (bb, index) => (
                    <div
                      key={`hover-outline-${index}`}
                      className={`${styles.multiSelectOutline} ${styles.enter}`}
                      style={{
                        left: bb.x,
                        top: bb.y - scrollY,
                        width: bb.width,
                        height: bb.height,
                      }}
                    />
                  ),
                );
              }

              // Single element: use live position from hoveredTargetElement when available
              const rect =
                hoveredTargetElement && document.contains(hoveredTargetElement)
                  ? hoveredTargetElement.getBoundingClientRect()
                  : null;

              const bb = rect
                ? { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
                : {
                    x: hoveredAnnotation.boundingBox.x,
                    y: hoveredAnnotation.isFixed
                      ? hoveredAnnotation.boundingBox.y
                      : hoveredAnnotation.boundingBox.y - scrollY,
                    width: hoveredAnnotation.boundingBox.width,
                    height: hoveredAnnotation.boundingBox.height,
                  };

              const isMulti = hoveredAnnotation.isMultiSelect;
              return (
                <div
                  className={`${isMulti ? styles.multiSelectOutline : styles.singleSelectOutline} ${styles.enter}`}
                  style={{
                    left: bb.x,
                    top: bb.y,
                    width: bb.width,
                    height: bb.height,
                    ...(isMulti
                      ? {}
                      : {
                          borderColor: `${settings.annotationColor}99`,
                          backgroundColor: `${settings.annotationColor}0D`,
                        }),
                  }}
                />
              );
            })()}

          {/* Hover tooltip */}
          {hoverInfo && !pendingAnnotation && !isScrolling && !isDragging && (
            <div
              className={`${styles.hoverTooltip} ${styles.enter}`}
              style={{
                left: Math.max(
                  8,
                  Math.min(hoverPosition.x, window.innerWidth - 100),
                ),
                top: Math.max(
                  hoverPosition.y - (hoverInfo.reactComponents ? 48 : 32),
                  8,
                ),
              }}
            >
              {hoverInfo.reactComponents && (
                <div className={styles.hoverReactPath}>
                  {hoverInfo.reactComponents}
                </div>
              )}
              <div className={styles.hoverElementName}>
                {hoverInfo.elementName}
              </div>
            </div>
          )}

          {/* Pending annotation marker + popup */}
          {pendingAnnotation && (
            <>
              {/* Show element/area outline while adding annotation */}
              {pendingAnnotation.multiSelectElements?.length
                ? // Cmd+shift+click multi-select: show individual boxes with live positions
                  pendingAnnotation.multiSelectElements
                    .filter((el) => document.contains(el))
                    .map((el, index) => {
                      const rect = el.getBoundingClientRect();
                      return (
                        <div
                          key={`pending-multi-${index}`}
                          className={`${styles.multiSelectOutline} ${pendingExiting ? styles.exit : styles.enter}`}
                          style={{
                            left: rect.left,
                            top: rect.top,
                            width: rect.width,
                            height: rect.height,
                          }}
                        />
                      );
                    })
                : // Single element or drag multi-select: show single box
                  pendingAnnotation.targetElement &&
                  document.contains(pendingAnnotation.targetElement)
                    ? // Single-click: use live getBoundingClientRect for consistent positioning
                      (() => {
                        const rect =
                          pendingAnnotation.targetElement!.getBoundingClientRect();
                        return (
                          <div
                            className={`${styles.singleSelectOutline} ${pendingExiting ? styles.exit : styles.enter}`}
                            style={{
                              left: rect.left,
                              top: rect.top,
                              width: rect.width,
                              height: rect.height,
                              borderColor: `${settings.annotationColor}99`,
                              backgroundColor: `${settings.annotationColor}0D`,
                            }}
                          />
                        );
                      })()
                    : // Drag selection or fallback: use stored boundingBox
                      pendingAnnotation.boundingBox && (
                        <div
                          className={`${pendingAnnotation.isMultiSelect ? styles.multiSelectOutline : styles.singleSelectOutline} ${pendingExiting ? styles.exit : styles.enter}`}
                          style={{
                            left: pendingAnnotation.boundingBox.x,
                            top: pendingAnnotation.boundingBox.y - scrollY,
                            width: pendingAnnotation.boundingBox.width,
                            height: pendingAnnotation.boundingBox.height,
                            ...(pendingAnnotation.isMultiSelect
                              ? {}
                              : {
                                  borderColor: `${settings.annotationColor}99`,
                                  backgroundColor: `${settings.annotationColor}0D`,
                                }),
                          }}
                        />
                      )}

              {(() => {
                // Use stored coordinates - they match what will be saved
                const markerX = pendingAnnotation.x;
                const markerY = pendingAnnotation.isFixed
                  ? pendingAnnotation.y
                  : pendingAnnotation.y - scrollY;

                return (
                  <>
                    <div
                      className={`${styles.marker} ${styles.pending} ${pendingAnnotation.isMultiSelect ? styles.multiSelect : ""} ${pendingExiting ? styles.exit : styles.enter}`}
                      style={{
                        left: `${markerX}%`,
                        top: markerY,
                        backgroundColor: pendingAnnotation.isMultiSelect
                          ? "#34C759"
                          : settings.annotationColor,
                      }}
                    >
                      <IconPlus size={12} />
                    </div>

                    <AnnotationPopupCSS
                      ref={popupRef}
                      element={pendingAnnotation.element}
                      selectedText={pendingAnnotation.selectedText}
                      computedStyles={pendingAnnotation.computedStylesObj}
                      placeholder={
                        pendingAnnotation.element === "Area selection"
                          ? "What should change in this area?"
                          : pendingAnnotation.isMultiSelect
                            ? "Feedback for this group of elements..."
                            : "What should change?"
                      }
                      onSubmit={addAnnotation}
                      onCancel={cancelAnnotation}
                      isExiting={pendingExiting}
                      lightMode={!isDarkMode}
                      accentColor={
                        pendingAnnotation.isMultiSelect
                          ? "#34C759"
                          : settings.annotationColor
                      }
                      style={{
                        // Popup is 280px wide, centered with translateX(-50%), so 140px each side
                        // Clamp so popup stays 20px from viewport edges
                        left: Math.max(
                          160,
                          Math.min(
                            window.innerWidth - 160,
                            (markerX / 100) * window.innerWidth,
                          ),
                        ),
                        // Position popup above or below marker to keep marker visible
                        ...(markerY > window.innerHeight - 290
                          ? { bottom: window.innerHeight - markerY + 20 }
                          : { top: markerY + 20 }),
                      }}
                    />
                  </>
                );
              })()}
            </>
          )}

          {/* Edit annotation popup */}
          {editingAnnotation && (
            <>
              {/* Show element/area outline while editing */}
              {editingAnnotation.elementBoundingBoxes?.length
                ? // Cmd+shift+click: show individual element boxes (use live rects when available)
                  (() => {
                    // Use live positions from editingTargetElements when available
                    if (editingTargetElements.length > 0) {
                      return editingTargetElements
                        .filter((el) => document.contains(el))
                        .map((el, index) => {
                          const rect = el.getBoundingClientRect();
                          return (
                            <div
                              key={`edit-multi-live-${index}`}
                              className={`${styles.multiSelectOutline} ${styles.enter}`}
                              style={{
                                left: rect.left,
                                top: rect.top,
                                width: rect.width,
                                height: rect.height,
                              }}
                            />
                          );
                        });
                    }
                    // Fallback to stored bounding boxes
                    return editingAnnotation.elementBoundingBoxes!.map(
                      (bb, index) => (
                        <div
                          key={`edit-multi-${index}`}
                          className={`${styles.multiSelectOutline} ${styles.enter}`}
                          style={{
                            left: bb.x,
                            top: bb.y - scrollY,
                            width: bb.width,
                            height: bb.height,
                          }}
                        />
                      ),
                    );
                  })()
                : // Single element or drag multi-select: show single box
                  (() => {
                    // Use live position from editingTargetElement when available
                    const rect =
                      editingTargetElement &&
                      document.contains(editingTargetElement)
                        ? editingTargetElement.getBoundingClientRect()
                        : null;

                    const bb = rect
                      ? { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
                      : editingAnnotation.boundingBox
                        ? {
                            x: editingAnnotation.boundingBox.x,
                            y: editingAnnotation.isFixed
                              ? editingAnnotation.boundingBox.y
                              : editingAnnotation.boundingBox.y - scrollY,
                            width: editingAnnotation.boundingBox.width,
                            height: editingAnnotation.boundingBox.height,
                          }
                        : null;

                    if (!bb) return null;

                    return (
                      <div
                        className={`${editingAnnotation.isMultiSelect ? styles.multiSelectOutline : styles.singleSelectOutline} ${styles.enter}`}
                        style={{
                          left: bb.x,
                          top: bb.y,
                          width: bb.width,
                          height: bb.height,
                          ...(editingAnnotation.isMultiSelect
                            ? {}
                            : {
                                borderColor: `${settings.annotationColor}99`,
                                backgroundColor: `${settings.annotationColor}0D`,
                              }),
                        }}
                      />
                    );
                  })()}

              <AnnotationPopupCSS
                ref={editPopupRef}
                element={editingAnnotation.element}
                selectedText={editingAnnotation.selectedText}
                computedStyles={parseComputedStylesString(
                  editingAnnotation.computedStyles,
                )}
                placeholder="Edit your feedback..."
                initialValue={editingAnnotation.comment}
                submitLabel="Save"
                onSubmit={updateAnnotation}
                onCancel={cancelEditAnnotation}
                onDelete={() => deleteAnnotation(editingAnnotation.id)}
                isExiting={editExiting}
                lightMode={!isDarkMode}
                accentColor={
                  editingAnnotation.isMultiSelect
                    ? "#34C759"
                    : settings.annotationColor
                }
                style={(() => {
                  const markerY = editingAnnotation.isFixed
                    ? editingAnnotation.y
                    : editingAnnotation.y - scrollY;
                  return {
                    // Popup is 280px wide, centered with translateX(-50%), so 140px each side
                    // Clamp so popup stays 20px from viewport edges
                    left: Math.max(
                      160,
                      Math.min(
                        window.innerWidth - 160,
                        (editingAnnotation.x / 100) * window.innerWidth,
                      ),
                    ),
                    // Position popup above or below marker to keep marker visible
                    ...(markerY > window.innerHeight - 290
                      ? { bottom: window.innerHeight - markerY + 20 }
                      : { top: markerY + 20 }),
                  };
                })()}
              />
            </>
          )}

          {/* Drag selection - all visuals use refs for smooth 60fps */}
          {isDragging && (
            <>
              <div ref={dragRectRef} className={styles.dragSelection} />
              <div
                ref={highlightsContainerRef}
                className={styles.highlightsContainer}
              />
            </>
          )}
        </div>
      )}
    </>,
    document.body,
  );
}

export default PageFeedbackToolbarCSS;
