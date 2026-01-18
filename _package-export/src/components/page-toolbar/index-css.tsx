"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { AnnotationPopupCSS, type AnnotationPopupHandle } from "../annotation-popup/index-css";
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
} from "../icons-css";
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
// CSS Animation Styles (injected once)
// =============================================================================

const cssAnimationStyles = `
/* Toolbar toggle button - fade in */
@keyframes agentation-toggle-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes agentation-toggle-out {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.9); }
}

.agentation-toggle-enter {
  animation: agentation-toggle-in 0.15s ease-out forwards;
}

.agentation-toggle-exit {
  animation: agentation-toggle-out 0.12s ease-in forwards;
  pointer-events: none;
}

/* Controls bar - fade in */
@keyframes agentation-controls-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes agentation-controls-out {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.95); }
}

.agentation-controls-enter {
  animation: agentation-controls-in 0.15s ease-out forwards;
}

.agentation-controls-exit {
  animation: agentation-controls-out 0.12s ease-in forwards;
  pointer-events: none;
}

/* Hover highlight - simple fast fade */
.agentation-highlight-animate {
  animation: agentation-fade-in 0.08s ease-out forwards;
}

@keyframes agentation-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Marker animations */
@keyframes agentation-marker-in {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

@keyframes agentation-marker-out {
  from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  to { opacity: 0; transform: translate(-50%, -50%) scale(0); }
}

.agentation-marker-enter {
  animation: agentation-marker-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.agentation-marker-exit {
  animation: agentation-marker-out 0.15s ease-in forwards;
  pointer-events: none;
}

/* Pending marker animation */
@keyframes agentation-pending-in {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

@keyframes agentation-pending-out {
  from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  to { opacity: 0; transform: translate(-50%, -50%) scale(0); }
}

.agentation-pending-enter {
  animation: agentation-pending-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.agentation-pending-exit {
  animation: agentation-pending-out 0.15s ease-in forwards;
  pointer-events: none;
}

/* Tooltip animations */
@keyframes agentation-tooltip-in {
  from { opacity: 0; transform: translateX(-50%) translateY(4px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.agentation-tooltip-animate {
  animation: agentation-tooltip-in 0.1s ease-out forwards;
}

/* Hover tooltip fade */
.agentation-hover-tooltip-animate {
  animation: agentation-fade-in 0.08s ease-out forwards;
}
`;

// Inject styles once
if (typeof document !== "undefined") {
  if (!document.getElementById("agentation-toolbar-css-animations")) {
    const style = document.createElement("style");
    style.id = "agentation-toolbar-css-animations";
    style.textContent = cssAnimationStyles;
    document.head.appendChild(style);
  }
}

// =============================================================================
// Types
// =============================================================================

type HoverInfo = {
  element: string;
  elementPath: string;
  rect: DOMRect | null;
};

type MarkerWithState = Annotation & { exiting?: boolean };

// =============================================================================
// Utils
// =============================================================================

type OutputFormat = 'standard' | 'detailed' | 'compact';

