import { createSignal, onMount, onCleanup, Show, lazy } from "solid-js";
import { clientOnly } from "@solidjs/start";
import type { DemoAnnotation } from "agentation/solid";

// Lazy load Agentation component (client-only due to DOM APIs)
const Agentation = clientOnly(() => import("agentation/solid").then(m => ({ default: m.Agentation })));

// Example annotations that animate in on page load
const demoAnnotations: DemoAnnotation[] = [
  {
    selector: ".demo-button",
    comment:
      "Try clicking this button - you can annotate any element on the page!",
  },
  {
    selector: ".demo-card h3",
    comment: "Annotations work on text elements too",
  },
  {
    selector: ".feature-item",
    comment: "Use the pause button to freeze animations before annotating",
  },
];

export function ToolbarProvider() {
  const [isMobile, setIsMobile] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);

  onMount(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    onCleanup(() => window.removeEventListener("resize", checkMobile));
  });

  return (
    <Show when={mounted() && !isMobile()}>
      <Agentation
        demoAnnotations={demoAnnotations}
        demoDelay={1500}
        enableDemoMode
      />
    </Show>
  );
}
