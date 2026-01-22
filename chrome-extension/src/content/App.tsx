import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  AnnotationPopupCSS,
  AnnotationPopupCSSHandle,
} from "../components/annotation-popup-css";
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
  IconEye,
  IconEyeMinus,
  IconCopyAlt,
  IconCopyAnimated,
  IconTrashAlt,
  IconXmark,
  IconCheckmark,
  IconPause,
  IconEyeAnimated,
  IconPausePlayAnimated,
  IconSun,
  IconMoon,
  IconXmarkLarge,
} from "../components/icons";
import {
  identifyElement,
  getNearbyText,
  getElementClasses,
  getDetailedComputedStyles,
  getFullElementPath,
  getAccessibilityInfo,
  getNearbyElements,
} from "../components/utils/element-identification";
import { loadAnnotations, saveAnnotations } from "../shared/storage";
import type { Annotation, Settings, OutputDetailLevel } from "../shared/types";
import { DEFAULT_SETTINGS, ACCENT_COLORS } from "../shared/types";
import styles from "../components/page-toolbar-css/styles.module.scss";

// Version for display
const VERSION = "1.0.0";

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

type ToolbarSettings = {
  outputDetail: OutputDetailLevel;
  autoClearAfterCopy: boolean;
  annotationColor: string;
  blockInteractions: boolean;
};

