"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";

import type {
  TaggedElement,
  Phase,
  PhaseKind,
  PanelMode,
  SelectedPhase,
} from "../../utils/motion-types";
import {
  makeDefaultPhase,
  TRACK_COLORS,
} from "../../utils/motion-types";
import {
  originalRAF,
  originalSetTimeout,
} from "../../utils/freeze-animations";
import {
  identifyElement,
  closestCrossingShadow,
} from "../../utils/element-identification";

import { TaggedElementOverlay } from "./TaggedElementOverlay";
import { TimelineTrack } from "./TimelineTrack";
import { PropertiesPanel } from "./PropertiesPanel";
import { ExportPanel } from "./ExportPanel";
import {
  IconPlayAlt,
  IconPause,
  IconXmark,
  IconTrashAlt,
  IconPlus,
} from "../icons";
import styles from "./styles.module.scss";

// =============================================================================
// MotionTimelinePanel — main panel component
// =============================================================================

export interface MotionTimelinePanelProps {
  onClose: () => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Generates a unique CSS selector for an element, good enough for export.
 */
function buildSelector(el: HTMLElement): string {
  if (el.id) return `#${el.id}`;
  const tag = el.tagName.toLowerCase();
  const cls = Array.from(el.classList)
    .filter((c) => !c.match(/[A-Z0-9]{5,}/)) // skip CSS module hashes
    .slice(0, 2)
    .map((c) => `.${c}`)
    .join("");
  return `${tag}${cls}`;
}

/**
 * Pierces shadow roots to find the deepest element at (x, y).
 */
function deepElementFromPoint(x: number, y: number): Element | null {
  let el: Element | null = document.elementFromPoint(x, y);
  while (el) {
    const shadow = (el as HTMLElement).shadowRoot;
    if (!shadow) break;
    const inner = shadow.elementFromPoint(x, y);
    if (!inner || inner === el) break;
    el = inner;
  }
  return el;
}

// ── Ruler tick logic ───────────────────────────────────────────────────────────

function buildRulerTicks(totalDuration: number, widthPx: number) {
  if (totalDuration <= 0 || widthPx <= 0) return [];

  // Choose a nice tick interval
  const minTickGap = 50; // px
  const candidates = [100, 200, 250, 500, 1000, 2000, 5000];
  let tickMs = candidates[candidates.length - 1];
  for (const c of candidates) {
    if ((c / totalDuration) * widthPx >= minTickGap) {
      tickMs = c;
      break;
    }
  }

  const ticks: Array<{ ms: number; px: number; label: string }> = [];
  for (let ms = 0; ms <= totalDuration; ms += tickMs) {
    const px = (ms / totalDuration) * widthPx;
    const label = ms >= 1000 ? `${ms / 1000}s` : `${ms}ms`;
    ticks.push({ ms, px, label });
  }
  return ticks;
}

// ── Scrub helpers ──────────────────────────────────────────────────────────────

function phaseGlobalDelay(el: TaggedElement, phase: "enter" | "idle" | "exit"): number {
  const enterTotal = el.enter.duration + el.enter.delay;
  if (phase === "enter") return el.startTime + el.enter.delay;
  if (phase === "idle") return el.startTime + enterTotal + el.idle.delay;

  if (!el.idle.enabled) return el.startTime + enterTotal + el.exit.delay;
  const idleIter = el.idle.iterations === "infinite" ? 1 : Number(el.idle.iterations);
  return el.startTime + enterTotal + el.idle.duration * idleIter + el.idle.delay + el.exit.delay;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function MotionTimelinePanel({ onClose }: MotionTimelinePanelProps) {
  const [mode, setMode] = useState<PanelMode>("tag");
  const [taggedElements, setTaggedElements] = useState<TaggedElement[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<SelectedPhase | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [hoverRect, setHoverRect] = useState<DOMRect | null>(null);

  // Refs for playback engine (avoid React state for 60fps)
  const isPlayingRef = useRef(false);
  const currentTimeRef = useRef(0);
  const rafIdRef = useRef<number>(0);
  const lastTimestampRef = useRef<number | null>(null);
  const timelineAreaRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const exportBtnRef = useRef<HTMLDivElement>(null);

  // Total duration computed from all elements
  const totalDuration = useMemo(() => {
    if (taggedElements.length === 0) return 3000; // default 3s
    let max = 0;
    for (const el of taggedElements) {
      const exitEnd =
        phaseGlobalDelay(el, "exit") +
        (el.exit.enabled ? el.exit.duration : 0);
      const idleEnd =
        phaseGlobalDelay(el, "idle") +
        (el.idle.enabled && el.idle.iterations !== "infinite"
          ? el.idle.duration * Number(el.idle.iterations)
          : 0);
      max = Math.max(max, exitEnd, idleEnd);
    }
    return Math.max(max + 500, 1000);
  }, [taggedElements]);

  const totalDurationRef = useRef(totalDuration);
  useEffect(() => { totalDurationRef.current = totalDuration; }, [totalDuration]);

  // ── Tag mode: click / hover listeners ────────────────────────────────────────

  useEffect(() => {
    if (mode !== "tag") {
      setHoverRect(null);
      document.body.style.cursor = "";
      return;
    }

    document.body.style.cursor = "crosshair";

    function handleMouseMove(e: MouseEvent) {
      const target = deepElementFromPoint(e.clientX, e.clientY);
      if (!target) { setHoverRect(null); return; }
      if (closestCrossingShadow(target as HTMLElement, "[data-feedback-toolbar]")) {
        setHoverRect(null);
        return;
      }
      setHoverRect((target as HTMLElement).getBoundingClientRect());
    }

    function handleClick(e: MouseEvent) {
      // Only handle in capture phase
      const target = deepElementFromPoint(e.clientX, e.clientY);
      if (!target) return;

      // Ignore clicks on the toolbar itself
      if (closestCrossingShadow(target as HTMLElement, "[data-feedback-toolbar]")) return;

      e.stopPropagation();
      e.preventDefault();

      const el = target as HTMLElement;
      const { name, path: elPath } = identifyElement(el);
      const selector = buildSelector(el);
      const colorIndex = taggedElements.length % TRACK_COLORS.length;

      const newTagged: TaggedElement = {
        id: `el-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        element: el,
        label: name,
        selector,
        color: TRACK_COLORS[colorIndex],
        startTime: 0,
        enter: makeDefaultPhase("enter"),
        idle: makeDefaultPhase("idle"),
        exit: makeDefaultPhase("exit"),
      };

      void elPath; // available for future use

      setTaggedElements((prev) => [...prev, newTagged]);
      setMode("edit");
      setSelectedPhase({ elementId: newTagged.id, phase: "enter" });
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick, true);
      document.body.style.cursor = "";
    };
  }, [mode, taggedElements.length]);

  // Clean up cursor on unmount
  useEffect(() => {
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  // ── Playback engine ───────────────────────────────────────────────────────────

  /** Apply WAAPI scrub to all tagged elements at time T */
  const scrubAllTo = useCallback((T: number) => {
    for (const el of taggedElements) {
      if (!el._animations) continue;
      for (const anim of Object.values(el._animations)) {
        if (!anim) continue;
        try {
          anim.pause();
          (anim as Animation).currentTime = T;
        } catch {
          // animation may have been cancelled
        }
      }
    }
  }, [taggedElements]);

  /** Start WAAPI animations for all elements */
  const playSequence = useCallback(() => {
    // Cancel any existing animations first
    for (const el of taggedElements) {
      if (el._animations) {
        for (const anim of Object.values(el._animations)) {
          try { anim?.cancel(); } catch { /* noop */ }
        }
      }
      el._animations = {};
    }

    const startedAt = performance.now() - currentTimeRef.current;

    for (const el of taggedElements) {
      el._animations = {};
      const domEl = el.element as HTMLElement;

      const phases: Array<{ kind: "enter" | "idle" | "exit"; phase: Phase }> = [
        { kind: "enter", phase: el.enter },
        { kind: "idle", phase: el.idle },
        { kind: "exit", phase: el.exit },
      ];

      for (const { kind, phase } of phases) {
        if (!phase.enabled || !phase.keyframes.length) continue;

        const globalDelay = phaseGlobalDelay(el, kind);
        const elapsed = currentTimeRef.current;
        const adjustedDelay = Math.max(0, globalDelay - elapsed);

        const animOpts: KeyframeAnimationOptions = {
          duration: phase.duration,
          delay: adjustedDelay,
          easing: phase.easing,
          fill: "both",
          iterations: phase.iterations === "infinite" ? Infinity : phase.iterations,
          direction: phase.direction,
        };

        try {
          const anim = domEl.animate(phase.keyframes, animOpts);
          if (el._animations) {
            el._animations[kind] = anim;
          }
        } catch {
          // element may not support animate
        }
      }
    }

    void startedAt;
  }, [taggedElements]);

  /** Cancel all animations and restore element styles */
  const resetSequence = useCallback(() => {
    for (const el of taggedElements) {
      if (el._animations) {
        for (const anim of Object.values(el._animations)) {
          try { anim?.cancel(); } catch { /* noop */ }
        }
        el._animations = {};
      }
    }
  }, [taggedElements]);

  /** rAF play loop */
  const startPlayLoop = useCallback(() => {
    lastTimestampRef.current = null;

    function tick(ts: number) {
      if (!isPlayingRef.current) return;

      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = ts;
      }

      const dt = ts - lastTimestampRef.current;
      lastTimestampRef.current = ts;

      const newTime = currentTimeRef.current + dt;

      if (newTime >= totalDurationRef.current) {
        // Reached end — stop
        currentTimeRef.current = totalDurationRef.current;
        setCurrentTime(totalDurationRef.current);
        if (playheadRef.current) {
          playheadRef.current.style.left = "100%";
        }
        isPlayingRef.current = false;
        setIsPlaying(false);
        return;
      }

      currentTimeRef.current = newTime;
      setCurrentTime(newTime);

      // Update playhead DOM directly for smooth animation
      if (playheadRef.current && timelineAreaRef.current) {
        const w = timelineAreaRef.current.offsetWidth;
        const pct = (newTime / totalDurationRef.current) * 100;
        playheadRef.current.style.left = `${pct}%`;
      }

      rafIdRef.current = originalRAF(tick);
    }

    rafIdRef.current = originalRAF(tick);
  }, []);

  function handlePlayPause() {
    if (isPlaying) {
      // Pause
      isPlayingRef.current = false;
      setIsPlaying(false);
      cancelAnimationFrame(rafIdRef.current);
      scrubAllTo(currentTimeRef.current);
    } else {
      // Play
      if (currentTimeRef.current >= totalDuration) {
        // Reset to start
        currentTimeRef.current = 0;
        setCurrentTime(0);
        resetSequence();
      }
      playSequence();
      isPlayingRef.current = true;
      setIsPlaying(true);
      startPlayLoop();
    }
  }

  function handleReset() {
    isPlayingRef.current = false;
    setIsPlaying(false);
    cancelAnimationFrame(rafIdRef.current);
    currentTimeRef.current = 0;
    setCurrentTime(0);
    resetSequence();
    if (playheadRef.current) {
      playheadRef.current.style.left = "0%";
    }
  }

  // Stop play loop on unmount
  useEffect(() => {
    return () => {
      isPlayingRef.current = false;
      cancelAnimationFrame(rafIdRef.current);
      resetSequence();
    };
  }, [resetSequence]);

  // ── Playhead drag ─────────────────────────────────────────────────────────────

  const handlePlayheadMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();

      // Pause playback during drag
      const wasPlaying = isPlayingRef.current;
      if (wasPlaying) {
        isPlayingRef.current = false;
        cancelAnimationFrame(rafIdRef.current);
      }

      const timelineEl = timelineAreaRef.current;
      if (!timelineEl) return;

      function onMove(ev: MouseEvent) {
        if (!timelineEl) return;
        const rect = timelineEl.getBoundingClientRect();
        const relX = Math.max(0, Math.min(ev.clientX - rect.left, rect.width));
        const fraction = relX / rect.width;
        const newTime = fraction * totalDurationRef.current;
        currentTimeRef.current = newTime;
        setCurrentTime(newTime);

        if (playheadRef.current) {
          playheadRef.current.style.left = `${fraction * 100}%`;
        }

        scrubAllTo(newTime);
      }

      function onUp() {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);

        if (wasPlaying) {
          isPlayingRef.current = true;
          setIsPlaying(true);
          startPlayLoop();
        }
      }

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [scrubAllTo, startPlayLoop]
  );

  // ── State updaters for child components ────────────────────────────────────────

  function removeElement(id: string) {
    setTaggedElements((prev) => {
      const el = prev.find((e) => e.id === id);
      if (el?._animations) {
        for (const anim of Object.values(el._animations)) {
          try { anim?.cancel(); } catch { /* noop */ }
        }
      }
      return prev.filter((e) => e.id !== id);
    });
    if (selectedPhase?.elementId === id) {
      setSelectedPhase(null);
    }
  }

  function updateStartTime(elementId: string, newStartTime: number) {
    setTaggedElements((prev) =>
      prev.map((el) =>
        el.id === elementId ? { ...el, startTime: Math.max(0, newStartTime) } : el
      )
    );
  }

  function updatePhaseDuration(
    elementId: string,
    phase: PhaseKind,
    newDuration: number
  ) {
    setTaggedElements((prev) =>
      prev.map((el) => {
        if (el.id !== elementId) return el;
        return {
          ...el,
          [phase]: { ...el[phase], duration: Math.max(50, newDuration) },
        };
      })
    );
  }

  function updatePhase(
    elementId: string,
    phase: PhaseKind,
    updates: Partial<Phase>
  ) {
    setTaggedElements((prev) =>
      prev.map((el) => {
        if (el.id !== elementId) return el;
        return { ...el, [phase]: { ...el[phase], ...updates } };
      })
    );
  }

  // ── Ruler ticks ────────────────────────────────────────────────────────────────

  const [timelineWidth, setTimelineWidth] = useState(600);

  useEffect(() => {
    const el = timelineAreaRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setTimelineWidth(w);
    });
    ro.observe(el);
    setTimelineWidth(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  const rulerTicks = useMemo(
    () => buildRulerTicks(totalDuration, timelineWidth),
    [totalDuration, timelineWidth]
  );

  // ── Formatted time display ────────────────────────────────────────────────────

  const timeLabel = useMemo(() => {
    const s = currentTime / 1000;
    return `${s.toFixed(2)}s`;
  }, [currentTime]);

  // ── Playhead position (for initial render / controlled scrub) ──────────────────

  const playheadPct = (currentTime / totalDuration) * 100;

  // ── Selected element ──────────────────────────────────────────────────────────

  const selectedElement = useMemo(
    () =>
      selectedPhase
        ? taggedElements.find((el) => el.id === selectedPhase.elementId) ?? null
        : null,
    [taggedElements, selectedPhase]
  );

  // ── Render ─────────────────────────────────────────────────────────────────────

  if (typeof document === "undefined") return null;

  const panel = (
    <div className={styles.panel} data-feedback-toolbar>
      {/* ── Header ── */}
      <header className={styles.header}>
        <span className={styles.headerTitle}>Motion</span>

        {/* Mode switcher */}
        <div className={styles.modeSwitcher}>
          <button
            className={`${styles.modeBtn} ${mode === "tag" ? styles.active : ""}`}
            onClick={() => setMode("tag")}
            title="Click elements to add them to the timeline"
          >
            Tag
          </button>
          <button
            className={`${styles.modeBtn} ${mode === "edit" ? styles.active : ""}`}
            onClick={() => setMode("edit")}
            title="Edit animation phases"
          >
            Edit
          </button>
        </div>

        <div className={styles.spacer} />

        {/* Playback controls */}
        <div className={styles.playbackControls}>
          {/* Reset */}
          <button
            className={styles.controlBtn}
            onClick={handleReset}
            title="Reset to start"
            aria-label="Reset"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 4v5h5M4 9C5.6 6 8.6 4 12 4c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Play / Pause */}
          <button
            className={`${styles.controlBtn} ${isPlaying ? styles.active : ""}`}
            onClick={handlePlayPause}
            title={isPlaying ? "Pause" : "Play"}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <IconPause size={14} /> : <IconPlayAlt size={14} />}
          </button>
        </div>

        {/* Time display */}
        <span className={styles.timeDisplay}>{timeLabel}</span>

        <div className={styles.divider} />

        {/* Export */}
        <div style={{ position: "relative" }} ref={exportBtnRef}>
          <button
            className={styles.exportBtn}
            onClick={() => setShowExport((v) => !v)}
            disabled={taggedElements.length === 0}
          >
            Export
          </button>
          {showExport && taggedElements.length > 0 && (
            <ExportPanel
              elements={taggedElements}
              onClose={() => setShowExport(false)}
            />
          )}
        </div>

        {/* Close */}
        <button
          className={styles.closeBtn}
          onClick={onClose}
          title="Close motion timeline"
          aria-label="Close"
        >
          <IconXmark size={14} />
        </button>
      </header>

      {/* ── Body ── */}
      <div className={styles.body}>
        {/* Track list — left sidebar */}
        <div className={styles.trackList}>
          <div className={styles.trackListHeader}>
            {mode === "tag" && (
              <button
                className={styles.addElementBtn}
                onClick={() => setMode("tag")}
                title="Switch to tag mode and click elements"
              >
                <IconPlus size={10} />
                Tag element
              </button>
            )}
          </div>

          <div className={styles.trackLabels}>
            {taggedElements.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyStateTitle}>No elements</span>
                <span className={styles.emptyStateText}>
                  Switch to Tag mode and click page elements to add them.
                </span>
              </div>
            ) : (
              taggedElements.map((el) => (
                <div key={el.id} className={styles.trackLabel}>
                  <span
                    className={styles.trackColorDot}
                    style={{ backgroundColor: el.color }}
                  />
                  <span
                    className={styles.trackLabelText}
                    title={el.label}
                  >
                    {el.label}
                  </span>
                  <button
                    className={styles.trackRemoveBtn}
                    onClick={() => removeElement(el.id)}
                    title="Remove element"
                    aria-label={`Remove ${el.label}`}
                  >
                    <IconTrashAlt size={10} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Timeline area — center */}
        <div className={styles.timelineArea} ref={timelineAreaRef}>
          {/* Ruler */}
          <div className={styles.ruler}>
            {rulerTicks.map(({ ms, px, label }) => (
              <div
                key={ms}
                className={styles.rulerTick}
                style={{ left: px }}
              >
                <div className={styles.rulerLine} />
                <span className={styles.rulerLabel}>{label}</span>
              </div>
            ))}

            {/* Playhead triangle in ruler */}
            <div
              className={styles.playhead}
              ref={playheadRef}
              style={{ left: `${playheadPct}%` }}
            >
              <div
                className={styles.playheadDragger}
                onMouseDown={handlePlayheadMouseDown}
              />
            </div>
          </div>

          {/* Track lanes */}
          <div className={styles.tracksScroll}>
            <div className={styles.tracksInner}>
              {taggedElements.map((el) => (
                <TimelineTrack
                  key={el.id}
                  element={el}
                  totalDuration={totalDuration}
                  laneWidth={timelineWidth}
                  selectedPhase={selectedPhase}
                  onSelectPhase={(phase) => {
                    setSelectedPhase({ elementId: el.id, phase });
                    setMode("edit");
                  }}
                  onUpdateStartTime={updateStartTime}
                  onUpdatePhaseDuration={updatePhaseDuration}
                />
              ))}

              {taggedElements.length === 0 && (
                <div
                  style={{
                    padding: "24px 16px",
                    textAlign: "center",
                    color: "rgba(255,255,255,0.2)",
                    fontSize: 11,
                  }}
                >
                  {mode === "tag"
                    ? "Click elements on the page to add them to the timeline."
                    : "No elements tagged yet. Switch to Tag mode."}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Properties panel — right sidebar */}
        <PropertiesPanel
          element={selectedElement}
          selectedPhase={selectedPhase}
          onUpdatePhase={updatePhase}
          onSelectPhase={(phase) => {
            if (selectedPhase) {
              setSelectedPhase({ elementId: selectedPhase.elementId, phase });
            }
          }}
        />
      </div>

      {/* Tag mode cursor prompt */}
      {mode === "tag" && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, calc(-50% - 160px))",
            background: "rgba(20,20,24,0.92)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 10,
            padding: "10px 18px",
            fontSize: 12,
            color: "rgba(255,255,255,0.55)",
            pointerEvents: "none",
            zIndex: 99999,
            whiteSpace: "nowrap",
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
          data-feedback-toolbar
        >
          Click any element on the page to tag it for animation
        </div>
      )}
    </div>
  );

  return (
    <>
      {createPortal(panel, document.body)}
      <TaggedElementOverlay
        elements={taggedElements}
        hoverRect={mode === "tag" ? hoverRect : null}
      />
    </>
  );
}
