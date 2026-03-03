import "./process-shim";
import { createRoot, type Root } from "react-dom/client";

import { PageFeedbackToolbarCSS, type AgentationProps } from "./components/page-toolbar-css";

const CONTAINER_ID = "agentation-browser-root";
const BROWSER_ERROR =
  "Agentation browser entrypoint requires a DOM environment. Load it in a browser and call mount() after document is available.";

export type AgentationBrowserHandle = {
  update(nextProps?: AgentationProps): void;
  destroy(): void;
};

type AgentationBrowserGlobal = {
  mount(props?: AgentationProps): AgentationBrowserHandle;
  version: string;
};

declare global {
  interface Window {
    Agentation?: AgentationBrowserGlobal;
  }
}

let root: Root | null = null;
let container: HTMLDivElement | null = null;
let currentProps: AgentationProps = {};
let currentHandle: AgentationBrowserHandle | null = null;

function assertBrowser() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error(BROWSER_ERROR);
  }
}

function ensureContainer(): HTMLDivElement {
  assertBrowser();

  if (container && document.body.contains(container)) {
    return container;
  }

  const existing = document.getElementById(CONTAINER_ID);
  if (existing instanceof HTMLDivElement) {
    container = existing;
  } else {
    container = document.createElement("div");
    container.id = CONTAINER_ID;
    document.body.appendChild(container);
  }

  container.style.display = "contents";
  container.setAttribute("aria-hidden", "true");

  return container;
}

function renderToolbar() {
  if (!root) {
    root = createRoot(ensureContainer());
  }

  root.render(<PageFeedbackToolbarCSS {...currentProps} />);
}

function cleanup() {
  if (root) {
    root.unmount();
    root = null;
  }

  if (container) {
    container.remove();
    container = null;
  }

  currentProps = {};
  currentHandle = null;
}

export function mountAgentation(props: AgentationProps = {}): AgentationBrowserHandle {
  assertBrowser();

  currentProps = props;
  renderToolbar();

  if (currentHandle) {
    return currentHandle;
  }

  const handle: AgentationBrowserHandle = {
    update(nextProps: AgentationProps = {}) {
      if (currentHandle !== handle) {
        return;
      }
      currentProps = nextProps;
      renderToolbar();
    },
    destroy() {
      if (currentHandle !== handle) {
        return;
      }
      cleanup();
    },
  };

  currentHandle = handle;

  return handle;
}

export const mount = mountAgentation;
export const version = __VERSION__;

if (typeof window !== "undefined") {
  window.Agentation = {
    mount: mountAgentation,
    version,
  };
}