const DEFAULT_TOOLBAR_SETTINGS: ToolbarSettings = {
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

function generateOutput(
  annotations: Annotation[],
  pathname: string,
  detailLevel: OutputDetailLevel = "standard"
): string {
  if (annotations.length === 0) return "";

  const viewport = `${window.innerWidth}×${window.innerHeight}`;

  let output = `## Page Feedback: ${pathname}\n`;

  if (detailLevel === "forensic") {
    output += `\n**Environment:**\n`;
    output += `- Viewport: ${viewport}\n`;
    output += `- URL: ${window.location.href}\n`;
    output += `- User Agent: ${navigator.userAgent}\n`;
    output += `- Timestamp: ${new Date().toISOString()}\n`;
    output += `- Device Pixel Ratio: ${window.devicePixelRatio}\n`;
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

// =============================================================================
// Component
// =============================================================================

export function PageFeedbackToolbar() {
  const [isActive, setIsActive] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [showMarkers, setShowMarkers] = useState(true);
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
    nearbyElements?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [deletingMarkerId, setDeletingMarkerId] = useState<string | null>(null);
  const [renumberFrom, setRenumberFrom] = useState<number | null>(null);
  const [editingAnnotation, setEditingAnnotation] = useState<Annotation | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSettingsVisible, setShowSettingsVisible] = useState(false);
  const [settings, setSettings] = useState<ToolbarSettings>(DEFAULT_TOOLBAR_SETTINGS);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showEntranceAnimation, setShowEntranceAnimation] = useState(false);

  // Draggable toolbar state
  const [toolbarPosition, setToolbarPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingToolbar, setIsDraggingToolbar] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<{
    x: number;
    y: number;
    toolbarX: number;
    toolbarY: number;
  } | null>(null);
  const [dragRotation, setDragRotation] = useState(0);
  const justFinishedToolbarDragRef = useRef(false);

  // Animation state
  const [animatedMarkers, setAnimatedMarkers] = useState<Set<string>>(new Set());
  const [exitingMarkers, setExitingMarkers] = useState<Set<string>>(new Set());
  const [pendingExiting, setPendingExiting] = useState(false);
  const [editExiting, setEditExiting] = useState(false);

  // Multi-select drag state
  const [isDragging, setIsDragging] = useState(false);
  const mouseDownPosRef = useRef<{ x: number; y: number } | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragRectRef = useRef<HTMLDivElement | null>(null);
  const highlightsContainerRef = useRef<HTMLDivElement | null>(null);
  const justFinishedDragRef = useRef(false);
  const lastElementUpdateRef = useRef(0);
  const recentlyAddedIdRef = useRef<string | null>(null);
  const DRAG_THRESHOLD = 8;
  const ELEMENT_UPDATE_THROTTLE = 50;

  const popupRef = useRef<AnnotationPopupCSSHandle>(null);
  const editPopupRef = useRef<AnnotationPopupCSSHandle>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentUrl = window.location.href;

  // Listen for toggle events from extension popup
  useEffect(() => {
    const handleToggle = () => {
      setIsActive(prev => !prev);
    };
    
    window.addEventListener("agentation-toggle", handleToggle);
    return () => window.removeEventListener("agentation-toggle", handleToggle);
  }, []);

  // Handle showSettings changes with exit animation
  useEffect(() => {
    if (showSettings) {
      setShowSettingsVisible(true);
    } else {
      const timer = setTimeout(() => setShowSettingsVisible(false), 0);
      return () => clearTimeout(timer);
    }
  }, [showSettings]);

  // Unified marker visibility
  const shouldShowMarkers = isActive && showMarkers;
  useEffect(() => {
    if (shouldShowMarkers) {
      setMarkersExiting(false);
      setMarkersVisible(true);
      setAnimatedMarkers(new Set());
      const timer = setTimeout(() => {
        setAnimatedMarkers(prev => {
          const newSet = new Set(prev);
          annotations.forEach(a => newSet.add(a.id));
          return newSet;
        });
      }, 350);
      return () => clearTimeout(timer);
    } else if (markersVisible) {
      setMarkersExiting(true);
      const timer = setTimeout(() => {
        setMarkersVisible(false);
        setMarkersExiting(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [shouldShowMarkers, annotations]);

  // Mount and load annotations from chrome.storage
  useEffect(() => {
    setMounted(true);
    setScrollY(window.scrollY);
    
    // Load annotations
    loadAnnotations(currentUrl).then(stored => {
      setAnnotations(stored);
      // Update badge
      chrome.runtime.sendMessage({ 
        type: "UPDATE_BADGE", 
        count: stored.length 
      }).catch(() => {});
    });

    // Load settings from chrome.storage.sync
    chrome.storage.sync.get("agentation-settings").then(result => {
      if (result["agentation-settings"]) {
        setSettings({ ...DEFAULT_TOOLBAR_SETTINGS, ...result["agentation-settings"] });
      }
    }).catch(() => {});

    // Load theme
    chrome.storage.sync.get("agentation-theme").then(result => {
      if (result["agentation-theme"] !== undefined) {
        setIsDarkMode(result["agentation-theme"] === "dark");
      }
    }).catch(() => {});

    if (!hasPlayedEntranceAnimation) {
      setShowEntranceAnimation(true);
      hasPlayedEntranceAnimation = true;
      setTimeout(() => setShowEntranceAnimation(false), 750);
    }
  }, [currentUrl]);

  // Save settings to chrome.storage.sync
  useEffect(() => {
    if (mounted) {
      chrome.storage.sync.set({ "agentation-settings": settings }).catch(() => {});
    }
  }, [settings, mounted]);

  // Save theme
  useEffect(() => {
    if (mounted) {
      chrome.storage.sync.set({ "agentation-theme": isDarkMode ? "dark" : "light" }).catch(() => {});
    }
  }, [isDarkMode, mounted]);

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

  // Save annotations to chrome.storage
  useEffect(() => {
    if (mounted) {
      saveAnnotations(currentUrl, annotations).then(() => {
        // Update badge
        chrome.runtime.sendMessage({ 
          type: "UPDATE_BADGE", 
          count: annotations.length 
        }).catch(() => {});
      });
    }
  }, [annotations, currentUrl, mounted]);

  // Freeze animations
  const freezeAnimations = useCallback(() => {
    if (isFrozen) return;

    const style = document.createElement("style");
    style.id = "agentation-freeze-styles";
    style.textContent = `
      *:not([data-feedback-toolbar]):not([data-feedback-toolbar] *):not([data-annotation-popup]):not([data-annotation-popup] *):not([data-annotation-marker]):not([data-annotation-marker] *)::before,
      *:not([data-feedback-toolbar]):not([data-feedback-toolbar] *):not([data-annotation-popup]):not([data-annotation-popup] *):not([data-annotation-marker]):not([data-annotation-marker] *)::after {
        animation-play-state: paused !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);

    document.querySelectorAll("video").forEach(video => {
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

    const style = document.getElementById("agentation-freeze-styles");
    if (style) style.remove();

    document.querySelectorAll("video").forEach(video => {
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
      setShowSettings(false);
      if (isFrozen) {
        unfreezeAnimations();
      }
    }
  }, [isActive, isFrozen, unfreezeAnimations]);

  // Custom cursor
  useEffect(() => {
    if (!isActive) return;

    const style = document.createElement("style");
    style.id = "agentation-cursor-styles";
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
      const existingStyle = document.getElementById("agentation-cursor-styles");
      if (existingStyle) existingStyle.remove();
    };
  }, [isActive]);

  // Handle mouse move for hover detection
  useEffect(() => {
    if (!isActive || pendingAnnotation) return;

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
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isActive, pendingAnnotation]);

  // Handle click to create annotation
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
        "button, a, input, select, textarea, [role='button'], [onclick]"
      );

      if (settings.blockInteractions && isInteractive) {
        e.preventDefault();
        e.stopPropagation();
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
    return () => document.removeEventListener("click", handleClick, true);
  }, [isActive, pendingAnnotation, editingAnnotation, settings.blockInteractions]);

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

      setAnnotations(prev => [...prev, newAnnotation]);
      recentlyAddedIdRef.current = newAnnotation.id;
      setTimeout(() => {
        recentlyAddedIdRef.current = null;
      }, 300);
      setTimeout(() => {
        setAnimatedMarkers(prev => new Set(prev).add(newAnnotation.id));
      }, 250);

      setPendingExiting(true);
      setTimeout(() => {
        setPendingAnnotation(null);
        setPendingExiting(false);
      }, 150);

      window.getSelection()?.removeAllRanges();
    },
    [pendingAnnotation]
  );

  // Cancel annotation
  const cancelAnnotation = useCallback(() => {
    setPendingExiting(true);
    setTimeout(() => {
      setPendingAnnotation(null);
      setPendingExiting(false);
    }, 150);
  }, []);

  // Delete annotation
  const deleteAnnotation = useCallback(
    (id: string) => {
      const deletedIndex = annotations.findIndex(a => a.id === id);
      setDeletingMarkerId(id);
      setExitingMarkers(prev => new Set(prev).add(id));

      setTimeout(() => {
        setAnnotations(prev => prev.filter(a => a.id !== id));
        setExitingMarkers(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        setDeletingMarkerId(null);

        if (deletedIndex < annotations.length - 1) {
          setRenumberFrom(deletedIndex);
          setTimeout(() => setRenumberFrom(null), 200);
        }
      }, 150);
    },
    [annotations]
  );

  // Edit annotation
  const startEditAnnotation = useCallback((annotation: Annotation) => {
    setEditingAnnotation(annotation);
    setHoveredMarkerId(null);
  }, []);

  const updateAnnotation = useCallback(
    (newComment: string) => {
      if (!editingAnnotation) return;

      setAnnotations(prev =>
        prev.map(a =>
          a.id === editingAnnotation.id ? { ...a, comment: newComment } : a
        )
      );

      setEditExiting(true);
      setTimeout(() => {
        setEditingAnnotation(null);
        setEditExiting(false);
      }, 150);
    },
    [editingAnnotation]
  );

  const cancelEditAnnotation = useCallback(() => {
    setEditExiting(true);
    setTimeout(() => {
      setEditingAnnotation(null);
      setEditExiting(false);
    }, 150);
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    const count = annotations.length;
    if (count === 0) return;

    setIsClearing(true);
    setCleared(true);

    const totalAnimationTime = count * 30 + 200;
    setTimeout(() => {
      setAnnotations([]);
      setAnimatedMarkers(new Set());
      setIsClearing(false);
    }, totalAnimationTime);

    setTimeout(() => setCleared(false), 1500);
  }, [annotations.length]);

  // Copy output
  const copyOutput = useCallback(async () => {
    const pathname = window.location.pathname;
    const output = generateOutput(annotations, pathname, settings.outputDetail);
    if (!output) return;

    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    if (settings.autoClearAfterCopy) {
      setTimeout(() => clearAll(), 500);
    }
  }, [annotations, settings.outputDetail, settings.autoClearAfterCopy, clearAll]);

  // Toolbar dragging
  useEffect(() => {
    if (!dragStartPos) return;

    const DRAG_THRESHOLD = 5;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartPos.x;
      const deltaY = e.clientY - dragStartPos.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (!isDraggingToolbar && distance > DRAG_THRESHOLD) {
        setIsDraggingToolbar(true);
      }

      if (isDraggingToolbar || distance > DRAG_THRESHOLD) {
        let newX = dragStartPos.toolbarX + deltaX;
        let newY = dragStartPos.toolbarY + deltaY;

        const padding = 20;
        const containerWidth = 257;
        const circleWidth = 44;
        const toolbarHeight = 44;

        if (isActive) {
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
      if (isDraggingToolbar) {
        justFinishedToolbarDragRef.current = true;
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

  const handleToolbarMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (
        (e.target as HTMLElement).closest("button") ||
        (e.target as HTMLElement).closest(`.${styles.settingsPanel}`)
      ) {
        return;
      }

      const toolbarParent = (e.currentTarget as HTMLElement).parentElement;
      if (!toolbarParent) return;

      const rect = toolbarParent.getBoundingClientRect();
      const currentX = toolbarPosition?.x ?? rect.left;
      const currentY = toolbarPosition?.y ?? rect.top;

      const randomRotation = (Math.random() - 0.5) * 10;
      setDragRotation(randomRotation);

      setDragStartPos({
        x: e.clientX,
        y: e.clientY,
        toolbarX: currentX,
        toolbarY: currentY,
      });
    },
    [toolbarPosition]
  );

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
  const visibleAnnotations = annotations.filter(a => !exitingMarkers.has(a.id));
  const exitingAnnotationsList = annotations.filter(a => exitingMarkers.has(a.id));

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
        <div
          className={`${styles.toolbarContainer} ${!isDarkMode ? styles.light : ""} ${isActive ? styles.expanded : styles.collapsed} ${showEntranceAnimation ? styles.entrance : ""} ${isDraggingToolbar ? styles.dragging : ""}`}
          onClick={
            !isActive
              ? (e) => {
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
          <div className={`${styles.toggleContent} ${!isActive ? styles.visible : styles.hidden}`}>
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
          <div className={`${styles.controlsContent} ${isActive ? styles.visible : styles.hidden}`}>
            <button
              className={`${styles.controlButton} ${!isDarkMode ? styles.light : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFreeze();
              }}
              title={isFrozen ? "Resume animations" : "Pause animations"}
              data-active={isFrozen}
            >
              <IconPausePlayAnimated size={24} isPaused={isFrozen} />
            </button>

            <button
              className={`${styles.controlButton} ${!isDarkMode ? styles.light : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowMarkers(!showMarkers);
              }}
              disabled={!hasAnnotations}
              title={showMarkers ? "Hide markers" : "Show markers"}
            >
              <IconEyeAnimated size={24} isOpen={showMarkers} />
            </button>

            <button
              className={`${styles.controlButton} ${!isDarkMode ? styles.light : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                copyOutput();
              }}
              disabled={!hasAnnotations}
              title="Copy feedback"
              data-active={copied}
            >
              <IconCopyAnimated size={24} copied={copied} />
            </button>

            <button
              className={`${styles.controlButton} ${!isDarkMode ? styles.light : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              disabled={!hasAnnotations}
              title="Clear all"
              data-danger
            >
              <IconTrashAlt size={24} />
            </button>

            <button
              className={`${styles.controlButton} ${!isDarkMode ? styles.light : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowSettings(!showSettings);
              }}
              title="Settings"
            >
              <IconGear size={24} />
            </button>

            <div className={`${styles.divider} ${!isDarkMode ? styles.light : ""}`} />

            <button
              className={`${styles.controlButton} ${!isDarkMode ? styles.light : ""}`}
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
            className={`${styles.settingsPanel} ${isDarkMode ? styles.dark : styles.light} ${showSettingsVisible ? styles.enter : styles.exit}`}
            onClick={(e) => e.stopPropagation()}
            style={
              toolbarPosition && toolbarPosition.y < 230
                ? { bottom: "auto", top: "calc(100% + 0.5rem)" }
                : undefined
            }
          >
            <div className={styles.settingsHeader}>
              <span className={styles.settingsBrand}>
                <span
                  className={styles.settingsBrandSlash}
                  style={{ color: settings.annotationColor, transition: "color 0.2s ease" }}
                >
                  /
                </span>
                agentation
              </span>
              <span className={styles.settingsVersion}>v{VERSION}</span>
              <button
                className={styles.themeToggle}
                onClick={() => setIsDarkMode(!isDarkMode)}
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <IconSun size={14} /> : <IconMoon size={14} />}
              </button>
            </div>

            <div className={styles.settingsSection}>
              <div className={styles.settingsRow}>
                <div className={`${styles.settingsLabel} ${!isDarkMode ? styles.light : ""}`}>
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
                      opt => opt.value === settings.outputDetail
                    );
                    const nextIndex = (currentIndex + 1) % OUTPUT_DETAIL_OPTIONS.length;
                    setSettings(s => ({
                      ...s,
                      outputDetail: OUTPUT_DETAIL_OPTIONS[nextIndex].value,
                    }));
                  }}
                >
                  <span key={settings.outputDetail} className={styles.cycleButtonText}>
                    {OUTPUT_DETAIL_OPTIONS.find(opt => opt.value === settings.outputDetail)?.label}
                  </span>
                  <span className={styles.cycleDots}>
                    {OUTPUT_DETAIL_OPTIONS.map((option) => (
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
              <div className={`${styles.settingsLabel} ${styles.settingsLabelMarker} ${!isDarkMode ? styles.light : ""}`}>
                Marker Colour
              </div>
              <div className={styles.colorOptions}>
                {COLOR_OPTIONS.map(color => (
                  <div
                    key={color.value}
                    onClick={() => setSettings(s => ({ ...s, annotationColor: color.value }))}
                    style={{
                      borderColor: settings.annotationColor === color.value ? color.value : "transparent",
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
                  onChange={e => setSettings(s => ({ ...s, autoClearAfterCopy: e.target.checked }))}
                />
                <label
                  className={`${styles.customCheckbox} ${settings.autoClearAfterCopy ? styles.checked : ""}`}
                  htmlFor="autoClearAfterCopy"
                >
                  {settings.autoClearAfterCopy && <IconCheckSmallAnimated size={14} />}
                </label>
                <span className={`${styles.toggleLabel} ${!isDarkMode ? styles.light : ""}`}>
                  Clear after output
                  <span className={styles.helpIcon} data-tooltip="Automatically clear annotations after copying">
                    <IconHelp size={20} />
                  </span>
                </span>
              </label>
              <label className={styles.settingsToggle}>
                <input
                  type="checkbox"
                  id="blockInteractions"
                  checked={settings.blockInteractions}
                  onChange={e => setSettings(s => ({ ...s, blockInteractions: e.target.checked }))}
                />
                <label
                  className={`${styles.customCheckbox} ${settings.blockInteractions ? styles.checked : ""}`}
                  htmlFor="blockInteractions"
                >
                  {settings.blockInteractions && <IconCheckSmallAnimated size={14} />}
                </label>
                <span className={`${styles.toggleLabel} ${!isDarkMode ? styles.light : ""}`}>
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
            .filter(a => !a.isFixed)
            .map((annotation, index) => {
              const isHovered = !markersExiting && hoveredMarkerId === annotation.id;
              const isDeleting = deletingMarkerId === annotation.id;
              const showDeleteState = isHovered || isDeleting;
              const isMulti = annotation.isMultiSelect;
              const markerColor = isMulti ? "#34C759" : settings.annotationColor;
              const globalIndex = annotations.findIndex(a => a.id === annotation.id);
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
                  onClick={e => {
                    e.stopPropagation();
                    if (!markersExiting) deleteAnnotation(annotation.id);
                  }}
                  onContextMenu={e => {
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
                    <div className={`${styles.markerTooltip} ${!isDarkMode ? styles.light : ""} ${styles.enter}`}>
                      <span className={styles.markerQuote}>
                        {annotation.element}
                        {annotation.selectedText &&
                          ` "${annotation.selectedText.slice(0, 30)}${annotation.selectedText.length > 30 ? "..." : ""}"`}
                      </span>
                      <span className={styles.markerNote}>{annotation.comment}</span>
                    </div>
                  )}
                </div>
              );
            })}
      </div>

      {/* Fixed markers layer */}
      <div className={styles.fixedMarkersLayer} data-feedback-toolbar>
        {markersVisible &&
          visibleAnnotations
            .filter(a => a.isFixed)
            .map((annotation, index) => {
              const fixedAnnotations = visibleAnnotations.filter(a => a.isFixed);
              const isHovered = !markersExiting && hoveredMarkerId === annotation.id;
              const isDeleting = deletingMarkerId === annotation.id;
              const showDeleteState = isHovered || isDeleting;
              const isMulti = annotation.isMultiSelect;
              const markerColor = isMulti ? "#34C759" : settings.annotationColor;
              const globalIndex = annotations.findIndex(a => a.id === annotation.id);
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
                  onClick={e => {
                    e.stopPropagation();
                    if (!markersExiting) deleteAnnotation(annotation.id);
                  }}
                  onContextMenu={e => {
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
                    <div className={`${styles.markerTooltip} ${!isDarkMode ? styles.light : ""} ${styles.enter}`}>
                      <span className={styles.markerQuote}>
                        {annotation.element}
                        {annotation.selectedText &&
                          ` "${annotation.selectedText.slice(0, 30)}${annotation.selectedText.length > 30 ? "..." : ""}"`}
                      </span>
                      <span className={styles.markerNote}>{annotation.comment}</span>
                    </div>
                  )}
                </div>
              );
            })}
      </div>

      {/* Interactive overlay */}
      {isActive && (
        <div
          className={styles.overlay}
          data-feedback-toolbar
          style={pendingAnnotation || editingAnnotation ? { zIndex: 99999 } : undefined}
        >
          {/* Hover highlight */}
          {hoverInfo?.rect && !pendingAnnotation && !isScrolling && !isDragging && (
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

          {/* Hover tooltip */}
          {hoverInfo && !pendingAnnotation && !isScrolling && !isDragging && (
            <div
              className={`${styles.hoverTooltip} ${styles.enter}`}
              style={{
                left: Math.max(8, Math.min(hoverPosition.x, window.innerWidth - 100)),
                top: Math.max(hoverPosition.y - 32, 8),
              }}
            >
              {hoverInfo.element}
            </div>
          )}

          {/* Pending annotation marker + popup */}
          {pendingAnnotation && (
            <>
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
                  backgroundColor: pendingAnnotation.isMultiSelect ? "#34C759" : settings.annotationColor,
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
                isExiting={pendingExiting}
                lightMode={!isDarkMode}
                accentColor={pendingAnnotation.isMultiSelect ? "#34C759" : settings.annotationColor}
                style={{
                  left: Math.max(160, Math.min(window.innerWidth - 160, (pendingAnnotation.x / 100) * window.innerWidth)),
                  top: Math.max(20, Math.min(pendingAnnotation.clientY + 20, window.innerHeight - 180)),
                }}
              />
            </>
          )}

          {/* Edit annotation popup */}
          {editingAnnotation && (
            <>
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
                isExiting={editExiting}
                lightMode={!isDarkMode}
                accentColor={editingAnnotation.isMultiSelect ? "#34C759" : settings.annotationColor}
                style={{
                  left: Math.max(160, Math.min(window.innerWidth - 160, (editingAnnotation.x / 100) * window.innerWidth)),
                  top: Math.max(
                    20,
                    Math.min(
                      (editingAnnotation.isFixed ? editingAnnotation.y : editingAnnotation.y - scrollY) + 20,
                      window.innerHeight - 180
                    )
                  ),
                }}
              />
            </>
          )}

          {/* Drag selection */}
          {isDragging && (
            <>
              <div ref={dragRectRef} className={styles.dragSelection} />
              <div ref={highlightsContainerRef} className={styles.highlightsContainer} />
            </>
          )}
        </div>
      )}
    </>,
    document.body
  );
}

export default PageFeedbackToolbar;
