"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { COMPONENT_REGISTRY, DEFAULT_SIZES, type ComponentType } from "./types";
import styles from "./styles.module.scss";

function scrollFadeClass(el: HTMLDivElement | null) {
  if (!el) return "";
  const top = el.scrollTop > 2;
  const bottom = el.scrollTop + el.clientHeight < el.scrollHeight - 2;
  return `${top ? styles.fadeTop : ""} ${bottom ? styles.fadeBottom : ""}`;
}

// =============================================================================
// Mini SVG Icons for Palette (compact 20x16)
// =============================================================================

const s = "currentColor";
const sw = "0.5";

export function PaletteIconSvg({ type }: { type: ComponentType }) {
  switch (type) {
    case "navigation":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="1" y="4" width="18" height="8" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="2.5" y="7" width="3" height="1.5" rx=".5" fill={s} opacity=".4" />
          <rect x="7" y="7" width="2.5" height="1.5" rx=".5" fill={s} opacity=".25" />
          <rect x="11" y="7" width="2.5" height="1.5" rx=".5" fill={s} opacity=".25" />
        </svg>
      );
    case "header":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="1" y="2" width="18" height="12" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="3" y="5.5" width="8" height="2" rx=".5" fill={s} opacity=".35" />
          <rect x="3" y="9" width="12" height="1" rx=".5" fill={s} opacity=".15" />
        </svg>
      );
    case "hero":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="1" y="1" width="18" height="14" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="5" y="5" width="10" height="1.5" rx=".5" fill={s} opacity=".35" />
          <rect x="7" y="8" width="6" height="1" rx=".5" fill={s} opacity=".15" />
          <rect x="7.5" y="10.5" width="5" height="2.5" rx="1" stroke={s} strokeWidth={sw} />
        </svg>
      );
    case "section":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="1" y="1" width="18" height="14" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="3" y="4" width="6" height="1" rx=".5" fill={s} opacity=".3" />
          <rect x="3" y="6.5" width="14" height="1" rx=".5" fill={s} opacity=".15" />
          <rect x="3" y="9" width="10" height="1" rx=".5" fill={s} opacity=".15" />
        </svg>
      );
    case "sidebar":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="1" y="1" width="7" height="14" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="2.5" y="4" width="4" height="1" rx=".5" fill={s} opacity=".3" />
          <rect x="2.5" y="6.5" width="3.5" height="1" rx=".5" fill={s} opacity=".15" />
          <rect x="2.5" y="9" width="4" height="1" rx=".5" fill={s} opacity=".15" />
        </svg>
      );
    case "footer":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="1" y="7" width="18" height="8" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="3" y="9.5" width="4" height="1" rx=".5" fill={s} opacity=".25" />
          <rect x="9" y="9.5" width="4" height="1" rx=".5" fill={s} opacity=".25" />
          <rect x="15" y="9.5" width="3" height="1" rx=".5" fill={s} opacity=".2" />
        </svg>
      );
    case "modal":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="3" y="2" width="14" height="12" rx="1.5" stroke={s} strokeWidth={sw} />
          <rect x="5" y="4.5" width="7" height="1" rx=".5" fill={s} opacity=".3" />
          <rect x="5" y="7" width="10" height="1" rx=".5" fill={s} opacity=".15" />
          <rect x="11" y="11" width="5" height="2" rx=".75" stroke={s} strokeWidth={sw} />
        </svg>
      );
    case "divider":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <line x1="2" y1="8" x2="18" y2="8" stroke={s} strokeWidth="0.5" opacity=".3" />
        </svg>
      );
    case "card":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="1" width="16" height="14" rx="1.5" stroke={s} strokeWidth={sw} />
          <rect x="2" y="1" width="16" height="5.5" rx="1" fill={s} opacity=".04" />
          <rect x="4" y="8.5" width="8" height="1" rx=".5" fill={s} opacity=".25" />
          <rect x="4" y="11" width="11" height="1" rx=".5" fill={s} opacity=".12" />
        </svg>
      );
    case "text":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="4" width="14" height="1.5" rx=".5" fill={s} opacity=".3" />
          <rect x="2" y="7" width="11" height="1" rx=".5" fill={s} opacity=".15" />
          <rect x="2" y="9.5" width="13" height="1" rx=".5" fill={s} opacity=".15" />
          <rect x="2" y="12" width="8" height="1" rx=".5" fill={s} opacity=".12" />
        </svg>
      );
    case "image":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="2" width="16" height="12" rx="1" stroke={s} strokeWidth={sw} />
          <line x1="2" y1="2" x2="18" y2="14" stroke={s} strokeWidth=".3" opacity=".25" />
          <line x1="18" y1="2" x2="2" y2="14" stroke={s} strokeWidth=".3" opacity=".25" />
        </svg>
      );
    case "video":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="2" width="16" height="12" rx="1" stroke={s} strokeWidth={sw} />
          <path d="M8.5 5.5v5l4.5-2.5z" stroke={s} strokeWidth={sw} fill={s} opacity=".15" />
        </svg>
      );
    case "table":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="1" y="2" width="18" height="12" rx="1" stroke={s} strokeWidth={sw} />
          <line x1="1" y1="5.5" x2="19" y2="5.5" stroke={s} strokeWidth=".3" opacity=".25" />
          <line x1="1" y1="9" x2="19" y2="9" stroke={s} strokeWidth=".3" opacity=".25" />
          <line x1="7" y1="2" x2="7" y2="14" stroke={s} strokeWidth=".3" opacity=".25" />
          <line x1="13" y1="2" x2="13" y2="14" stroke={s} strokeWidth=".3" opacity=".25" />
        </svg>
      );
    case "grid":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="1.5" y="2" width="7" height="5.5" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="11.5" y="2" width="7" height="5.5" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="1.5" y="9.5" width="7" height="5.5" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="11.5" y="9.5" width="7" height="5.5" rx="1" stroke={s} strokeWidth={sw} />
        </svg>
      );
    case "list":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <circle cx="3.5" cy="4.5" r="1" stroke={s} strokeWidth={sw} />
          <rect x="6.5" y="4" width="10" height="1" rx=".5" fill={s} opacity=".2" />
          <circle cx="3.5" cy="8" r="1" stroke={s} strokeWidth={sw} />
          <rect x="6.5" y="7.5" width="8" height="1" rx=".5" fill={s} opacity=".2" />
          <circle cx="3.5" cy="11.5" r="1" stroke={s} strokeWidth={sw} />
          <rect x="6.5" y="11" width="11" height="1" rx=".5" fill={s} opacity=".2" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="3" y="9" width="2.5" height="4" rx=".5" fill={s} opacity=".2" />
          <rect x="7" y="6" width="2.5" height="7" rx=".5" fill={s} opacity=".25" />
          <rect x="11" y="3" width="2.5" height="10" rx=".5" fill={s} opacity=".3" />
          <rect x="15" y="5" width="2.5" height="8" rx=".5" fill={s} opacity=".2" />
        </svg>
      );
    case "accordion":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="1.5" y="2" width="17" height="4" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="3" y="3.5" width="6" height="1" rx=".5" fill={s} opacity=".25" />
          <rect x="1.5" y="7.5" width="17" height="3" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="1.5" y="12" width="17" height="3" rx="1" stroke={s} strokeWidth={sw} />
        </svg>
      );
    case "carousel":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="3" y="2" width="14" height="10" rx="1" stroke={s} strokeWidth={sw} />
          <path d="M1.5 7L3 8.5 1.5 10" stroke={s} strokeWidth={sw} opacity=".35" />
          <path d="M18.5 7L17 8.5 18.5 10" stroke={s} strokeWidth={sw} opacity=".35" />
          <circle cx="8.5" cy="14" r=".6" fill={s} opacity=".35" />
          <circle cx="10" cy="14" r=".6" fill={s} opacity=".15" />
          <circle cx="11.5" cy="14" r=".6" fill={s} opacity=".15" />
        </svg>
      );
    case "button":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="3" y="5" width="14" height="6" rx="2" stroke={s} strokeWidth={sw} />
          <rect x="6.5" y="7.5" width="7" height="1" rx=".5" fill={s} opacity=".25" />
        </svg>
      );
    case "input":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="4" width="5.5" height="1" rx=".5" fill={s} opacity=".25" />
          <rect x="2" y="6.5" width="16" height="5.5" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="3.5" y="8.5" width="7" height="1" rx=".5" fill={s} opacity=".12" />
        </svg>
      );
    case "search":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="4.5" width="16" height="7" rx="3.5" stroke={s} strokeWidth={sw} />
          <circle cx="6" cy="8" r="2" stroke={s} strokeWidth={sw} opacity=".3" />
          <line x1="7.5" y1="9.5" x2="9" y2="11" stroke={s} strokeWidth={sw} opacity=".3" />
          <rect x="9.5" y="7.5" width="6" height="1" rx=".5" fill={s} opacity=".12" />
        </svg>
      );
    case "form":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="1.5" width="5.5" height="1" rx=".5" fill={s} opacity=".25" />
          <rect x="2" y="3.5" width="16" height="3" rx=".75" stroke={s} strokeWidth={sw} />
          <rect x="2" y="8" width="7" height="1" rx=".5" fill={s} opacity=".25" />
          <rect x="2" y="10" width="16" height="3" rx=".75" stroke={s} strokeWidth={sw} />
          <rect x="12" y="14" width="6" height="2" rx=".75" stroke={s} strokeWidth={sw} />
        </svg>
      );
    case "tabs":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="1" y="5" width="18" height="10" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="1" y="2" width="6" height="3.5" rx=".75" stroke={s} strokeWidth={sw} />
          <rect x="2.5" y="3.25" width="3" height="1" rx=".5" fill={s} opacity=".25" />
          <rect x="7" y="2" width="6" height="3.5" rx=".75" stroke={s} strokeWidth={sw} />
        </svg>
      );
    case "dropdown":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="2" width="16" height="4" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="3.5" y="3.5" width="7" height="1" rx=".5" fill={s} opacity=".2" />
          <path d="M15 3.5l1.5 1.5L18 3.5" stroke={s} strokeWidth={sw} opacity=".3" />
          <rect x="2" y="7" width="16" height="7" rx="1" stroke={s} strokeWidth={sw} strokeDasharray="2 1" opacity=".3" />
        </svg>
      );
    case "toggle":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="4" y="5" width="12" height="6" rx="3" stroke={s} strokeWidth={sw} />
          <circle cx="13" cy="8" r="2" fill={s} opacity=".3" />
        </svg>
      );
    case "avatar":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <circle cx="10" cy="8" r="6" stroke={s} strokeWidth={sw} />
          <circle cx="10" cy="6.5" r="2" stroke={s} strokeWidth={sw} />
          <path d="M6.5 13c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5" stroke={s} strokeWidth={sw} />
        </svg>
      );
    case "badge":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="3" y="5" width="14" height="6" rx="3" stroke={s} strokeWidth={sw} />
          <rect x="6" y="7.5" width="8" height="1" rx=".5" fill={s} opacity=".25" />
        </svg>
      );
    case "breadcrumb":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="1.5" y="7" width="3.5" height="1" rx=".5" fill={s} opacity=".3" />
          <path d="M6.5 7l1 1-1 1" stroke={s} strokeWidth={sw} opacity=".2" />
          <rect x="9" y="7" width="3.5" height="1" rx=".5" fill={s} opacity=".2" />
          <path d="M14 7l1 1-1 1" stroke={s} strokeWidth={sw} opacity=".2" />
          <rect x="16.5" y="7" width="2" height="1" rx=".5" fill={s} opacity=".15" />
        </svg>
      );
    case "pagination":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="5.5" width="3.5" height="5" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="6.5" y="5.5" width="3.5" height="5" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="11" y="5.5" width="3.5" height="5" rx="1" fill={s} opacity=".15" stroke={s} strokeWidth={sw} />
          <rect x="15.5" y="5.5" width="3.5" height="5" rx="1" stroke={s} strokeWidth={sw} />
        </svg>
      );
    case "progress":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="7" width="16" height="2" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="2" y="7" width="10" height="2" rx="1" fill={s} opacity=".2" />
        </svg>
      );
    case "toast":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="4" width="16" height="8" rx="1.5" stroke={s} strokeWidth={sw} />
          <circle cx="5" cy="8" r="1.5" stroke={s} strokeWidth={sw} opacity=".3" />
          <rect x="8" y="6.5" width="7" height="1" rx=".5" fill={s} opacity=".25" />
          <rect x="8" y="9" width="5" height="1" rx=".5" fill={s} opacity=".12" />
        </svg>
      );
    case "tooltip":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="3" y="3" width="14" height="7" rx="1.5" stroke={s} strokeWidth={sw} />
          <rect x="5.5" y="5.5" width="9" height="1" rx=".5" fill={s} opacity=".25" />
          <path d="M9 10l1 2.5 1-2.5" stroke={s} strokeWidth={sw} />
        </svg>
      );
    case "pricing":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="1" width="16" height="14" rx="1.5" stroke={s} strokeWidth={sw} />
          <rect x="6" y="3" width="8" height="1.5" rx=".5" fill={s} opacity=".25" />
          <rect x="7" y="5.5" width="6" height="2" rx=".5" fill={s} opacity=".15" />
          <rect x="5" y="9" width="10" height="1" rx=".5" fill={s} opacity=".1" />
          <rect x="5" y="11" width="10" height="1" rx=".5" fill={s} opacity=".1" />
          <rect x="6" y="13" width="8" height="1.5" rx=".5" fill={s} opacity=".2" />
        </svg>
      );
    case "testimonial":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="1" width="16" height="14" rx="1.5" stroke={s} strokeWidth={sw} />
          <text x="4" y="5.5" fontSize="4" fill={s} opacity=".2" fontFamily="serif">&ldquo;</text>
          <rect x="4" y="7" width="12" height="1" rx=".5" fill={s} opacity=".15" />
          <rect x="4" y="9" width="9" height="1" rx=".5" fill={s} opacity=".12" />
          <circle cx="5.5" cy="12.5" r="1.5" stroke={s} strokeWidth={sw} opacity=".25" />
          <rect x="8" y="12" width="5" height="1" rx=".5" fill={s} opacity=".15" />
        </svg>
      );
    case "cta":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="1" y="2" width="18" height="12" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="5" y="4.5" width="10" height="1.5" rx=".5" fill={s} opacity=".3" />
          <rect x="6" y="7.5" width="8" height="1" rx=".5" fill={s} opacity=".15" />
          <rect x="7" y="10" width="6" height="2.5" rx="1" stroke={s} strokeWidth={sw} />
        </svg>
      );
    case "alert":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="4" width="16" height="8" rx="1.5" stroke={s} strokeWidth={sw} />
          <circle cx="6" cy="8" r="2" stroke={s} strokeWidth={sw} opacity=".3" />
          <line x1="6" y1="7" x2="6" y2="8.5" stroke={s} strokeWidth="0.6" opacity=".5" />
          <circle cx="6" cy="9.3" r=".3" fill={s} opacity=".5" />
          <rect x="9.5" y="7" width="6" height="1" rx=".5" fill={s} opacity=".2" />
        </svg>
      );
    case "banner":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="1" y="5" width="18" height="6" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="4" y="7.5" width="8" height="1" rx=".5" fill={s} opacity=".25" />
          <rect x="14" y="7" width="3.5" height="2" rx=".75" stroke={s} strokeWidth={sw} />
        </svg>
      );
    case "stat":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="3" y="2" width="14" height="12" rx="1.5" stroke={s} strokeWidth={sw} />
          <rect x="6" y="4.5" width="8" height="1" rx=".5" fill={s} opacity=".15" />
          <rect x="5" y="7" width="10" height="2.5" rx=".5" fill={s} opacity=".3" />
          <rect x="7" y="11" width="6" height="1" rx=".5" fill={s} opacity=".12" />
        </svg>
      );
    case "stepper":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <circle cx="4" cy="8" r="2" fill={s} opacity=".2" stroke={s} strokeWidth={sw} />
          <line x1="6" y1="8" x2="8" y2="8" stroke={s} strokeWidth=".4" opacity=".3" />
          <circle cx="10" cy="8" r="2" stroke={s} strokeWidth={sw} />
          <line x1="12" y1="8" x2="14" y2="8" stroke={s} strokeWidth=".4" opacity=".3" />
          <circle cx="16" cy="8" r="2" stroke={s} strokeWidth={sw} />
        </svg>
      );
    case "tag":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="3" y="5" width="14" height="6" rx="1.5" stroke={s} strokeWidth={sw} />
          <rect x="5.5" y="7.5" width="6" height="1" rx=".5" fill={s} opacity=".25" />
          <line x1="14" y1="6.5" x2="15.5" y2="9.5" stroke={s} strokeWidth={sw} opacity=".2" />
          <line x1="15.5" y1="6.5" x2="14" y2="9.5" stroke={s} strokeWidth={sw} opacity=".2" />
        </svg>
      );
    case "rating":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <path d="M4 5.5l1 2 2.2.3-1.6 1.5.4 2.2L4 10.3l-2 1.2.4-2.2L.8 7.8 3 7.5z" fill={s} opacity=".25" />
          <path d="M10 5.5l1 2 2.2.3-1.6 1.5.4 2.2L10 10.3l-2 1.2.4-2.2L6.8 7.8 9 7.5z" fill={s} opacity=".25" />
          <path d="M16 5.5l1 2 2.2.3-1.6 1.5.4 2.2L16 10.3l-2 1.2.4-2.2-1.6-1.5 2.2-.3z" stroke={s} strokeWidth={sw} opacity=".25" />
        </svg>
      );
    case "map":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="2" width="16" height="12" rx="1" stroke={s} strokeWidth={sw} />
          <line x1="2" y1="6" x2="18" y2="10" stroke={s} strokeWidth=".3" opacity=".15" />
          <line x1="7" y1="2" x2="11" y2="14" stroke={s} strokeWidth=".3" opacity=".15" />
          <path d="M10 5c-1.7 0-3 1.3-3 3 0 2.5 3 5 3 5s3-2.5 3-5c0-1.7-1.3-3-3-3z" fill={s} opacity=".15" stroke={s} strokeWidth={sw} />
        </svg>
      );
    case "timeline":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <line x1="5" y1="2" x2="5" y2="14" stroke={s} strokeWidth=".4" opacity=".25" />
          <circle cx="5" cy="4" r="1.5" fill={s} opacity=".2" stroke={s} strokeWidth={sw} />
          <rect x="8" y="3" width="8" height="1" rx=".5" fill={s} opacity=".25" />
          <circle cx="5" cy="8.5" r="1.5" stroke={s} strokeWidth={sw} />
          <rect x="8" y="7.5" width="6" height="1" rx=".5" fill={s} opacity=".15" />
          <circle cx="5" cy="13" r="1.5" stroke={s} strokeWidth={sw} />
          <rect x="8" y="12" width="7" height="1" rx=".5" fill={s} opacity=".15" />
        </svg>
      );
    case "fileUpload":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="3" y="2" width="14" height="12" rx="1.5" stroke={s} strokeWidth={sw} strokeDasharray="2 1" />
          <path d="M10 10V5.5m0 0L7.5 8m2.5-2.5L12.5 8" stroke={s} strokeWidth={sw} opacity=".3" />
          <rect x="7" y="11.5" width="6" height="1" rx=".5" fill={s} opacity=".15" />
        </svg>
      );
    case "codeBlock":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="2" width="16" height="12" rx="1" stroke={s} strokeWidth={sw} />
          <circle cx="4" cy="4" r=".6" fill={s} opacity=".3" />
          <circle cx="5.5" cy="4" r=".6" fill={s} opacity=".3" />
          <circle cx="7" cy="4" r=".6" fill={s} opacity=".3" />
          <rect x="4" y="7" width="7" height="1" rx=".5" fill={s} opacity=".2" />
          <rect x="6" y="9" width="5" height="1" rx=".5" fill={s} opacity=".15" />
          <rect x="4" y="11" width="8" height="1" rx=".5" fill={s} opacity=".12" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="3" width="16" height="12" rx="1" stroke={s} strokeWidth={sw} />
          <line x1="2" y1="6.5" x2="18" y2="6.5" stroke={s} strokeWidth=".4" opacity=".25" />
          <rect x="5" y="4" width="1" height="1.5" rx=".3" fill={s} opacity=".2" />
          <rect x="14" y="4" width="1" height="1.5" rx=".3" fill={s} opacity=".2" />
          <circle cx="7" cy="9" r=".6" fill={s} opacity=".2" />
          <circle cx="10" cy="9" r=".6" fill={s} opacity=".2" />
          <circle cx="13" cy="9" r=".6" fill={s} opacity=".3" />
          <circle cx="7" cy="12" r=".6" fill={s} opacity=".2" />
          <circle cx="10" cy="12" r=".6" fill={s} opacity=".2" />
        </svg>
      );
    case "notification":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="3" width="16" height="10" rx="1.5" stroke={s} strokeWidth={sw} />
          <circle cx="5.5" cy="8" r="2" stroke={s} strokeWidth={sw} opacity=".25" />
          <rect x="9" y="6" width="6" height="1" rx=".5" fill={s} opacity=".25" />
          <rect x="9" y="8.5" width="4.5" height="1" rx=".5" fill={s} opacity=".12" />
          <circle cx="16.5" cy="4.5" r="1.5" fill={s} opacity=".25" />
        </svg>
      );
    case "productCard":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="3" y="1" width="14" height="14" rx="1.5" stroke={s} strokeWidth={sw} />
          <rect x="3" y="1" width="14" height="6" rx="1" fill={s} opacity=".04" />
          <rect x="5" y="8.5" width="7" height="1" rx=".5" fill={s} opacity=".25" />
          <rect x="5" y="10.5" width="4" height="1.5" rx=".5" fill={s} opacity=".15" />
          <rect x="12" y="12" width="4" height="2" rx=".75" stroke={s} strokeWidth={sw} />
        </svg>
      );
    case "profile":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <circle cx="10" cy="5" r="3" stroke={s} strokeWidth={sw} />
          <rect x="5" y="10" width="10" height="1.5" rx=".5" fill={s} opacity=".25" />
          <rect x="7" y="12.5" width="6" height="1" rx=".5" fill={s} opacity=".12" />
        </svg>
      );
    case "drawer":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="9" y="1" width="10" height="14" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="10.5" y="4" width="5" height="1" rx=".5" fill={s} opacity=".25" />
          <rect x="10.5" y="6.5" width="7" height="1" rx=".5" fill={s} opacity=".15" />
          <rect x="10.5" y="9" width="6" height="1" rx=".5" fill={s} opacity=".15" />
          <rect x="1" y="1" width="7" height="14" rx="1" stroke={s} strokeWidth={sw} opacity=".15" />
        </svg>
      );
    case "popover":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="3" y="2" width="14" height="9" rx="1.5" stroke={s} strokeWidth={sw} />
          <rect x="5" y="4.5" width="8" height="1" rx=".5" fill={s} opacity=".25" />
          <rect x="5" y="7" width="6" height="1" rx=".5" fill={s} opacity=".15" />
          <path d="M9 11l1 2.5 1-2.5" stroke={s} strokeWidth={sw} />
        </svg>
      );
    case "logo":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="3" width="10" height="10" rx="2" stroke={s} strokeWidth={sw} />
          <path d="M5 9.5l2-4 2 4" stroke={s} strokeWidth={sw} opacity=".3" />
          <rect x="14" y="6" width="4" height="1" rx=".5" fill={s} opacity=".2" />
          <rect x="14" y="8.5" width="3" height="1" rx=".5" fill={s} opacity=".12" />
        </svg>
      );
    case "faq":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <text x="2.5" y="5.5" fontSize="4" fill={s} opacity=".3" fontWeight="bold">?</text>
          <rect x="7" y="3" width="10" height="1" rx=".5" fill={s} opacity=".25" />
          <rect x="7" y="5.5" width="8" height="1" rx=".5" fill={s} opacity=".12" />
          <text x="2.5" y="11.5" fontSize="4" fill={s} opacity=".3" fontWeight="bold">?</text>
          <rect x="7" y="9" width="9" height="1" rx=".5" fill={s} opacity=".25" />
          <rect x="7" y="11.5" width="7" height="1" rx=".5" fill={s} opacity=".12" />
        </svg>
      );
    case "gallery":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="1.5" y="1.5" width="5" height="5" rx=".75" stroke={s} strokeWidth={sw} />
          <rect x="7.5" y="1.5" width="5" height="5" rx=".75" stroke={s} strokeWidth={sw} />
          <rect x="13.5" y="1.5" width="5" height="5" rx=".75" stroke={s} strokeWidth={sw} />
          <rect x="1.5" y="9.5" width="5" height="5" rx=".75" stroke={s} strokeWidth={sw} />
          <rect x="7.5" y="9.5" width="5" height="5" rx=".75" stroke={s} strokeWidth={sw} />
          <rect x="13.5" y="9.5" width="5" height="5" rx=".75" stroke={s} strokeWidth={sw} />
        </svg>
      );
    case "checkbox":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="5" y="4" width="8" height="8" rx="1.5" stroke={s} strokeWidth={sw} />
          <path d="M7.5 8l1.5 1.5 3-3" stroke={s} strokeWidth={sw} opacity=".35" />
        </svg>
      );
    case "radio":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <circle cx="10" cy="8" r="4" stroke={s} strokeWidth={sw} />
          <circle cx="10" cy="8" r="2" fill={s} opacity=".3" />
        </svg>
      );
    case "slider":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="7.5" width="16" height="1" rx=".5" fill={s} opacity=".15" />
          <rect x="2" y="7.5" width="10" height="1" rx=".5" fill={s} opacity=".25" />
          <circle cx="12" cy="8" r="2.5" stroke={s} strokeWidth={sw} />
        </svg>
      );
    case "datePicker":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="1" width="16" height="5" rx="1" stroke={s} strokeWidth={sw} />
          <rect x="3.5" y="3" width="5" height="1" rx=".5" fill={s} opacity=".2" />
          <rect x="14" y="2.5" width="2.5" height="2" rx=".5" fill={s} opacity=".12" />
          <rect x="2" y="7" width="16" height="8" rx="1" stroke={s} strokeWidth={sw} strokeDasharray="2 1" opacity=".3" />
          <circle cx="6" cy="10" r=".6" fill={s} opacity=".2" />
          <circle cx="10" cy="10" r=".6" fill={s} opacity=".3" />
          <circle cx="14" cy="10" r=".6" fill={s} opacity=".2" />
          <circle cx="6" cy="13" r=".6" fill={s} opacity=".2" />
          <circle cx="10" cy="13" r=".6" fill={s} opacity=".2" />
        </svg>
      );
    case "skeleton":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="2" width="16" height="3" rx="1" fill={s} opacity=".08" />
          <rect x="2" y="7" width="10" height="2" rx=".75" fill={s} opacity=".08" />
          <rect x="2" y="11" width="13" height="2" rx=".75" fill={s} opacity=".08" />
        </svg>
      );
    case "chip":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="1.5" y="5" width="10" height="6" rx="3" fill={s} opacity=".08" stroke={s} strokeWidth={sw} />
          <rect x="4" y="7.5" width="4" height="1" rx=".5" fill={s} opacity=".25" />
          <line x1="9.5" y1="6.5" x2="10.5" y2="9.5" stroke={s} strokeWidth={sw} opacity=".2" />
          <line x1="10.5" y1="6.5" x2="9.5" y2="9.5" stroke={s} strokeWidth={sw} opacity=".2" />
          <rect x="13" y="5" width="5.5" height="6" rx="3" stroke={s} strokeWidth={sw} opacity=".25" />
        </svg>
      );
    case "icon":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <path d="M10 3l1.5 3 3.5.5-2.5 2.5.5 3.5L10 11l-3 1.5.5-3.5L5 6.5l3.5-.5z" stroke={s} strokeWidth={sw} opacity=".3" />
        </svg>
      );
    case "spinner":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <circle cx="10" cy="8" r="5" stroke={s} strokeWidth={sw} opacity=".12" />
          <path d="M10 3a5 5 0 0 1 5 5" stroke={s} strokeWidth={sw} opacity=".35" strokeLinecap="round" />
        </svg>
      );
    case "feature":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="2" width="5" height="5" rx="1.5" stroke={s} strokeWidth={sw} />
          <path d="M4.5 3.5v3m-1.5-1.5h3" stroke={s} strokeWidth={sw} opacity=".25" />
          <rect x="9" y="2.5" width="8" height="1.5" rx=".5" fill={s} opacity=".25" />
          <rect x="9" y="5.5" width="6" height="1" rx=".5" fill={s} opacity=".12" />
          <rect x="2" y="10" width="5" height="5" rx="1.5" stroke={s} strokeWidth={sw} />
          <rect x="9" y="10.5" width="7" height="1.5" rx=".5" fill={s} opacity=".25" />
          <rect x="9" y="13.5" width="5" height="1" rx=".5" fill={s} opacity=".12" />
        </svg>
      );
    case "team":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <circle cx="5" cy="5" r="2.5" stroke={s} strokeWidth={sw} />
          <rect x="2.5" y="9" width="5" height="1" rx=".5" fill={s} opacity=".2" />
          <circle cx="15" cy="5" r="2.5" stroke={s} strokeWidth={sw} />
          <rect x="12.5" y="9" width="5" height="1" rx=".5" fill={s} opacity=".2" />
          <circle cx="10" cy="5" r="2.5" stroke={s} strokeWidth={sw} opacity=".5" />
          <rect x="7.5" y="9" width="5" height="1" rx=".5" fill={s} opacity=".15" />
          <rect x="4" y="12" width="12" height="1" rx=".5" fill={s} opacity=".1" />
        </svg>
      );
    case "login":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="3" y="1" width="14" height="14" rx="1.5" stroke={s} strokeWidth={sw} />
          <rect x="6" y="3" width="8" height="1.5" rx=".5" fill={s} opacity=".25" />
          <rect x="5" y="5.5" width="10" height="3" rx=".75" stroke={s} strokeWidth={sw} />
          <rect x="5" y="9.5" width="10" height="3" rx=".75" stroke={s} strokeWidth={sw} />
          <rect x="6.5" y="13.5" width="7" height="2" rx=".75" fill={s} opacity=".2" />
        </svg>
      );
    case "contact":
      return (
        <svg viewBox="0 0 20 16" width="20" height="16" fill="none">
          <rect x="2" y="1" width="16" height="14" rx="1.5" stroke={s} strokeWidth={sw} />
          <rect x="4" y="3" width="5" height="1" rx=".5" fill={s} opacity=".2" />
          <rect x="4" y="5" width="12" height="2.5" rx=".75" stroke={s} strokeWidth={sw} />
          <rect x="4" y="8.5" width="12" height="4" rx=".75" stroke={s} strokeWidth={sw} />
          <rect x="11" y="13.5" width="5" height="1.5" rx=".5" fill={s} opacity=".2" />
        </svg>
      );
    default:
      return null;
  }
}

