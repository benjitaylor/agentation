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
@keyframes agentation-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes agentation-fade-scale-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes agentation-marker-in {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

@keyframes agentation-tooltip-in {
  from { opacity: 0; transform: translateX(-50%) translateY(2px) scale(0.98); }
  to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
}

.agentation-fade-in {
  animation: agentation-fade-in 0.15s ease-out forwards;
}

.agentation-fade-scale-in {
  animation: agentation-fade-scale-in 0.15s ease-out forwards;
}

.agentation-marker-in {
  animation: agentation-marker-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.agentation-tooltip-in {
  animation: agentation-tooltip-in 0.1s ease-out forwards;
}

.agentation-btn-active:active {
  transform: scale(0.95);
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

// =============================================================================
// Utils
// =============================================================================

function generateOutput(annotations: Annotation[], pathname: string): string {
  if (annotations.length === 0) return "";

  const viewport = typeof window !== "undefined"
    ? `${window.innerWidth}×${window.innerHeight}`
    : "unknown";

  let output = `## Page Feedback: ${pathname}\n`;
  output += `**Viewport:** ${viewport}\n\n`;

  annotations.forEach((a, i) => {
    output += `### ${i + 1}. ${a.element}\n`;
    output += `**Location:** ${a.elementPath}\n`;

    if (a.cssClasses) {
      output += `**Classes:** ${a.cssClasses}\n`;
    }

    if (a.boundingBox) {
      output += `**Position:** ${Math.round(a.boundingBox.x)}px, ${Math.round(a.boundingBox.y)}px (${Math.round(a.boundingBox.width)}×${Math.round(a.boundingBox.height)}px)\n`;
    }

    if (a.selectedText) {
      output += `**Selected text:** "${a.selectedText}"\n`;
    }

    if (a.nearbyText && !a.selectedText) {
      output += `**Context:** ${a.nearbyText.slice(0, 100)}\n`;
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
  const [copied, setCopied] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);

  const popupRef = useRef<AnnotationPopupHandle>(null);

  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";

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

  // Cancel annotation
  const cancelAnnotation = useCallback(() => {
    setPendingAnnotation(null);
  }, []);

  // Delete annotation
  const deleteAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
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
      if (e.key === "Escape") {
        if (pendingAnnotation) {
          // Let popup handle it
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
  const toViewportY = (absoluteY: number) => absoluteY - scrollY;

  return createPortal(
    <>
      {/* Toolbar */}
      <div className={styles.toolbar} data-feedback-toolbar>
        {!isActive ? (
          <button
            key="toggle"
            className={`${styles.toggleButton} agentation-fade-scale-in`}
            onClick={(e) => { e.stopPropagation(); setIsActive(true); }}
            title="Start feedback mode"
          >
            <IconFeedback size={18} />
            {hasAnnotations && <span className={styles.badge}>{annotations.length}</span>}
          </button>
        ) : (
          <div
            key="controls"
            className={`${styles.controls} agentation-fade-scale-in`}
          >
            <button
              className={`${styles.controlButton} agentation-btn-active`}
              onClick={(e) => { e.stopPropagation(); toggleFreeze(); }}
              title={isFrozen ? "Resume animations" : "Pause animations"}
              data-active={isFrozen}
            >
              {isFrozen ? <IconPlay size={16} /> : <IconPause size={16} />}
            </button>

            <button
              className={`${styles.controlButton} agentation-btn-active`}
              onClick={(e) => { e.stopPropagation(); setShowMarkers(!showMarkers); }}
              title={showMarkers ? "Hide markers" : "Show markers"}
            >
              <EyeMorphIcon size={16} visible={showMarkers} />
            </button>

            <button
              className={`${styles.controlButton} agentation-btn-active`}
              onClick={(e) => { e.stopPropagation(); copyOutput(); }}
              disabled={!hasAnnotations}
              title="Copy feedback"
            >
              <CopyMorphIcon size={16} checked={copied} />
            </button>

            <button
              className={`${styles.controlButton} agentation-btn-active`}
              onClick={(e) => { e.stopPropagation(); clearAll(); }}
              disabled={!hasAnnotations}
              title="Clear all"
              data-danger
            >
              <TrashMorphIcon size={16} checked={cleared} />
            </button>

            <div className={styles.divider} />

            <button
              className={`${styles.controlButton} agentation-btn-active`}
              onClick={(e) => { e.stopPropagation(); setIsActive(false); }}
              title="Exit feedback mode"
            >
              <IconChevronDown size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Markers layer */}
      <div className={styles.markersLayer} data-feedback-toolbar>
        {isActive && showMarkers &&
          annotations.map((annotation, index) => {
            const viewportY = toViewportY(annotation.y);
            const isVisible = viewportY > -30 && viewportY < window.innerHeight + 30;
            if (!isVisible) return null;

            const isHovered = hoveredMarkerId === annotation.id;

            return (
              <div
                key={annotation.id}
                className={`${styles.marker} ${isHovered ? styles.hovered : ""} agentation-marker-in`}
                data-annotation-marker
                style={{
                  left: `${annotation.x}%`,
                  top: viewportY,
                  animationDelay: `${index * 0.03}s`,
                }}
                onMouseEnter={() => setHoveredMarkerId(annotation.id)}
                onMouseLeave={() => setHoveredMarkerId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteAnnotation(annotation.id);
                }}
              >
                {isHovered ? <IconClose size={10} /> : index + 1}
                {isHovered && (
                  <div className={`${styles.markerTooltip} agentation-tooltip-in`}>
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
          {/* Hover highlight */}
          {hoverInfo?.rect && !pendingAnnotation && (
            <div
              className={`${styles.hoverHighlight} agentation-fade-in`}
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
              className={`${styles.hoverTooltip} agentation-fade-in`}
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
              <div
                className={`${styles.marker} ${styles.pending} agentation-marker-in`}
                style={{
                  left: `${pendingAnnotation.x}%`,
                  top: pendingAnnotation.clientY,
                }}
              >
                <IconPlus size={12} />
              </div>

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
            </>
          )}
        </div>
      )}
    </>,
    document.body
  );
}

export default PageFeedbackToolbarCSS;
