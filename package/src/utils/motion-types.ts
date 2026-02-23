// =============================================================================
// Motion Timeline Types
// =============================================================================

/** One animation phase: enter, idle, or exit */
export type Phase = {
  enabled: boolean;
  duration: number; // ms
  delay: number; // ms — relative to this phase's start, not global timeline
  easing: string; // CSS easing: "ease-out", "cubic-bezier(...)", etc.
  /** WAAPI keyframes — array of CSS property snapshots */
  keyframes: Keyframe[];
  /** Iteration count (always 1 for enter/exit; configurable for idle) */
  iterations: number | "infinite";
  direction: "normal" | "alternate" | "reverse" | "alternate-reverse";
};

/** One element tagged in the timeline */
export type TaggedElement = {
  id: string;
  element: Element;
  /** Human-readable label, e.g. "h1.hero-title" */
  label: string;
  /** CSS selector used for export */
  selector: string;
  /** Accent color for the track (auto-assigned from palette) */
  color: string;
  /** Global ms offset: when the enter phase begins in the sequence */
  startTime: number;
  enter: Phase;
  idle: Phase;
  exit: Phase;
  /** Live WAAPI Animation refs (set/cleared by the playback engine) */
  _animations?: {
    enter?: Animation;
    idle?: Animation;
    exit?: Animation;
  };
};

export type ExportFormat = "css" | "waapi" | "framer-motion" | "gsap";

export type PanelMode = "tag" | "edit";

export type PhaseKind = "enter" | "idle" | "exit";

export type SelectedPhase = {
  elementId: string;
  phase: PhaseKind;
};

/** Default phase values */
export function makeDefaultPhase(kind: PhaseKind): Phase {
  if (kind === "enter") {
    return {
      enabled: true,
      duration: 400,
      delay: 0,
      easing: "ease-out",
      keyframes: [{ opacity: "0", transform: "translateY(12px)" }, { opacity: "1", transform: "translateY(0px)" }],
      iterations: 1,
      direction: "normal",
    };
  }
  if (kind === "idle") {
    return {
      enabled: false,
      duration: 2000,
      delay: 0,
      easing: "ease-in-out",
      keyframes: [{ opacity: "1" }, { opacity: "0.85" }, { opacity: "1" }],
      iterations: "infinite",
      direction: "normal",
    };
  }
  // exit
  return {
    enabled: true,
    duration: 250,
    delay: 0,
    easing: "ease-in",
    keyframes: [{ opacity: "1", transform: "translateY(0px)" }, { opacity: "0", transform: "translateY(-8px)" }],
    iterations: 1,
    direction: "normal",
  };
}

/** Track accent colors — one per tagged element (cycle through palette) */
export const TRACK_COLORS = [
  "#6366f1", // indigo
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#f97316", // orange
  "#ec4899", // pink
];