// =============================================================================
// Shared Component Grid (reusable)
// =============================================================================

type ComponentGridProps = {
  activeType: ComponentType | null;
  onSelect: (type: ComponentType) => void;
  onDragStart: (type: ComponentType, e: React.MouseEvent) => void;
  scrollRef?: React.Ref<HTMLDivElement>;
  fadeClass?: string;
  blankCanvas?: boolean;
};

export function ComponentGrid({ activeType, onSelect, onDragStart, scrollRef, fadeClass, blankCanvas }: ComponentGridProps) {
  return (
    <div ref={scrollRef} className={`${styles.placeScroll} ${fadeClass || ""}`}>
      {COMPONENT_REGISTRY.map((section) => (
        <div key={section.section} className={styles.paletteSection}>
          <div className={styles.paletteSectionTitle}>{section.section}</div>
          {section.items.map((item) => (
            <div
              key={item.type}
              className={`${styles.paletteItem} ${activeType === item.type ? styles.active : ""} ${blankCanvas ? styles.wireframe : ""}`}
              onClick={() => onSelect(item.type)}
              onMouseDown={(e) => {
                if (e.button === 0) onDragStart(item.type, e);
              }}
            >
              <div className={styles.paletteItemIcon}>
                <PaletteIconSvg type={item.type} />
              </div>
              <span className={styles.paletteItemLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Palette Component
// =============================================================================

// Rolling number animation (old exits, new enters from opposite direction)
// When suffix changes (e.g. "Change" → "Changes"), the whole label rolls.
// When only the number changes, just the number rolls.
function RollingCount({ value, suffix }: { value: number; suffix?: string }) {
  const [prev, setPrev] = useState<number | null>(null);
  const [prevSuffix, setPrevSuffix] = useState(suffix);
  const [dir, setDir] = useState<"up" | "down">("up");
  const cur = useRef(value);
  const curSuffix = useRef(suffix);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const suffixChanged = prev !== null && prevSuffix !== suffix;

  useEffect(() => {
    if (value !== cur.current) {
      // Skip animation when hitting 0 — footer is about to collapse anyway
      if (value === 0) {
        cur.current = value;
        curSuffix.current = suffix;
        setPrev(null);
        return;
      }
      setDir(value > cur.current ? "up" : "down");
      setPrev(cur.current);
      setPrevSuffix(curSuffix.current);
      cur.current = value;
      curSuffix.current = suffix;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setPrev(null), 250);
    } else {
      curSuffix.current = suffix;
    }
  }, [value, suffix]);

  if (prev === null) return <>{value}{suffix ? ` ${suffix}` : ""}</>;

  if (suffixChanged) {
    // Suffix changed — roll the whole label
    return (
      <span className={styles.rollingWrap}>
        <span style={{ visibility: "hidden" }}>{value} {suffix}</span>
        <span key={`o${prev}-${value}`} className={`${styles.rollingNum} ${dir === "up" ? styles.exitUp : styles.exitDown}`}>{prev} {prevSuffix}</span>
        <span key={`n${value}`} className={`${styles.rollingNum} ${dir === "up" ? styles.enterUp : styles.enterDown}`}>{value} {suffix}</span>
      </span>
    );
  }

  // Only number changed — roll just the number
  return (
    <>
      <span className={styles.rollingWrap}>
        <span style={{ visibility: "hidden" }}>{value}</span>
        <span key={`o${prev}-${value}`} className={`${styles.rollingNum} ${dir === "up" ? styles.exitUp : styles.exitDown}`}>{prev}</span>
        <span key={`n${value}`} className={`${styles.rollingNum} ${dir === "up" ? styles.enterUp : styles.enterDown}`}>{value}</span>
      </span>
      {suffix ? ` ${suffix}` : ""}
    </>
  );
}

type DesignPaletteProps = {
  activeType: ComponentType | null;
  onSelect: (type: ComponentType) => void;
  isDarkMode: boolean;
  //
  sectionCount: number;
  onDetectSections: () => void;
  visible: boolean;
  onExited?: () => void;
  placementCount: number;
  onClearPlacements: () => void;
  onDragStart: (type: ComponentType, e: React.MouseEvent) => void;
  blankCanvas: boolean;
  onBlankCanvasChange: (on: boolean) => void;
  wireframePurpose: string;
  onWireframePurposeChange: (purpose: string) => void;
  Tooltip?: React.ComponentType<{ content: string; children: React.ReactNode }>;
};

export function DesignPalette({
  activeType,
  onSelect,
  isDarkMode,
  sectionCount,
  onDetectSections,
  visible,
  onExited,
  placementCount,
  onClearPlacements,
  onDragStart,
  blankCanvas,
  onBlankCanvasChange,
  wireframePurpose,
  onWireframePurposeChange,
  Tooltip,
}: DesignPaletteProps) {
  const [mounted, setMounted] = useState(false);
  const [animClass, setAnimClass] = useState<"enter" | "exit">("exit");
  const [footerVisible, setFooterVisible] = useState(false);
  const [footerCollapsed, setFooterCollapsed] = useState(true);
  const lastFooterCount = useRef(0);
  const lastFooterSuffix = useRef("");
  const rafRef = useRef(0);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const placeScrollRef = useRef<HTMLDivElement>(null);
  const [placeFade, setPlaceFade] = useState("");

  useEffect(() => {
    if (visible) {
      setMounted(true);
      clearTimeout(exitTimerRef.current);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          setAnimClass("enter");
        });
      });
    } else {
      cancelAnimationFrame(rafRef.current);
      setAnimClass("exit");
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = setTimeout(() => {
        setMounted(false);
        onExited?.();
      }, 200);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  // Animate footer in/out based on whether there's anything to show
  const hasFooterContent = placementCount > 0 || sectionCount > 0;
  const totalCount = placementCount + sectionCount;
  if (totalCount > 0) {
    lastFooterCount.current = totalCount;
    lastFooterSuffix.current = blankCanvas ? (totalCount === 1 ? "Component" : "Components") : (totalCount === 1 ? "Change" : "Changes");
  }
  useEffect(() => {
    if (hasFooterContent) {
      if (!footerVisible) {
        setFooterCollapsed(true);
        setFooterVisible(true);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setFooterCollapsed(false);
          });
        });
      } else {
        setFooterCollapsed(false);
      }
    } else {
      setFooterCollapsed(true);
      const t = setTimeout(() => setFooterVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [hasFooterContent]);

  // Scroll fade
  useEffect(() => {
    if (!mounted) return;
    const el = placeScrollRef.current;
    if (!el) return;
    const update = () => setPlaceFade(scrollFadeClass(el));
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", update); ro.disconnect(); };
  }, [mounted]);

  if (!mounted) return null;

  // Build footer status text
  const footerParts: string[] = [];
  if (placementCount > 0) footerParts.push("placed");
  if (sectionCount > 0) footerParts.push("captured");

  return (
    <div
      className={`${styles.palette} ${styles[animClass]} ${!isDarkMode ? styles.light : ""}`}
      data-feedback-toolbar
      data-agentation-palette
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTransitionEnd={(e) => {
        if (e.target !== e.currentTarget) return;
        if (!visible) {
          clearTimeout(exitTimerRef.current);
          setMounted(false);
          setAnimClass("exit");
          onExited?.();
        }
      }}
    >
      {/* Panel header — fixed title with description */}
      <div className={styles.paletteHeader}>
        <div className={styles.paletteHeaderTitle}>Layout Mode</div>
        <div className={styles.paletteHeaderDesc}>
          Rearrange and resize existing elements, add new components, and explore layout ideas. Agent results may vary.{" "}
          <a href="https://agentation.dev/features#layout-mode" target="_blank" rel="noopener noreferrer">Learn more.</a>
        </div>
      </div>

      {/* Wireframe toggle */}
      <div
        className={`${styles.canvasToggle} ${blankCanvas ? styles.active : ""}`}
        onClick={() => onBlankCanvasChange(!blankCanvas)}
      >
        <span className={styles.canvasToggleIcon}>
          <svg viewBox="0 0 14 14" width="14" height="14" fill="none">
            <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1" />
            <circle cx="4.5" cy="4.5" r="0.8" fill="currentColor" opacity=".6" />
            <circle cx="7" cy="4.5" r="0.8" fill="currentColor" opacity=".6" />
            <circle cx="9.5" cy="4.5" r="0.8" fill="currentColor" opacity=".6" />
            <circle cx="4.5" cy="7" r="0.8" fill="currentColor" opacity=".6" />
            <circle cx="7" cy="7" r="0.8" fill="currentColor" opacity=".6" />
            <circle cx="9.5" cy="7" r="0.8" fill="currentColor" opacity=".6" />
            <circle cx="4.5" cy="9.5" r="0.8" fill="currentColor" opacity=".6" />
            <circle cx="7" cy="9.5" r="0.8" fill="currentColor" opacity=".6" />
            <circle cx="9.5" cy="9.5" r="0.8" fill="currentColor" opacity=".6" />
          </svg>
        </span>
        <span className={styles.canvasToggleLabel}>Wireframe New Page</span>
      </div>
      {/* Wireframe purpose textarea — only when wireframe active */}
      <div className={`${styles.wireframePurposeWrap} ${!blankCanvas ? styles.collapsed : ""}`}>
        <div className={styles.wireframePurposeInner}>
          <textarea
            className={styles.wireframePurposeInput}
            placeholder="Describe this page to provide additional context for your agent."
            value={wireframePurpose}
            onChange={(e) => onWireframePurposeChange(e.target.value)}
            rows={2}
          />
        </div>
      </div>

      {/* Component grid — always visible */}
      <ComponentGrid
        activeType={activeType}
        onSelect={onSelect}
        onDragStart={onDragStart}
        scrollRef={placeScrollRef}
        fadeClass={placeFade}
        blankCanvas={blankCanvas}
      />

      {/* Footer: change count + clear */}
      {footerVisible && (
        <div className={`${styles.paletteFooterWrap} ${footerCollapsed ? styles.footerHidden : ""}`}>
          <div className={styles.paletteFooterInner}>
            <div className={styles.paletteFooterInnerContent}>
              <div className={styles.paletteFooter}>
                <span className={styles.paletteFooterCount}>
                  <RollingCount value={lastFooterCount.current} suffix={lastFooterSuffix.current} />
                </span>
                <button className={styles.paletteFooterClear} onClick={onClearPlacements}>
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
