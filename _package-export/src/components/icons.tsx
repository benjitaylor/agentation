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

// Animated Bunny mascot
export const AnimatedBunny = ({ size = 20, color = "#4C74FF" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>{`
      @keyframes leftEyeLook {
        0%, 8% { transform: translate(0, 0); }
        10%, 18% { transform: translate(1.5px, 0); }
        20%, 22% { transform: translate(1.5px, 0) scaleY(0.1); }
        24%, 32% { transform: translate(1.5px, 0); }
        35%, 48% { transform: translate(-0.8px, -0.6px); }
        52%, 54% { transform: translate(0, 0) scaleY(0.1); }
        56%, 68% { transform: translate(0, 0); }
        72%, 82% { transform: translate(-0.5px, 0.5px); }
        85%, 100% { transform: translate(0, 0); }
      }
      @keyframes rightEyeLook {
        0%, 8% { transform: translate(0, 0); }
        10%, 18% { transform: translate(0.8px, 0); }
        20%, 22% { transform: translate(0.8px, 0) scaleY(0.1); }
        24%, 32% { transform: translate(0.8px, 0); }
        35%, 48% { transform: translate(-1.5px, -0.6px); }
        52%, 54% { transform: translate(0, 0) scaleY(0.1); }
        56%, 68% { transform: translate(0, 0); }
        72%, 82% { transform: translate(-1.2px, 0.5px); }
        85%, 100% { transform: translate(0, 0); }
      }
      @keyframes leftEarTwitch {
        0%, 9% { transform: rotate(0deg); }
        12% { transform: rotate(-8deg); }
        16%, 34% { transform: rotate(0deg); }
        38% { transform: rotate(-12deg); }
        42% { transform: rotate(-6deg); }
        48%, 100% { transform: rotate(0deg); }
      }
      @keyframes rightEarTwitch {
        0%, 9% { transform: rotate(0deg); }
        12% { transform: rotate(6deg); }
        16%, 34% { transform: rotate(0deg); }
        38% { transform: rotate(10deg); }
        42% { transform: rotate(4deg); }
        48%, 71% { transform: rotate(0deg); }
        74% { transform: rotate(8deg); }
        78%, 100% { transform: rotate(0deg); }
      }
      .bunny-eye-left {
        animation: leftEyeLook 5s ease-in-out infinite;
        transform-origin: center;
        transform-box: fill-box;
      }
      .bunny-eye-right {
        animation: rightEyeLook 5s ease-in-out infinite;
        transform-origin: center;
        transform-box: fill-box;
      }
      .bunny-ear-left {
        animation: leftEarTwitch 5s ease-in-out infinite;
        transform-origin: bottom center;
        transform-box: fill-box;
      }
      .bunny-ear-right {
        animation: rightEarTwitch 5s ease-in-out infinite;
        transform-origin: bottom center;
        transform-box: fill-box;
      }
    `}</style>
    {/* Left ear */}
    <path className="bunny-ear-left" d="M3.738 10.2164L7.224 2.007H9.167L5.676 10.2164H3.738ZM10.791 6.42705C10.791 5.90346 10.726 5.42764 10.596 4.99959C10.47 4.57155 10.292 4.16643 10.063 3.78425C9.833 3.39825 9.56 3.01797 9.243 2.64343C8.926 2.26507 8.767 2.07589 8.767 2.07589L10.24 0.957996C10.24 0.957996 10.433 1.17203 10.819 1.60007C11.209 2.0243 11.559 2.49056 11.869 2.99886C12.178 3.50717 12.413 4.04222 12.574 4.60403C12.734 5.16584 12.814 5.77352 12.814 6.42705C12.814 7.10734 12.73 7.7303 12.562 8.29593C12.394 8.85774 12.153 9.3966 11.84 9.9126C11.526 10.4247 11.181 10.8833 10.802 11.2884C10.428 11.6974 10.24 11.9018 10.24 11.9018L8.767 10.7839C8.767 10.7839 8.924 10.5948 9.237 10.2164C9.554 9.8419 9.83 9.4597 10.063 9.06985C10.3 8.6762 10.479 8.26726 10.602 7.84304C10.728 7.41499 10.791 6.943 10.791 6.42705Z" fill={color}/>
    {/* Right ear */}
    <path className="bunny-ear-right" d="M15.003 10.2164L18.489 2.007H20.432L16.941 10.2164H15.003ZM22.056 6.42705C22.056 5.90346 21.991 5.42764 21.861 4.99959C21.735 4.57155 21.557 4.16643 21.328 3.78425C21.098 3.39825 20.825 3.01797 20.508 2.64343C20.191 2.26507 20.032 2.07589 20.032 2.07589L21.505 0.957996C21.505 0.957996 21.698 1.17203 22.084 1.60007C22.474 2.0243 22.824 2.49056 23.133 2.99886C23.443 3.50717 23.678 4.04222 23.839 4.60403C23.999 5.16584 24.079 5.77352 24.079 6.42705C24.079 7.10734 23.995 7.7303 23.827 8.29593C23.659 8.85774 23.418 9.3966 23.105 9.9126C22.791 10.4247 22.445 10.8833 22.067 11.2884C21.693 11.6974 21.505 11.9018 21.505 11.9018L20.032 10.7839C20.032 10.7839 20.189 10.5948 20.502 10.2164C20.819 9.8419 21.094 9.4597 21.328 9.06985C21.565 8.6762 21.744 8.26726 21.866 7.84304C21.993 7.41499 22.056 6.943 22.056 6.42705Z" fill={color}/>
    {/* Face outline */}
    <path d="M2.03 20.4328C2.03 20.9564 2.093 21.4322 2.219 21.8602C2.345 22.2883 2.523 22.6953 2.752 23.0813C2.981 23.4635 3.254 23.8419 3.572 24.2164C3.889 24.5948 4.047 24.7839 4.047 24.7839L2.574 25.9018C2.574 25.9018 2.379 25.6878 1.989 25.2598C1.603 24.8355 1.256 24.3693 0.946 23.861C0.636 23.3527 0.401 22.8176 0.241 22.2558C0.08 21.694 0 21.0863 0 20.4328C0 19.7525 0.084 19.1314 0.252 18.5696C0.421 18.004 0.661 17.4651 0.975 16.953C1.288 16.4371 1.632 15.9765 2.007 15.5714C2.385 15.1625 2.574 14.958 2.574 14.958L4.047 16.0759C4.047 16.0759 3.889 16.2651 3.572 16.6434C3.258 17.018 2.983 17.4021 2.746 17.7957C2.513 18.1855 2.335 18.5945 2.213 19.0225C2.091 19.4467 2.03 19.9168 2.03 20.4328ZM23.687 20.4271C23.687 19.9035 23.622 19.4276 23.492 18.9996C23.366 18.5715 23.188 18.1664 22.959 17.7843C22.729 17.3982 22.456 17.018 22.139 16.6434C21.822 16.2651 21.663 16.0759 21.663 16.0759L23.136 14.958C23.136 14.958 23.329 15.172 23.715 15.6001C24.105 16.0243 24.455 16.4906 24.765 16.9989C25.074 17.5072 25.309 18.0422 25.47 18.604C25.63 19.1658 25.71 19.7735 25.71 20.4271C25.71 21.1073 25.626 21.7303 25.458 22.2959C25.29 22.8577 25.049 23.3966 24.736 23.9126C24.422 24.4247 24.077 24.8833 23.698 25.2884C23.324 25.6974 23.136 25.9018 23.136 25.9018L21.663 24.7839C21.663 24.7839 21.82 24.5948 22.133 24.2164C22.45 23.8419 22.726 23.4597 22.959 23.0698C23.196 22.6762 23.375 22.2673 23.498 21.843C23.624 21.415 23.687 20.943 23.687 20.4271Z" fill={color}/>
    {/* Animated bunny eyes */}
    <circle className="bunny-eye-left" cx="8.277" cy="20.466" r="1.8" fill={color}/>
    <circle className="bunny-eye-right" cx="19.878" cy="20.466" r="1.8" fill={color}/>
  </svg>
);
