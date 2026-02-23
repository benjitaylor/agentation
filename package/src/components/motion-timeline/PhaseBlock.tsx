"use client";

import React, { useRef, useCallback } from "react";
import type { Phase, PhaseKind } from "../../utils/motion-types";
import styles from "./styles.module.scss";

// =============================================================================
// PhaseBlock
// =============================================================================
// A single draggable / resizable phase block in the timeline.
// Uses direct DOM style manipulation during drag — never React state — so
// the 60fps scrubbing is not bottlenecked by re-renders.
// =============================================================================

const PHASE_COLORS: Record<PhaseKind, { bg: string; border: string; text: string }> = {
  enter: {
    bg: "rgba(99,102,241,0.22)",
    border: "rgba(99,102,241,0.55)",
    text: "#a5b4fc",
  },
  idle: {
    bg: "rgba(6,182,212,0.18)",
    border: "rgba(6,182,212,0.45)",
    text: "#67e8f9",
  },
  exit: {
    bg: "rgba(245,158,11,0.2)",
    border: "rgba(245,158,11,0.45)",
    text: "#fcd34d",
  },
};

interface PhaseBlockProps {
  kind: PhaseKind;
  phase: Phase;
  startPx: number;
  widthPx: number;
  isSelected: boolean;
  timelineWidth: number;
  onSelect: () => void;
  onDragEnd: (deltaMs: number) => void;
  onResizeEnd: (newDurationMs: number) => void;
  msToPx: (ms: number) => number;
  pxToMs: (px: number) => number;
}

export function PhaseBlock({
  kind,
  phase,
  startPx,
  widthPx,
  isSelected,
  timelineWidth,
  onSelect,
  onDragEnd,
  onResizeEnd,
  pxToMs,
}: PhaseBlockProps) {
  const blockRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    type: "move" | "resize";
    startMouseX: number;
    startPx: number;
    startWidthPx: number;
  } | null>(null);

  const colors = PHASE_COLORS[kind];
  const showLabel = widthPx >= 34;

  const handleBlockMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only primary button
      if (e.button !== 0) return;
      e.stopPropagation();
      e.preventDefault();

      onSelect();

      if (phase.enabled === false) return;

      dragState.current = {
        type: "move",
        startMouseX: e.clientX,
        startPx,
        startWidthPx: widthPx,
      };

      if (blockRef.current) {
        blockRef.current.classList.add(styles.dragging);
      }

      function onMouseMove(ev: MouseEvent) {
        if (!dragState.current || !blockRef.current) return;
        const dx = ev.clientX - dragState.current.startMouseX;
        const newLeft = Math.max(0, Math.min(timelineWidth - widthPx, dragState.current.startPx + dx));
        blockRef.current.style.left = `${newLeft}px`;
      }

      function onMouseUp(ev: MouseEvent) {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        if (!dragState.current || !blockRef.current) {
          dragState.current = null;
          return;
        }

        blockRef.current.classList.remove(styles.dragging);

        const dx = ev.clientX - dragState.current.startMouseX;
        const deltaMs = pxToMs(dx);
        dragState.current = null;

        onDragEnd(deltaMs);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [onSelect, phase.enabled, startPx, widthPx, timelineWidth, pxToMs, onDragEnd]
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      e.preventDefault();

      dragState.current = {
        type: "resize",
        startMouseX: e.clientX,
        startPx,
        startWidthPx: widthPx,
      };

      document.body.style.cursor = "ew-resize";

      function onMouseMove(ev: MouseEvent) {
        if (!dragState.current || !blockRef.current) return;
        const dx = ev.clientX - dragState.current.startMouseX;
        const newWidth = Math.max(20, dragState.current.startWidthPx + dx);
        blockRef.current.style.width = `${newWidth}px`;
      }

      function onMouseUp(ev: MouseEvent) {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "";

        if (!dragState.current || !blockRef.current) {
          dragState.current = null;
          return;
        }

        const dx = ev.clientX - dragState.current.startMouseX;
        const newWidthPx = Math.max(20, dragState.current.startWidthPx + dx);
        const newDurationMs = Math.max(50, pxToMs(newWidthPx));
        dragState.current = null;

        onResizeEnd(newDurationMs);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [startPx, widthPx, pxToMs, onResizeEnd]
  );

  const classNames = [
    styles.phaseBlock,
    isSelected ? styles.selected : "",
    phase.enabled === false ? styles.disabled : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={blockRef}
      className={classNames}
      data-feedback-toolbar
      style={{
        left: startPx,
        width: widthPx,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
      }}
      onMouseDown={handleBlockMouseDown}
    >
      {showLabel && (
        <span className={styles.phaseBlockLabel}>{kind.toUpperCase()}</span>
      )}

      {/* Resize handle on right edge */}
      {phase.enabled !== false && (
        <div className={styles.resizeHandle} onMouseDown={handleResizeMouseDown} />
      )}
    </div>
  );
}