function generateOutput(annotations: Annotation[], pathname: string, format: OutputFormat = 'standard'): string {
  if (annotations.length === 0) return "";

  const viewport = typeof window !== "undefined"
    ? `${window.innerWidth}×${window.innerHeight}`
    : "unknown";

  if (format === 'compact') {
    // Compact: Just the essentials for quick fixes
    let output = `## Feedback: ${pathname}\n\n`;
    annotations.forEach((a, i) => {
      const selector = a.cssClasses ? `.${a.cssClasses.split(' ')[0]}` : a.elementPath;
      output += `${i + 1}. **${selector}**`;
      if (a.selectedText) output += ` ("${a.selectedText.slice(0, 30)}...")`;
      output += `\n   ${a.comment}\n\n`;
    });
    return output.trim();
  }

  if (format === 'detailed') {
    // Detailed: Full context for complex debugging
    let output = `## Page Feedback: ${pathname}\n`;
    output += `**Viewport:** ${viewport}\n`;
    output += `**URL:** ${typeof window !== "undefined" ? window.location.href : pathname}\n`;
    output += `**User Agent:** ${typeof navigator !== "undefined" ? navigator.userAgent.split(' ').slice(-2).join(' ') : 'unknown'}\n\n`;
    output += `---\n\n`;

    annotations.forEach((a, i) => {
      output += `### ${i + 1}. ${a.element}\n\n`;

      // Searchable selectors
      output += `**Selector:** \`${a.elementPath}\`\n`;
      if (a.cssClasses) {
        const classes = a.cssClasses.split(' ').map(c => `.${c}`).join(', ');
        output += `**Classes:** \`${classes}\`\n`;
      }

      // Position info
      if (a.boundingBox) {
        output += `**Bounding box:** x:${Math.round(a.boundingBox.x)}, y:${Math.round(a.boundingBox.y)}, ${Math.round(a.boundingBox.width)}×${Math.round(a.boundingBox.height)}px\n`;
      }

      // Text context
      if (a.selectedText) {
        output += `**Selected text:** "${a.selectedText}"\n`;
      }
      if (a.nearbyText) {
        output += `**Nearby text:** "${a.nearbyText.slice(0, 150)}"\n`;
      }

      output += `\n**Issue:** ${a.comment}\n\n`;
      output += `---\n\n`;
    });

    // Add search hints
    output += `**Search tips:** Use the class names or selectors above to find these elements in your codebase. Try \`grep -r "className.*submit-btn"\` or search for the nearby text content.\n`;

    return output.trim();
  }

  // Standard format (default)
  let output = `## Page Feedback: ${pathname}\n`;
  output += `**Viewport:** ${viewport}\n\n`;

  annotations.forEach((a, i) => {
    output += `### ${i + 1}. ${a.element}\n`;
    output += `**Selector:** \`${a.elementPath}\`\n`;

    if (a.cssClasses) {
      output += `**Classes:** \`${a.cssClasses}\`\n`;
    }

    if (a.boundingBox) {
      output += `**Position:** ${Math.round(a.boundingBox.x)}, ${Math.round(a.boundingBox.y)} (${Math.round(a.boundingBox.width)}×${Math.round(a.boundingBox.height)})\n`;
    }

    if (a.selectedText) {
      output += `**Selected:** "${a.selectedText}"\n`;
    } else if (a.nearbyText) {
      output += `**Context:** "${a.nearbyText.slice(0, 80)}"\n`;
    }

    output += `**Feedback:** ${a.comment}\n\n`;
  });

  return output.trim();
}

// =============================================================================
// Component
// =============================================================================

