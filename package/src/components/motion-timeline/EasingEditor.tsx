"use client";

import React from "react";

// =============================================================================
// EasingEditor
// =============================================================================
// A small SVG cubic-bezier curve visualizer (80×60px).
// Parses the CSS easing string and renders the bezier path.
// Display-only for v1 — no interactive editing.
// =============================================================================

interface EasingEditorProps {
  value: string;
}

// Map CSS keyword easings to their cubic-bezier control points
const EASING_MAP: Record<string, [number, number, number, number]> = {
  ease: [0.25, 0.1, 0.25, 1.0],
  "ease-in": [0.42, 0.0, 1.0, 1.0],
  "ease-out": [0.0, 0.0, 0.58, 1.0],
  "ease-in-out": [0.42, 0.0, 0.58, 1.0],
  linear: [0.0, 0.0, 1.0, 1.0],
};

function parseCubicBezier(easing: string): [number, number, number, number] {
  const normalized = easing.trim().toLowerCase();

  // Check keyword
  if (EASING_MAP[normalized]) {
    return EASING_MAP[normalized];
  }

  // Parse cubic-bezier(x1, y1, x2, y2)
  const match = normalized.match(
    /cubic-bezier\s*\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/
  );
  if (match) {
    return [
      parseFloat(match[1]),
      parseFloat(match[2]),
      parseFloat(match[3]),
      parseFloat(match[4]),
    ];
  }

  // Fallback to linear
  return [0, 0, 1, 1];
}

// Evaluate cubic bezier at parameter t (0–1) using De Casteljau
// P0=(0,0), P1=(x1,y1), P2=(x2,y2), P3=(1,1)
function cubicBezierPoint(
  t: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): [number, number] {
  const mt = 1 - t;
  const x =
    mt * mt * mt * 0 +
    3 * mt * mt * t * x1 +
    3 * mt * t * t * x2 +
    t * t * t * 1;
  const y =
    mt * mt * mt * 0 +
    3 * mt * mt * t * y1 +
    3 * mt * t * t * y2 +
    t * t * t * 1;
  return [x, y];
}

export function EasingEditor({ value }: EasingEditorProps) {
  const W = 80;
  const H = 60;
  const PAD = 8;

  const plotW = W - PAD * 2;
  const plotH = H - PAD * 2;

  const [x1, y1, x2, y2] = parseCubicBezier(value);

  // Build SVG path by sampling 40 points along the bezier curve
  const steps = 40;
  const points: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const [bx, by] = cubicBezierPoint(t, x1, y1, x2, y2);
    // Map from [0,1]x[0,1] to SVG coords, Y is flipped (SVG origin is top-left)
    const px = PAD + bx * plotW;
    const py = PAD + (1 - by) * plotH;
    points.push(`${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`);
  }

  const curvePath = points.join(" ");

  // Control point handles
  const cp1x = PAD + x1 * plotW;
  const cp1y = PAD + (1 - y1) * plotH;
  const cp2x = PAD + x2 * plotW;
  const cp2y = PAD + (1 - y2) * plotH;
  const startX = PAD;
  const startY = PAD + plotH;
  const endX = PAD + plotW;
  const endY = PAD;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ display: "block", flexShrink: 0 }}
      aria-hidden="true"
    >
      {/* Grid lines */}
      <line
        x1={PAD}
        y1={PAD}
        x2={PAD + plotW}
        y2={PAD}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      <line
        x1={PAD}
        y1={PAD + plotH / 2}
        x2={PAD + plotW}
        y2={PAD + plotH / 2}
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1"
        strokeDasharray="2,3"
      />
      <line
        x1={PAD}
        y1={PAD + plotH}
        x2={PAD + plotW}
        y2={PAD + plotH}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      <line
        x1={PAD}
        y1={PAD}
        x2={PAD}
        y2={PAD + plotH}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />
      <line
        x1={PAD + plotW}
        y1={PAD}
        x2={PAD + plotW}
        y2={PAD + plotH}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1"
      />

      {/* Control point handle lines */}
      <line
        x1={startX}
        y1={startY}
        x2={cp1x}
        y2={cp1y}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        strokeDasharray="2,2"
      />
      <line
        x1={endX}
        y1={endY}
        x2={cp2x}
        y2={cp2y}
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
        strokeDasharray="2,2"
      />

      {/* The bezier curve */}
      <path
        d={curvePath}
        fill="none"
        stroke="#6366f1"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Control point dots */}
      <circle cx={cp1x} cy={cp1y} r="2.5" fill="rgba(99,102,241,0.6)" />
      <circle cx={cp2x} cy={cp2y} r="2.5" fill="rgba(99,102,241,0.6)" />

      {/* Start and end anchor dots */}
      <circle cx={startX} cy={startY} r="2" fill="rgba(255,255,255,0.4)" />
      <circle cx={endX} cy={endY} r="2" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}
