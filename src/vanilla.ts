import React from "react";
import { createRoot } from "react-dom/client";
import { PageFeedbackToolbarCSS } from "./components/page-toolbar-css";

export function init() {
  if (typeof document === "undefined") return;

  const container = document.createElement("div");
  container.id = "agentation-root";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(React.createElement(PageFeedbackToolbarCSS));
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
