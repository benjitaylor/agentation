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

// =============================================================================
// Utils
// =============================================================================

function generateOutput(annotations: Annotation[], pathname: string): string {
  if (annotations.length === 0) return "";

  // Include viewport dimensions
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

export function PageFeedbackToolbar() {
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

  // Track scroll for marker positions
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

  // Handle mouse move (document level)
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

  // Handle click (document level)
  useEffect(() => {
    if (!isActive) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest("[data-feedback-toolbar]")) return;
      if (target.closest("[data-annotation-popup]")) return;
      if (target.closest("[data-annotation-marker]")) return;

      e.preventDefault();

      // If there's a pending annotation, clicking outside always shakes
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
  const toViewportY = (absoluteY: number) => absoluteY - scrollY;

  return createPortal(
    <>
      {/* Toolbar */}
      <div className={styles.toolbar} data-feedback-toolbar>
        <AnimatePresence mode="wait" initial={false}>
          {!isActive ? (
            <motion.button
              key="toggle"
              className={styles.toggleButton}
              onClick={(e) => { e.stopPropagation(); setIsActive(true); }}
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
              {hasAnnotations && <span className={styles.badge}>{annotations.length}</span>}
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
                onClick={(e) => { e.stopPropagation(); toggleFreeze(); }}
                title={isFrozen ? "Resume animations" : "Pause animations"}
                data-active={isFrozen}
                whileTap={{ scale: 0.95 }}
              >
                {isFrozen ? <IconPlay size={16} /> : <IconPause size={16} />}
              </motion.button>

              <motion.button
                className={styles.controlButton}
                onClick={(e) => { e.stopPropagation(); setShowMarkers(!showMarkers); }}
                title={showMarkers ? "Hide markers" : "Show markers"}
                whileTap={{ scale: 0.95 }}
              >
                <EyeMorphIcon size={16} visible={showMarkers} />
              </motion.button>

              <motion.button
                className={styles.controlButton}
                onClick={(e) => { e.stopPropagation(); copyOutput(); }}
                disabled={!hasAnnotations}
                title="Copy feedback"
                whileTap={{ scale: 0.95 }}
              >
                <CopyMorphIcon size={16} checked={copied} />
              </motion.button>

              <motion.button
                className={styles.controlButton}
                onClick={(e) => { e.stopPropagation(); clearAll(); }}
                disabled={!hasAnnotations}
                title="Clear all"
                data-danger
                whileTap={{ scale: 0.95 }}
              >
                <TrashMorphIcon size={16} checked={cleared} />
              </motion.button>

              {/* NOTE: External link button removed - was site-specific */}

              <div className={styles.divider} />

              <motion.button
                className={styles.controlButton}
                onClick={(e) => { e.stopPropagation(); setIsActive(false); }}
                title="Exit feedback mode"
                whileTap={{ scale: 0.95 }}
              >
                <IconChevronDown size={16} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Markers layer */}
      <div className={styles.markersLayer} data-feedback-toolbar>
        <AnimatePresence>
          {isActive && showMarkers &&
            annotations.map((annotation, index) => {
              const viewportY = toViewportY(annotation.y);
              const isVisible = viewportY > -30 && viewportY < window.innerHeight + 30;
              if (!isVisible) return null;

              const isHovered = hoveredMarkerId === annotation.id;

              return (
                <motion.div
                  key={annotation.id}
                  className={`${styles.marker} ${isHovered ? styles.hovered : ""}`}
                  data-annotation-marker
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                      delay: index * 0.03,
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
                    top: viewportY,
                  }}
                  onMouseEnter={() => setHoveredMarkerId(annotation.id)}
                  onMouseLeave={() => setHoveredMarkerId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAnnotation(annotation.id);
                  }}
                >
                  {isHovered ? <IconClose size={10} /> : index + 1}
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
                            {annotation.selectedText.length > 50 ? "..." : ""}&rdquo;
                          </span>
                        )}
                        <span className={styles.markerNote}>{annotation.comment}</span>
                        <span className={styles.markerHint}>Click to remove</span>
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
          {/* Hover highlight */}
          <AnimatePresence>
            {hoverInfo?.rect && !pendingAnnotation && (
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
                }}
              />
            )}
          </AnimatePresence>

          {/* Hover tooltip */}
          <AnimatePresence>
            {hoverInfo && !pendingAnnotation && (
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
                  className={`${styles.marker} ${styles.pending}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0, transition: { duration: 0.15, ease: "easeIn" } }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{
                    left: `${pendingAnnotation.x}%`,
                    top: pendingAnnotation.clientY,
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
                  style={{
                    left: `${Math.min(Math.max(pendingAnnotation.x, 15), 85)}%`,
                    top: Math.min(pendingAnnotation.clientY + 20, window.innerHeight - 180),
                  }}
                />
              </>
            )}
          </AnimatePresence>
        </div>
      )}
    </>,
    document.body
  );
}

export default PageFeedbackToolbar;
