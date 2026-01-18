"use client";

import { AgentationCSS } from "agentation";
import type { DemoAnnotation } from "agentation";

// Example annotations that animate in on page load
const demoAnnotations: DemoAnnotation[] = [
  {
    selector: ".demo-button",
    comment: "Try clicking this button - you can annotate any element on the page!",
  },
  {
    selector: ".demo-card h3",
    comment: "Annotations work on text elements too",
  },
  {
    selector: ".slider-circle",
    comment: "Use the pause button to freeze animations before annotating",
  },
];

export function ToolbarProvider() {
  return <AgentationCSS demoAnnotations={demoAnnotations} demoDelay={1500} />;
}
