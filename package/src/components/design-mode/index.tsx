"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { COMPONENT_MAP, DEFAULT_SIZES, type ComponentType, type DesignPlacement } from "./types";
import { Skeleton } from "./skeletons";
import { AnnotationPopupCSS } from "../annotation-popup-css";
import styles from "./styles.module.scss";

// =============================================================================
// Layout Mode Overlay
// =============================================================================

type DesignModeProps = {
  placements: DesignPlacement[];
  onChange: (placements: DesignPlacement[]) => void;
  activeComponent: ComponentType | null;
  onActiveComponentChange: (type: ComponentType | null) => void;
  isDarkMode: boolean;
  exiting?: boolean;
  onInteractionChange?: (active: boolean) => void;
  className?: string;
  passthrough?: boolean;
  extraSnapRects?: SnapRect[];
  onSelectionChange?: (selectedIds: Set<string>, isShift: boolean) => void;
  deselectSignal?: number;
  onDragMove?: (dx: number, dy: number) => void;
  onDragEnd?: (dx: number, dy: number, committed: boolean) => void;
  clearSignal?: number;
  wireframe?: boolean;
};

type HandleDir = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
type Guide = { axis: "x" | "y"; pos: number };

const MIN_SIZE = 24;
const SNAP_THRESHOLD = 5;

type SnapRect = { x: number; y: number; width: number; height: number };

