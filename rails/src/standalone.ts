/**
 * Agentation Standalone Entry Point
 *
 * Bundles React + Agentation into a single self-executing script.
 * Used by the agentation-rails gem — Rails developers never see React.
 *
 * Dispatches CustomEvents on document so Rails developers can listen
 * with Stimulus controllers or plain JS:
 *
 *   document.addEventListener("agentation:add", (e) => { ... })
 *   document.addEventListener("agentation:delete", (e) => { ... })
 *   document.addEventListener("agentation:update", (e) => { ... })
 *   document.addEventListener("agentation:clear", (e) => { ... })
 *   document.addEventListener("agentation:copy", (e) => { ... })
 *   document.addEventListener("agentation:submit", (e) => { ... })
 *   document.addEventListener("agentation:session", (e) => { ... })
 */
import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { PageFeedbackToolbarCSS } from "agentation";
import type { Annotation } from "agentation";

let root: Root | null = null;
let container: HTMLElement | null = null;

function dispatch(name: string, detail: unknown) {
  document.dispatchEvent(
    new CustomEvent(`agentation:${name}`, { detail, bubbles: true })
  );
}

function getConfig(): Record<string, string> {
  const config: Record<string, string> = {};
  const el = document.getElementById("agentation-config");
  if (el) {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith("data-")) {
        const key = attr.name
          .slice(5)
          .replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
        config[key] = attr.value;
      }
    }
  }
  return config;
}

function mount() {
  if (container) return;

  const config = getConfig();

  container = document.createElement("div");
  container.id = "agentation-root";
  document.body.appendChild(container);

  const props: Record<string, unknown> = {
    endpoint: config.endpoint || undefined,
    sessionId: config.sessionId || undefined,
    webhookUrl: config.webhookUrl || undefined,

    onAnnotationAdd: (a: Annotation) => dispatch("add", a),
    onAnnotationDelete: (a: Annotation) => dispatch("delete", a),
    onAnnotationUpdate: (a: Annotation) => dispatch("update", a),
    onAnnotationsClear: (cleared: Annotation[]) => dispatch("clear", cleared),
    onCopy: (markdown: string) => dispatch("copy", { markdown }),
    onSubmit: (output: string, annotations: Annotation[]) =>
      dispatch("submit", { output, annotations }),
    onSessionCreated: (sessionId: string) =>
      dispatch("session", { sessionId }),
  };

  if (config.copyToClipboard === "false") {
    props.copyToClipboard = false;
  }

  root = createRoot(container);
  root.render(React.createElement(PageFeedbackToolbarCSS, props));
}

function unmount() {
  if (root) {
    root.unmount();
    root = null;
  }
  if (container) {
    container.remove();
    container = null;
  }
}

// Auto-mount on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}

// Clean up before Turbo caches the page
document.addEventListener("turbo:before-cache", unmount);

// Re-mount on Turbo navigation
document.addEventListener("turbo:load", mount);

// Expose for manual control if needed
(window as any).__agentation = { mount, unmount };
