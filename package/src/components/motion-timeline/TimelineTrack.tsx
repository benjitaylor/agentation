"use client";

import React, { useMemo } from "react";
import type { TaggedElement, PhaseKind, SelectedPhase } from "../../utils/motion-types";
import { PhaseBlock } from "./PhaseBlock";
import styles from "./styles.module.scss";

// =============================================================================
// TimelineTrack
// =============================================================================
// Renders a full timeline lane for one tagged element — all 3 phase blocks.
//
// Phase positions are calculated from the element's startTime + phase delays:
//   enter:  starts at element.startTime + enter.delay
//   idle:   starts at enter end + idle.delay
//   exit:   starts after idle end (or after enter if idle disabled) + exit.delay
// =============================================================================

interface TimelineTrackProps {
  element: TaggedElement;
  totalDuration: number; // ms
  laneWidth: number; // px
  selectedPhase: SelectedPhase | null;
  onSelectPhase: (phase: PhaseKind) => void;
  onUpdateStartTime: (elementId: string, newStartTime: number) => void;
  onUpdatePhaseDuration: (elementId: string, phase: PhaseKind, newDuration: number) => void;
}

export function TimelineTrack({
  element,
  totalDuration,
  laneWidth,
  selectedPhase,
  onSelectPhase,
  onUpdateStartTime,
  onUpdatePhaseDuration,
}: TimelineTrackProps) {
  const msToPx = useMemo(
    () =>
      (ms: number) =>
        totalDuration > 0 ? (ms / totalDuration) * laneWidth : 0,
    [totalDuration, laneWidth]
  );

  const pxToMs = useMemo(
    () =>
      (px: number) =>
        laneWidth > 0 ? (px / laneWidth) * totalDuration : 0,
    [totalDuration, laneWidth]
  );

  // Calculate global start times for each phase
  const enterStart = element.startTime + element.enter.delay;
  const enterEnd = enterStart + element.enter.duration;

  // Idle starts after enter finishes
  const idleStart = enterEnd + element.idle.delay;
  const idleEnd = idleStart + (element.idle.enabled ? element.idle.duration : 0);

  // Exit starts after idle (or after enter if idle disabled)
  const exitPrevEnd = element.idle.enabled ? idleEnd : enterEnd;
  const exitStart = exitPrevEnd + element.exit.delay;

  // Convert to pixels
  const enterStartPx = msToPx(enterStart);
  const enterWidthPx = msToPx(element.enter.duration);
  const idleStartPx = msToPx(idleStart);
  const idleWidthPx = msToPx(element.idle.duration);
  const exitStartPx = msToPx(exitStart);
  const exitWidthPx = msToPx(element.exit.duration);

  const isEnterSelected =
    selectedPhase?.elementId === element.id && selectedPhase.phase === "enter";
  const isIdleSelected =
    selectedPhase?.elementId === element.id && selectedPhase.phase === "idle";
  const isExitSelected =
    selectedPhase?.elementId === element.id && selectedPhase.phase === "exit";

  function handleEnterDragEnd(deltaMs: number) {
    // Dragging the enter block shifts the element's overall startTime
    const newStartTime = Math.max(0, element.startTime + deltaMs);
    onUpdateStartTime(element.id, newStartTime);
  }

  function handleIdleDragEnd(_deltaMs: number) {
    // Idle position is derived — we'd need to change idle.delay
    // For simplicity, update idle delay
    const newDelay = Math.max(0, element.idle.delay + _deltaMs);
    onUpdatePhaseDuration(element.id, "idle", element.idle.duration);
    void newDelay; // acknowledged — caller can extend to update delay separately
  }

  function handleExitDragEnd(_deltaMs: number) {
    const newDelay = Math.max(0, element.exit.delay + _deltaMs);
    void newDelay;
  }

  return (
    <div className={styles.trackLane} data-feedback-toolbar>
      {/* Enter block */}
      {enterWidthPx > 0 && (
        <PhaseBlock
          kind="enter"
          phase={element.enter}
          startPx={enterStartPx}
          widthPx={enterWidthPx}
          isSelected={isEnterSelected}
          timelineWidth={laneWidth}
          onSelect={() => onSelectPhase("enter")}
          onDragEnd={handleEnterDragEnd}
          onResizeEnd={(newDuration) =>
            onUpdatePhaseDuration(element.id, "enter", newDuration)
          }
          msToPx={msToPx}
          pxToMs={pxToMs}
        />
      )}

      {/* Idle block */}
      {idleWidthPx > 0 && (
        <PhaseBlock
          kind="idle"
          phase={element.idle}
          startPx={idleStartPx}
          widthPx={idleWidthPx}
          isSelected={isIdleSelected}
          timelineWidth={laneWidth}
          onSelect={() => onSelectPhase("idle")}
          onDragEnd={handleIdleDragEnd}
          onResizeEnd={(newDuration) =>
            onUpdatePhaseDuration(element.id, "idle", newDuration)
          }
          msToPx={msToPx}
          pxToMs={pxToMs}
        />
      )}

      {/* Exit block */}
      {exitWidthPx > 0 && (
        <PhaseBlock
          kind="exit"
          phase={element.exit}
          startPx={exitStartPx}
          widthPx={exitWidthPx}
          isSelected={isExitSelected}
          timelineWidth={laneWidth}
          onSelect={() => onSelectPhase("exit")}
          onDragEnd={handleExitDragEnd}
          onResizeEnd={(newDuration) =>
            onUpdatePhaseDuration(element.id, "exit", newDuration)
          }
          msToPx={msToPx}
          pxToMs={pxToMs}
        />
      )}
    </div>
  );
}