function computeSnap(
  rect: SnapRect,
  others: DesignPlacement[],
  excludeIds: Set<string>,
  activeEdges?: { left?: boolean; right?: boolean; top?: boolean; bottom?: boolean },
  extraRects?: SnapRect[],
): { dx: number; dy: number; guides: Guide[] } {
  let bestDx = Infinity;
  let bestDy = Infinity;

  const mL = rect.x, mR = rect.x + rect.width, mCx = rect.x + rect.width / 2;
  const mT = rect.y, mB = rect.y + rect.height, mCy = rect.y + rect.height / 2;

  const checkAll = !activeEdges;
  const xFroms = checkAll ? [mL, mR, mCx] : [
    ...(activeEdges.left ? [mL] : []),
    ...(activeEdges.right ? [mR] : []),
  ];
  const yFroms = checkAll ? [mT, mB, mCy] : [
    ...(activeEdges.top ? [mT] : []),
    ...(activeEdges.bottom ? [mB] : []),
  ];

  // Build unified list of snap target rects
  const allTargets: SnapRect[] = [];
  for (const o of others) {
    if (!excludeIds.has(o.id)) allTargets.push(o);
  }
  if (extraRects) allTargets.push(...extraRects);

  for (const o of allTargets) {
    const oL = o.x, oR = o.x + o.width, oCx = o.x + o.width / 2;
    const oT = o.y, oB = o.y + o.height, oCy = o.y + o.height / 2;

    for (const from of xFroms) {
      for (const to of [oL, oR, oCx]) {
        const d = to - from;
        if (Math.abs(d) < SNAP_THRESHOLD && Math.abs(d) < Math.abs(bestDx)) bestDx = d;
      }
    }
    for (const from of yFroms) {
      for (const to of [oT, oB, oCy]) {
        const d = to - from;
        if (Math.abs(d) < SNAP_THRESHOLD && Math.abs(d) < Math.abs(bestDy)) bestDy = d;
      }
    }
  }

  const dx = Math.abs(bestDx) < SNAP_THRESHOLD ? bestDx : 0;
  const dy = Math.abs(bestDy) < SNAP_THRESHOLD ? bestDy : 0;

  // Collect guide lines at snapped positions
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

function generateId() {
  return `dp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function DesignMode({
  placements,
  onChange,
  activeComponent,
  onActiveComponentChange,
  isDarkMode,
  exiting,
  onInteractionChange,
  className: extraClassName,
  passthrough,
  extraSnapRects,
  onSelectionChange,
  deselectSignal,
  onDragMove,
  onDragEnd,
  clearSignal,
  wireframe,
}: DesignModeProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [drawBox, setDrawBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [selectBox, setSelectBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [sizeIndicator, setSizeIndicator] = useState<{ x: number; y: number; text: string } | null>(null);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editExiting, setEditExiting] = useState(false);
  const editHadTextRef = useRef(false);
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());
  const lastAnnotationTextRef = useRef<Map<string, string>>(new Map());
  const overlayRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<string | null>(null); // "place" | "move" | "resize" | "select"
  // Stable refs for callbacks (avoids stale closures in event handlers)
  const placementsRef = useRef(placements);
  placementsRef.current = placements;
  const onSelectionChangeRef = useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;
  const onDragMoveRef = useRef(onDragMove);
  onDragMoveRef.current = onDragMove;
  const onDragEndRef = useRef(onDragEnd);
  onDragEndRef.current = onDragEnd;

  // Clear selection when the other overlay signals deselect
  const deselectRef = useRef(deselectSignal);
  useEffect(() => {
    if (deselectSignal !== deselectRef.current) {
      deselectRef.current = deselectSignal;
      setSelectedIds(new Set());
    }
  }, [deselectSignal]);

  // Animate all out when clearSignal fires
  const clearRef = useRef(clearSignal);
  useEffect(() => {
    if (clearSignal !== undefined && clearSignal !== clearRef.current) {
      clearRef.current = clearSignal;
      const allIds = new Set(placementsRef.current.map(p => p.id));
      if (allIds.size > 0) {
        setExitingIds(allIds);
        setSelectedIds(new Set());
        interactionRef.current = null;
        setTimeout(() => {
          onChange([]);
          setExitingIds(new Set());
        }, 180);
      }
    }
  }, [clearSignal, onChange]);

  // --- Keyboard: arrow nudge, delete, escape ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;
      if (isTyping) return;

      // Delete selected (animate out, then remove)
      if ((e.key === "Backspace" || e.key === "Delete") && selectedIds.size > 0) {
        e.preventDefault();
        const toDelete = new Set(selectedIds);
        setExitingIds(toDelete);
        setSelectedIds(new Set());
        setTimeout(() => {
          onChange(placementsRef.current.filter((p) => !toDelete.has(p.id)));
          setExitingIds(new Set());
        }, 180);
        return;
      }

      // Arrow nudge
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) && selectedIds.size > 0) {
        e.preventDefault();
        const step = e.shiftKey ? 20 : 1;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        onChange(
          placements.map((p) =>
            selectedIds.has(p.id)
              ? { ...p, x: Math.max(0, p.x + dx), y: Math.max(0, p.y + dy) }
              : p,
          ),
        );
        return;
      }

      // Escape: deselect palette → deselect all
      if (e.key === "Escape") {
        if (activeComponent) {
          onActiveComponentChange(null);
        } else if (selectedIds.size > 0) {
          setSelectedIds(new Set());
        }
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, activeComponent, placements, onChange, onActiveComponentChange]);

  // --- Click on empty space: place or start select box ---
  const handleOverlayMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only handle left click on the overlay itself
      if (e.button !== 0) return;
      if (passthrough) return; // Let clicks fall through to rearrange
      const target = e.target as HTMLElement;
      if (target.closest(`.${styles.placement}`)) return;

      e.preventDefault();
      e.stopPropagation();

      const scrollY = window.scrollY;
      const startX = e.clientX;
      const startY = e.clientY;

      if (activeComponent) {
        // --- Place by click or drag ---
        interactionRef.current = "place";
        onInteractionChange?.(true);
        let isDrag = false;
        let endX = startX;
        let endY = startY;

        const onMove = (ev: MouseEvent) => {
          endX = ev.clientX;
          endY = ev.clientY;
          const dx = Math.abs(endX - startX);
          const dy = Math.abs(endY - startY);
          if (dx > 5 || dy > 5) isDrag = true;

          if (isDrag) {
            const x = Math.min(startX, endX);
            const y = Math.min(startY, endY);
            const w = Math.abs(endX - startX);
            const h = Math.abs(endY - startY);
            setDrawBox({ x, y, w, h });
            setSizeIndicator({ x: ev.clientX + 12, y: ev.clientY + 12, text: `${Math.round(w)} × ${Math.round(h)}` });
          }
        };

        const onUp = (ev: MouseEvent) => {
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
          setDrawBox(null);
          setSizeIndicator(null);
          interactionRef.current = null;
          onInteractionChange?.(false);

          const def = DEFAULT_SIZES[activeComponent];
          let x: number, y: number, w: number, h: number;

          if (isDrag) {
            x = Math.min(startX, endX);
            y = Math.min(startY, endY) + scrollY;
            w = Math.max(MIN_SIZE, Math.abs(endX - startX));
            h = Math.max(MIN_SIZE, Math.abs(endY - startY));
          } else {
            w = def.width;
            h = def.height;
            x = startX - w / 2;
            y = startY + scrollY - h / 2;
          }

          x = Math.max(0, x);
          y = Math.max(0, y);

          const placement: DesignPlacement = {
            id: generateId(),
            type: activeComponent,
            x,
            y,
            width: w,
            height: h,
            scrollY,
            timestamp: Date.now(),
          };

          const next = [...placements, placement];
          onChange(next);
          setSelectedIds(new Set([placement.id]));

          // Clear active component so overlay goes passthrough (allows rearrange clicks)
          onActiveComponentChange(null);
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      } else {
        // --- Deselect and start select box ---
        if (!e.shiftKey) {
          setSelectedIds(new Set());
        }

        interactionRef.current = "select";
        let isDrag = false;

        const onMove = (ev: MouseEvent) => {
          const dx = Math.abs(ev.clientX - startX);
          const dy = Math.abs(ev.clientY - startY);
          if (dx > 4 || dy > 4) isDrag = true;

          if (isDrag) {
            const x = Math.min(startX, ev.clientX);
            const y = Math.min(startY, ev.clientY);
            setSelectBox({ x, y, w: Math.abs(ev.clientX - startX), h: Math.abs(ev.clientY - startY) });
          }
        };

        const onUp = (ev: MouseEvent) => {
          window.removeEventListener("mousemove", onMove);
          window.removeEventListener("mouseup", onUp);
          interactionRef.current = null;

          if (isDrag) {
            const boxX = Math.min(startX, ev.clientX);
            const boxY = Math.min(startY, ev.clientY) + scrollY;
            const boxW = Math.abs(ev.clientX - startX);
            const boxH = Math.abs(ev.clientY - startY);

            const newSelected = new Set(e.shiftKey ? selectedIds : new Set<string>());
            for (const p of placements) {
              const pScreenY = p.y - scrollY;
              if (
                p.x + p.width > boxX &&
                p.x < boxX + boxW &&
                p.y + p.height > boxY &&
                p.y < boxY + boxH
              ) {
                newSelected.add(p.id);
              }
            }
            setSelectedIds(newSelected);
          }

          setSelectBox(null);
        };

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
      }
    },
    [activeComponent, passthrough, placements, onChange, selectedIds],
  );

  // --- Click on a placement: select ---
  const handlePlacementMouseDown = useCallback(
    (e: React.MouseEvent, id: string) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest(`.${styles.handle}`) || target.closest(`.${styles.deleteButton}`)) return;

      e.preventDefault();
      e.stopPropagation();

      // Select
      let newSelected: Set<string>;
      if (e.shiftKey) {
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
      if (changed) onSelectionChangeRef.current?.(newSelected, e.shiftKey);

      // Start drag-to-move
      const scrollY = window.scrollY;
      const startX = e.clientX;
      const startY = e.clientY;

      const startPositions = new Map<string, { x: number; y: number }>();
      for (const p of placements) {
        if (newSelected.has(p.id)) {
          startPositions.set(p.id, { x: p.x, y: p.y });
        }
      }

      interactionRef.current = "move";
      onInteractionChange?.(true);
      let moved = false;
      let duplicated = false;
      let basePlacements = placements;
      let lastSnappedDx = 0, lastSnappedDy = 0;

      // Build bounding sizes for selection (constant during drag)
      const selSizes = new Map<string, { w: number; h: number }>();
      for (const p of placements) {
        if (startPositions.has(p.id)) selSizes.set(p.id, { w: p.width, h: p.height });
      }

      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved = true;
        if (!moved) return;

        // Option+drag: duplicate selected placements (once per drag)
        if (ev.altKey && !duplicated) {
          duplicated = true;
          const clones: typeof placements = [];
          for (const p of placements) {
            if (startPositions.has(p.id)) {
              clones.push({ ...p, id: generateId(), timestamp: Date.now() });
            }
          }
          basePlacements = [...placements, ...clones];
        }

        // Compute bounding box of selection at prospective position
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const [id, start] of startPositions) {
          const sz = selSizes.get(id);
          if (!sz) continue;
          minX = Math.min(minX, start.x + dx);
          minY = Math.min(minY, start.y + dy);
          maxX = Math.max(maxX, start.x + dx + sz.w);
          maxY = Math.max(maxY, start.y + dy + sz.h);
        }
        const selRect = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
        const { dx: snapDx, dy: snapDy, guides: newGuides } = computeSnap(selRect, basePlacements, new Set(startPositions.keys()), undefined, extraSnapRects);
        setGuides(newGuides);

        const snappedDx = dx + snapDx;
        const snappedDy = dy + snapDy;
        lastSnappedDx = snappedDx;
        lastSnappedDy = snappedDy;
        onChange(
          basePlacements.map((p) => {
            const start = startPositions.get(p.id);
            if (!start) return p;
            return { ...p, x: Math.max(0, start.x + snappedDx), y: Math.max(0, start.y + snappedDy) };
          }),
        );
        onDragMoveRef.current?.(snappedDx, snappedDy);
      };

      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        interactionRef.current = null;
        onInteractionChange?.(false);
        setGuides([]);
        onDragEndRef.current?.(lastSnappedDx, lastSnappedDy, moved);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [selectedIds, placements, onChange, onInteractionChange],
  );

  // --- Resize handle ---
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, id: string, dir: HandleDir) => {
      e.preventDefault();
      e.stopPropagation();

      const comp = placements.find((p) => p.id === id);
      if (!comp) return;

      setSelectedIds(new Set([id]));
      interactionRef.current = "resize";
      onInteractionChange?.(true);

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = comp.width;
      const startH = comp.height;
      const startLeft = comp.x;
      const startTop = comp.y;

      // Determine which edges are active for this resize direction
      const activeEdges = {
        left: dir.includes("w"),
        right: dir.includes("e"),
        top: dir.includes("n"),
        bottom: dir.includes("s"),
      };

      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        let nw = startW,
          nh = startH,
          nx = startLeft,
          ny = startTop;

        if (dir.includes("e")) nw = Math.max(MIN_SIZE, startW + dx);
        if (dir.includes("w")) {
          nw = Math.max(MIN_SIZE, startW - dx);
          nx = startLeft + startW - nw;
        }
        if (dir.includes("s")) nh = Math.max(MIN_SIZE, startH + dy);
        if (dir.includes("n")) {
          nh = Math.max(MIN_SIZE, startH - dy);
          ny = startTop + startH - nh;
        }

        // Smart-snap active edges to nearby elements
        const rect = { x: nx, y: ny, width: nw, height: nh };
        const { dx: snapDx, dy: snapDy, guides: newGuides } = computeSnap(rect, placementsRef.current, new Set([id]), activeEdges, extraSnapRects);
        setGuides(newGuides);

        // Apply snap by adjusting the active edge
        if (snapDx !== 0) {
          if (activeEdges.right) nw += snapDx;
          else if (activeEdges.left) { nx += snapDx; nw -= snapDx; }
        }
        if (snapDy !== 0) {
          if (activeEdges.bottom) nh += snapDy;
          else if (activeEdges.top) { ny += snapDy; nh -= snapDy; }
        }

        onChange(
          placementsRef.current.map((p) =>
            p.id === id ? { ...p, x: nx, y: ny, width: nw, height: nh } : p,
          ),
        );

        setSizeIndicator({
          x: ev.clientX + 12,
          y: ev.clientY + 12,
          text: `${Math.round(nw)} × ${Math.round(nh)}`,
        });
      };

      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        setSizeIndicator(null);
        interactionRef.current = null;
        onInteractionChange?.(false);
        setGuides([]);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [placements, onChange, onInteractionChange],
  );

  // --- Delete a single placement (animate out, then remove) ---
  const handleDelete = useCallback(
    (id: string) => {
      interactionRef.current = null;
      setExitingIds((prev) => { const next = new Set(prev); next.add(id); return next; });
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setTimeout(() => {
        onChange(placementsRef.current.filter((p) => p.id !== id));
        setExitingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 180);
    },
    [onChange],
  );

  // --- Double-click: edit text ---
  const TEXT_TYPES = new Set<ComponentType>(["text", "hero", "button", "badge", "cta", "toast", "modal", "card", "navigation", "tabs", "input", "search", "breadcrumb", "pricing", "testimonial", "alert", "banner", "tag", "notification", "stat", "productCard"] as ComponentType[]);
  const TEXT_PLACEHOLDERS: Partial<Record<ComponentType, string>> = {
    hero: "Headline text",
    button: "Button label",
    badge: "Badge label",
    cta: "Call to action text",
    toast: "Notification message",
    modal: "Dialog title",
    card: "Card title",
    navigation: "Brand / nav items",
    tabs: "Tab labels",
    input: "Placeholder text",
    search: "Search placeholder",
    pricing: "Plan name or price",
    testimonial: "Quote text",
    alert: "Alert message",
    banner: "Banner text",
    tag: "Tag label",
    notification: "Notification message",
    stat: "Metric value",
    productCard: "Product name",
  };

  const handleDoubleClick = useCallback((id: string) => {
    const p = placements.find(pl => pl.id === id);
    if (!p) return;
    editHadTextRef.current = !!p.text;
    setEditingId(id);
    setEditExiting(false);
  }, [placements]);

  const dismissEdit = useCallback(() => {
    if (!editingId) return;
    setEditExiting(true);
    setTimeout(() => { setEditingId(null); setEditExiting(false); }, 150);
  }, [editingId]);

  // Dismiss popup when overlay starts exiting
  useEffect(() => {
    if (exiting && editingId) dismissEdit();
  }, [exiting]);

  const submitEdit = useCallback((text: string) => {
    if (!editingId) return;
    onChange(placements.map(p => p.id === editingId ? { ...p, text: text.trim() || undefined } : p));
    dismissEdit();
  }, [editingId, placements, onChange, dismissEdit]);

  const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
  const cornerHandles: HandleDir[] = ["nw", "ne", "se", "sw"];
  const arrowColor = wireframe ? "#f97316" : "#3c82f7";
  const edgeHandles: { dir: HandleDir; cls: string; arrow: JSX.Element }[] = [
    { dir: "n", cls: styles.edgeN, arrow: <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M4 0.5L1 4.5h6z" fill={arrowColor}/></svg> },
    { dir: "e", cls: styles.edgeE, arrow: <svg width="6" height="8" viewBox="0 0 6 8" fill="none"><path d="M5.5 4L1.5 1v6z" fill={arrowColor}/></svg> },
    { dir: "s", cls: styles.edgeS, arrow: <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M4 5.5L1 1.5h6z" fill={arrowColor}/></svg> },
    { dir: "w", cls: styles.edgeW, arrow: <svg width="6" height="8" viewBox="0 0 6 8" fill="none"><path d="M0.5 4L4.5 1v6z" fill={arrowColor}/></svg> },
  ];

  return (
    <>
      <div
        ref={overlayRef}
        className={`${styles.overlay} ${!isDarkMode ? styles.light : ""} ${activeComponent ? styles.placing : ""} ${passthrough ? styles.passthrough : ""} ${exiting ? styles.overlayExiting : ""} ${wireframe ? styles.wireframe : ""}${extraClassName ? ` ${extraClassName}` : ""}`}
        data-feedback-toolbar
        onMouseDown={handleOverlayMouseDown}
      >
        {/* Placed components */}
        {placements.map((p) => {
          const isSelected = selectedIds.has(p.id);
          const label = COMPONENT_MAP[p.type]?.label || p.type;
          const screenY = p.y - scrollY;

          return (
            <div
              key={p.id}
              data-design-placement={p.id}
              className={`${styles.placement} ${isSelected ? styles.selected : ""} ${exitingIds.has(p.id) ? styles.exiting : ""}`}
              style={{
                left: p.x,
                top: screenY,
                width: p.width,
                height: p.height,
                position: "fixed",
              }}
              onMouseDown={(e) => handlePlacementMouseDown(e, p.id)}
              onDoubleClick={() => handleDoubleClick(p.id)}
            >
              <span className={styles.placementLabel}>{label}</span>
              <span className={`${styles.placementAnnotation} ${p.text ? styles.annotationVisible : ""}`}>{(() => { if (p.text) lastAnnotationTextRef.current.set(p.id, p.text); return p.text || lastAnnotationTextRef.current.get(p.id) || ""; })()}</span>
              <div className={styles.placementContent}>
                <Skeleton type={p.type} width={p.width} height={p.height} text={p.text} />
              </div>

              {/* Delete button */}
              <div
                className={styles.deleteButton}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => handleDelete(p.id)}
              >
                ✕
              </div>

              {/* Corner resize handles */}
              {cornerHandles.map((dir) => (
                <div
                  key={dir}
                  className={`${styles.handle} ${styles[`handle${dir.charAt(0).toUpperCase()}${dir.slice(1)}` as keyof typeof styles]}`}
                  onMouseDown={(e) => handleResizeMouseDown(e, p.id, dir)}
                />
              ))}
              {/* Edge resize bars */}
              {edgeHandles.map(({ dir, cls, arrow }) => (
                <div
                  key={dir}
                  className={`${styles.edgeHandle} ${cls}`}
                  onMouseDown={(e) => handleResizeMouseDown(e, p.id, dir)}
                >
                  {arrow}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Text editing popup (uses annotation popup) */}
      {editingId && (() => {
        const ep = placements.find(p => p.id === editingId);
        if (!ep) return null;
        const ey = ep.y - scrollY;
        const centerX = ep.x + ep.width / 2;
        const aboveY = ey - 8;
        const belowY = ey + ep.height + 8;
        const fitsAbove = aboveY > 200;
        const fitsBelow = belowY < window.innerHeight - 100;
        const popupLeft = Math.max(160, Math.min(window.innerWidth - 160, centerX));
        let popupStyle: React.CSSProperties;
        if (fitsAbove) {
          popupStyle = { left: popupLeft, bottom: window.innerHeight - aboveY };
        } else if (fitsBelow) {
          popupStyle = { left: popupLeft, top: belowY };
        } else {
          // Tall component: place popup at vertical center of viewport
          popupStyle = { left: popupLeft, top: Math.max(80, window.innerHeight / 2 - 80) };
        }
        return (
          <AnnotationPopupCSS
            element={COMPONENT_MAP[ep.type]?.label || ep.type}
            placeholder={TEXT_PLACEHOLDERS[ep.type] || "Label or content text"}
            initialValue={ep.text ?? ""}
            submitLabel={editHadTextRef.current ? "Save" : "Set"}
            onSubmit={submitEdit}
            onCancel={dismissEdit}
            onDelete={editHadTextRef.current ? () => { submitEdit(""); } : undefined}
            isExiting={editExiting}
            lightMode={!isDarkMode}
            style={popupStyle}
          />
        );
      })()}

      {/* Draw box (drag-to-place preview) */}
      {drawBox && (
        <div
          className={styles.drawBox}
          style={{ left: drawBox.x, top: drawBox.y, width: drawBox.w, height: drawBox.h }}
          data-feedback-toolbar
        />
      )}

      {/* Select box */}
      {selectBox && (
        <div
          className={styles.selectBox}
          style={{ left: selectBox.x, top: selectBox.y, width: selectBox.w, height: selectBox.h }}
          data-feedback-toolbar
        />
      )}

      {/* Size indicator */}
      {sizeIndicator && (
        <div
          className={styles.sizeIndicator}
          style={{ left: sizeIndicator.x, top: sizeIndicator.y }}
          data-feedback-toolbar
        >
          {sizeIndicator.text}
        </div>
      )}

      {/* Smart guides */}
      {guides.map((g, i) => (
        <div
          key={`${g.axis}-${g.pos}-${i}`}
          className={styles.guideLine}
          style={g.axis === "x"
            ? { position: "fixed", left: g.pos, top: 0, width: 1, bottom: 0 }
            : { position: "fixed", left: 0, top: g.pos - scrollY, right: 0, height: 1 }
          }
          data-feedback-toolbar
        />
      ))}
    </>
  );
}
