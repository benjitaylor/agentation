"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { TaggedElement } from "../../utils/motion-types";
import styles from "./styles.module.scss";

// =============================================================================
// TaggedElementOverlay
// =============================================================================
// Renders:
//   - A colored border overlay for each tagged element
//   - A blue dashed hover highlight when hoverRect is provided (tag mode)
//
// Uses createPortal to document.body so overlays sit above all page content.
// =============================================================================

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TaggedElementOverlayProps {
  elements: TaggedElement[];
  hoverRect: DOMRect | null;
}

function toRect(r: DOMRect): Rect {
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

export function TaggedElementOverlay({ elements, hoverRect }: TaggedElementOverlayProps) {
  const [elementRects, setElementRects] = useState<Rect[]>([]);
  const rafRef = useRef<number>(0);

  // Update rects on every animation frame so they track scroll / resize.
  useEffect(() => {
    let active = true;

    function update() {
      if (!active) return;
      const rects = elements.map((el) => {
        try {
          return toRect((el.element as HTMLElement).getBoundingClientRect());
        } catch {
          return { top: 0, left: 0, width: 0, height: 0 };
        }
      });
      setElementRects(rects);
      rafRef.current = requestAnimationFrame(update);
    }

    rafRef.current = requestAnimationFrame(update);
    return () => {
      active = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [elements]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* Colored border for each tagged element */}
      {elements.map((el, i) => {
        const rect = elementRects[i];
        if (!rect || rect.width === 0) return null;

        return (
          <div
            key={el.id}
            className={styles.elementOverlay}
            data-feedback-toolbar
            style={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
              borderColor: el.color,
              color: el.color,
            }}
          >
            <span className={styles.elementOverlayLabel}>{el.label}</span>
          </div>
        );
      })}

      {/* Hover highlight in tag mode */}
      {hoverRect && hoverRect.width > 0 && (
        <div
          key="hover-highlight"
          className={styles.hoverHighlight}
          data-feedback-toolbar
          style={{
            top: hoverRect.top,
            left: hoverRect.left,
            width: hoverRect.width,
            height: hoverRect.height,
          }}
        />
      )}
    </>,
    document.body
  );
}
