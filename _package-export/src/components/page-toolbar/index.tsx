"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

import { AnnotationPopup, AnnotationPopupHandle } from "../annotation-popup";
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

const OUTPUT_DETAIL_OPTIONS: {
  value: OutputDetailLevel;
  label: string;
  description: string;
}[] = [
  { value: "compact", label: "Compact", description: "Minimal output" },
  { value: "standard", label: "Standard", description: "Balanced detail" },
  { value: "detailed", label: "Detailed", description: "Full context" },
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

/**
 * Check if an element or any of its ancestors has fixed/sticky positioning.
 * Elements with fixed positioning should have markers that stay fixed to viewport.
 */
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

  // Include viewport dimensions
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
      // Compact: element name and feedback only
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

type PageFeedbackToolbarProps = {
  /**
   * Demo annotations that animate in on page load.
   * Each annotation targets an element by CSS selector.
   */
  demoAnnotations?: DemoAnnotation[];
  /**
   * Delay in ms before demo annotations start appearing.
   * Default: 1000
   */
  demoDelay?: number;
};

// =============================================================================
// Component
// =============================================================================

export function PageFeedbackToolbar({
  demoAnnotations,
  demoDelay = 1000,
}: PageFeedbackToolbarProps = {}) {
  const [isActive, setIsActive] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [showMarkers, setShowMarkers] = useState(true);
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
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ToolbarSettings>(DEFAULT_SETTINGS);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Multi-select drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [dragCurrent, setDragCurrent] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedElements, setSelectedElements] = useState<
    { element: HTMLElement; rect: DOMRect }[]
  >([]);
  const mouseDownPosRef = useRef<{ x: number; y: number } | null>(null);
  const justFinishedDragRef = useRef(false);
  const lastElementUpdateRef = useRef(0);
  const DRAG_THRESHOLD = 8; // Minimum pixels to move before starting drag
  const ELEMENT_UPDATE_THROTTLE = 50; // Throttle element detection to every 50ms

  const popupRef = useRef<AnnotationPopupHandle>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";

  // Mount and load
  useEffect(() => {
    setMounted(true);
    setScrollY(window.scrollY);
    const stored = loadAnnotations<Annotation>(pathname);
    setAnnotations(stored);

    // Load settings
    try {
      const storedSettings = localStorage.getItem("feedback-toolbar-settings");
      if (storedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
      }
    } catch (e) {
      // Ignore parsing errors
    }

    // Detect dark mode
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeQuery.matches);
    const handleDarkModeChange = (e: MediaQueryListEvent) =>
      setIsDarkMode(e.matches);
    darkModeQuery.addEventListener("change", handleDarkModeChange);
    return () =>
      darkModeQuery.removeEventListener("change", handleDarkModeChange);
  }, [pathname]);

  // Save settings when changed
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(
        "feedback-toolbar-settings",
        JSON.stringify(settings),
      );
    }
  }, [settings, mounted]);

  // Demo annotations - animate in on page load
  useEffect(() => {
    if (!mounted || !demoAnnotations || demoAnnotations.length === 0) return;

    // Skip if there are already annotations
    if (annotations.length > 0) return;

    const timeoutIds: ReturnType<typeof setTimeout>[] = [];

    // Activate toolbar first
    timeoutIds.push(
      setTimeout(() => {
        setIsActive(true);
      }, demoDelay - 200),
    );

    // Add each demo annotation with staggered timing
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

  // Track scroll for marker positions and fade behavior
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolling(true);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set timeout to mark scrolling as done
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
      *, *::before, *::after {
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

  // Toggle freeze
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
      setHoverInfo(null);
      if (isFrozen) {
        unfreezeAnimations();
      }
    }
  }, [isActive, isFrozen, unfreezeAnimations]);

  // Apply custom cursor when active - text cursor for text elements, crosshair for others
  useEffect(() => {
    if (!isActive) return;

    const style = document.createElement("style");
    style.id = "feedback-cursor-styles";
    style.textContent = `
      body:not([data-feedback-toolbar]) * {
        cursor: crosshair !important;
      }
      /* Text elements get text cursor */
      p, span, h1, h2, h3, h4, h5, h6, li, td, th, label,
      blockquote, figcaption, caption, legend, dt, dd,
      [contenteditable], pre, code, em, strong, b, i, u, s,
      a, time, address, cite, q, abbr, dfn, mark, small, sub, sup {
        cursor: text !important;
      }
      /* Toolbar and markers keep their cursors */
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

  // Handle mouse move (document level)
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

  // Handle click (document level)
  useEffect(() => {
    if (!isActive) return;

    const handleClick = (e: MouseEvent) => {
      // Ignore click if we just finished a drag selection
      if (justFinishedDragRef.current) {
        justFinishedDragRef.current = false;
        return;
      }

      const target = e.target as HTMLElement;

      if (target.closest("[data-feedback-toolbar]")) return;
      if (target.closest("[data-annotation-popup]")) return;
      if (target.closest("[data-annotation-marker]")) return;

      // If there's a pending annotation
      if (pendingAnnotation) {
        const isInteractive = target.closest(
          "button, a, input, select, textarea, [role='button'], [onclick]",
        );
        if (isInteractive && !settings.blockInteractions) {
          // Let the click through without shaking - don't interrupt normal site usage
          return;
        }
        // Non-interactive element clicked (or interactions blocked) - shake to remind user
        e.preventDefault();
        popupRef.current?.shake();
        return;
      }

      // Block interactions on interactive elements if setting is enabled
      if (settings.blockInteractions) {
        const isInteractive = target.closest(
          "button, a, input, select, textarea, [role='button'], [onclick]",
        );
        if (isInteractive) {
          e.preventDefault();
          e.stopPropagation();
        }
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

      // Check if element is fixed/sticky - if so, marker should stay fixed to viewport
      const isFixed = isElementFixed(elementUnder);
      // For fixed elements, y is viewport-relative; for normal elements, y is document-relative
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

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isActive, pendingAnnotation]);

  // Multi-select drag - mousedown to start tracking
  useEffect(() => {
    if (!isActive || pendingAnnotation) return;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Ignore if clicking on toolbar, markers, or interactive elements
      if (target.closest("[data-feedback-toolbar]")) return;
      if (target.closest("[data-annotation-marker]")) return;
      if (target.closest("[data-annotation-popup]")) return;

      // Record the initial position
      mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isActive, pendingAnnotation]);

  // Multi-select drag - mousemove to potentially start drag and update selection
  useEffect(() => {
    if (!isActive || pendingAnnotation) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Only process if we have a mousedown position
      if (!mouseDownPosRef.current) return;

      const dx = e.clientX - mouseDownPosRef.current.x;
      const dy = e.clientY - mouseDownPosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Start dragging if moved past threshold
      if (!isDragging && distance >= DRAG_THRESHOLD) {
        setIsDragging(true);
        setDragStart(mouseDownPosRef.current);
        setDragCurrent({ x: e.clientX, y: e.clientY });
      }

      // If dragging, update current position
      if (isDragging || distance >= DRAG_THRESHOLD) {
        setDragCurrent({ x: e.clientX, y: e.clientY });

        // Throttle element detection for performance
        const now = Date.now();
        if (now - lastElementUpdateRef.current < ELEMENT_UPDATE_THROTTLE) {
          return;
        }
        lastElementUpdateRef.current = now;

        // Calculate selection rectangle
        const startX = mouseDownPosRef.current.x;
        const startY = mouseDownPosRef.current.y;
        const left = Math.min(startX, e.clientX);
        const top = Math.min(startY, e.clientY);
        const right = Math.max(startX, e.clientX);
        const bottom = Math.max(startY, e.clientY);

        // Find elements using elementsFromPoint at corners and center for better performance
        const pointsToCheck = [
          [left, top],
          [right, top],
          [left, bottom],
          [right, bottom],
          [(left + right) / 2, (top + bottom) / 2],
          [left, (top + bottom) / 2],
          [right, (top + bottom) / 2],
          [(left + right) / 2, top],
          [(left + right) / 2, bottom],
        ];

        const candidateElements = new Set<HTMLElement>();
        pointsToCheck.forEach(([x, y]) => {
          const elements = document.elementsFromPoint(x, y);
          elements.forEach((el) => {
            if (el instanceof HTMLElement) candidateElements.add(el);
          });
        });

        // Also check elements near the selection bounds
        const nearbyElements = document.querySelectorAll(
          "button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th, div, span, section, article, aside, nav",
        );
        nearbyElements.forEach((el) => {
          if (el instanceof HTMLElement) {
            const rect = el.getBoundingClientRect();
            // Check if element's center point is inside the selection rectangle
            // or if the element intersects significantly with the selection
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const centerInside =
              centerX >= left &&
              centerX <= right &&
              centerY >= top &&
              centerY <= bottom;

            // Also include if element overlaps significantly
            const overlapX = Math.min(rect.right, right) - Math.max(rect.left, left);
            const overlapY = Math.min(rect.bottom, bottom) - Math.max(rect.top, top);
            const overlapArea = overlapX > 0 && overlapY > 0 ? overlapX * overlapY : 0;
            const elementArea = rect.width * rect.height;
            const overlapRatio = elementArea > 0 ? overlapArea / elementArea : 0;

            if (centerInside || overlapRatio > 0.5) {
              candidateElements.add(el);
            }
          }
        });

        // First pass: collect all meaningful elements that intersect
        const allMatching: { element: HTMLElement; rect: DOMRect }[] = [];
        const meaningfulTags = [
          "button",
          "a",
          "input",
          "img",
          "p",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "li",
          "label",
          "td",
          "th",
          "section",
          "article",
          "aside",
          "nav",
        ];

        candidateElements.forEach((el) => {
          // Skip toolbar elements
          if (el.closest("[data-feedback-toolbar]")) return;
          if (el.closest("[data-annotation-marker]")) return;

          const rect = el.getBoundingClientRect();

          // Skip elements that are too large (probably containers)
          if (
            rect.width > window.innerWidth * 0.8 &&
            rect.height > window.innerHeight * 0.5
          )
            return;

          // Skip very small elements
          if (rect.width < 10 || rect.height < 10) return;

          // Check if element intersects with selection rectangle
          if (
            rect.left < right &&
            rect.right > left &&
            rect.top < bottom &&
            rect.bottom > top
          ) {
            const tagName = el.tagName.toLowerCase();

            // Include semantic tags
            if (meaningfulTags.includes(tagName)) {
              allMatching.push({ element: el, rect });
            }
            // For divs and spans, only include if they have visible text content or are interactive
            else if (tagName === "div" || tagName === "span") {
              const hasText = el.textContent && el.textContent.trim().length > 0;
              const isInteractive =
                el.onclick !== null ||
                el.getAttribute("role") === "button" ||
                el.getAttribute("role") === "link" ||
                el.classList.contains("clickable") ||
                el.hasAttribute("data-clickable");

              if ((hasText || isInteractive) && !el.querySelector("p, h1, h2, h3, h4, h5, h6, button, a")) {
                allMatching.push({ element: el, rect });
              }
            }
          }
        });

        // Second pass: keep only leaf elements (those that don't contain other selected elements)
        const elementsInSelection = allMatching.filter(({ element: el }) => {
          // Check if this element contains any other selected element
          const containsOther = allMatching.some(
            ({ element: other }) => other !== el && el.contains(other),
          );
          return !containsOther;
        });

        setSelectedElements(elementsInSelection);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isActive, pendingAnnotation, isDragging, DRAG_THRESHOLD]);

  // Multi-select drag - mouseup to finish drag
  useEffect(() => {
    if (!isActive) return;

    const handleMouseUp = (e: MouseEvent) => {
      const wasDragging = isDragging;

      if (isDragging && selectedElements.length > 0) {
        // Mark that we just finished dragging to prevent click handler
        justFinishedDragRef.current = true;

        // Create pending annotation for multi-select
        const bounds = selectedElements.reduce(
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

        // Use mouse release position for marker
        const x = (e.clientX / window.innerWidth) * 100;
        const y = e.clientY + window.scrollY;

        const elementNames = selectedElements
          .slice(0, 5)
          .map(({ element }) => identifyElement(element).name)
          .join(", ");
        const suffix =
          selectedElements.length > 5
            ? ` +${selectedElements.length - 5} more`
            : "";

        setPendingAnnotation({
          x,
          y,
          clientY: e.clientY,
          element: `${selectedElements.length} elements: ${elementNames}${suffix}`,
          elementPath: "multi-select",
          boundingBox: {
            x: bounds.left,
            y: bounds.top + window.scrollY,
            width: bounds.right - bounds.left,
            height: bounds.bottom - bounds.top,
          },
          isMultiSelect: true,
        });
        setHoverInfo(null);
      } else if (wasDragging) {
        // Dragged but no elements selected - still prevent click
        justFinishedDragRef.current = true;
      }

      // Reset drag state
      mouseDownPosRef.current = null;
      setIsDragging(false);
      setDragStart(null);
      setDragCurrent(null);
      setSelectedElements([]);
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [isActive, isDragging, selectedElements]);

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
      setPendingAnnotation(null);
      window.getSelection()?.removeAllRanges();
    },
    [pendingAnnotation],
  );

  // Cancel annotation
  const cancelAnnotation = useCallback(() => {
    setPendingAnnotation(null);
  }, []);

  // Delete annotation
  const deleteAnnotation = useCallback((id: string) => {
    setDeletingMarkerId(id);
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
    // Clear deleting state after exit animation
    setTimeout(() => setDeletingMarkerId(null), 200);
  }, []);

  // Clear all with staggered animation
  const clearAll = useCallback(() => {
    const count = annotations.length;
    if (count === 0) return;

    setIsClearing(true);
    setCleared(true);

    // Wait for staggered exit animations to complete
    const totalAnimationTime = count * 30 + 200; // 30ms stagger + 200ms base animation
    setTimeout(() => {
      setAnnotations([]);
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

    // Auto-clear after copy if enabled
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
          // Let the popup handle its own escape
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

  return createPortal(
    <>
      {/* Toolbar */}
      <div className={styles.toolbar} data-feedback-toolbar>
        <AnimatePresence mode="wait" initial={false}>
          {!isActive ? (
            <motion.button
              key="toggle"
              className={styles.toggleButton}
              onClick={(e) => {
                e.stopPropagation();
                setIsActive(true);
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 0.8,
              }}
              title="Start feedback mode"
            >
              <IconFeedback size={18} />
              {hasAnnotations && (
                <span
                  className={styles.badge}
                  style={{ backgroundColor: settings.annotationColor }}
                >
                  {annotations.length}
                </span>
              )}
            </motion.button>
          ) : (
            <motion.div
              key="controls"
              className={styles.controls}
              initial={{ opacity: 0, scale: 0.85, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 8 }}
              transition={{
                type: "spring",
                stiffness: 600,
                damping: 35,
                mass: 0.6,
              }}
            >
              <motion.button
                className={styles.controlButton}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFreeze();
                }}
                title={isFrozen ? "Resume animations" : "Pause animations"}
                data-active={isFrozen}
                whileTap={{ scale: 0.95 }}
              >
                {isFrozen ? <IconPlay size={16} /> : <IconPause size={16} />}
              </motion.button>

              <motion.button
                className={styles.controlButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMarkers(!showMarkers);
                }}
                title={showMarkers ? "Hide markers" : "Show markers"}
                whileTap={{ scale: 0.95 }}
              >
                <EyeMorphIcon size={16} visible={showMarkers} />
              </motion.button>

              <motion.button
                className={styles.controlButton}
                onClick={(e) => {
                  e.stopPropagation();
                  copyOutput();
                }}
                disabled={!hasAnnotations}
                title="Copy feedback"
                whileTap={{ scale: 0.95 }}
              >
                <CopyMorphIcon size={16} checked={copied} />
              </motion.button>

              <motion.button
                className={styles.controlButton}
                onClick={(e) => {
                  e.stopPropagation();
                  clearAll();
                }}
                disabled={!hasAnnotations}
                title="Clear all"
                data-danger
                whileTap={{ scale: 0.95 }}
              >
                <TrashMorphIcon size={16} checked={cleared} />
              </motion.button>

              <motion.button
                className={styles.controlButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings(!showSettings);
                }}
                title="Settings"
                data-active={showSettings}
                whileTap={{ scale: 0.95 }}
              >
                <IconSettings size={16} />
              </motion.button>

              <div className={styles.divider} />

              <motion.button
                className={styles.controlButton}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsActive(false);
                }}
                title="Exit feedback mode"
                whileTap={{ scale: 0.95 }}
              >
                <IconChevronDown size={16} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              className={`${styles.settingsPanel} ${isDarkMode ? styles.dark : ""}`}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.settingsSection}>
                <div className={styles.settingsLabel}>Output Detail</div>
                <div className={styles.settingsOptions}>
                  {OUTPUT_DETAIL_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      className={`${styles.settingsOption} ${settings.outputDetail === option.value ? styles.selected : ""}`}
                      onClick={() =>
                        setSettings((s) => ({
                          ...s,
                          outputDetail: option.value,
                        }))
                      }
                      title={option.description}
                    >
                      {option.label}
                      {settings.outputDetail === option.value && (
                        <IconCheck size={12} />
                      )}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Markers layer - positioned absolutely, markers scroll with page */}
      <div className={styles.markersLayer} data-feedback-toolbar>
        <AnimatePresence>
          {isActive &&
            showMarkers &&
            annotations
              .filter((a) => !a.isFixed)
              .map((annotation, index) => {
                const isHovered = hoveredMarkerId === annotation.id;
                const isDeleting = deletingMarkerId === annotation.id;
                const showDeleteState = isHovered || isDeleting;
                const isMulti = annotation.isMultiSelect;
                const markerColor = isMulti
                  ? "#34C759"
                  : settings.annotationColor;
                const globalIndex = annotations.findIndex(
                  (a) => a.id === annotation.id,
                );

                return (
                  <motion.div
                    key={annotation.id}
                    className={`${styles.marker} ${showDeleteState ? styles.hovered : ""} ${isMulti ? styles.multiSelect : ""}`}
                    data-annotation-marker
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: isClearing ? 0 : 1,
                      opacity: isClearing ? 0 : 1,
                      transition: isClearing
                        ? {
                            duration: 0.12,
                            ease: "easeIn",
                            delay: index * 0.02,
                          }
                        : {
                            type: "spring",
                            stiffness: 600,
                            damping: 28,
                            delay: index * 0.02,
                          },
                    }}
                    exit={{
                      scale: 0,
                      opacity: 0,
                      transition: { duration: 0.15, ease: "easeIn" },
                    }}
                    whileHover={{ scale: 1.1 }}
                    style={{
                      left: `${annotation.x}%`,
                      top: annotation.y,
                      backgroundColor: showDeleteState
                        ? undefined
                        : markerColor,
                    }}
                    onMouseEnter={() => setHoveredMarkerId(annotation.id)}
                    onMouseLeave={() => setHoveredMarkerId(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAnnotation(annotation.id);
                    }}
                  >
                    {showDeleteState ? (
                      <IconClose size={isMulti ? 12 : 10} />
                    ) : (
                      globalIndex + 1
                    )}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          className={styles.markerTooltip}
                          initial={{ opacity: 0, y: 2, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 2, scale: 0.98 }}
                          transition={{ duration: 0.1, ease: "easeOut" }}
                        >
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
                            Click to remove
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
        </AnimatePresence>
      </div>

      {/* Fixed markers layer - for annotations on fixed/sticky elements */}
      <div className={styles.fixedMarkersLayer} data-feedback-toolbar>
        <AnimatePresence>
          {isActive &&
            showMarkers &&
            annotations
              .filter((a) => a.isFixed)
              .map((annotation, index) => {
                const isHovered = hoveredMarkerId === annotation.id;
                const isDeleting = deletingMarkerId === annotation.id;
                const showDeleteState = isHovered || isDeleting;
                const isMulti = annotation.isMultiSelect;
                const markerColor = isMulti
                  ? "#34C759"
                  : settings.annotationColor;
                const globalIndex = annotations.findIndex(
                  (a) => a.id === annotation.id,
                );

                return (
                  <motion.div
                    key={annotation.id}
                    className={`${styles.marker} ${styles.fixed} ${showDeleteState ? styles.hovered : ""} ${isMulti ? styles.multiSelect : ""}`}
                    data-annotation-marker
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: isClearing ? 0 : 1,
                      opacity: isClearing ? 0 : 1,
                      transition: isClearing
                        ? {
                            duration: 0.12,
                            ease: "easeIn",
                            delay: index * 0.02,
                          }
                        : {
                            type: "spring",
                            stiffness: 600,
                            damping: 28,
                            delay: index * 0.02,
                          },
                    }}
                    exit={{
                      scale: 0,
                      opacity: 0,
                      transition: { duration: 0.15, ease: "easeIn" },
                    }}
                    whileHover={{ scale: 1.1 }}
                    style={{
                      left: `${annotation.x}%`,
                      top: annotation.y,
                      backgroundColor: showDeleteState
                        ? undefined
                        : markerColor,
                    }}
                    onMouseEnter={() => setHoveredMarkerId(annotation.id)}
                    onMouseLeave={() => setHoveredMarkerId(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAnnotation(annotation.id);
                    }}
                  >
                    {showDeleteState ? (
                      <IconClose size={isMulti ? 12 : 10} />
                    ) : (
                      globalIndex + 1
                    )}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          className={styles.markerTooltip}
                          initial={{ opacity: 0, y: 2, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 2, scale: 0.98 }}
                          transition={{ duration: 0.1, ease: "easeOut" }}
                        >
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
                            Click to remove
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
        </AnimatePresence>
      </div>

      {/* Interactive overlay */}
      {isActive && (
        <div className={styles.overlay} data-feedback-toolbar>
          {/* Hover highlight - fades out during scroll and drag */}
          <AnimatePresence>
            {hoverInfo?.rect &&
              !pendingAnnotation &&
              !isScrolling &&
              !isDragging && (
                <motion.div
                  key="hover-highlight"
                  className={styles.hoverHighlight}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.12, ease: "easeOut" }}
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
          </AnimatePresence>

          {/* Hover tooltip - fades out during scroll and drag */}
          <AnimatePresence>
            {hoverInfo && !pendingAnnotation && !isScrolling && !isDragging && (
              <motion.div
                key="hover-tooltip"
                className={styles.hoverTooltip}
                initial={{ opacity: 0, scale: 0.95, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 4 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                style={{
                  left: Math.min(hoverPosition.x, window.innerWidth - 150),
                  top: Math.max(hoverPosition.y - 32, 8),
                }}
              >
                {hoverInfo.element}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pending annotation marker + popup */}
          <AnimatePresence>
            {pendingAnnotation && (
              <>
                <motion.div
                  className={`${styles.marker} ${styles.pending} ${pendingAnnotation.isMultiSelect ? styles.multiSelect : ""}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{
                    scale: 0,
                    opacity: 0,
                    transition: { duration: 0.15, ease: "easeIn" },
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{
                    left: `${pendingAnnotation.x}%`,
                    top: pendingAnnotation.clientY,
                    backgroundColor: pendingAnnotation.isMultiSelect
                      ? "#34C759"
                      : settings.annotationColor,
                  }}
                >
                  <IconPlus size={12} />
                </motion.div>

                <AnnotationPopup
                  ref={popupRef}
                  element={pendingAnnotation.element}
                  selectedText={pendingAnnotation.selectedText}
                  onSubmit={addAnnotation}
                  onCancel={cancelAnnotation}
                  variant={pendingAnnotation.isMultiSelect ? "green" : "blue"}
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
          </AnimatePresence>

          {/* Drag selection rectangle */}
          {isDragging && dragStart && dragCurrent && (
            <>
              <div
                className={styles.dragSelection}
                style={{
                  left: Math.min(dragStart.x, dragCurrent.x),
                  top: Math.min(dragStart.y, dragCurrent.y),
                  width: Math.abs(dragCurrent.x - dragStart.x),
                  height: Math.abs(dragCurrent.y - dragStart.y),
                }}
              >
                {selectedElements.length > 0 && (
                  <div className={styles.dragCount}>
                    {selectedElements.length}
                  </div>
                )}
              </div>

              {/* Highlight selected elements */}
              {selectedElements.map(({ element, rect }, i) => (
                <div
                  key={`${element.tagName}-${i}`}
                  className={styles.selectedElementHighlight}
                  style={{
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height,
                  }}
                />
              ))}
            </>
          )}
        </div>
      )}
    </>,
    document.body,
  );
}

export default PageFeedbackToolbar;