export function PageFeedbackToolbarCSS() {
  const [isActive, setIsActive] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [markersWithState, setMarkersWithState] = useState<MarkerWithState[]>([]);
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
  } | null>(null);
  const [pendingExiting, setPendingExiting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [markersExiting, setMarkersExiting] = useState(false);

  const popupRef = useRef<AnnotationPopupHandle>(null);

  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";

  // Sync markersWithState with annotations
  useEffect(() => {
    setMarkersWithState(annotations.map(a => ({ ...a, exiting: false })));
  }, [annotations]);

  // Mount and load
  useEffect(() => {
    setMounted(true);
    setScrollY(window.scrollY);
    const stored = loadAnnotations<Annotation>(pathname);
    setAnnotations(stored);
  }, [pathname]);

  // Track scroll
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
    if (isFrozen) unfreezeAnimations();
    else freezeAnimations();
  }, [isFrozen, freezeAnimations, unfreezeAnimations]);

  // Handle closing toolbar - instant close
  const handleCloseToolbar = useCallback(() => {
    setIsActive(false);
  }, []);

  // Reset state when deactivating
  useEffect(() => {
    if (!isActive) {
      setPendingAnnotation(null);
      setHoverInfo(null);
      if (isFrozen) unfreezeAnimations();
    }
  }, [isActive, isFrozen, unfreezeAnimations]);

  // Handle mouse move
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

  // Handle click
  useEffect(() => {
    if (!isActive) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest("[data-feedback-toolbar]")) return;
      if (target.closest("[data-annotation-popup]")) return;
      if (target.closest("[data-annotation-marker]")) return;

      e.preventDefault();

      if (pendingAnnotation) {
        popupRef.current?.shake();
        return;
      }

      const elementUnder = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      if (!elementUnder) return;

      const { name, path } = identifyElement(elementUnder);
      const rect = elementUnder.getBoundingClientRect();
      const x = (e.clientX / window.innerWidth) * 100;
      const y = e.clientY + window.scrollY;

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
        boundingBox: { x: rect.left, y: rect.top + window.scrollY, width: rect.width, height: rect.height },
        nearbyText: getNearbyText(elementUnder),
        cssClasses: getElementClasses(elementUnder),
      });
      setHoverInfo(null);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isActive, pendingAnnotation]);

  // Add annotation
  const addAnnotation = useCallback((comment: string) => {
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
    };

    setAnnotations((prev) => [...prev, newAnnotation]);
    setPendingAnnotation(null);
    window.getSelection()?.removeAllRanges();
  }, [pendingAnnotation]);

  // Cancel annotation with exit animation
  const cancelAnnotation = useCallback(() => {
    setPendingExiting(true);
    setTimeout(() => {
      setPendingExiting(false);
      setPendingAnnotation(null);
    }, 150);
  }, []);

  // Delete annotation with exit animation
  const deleteAnnotation = useCallback((id: string) => {
    setMarkersWithState(prev =>
      prev.map(m => m.id === id ? { ...m, exiting: true } : m)
    );
    setTimeout(() => {
      setAnnotations((prev) => prev.filter((a) => a.id !== id));
    }, 150);
  }, []);

  // Copy output
  const copyOutput = useCallback(async () => {
    const output = generateOutput(annotations, pathname);
    if (!output) return;

    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [annotations, pathname]);

  // Clear all
  const clearAll = useCallback(() => {
    setAnnotations([]);
    localStorage.removeItem(getStorageKey(pathname));
    setCleared(true);
    setTimeout(() => setCleared(false), 1500);
  }, [pathname]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Global shortcut: Cmd/Ctrl + Shift + A to toggle feedback mode
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (isActive) {
          handleCloseToolbar();
        } else {
          setIsActive(true);
        }
        return;
      }

      // Escape to close
      if (e.key === "Escape") {
        if (pendingAnnotation) {
          // Let popup handle it
        } else if (isActive) {
          handleCloseToolbar();
        }
        return;
      }

      // Active mode shortcuts (only when not typing)
      if (isActive && !isTyping && !pendingAnnotation) {
        switch (e.key.toLowerCase()) {
          case 'p':
            // P to toggle pause animations
            e.preventDefault();
            toggleFreeze();
            break;
          case 'h':
            // H to toggle marker visibility
            e.preventDefault();
            setShowMarkers(prev => !prev);
            break;
          case 'c':
            // C to copy output
            if (annotations.length > 0) {
              e.preventDefault();
              copyOutput();
            }
            break;
          case 'x':
            // X to clear all
            if (annotations.length > 0) {
              e.preventDefault();
              clearAll();
            }
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, pendingAnnotation, handleCloseToolbar, toggleFreeze, annotations.length, copyOutput, clearAll]);

  if (!mounted) return null;

  const hasAnnotations = annotations.length > 0;
  const toViewportY = (absoluteY: number) => absoluteY - scrollY;

  return createPortal(
    <>
      {/* Toolbar */}
      <div className={styles.toolbar} data-feedback-toolbar>
        {/* Toggle button - shown when collapsed */}
        {!isActive && (
          <button
            className={`${styles.toggleButton} agentation-toggle-enter`}
            onClick={(e) => { e.stopPropagation(); setIsActive(true); }}
            title="Start feedback mode (⌘⇧A)"
          >
            <IconFeedback size={18} />
            {hasAnnotations && <span className={styles.badge}>{annotations.length}</span>}
          </button>
        )}

        {/* Controls bar - shown when expanded */}
        {isActive && (
          <div className={`${styles.controls} agentation-controls-enter`}>
            <button
              className={styles.controlButton}
              onClick={(e) => { e.stopPropagation(); toggleFreeze(); }}
              title={isFrozen ? "Resume animations (P)" : "Pause animations (P)"}
              data-active={isFrozen}
            >
              {isFrozen ? <IconPlay size={16} /> : <IconPause size={16} />}
            </button>

            <button
              className={styles.controlButton}
              onClick={(e) => { e.stopPropagation(); setShowMarkers(!showMarkers); }}
              title={showMarkers ? "Hide markers (H)" : "Show markers (H)"}
            >
              <EyeMorphIcon size={16} visible={showMarkers} />
            </button>

            <button
              className={styles.controlButton}
              onClick={(e) => { e.stopPropagation(); copyOutput(); }}
              disabled={!hasAnnotations}
              title="Copy feedback (C)"
            >
              <CopyMorphIcon size={16} checked={copied} />
            </button>

            <button
              className={styles.controlButton}
              onClick={(e) => { e.stopPropagation(); clearAll(); }}
              disabled={!hasAnnotations}
              title="Clear all (X)"
              data-danger
            >
              <TrashMorphIcon size={16} checked={cleared} />
            </button>

            <div className={styles.divider} />

            <button
              className={styles.controlButton}
              onClick={(e) => { e.stopPropagation(); handleCloseToolbar(); }}
              title="Exit feedback mode (Esc)"
            >
              <IconChevronDown size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Markers layer */}
      <div className={styles.markersLayer} data-feedback-toolbar>
        {isActive && showMarkers &&
          markersWithState.map((annotation, index) => {
            const viewportY = toViewportY(annotation.y);
            const isVisible = viewportY > -30 && viewportY < window.innerHeight + 30;
            if (!isVisible) return null;

            const isHovered = hoveredMarkerId === annotation.id;
            const isExiting = annotation.exiting || markersExiting;

            return (
              <div
                key={annotation.id}
                className={`${styles.marker} ${isHovered ? styles.hovered : ""} ${isExiting ? 'agentation-marker-exit' : 'agentation-marker-enter'}`}
                data-annotation-marker
                style={{
                  left: `${annotation.x}%`,
                  top: viewportY,
                  animationDelay: isExiting ? '0s' : `${index * 0.03}s`,
                }}
                onMouseEnter={() => !isExiting && setHoveredMarkerId(annotation.id)}
                onMouseLeave={() => setHoveredMarkerId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isExiting) deleteAnnotation(annotation.id);
                }}
              >
                {isHovered ? <IconClose size={10} /> : index + 1}
                {isHovered && !isExiting && (
                  <div className={`${styles.markerTooltip} agentation-tooltip-animate`}>
                    {annotation.selectedText && (
                      <span className={styles.markerQuote}>
                        &ldquo;{annotation.selectedText.slice(0, 50)}
                        {annotation.selectedText.length > 50 ? "..." : ""}&rdquo;
                      </span>
                    )}
                    <span className={styles.markerNote}>{annotation.comment}</span>
                    <span className={styles.markerHint}>Click to remove</span>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Interactive overlay */}
      {isActive && (
        <div className={styles.overlay} data-feedback-toolbar>
          {/* Hover highlight - more noticeable animation */}
          {hoverInfo?.rect && !pendingAnnotation && (
            <div
              key={`${hoverInfo.rect.left}-${hoverInfo.rect.top}-${hoverInfo.rect.width}`}
              className={`${styles.hoverHighlight} agentation-highlight-animate`}
              style={{
                left: hoverInfo.rect.left,
                top: hoverInfo.rect.top,
                width: hoverInfo.rect.width,
                height: hoverInfo.rect.height,
              }}
            />
          )}

          {/* Hover tooltip */}
          {hoverInfo && !pendingAnnotation && (
            <div
              className={`${styles.hoverTooltip} agentation-hover-tooltip-animate`}
              style={{
                left: Math.min(hoverPosition.x, window.innerWidth - 150),
                top: Math.max(hoverPosition.y - 32, 8),
              }}
            >
              {hoverInfo.element}
            </div>
          )}

          {/* Pending annotation marker + popup */}
          {(pendingAnnotation || pendingExiting) && (
            <>
              <div
                className={`${styles.marker} ${styles.pending} ${pendingExiting ? 'agentation-pending-exit' : 'agentation-pending-enter'}`}
                style={{
                  left: `${pendingAnnotation?.x ?? 0}%`,
                  top: pendingAnnotation?.clientY ?? 0,
                }}
              >
                <IconPlus size={12} />
              </div>

              {pendingAnnotation && !pendingExiting && (
                <AnnotationPopupCSS
                  ref={popupRef}
                  element={pendingAnnotation.element}
                  selectedText={pendingAnnotation.selectedText}
                  onSubmit={addAnnotation}
                  onCancel={cancelAnnotation}
                  style={{
                    left: `${Math.min(Math.max(pendingAnnotation.x, 15), 85)}%`,
                    top: Math.min(pendingAnnotation.clientY + 20, window.innerHeight - 180),
                  }}
                />
              )}
            </>
          )}
        </div>
      )}
    </>,
    document.body
  );
}

export default PageFeedbackToolbarCSS;
