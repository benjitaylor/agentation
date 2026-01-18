"use client";

import { motion } from "framer-motion";

// =============================================================================
// Shared transition for morphing icons
// =============================================================================

const transition = { type: "spring" as const, stiffness: 500, damping: 30 };

// =============================================================================
// Icons
// =============================================================================

// Feedback/comment bubble
export const IconFeedback = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path
      d="M3 4h12v8H5l-2 2V4z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

// Play icon (triangle pointing right)
export const IconPlay = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M5 3.5v9l7-4.5-7-4.5z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

// Pause icon (two vertical bars)
export const IconPause = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M5.5 4v8M10.5 4v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Eye icon with morph animation (Material Design filled style)
export const EyeMorphIcon = ({ size = 16, visible }: { size?: number; visible: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    {/* Eye shape with iris and pupil */}
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    {/* Slash line for hidden state */}
    <motion.g
      initial={false}
      animate={{ opacity: visible ? 0 : 1 }}
      transition={{ duration: 0.15 }}
    >
      <line x1="4" y1="20" x2="20" y2="4" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <line x1="4" y1="20" x2="20" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </motion.g>
  </svg>
);

// Clipboard/copy icon that morphs to checkmark
export const CopyMorphIcon = ({ size = 16, checked }: { size?: number; checked: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <motion.g initial={false} animate={{ opacity: checked ? 0 : 1 }} transition={{ duration: 0.15 }}>
      {/* Back page */}
      <rect x="3" y="2" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Front page */}
      <rect x="6" y="5" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" fill="white" />
    </motion.g>
    <motion.path
      d="M4 8.5l2.5 2.5L12 5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={false}
      animate={{ opacity: checked ? 1 : 0, scale: checked ? 1 : 0.5 }}
      transition={transition}
      style={{ transformOrigin: "8px 8px" }}
    />
  </svg>
);

// Trash icon that morphs to checkmark
export const TrashMorphIcon = ({ size = 16, checked }: { size?: number; checked: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <motion.g initial={false} animate={{ opacity: checked ? 0 : 1 }} transition={{ duration: 0.15 }}>
      {/* Lid */}
      <path d="M3 4h10M6 4V3a1 1 0 011-1h2a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Body */}
      <path d="M4.5 4.5l.7 8.5a1 1 0 001 .9h3.6a1 1 0 001-.9l.7-8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </motion.g>
    <motion.path
      d="M4 8.5l2.5 2.5L12 5"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={false}
      animate={{ opacity: checked ? 1 : 0, scale: checked ? 1 : 0.5 }}
      transition={transition}
      style={{ transformOrigin: "8px 8px" }}
    />
  </svg>
);

// External link arrow
export const IconExternal = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M6 3h7v7M13 3L6 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Chevron down for close/collapse
export const IconChevronDown = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M4 6l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Small X for marker delete
export const IconClose = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Plus icon
export const IconPlus = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
