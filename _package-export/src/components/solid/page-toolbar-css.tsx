import { createSignal, createEffect, onMount, onCleanup, For, Show, type JSX } from "solid-js";
import { Portal, isServer } from "solid-js/web";

import {
  AnnotationPopupCSS,
  AnnotationPopupCSSHandle,
} from "./annotation-popup-css";
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
} from "./icons";
import {
  identifyElement,
  getNearbyText,
  getElementClasses,
  getDetailedComputedStyles,
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
import styles from "../page-toolbar-css/styles.module.scss";

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
): JSX.CSSProperties | undefined {
  if (!isActive) return undefined;
  return {
    color: color,
    "background-color": hexToRgba(color, 0.25),
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

// Clear all child elements from a container safely
function clearContainer(container: HTMLElement): void {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

// =============================================================================
// Types for Props
// =============================================================================

export type DemoAnnotation = {
  selector: string;
  comment: string;
  selectedText?: string;
};

type PageFeedbackToolbarCSSProps = {
  demoAnnotations?: DemoAnnotation[];
  demoDelay?: number;
  enableDemoMode?: boolean;
};

// =============================================================================
// Component
// =============================================================================

export function PageFeedbackToolbarCSS(props: PageFeedbackToolbarCSSProps = {}) {
  const demoDelay = () => props.demoDelay ?? 1000;
  const enableDemoMode = () => props.enableDemoMode ?? false;

  const [isActive, setIsActive] = createSignal(false);
  const [annotations, setAnnotations] = createSignal<Annotation[]>([]);
  const [showMarkers, setShowMarkers] = createSignal(true);

  const [markersVisible, setMarkersVisible] = createSignal(false);
  const [markersExiting, setMarkersExiting] = createSignal(false);
  const [hoverInfo, setHoverInfo] = createSignal<HoverInfo | null>(null);
  const [hoverPosition, setHoverPosition] = createSignal({ x: 0, y: 0 });
  const [pendingAnnotation, setPendingAnnotation] = createSignal<{
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
    nearbyElements?: string;
  } | null>(null);
  const [copied, setCopied] = createSignal(false);
  const [cleared, setCleared] = createSignal(false);
  const [isClearing, setIsClearing] = createSignal(false);
  const [hoveredMarkerId, setHoveredMarkerId] = createSignal<string | null>(null);
  const [deletingMarkerId, setDeletingMarkerId] = createSignal<string | null>(null);
  const [renumberFrom, setRenumberFrom] = createSignal<number | null>(null);
  const [editingAnnotation, setEditingAnnotation] = createSignal<Annotation | null>(null);
  const [scrollY, setScrollY] = createSignal(0);
  const [isScrolling, setIsScrolling] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);
  const [isFrozen, setIsFrozen] = createSignal(false);
  const [showSettings, setShowSettings] = createSignal(false);
  const [showSettingsVisible, setShowSettingsVisible] = createSignal(false);
  const [settings, setSettings] = createSignal<ToolbarSettings>(DEFAULT_SETTINGS);
  const [isDarkMode, setIsDarkMode] = createSignal(true);
  const [showEntranceAnimation, setShowEntranceAnimation] = createSignal(false);

  const [toolbarPosition, setToolbarPosition] = createSignal<{ x: number; y: number } | null>(null);
  const [isDraggingToolbar, setIsDraggingToolbar] = createSignal(false);
  const [dragStartPos, setDragStartPos] = createSignal<{
    x: number;
    y: number;
    toolbarX: number;
    toolbarY: number;
  } | null>(null);
  const [dragRotation, setDragRotation] = createSignal(0);
  let justFinishedToolbarDragRef = false;

  const [animatedMarkers, setAnimatedMarkers] = createSignal<Set<string>>(new Set());
  const [exitingMarkers, setExitingMarkers] = createSignal<Set<string>>(new Set());
  const [pendingExiting, setPendingExiting] = createSignal(false);
  const [editExiting, setEditExiting] = createSignal(false);

  const [isDragging, setIsDragging] = createSignal(false);
  let mouseDownPosRef: { x: number; y: number } | null = null;
  let dragStartRef: { x: number; y: number } | null = null;
  let dragRectRef: HTMLDivElement | undefined;
  let highlightsContainerRef: HTMLDivElement | undefined;
  let justFinishedDragRef = false;
  let lastElementUpdateRef = 0;
  let recentlyAddedIdRef: string | null = null;
  const DRAG_THRESHOLD = 8;
  const ELEMENT_UPDATE_THROTTLE = 50;

  let popupRef: AnnotationPopupCSSHandle | undefined;
  let editPopupRef: AnnotationPopupCSSHandle | undefined;
  let scrollTimeoutRef: ReturnType<typeof setTimeout> | null = null;

  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";

  // Handle showSettings changes with exit animation
  createEffect(() => {
    if (showSettings()) {
      setShowSettingsVisible(true);
    } else {
      const timer = setTimeout(() => setShowSettingsVisible(false), 0);
      onCleanup(() => clearTimeout(timer));
    }
  });

  // Unified marker visibility
  const shouldShowMarkers = () => isActive() && showMarkers();
  createEffect(() => {
    if (shouldShowMarkers()) {
      setMarkersExiting(false);
      setMarkersVisible(true);
      setAnimatedMarkers(new Set<string>());
      const timer = setTimeout(() => {
        setAnimatedMarkers((prev) => {
          const newSet = new Set(prev);
          annotations().forEach((a) => newSet.add(a.id));
          return newSet;
        });
      }, 350);
      onCleanup(() => clearTimeout(timer));
    } else if (markersVisible()) {
      setMarkersExiting(true);
      const timer = setTimeout(() => {
        setMarkersVisible(false);
        setMarkersExiting(false);
      }, 250);
      onCleanup(() => clearTimeout(timer));
    }
  });

  // Mount and load
  onMount(() => {
    setMounted(true);
    setScrollY(window.scrollY);
    const stored = loadAnnotations<Annotation>(pathname);
    setAnnotations(stored);

    if (!hasPlayedEntranceAnimation) {
      setShowEntranceAnimation(true);
      hasPlayedEntranceAnimation = true;
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

    try {
      const savedTheme = localStorage.getItem("feedback-toolbar-theme");
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === "dark");
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  });

  // Save settings
  createEffect(() => {
    if (mounted()) {
      localStorage.setItem("feedback-toolbar-settings", JSON.stringify(settings()));
    }
  });

  // Save theme preference
  createEffect(() => {
    if (mounted()) {
      localStorage.setItem("feedback-toolbar-theme", isDarkMode() ? "dark" : "light");
    }
  });

  // Demo annotations
  createEffect(() => {
    if (!enableDemoMode()) return;
    if (!mounted() || !props.demoAnnotations || props.demoAnnotations.length === 0) return;
    if (annotations().length > 0) return;

    const timeoutIds: ReturnType<typeof setTimeout>[] = [];

    timeoutIds.push(
      setTimeout(() => {
        setIsActive(true);
      }, demoDelay() - 200),
    );

    props.demoAnnotations.forEach((demo, index) => {
      const annotationDelay = demoDelay() + index * 300;

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

    onCleanup(() => {
      timeoutIds.forEach(clearTimeout);
    });
  });

  // Track scroll
  onMount(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolling(true);

      if (scrollTimeoutRef) {
        clearTimeout(scrollTimeoutRef);
      }

      scrollTimeoutRef = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    onCleanup(() => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef) {
        clearTimeout(scrollTimeoutRef);
      }
    });
  });

  // Save annotations
  createEffect(() => {
    if (mounted() && annotations().length > 0) {
      saveAnnotations(pathname, annotations());
    } else if (mounted() && annotations().length === 0) {
      localStorage.removeItem(getStorageKey(pathname));
    }
  });

  // Freeze animations
  const freezeAnimations = () => {
    if (isFrozen()) return;

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
  };

  // Unfreeze animations
  const unfreezeAnimations = () => {
    if (!isFrozen()) return;

    const style = document.getElementById("feedback-freeze-styles");
    if (style) style.remove();

    document.querySelectorAll("video").forEach((video) => {
      if (video.dataset.wasPaused === "false") {
        video.play();
        delete video.dataset.wasPaused;
      }
    });

    setIsFrozen(false);
  };

  const toggleFreeze = () => {
    if (isFrozen()) {
      unfreezeAnimations();
    } else {
      freezeAnimations();
    }
  };

  // Reset state when deactivating
  createEffect(() => {
    if (!isActive()) {
      setPendingAnnotation(null);
      setEditingAnnotation(null);
      setHoverInfo(null);
      setShowSettings(false);
      if (isFrozen()) {
        unfreezeAnimations();
      }
    }
  });

  // Custom cursor
  createEffect(() => {
    if (!isActive()) return;

    const style = document.createElement("style");
    style.id = "feedback-cursor-styles";
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

    onCleanup(() => {
      const existingStyle = document.getElementById("feedback-cursor-styles");
      if (existingStyle) existingStyle.remove();
    });
  });

  // Handle mouse move
  createEffect(() => {
    if (!isActive() || pendingAnnotation()) return;

    const handleMouseMove = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-feedback-toolbar]")) {
        setHoverInfo(null);
        return;
      }

      const elementUnder = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
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
    onCleanup(() => document.removeEventListener("mousemove", handleMouseMove));
  });

  // Handle click
  createEffect(() => {
    if (!isActive()) return;

    const handleClick = (e: MouseEvent) => {
      if (justFinishedDragRef) {
        justFinishedDragRef = false;
        return;
      }

      const target = e.target as HTMLElement;

      if (target.closest("[data-feedback-toolbar]")) return;
      if (target.closest("[data-annotation-popup]")) return;
      if (target.closest("[data-annotation-marker]")) return;

      const isInteractive = target.closest(
        "button, a, input, select, textarea, [role='button'], [onclick]",
      );

      if (settings().blockInteractions && isInteractive) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (pendingAnnotation()) {
        if (isInteractive && !settings().blockInteractions) {
          return;
        }
        e.preventDefault();
        popupRef?.shake();
        return;
      }

      if (editingAnnotation()) {
        if (isInteractive && !settings().blockInteractions) {
          return;
        }
        e.preventDefault();
        editPopupRef?.shake();
        return;
      }

      e.preventDefault();

      const elementUnder = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
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

      const computedStylesObj = getDetailedComputedStyles(elementUnder);
      const computedStylesStr = Object.entries(computedStylesObj)
        .map(([k, v]) => `${k}: ${v}`)
        .join("; ");

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
        nearbyElements: getNearbyElements(elementUnder),
      });
      setHoverInfo(null);
    };

    document.addEventListener("click", handleClick, true);
    onCleanup(() => document.removeEventListener("click", handleClick, true));
  });

  // Multi-select drag - mousedown
  createEffect(() => {
    if (!isActive() || pendingAnnotation()) return;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest("[data-feedback-toolbar]")) return;
      if (target.closest("[data-annotation-marker]")) return;
      if (target.closest("[data-annotation-popup]")) return;

      const textTags = new Set([
        "P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "TD", "TH",
        "LABEL", "BLOCKQUOTE", "FIGCAPTION", "CAPTION", "LEGEND", "DT", "DD",
        "PRE", "CODE", "EM", "STRONG", "B", "I", "U", "S", "A", "TIME",
        "ADDRESS", "CITE", "Q", "ABBR", "DFN", "MARK", "SMALL", "SUB", "SUP",
      ]);

      if (textTags.has(target.tagName) || target.isContentEditable) {
        return;
      }

      mouseDownPosRef = { x: e.clientX, y: e.clientY };
    };

    document.addEventListener("mousedown", handleMouseDown);
    onCleanup(() => document.removeEventListener("mousedown", handleMouseDown));
  });

  // Multi-select drag - mousemove
  createEffect(() => {
    if (!isActive() || pendingAnnotation()) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseDownPosRef) return;

      const dx = e.clientX - mouseDownPosRef.x;
      const dy = e.clientY - mouseDownPosRef.y;
      const distance = dx * dx + dy * dy;
      const thresholdSq = DRAG_THRESHOLD * DRAG_THRESHOLD;

      if (!isDragging() && distance >= thresholdSq) {
        dragStartRef = mouseDownPosRef;
        setIsDragging(true);
      }

      if ((isDragging() || distance >= thresholdSq) && dragStartRef) {
        if (dragRectRef) {
          const left = Math.min(dragStartRef.x, e.clientX);
          const top = Math.min(dragStartRef.y, e.clientY);
          const width = Math.abs(e.clientX - dragStartRef.x);
          const height = Math.abs(e.clientY - dragStartRef.y);
          dragRectRef.style.transform = `translate(${left}px, ${top}px)`;
          dragRectRef.style.width = `${width}px`;
          dragRectRef.style.height = `${height}px`;
        }

        const now = Date.now();
        if (now - lastElementUpdateRef < ELEMENT_UPDATE_THROTTLE) {
          return;
        }
        lastElementUpdateRef = now;

        const startX = dragStartRef.x;
        const startY = dragStartRef.y;
        const left = Math.min(startX, e.clientX);
        const top = Math.min(startY, e.clientY);
        const right = Math.max(startX, e.clientX);
        const bottom = Math.max(startY, e.clientY);
        const midX = (left + right) / 2;
        const midY = (top + bottom) / 2;

        const candidateElements = new Set<HTMLElement>();
        const points = [
          [left, top], [right, top], [left, bottom], [right, bottom],
          [midX, midY], [midX, top], [midX, bottom], [left, midY], [right, midY],
        ];

        for (const [x, y] of points) {
          const elements = document.elementsFromPoint(x, y);
          for (const el of elements) {
            if (el instanceof HTMLElement) candidateElements.add(el);
          }
        }

        const nearbyElements = document.querySelectorAll(
          "button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th, div, span, section, article, aside, nav",
        );
        for (const el of nearbyElements) {
          if (el instanceof HTMLElement) {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const centerInside =
              centerX >= left && centerX <= right && centerY >= top && centerY <= bottom;

            const overlapX = Math.min(rect.right, right) - Math.max(rect.left, left);
            const overlapY = Math.min(rect.bottom, bottom) - Math.max(rect.top, top);
            const overlapArea = overlapX > 0 && overlapY > 0 ? overlapX * overlapY : 0;
            const elementArea = rect.width * rect.height;
            const overlapRatio = elementArea > 0 ? overlapArea / elementArea : 0;

            if (centerInside || overlapRatio > 0.5) {
              candidateElements.add(el);
            }
          }
        }

        const allMatching: DOMRect[] = [];
        const meaningfulTags = new Set([
          "BUTTON", "A", "INPUT", "IMG", "P", "H1", "H2", "H3", "H4", "H5", "H6",
          "LI", "LABEL", "TD", "TH", "SECTION", "ARTICLE", "ASIDE", "NAV",
        ]);

        for (const el of candidateElements) {
          if (el.closest("[data-feedback-toolbar]") || el.closest("[data-annotation-marker]"))
            continue;

          const rect = el.getBoundingClientRect();
          if (rect.width > window.innerWidth * 0.8 && rect.height > window.innerHeight * 0.5)
            continue;
          if (rect.width < 10 || rect.height < 10) continue;

          if (rect.left < right && rect.right > left && rect.top < bottom && rect.bottom > top) {
            const tagName = el.tagName;
            let shouldInclude = meaningfulTags.has(tagName);

            if (!shouldInclude && (tagName === "DIV" || tagName === "SPAN")) {
              const hasText = el.textContent && el.textContent.trim().length > 0;
              const isInteractive =
                el.onclick !== null ||
                el.getAttribute("role") === "button" ||
                el.getAttribute("role") === "link" ||
                el.classList.contains("clickable") ||
                el.hasAttribute("data-clickable");

              if ((hasText || isInteractive) && !el.querySelector("p, h1, h2, h3, h4, h5, h6, button, a")) {
                shouldInclude = true;
              }
            }

            if (shouldInclude) {
              let dominated = false;
              for (const existingRect of allMatching) {
                if (
                  existingRect.left <= rect.left &&
                  existingRect.right >= rect.right &&
                  existingRect.top <= rect.top &&
                  existingRect.bottom >= rect.bottom
                ) {
                  dominated = true;
                  break;
                }
              }
              if (!dominated) allMatching.push(rect);
            }
          }
        }

        if (highlightsContainerRef) {
          const container = highlightsContainerRef;
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
    onCleanup(() => document.removeEventListener("mousemove", handleMouseMove));
  });

  // Multi-select drag - mouseup
  createEffect(() => {
    if (!isActive()) return;

    const handleMouseUp = (e: MouseEvent) => {
      const wasDragging = isDragging();
      const dragStart = dragStartRef;

      if (isDragging() && dragStart) {
        justFinishedDragRef = true;

        const left = Math.min(dragStart.x, e.clientX);
        const top = Math.min(dragStart.y, e.clientY);
        const right = Math.max(dragStart.x, e.clientX);
        const bottom = Math.max(dragStart.y, e.clientY);

        const allMatching: { element: HTMLElement; rect: DOMRect }[] = [];
        const selector = "button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th";

        document.querySelectorAll(selector).forEach((el) => {
          if (!(el instanceof HTMLElement)) return;
          if (el.closest("[data-feedback-toolbar]") || el.closest("[data-annotation-marker]")) return;

          const rect = el.getBoundingClientRect();
          if (rect.width > window.innerWidth * 0.8 && rect.height > window.innerHeight * 0.5) return;
          if (rect.width < 10 || rect.height < 10) return;

          if (rect.left < right && rect.right > left && rect.top < bottom && rect.bottom > top) {
            allMatching.push({ element: el, rect });
          }
        });

        const finalElements = allMatching.filter(
          ({ element: el }) => !allMatching.some(({ element: other }) => other !== el && el.contains(other)),
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
            { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity },
          );

          const elementNames = finalElements
            .slice(0, 5)
            .map(({ element }) => identifyElement(element).name)
            .join(", ");
          const suffix = finalElements.length > 5 ? ` +${finalElements.length - 5} more` : "";

          const firstElement = finalElements[0].element;
          const firstElementComputedStyles = getDetailedComputedStyles(firstElement);
          const firstElementComputedStylesStr = Object.entries(firstElementComputedStyles)
            .map(([k, v]) => `${k}: ${v}`)
            .join("; ");

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
            fullPath: getFullElementPath(firstElement),
            accessibility: getAccessibilityInfo(firstElement),
            computedStyles: firstElementComputedStylesStr,
            nearbyElements: getNearbyElements(firstElement),
            cssClasses: getElementClasses(firstElement),
            nearbyText: getNearbyText(firstElement),
          });
        } else {
          const width = Math.abs(right - left);
          const height = Math.abs(bottom - top);

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
        justFinishedDragRef = true;
      }

      mouseDownPosRef = null;
      dragStartRef = null;
      setIsDragging(false);
      if (highlightsContainerRef) {
        clearContainer(highlightsContainerRef);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    onCleanup(() => document.removeEventListener("mouseup", handleMouseUp));
  });

  // Add annotation
  const addAnnotation = (comment: string) => {
    const pending = pendingAnnotation();
    if (!pending) return;

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      x: pending.x,
      y: pending.y,
      comment,
      element: pending.element,
      elementPath: pending.elementPath,
      timestamp: Date.now(),
      selectedText: pending.selectedText,
      boundingBox: pending.boundingBox,
      nearbyText: pending.nearbyText,
      cssClasses: pending.cssClasses,
      isMultiSelect: pending.isMultiSelect,
      isFixed: pending.isFixed,
      fullPath: pending.fullPath,
      accessibility: pending.accessibility,
      computedStyles: pending.computedStyles,
      nearbyElements: pending.nearbyElements,
    };

    setAnnotations((prev) => [...prev, newAnnotation]);
    recentlyAddedIdRef = newAnnotation.id;
    setTimeout(() => {
      recentlyAddedIdRef = null;
    }, 300);
    setTimeout(() => {
      setAnimatedMarkers((prev) => new Set(prev).add(newAnnotation.id));
    }, 250);

    setPendingExiting(true);
    setTimeout(() => {
      setPendingAnnotation(null);
      setPendingExiting(false);
    }, 150);

    window.getSelection()?.removeAllRanges();
  };

  // Cancel annotation with exit animation
  const cancelAnnotation = () => {
    setPendingExiting(true);
    setTimeout(() => {
      setPendingAnnotation(null);
      setPendingExiting(false);
    }, 150);
  };

  // Delete annotation with exit animation
  const deleteAnnotation = (id: string) => {
    const deletedIndex = annotations().findIndex((a) => a.id === id);
    setDeletingMarkerId(id);
    setExitingMarkers((prev) => new Set(prev).add(id));

    setTimeout(() => {
      setAnnotations((prev) => prev.filter((a) => a.id !== id));
      setExitingMarkers((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setDeletingMarkerId(null);

      if (deletedIndex < annotations().length - 1) {
        setRenumberFrom(deletedIndex);
        setTimeout(() => setRenumberFrom(null), 200);
      }
    }, 150);
  };

  // Start editing an annotation
  const startEditAnnotation = (annotation: Annotation) => {
    setEditingAnnotation(annotation);
    setHoveredMarkerId(null);
  };

  // Update annotation
  const updateAnnotation = (newComment: string) => {
    const editing = editingAnnotation();
    if (!editing) return;

    setAnnotations((prev) =>
      prev.map((a) => (a.id === editing.id ? { ...a, comment: newComment } : a)),
    );

    setEditExiting(true);
    setTimeout(() => {
      setEditingAnnotation(null);
      setEditExiting(false);
    }, 150);
  };

  // Cancel editing
  const cancelEditAnnotation = () => {
    setEditExiting(true);
    setTimeout(() => {
      setEditingAnnotation(null);
      setEditExiting(false);
    }, 150);
  };

  // Clear all
  const clearAll = () => {
    const count = annotations().length;
    if (count === 0) return;

    setIsClearing(true);
    setCleared(true);

    const totalAnimationTime = count * 30 + 200;
    setTimeout(() => {
      setAnnotations([]);
      setAnimatedMarkers(new Set<string>());
      localStorage.removeItem(getStorageKey(pathname));
      setIsClearing(false);
    }, totalAnimationTime);

    setTimeout(() => setCleared(false), 1500);
  };

  // Copy output
  const copyOutput = async () => {
    const output = generateOutput(annotations(), pathname, settings().outputDetail);
    if (!output) return;

    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    if (settings().autoClearAfterCopy) {
      setTimeout(() => clearAll(), 500);
    }
  };

  // Toolbar dragging
  createEffect(() => {
    const startPos = dragStartPos();
    if (!startPos) return;

    const DRAG_THRESHOLD = 5;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (!isDraggingToolbar() && distance > DRAG_THRESHOLD) {
        setIsDraggingToolbar(true);
      }

      if (isDraggingToolbar() || distance > DRAG_THRESHOLD) {
        let newX = startPos.toolbarX + deltaX;
        let newY = startPos.toolbarY + deltaY;

        const padding = 20;
        const containerWidth = 257;
        const circleWidth = 44;
        const toolbarHeight = 44;

        if (isActive()) {
          newX = Math.max(padding, Math.min(window.innerWidth - containerWidth - padding, newX));
        } else {
          const circleOffset = containerWidth - circleWidth;
          const minX = padding - circleOffset;
          const maxX = window.innerWidth - padding - circleOffset - circleWidth;
          newX = Math.max(minX, Math.min(maxX, newX));
        }

        newY = Math.max(padding, Math.min(window.innerHeight - toolbarHeight - padding, newY));

        setToolbarPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      if (isDraggingToolbar()) {
        justFinishedToolbarDragRef = true;
        setTimeout(() => {
          justFinishedToolbarDragRef = false;
        }, 50);
      }
      setIsDraggingToolbar(false);
      setDragStartPos(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    onCleanup(() => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    });
  });

  // Handle toolbar drag start
  const handleToolbarMouseDown = (e: MouseEvent) => {
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest(`.${styles.settingsPanel}`)
    ) {
      return;
    }

    const toolbarParent = (e.currentTarget as HTMLElement).parentElement;
    if (!toolbarParent) return;

    const rect = toolbarParent.getBoundingClientRect();
    const pos = toolbarPosition();
    const currentX = pos?.x ?? rect.left;
    const currentY = pos?.y ?? rect.top;

    const randomRotation = (Math.random() - 0.5) * 10;
    setDragRotation(randomRotation);

    setDragStartPos({
      x: e.clientX,
      y: e.clientY,
      toolbarX: currentX,
      toolbarY: currentY,
    });
  };

  // Keep toolbar in view
  createEffect(() => {
    const pos = toolbarPosition();
    if (!pos) return;

    const constrainPosition = () => {
      const padding = 20;
      const containerWidth = 257;
      const circleWidth = 44;
      const toolbarHeight = 44;

      let newX = pos.x;
      let newY = pos.y;

      if (isActive()) {
        newX = Math.max(padding, Math.min(window.innerWidth - containerWidth - padding, newX));
      } else {
        const circleOffset = containerWidth - circleWidth;
        const minX = padding - circleOffset;
        const maxX = window.innerWidth - padding - circleOffset - circleWidth;
        newX = Math.max(minX, Math.min(maxX, newX));
      }

      newY = Math.max(padding, Math.min(window.innerHeight - toolbarHeight - padding, newY));

      if (newX !== pos.x || newY !== pos.y) {
        setToolbarPosition({ x: newX, y: newY });
      }
    };

    constrainPosition();

    window.addEventListener("resize", constrainPosition);
    onCleanup(() => window.removeEventListener("resize", constrainPosition));
  });

  // Keyboard shortcuts
  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (pendingAnnotation()) {
          // Let popup handle
        } else if (isActive()) {
          setIsActive(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
  });

  // Helper for tooltip position
  const getTooltipPosition = (annotation: Annotation): JSX.CSSProperties => {
    const tooltipMaxWidth = 200;
    const tooltipEstimatedHeight = 80;
    const markerSize = 22;
    const gap = 10;

    const markerX = (annotation.x / 100) * window.innerWidth;
    const markerY = typeof annotation.y === "string" ? parseFloat(annotation.y) : annotation.y;

    const result: JSX.CSSProperties = {};

    const spaceBelow = window.innerHeight - markerY - markerSize - gap;
    if (spaceBelow < tooltipEstimatedHeight) {
      result.top = "auto";
      result.bottom = `calc(100% + ${gap}px)`;
    }

    const centerX = markerX - tooltipMaxWidth / 2;
    const edgePadding = 10;

    if (centerX < edgePadding) {
      const offset = edgePadding - centerX;
      result.left = `calc(50% + ${offset}px)`;
    } else if (centerX + tooltipMaxWidth > window.innerWidth - edgePadding) {
      const overflow = centerX + tooltipMaxWidth - (window.innerWidth - edgePadding);
      result.left = `calc(50% - ${overflow}px)`;
    }

    return result;
  };

  // Derived data
  const hasAnnotations = () => annotations().length > 0;
  const visibleAnnotations = () => annotations().filter((a) => !exitingMarkers().has(a.id));
  const exitingAnnotationsList = () => annotations().filter((a) => exitingMarkers().has(a.id));

  if (isServer) return null;

  return (
    <Show when={mounted()}>
      <Portal mount={document.body}>
        {/* Toolbar */}
        <div
          class={styles.toolbar}
          data-feedback-toolbar
          style={
            toolbarPosition()
              ? {
                  left: `${toolbarPosition()!.x}px`,
                  top: `${toolbarPosition()!.y}px`,
                  right: "auto",
                  bottom: "auto",
                }
              : undefined
          }
        >
          {/* Morphing container */}
          <div
            class={`${styles.toolbarContainer} ${!isDarkMode() ? styles.light : ""} ${isActive() ? styles.expanded : styles.collapsed} ${showEntranceAnimation() ? styles.entrance : ""} ${isDraggingToolbar() ? styles.dragging : ""}`}
            onClick={
              !isActive()
                ? (e) => {
                    if (justFinishedToolbarDragRef) {
                      e.preventDefault();
                      return;
                    }
                    setIsActive(true);
                  }
                : undefined
            }
            onMouseDown={handleToolbarMouseDown}
            role={!isActive() ? "button" : undefined}
            tabIndex={!isActive() ? 0 : -1}
            title={!isActive() ? "Start feedback mode" : undefined}
            style={
              isDraggingToolbar()
                ? {
                    transform: `scale(1.05) rotate(${dragRotation()}deg)`,
                    cursor: "grabbing",
                  }
                : undefined
            }
          >
            {/* Toggle content - visible when collapsed */}
            <div class={`${styles.toggleContent} ${!isActive() ? styles.visible : styles.hidden}`}>
              <IconListSparkle size={24} />
              <Show when={hasAnnotations()}>
                <span
                  class={`${styles.badge} ${isActive() ? styles.fadeOut : ""} ${showEntranceAnimation() ? styles.entrance : ""}`}
                  style={{ "background-color": settings().annotationColor }}
                >
                  {annotations().length}
                </span>
              </Show>
            </div>

            {/* Controls content - visible when expanded */}
            <div class={`${styles.controlsContent} ${isActive() ? styles.visible : styles.hidden}`}>
              <button
                class={`${styles.controlButton} ${!isDarkMode() ? styles.light : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFreeze();
                }}
                title={isFrozen() ? "Resume animations" : "Pause animations"}
                data-active={isFrozen()}
              >
                <IconPausePlayAnimated size={24} isPaused={isFrozen()} />
              </button>

              <button
                class={`${styles.controlButton} ${!isDarkMode() ? styles.light : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMarkers(!showMarkers());
                }}
                disabled={!hasAnnotations()}
                title={showMarkers() ? "Hide markers" : "Show markers"}
              >
                <IconEyeAnimated size={24} isOpen={showMarkers()} />
              </button>

              <button
                class={`${styles.controlButton} ${!isDarkMode() ? styles.light : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  copyOutput();
                }}
                disabled={!hasAnnotations()}
                title="Copy feedback"
                data-active={copied()}
              >
                <IconCopyAnimated size={24} copied={copied()} />
              </button>

              <button
                class={`${styles.controlButton} ${!isDarkMode() ? styles.light : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  clearAll();
                }}
                disabled={!hasAnnotations()}
                title="Clear all"
                data-danger
              >
                <IconTrashAlt size={24} />
              </button>

              <button
                class={`${styles.controlButton} ${!isDarkMode() ? styles.light : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings(!showSettings());
                }}
                title="Settings"
              >
                <IconGear size={24} />
              </button>

              <div class={`${styles.divider} ${!isDarkMode() ? styles.light : ""}`} />

              <button
                class={`${styles.controlButton} ${!isDarkMode() ? styles.light : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsActive(false);
                }}
                title="Exit feedback mode"
              >
                <IconXmarkLarge size={24} />
              </button>
            </div>

            {/* Settings Panel */}
            <div
              class={`${styles.settingsPanel} ${isDarkMode() ? styles.dark : styles.light} ${showSettingsVisible() ? styles.enter : styles.exit}`}
              onClick={(e) => e.stopPropagation()}
              style={
                toolbarPosition() && toolbarPosition()!.y < 230
                  ? { bottom: "auto", top: "calc(100% + 0.5rem)" }
                  : undefined
              }
            >
              <div class={styles.settingsHeader}>
                <span class={styles.settingsBrand}>
                  <span
                    class={styles.settingsBrandSlash}
                    style={{ color: settings().annotationColor, transition: "color 0.2s ease" }}
                  >
                    /
                  </span>
                  agentation
                </span>
                <span class={styles.settingsVersion}>v{__VERSION__}</span>
                <button
                  class={styles.themeToggle}
                  onClick={() => setIsDarkMode(!isDarkMode())}
                  title={isDarkMode() ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDarkMode() ? <IconSun size={14} /> : <IconMoon size={14} />}
                </button>
              </div>

              <div class={styles.settingsSection}>
                <div class={styles.settingsRow}>
                  <div class={`${styles.settingsLabel} ${!isDarkMode() ? styles.light : ""}`}>
                    Output Detail
                    <span class={styles.helpIcon} data-tooltip="Controls how much detail is included in the copied output">
                      <IconHelp size={20} />
                    </span>
                  </div>
                  <button
                    class={`${styles.cycleButton} ${!isDarkMode() ? styles.light : ""}`}
                    onClick={() => {
                      const currentIndex = OUTPUT_DETAIL_OPTIONS.findIndex(
                        (opt) => opt.value === settings().outputDetail,
                      );
                      const nextIndex = (currentIndex + 1) % OUTPUT_DETAIL_OPTIONS.length;
                      setSettings((s) => ({ ...s, outputDetail: OUTPUT_DETAIL_OPTIONS[nextIndex].value }));
                    }}
                  >
                    <span class={styles.cycleButtonText}>
                      {OUTPUT_DETAIL_OPTIONS.find((opt) => opt.value === settings().outputDetail)?.label}
                    </span>
                    <span class={styles.cycleDots}>
                      <For each={OUTPUT_DETAIL_OPTIONS}>
                        {(option) => (
                          <span
                            class={`${styles.cycleDot} ${!isDarkMode() ? styles.light : ""} ${settings().outputDetail === option.value ? styles.active : ""}`}
                          />
                        )}
                      </For>
                    </span>
                  </button>
                </div>
              </div>

              <div class={styles.settingsSection}>
                <div class={`${styles.settingsLabel} ${styles.settingsLabelMarker} ${!isDarkMode() ? styles.light : ""}`}>
                  Marker Colour
                </div>
                <div class={styles.colorOptions}>
                  <For each={COLOR_OPTIONS}>
                    {(color) => (
                      <div
                        onClick={() => setSettings((s) => ({ ...s, annotationColor: color.value }))}
                        style={{
                          "border-color": settings().annotationColor === color.value ? color.value : "transparent",
                        }}
                        class={`${styles.colorOptionRing} ${settings().annotationColor === color.value ? styles.selected : ""}`}
                      >
                        <div
                          class={`${styles.colorOption} ${settings().annotationColor === color.value ? styles.selected : ""}`}
                          style={{ "background-color": color.value }}
                          title={color.label}
                        />
                      </div>
                    )}
                  </For>
                </div>
              </div>

              <div class={styles.settingsSection}>
                <label class={styles.settingsToggle}>
                  <input
                    type="checkbox"
                    id="autoClearAfterCopy"
                    checked={settings().autoClearAfterCopy}
                    onChange={(e) => setSettings((s) => ({ ...s, autoClearAfterCopy: e.currentTarget.checked }))}
                  />
                  <label
                    class={`${styles.customCheckbox} ${settings().autoClearAfterCopy ? styles.checked : ""}`}
                    for="autoClearAfterCopy"
                  >
                    <Show when={settings().autoClearAfterCopy}>
                      <IconCheckSmallAnimated size={14} />
                    </Show>
                  </label>
                  <span class={`${styles.toggleLabel} ${!isDarkMode() ? styles.light : ""}`}>
                    Clear after output
                    <span class={styles.helpIcon} data-tooltip="Automatically clear annotations after copying">
                      <IconHelp size={20} />
                    </span>
                  </span>
                </label>
                <label class={styles.settingsToggle}>
                  <input
                    type="checkbox"
                    id="blockInteractions"
                    checked={settings().blockInteractions}
                    onChange={(e) => setSettings((s) => ({ ...s, blockInteractions: e.currentTarget.checked }))}
                  />
                  <label
                    class={`${styles.customCheckbox} ${settings().blockInteractions ? styles.checked : ""}`}
                    for="blockInteractions"
                  >
                    <Show when={settings().blockInteractions}>
                      <IconCheckSmallAnimated size={14} />
                    </Show>
                  </label>
                  <span class={`${styles.toggleLabel} ${!isDarkMode() ? styles.light : ""}`}>
                    Block page interactions
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Markers layer */}
        <div class={styles.markersLayer} data-feedback-toolbar>
          <Show when={markersVisible()}>
            <For each={visibleAnnotations().filter((a) => !a.isFixed)}>
              {(annotation, index) => {
                const isHovered = () => !markersExiting() && hoveredMarkerId() === annotation.id;
                const isDeleting = () => deletingMarkerId() === annotation.id;
                const showDeleteState = () => isHovered() || isDeleting();
                const isMulti = annotation.isMultiSelect;
                const markerColor = isMulti ? "#34C759" : settings().annotationColor;
                const globalIndex = () => annotations().findIndex((a) => a.id === annotation.id);
                const needsEnterAnimation = () => !animatedMarkers().has(annotation.id);
                const animClass = () =>
                  markersExiting()
                    ? styles.exit
                    : isClearing()
                      ? styles.clearing
                      : needsEnterAnimation()
                        ? styles.enter
                        : "";

                return (
                  <div
                    class={`${styles.marker} ${showDeleteState() ? styles.hovered : ""} ${isMulti ? styles.multiSelect : ""} ${animClass()}`}
                    data-annotation-marker
                    style={{
                      left: `${annotation.x}%`,
                      top: `${annotation.y}px`,
                      "background-color": showDeleteState() ? undefined : markerColor,
                      "animation-delay": markersExiting()
                        ? `${(visibleAnnotations().length - 1 - index()) * 20}ms`
                        : `${index() * 20}ms`,
                    }}
                    onMouseEnter={() =>
                      !markersExiting() && annotation.id !== recentlyAddedIdRef && setHoveredMarkerId(annotation.id)
                    }
                    onMouseLeave={() => setHoveredMarkerId(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!markersExiting()) deleteAnnotation(annotation.id);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!markersExiting()) startEditAnnotation(annotation);
                    }}
                  >
                    <Show when={showDeleteState()} fallback={
                      <span class={renumberFrom() !== null && globalIndex() >= renumberFrom()! ? styles.renumber : undefined}>
                        {globalIndex() + 1}
                      </span>
                    }>
                      <IconXmark size={isMulti ? 18 : 16} />
                    </Show>
                    <Show when={isHovered() && !editingAnnotation()}>
                      <div
                        class={`${styles.markerTooltip} ${!isDarkMode() ? styles.light : ""} ${styles.enter}`}
                        style={getTooltipPosition(annotation)}
                      >
                        <span class={styles.markerQuote}>
                          {annotation.element}
                          {annotation.selectedText &&
                            ` "${annotation.selectedText.slice(0, 30)}${annotation.selectedText.length > 30 ? "..." : ""}"`}
                        </span>
                        <span class={styles.markerNote}>{annotation.comment}</span>
                      </div>
                    </Show>
                  </div>
                );
              }}
            </For>

            {/* Exiting markers (normal) */}
            <Show when={!markersExiting()}>
              <For each={exitingAnnotationsList().filter((a) => !a.isFixed)}>
                {(annotation) => {
                  const isMulti = annotation.isMultiSelect;
                  return (
                    <div
                      class={`${styles.marker} ${styles.hovered} ${isMulti ? styles.multiSelect : ""} ${styles.exit}`}
                      data-annotation-marker
                      style={{ left: `${annotation.x}%`, top: `${annotation.y}px` }}
                    >
                      <IconXmark size={isMulti ? 12 : 10} />
                    </div>
                  );
                }}
              </For>
            </Show>
          </Show>
        </div>

        {/* Fixed markers layer */}
        <div class={styles.fixedMarkersLayer} data-feedback-toolbar>
          <Show when={markersVisible()}>
            <For each={visibleAnnotations().filter((a) => a.isFixed)}>
              {(annotation, index) => {
                const fixedAnnotations = () => visibleAnnotations().filter((a) => a.isFixed);
                const isHovered = () => !markersExiting() && hoveredMarkerId() === annotation.id;
                const isDeleting = () => deletingMarkerId() === annotation.id;
                const showDeleteState = () => isHovered() || isDeleting();
                const isMulti = annotation.isMultiSelect;
                const markerColor = isMulti ? "#34C759" : settings().annotationColor;
                const globalIndex = () => annotations().findIndex((a) => a.id === annotation.id);
                const needsEnterAnimation = () => !animatedMarkers().has(annotation.id);
                const animClass = () =>
                  markersExiting()
                    ? styles.exit
                    : isClearing()
                      ? styles.clearing
                      : needsEnterAnimation()
                        ? styles.enter
                        : "";

                return (
                  <div
                    class={`${styles.marker} ${styles.fixed} ${showDeleteState() ? styles.hovered : ""} ${isMulti ? styles.multiSelect : ""} ${animClass()}`}
                    data-annotation-marker
                    style={{
                      left: `${annotation.x}%`,
                      top: `${annotation.y}px`,
                      "background-color": showDeleteState() ? undefined : markerColor,
                      "animation-delay": markersExiting()
                        ? `${(fixedAnnotations().length - 1 - index()) * 20}ms`
                        : `${index() * 20}ms`,
                    }}
                    onMouseEnter={() =>
                      !markersExiting() && annotation.id !== recentlyAddedIdRef && setHoveredMarkerId(annotation.id)
                    }
                    onMouseLeave={() => setHoveredMarkerId(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!markersExiting()) deleteAnnotation(annotation.id);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!markersExiting()) startEditAnnotation(annotation);
                    }}
                  >
                    <Show when={showDeleteState()} fallback={
                      <span class={renumberFrom() !== null && globalIndex() >= renumberFrom()! ? styles.renumber : undefined}>
                        {globalIndex() + 1}
                      </span>
                    }>
                      <IconClose size={isMulti ? 12 : 10} />
                    </Show>
                    <Show when={isHovered() && !editingAnnotation()}>
                      <div
                        class={`${styles.markerTooltip} ${!isDarkMode() ? styles.light : ""} ${styles.enter}`}
                        style={getTooltipPosition(annotation)}
                      >
                        <span class={styles.markerQuote}>
                          {annotation.element}
                          {annotation.selectedText &&
                            ` "${annotation.selectedText.slice(0, 30)}${annotation.selectedText.length > 30 ? "..." : ""}"`}
                        </span>
                        <span class={styles.markerNote}>{annotation.comment}</span>
                      </div>
                    </Show>
                  </div>
                );
              }}
            </For>

            {/* Exiting markers (fixed) */}
            <Show when={!markersExiting()}>
              <For each={exitingAnnotationsList().filter((a) => a.isFixed)}>
                {(annotation) => {
                  const isMulti = annotation.isMultiSelect;
                  return (
                    <div
                      class={`${styles.marker} ${styles.fixed} ${styles.hovered} ${isMulti ? styles.multiSelect : ""} ${styles.exit}`}
                      data-annotation-marker
                      style={{ left: `${annotation.x}%`, top: `${annotation.y}px` }}
                    >
                      <IconClose size={isMulti ? 12 : 10} />
                    </div>
                  );
                }}
              </For>
            </Show>
          </Show>
        </div>

        {/* Interactive overlay */}
        <Show when={isActive()}>
          <div
            class={styles.overlay}
            data-feedback-toolbar
            style={pendingAnnotation() || editingAnnotation() ? { "z-index": 99999 } : undefined}
          >
            {/* Hover highlight */}
            <Show when={hoverInfo()?.rect && !pendingAnnotation() && !isScrolling() && !isDragging()}>
              <div
                class={`${styles.hoverHighlight} ${styles.enter}`}
                style={{
                  left: `${hoverInfo()!.rect!.left}px`,
                  top: `${hoverInfo()!.rect!.top}px`,
                  width: `${hoverInfo()!.rect!.width}px`,
                  height: `${hoverInfo()!.rect!.height}px`,
                  "border-color": `${settings().annotationColor}80`,
                  "background-color": `${settings().annotationColor}0A`,
                }}
              />
            </Show>

            {/* Marker hover outline */}
            <Show when={hoveredMarkerId() && !pendingAnnotation()}>
              {(() => {
                const hoveredAnnotation = () => annotations().find((a) => a.id === hoveredMarkerId());
                return (
                  <Show when={hoveredAnnotation()?.boundingBox}>
                    <div
                      class={`${hoveredAnnotation()!.isMultiSelect ? styles.multiSelectOutline : styles.singleSelectOutline} ${styles.enter}`}
                      style={{
                        left: `${hoveredAnnotation()!.boundingBox!.x}px`,
                        top: `${hoveredAnnotation()!.boundingBox!.y - scrollY()}px`,
                        width: `${hoveredAnnotation()!.boundingBox!.width}px`,
                        height: `${hoveredAnnotation()!.boundingBox!.height}px`,
                        ...(hoveredAnnotation()!.isMultiSelect
                          ? {}
                          : {
                              "border-color": `${settings().annotationColor}99`,
                              "background-color": `${settings().annotationColor}0D`,
                            }),
                      }}
                    />
                  </Show>
                );
              })()}
            </Show>

            {/* Hover tooltip */}
            <Show when={hoverInfo() && !pendingAnnotation() && !isScrolling() && !isDragging()}>
              <div
                class={`${styles.hoverTooltip} ${styles.enter}`}
                style={{
                  left: `${Math.max(8, Math.min(hoverPosition().x, window.innerWidth - 100))}px`,
                  top: `${Math.max(hoverPosition().y - 32, 8)}px`,
                }}
              >
                {hoverInfo()!.element}
              </div>
            </Show>

            {/* Pending annotation */}
            <Show when={pendingAnnotation()}>
              {(pending) => (
                <>
                  <Show when={pending().boundingBox}>
                    <div
                      class={`${pending().isMultiSelect ? styles.multiSelectOutline : styles.singleSelectOutline} ${pendingExiting() ? styles.exit : styles.enter}`}
                      style={{
                        left: `${pending().boundingBox!.x}px`,
                        top: `${pending().boundingBox!.y - scrollY()}px`,
                        width: `${pending().boundingBox!.width}px`,
                        height: `${pending().boundingBox!.height}px`,
                        ...(pending().isMultiSelect
                          ? {}
                          : {
                              "border-color": `${settings().annotationColor}99`,
                              "background-color": `${settings().annotationColor}0D`,
                            }),
                      }}
                    />
                  </Show>

                  <div
                    class={`${styles.marker} ${styles.pending} ${pending().isMultiSelect ? styles.multiSelect : ""} ${pendingExiting() ? styles.exit : styles.enter}`}
                    style={{
                      left: `${pending().x}%`,
                      top: `${pending().clientY}px`,
                      "background-color": pending().isMultiSelect ? "#34C759" : settings().annotationColor,
                    }}
                  >
                    <IconPlus size={12} />
                  </div>

                  <AnnotationPopupCSS
                    ref={(handle) => (popupRef = handle)}
                    element={pending().element}
                    selectedText={pending().selectedText}
                    placeholder={
                      pending().element === "Area selection"
                        ? "What should change in this area?"
                        : pending().isMultiSelect
                          ? "Feedback for this group of elements..."
                          : "What should change?"
                    }
                    onSubmit={addAnnotation}
                    onCancel={cancelAnnotation}
                    isExiting={pendingExiting()}
                    lightMode={!isDarkMode()}
                    accentColor={pending().isMultiSelect ? "#34C759" : settings().annotationColor}
                    style={{
                      left: `${Math.max(160, Math.min(window.innerWidth - 160, (pending().x / 100) * window.innerWidth))}px`,
                      top: `${Math.max(20, Math.min(pending().clientY + 20, window.innerHeight - 180))}px`,
                    }}
                  />
                </>
              )}
            </Show>

            {/* Edit annotation popup */}
            <Show when={editingAnnotation()}>
              {(editing) => (
                <>
                  <Show when={editing().boundingBox}>
                    <div
                      class={`${editing().isMultiSelect ? styles.multiSelectOutline : styles.singleSelectOutline} ${styles.enter}`}
                      style={{
                        left: `${editing().boundingBox!.x}px`,
                        top: `${editing().boundingBox!.y - scrollY()}px`,
                        width: `${editing().boundingBox!.width}px`,
                        height: `${editing().boundingBox!.height}px`,
                        ...(editing().isMultiSelect
                          ? {}
                          : {
                              "border-color": `${settings().annotationColor}99`,
                              "background-color": `${settings().annotationColor}0D`,
                            }),
                      }}
                    />
                  </Show>

                  <AnnotationPopupCSS
                    ref={(handle) => (editPopupRef = handle)}
                    element={editing().element}
                    selectedText={editing().selectedText}
                    placeholder="Edit your feedback..."
                    initialValue={editing().comment}
                    submitLabel="Save"
                    onSubmit={updateAnnotation}
                    onCancel={cancelEditAnnotation}
                    isExiting={editExiting()}
                    lightMode={!isDarkMode()}
                    accentColor={editing().isMultiSelect ? "#34C759" : settings().annotationColor}
                    style={{
                      left: `${Math.max(160, Math.min(window.innerWidth - 160, (editing().x / 100) * window.innerWidth))}px`,
                      top: `${Math.max(20, Math.min((editing().isFixed ? editing().y : editing().y - scrollY()) + 20, window.innerHeight - 180))}px`,
                    }}
                  />
                </>
              )}
            </Show>

            {/* Drag selection */}
            <Show when={isDragging()}>
              <div ref={(el) => dragRectRef = el} class={styles.dragSelection} />
              <div ref={(el) => highlightsContainerRef = el} class={styles.highlightsContainer} />
            </Show>
          </div>
        </Show>
      </Portal>
    </Show>
  );
}

export default PageFeedbackToolbarCSS;
