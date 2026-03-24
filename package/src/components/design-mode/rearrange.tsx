"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { captureElement } from "./section-detection";
import { AnnotationPopupCSS } from "../annotation-popup-css";
import type { DetectedSection, RearrangeState } from "./types";
import styles from "./styles.module.scss";

// =============================================================================
// Rearrange Overlay — Click-to-capture, free drag, resize
// =============================================================================

const SECTION_COLOR = { bg: "rgba(59, 130, 246, 0.08)", border: "rgba(59, 130, 246, 0.5)", pill: "#3b82f6" };

type HandleDir = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
const HANDLES: HandleDir[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
const MIN_SIZE = 24;
const MIN_CAPTURE_SIZE = 16;
const SNAP_THRESHOLD = 5;

type Guide = { axis: "x" | "y"; pos: number };

type SnapRect = { x: number; y: number; width: number; height: number };

function computeSectionSnap(
  rect: SnapRect,
  sections: DetectedSection[],
  excludeIds: Set<string>,
  extraRects?: SnapRect[],
): { dx: number; dy: number; guides: Guide[] } {
  let bestDx = Infinity;
  let bestDy = Infinity;

  const mL = rect.x, mR = rect.x + rect.width, mCx = rect.x + rect.width / 2;
  const mT = rect.y, mB = rect.y + rect.height, mCy = rect.y + rect.height / 2;

  // Build unified list of target rects (sections + extra rects from placements)
  const allTargets: SnapRect[] = [];
  for (const s of sections) {
    if (!excludeIds.has(s.id)) allTargets.push(s.currentRect);
  }
  if (extraRects) allTargets.push(...extraRects);

  for (const o of allTargets) {
    const oL = o.x, oR = o.x + o.width, oCx = o.x + o.width / 2;
    const oT = o.y, oB = o.y + o.height, oCy = o.y + o.height / 2;

    for (const from of [mL, mR, mCx]) {
      for (const to of [oL, oR, oCx]) {
        const d = to - from;
        if (Math.abs(d) < SNAP_THRESHOLD && Math.abs(d) < Math.abs(bestDx)) bestDx = d;
      }
    }
    for (const from of [mT, mB, mCy]) {
      for (const to of [oT, oB, oCy]) {
        const d = to - from;
        if (Math.abs(d) < SNAP_THRESHOLD && Math.abs(d) < Math.abs(bestDy)) bestDy = d;
      }
    }
  }

  const dx = Math.abs(bestDx) < SNAP_THRESHOLD ? bestDx : 0;
  const dy = Math.abs(bestDy) < SNAP_THRESHOLD ? bestDy : 0;

  const guides: Guide[] = [];
  const seen = new Set<string>();
  const sL = mL + dx, sR = mR + dx, sCx = mCx + dx;
  const sT = mT + dy, sB = mB + dy, sCy = mCy + dy;

  for (const o of allTargets) {
    const oL = o.x, oR = o.x + o.width, oCx = o.x + o.width / 2;
    const oT = o.y, oB = o.y + o.height, oCy = o.y + o.height / 2;

    for (const xPos of [oL, oCx, oR]) {
      for (const sx of [sL, sCx, sR]) {
        if (Math.abs(sx - xPos) < 0.5) {
          const key = `x:${Math.round(xPos)}`;
          if (!seen.has(key)) { seen.add(key); guides.push({ axis: "x", pos: xPos }); }
        }
      }
    }
    for (const yPos of [oT, oCy, oB]) {
      for (const sy of [sT, sCy, sB]) {
        if (Math.abs(sy - yPos) < 0.5) {
          const key = `y:${Math.round(yPos)}`;
          if (!seen.has(key)) { seen.add(key); guides.push({ axis: "y", pos: yPos }); }
        }
      }
    }
  }

  return { dx, dy, guides };
}

const SKIP_TAGS = new Set(["script", "style", "noscript", "link", "meta", "br", "hr"]);

/**
 * Pick a reasonable capture target from any element. Walk up only to skip
 * tiny inline elements (span, em, strong, etc.) — otherwise take whatever
 * was clicked, same as normal agentation annotations.
 */
function pickTarget(el: HTMLElement): HTMLElement | null {
  let current: HTMLElement | null = el;
  while (current && current !== document.body && current !== document.documentElement) {
    if (current.closest("[data-feedback-toolbar]")) return null;
    if (SKIP_TAGS.has(current.tagName.toLowerCase())) {
      current = current.parentElement;
      continue;
    }
    const rect = current.getBoundingClientRect();
    if (rect.width >= MIN_CAPTURE_SIZE && rect.height >= MIN_CAPTURE_SIZE) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

type RearrangeOverlayProps = {
  rearrangeState: RearrangeState;
  onChange: (state: RearrangeState) => void;
  isDarkMode: boolean;
  exiting?: boolean;
  className?: string;
  blankCanvas?: boolean;
  extraSnapRects?: SnapRect[];
  onSelectionChange?: (selectedIds: Set<string>, isShift: boolean) => void;
  deselectSignal?: number;
  onDragMove?: (dx: number, dy: number) => void;
  onDragEnd?: (dx: number, dy: number, committed: boolean) => void;
  clearSignal?: number;
};

export function RearrangeOverlay({ rearrangeState, onChange, isDarkMode, exiting, className: extraClassName, blankCanvas, extraSnapRects, onSelectionChange, deselectSignal, onDragMove, onDragEnd, clearSignal }: RearrangeOverlayProps) {
  const { sections } = rearrangeState;
  const rearrangeStateRef = useRef(rearrangeState);
  rearrangeStateRef.current = rearrangeState;
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Animate all out when clearSignal fires
  const [exitingAll, setExitingAll] = useState(false);
  const clearRef = useRef(clearSignal);
  useEffect(() => {
    if (clearSignal !== undefined && clearSignal !== clearRef.current) {
      clearRef.current = clearSignal;
      if (sections.length > 0) {
        setExitingAll(true);
      }
    }
  }, [clearSignal, sections.length]);

  // Clear selection when the other overlay signals deselect
  const deselectRef = useRef(deselectSignal);
  useEffect(() => {
    if (deselectSignal !== deselectRef.current) {
      deselectRef.current = deselectSignal;
      setSelectedIds(new Set());
    }
  }, [deselectSignal]);
  // --- Double-click annotation editing ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editExiting, setEditExiting] = useState(false);
  const editHadNoteRef = useRef(false);

  const handleDoubleClick = useCallback((id: string) => {
    const s = sections.find(sec => sec.id === id);
    if (!s) return;
    editHadNoteRef.current = !!s.note;
    setEditingId(id);
    setEditExiting(false);
  }, [sections]);

  const dismissEdit = useCallback(() => {
    if (!editingId) return;
    setEditExiting(true);
    setTimeout(() => { setEditingId(null); setEditExiting(false); }, 150);
  }, [editingId]);

  const submitEdit = useCallback((text: string) => {
    if (!editingId) return;
    onChange({
      ...rearrangeState,
      sections: sections.map(s => s.id === editingId ? { ...s, note: text.trim() || undefined } : s),
    });
    dismissEdit();
  }, [editingId, sections, rearrangeState, onChange, dismissEdit]);

  // Dismiss popup when overlay exits
  useEffect(() => {
    if (exiting && editingId) dismissEdit();
  }, [exiting]);

  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());
  const lastNoteTextRef = useRef<Map<string, string>>(new Map());
  const [hoverHighlight, setHoverHighlight] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [sizeIndicator, setSizeIndicator] = useState<{ x: number; y: number; text: string } | null>(null);
  const [snapGuides, setSnapGuides] = useState<Guide[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const interactionRef = useRef<string | null>(null);
  // Track which sections have already appeared as ghosts (skip ghostEnter replay)
  const seenGhostIdsRef = useRef<Set<string>>(new Set());
  // Track which action (move/resize) happened first per section, for badge ordering
  const firstActionRef = useRef<Map<string, "move" | "resize">>(new Map());
  // Live drag/resize positions for connector lines during interaction
  const [dragPositions, setDragPositions] = useState<Map<string, { x: number; y: number; width: number; height: number }>>(new Map());
  // Exiting connectors: sections that returned to original position, animating out
  const [exitingConnectors, setExitingConnectors] = useState<Map<string, { orig: { x: number; y: number; width: number; height: number }; target: { x: number; y: number; width: number; height: number }; isFixed?: boolean }>>(new Map());
  const prevChangedIdsRef = useRef<Set<string>>(new Set());
  // Track last known currentRect for each changed section (for exit animation)
  const lastChangedRectsRef = useRef<Map<string, { currentRect: { x: number; y: number; width: number; height: number }; originalRect: { x: number; y: number; width: number; height: number }; isFixed?: boolean }>>(new Map());

  // Stable refs for callbacks (avoids stale closures in event handlers)
  const onSelectionChangeRef = useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;
  const onDragMoveRef = useRef(onDragMove);
  onDragMoveRef.current = onDragMove;
  const onDragEndRef = useRef(onDragEnd);
  onDragEndRef.current = onDragEnd;

  // Clear selection when blank canvas is toggled on
  useEffect(() => {
    if (blankCanvas) setSelectedIds(new Set());
  }, [blankCanvas]);

  // Delay showing outlines on mount if sections are already moved (elements animate first)
  const [outlinesReady, setOutlinesReady] = useState(() =>
    !rearrangeState.sections.some(s => {
      const o = s.originalRect, c = s.currentRect;
      return Math.abs(o.x - c.x) > 1 || Math.abs(o.y - c.y) > 1 || Math.abs(o.width - c.width) > 1 || Math.abs(o.height - c.height) > 1;
    })
  );
  useEffect(() => {
    if (!outlinesReady) {
      const timer = setTimeout(() => setOutlinesReady(true), 380);
      return () => clearTimeout(timer);
    }
  }, []); // only on mount

  // Track captured selectors for dedup
  const capturedSelectors = useRef(new Set<string>());
  useEffect(() => {
    capturedSelectors.current = new Set(sections.map(s => s.selector));
  }, [sections]);

  // --- Keep scrollY in sync so outlines track the page ---
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // --- Hover: highlight whatever element is under cursor ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (interactionRef.current) { setHoverHighlight(null); return; }

      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (!el) { setHoverHighlight(null); return; }
      if (el.closest("[data-feedback-toolbar]")) { setHoverHighlight(null); return; }
      if (el.closest("[data-design-placement]")) { setHoverHighlight(null); return; }
      if (el.closest("[data-annotation-popup]")) { setHoverHighlight(null); return; }

      const target = pickTarget(el);
      if (!target) { setHoverHighlight(null); return; }

      // Skip already-captured elements (exact match or target is parent of captured)
      for (const sel of capturedSelectors.current) {
        try {
          const captured = document.querySelector(sel);
          if (captured && (captured === target || target.contains(captured))) {
            setHoverHighlight(null);
            return;
          }
        } catch { /* invalid selector */ }
      }

      const rect = target.getBoundingClientRect();
      setHoverHighlight({ x: rect.x, y: rect.y, w: rect.width, h: rect.height });
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [sections]);

  // --- Prevent text selection while rearrange mode is active ---
  useEffect(() => {
    const prev = document.body.style.userSelect;
    document.body.style.userSelect = "none";
    return () => { document.body.style.userSelect = prev; };
  }, []);

  // --- Mousedown to capture new elements (+ immediate drag) ---
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (interactionRef.current) return;
      if (e.button !== 0) return;
      const el = e.target as HTMLElement;
      if (!el || el.closest("[data-feedback-toolbar]")) return;
      if (el.closest("[data-design-placement]")) return;
      if (el.closest("[data-annotation-popup]")) return;

      const target = pickTarget(el);
      let alreadyCaptured = false;
      if (target) {
        for (const sel of capturedSelectors.current) {
          try {
            const captured = document.querySelector(sel);
            if (captured && (captured === target || target.contains(captured))) {
              alreadyCaptured = true;
              break;
            }
          } catch { /* invalid selector */ }
        }
      }

      const isShift = !!(e.shiftKey || e.metaKey || e.ctrlKey);
      if (target && !alreadyCaptured) {
        e.preventDefault();
        e.stopPropagation();
        const section = captureElement(target);
        const newSections = [...sections, section];
        const newOrder = [...rearrangeState.originalOrder, section.id];
        onChange({
          ...rearrangeState,
          sections: newSections,
          originalOrder: newOrder,
        });
        const newIds = new Set([section.id]);
        setSelectedIds(newIds);
        onSelectionChangeRef.current?.(newIds, isShift);
        setHoverHighlight(null);

        // Start drag tracking immediately
        const startX = e.clientX;
        const startY = e.clientY;
        const startPos = { x: section.currentRect.x, y: section.currentRect.y };
        const origRect = section.originalRect;
        let moved = false;
        let lastDx = 0, lastDy = 0;
        interactionRef.current = "move";

        const onMove = (ev: MouseEvent) => {
          const dx = ev.clientX - startX;
          const dy = ev.clientY - startY;
          if (!moved && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) moved = true;
          if (!moved) return;

          const rect = { x: startPos.x + dx, y: startPos.y + dy, width: section.currentRect.width, height: section.currentRect.height };
          const snap = computeSectionSnap(rect, newSections, new Set([section.id]), extraSnapRects);
          setSnapGuides(snap.guides);
          const snappedDx = dx + snap.dx;
          const snappedDy = dy + snap.dy;
          lastDx = snappedDx;
          lastDy = snappedDy;

          // Ghost mode: only move outline (ghost preview), not the page element
          const outlineEl = document.querySelector(`[data-rearrange-section="${section.id}"]`) as HTMLElement | null;
          if (outlineEl) outlineEl.style.transform = `translate(${snappedDx}px, ${snappedDy}px)`;
          // Update live drag position for connector lines
          setDragPositions(new Map([[section.id, { x: startPos.x + snappedDx, y: startPos.y + snappedDy, width: section.currentRect.width, height: section.currentRect.height }]]));
          onDragMoveRef.current?.(snappedDx, snappedDy);
        };

        const onUp = () => {
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
          interactionRef.current = null;
          setSnapGuides([]);
          setDragPositions(new Map());
          const outlineEl = document.querySelector(`[data-rearrange-section="${section.id}"]`) as HTMLElement | null;
          if (outlineEl) outlineEl.style.transform = "";
          if (moved) {

            onChange({
              ...rearrangeState,
              sections: newSections.map(s =>
                s.id === section.id
                  ? { ...s, currentRect: { ...s.currentRect, x: Math.max(0, startPos.x + lastDx), y: Math.max(0, startPos.y + lastDy) } }
                  : s,
              ),
              originalOrder: newOrder,
            });
          }
          onDragEndRef.current?.(lastDx, lastDy, moved);
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      } else if (alreadyCaptured && target) {
        e.preventDefault();
        // Clicked directly on a captured element's page node — select that section
        for (const s of sections) {
          try {
            const captured = document.querySelector(s.selector);
            if (captured && captured === target) {
              const newIds = new Set([s.id]);
              setSelectedIds(newIds);
              onSelectionChangeRef.current?.(newIds, isShift);
              return;
            }
          } catch { /* invalid selector */ }
        }
        if (!isShift) {
          setSelectedIds(new Set());
          onSelectionChangeRef.current?.(new Set(), false);
        }
      } else {
        if (!isShift) {
          setSelectedIds(new Set());
          onSelectionChangeRef.current?.(new Set(), false);
        }
      }
    };

    document.addEventListener("mousedown", handleMouseDown, true);
    return () => document.removeEventListener("mousedown", handleMouseDown, true);
  }, [sections, rearrangeState, onChange]);

  // --- Keyboard: delete, nudge, escape ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;

      if ((e.key === "Backspace" || e.key === "Delete") && selectedIds.size > 0) {
        e.preventDefault();
        const idsToDelete = new Set(selectedIds);
        setExitingIds(prev => { const next = new Set(prev); for (const id of idsToDelete) next.add(id); return next; });
        setSelectedIds(new Set());
        setTimeout(() => {
          const rs = rearrangeStateRef.current;
          onChange({
            ...rs,
            sections: rs.sections.filter(s => !idsToDelete.has(s.id)),
            originalOrder: rs.originalOrder.filter(id => !idsToDelete.has(id)),
          });
          setExitingIds(prev => { const next = new Set(prev); for (const id of idsToDelete) next.delete(id); return next; });
        }, 180);
        return;
      }

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) && selectedIds.size > 0) {
        e.preventDefault();
        const step = e.shiftKey ? 20 : 1;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        onChange({
          ...rearrangeState,
          sections: sections.map(s =>
            selectedIds.has(s.id)
              ? { ...s, currentRect: { ...s.currentRect, x: Math.max(0, s.currentRect.x + dx), y: Math.max(0, s.currentRect.y + dy) } }
              : s,
          ),
        });
        return;
      }

      if (e.key === "Escape" && selectedIds.size > 0) {
        setSelectedIds(new Set());
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, sections, rearrangeState, onChange]);

  // --- Click outline: select + drag ---
  const handleOutlineMouseDown = useCallback(
    (e: React.MouseEvent, id: string) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest(`.${styles.handle}`) || target.closest(`.${styles.deleteButton}`)) return;
      e.preventDefault();
      e.stopPropagation();

      let newSelected: Set<string>;
      if (e.shiftKey || e.metaKey || e.ctrlKey) {
        newSelected = new Set(selectedIds);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
      } else if (!selectedIds.has(id)) {
        newSelected = new Set([id]);
      } else {
        newSelected = new Set(selectedIds);
      }
      setSelectedIds(newSelected);
      // Only notify if selection actually changed (avoids deselecting other overlay when clicking an already-selected item to drag)
      const changed = newSelected.size !== selectedIds.size || [...newSelected].some(x => !selectedIds.has(x));
      if (changed) onSelectionChangeRef.current?.(newSelected, !!(e.shiftKey || e.metaKey || e.ctrlKey));

      const startX = e.clientX;
      const startY = e.clientY;
      const startPositions = new Map<string, { x: number; y: number }>();
      for (const s of sections) {
        if (newSelected.has(s.id)) {
          startPositions.set(s.id, { x: s.currentRect.x, y: s.currentRect.y });
        }
      }

      interactionRef.current = "move";
      let moved = false;
      let lastDx = 0, lastDy = 0;

      // Cache outline divs for direct updates during drag (zero React re-renders)
      // Ghost mode: only outlines move, page elements stay put
      const dragEls = new Map<string, {
        outlineEl: HTMLElement | null;
        curW: number; curH: number;
      }>();
      for (const s of sections) {
        if (newSelected.has(s.id)) {
          const outlineEl = document.querySelector(`[data-rearrange-section="${s.id}"]`) as HTMLElement | null;
          dragEls.set(s.id, {
            outlineEl,
            curW: s.currentRect.width, curH: s.currentRect.height,
          });
        }
      }

      const onMove = (ev: MouseEvent) => {
        const rawDx = ev.clientX - startX;
        const rawDy = ev.clientY - startY;
        if (rawDx === 0 && rawDy === 0) return;
        moved = true;

        // Compute bounding box of all selected sections at current drag position
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const [id, { curW, curH }] of dragEls) {
          const start = startPositions.get(id);
          if (!start) continue;
          const cx = start.x + rawDx, cy = start.y + rawDy;
          minX = Math.min(minX, cx); minY = Math.min(minY, cy);
          maxX = Math.max(maxX, cx + curW); maxY = Math.max(maxY, cy + curH);
        }
        const snap = computeSectionSnap(
          { x: minX, y: minY, width: maxX - minX, height: maxY - minY },
          sections,
          newSelected,
          extraSnapRects,
        );
        const dx = rawDx + snap.dx;
        const dy = rawDy + snap.dy;
        lastDx = dx;
        lastDy = dy;
        setSnapGuides(snap.guides);

        // Ghost mode: only move outline divs, page elements stay put
        for (const [, { outlineEl }] of dragEls) {
          if (outlineEl) {
            outlineEl.style.transform = `translate(${dx}px, ${dy}px)`;
          }
        }
        // Update live drag positions for connector lines + ghost clones
        const livePos = new Map<string, { x: number; y: number; width: number; height: number }>();
        for (const [id, { curW, curH }] of dragEls) {
          const start = startPositions.get(id);
          if (start) {
            const pos = { x: Math.max(0, start.x + dx), y: Math.max(0, start.y + dy), width: curW, height: curH };
            livePos.set(id, pos);
          }
        }
        setDragPositions(livePos);
        onDragMoveRef.current?.(dx, dy);
      };

      const onUp = (ev: MouseEvent) => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        interactionRef.current = null;
        setSnapGuides([]);
        setDragPositions(new Map());

        // Clear outline transforms — React state update will set correct left/top
        for (const [, { outlineEl }] of dragEls) {
          if (outlineEl) outlineEl.style.transform = "";
        }

        if (moved) {
          const totalDx = ev.clientX - startX;
          const totalDy = ev.clientY - startY;
          if (Math.abs(totalDx) < 5 && Math.abs(totalDy) < 5) {
            // Snap back — revert to pre-drag position
            onChange({
              ...rearrangeState,
              sections: sections.map(s => {
                const start = startPositions.get(s.id);
                if (!start) return s;
                return { ...s, currentRect: { ...s.currentRect, x: start.x, y: start.y } };
              }),
            });
          } else {
            // Suppress ghostEnter animation for sections transitioning to changed
            // Commit final ghost position
            onChange({
              ...rearrangeState,
              sections: sections.map(s => {
                const start = startPositions.get(s.id);
                if (!start) return s;
                return { ...s, currentRect: { ...s.currentRect, x: Math.max(0, start.x + lastDx), y: Math.max(0, start.y + lastDy) } };
              }),
            });
            onDragEndRef.current?.(lastDx, lastDy, true);
            return;
          }
        }
        onDragEndRef.current?.(0, 0, false);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [selectedIds, sections, rearrangeState, onChange],
  );

  // --- Resize ---
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, id: string, dir: HandleDir) => {
      e.preventDefault();
      e.stopPropagation();
      const section = sections.find(s => s.id === id);
      if (!section) return;

      setSelectedIds(new Set([id]));
      interactionRef.current = "resize";

      const startX = e.clientX;
      const startY = e.clientY;
      const startRect = { ...section.currentRect };
      const origRect = section.originalRect;
      const aspectRatio = startRect.width / startRect.height;
      let lastRect = { ...startRect };

      // Cache outline for direct updates — ghost mode, no page element transforms
      const resizeOutlineEl = document.querySelector(`[data-rearrange-section="${id}"]`) as HTMLElement | null;

      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        let nx = startRect.x, ny = startRect.y, nw = startRect.width, nh = startRect.height;

        if (dir.includes("e")) nw = Math.max(MIN_SIZE, startRect.width + dx);
        if (dir.includes("w")) { nw = Math.max(MIN_SIZE, startRect.width - dx); nx = startRect.x + startRect.width - nw; }
        if (dir.includes("s")) nh = Math.max(MIN_SIZE, startRect.height + dy);
        if (dir.includes("n")) { nh = Math.max(MIN_SIZE, startRect.height - dy); ny = startRect.y + startRect.height - nh; }

        // Shift = constrain aspect ratio
        if (ev.shiftKey) {
          const isCorner = dir.length === 2;
          if (isCorner) {
            const wDelta = Math.abs(nw - startRect.width);
            const hDelta = Math.abs(nh - startRect.height);
            if (wDelta > hDelta) {
              nh = nw / aspectRatio;
            } else {
              nw = nh * aspectRatio;
            }
            if (dir.includes("w")) nx = startRect.x + startRect.width - nw;
            if (dir.includes("n")) ny = startRect.y + startRect.height - nh;
          } else {
            if (dir === "e" || dir === "w") {
              nh = nw / aspectRatio;
            } else {
              nw = nh * aspectRatio;
            }
            if (dir === "w") nx = startRect.x + startRect.width - nw;
            if (dir === "n") ny = startRect.y + startRect.height - nh;
          }
        }

        lastRect = { x: nx, y: ny, width: nw, height: nh };

        // Ghost mode: only update outline, not page element
        if (resizeOutlineEl) {
          resizeOutlineEl.style.left = `${nx}px`;
          resizeOutlineEl.style.top = `${ny - scrollY}px`;
          resizeOutlineEl.style.width = `${nw}px`;
          resizeOutlineEl.style.height = `${nh}px`;
        }
        setSizeIndicator({ x: ev.clientX + 12, y: ev.clientY + 12, text: `${Math.round(nw)} × ${Math.round(nh)}` });
        setDragPositions(new Map([[id, lastRect]]));
      };

      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        setSizeIndicator(null);
        interactionRef.current = null;
        setDragPositions(new Map());
        // Suppress ghostEnter animation for resized section
        // Commit final size — element already at right spot from direct DOM
        onChange({
          ...rearrangeState,
          sections: sections.map(s => s.id === id ? { ...s, currentRect: lastRect } : s),
        });
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [sections, rearrangeState, onChange, scrollY],
  );

  const handleDelete = useCallback(
    (id: string) => {
      setExitingIds(prev => { const next = new Set(prev); next.add(id); return next; });
      setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
      setTimeout(() => {
        const rs = rearrangeStateRef.current;
        onChange({
          ...rs,
          sections: rs.sections.filter(s => s.id !== id),
          originalOrder: rs.originalOrder.filter(oid => oid !== id),
        });
        setExitingIds(prev => { const next = new Set(prev); next.delete(id); return next; });
      }, 180);
    },
    [onChange],
  );

  const hasChanged = (s: DetectedSection): boolean => {
    const o = s.originalRect, c = s.currentRect;
    return Math.abs(o.x - c.x) > 1 || Math.abs(o.y - c.y) > 1 || Math.abs(o.width - c.width) > 1 || Math.abs(o.height - c.height) > 1;
  };

  const isMoved = (s: DetectedSection): boolean => {
    const o = s.originalRect, c = s.currentRect;
    return Math.abs(o.x - c.x) > 1 || Math.abs(o.y - c.y) > 1;
  };

  const isResized = (s: DetectedSection): boolean => {
    const o = s.originalRect, c = s.currentRect;
    return Math.abs(o.width - c.width) > 1 || Math.abs(o.height - c.height) > 1;
  };

  // Track first action per section for badge ordering
  for (const s of sections) {
    if (!firstActionRef.current.has(s.id)) {
      if (isMoved(s)) firstActionRef.current.set(s.id, "move");
      else if (isResized(s)) firstActionRef.current.set(s.id, "resize");
    }
  }
  // Clean up deleted sections
  for (const id of firstActionRef.current.keys()) {
    if (!sections.some(s => s.id === id)) firstActionRef.current.delete(id);
  }

  // Filter to visible sections (DOM element still exists on page)
  const visibleSections = sections.filter(s => { try {
    if (exitingIds.has(s.id)) return true; // keep visible during exit animation
    if (selectedIds.has(s.id)) return true;
    const el = document.querySelector(s.selector);
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const expected = s.originalRect;
    const sizeDiff = Math.abs(rect.width - expected.width) + Math.abs(rect.height - expected.height);
    return sizeDiff < 200;
  } catch { return false; } });

  // Separate changed vs unchanged sections
  const changedSections = visibleSections.filter(s => hasChanged(s));
  const unchangedSections = visibleSections.filter(s => !hasChanged(s));

  // Clean up seenGhostIds for sections no longer changed (so animation replays if they become ghosts again)
  const currentChangedIds = new Set(changedSections.map(s => s.id));
  for (const id of seenGhostIdsRef.current) {
    if (!currentChangedIds.has(id)) seenGhostIdsRef.current.delete(id);
  }

  // Detect sections that just returned to original (connector exit animation)
  const changedKey = [...currentChangedIds].sort().join(",");
  // Keep last known positions of changed sections up to date
  for (const s of changedSections) {
    lastChangedRectsRef.current.set(s.id, { currentRect: s.currentRect, originalRect: s.originalRect, isFixed: s.isFixed });
  }
  useEffect(() => {
    const prev = prevChangedIdsRef.current;
    prevChangedIdsRef.current = currentChangedIds;
    const exiting = new Map<string, { orig: { x: number; y: number; width: number; height: number }; target: { x: number; y: number; width: number; height: number }; isFixed?: boolean }>();
    for (const id of prev) {
      if (!currentChangedIds.has(id)) {
        // Skip if section was deleted — exitingIds connector fade handles that
        if (!sections.some(s => s.id === id)) continue;
        // Use the last known position before it snapped back
        const last = lastChangedRectsRef.current.get(id);
        if (last) {
          exiting.set(id, { orig: last.originalRect, target: last.currentRect, isFixed: last.isFixed });
          lastChangedRectsRef.current.delete(id);
        }
      }
    }
    if (exiting.size > 0) {
      setExitingConnectors(prev => {
        const next = new Map(prev);
        for (const [id, data] of exiting) next.set(id, data);
        return next;
      });
      const timer = setTimeout(() => {
        setExitingConnectors(prev => {
          const next = new Map(prev);
          for (const id of exiting.keys()) next.delete(id);
          return next;
        });
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [changedKey, sections]);

  return (
    <>
      <div
        className={`${styles.rearrangeOverlay} ${!isDarkMode ? styles.light : ""} ${exiting ? styles.overlayExiting : ""}${extraClassName ? ` ${extraClassName}` : ""}`}
        data-feedback-toolbar
      >
        {/* Hover highlight */}
        {hoverHighlight && (
          <div
            className={styles.hoverHighlight}
            style={{ left: hoverHighlight.x, top: hoverHighlight.y, width: hoverHighlight.w, height: hoverHighlight.h }}
          />
        )}

        {/* Unchanged sections — render at currentRect (same as originalRect) */}
        {unchangedSections.map((section) => {
          const rect = section.currentRect;
          const screenY = section.isFixed ? rect.y : rect.y - scrollY;
          const color = SECTION_COLOR;
          const isSelected = selectedIds.has(section.id);

          return (
            <div
              key={section.id}
              data-rearrange-section={section.id}
              className={`${styles.sectionOutline} ${isSelected ? styles.selected : ""} ${exitingAll || exiting || exitingIds.has(section.id) ? styles.exiting : ""}`}
              style={{ left: rect.x, top: screenY, width: rect.width, height: rect.height, borderColor: color.border, backgroundColor: color.bg, ...(outlinesReady ? {} : { opacity: 0, animation: "none", transition: "none" }) }}
              onMouseDown={(e) => handleOutlineMouseDown(e, section.id)}
              onDoubleClick={() => handleDoubleClick(section.id)}
            >
              <span className={styles.sectionLabel} style={{ backgroundColor: color.pill }}>
                {section.label}
              </span>
              <span className={`${styles.sectionAnnotation} ${section.note ? styles.annotationVisible : ""}`}>{(() => { if (section.note) lastNoteTextRef.current.set(section.id, section.note); return section.note || lastNoteTextRef.current.get(section.id) || ""; })()}</span>
              <span className={styles.sectionDimensions}>
                {Math.round(rect.width)} &times; {Math.round(rect.height)}
              </span>
              <div
                className={styles.deleteButton}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => handleDelete(section.id)}
              >
                ✕
              </div>
              {HANDLES.map((dir) => (
                <div
                  key={dir}
                  className={`${styles.handle} ${styles[`handle${dir.charAt(0).toUpperCase()}${dir.slice(1)}` as keyof typeof styles]}`}
                  onMouseDown={(e) => handleResizeMouseDown(e, section.id, dir)}
                />
              ))}
            </div>
          );
        })}

        {/* No original outlines — connector line is sufficient */}

        {/* Changed sections — ghost outlines at currentRect (interactive) */}
        {changedSections.map((section) => {
          const rect = section.currentRect;
          const screenY = section.isFixed ? rect.y : rect.y - scrollY;
          const isSelected = selectedIds.has(section.id);
          const moved = isMoved(section);
          const resized = isResized(section);
          const settled = !isSelected;

          if (blankCanvas && settled) return null;

          // Only animate ghostEnter the first time a section appears as a ghost
          const isNewGhost = !seenGhostIdsRef.current.has(section.id);
          if (isNewGhost) seenGhostIdsRef.current.add(section.id);

          return (
            <div
              key={section.id}
              data-rearrange-section={section.id}
              className={`${styles.ghostOutline} ${isSelected ? styles.selected : ""} ${exitingAll || exiting || exitingIds.has(section.id) ? styles.exiting : ""}`}
              style={{ left: rect.x, top: screenY, width: rect.width, height: rect.height, ...(outlinesReady ? {} : { opacity: 0, animation: "none", transition: "none" }), ...(!isNewGhost ? { animation: "none" } : {}) }}
              onMouseDown={(e) => handleOutlineMouseDown(e, section.id)}
              onDoubleClick={() => handleDoubleClick(section.id)}
            >
              <span className={styles.sectionLabel} style={{ backgroundColor: SECTION_COLOR.pill }}>
                {section.label}
              </span>
              <span className={`${styles.sectionAnnotation} ${section.note ? styles.annotationVisible : ""}`}>{(() => { if (section.note) lastNoteTextRef.current.set(section.id, section.note); return section.note || lastNoteTextRef.current.get(section.id) || ""; })()}</span>
              <span className={styles.sectionDimensions}>
                {Math.round(rect.width)} &times; {Math.round(rect.height)}
              </span>
              <div
                className={styles.deleteButton}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => handleDelete(section.id)}
              >
                ✕
              </div>
              {HANDLES.map((dir) => (
                <div
                  key={dir}
                  className={`${styles.handle} ${styles[`handle${dir.charAt(0).toUpperCase()}${dir.slice(1)}` as keyof typeof styles]}`}
                  onMouseDown={(e) => handleResizeMouseDown(e, section.id, dir)}
                />
              ))}
              <span className={styles.ghostBadge}>
                {(() => {
                  const first = firstActionRef.current.get(section.id);
                  if (moved && resized) {
                    const [a, b] = first === "resize" ? ["Resize", "Move"] : ["Move", "Resize"];
                    return <>Suggested {a} <span className={styles.ghostBadgeExtra}>&amp; {b}</span></>;
                  }
                  return `Suggested ${resized ? "Resize" : "Move"}`;
                })()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Annotation connector lines — SVG from original to ghost/drag position */}
      {!blankCanvas && (() => {
        // Build list of sections that need connectors: committed changes + live drags
        const connectorSections: { id: string; orig: typeof sections[0]["originalRect"]; target: { x: number; y: number; width: number; height: number }; isFixed?: boolean; isSelected: boolean; isExiting?: boolean }[] = [];
        for (const s of changedSections) {
          const livePos = dragPositions.get(s.id);
          connectorSections.push({ id: s.id, orig: s.originalRect, target: livePos || s.currentRect, isFixed: s.isFixed, isSelected: selectedIds.has(s.id), isExiting: exitingIds.has(s.id) });
        }
        // Also add sections being dragged that haven't changed yet (first drag)
        for (const [id, pos] of dragPositions) {
          if (!connectorSections.some(c => c.id === id)) {
            const s = sections.find(sec => sec.id === id);
            if (s) connectorSections.push({ id, orig: s.originalRect, target: pos, isFixed: s.isFixed, isSelected: selectedIds.has(id) });
          }
        }
        // Add exiting connectors (sections that returned to original)
        for (const [id, data] of exitingConnectors) {
          if (!connectorSections.some(c => c.id === id)) {
            connectorSections.push({ id, orig: data.orig, target: data.target, isFixed: data.isFixed, isSelected: false, isExiting: true });
          }
        }

        if (connectorSections.length === 0) return null;

        return (
          <svg className={`${styles.connectorSvg} ${exitingAll || exiting ? styles.connectorExiting : ""}`}>
            {connectorSections.map(({ id, orig, target, isFixed, isSelected, isExiting }) => {
              const ox = orig.x + orig.width / 2;
              const oy = (isFixed ? orig.y : orig.y - scrollY) + orig.height / 2;
              const cx = target.x + target.width / 2;
              const cy = (isFixed ? target.y : target.y - scrollY) + target.height / 2;

              const ddx = cx - ox;
              const ddy = cy - oy;
              const dist = Math.sqrt(ddx * ddx + ddy * ddy);
              if (dist < 2) return null;

              // Scale dots down as they approach each other
              const proximityScale = Math.min(1, dist / 40);
              const perpOffset = Math.min(dist * 0.3, 60);
              const nx = dist > 0 ? -ddy / dist : 0;
              const ny = dist > 0 ? ddx / dist : 0;
              const cpx = (ox + cx) / 2 + nx * perpOffset;
              const cpy = (oy + cy) / 2 + ny * perpOffset;
              const isDragging = dragPositions.has(id);
              const baseOpacity = isDragging || isSelected ? 1 : 0.4;
              const dotBaseOpacity = isDragging || isSelected ? 1 : 0.5;

              return (
                <g key={`conn-${id}`} className={isExiting ? styles.connectorExiting : ""}>
                  <path
                    className={styles.connectorLine}
                    d={`M ${ox} ${oy} Q ${cpx} ${cpy} ${cx} ${cy}`}
                    fill="none"
                    stroke="rgba(59, 130, 246, 0.45)"
                    strokeWidth="1.5"
                    opacity={baseOpacity * proximityScale}
                  />
                  {/* Endpoint circles */}
                  <circle className={styles.connectorDot} cx={ox} cy={oy} r={4 * proximityScale} fill="rgba(59, 130, 246, 0.8)" stroke="#fff" strokeWidth="1.5" opacity={dotBaseOpacity * proximityScale} filter="url(#connDotShadow)" />
                  <circle className={styles.connectorDot} cx={cx} cy={cy} r={4 * proximityScale} fill="rgba(59, 130, 246, 0.8)" stroke="#fff" strokeWidth="1.5" opacity={dotBaseOpacity * proximityScale} filter="url(#connDotShadow)" />
                </g>
              );
            })}
            <defs>
              <filter id="connDotShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0.5" stdDeviation="1" floodOpacity="0.15" />
              </filter>
            </defs>
          </svg>
        );
      })()}

      {/* Note editing popup */}
      {editingId && (() => {
        const es = sections.find(s => s.id === editingId);
        if (!es) return null;
        const rect = es.currentRect;
        const screenY = es.isFixed ? rect.y : rect.y - scrollY;
        const centerX = rect.x + rect.width / 2;
        const aboveY = screenY - 8;
        const belowY = screenY + rect.height + 8;
        const fitsAbove = aboveY > 200;
        const fitsBelow = belowY < window.innerHeight - 100;
        const popupLeft = Math.max(160, Math.min(window.innerWidth - 160, centerX));
        let popupStyle: React.CSSProperties;
        if (fitsAbove) {
          popupStyle = { left: popupLeft, bottom: window.innerHeight - aboveY };
        } else if (fitsBelow) {
          popupStyle = { left: popupLeft, top: belowY };
        } else {
          popupStyle = { left: popupLeft, top: Math.max(80, window.innerHeight / 2 - 80) };
        }
        return (
          <AnnotationPopupCSS
            element={es.label}
            placeholder="Add a note about this section"
            initialValue={es.note ?? ""}
            submitLabel={editHadNoteRef.current ? "Save" : "Set"}
            onSubmit={submitEdit}
            onCancel={dismissEdit}
            onDelete={editHadNoteRef.current ? () => { submitEdit(""); } : undefined}
            isExiting={editExiting}
            lightMode={!isDarkMode}
            style={popupStyle}
          />
        );
      })()}

      {sizeIndicator && (
        <div className={styles.sizeIndicator} style={{ left: sizeIndicator.x, top: sizeIndicator.y }} data-feedback-toolbar>
          {sizeIndicator.text}
        </div>
      )}

      {/* Snap alignment guides */}
      {snapGuides.map((g, i) => (
        <div
          key={`${g.axis}-${g.pos}-${i}`}
          className={styles.guideLine}
          style={
            g.axis === "x"
              ? { position: "fixed", left: g.pos, top: 0, width: 1, height: "100vh" }
              : { position: "fixed", left: 0, top: g.pos - scrollY, width: "100vw", height: 1 }
          }
        />
      ))}
    </>
  );
}
