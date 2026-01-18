"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import {
  AnnotationPopupCSS,
  AnnotationPopupCSSHandle,
} from "../annotation-popup-css";
import {
  IconFeedback,
  IconPlay,
  IconPause,
  EyeMorphIcon,
  CopyMorphIcon,
  TrashMorphIcon,
  IconChevronDown,
  IconClose,
  IconPlus,
  IconSettings,
  IconCheck,
} from "../icons";
import {
  identifyElement,
  getNearbyText,
  getElementClasses,
} from "../../utils/element-identification";
import {
  loadAnnotations,
  saveAnnotations,
  getStorageKey,
} from "../../utils/storage";

import type { Annotation } from "../../types";
import styles from "./styles.module.scss";

// =============================================================================
// Types
// =============================================================================

type HoverInfo = {
  element: string;
  elementPath: string;
  rect: DOMRect | null;
};

type OutputDetailLevel = "compact" | "standard" | "detailed";

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
];

const COLOR_OPTIONS = [
  { value: "#3c82f7", label: "Blue" },
  { value: "#34C759", label: "Green" },
  { value: "#FF9500", label: "Orange" },
  { value: "#AF52DE", label: "Purple" },
  { value: "#FF2D55", label: "Pink" },
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

  if (detailLevel !== "compact") {
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
};

// =============================================================================
// Component
// =============================================================================

export function PageFeedbackToolbarCSS({
  demoAnnotations,
  demoDelay = 1000,
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
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [deletingMarkerId, setDeletingMarkerId] = useState<string | null>(null);
  const [editingAnnotation, setEditingAnnotation] = useState<Annotation | null>(
    null,
  );
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSettingsVisible, setShowSettingsVisible] = useState(false);
  const [settings, setSettings] = useState<ToolbarSettings>(DEFAULT_SETTINGS);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // For animations - track which markers have animated in and which are exiting
  const [animatedMarkers, setAnimatedMarkers] = useState<Set<string>>(
    new Set(),
  );
  const [exitingMarkers, setExitingMarkers] = useState<Set<string>>(new Set());
  const [pendingExiting, setPendingExiting] = useState(false);

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
      const timer = setTimeout(() => setShowSettingsVisible(false), 150);
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

    try {
      const storedSettings = localStorage.getItem("feedback-toolbar-settings");
      if (storedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
      }
    } catch (e) {
      // Ignore parsing errors
    }

    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeQuery.matches);
    const handleDarkModeChange = (e: MediaQueryListEvent) =>
      setIsDarkMode(e.matches);
    darkModeQuery.addEventListener("change", handleDarkModeChange);
    return () =>
      darkModeQuery.removeEventListener("change", handleDarkModeChange);
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

  // Demo annotations
  useEffect(() => {
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
  }, [mounted, demoAnnotations, demoDelay]);

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
            if (meaningfulTags.has(el.tagName)) {
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

      // Animate out the pending annotation UI
      setPendingExiting(true);
      setTimeout(() => {
        setPendingAnnotation(null);
        setPendingExiting(false);
      }, 150);

      window.getSelection()?.removeAllRanges();
    },
    [pendingAnnotation],
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
  const deleteAnnotation = useCallback((id: string) => {
    setDeletingMarkerId(id);
    setExitingMarkers((prev) => new Set(prev).add(id));

    // Wait for exit animation then remove
    setTimeout(() => {
      setAnnotations((prev) => prev.filter((a) => a.id !== id));
      setExitingMarkers((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setDeletingMarkerId(null);
    }, 150);
  }, []);

  // Start editing an annotation (right-click)
  const startEditAnnotation = useCallback((annotation: Annotation) => {
    setEditingAnnotation(annotation);
    setHoveredMarkerId(null);
  }, []);

  // Update annotation (edit mode submit)
  const updateAnnotation = useCallback(
    (newComment: string) => {
      if (!editingAnnotation) return;

      setAnnotations((prev) =>
        prev.map((a) =>
          a.id === editingAnnotation.id ? { ...a, comment: newComment } : a,
        ),
      );
      setEditingAnnotation(null);
    },
    [editingAnnotation],
  );

  // Cancel editing
  const cancelEditAnnotation = useCallback(() => {
    setEditingAnnotation(null);
  }, []);

  // Clear all with staggered animation
  const clearAll = useCallback(() => {
    const count = annotations.length;
    if (count === 0) return;

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
  }, [pathname, annotations.length]);

  // Copy output
  const copyOutput = useCallback(async () => {
    const output = generateOutput(annotations, pathname, settings.outputDetail);
    if (!output) return;

    await navigator.clipboard.writeText(output);
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
  ]);

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

  return createPortal(
    <>
      {/* Toolbar */}
      <div className={styles.toolbar} data-feedback-toolbar>
        {/* Morphing container */}
        <div
          className={`${styles.toolbarContainer} ${isActive ? styles.expanded : styles.collapsed}`}
          onClick={!isActive ? () => setIsActive(true) : undefined}
          role={!isActive ? "button" : undefined}
          tabIndex={!isActive ? 0 : -1}
          title={!isActive ? "Start feedback mode" : undefined}
        >
        {/* Toggle content - visible when collapsed */}
        <div
          className={`${styles.toggleContent} ${!isActive ? styles.visible : styles.hidden}`}
        >
          <IconFeedback size={18} />
          {hasAnnotations && (
            <span
              className={`${styles.badge} ${isActive ? styles.fadeOut : ""}`}
              style={{ backgroundColor: settings.annotationColor }}
            >
              {annotations.length}
            </span>
          )}
        </div>

        {/* Controls content - visible when expanded */}
        <div
          className={`${styles.controlsContent} ${isActive ? styles.visible : styles.hidden}`}
        >
          <button
            className={styles.controlButton}
            onClick={(e) => {
              e.stopPropagation();
              toggleFreeze();
            }}
            title={isFrozen ? "Resume animations" : "Pause animations"}
            data-active={isFrozen}
          >
            {isFrozen ? <IconPlay size={16} /> : <IconPause size={16} />}
          </button>

          <button
            className={styles.controlButton}
            onClick={(e) => {
              e.stopPropagation();
              setShowMarkers(!showMarkers);
            }}
            title={showMarkers ? "Hide markers" : "Show markers"}
          >
            <EyeMorphIcon size={16} visible={showMarkers} />
          </button>

          <button
            className={styles.controlButton}
            onClick={(e) => {
              e.stopPropagation();
              copyOutput();
            }}
            disabled={!hasAnnotations}
            title="Copy feedback"
          >
            <CopyMorphIcon size={16} checked={copied} />
          </button>

          <button
            className={styles.controlButton}
            onClick={(e) => {
              e.stopPropagation();
              clearAll();
            }}
            disabled={!hasAnnotations}
            title="Clear all"
            data-danger
          >
            <TrashMorphIcon size={16} checked={cleared} />
          </button>

          <button
            className={styles.controlButton}
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(!showSettings);
            }}
            title="Settings"
            data-active={showSettings}
          >
            <IconSettings size={16} />
          </button>

          <div className={styles.divider} />

          <button
            className={styles.controlButton}
            onClick={(e) => {
              e.stopPropagation();
              setIsActive(false);
            }}
            title="Exit feedback mode"
          >
            <IconChevronDown size={16} />
          </button>
        </div>

        {/* Settings Panel - always dark themed */}
        {showSettingsVisible && (
          <div
            className={`${styles.settingsPanel} ${styles.dark} ${showSettings ? styles.enter : styles.exit}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.settingsHeader}>
              <svg
                width="80"
                height="14"
                viewBox="0 0 124 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Agentation"
              >
                <path
                  d="M114.336 16.72V5.368H116.734V7.304H116.844C116.961 7.01067 117.108 6.732 117.284 6.468C117.475 6.18934 117.702 5.95467 117.966 5.764C118.23 5.55867 118.538 5.39734 118.89 5.28C119.242 5.16267 119.653 5.104 120.122 5.104C121.266 5.104 122.19 5.478 122.894 6.226C123.598 6.974 123.95 8.03734 123.95 9.416V16.72H121.552V9.768C121.552 7.964 120.767 7.062 119.198 7.062C118.89 7.062 118.589 7.106 118.296 7.194C118.003 7.26734 117.739 7.38467 117.504 7.546C117.269 7.70734 117.079 7.91267 116.932 8.162C116.8 8.41134 116.734 8.69734 116.734 9.02V16.72H114.336Z"
                  fill="currentColor"
                />
                <path
                  d="M107.656 16.984C106.82 16.984 106.064 16.8447 105.39 16.566C104.73 16.2873 104.165 15.8913 103.696 15.378C103.241 14.8647 102.889 14.2413 102.64 13.508C102.39 12.7747 102.266 11.9533 102.266 11.044C102.266 10.1347 102.39 9.31334 102.64 8.58C102.889 7.84667 103.241 7.22334 103.696 6.71C104.165 6.19667 104.73 5.80067 105.39 5.522C106.064 5.24334 106.82 5.104 107.656 5.104C108.492 5.104 109.24 5.24334 109.9 5.522C110.574 5.80067 111.139 6.19667 111.594 6.71C112.063 7.22334 112.422 7.84667 112.672 8.58C112.921 9.31334 113.046 10.1347 113.046 11.044C113.046 11.9533 112.921 12.7747 112.672 13.508C112.422 14.2413 112.063 14.8647 111.594 15.378C111.139 15.8913 110.574 16.2873 109.9 16.566C109.24 16.8447 108.492 16.984 107.656 16.984ZM107.656 15.092C108.536 15.092 109.232 14.828 109.746 14.3C110.274 13.7573 110.538 12.958 110.538 11.902V10.186C110.538 9.13 110.274 8.338 109.746 7.81C109.232 7.26734 108.536 6.996 107.656 6.996C106.776 6.996 106.072 7.26734 105.544 7.81C105.03 8.338 104.774 9.13 104.774 10.186V11.902C104.774 12.958 105.03 13.7573 105.544 14.3C106.072 14.828 106.776 15.092 107.656 15.092Z"
                  fill="currentColor"
                />
                <path
                  d="M96.9277 3.30019C96.3117 3.30019 95.879 3.17552 95.6297 2.92619C95.395 2.67685 95.2777 2.36885 95.2777 2.00219V1.54019C95.2777 1.17352 95.395 0.86552 95.6297 0.616187C95.879 0.366854 96.3044 0.242188 96.9057 0.242188C97.5217 0.242188 97.947 0.366854 98.1817 0.616187C98.431 0.86552 98.5557 1.17352 98.5557 1.54019V2.00219C98.5557 2.36885 98.431 2.67685 98.1817 2.92619C97.947 3.17552 97.529 3.30019 96.9277 3.30019ZM91.8457 14.7842H95.7177V7.30419H91.8457V5.36819H98.1157V14.7842H101.746V16.7202H91.8457V14.7842Z"
                  fill="currentColor"
                />
                <path
                  d="M85.4743 16.7203C84.4769 16.7203 83.7436 16.4563 83.2743 15.9283C82.8049 15.3856 82.5703 14.6889 82.5703 13.8383V7.30426H79.0723V5.36826H81.5583C81.9836 5.36826 82.2843 5.28759 82.4603 5.12626C82.6363 4.95026 82.7243 4.64226 82.7243 4.20226V1.36426H84.9683V5.36826H89.8083V7.30426H84.9683V14.7843H89.8083V16.7203H85.4743Z"
                  fill="currentColor"
                />
                <path
                  d="M77.586 16.72C76.8967 16.72 76.376 16.544 76.024 16.192C75.6867 15.84 75.4814 15.378 75.408 14.806H75.298C75.078 15.4953 74.6747 16.0307 74.088 16.412C73.516 16.7933 72.7827 16.984 71.888 16.984C70.7294 16.984 69.8054 16.6833 69.116 16.082C68.4267 15.466 68.082 14.6227 68.082 13.552C68.082 12.452 68.4854 11.616 69.292 11.044C70.1134 10.4573 71.3674 10.164 73.054 10.164H75.232V9.284C75.232 7.744 74.418 6.974 72.79 6.974C72.0567 6.974 71.4627 7.12067 71.008 7.414C70.5534 7.69267 70.172 8.06667 69.864 8.536L68.434 7.37C68.7567 6.754 69.2994 6.226 70.062 5.786C70.8247 5.33134 71.8074 5.104 73.01 5.104C74.4474 5.104 75.5767 5.44867 76.398 6.138C77.2194 6.82734 77.63 7.82467 77.63 9.13V14.828H79.06V16.72H77.586ZM72.57 15.224C73.3474 15.224 73.9854 15.048 74.484 14.696C74.9827 14.344 75.232 13.8893 75.232 13.332V11.682H73.098C71.3674 11.682 70.502 12.2027 70.502 13.244V13.684C70.502 14.1973 70.6854 14.586 71.052 14.85C71.4187 15.0993 71.9247 15.224 72.57 15.224Z"
                  fill="currentColor"
                />
                <path
                  d="M62.6129 16.7203C61.6156 16.7203 60.8823 16.4563 60.4129 15.9283C59.9436 15.3856 59.7089 14.6889 59.7089 13.8383V7.30426H56.2109V5.36826H58.6969C59.1223 5.36826 59.4229 5.28759 59.5989 5.12626C59.7749 4.95026 59.8629 4.64226 59.8629 4.20226V1.36426H62.1069V5.36826H66.9469V7.30426H62.1069V14.7843H66.9469V16.7203H62.6129Z"
                  fill="currentColor"
                />
                <path
                  d="M45.7461 16.72V5.368H48.1441V7.304H48.2541C48.3714 7.01067 48.5181 6.732 48.6941 6.468C48.8848 6.18934 49.1121 5.95467 49.3761 5.764C49.6401 5.55867 49.9481 5.39734 50.3001 5.28C50.6521 5.16267 51.0628 5.104 51.5321 5.104C52.6761 5.104 53.6001 5.478 54.3041 6.226C55.0081 6.974 55.3601 8.03734 55.3601 9.416V16.72H52.9621V9.768C52.9621 7.964 52.1774 7.062 50.6081 7.062C50.3001 7.062 49.9994 7.106 49.7061 7.194C49.4128 7.26734 49.1488 7.38467 48.9141 7.546C48.6794 7.70734 48.4888 7.91267 48.3421 8.162C48.2101 8.41134 48.1441 8.69734 48.1441 9.02V16.72H45.7461Z"
                  fill="currentColor"
                />
                <path
                  d="M39.3091 16.984C38.4438 16.984 37.6664 16.8447 36.9771 16.566C36.2878 16.2873 35.7084 15.8913 35.2391 15.378C34.7698 14.8647 34.4104 14.2487 34.1611 13.53C33.9118 12.7967 33.7871 11.9753 33.7871 11.066C33.7871 10.1567 33.9118 9.33534 34.1611 8.602C34.4251 7.86867 34.7844 7.24534 35.2391 6.732C35.7084 6.204 36.2731 5.80067 36.9331 5.522C37.5931 5.24334 38.3264 5.104 39.1331 5.104C39.9251 5.104 40.6438 5.24334 41.2891 5.522C41.9344 5.786 42.4844 6.16734 42.9391 6.666C43.3938 7.16467 43.7384 7.75867 43.9731 8.448C44.2224 9.13734 44.3471 9.9 44.3471 10.736V11.638H36.2071V12.012C36.2071 12.9067 36.4858 13.64 37.0431 14.212C37.6004 14.7693 38.3704 15.048 39.3531 15.048C40.0864 15.048 40.7098 14.894 41.2231 14.586C41.7511 14.2633 42.1764 13.838 42.4991 13.31L43.9951 14.63C43.6138 15.29 43.0271 15.8473 42.2351 16.302C41.4578 16.7567 40.4824 16.984 39.3091 16.984ZM39.1331 6.93C38.7078 6.93 38.3118 7.00334 37.9451 7.15C37.5931 7.29667 37.2851 7.50934 37.0211 7.788C36.7718 8.052 36.5738 8.36734 36.4271 8.734C36.2804 9.10067 36.2071 9.504 36.2071 9.944V10.098H41.9051V9.878C41.9051 8.98334 41.6484 8.272 41.1351 7.744C40.6364 7.20134 39.9691 6.93 39.1331 6.93Z"
                  fill="currentColor"
                />
                <path
                  d="M33.576 17.9525C33.576 19.1258 33.0847 19.9911 32.102 20.5485C31.1193 21.1058 29.6233 21.3845 27.614 21.3845C26.6313 21.3845 25.8027 21.3185 25.128 21.1865C24.468 21.0691 23.9253 20.8931 23.5 20.6585C23.0893 20.4238 22.7887 20.1378 22.598 19.8005C22.422 19.4631 22.334 19.0818 22.334 18.6565C22.334 18.0405 22.5027 17.5565 22.84 17.2045C23.192 16.8671 23.6833 16.6178 24.314 16.4565V16.2365C23.9327 16.0898 23.6247 15.8845 23.39 15.6205C23.17 15.3565 23.06 15.0118 23.06 14.5865C23.06 14.0291 23.2507 13.6111 23.632 13.3325C24.0133 13.0391 24.5047 12.8191 25.106 12.6725V12.5625C24.4167 12.2398 23.8813 11.7851 23.5 11.1985C23.1187 10.6118 22.928 9.90779 22.928 9.08645C22.928 8.48512 23.038 7.94245 23.258 7.45845C23.478 6.95979 23.786 6.54179 24.182 6.20445C24.5927 5.85245 25.0767 5.58112 25.634 5.39045C26.206 5.19979 26.844 5.10445 27.548 5.10445C28.34 5.10445 29.0513 5.22912 29.682 5.47845V5.10445C29.682 4.66445 29.8067 4.29779 30.056 4.00445C30.3053 3.71112 30.6867 3.56445 31.2 3.56445H33.268V5.45645H30.628V5.98445C31.1266 6.32179 31.508 6.75445 31.772 7.28245C32.036 7.79579 32.168 8.39712 32.168 9.08645C32.168 9.68779 32.058 10.2378 31.838 10.7365C31.618 11.2205 31.3026 11.6385 30.892 11.9905C30.496 12.3278 30.012 12.5918 29.44 12.7825C28.8827 12.9585 28.252 13.0465 27.548 13.0465C27.0493 13.0465 26.58 13.0025 26.14 12.9145C25.876 12.9878 25.612 13.1125 25.348 13.2885C25.084 13.4645 24.952 13.7065 24.952 14.0145C24.952 14.3665 25.1207 14.5865 25.458 14.6745C25.7953 14.7625 26.2133 14.8065 26.712 14.8065H29.264C30.7893 14.8065 31.8893 15.0998 32.564 15.6865C33.2387 16.2585 33.576 17.0138 33.576 17.9525ZM31.332 18.1065C31.332 17.7251 31.178 17.4171 30.87 17.1825C30.562 16.9625 30.0047 16.8525 29.198 16.8525H25.26C24.7027 17.1165 24.424 17.5418 24.424 18.1285C24.424 18.5538 24.6 18.9205 24.952 19.2285C25.3187 19.5365 25.92 19.6905 26.756 19.6905H28.538C29.4473 19.6905 30.1367 19.5511 30.606 19.2725C31.09 19.0085 31.332 18.6198 31.332 18.1065ZM27.548 11.3965C28.3253 11.3965 28.8973 11.2131 29.264 10.8465C29.6307 10.4798 29.814 9.98845 29.814 9.37245V8.77845C29.814 8.16245 29.6307 7.67112 29.264 7.30445C28.8973 6.93779 28.3253 6.75445 27.548 6.75445C26.7707 6.75445 26.1987 6.93779 25.832 7.30445C25.4653 7.67112 25.282 8.16245 25.282 8.77845V9.37245C25.282 9.98845 25.4653 10.4798 25.832 10.8465C26.1987 11.2131 26.7707 11.3965 27.548 11.3965Z"
                  fill="currentColor"
                />
                <path
                  d="M20.4278 16.72C19.7385 16.72 19.2178 16.544 18.8658 16.192C18.5285 15.84 18.3232 15.378 18.2498 14.806H18.1398C17.9198 15.4953 17.5165 16.0307 16.9298 16.412C16.3578 16.7933 15.6245 16.984 14.7298 16.984C13.5712 16.984 12.6472 16.6833 11.9578 16.082C11.2685 15.466 10.9238 14.6227 10.9238 13.552C10.9238 12.452 11.3272 11.616 12.1338 11.044C12.9552 10.4573 14.2092 10.164 15.8958 10.164H18.0738V9.284C18.0738 7.744 17.2598 6.974 15.6318 6.974C14.8985 6.974 14.3045 7.12067 13.8498 7.414C13.3952 7.69267 13.0138 8.06667 12.7058 8.536L11.2758 7.37C11.5985 6.754 12.1412 6.226 12.9038 5.786C13.6665 5.33134 14.6492 5.104 15.8518 5.104C17.2892 5.104 18.4185 5.44867 19.2398 6.138C20.0612 6.82734 20.4718 7.82467 20.4718 9.13V14.828H21.9018V16.72H20.4278ZM15.4118 15.224C16.1892 15.224 16.8272 15.048 17.3258 14.696C17.8245 14.344 18.0738 13.8893 18.0738 13.332V11.682H15.9398C14.2092 11.682 13.3438 12.2027 13.3438 13.244V13.684C13.3438 14.1973 13.5272 14.586 13.8938 14.85C14.2605 15.0993 14.7665 15.224 15.4118 15.224Z"
                  fill="currentColor"
                />
                <path
                  d="M0 19.756L7.414 0H9.548L2.134 19.756H0Z"
                  fill="#4C74FF"
                />
              </svg>
              <span className={styles.settingsVersion}>v1.0.0</span>
            </div>

            <div className={styles.settingsSection}>
              <div className={styles.settingsLabel}>Output Detail</div>
              <div className={styles.settingsOptions}>
                {OUTPUT_DETAIL_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    className={`${styles.settingsOption} ${settings.outputDetail === option.value ? styles.selected : ""}`}
                    onClick={() =>
                      setSettings((s) => ({ ...s, outputDetail: option.value }))
                    }
                  >
                    {settings.outputDetail === option.value && (
                      <IconCheck size={10} />
                    )}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.settingsSection}>
              <div className={styles.settingsLabel}>Marker Color</div>
              <div className={styles.colorOptions}>
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    className={`${styles.colorOption} ${settings.annotationColor === color.value ? styles.selected : ""}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        annotationColor: color.value,
                      }))
                    }
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div className={styles.settingsSection}>
              <label className={styles.settingsToggle}>
                <input
                  type="checkbox"
                  checked={settings.autoClearAfterCopy}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      autoClearAfterCopy: e.target.checked,
                    }))
                  }
                />
                <span className={styles.toggleLabel}>Clear after copy</span>
              </label>
            </div>

            <div className={styles.settingsSection}>
              <label className={styles.settingsToggle}>
                <input
                  type="checkbox"
                  checked={settings.blockInteractions}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      blockInteractions: e.target.checked,
                    }))
                  }
                />
                <span className={styles.toggleLabel}>
                  Block page interactions
                </span>
              </label>
            </div>
          </div>
        )}
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
                    <IconClose size={isMulti ? 12 : 10} />
                  ) : (
                    globalIndex + 1
                  )}
                  {isHovered && !editingAnnotation && (
                    <div className={`${styles.markerTooltip} ${styles.enter}`}>
                      {annotation.selectedText && (
                        <span className={styles.markerQuote}>
                          &ldquo;{annotation.selectedText.slice(0, 50)}
                          {annotation.selectedText.length > 50 ? "..." : ""}
                          &rdquo;
                        </span>
                      )}
                      <span className={styles.markerNote}>
                        {annotation.comment}
                      </span>
                      <span className={styles.markerHint}>
                        Click to remove · Right-click to edit
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
                  <IconClose size={isMulti ? 12 : 10} />
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
                    globalIndex + 1
                  )}
                  {isHovered && !editingAnnotation && (
                    <div className={`${styles.markerTooltip} ${styles.enter}`}>
                      {annotation.selectedText && (
                        <span className={styles.markerQuote}>
                          &ldquo;{annotation.selectedText.slice(0, 50)}
                          {annotation.selectedText.length > 50 ? "..." : ""}
                          &rdquo;
                        </span>
                      )}
                      <span className={styles.markerNote}>
                        {annotation.comment}
                      </span>
                      <span className={styles.markerHint}>
                        Click to remove · Right-click to edit
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
        <div className={styles.overlay} data-feedback-toolbar>
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
                left: Math.min(hoverPosition.x, window.innerWidth - 150),
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
                placeholder={
                  pendingAnnotation.element === "Area selection"
                    ? "What should change in this area?"
                    : pendingAnnotation.isMultiSelect
                      ? "Feedback for this group of elements..."
                      : "What should change?"
                }
                onSubmit={addAnnotation}
                onCancel={cancelAnnotation}
                accentColor={
                  pendingAnnotation.isMultiSelect
                    ? "#34C759"
                    : settings.annotationColor
                }
                style={{
                  left: `${Math.min(Math.max(pendingAnnotation.x, 15), 85)}%`,
                  top: Math.min(
                    pendingAnnotation.clientY + 20,
                    window.innerHeight - 180,
                  ),
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
                placeholder="Edit your feedback..."
                initialValue={editingAnnotation.comment}
                submitLabel="Save"
                onSubmit={updateAnnotation}
                onCancel={cancelEditAnnotation}
                accentColor={
                  editingAnnotation.isMultiSelect
                    ? "#34C759"
                    : settings.annotationColor
                }
                style={{
                  left: `${Math.min(Math.max(editingAnnotation.x, 15), 85)}%`,
                  top: Math.min(
                    (editingAnnotation.isFixed
                      ? editingAnnotation.y
                      : editingAnnotation.y - scrollY) + 20,
                    window.innerHeight - 180,
                  ),
                }}
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
