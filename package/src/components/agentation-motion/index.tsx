"use client";

import React, { useState } from "react";
import { PageFeedbackToolbarCSS as Agentation } from "../page-toolbar-css";
import type { AgentationProps } from "../page-toolbar-css";
import { MotionTimelinePanel } from "../motion-timeline";
import { freeze, unfreeze } from "../../utils/freeze-animations";
import styles from "./styles.module.scss";

// =============================================================================
// AgentationMotion
// =============================================================================
// Wrapper that combines the existing Agentation feedback toolbar with a
// Motion Timeline trigger button and panel.
//
// When the motion panel is open, page animations are frozen via freeze()
// so the timeline can scrub WAAPI animations cleanly.
// =============================================================================

export type AgentationMotionProps = AgentationProps;

export function AgentationMotion(props: AgentationMotionProps) {
  const [motionOpen, setMotionOpen] = useState(false);

  function openMotion() {
    freeze();
    setMotionOpen(true);
  }

  function closeMotion() {
    setMotionOpen(false);
    unfreeze();
  }

  return (
    <>
      {/* Existing Agentation annotation toolbar */}
      <Agentation {...props} />

      {/* Floating motion timeline trigger button */}
      <button
        className={`${styles.triggerBtn} ${motionOpen ? styles.panelOpen : ""}`}
        data-feedback-toolbar
        onClick={() => (motionOpen ? closeMotion() : openMotion())}
        title="Motion Timeline"
        aria-label="Motion Timeline"
        aria-pressed={motionOpen}
      >
        {/* Film strip / timeline icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect
            x="2"
            y="6"
            width="20"
            height="12"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M7 6V18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M17 6V18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M2 10H7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M17 10H22" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2 14H7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M17 14H22" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {/* Motion timeline panel — rendered when open */}
      {motionOpen && <MotionTimelinePanel onClose={closeMotion} />}
    </>
  );
}
