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
} from "../../utils/element-identification";
import {
  loadAnnotations,
  saveAnnotations,
  getStorageKey,
} from "../../utils/storage";

import type { Annotation } from "../../types";
import styles from "./styles.module.scss";

// Module-level flag to prevent re-animating on SPA page navigation
let hasPlayedEntranceAnimation = false;

// =============================================================================
// Types
// =============================================================================

type HoverInfo = {
  element: string;
  elementPath: string;
  rect: DOMRect | null;
};

type OutputDetailLevel = "compact" | "standard" | "detailed" | "forensic";

type ToolbarSettings = {
  outputDetail: OutputDetailLevel;
  autoClearAfterCopy: boolean;
  annotationColor: string;
  blockInteractions: boolean;
};

const DEFAULT_SETTINGS: ToolbarSettings = {
  outputDetail: "standard",
  autoClearAfterCopy: false,
  annotationColor: "#3c82f7",
  blockInteractions: false,
};

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
      output += `**Feedback:** ${a.comment}\n\n`;
    } else {
      // Standard and detailed modes
      output += `### ${i + 1}. ${a.element}\n`;
      output += `**Location:** ${a.elementPath}\n`;

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
  /** Whether to copy to clipboard when the copy button is clicked. Defaults to true. */
  copyToClipboard?: boolean;
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
  copyToClipboard = true,
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
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [deletingMarkerId, setDeletingMarkerId] = useState<string | null>(null);
  const [renumberFrom, setRenumberFrom] = useState<number | null>(null);
  const [editingAnnotation, setEditingAnnotation] = useState<Annotation | null>(
    null,
  );
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSettingsVisible, setShowSettingsVisible] = useState(false);
  const [tooltipsHidden, setTooltipsHidden] = useState(false);

  // Hide tooltips after button click until mouse leaves
  const hideTooltipsUntilMouseLeave = () => {
    setTooltipsHidden(true);
  };

  const showTooltipsAgain = () => {
    setTooltipsHidden(false);
  };
  const [settings, setSettings] = useState<ToolbarSettings>(DEFAULT_SETTINGS);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showEntranceAnimation, setShowEntranceAnimation] = useState(false);

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
      const timer = setTimeout(() => setShowSettingsVisible(false), 0);
      return () => clearTimeout(timer);
    }
  }, [showSettings]);

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
      const timer = setTimeout(() => {
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
      const timer = setTimeout(() => {
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
      setTimeout(() => setShowEntranceAnimation(false), 750);
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

  // Demo annotations
  useEffect(() => {
    if (!enableDemoMode) return;
    if (!mounted || !demoAnnotations || demoAnnotations.length === 0) return;
    if (annotations.length > 0) return;

    const timeoutIds: ReturnType<typeof setTimeout>[] = [];

    timeoutIds.push(
      setTimeout(() => {
        setIsActive(true);
      }, demoDelay - 200),
    );

    demoAnnotations.forEach((demo, index) => {
      const annotationDelay = demoDelay + index * 300;

      timeoutIds.push(
        setTimeout(() => {
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

      scrollTimeoutRef.current = setTimeout(() => {
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

  // Save annotations
  useEffect(() => {
    if (mounted && annotations.length > 0) {
      saveAnnotations(pathname, annotations);
    } else if (mounted && annotations.length === 0) {
      localStorage.removeItem(getStorageKey(pathname));
    }
  }, [annotations, pathname, mounted]);

  // Freeze animations
  const freezeAnimations = useCallback(() => {
    if (isFrozen) return;

    const style = document.createElement("style");
    style.id = "feedback-freeze-styles";
    style.textContent = `
      *:not([data-feedback-toolbar]):not([data-feedback-toolbar] *):not([data-annotation-popup]):not([data-annotation-popup] *):not([data-annotation-marker]):not([data-annotation-marker] *),
      *:not([data-feedback-toolbar]):not([data-feedback-toolbar] *):not([data-annotation-popup]):not([data-annotation-popup] *):not([data-annotation-marker]):not([data-annotation-marker] *)::before,
      *:not([data-feedback-toolbar]):not([data-feedback-toolbar] *):not([data-annotation-popup]):not([data-annotation-popup] *):not([data-annotation-marker]):not([data-annotation-marker] *)::after {
        animation-play-state: paused !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);

    document.querySelectorAll("video").forEach((video) => {
      if (!video.paused) {
        video.dataset.wasPaused = "false";
        video.pause();
      }
    });

    setIsFrozen(true);
  }, [isFrozen]);

  // Unfreeze animations
  const unfreezeAnimations = useCallback(() => {
    if (!isFrozen) return;

    const style = document.getElementById("feedback-freeze-styles");
    if (style) style.remove();

    document.querySelectorAll("video").forEach((video) => {
      if (video.dataset.wasPaused === "false") {
        video.play();
        delete video.dataset.wasPaused;
      }
    });

    setIsFrozen(false);
  }, [isFrozen]);

  const toggleFreeze = useCallback(() => {
    if (isFrozen) {
      unfreezeAnimations();
    } else {
      freezeAnimations();
    }
  }, [isFrozen, freezeAnimations, unfreezeAnimations]);

  // Reset state when deactivating
  useEffect(() => {
    if (!isActive) {
      setPendingAnnotation(null);
      setEditingAnnotation(null);
      setHoverInfo(null);
      setShowSettings(false); // Close settings when toolbar closes
      if (isFrozen) {
        unfreezeAnimations();
      }
    }
  }, [isActive, isFrozen, unfreezeAnimations]);

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
      if ((e.target as HTMLElement).closest("[data-feedback-toolbar]")) {
        setHoverInfo(null);
        return;
      }

      const elementUnder = document.elementFromPoint(
        e.clientX,
        e.clientY,
      ) as HTMLElement;
      if (!elementUnder || elementUnder.closest("[data-feedback-toolbar]")) {
        setHoverInfo(null);
        return;
      }

      const { name, path } = identifyElement(elementUnder);
      const rect = elementUnder.getBoundingClientRect();

      setHoverInfo({ element: name, elementPath: path, rect });
      setHoverPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isActive, pendingAnnotation]);

  // Handle click
  useEffect(() => {
    if (!isActive) return;

    const handleClick = (e: MouseEvent) => {
      if (justFinishedDragRef.current) {
        justFinishedDragRef.current = false;
        return;
      }

      const target = e.target as HTMLElement;

      if (target.closest("[data-feedback-toolbar]")) return;
      if (target.closest("[data-annotation-popup]")) return;
      if (target.closest("[data-annotation-marker]")) return;

      const isInteractive = target.closest(
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

      const elementUnder = document.elementFromPoint(
        e.clientX,
        e.clientY,
      ) as HTMLElement;
      if (!elementUnder) return;

      const { name, path } = identifyElement(elementUnder);
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
  ]);

  // Multi-select drag - mousedown
  useEffect(() => {
    if (!isActive || pendingAnnotation) return;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest("[data-feedback-toolbar]")) return;
      if (target.closest("[data-annotation-marker]")) return;
      if (target.closest("[data-annotation-popup]")) return;

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
            el.closest("[data-feedback-toolbar]") ||
            el.closest("[data-annotation-marker]")
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
            el.closest("[data-feedback-toolbar]") ||
            el.closest("[data-annotation-marker]")
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
          const firstElementComputedStylesStr = getForensicComputedStyles(firstElement);

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
      };

      setAnnotations((prev) => [...prev, newAnnotation]);
      // Prevent immediate hover on newly added marker
      recentlyAddedIdRef.current = newAnnotation.id;
      setTimeout(() => {
        recentlyAddedIdRef.current = null;
      }, 300);
      // Mark as needing animation (will be set to animated after animation completes)
      setTimeout(() => {
        setAnimatedMarkers((prev) => new Set(prev).add(newAnnotation.id));
      }, 250);

      // Fire callback
      onAnnotationAdd?.(newAnnotation);

      // Animate out the pending annotation UI
      setPendingExiting(true);
      setTimeout(() => {
        setPendingAnnotation(null);
        setPendingExiting(false);
      }, 150);

      window.getSelection()?.removeAllRanges();
    },
    [pendingAnnotation, onAnnotationAdd],
  );

  // Cancel annotation with exit animation
  const cancelAnnotation = useCallback(() => {
    setPendingExiting(true);
    setTimeout(() => {
      setPendingAnnotation(null);
      setPendingExiting(false);
    }, 150); // Match exit animation duration
  }, []);

  // Delete annotation with exit animation
  const deleteAnnotation = useCallback(
    (id: string) => {
      const deletedIndex = annotations.findIndex((a) => a.id === id);
      const deletedAnnotation = annotations[deletedIndex];

      // Close edit panel if deleting the annotation being edited
      if (editingAnnotation?.id === id) {
        setEditingAnnotation(null);
      }

      setDeletingMarkerId(id);
      setExitingMarkers((prev) => new Set(prev).add(id));

      // Fire callback
      if (deletedAnnotation) {
        onAnnotationDelete?.(deletedAnnotation);
      }

      // Wait for exit animation then remove
      setTimeout(() => {
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
          setTimeout(() => setRenumberFrom(null), 200);
        }
      }, 150);
    },
    [annotations, editingAnnotation, onAnnotationDelete],
  );

  // Start editing an annotation (right-click)
  const startEditAnnotation = useCallback((annotation: Annotation) => {
    setEditingAnnotation(annotation);
    setHoveredMarkerId(null);
  }, []);

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

      // Animate out the edit popup
      setEditExiting(true);
      setTimeout(() => {
        setEditingAnnotation(null);
        setEditExiting(false);
      }, 150);
    },
    [editingAnnotation, onAnnotationUpdate],
  );

  // Cancel editing with exit animation
  const cancelEditAnnotation = useCallback(() => {
    setEditExiting(true);
    setTimeout(() => {
      setEditingAnnotation(null);
      setEditExiting(false);
    }, 150);
  }, []);

  // Clear all with staggered animation
  const clearAll = useCallback(() => {
    const count = annotations.length;
    if (count === 0) return;

    // Fire callback with all annotations before clearing
    onAnnotationsClear?.(annotations);

    setIsClearing(true);
    setCleared(true);

    const totalAnimationTime = count * 30 + 200;
    setTimeout(() => {
      setAnnotations([]);
      setAnimatedMarkers(new Set()); // Reset animated markers
      localStorage.removeItem(getStorageKey(pathname));
      setIsClearing(false);
    }, totalAnimationTime);

    setTimeout(() => setCleared(false), 1500);
  }, [pathname, annotations, onAnnotationsClear]);

  // Copy output
  const copyOutput = useCallback(async () => {
    const output = generateOutput(annotations, pathname, settings.outputDetail);
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
    setTimeout(() => setCopied(false), 2000);

    if (settings.autoClearAfterCopy) {
      setTimeout(() => clearAll(), 500);
    }
  }, [
    annotations,
    pathname,
    settings.outputDetail,
    settings.autoClearAfterCopy,
    clearAll,
    copyToClipboard,
    onCopy,
  ]);

  // Toolbar dragging - mousemove and mouseup
  useEffect(() => {
    if (!dragStartPos) return;

    const DRAG_THRESHOLD = 5; // pixels

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
        const containerWidth = 257;
        const circleWidth = 44;
        const toolbarHeight = 44;

        // When expanded, constrain the full container
        // When collapsed, only constrain the visible circle
        if (isActive) {
          // Expanded: constrain full 257px container
          newX = Math.max(
            padding,
            Math.min(window.innerWidth - containerWidth - padding, newX),
          );
        } else {
          // Collapsed: constrain 44px circle (which is at the right edge of the 257px container)
          const circleOffset = containerWidth - circleWidth;
          const minX = padding - circleOffset;
          const maxX = window.innerWidth - padding - circleOffset - circleWidth;
          newX = Math.max(minX, Math.min(maxX, newX));
        }

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
        // Clear flag after a short delay
        setTimeout(() => {
          justFinishedToolbarDragRef.current = false;
        }, 50);
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
  }, [dragStartPos, isDraggingToolbar, isActive]);

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
      const containerWidth = 257;
      const circleWidth = 44;
      const toolbarHeight = 44;

      let newX = toolbarPosition.x;
      let newY = toolbarPosition.y;

      // Constrain to viewport dimensions
      if (isActive) {
        // Expanded: constrain full 257px container
        newX = Math.max(
          padding,
          Math.min(window.innerWidth - containerWidth - padding, newX),
        );
      } else {
        // Collapsed: constrain 44px circle (which is at the right edge of the 257px container)
        const circleOffset = containerWidth - circleWidth;
        const minX = padding - circleOffset;
        const maxX = window.innerWidth - padding - circleOffset - circleWidth;
        newX = Math.max(minX, Math.min(maxX, newX));
      }

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
  }, [toolbarPosition, isActive]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (pendingAnnotation) {
          // Let popup handle
        } else if (isActive) {
          setIsActive(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, pendingAnnotation]);

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
          className={`${styles.toolbarContainer} ${!isDarkMode ? styles.light : ""} ${isActive ? styles.expanded : styles.collapsed} ${showEntranceAnimation ? styles.entrance : ""} ${isDraggingToolbar ? styles.dragging : ""}`}
          onClick={
            !isActive
              ? (e) => {
                  // Don't activate if we just finished dragging
                  if (justFinishedToolbarDragRef.current) {
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
          style={
            isDraggingToolbar
              ? {
                  transform: `scale(1.05) rotate(${dragRotation}deg)`,
                  cursor: "grabbing",
                }
              : undefined
          }
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
              toolbarPosition && toolbarPosition.y < 100 ? styles.tooltipBelow : ""
            } ${tooltipsHidden || showSettings ? styles.tooltipsHidden : ""}`}
            onMouseLeave={showTooltipsAgain}
          >
            <div className={`${styles.buttonWrapper} ${
              toolbarPosition && toolbarPosition.x < 120 ? styles.buttonWrapperAlignLeft : ""
            }`}>
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
                className={`${styles.controlButton} ${!isDarkMode ? styles.light : ""}`}
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
              <span className={styles.buttonTooltip}>
                Settings
              </span>
            </div>

            <div
              className={`${styles.divider} ${!isDarkMode ? styles.light : ""}`}
            />

            <div className={`${styles.buttonWrapper} ${
              toolbarPosition && typeof window !== "undefined" && toolbarPosition.x > window.innerWidth - 120 ? styles.buttonWrapperAlignRight : ""
            }`}>
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
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDarkMode ? <IconSun size={14} /> : <IconMoon size={14} />}
              </button>
            </div>

            <div className={styles.settingsSection}>
              <div className={styles.settingsRow}>
                <div
                  className={`${styles.settingsLabel} ${!isDarkMode ? styles.light : ""}`}
                >
                  Output Detail
                  <span
                    className={styles.helpIcon}
                    data-tooltip="Controls how much detail is included in the copied output"
                  >
                    <IconHelp size={20} />
                  </span>
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
                  Clear after output
                  <span
                    className={styles.helpIcon}
                    data-tooltip="Automatically clear annotations after copying"
                  >
                    <IconHelp size={20} />
                  </span>
                </span>
              </label>
              <label className={styles.settingsToggle}>
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
              const showDeleteState = isHovered || isDeleting;
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

              return (
                <div
                  key={annotation.id}
                  className={`${styles.marker} ${showDeleteState ? styles.hovered : ""} ${isMulti ? styles.multiSelect : ""} ${animClass}`}
                  data-annotation-marker
                  style={{
                    left: `${annotation.x}%`,
                    top: annotation.y,
                    backgroundColor: showDeleteState ? undefined : markerColor,
                    animationDelay: markersExiting
                      ? `${(visibleAnnotations.length - 1 - index) * 20}ms`
                      : `${index * 20}ms`,
                  }}
                  onMouseEnter={() =>
                    !markersExiting &&
                    annotation.id !== recentlyAddedIdRef.current &&
                    setHoveredMarkerId(annotation.id)
                  }
                  onMouseLeave={() => setHoveredMarkerId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!markersExiting) deleteAnnotation(annotation.id);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!markersExiting) startEditAnnotation(annotation);
                  }}
                >
                  {showDeleteState ? (
                    <IconXmark size={isMulti ? 18 : 16} />
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
              const showDeleteState = isHovered || isDeleting;
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

              return (
                <div
                  key={annotation.id}
                  className={`${styles.marker} ${styles.fixed} ${showDeleteState ? styles.hovered : ""} ${isMulti ? styles.multiSelect : ""} ${animClass}`}
                  data-annotation-marker
                  style={{
                    left: `${annotation.x}%`,
                    top: annotation.y,
                    backgroundColor: showDeleteState ? undefined : markerColor,
                    animationDelay: markersExiting
                      ? `${(fixedAnnotations.length - 1 - index) * 20}ms`
                      : `${index * 20}ms`,
                  }}
                  onMouseEnter={() =>
                    !markersExiting &&
                    annotation.id !== recentlyAddedIdRef.current &&
                    setHoveredMarkerId(annotation.id)
                  }
                  onMouseLeave={() => setHoveredMarkerId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!markersExiting) deleteAnnotation(annotation.id);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!markersExiting) startEditAnnotation(annotation);
                  }}
                >
                  {showDeleteState ? (
                    <IconClose size={isMulti ? 12 : 10} />
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

          {/* Marker hover outline (shows bounding box of hovered annotation) */}
          {hoveredMarkerId &&
            !pendingAnnotation &&
            (() => {
              const hoveredAnnotation = annotations.find(
                (a) => a.id === hoveredMarkerId,
              );
              if (!hoveredAnnotation?.boundingBox) return null;
              const bb = hoveredAnnotation.boundingBox;
              const isMulti = hoveredAnnotation.isMultiSelect;
              return (
                <div
                  className={`${isMulti ? styles.multiSelectOutline : styles.singleSelectOutline} ${styles.enter}`}
                  style={{
                    left: bb.x,
                    top: bb.y - scrollY,
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
                top: Math.max(hoverPosition.y - 32, 8),
              }}
            >
              {hoverInfo.element}
            </div>
          )}

          {/* Pending annotation marker + popup */}
          {pendingAnnotation && (
            <>
              {/* Show element/area outline while adding annotation */}
              {pendingAnnotation.boundingBox && (
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

              <div
                className={`${styles.marker} ${styles.pending} ${pendingAnnotation.isMultiSelect ? styles.multiSelect : ""} ${pendingExiting ? styles.exit : styles.enter}`}
                style={{
                  left: `${pendingAnnotation.x}%`,
                  top: pendingAnnotation.clientY,
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
                      (pendingAnnotation.x / 100) * window.innerWidth,
                    ),
                  ),
                  // Position popup above or below marker to keep marker visible
                  ...(pendingAnnotation.clientY > window.innerHeight - 290
                    ? { bottom: window.innerHeight - pendingAnnotation.clientY + 20 }
                    : { top: pendingAnnotation.clientY + 20 }),
                }}
              />
            </>
          )}

          {/* Edit annotation popup */}
          {editingAnnotation && (
            <>
              {/* Show element/area outline while editing */}
              {editingAnnotation.boundingBox && (
                <div
                  className={`${editingAnnotation.isMultiSelect ? styles.multiSelectOutline : styles.singleSelectOutline} ${styles.enter}`}
                  style={{
                    left: editingAnnotation.boundingBox.x,
                    top: editingAnnotation.boundingBox.y - scrollY,
                    width: editingAnnotation.boundingBox.width,
                    height: editingAnnotation.boundingBox.height,
                    ...(editingAnnotation.isMultiSelect
                      ? {}
                      : {
                          borderColor: `${settings.annotationColor}99`,
                          backgroundColor: `${settings.annotationColor}0D`,
                        }),
                  }}
                />
              )}

              <AnnotationPopupCSS
                ref={editPopupRef}
                element={editingAnnotation.element}
                selectedText={editingAnnotation.selectedText}
                computedStyles={parseComputedStylesString(editingAnnotation.computedStyles)}
                placeholder="Edit your feedback..."
                initialValue={editingAnnotation.comment}
                submitLabel="Save"
                onSubmit={updateAnnotation}
                onCancel={cancelEditAnnotation}
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
