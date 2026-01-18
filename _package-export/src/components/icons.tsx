"use client";

import { motion } from "framer-motion";

// =============================================================================
// Shared transition for morphing icons
// =============================================================================

const transition = { type: "spring" as const, stiffness: 500, damping: 30 };

// =============================================================================
// Icons
// =============================================================================

// Feedback/comment bubble with plus (Material Design style)
export const IconFeedback = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,4c4.97,0,8.9,4.56,7.82,9.72c-0.68,3.23-3.4,5.74-6.67,6.2c-1.59,0.22-3.14-0.01-4.58-0.7 c-0.27-0.13-0.56-0.19-0.86-0.19c-0.19,0-0.38,0.03-0.56,0.08l-2.31,0.68c-0.38,0.11-0.74-0.24-0.63-0.63l0.7-2.39 c0.13-0.45,0.07-0.92-0.14-1.35C4.26,14.34,4,13.18,4,12C4,7.59,7.59,4,12,4 M12,2C6.48,2,2,6.48,2,12c0,1.54,0.36,2.98,0.97,4.29 l-1.46,4.96C1.29,22,2,22.71,2.76,22.48l4.96-1.46c1.66,0.79,3.56,1.15,5.58,0.89c4.56-0.59,8.21-4.35,8.66-8.92 C22.53,7.03,17.85,2,12,2L12,2z"/>
    <path d="M12,8L12,8c-0.55,0-1,0.45-1,1v2H9c-0.55,0-1,0.45-1,1v0c0,0.55,0.45,1,1,1h2v2 c0,0.55,0.45,1,1,1h0c0.55,0,1-0.45,1-1v-2h2c0.55,0,1-0.45,1-1v0c0-0.55-0.45-1-1-1h-2V9C13,8.45,12.55,8,12,8z" fillRule="evenodd"/>
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
    {/* Eye shape - Material Design style */}
    <path d="M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
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

// Document/save icon that morphs to checkmark (Material Design style)
export const CopyMorphIcon = ({ size = 16, checked }: { size?: number; checked: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <motion.path
      d="M14.17,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V9.83c0-0.53-0.21-1.04-0.59-1.41l-4.83-4.83 C15.21,3.21,14.7,3,14.17,3L14.17,3z M8,15h8c0.55,0,1,0.45,1,1v0c0,0.55-0.45,1-1,1H8c-0.55,0-1-0.45-1-1v0C7,15.45,7.45,15,8,15z M8,11h8c0.55,0,1,0.45,1,1v0c0,0.55-0.45,1-1,1H8c-0.55,0-1-0.45-1-1v0C7,11.45,7.45,11,8,11z M8,7h5c0.55,0,1,0.45,1,1v0 c0,0.55-0.45,1-1,1H8C7.45,9,7,8.55,7,8v0C7,7.45,7.45,7,8,7z"
      initial={false}
      animate={{ opacity: checked ? 0 : 1 }}
      transition={{ duration: 0.15 }}
    />
    <motion.path
      d="M6 12.5l3.5 3.5L18 7"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={false}
      animate={{ opacity: checked ? 1 : 0, scale: checked ? 1 : 0.5 }}
      transition={transition}
      style={{ transformOrigin: "12px 12px" }}
    />
  </svg>
);

// Refresh/reset icon that morphs to checkmark (Material Design style)
export const TrashMorphIcon = ({ size = 16, checked }: { size?: number; checked: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <motion.path
      d="M17.65 6.35c-1.63-1.63-3.94-2.57-6.48-2.31-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20c3.19 0 5.93-1.87 7.21-4.56.32-.67-.16-1.44-.9-1.44-.37 0-.72.2-.88.53-1.13 2.43-3.84 3.97-6.8 3.31-2.22-.49-4.01-2.3-4.48-4.52C5.31 9.44 8.26 6 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z"
      initial={false}
      animate={{ opacity: checked ? 0 : 1 }}
      transition={{ duration: 0.15 }}
    />
    <motion.path
      d="M6 12.5l3.5 3.5L18 7"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      initial={false}
      animate={{ opacity: checked ? 1 : 0, scale: checked ? 1 : 0.5 }}
      transition={transition}
      style={{ transformOrigin: "12px 12px" }}
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

// Settings gear icon
export const IconSettings = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
  </svg>
);

// Document with lines (for output detail)
export const IconDocument = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.17 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9.83c0-.53-.21-1.04-.59-1.41l-4.83-4.83c-.37-.38-.88-.59-1.41-.59zM8 15h8c.55 0 1 .45 1 1s-.45 1-1 1H8c-.55 0-1-.45-1-1s.45-1 1-1zm0-4h8c.55 0 1 .45 1 1s-.45 1-1 1H8c-.55 0-1-.45-1-1s.45-1 1-1zm0-4h5c.55 0 1 .45 1 1s-.45 1-1 1H8c-.55 0-1-.45-1-1s.45-1 1-1z" />
  </svg>
);

// Checkmark icon
export const IconCheck = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Color palette icon
export const IconPalette = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.2-.64-1.67-.08-.1-.13-.21-.13-.33 0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
);
