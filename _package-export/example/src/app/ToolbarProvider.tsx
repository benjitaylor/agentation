"use client";

import { usePathname } from "next/navigation";
import { Agentation, AgentationCSS } from "agentation";
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
  const pathname = usePathname();

  // Use CSS version on the css-version route
  if (pathname === "/css-version") {
    return <AgentationCSS />;
  }

  // Use framer-motion version everywhere else
  return <Agentation demoAnnotations={demoAnnotations} demoDelay={1500} />;
}
