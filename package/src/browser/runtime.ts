import type { Annotation, OutputDetailLevel } from "../types";
import {
  clearAnnotations as clearStoredAnnotations,
  clearDesignPlacements,
  clearRearrangeState,
  clearWireframeState,
  loadAnnotations,
  loadDesignPlacements,
  loadRearrangeState,
  loadSessionId,
  loadWireframeState,
  saveAnnotations,
  saveDesignPlacements,
  saveRearrangeState,
  saveSessionId,
  saveWireframeState,
} from "../utils/storage";
import {
  createSession,
  deleteAnnotation as deleteAnnotationFromServer,
  getSession,
  requestAction,
  syncAnnotation,
  updateAnnotation as updateAnnotationOnServer,
} from "../utils/sync";
import { freeze, unfreeze } from "../utils/freeze-animations";
import { generateOutput } from "../utils/generate-output";
import {
  getAccessibilityInfo,
  getDetailedComputedStyles,
  getElementClasses,
  getFullElementPath,
  getNearbyElements,
  getNearbyText,
  identifyElement,
} from "../utils/element-identification";
import { generateDesignOutput, generateRearrangeOutput } from "../components/design-mode/output";
import {
  COMPONENT_REGISTRY,
  DEFAULT_SIZES,
  type ComponentType,
  type DesignPlacement,
  type DetectedSection,
  type RearrangeState,
} from "../components/design-mode/types";
import { AGENTATION_STYLES } from "./styles";
import type {
  AgentationConfig,
  AgentationController,
  AgentationElement,
  AgentationEvent,
  AgentationEventDetail,
  ElementMetadataAdapter,
} from "./types";

const TAG_NAME = "agentation-overlay";
const instances = new WeakMap<Document, NativeAgentation>();

const COLOR_VALUES: Record<string, string> = {
  blue: "#60a5fa",
  purple: "#c084fc",
  green: "#4ade80",
  orange: "#fb923c",
  red: "#f87171",
};

type ToolbarSettings = {
  outputDetail: OutputDetailLevel;
  autoClearAfterCopy: boolean;
  annotationColorId: string;
  blockInteractions: boolean;
  metadataEnabled: boolean;
  markerClickBehavior: "edit" | "delete";
  webhookUrl: string;
  webhooksEnabled: boolean;
};

const DEFAULT_SETTINGS: ToolbarSettings = {
  outputDetail: "standard",
  autoClearAfterCopy: false,
  annotationColorId: "blue",
  blockInteractions: true,
  metadataEnabled: true,
  markerClickBehavior: "edit",
  webhookUrl: "",
  webhooksEnabled: true,
};

type CollectedTarget = Omit<Annotation, "id" | "comment" | "timestamp">;

type PendingAnnotation = {
  mode: "add" | "edit";
  clientX: number;
  clientY: number;
  draft: string;
  target?: CollectedTarget;
  annotation?: Annotation;
};

type DrawStroke = {
  id: string;
  points: Array<{ x: number; y: number }>;
  color: string;
};

type MoveBackup = {
  element: HTMLElement;
  transform: string;
  transformOrigin: string;
  transition: string;
  position: string;
  zIndex: string;
};

type OverlayDrag =
  | {
      kind: "placement";
      id: string;
      resize: boolean;
      startX: number;
      startY: number;
      original: { x: number; y: number; width: number; height: number };
    }
  | {
      kind: "rearrange";
      id: string;
      resize: boolean;
      startX: number;
      startY: number;
      original: { x: number; y: number; width: number; height: number };
    };

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function createId(prefix = "ann"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function sourceString(annotation: Annotation): string | undefined {
  const source = annotation.framework?.source;
  if (!source) return annotation.sourceFile;
  return [source.file, source.line, source.column]
    .filter((part) => part !== undefined)
    .join(":");
}

function isFixed(element: HTMLElement): boolean {
  let current: HTMLElement | null = element;
  while (current) {
    const position = getComputedStyle(current).position;
    if (position === "fixed" || position === "sticky") return true;
    current = current.parentElement;
  }
  return false;
}

function intersects(a: DOMRect, b: DOMRect): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function uniqueSelector(element: HTMLElement): string {
  if (element.id) return `#${CSS.escape(element.id)}`;
  const parts: string[] = [];
  let current: HTMLElement | null = element;
  while (current && current !== document.body) {
    let part = current.localName;
    const stableClass = [...current.classList].find(
      (name) => name.length > 2 && !/[A-Z0-9_-]{6,}$/.test(name),
    );
    if (stableClass) part += `.${CSS.escape(stableClass)}`;
    const parent: HTMLElement | null = current.parentElement;
    if (parent) {
      const siblings = [...parent.children].filter((child) => child.localName === current!.localName);
      if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(current) + 1})`;
    }
    parts.unshift(part);
    const selector = parts.join(" > ");
    try {
      if (document.querySelectorAll(selector).length === 1) return selector;
    } catch {
      // Keep walking; the final tag-only selector remains useful for output.
    }
    current = parent;
  }
  return parts.join(" > ");
}

function loadSettings(): ToolbarSettings {
  try {
    const parsed = JSON.parse(localStorage.getItem("feedback-toolbar-settings") ?? "null") ?? {};
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      metadataEnabled: parsed.metadataEnabled ?? parsed.reactEnabled ?? true,
      annotationColorId: COLOR_VALUES[parsed.annotationColorId]
        ? parsed.annotationColorId
        : DEFAULT_SETTINGS.annotationColorId,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings: ToolbarSettings): void {
  try {
    localStorage.setItem("feedback-toolbar-settings", JSON.stringify(settings));
  } catch {
    // Settings persistence is optional.
  }
}

function validHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

class NativeAgentation {
  readonly shadow: ShadowRoot;

  private config: AgentationConfig;
  private readonly document: Document;
  private readonly window: Window & typeof globalThis;
  private readonly HTMLElementCtor: typeof HTMLElement;
  private readonly host: AgentationElement;
  private readonly abort: AbortController;
  private readonly style: HTMLStyleElement;
  private readonly blankLayer: HTMLDivElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly overlayLayer: HTMLDivElement;
  private readonly markerLayer: HTMLDivElement;
  private readonly hoverLayer: HTMLDivElement;
  private readonly selectionLayer: HTMLDivElement;
  private readonly panel: HTMLDivElement;
  private readonly popup: HTMLDivElement;
  private readonly toolbar: HTMLDivElement;
  private readonly toast: HTMLDivElement;

  private annotations: Annotation[] = [];
  private pending: PendingAnnotation | null = null;
  private settings = loadSettings();
  private active = false;
  private showMarkers = true;
  private frozen = false;
  private panelMode: "settings" | "layout" | null = null;
  private drawMode = false;
  private designMode = false;
  private blankCanvas = false;
  private activeComponent: ComponentType | null = null;
  private placements: DesignPlacement[] = [];
  private rearrange: RearrangeState = { sections: [], originalOrder: [], detectedAt: Date.now() };
  private wireframePurpose = "";
  private drawStrokes: DrawStroke[] = [];
  private drawing: DrawStroke | null = null;
  private hoverTarget: HTMLElement | null = null;
  private hoverRect: DOMRect | null = null;
  private selectionStart: { x: number; y: number } | null = null;
  private selectionCurrent: { x: number; y: number } | null = null;
  private suppressClickUntil = 0;
  private overlayDrag: OverlayDrag | null = null;
  private rearrangedElements = new Map<string, MoveBackup>();
  private placementRemoteIds = new Map<string, string>();
  private rearrangeRemoteIds = new Map<string, string>();
  private currentSessionId: string | null = null;
  private syncGeneration = 0;
  private destroyed = false;
  private route = "";
  private routeTimer: number | undefined;
  private toastTimer: number | undefined;

  constructor(host: AgentationElement, config: AgentationConfig) {
    this.host = host;
    this.document = host.ownerDocument;
    this.window = (this.document.defaultView ?? window) as Window & typeof globalThis;
    this.abort = new this.window.AbortController();
    this.HTMLElementCtor = (this.window as Window & typeof globalThis).HTMLElement;
    this.config = {};
    this.shadow = host.shadowRoot ?? host.attachShadow({ mode: "open" });

    this.style = this.document.createElement("style");
    this.style.textContent = AGENTATION_STYLES;
    this.blankLayer = this.layer("div", "ag-blank");
    this.canvas = this.layer("canvas", "ag-canvas") as HTMLCanvasElement;
    this.overlayLayer = this.layer("div", "ag-overlays");
    this.markerLayer = this.layer("div", "ag-markers");
    this.hoverLayer = this.layer("div", "ag-hover-layer");
    this.selectionLayer = this.layer("div", "ag-selection-layer");
    this.panel = this.layer("div", "ag-panel");
    this.popup = this.layer("div", "ag-popup");
    this.toolbar = this.layer("div", "ag-toolbar");
    this.toast = this.layer("div", "ag-toast");
    this.toast.hidden = true;
    this.shadow.replaceChildren(
      this.style,
      this.blankLayer,
      this.canvas,
      this.overlayLayer,
      this.markerLayer,
      this.hoverLayer,
      this.selectionLayer,
      this.panel,
      this.popup,
      this.toolbar,
      this.toast,
    );

    this.route = this.pathname();
    this.loadRouteState();
    this.installListeners();
    this.configure(config);
    this.render();
    this.routeTimer = this.window.setInterval(() => this.checkRoute(), 400);

    if (config.enableDemoMode && config.demoAnnotations?.length) {
      this.window.setTimeout(() => this.loadDemoAnnotations(), config.demoDelay ?? 1000);
    }
  }

  configure(config: AgentationConfig): void {
    if (this.destroyed) throw new Error("Agentation instance has been destroyed");
    if (config.endpoint && !validHttpUrl(config.endpoint)) {
      throw new TypeError("Agentation endpoint must be an http(s) URL");
    }
    if (config.webhookUrl && !validHttpUrl(config.webhookUrl)) {
      throw new TypeError("Agentation webhookUrl must be an http(s) URL");
    }
    const previousEndpoint = this.config.endpoint;
    const previousSession = this.config.sessionId;
    this.config = { ...config };
    this.host.className = config.className ?? "";
    if (previousEndpoint !== config.endpoint || previousSession !== config.sessionId) {
      void this.initializeSync();
    }
    this.render();
  }

  getAnnotations(): readonly Annotation[] {
    return this.annotations.map((annotation) => ({ ...annotation }));
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.syncGeneration += 1;
    this.abort.abort();
    if (this.routeTimer !== undefined) this.window.clearInterval(this.routeTimer);
    if (this.toastTimer !== undefined) this.window.clearTimeout(this.toastTimer);
    if (this.frozen) unfreeze();
    this.restoreRearrangedElements();
    instances.delete(this.document);
  }

  private layer<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className: string,
  ): HTMLElementTagNameMap[K] {
    const element = this.document.createElement(tag);
    element.className = className;
    element.setAttribute("data-agentation-ui", "");
    return element;
  }

  private pathname(): string {
    return `${this.window.location.pathname}${this.window.location.search}${this.window.location.hash}`;
  }

  private checkRoute(): void {
    const next = this.pathname();
    if (next === this.route) return;
    this.route = next;
    this.pending = null;
    this.hoverTarget = null;
    this.restoreRearrangedElements();
    this.loadRouteState();
    void this.initializeSync();
    this.render();
  }

  private loadRouteState(): void {
    this.annotations = loadAnnotations<Annotation>(this.route);
    this.placements = loadDesignPlacements<DesignPlacement>(this.route);
    this.rearrange = loadRearrangeState<RearrangeState>(this.route) ?? {
      sections: [],
      originalOrder: [],
      detectedAt: Date.now(),
    };
    const wireframe = loadWireframeState<RearrangeState>(this.route);
    this.wireframePurpose = wireframe?.purpose ?? "";
    this.emitAnnotations("load", this.annotations);
  }

  private saveRouteState(): void {
    saveAnnotations(this.route, this.annotations);
    if (this.blankCanvas) {
      saveWireframeState(this.route, {
        rearrange: this.rearrange,
        placements: this.placements,
        purpose: this.wireframePurpose,
      });
      return;
    }
    if (this.placements.length) saveDesignPlacements(this.route, this.placements);
    else clearDesignPlacements(this.route);
    if (this.rearrange.sections.length) saveRearrangeState(this.route, this.rearrange);
    else clearRearrangeState(this.route);
  }

  private installListeners(): void {
    const signal = this.abort.signal;
    this.shadow.addEventListener("click", (event) => this.onShadowClick(event), { signal });
    this.shadow.addEventListener("input", (event) => this.onShadowInput(event), { signal });
    this.shadow.addEventListener("change", (event) => this.onShadowChange(event), { signal });
    this.shadow.addEventListener("pointerdown", (event) => this.onShadowPointerDown(event as PointerEvent), { signal });
    this.shadow.addEventListener("pointermove", (event) => this.onCanvasPointerMove(event as PointerEvent), { signal });
    this.shadow.addEventListener("pointerup", (event) => this.onCanvasPointerUp(event as PointerEvent), { signal });
    this.shadow.addEventListener("contextmenu", (event) => event.stopPropagation(), { signal });
    for (const name of ["click", "mousedown", "pointerdown"] as const) {
      this.host.addEventListener(name, (event) => event.stopPropagation(), { signal });
    }

    this.document.addEventListener("mousemove", (event) => this.onDocumentMouseMove(event), {
      signal,
      passive: true,
    });
    this.document.addEventListener("mousedown", (event) => this.onDocumentMouseDown(event), {
      signal,
      capture: true,
    });
    this.document.addEventListener("mouseup", (event) => this.onDocumentMouseUp(event), {
      signal,
      capture: true,
    });
    this.document.addEventListener("click", (event) => this.onDocumentClick(event), {
      signal,
      capture: true,
    });
    this.document.addEventListener("keydown", (event) => this.onKeyDown(event), { signal });
    this.window.addEventListener("scroll", () => this.renderPositions(), { signal, passive: true });
    this.window.addEventListener("resize", () => {
      this.resizeCanvas();
      this.renderPositions();
    }, { signal, passive: true });
    this.window.addEventListener("pointermove", (event) => this.onOverlayPointerMove(event), { signal });
    this.window.addEventListener("pointerup", () => this.onOverlayPointerUp(), { signal });
    this.window.addEventListener("hashchange", () => this.checkRoute(), { signal });
    this.window.addEventListener("popstate", () => this.checkRoute(), { signal });
  }

  private ownsEvent(event: Event): boolean {
    return event.composedPath().includes(this.host);
  }

  private pageTarget(event: Event): HTMLElement | null {
    for (const target of event.composedPath()) {
      if (target === this.host) return null;
      if (target instanceof this.HTMLElementCtor) return target;
    }
    return event.target instanceof this.HTMLElementCtor ? event.target : null;
  }

  private onDocumentMouseMove(event: MouseEvent): void {
    if (!this.active || this.pending || this.drawMode || this.designMode || this.ownsEvent(event)) {
      this.hoverTarget = null;
      this.hoverRect = null;
      this.renderHover();
      if (this.selectionStart) this.updateSelection(event.clientX, event.clientY);
      return;
    }
    if (this.selectionStart) {
      this.updateSelection(event.clientX, event.clientY);
      return;
    }
    const target = this.pageTarget(event);
    if (!target || target === this.document.body || target === this.document.documentElement) {
      this.hoverTarget = null;
      this.hoverRect = null;
    } else if (target !== this.hoverTarget) {
      this.hoverTarget = target;
      this.hoverRect = target.getBoundingClientRect();
    }
    this.renderHover();
  }

  private onDocumentMouseDown(event: MouseEvent): void {
    if (!this.active || this.pending || this.drawMode || this.designMode || this.ownsEvent(event)) return;
    if (event.button !== 0) return;
    const target = this.pageTarget(event);
    if (!target) return;
    if (this.settings.blockInteractions) event.preventDefault();
    this.selectionStart = { x: event.clientX, y: event.clientY };
    this.selectionCurrent = { ...this.selectionStart };
  }

  private updateSelection(x: number, y: number): void {
    if (!this.selectionStart) return;
    this.selectionCurrent = { x, y };
    this.renderSelection();
  }

  private onDocumentMouseUp(event: MouseEvent): void {
    if (!this.selectionStart || !this.selectionCurrent) return;
    const start = this.selectionStart;
    const end = this.selectionCurrent;
    this.selectionStart = null;
    this.selectionCurrent = null;
    this.renderSelection();
    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);
    if (width < 8 && height < 8) return;
    this.suppressClickUntil = performance.now() + 250;
    event.preventDefault();
    event.stopPropagation();
    this.openMultiSelection(
      new DOMRect(Math.min(start.x, end.x), Math.min(start.y, end.y), width, height),
    );
  }

  private onDocumentClick(event: MouseEvent): void {
    if (!this.active || this.ownsEvent(event) || performance.now() < this.suppressClickUntil) return;
    if (this.drawMode) return;
    const target = this.pageTarget(event);
    if (!target || target === this.document.body || target === this.document.documentElement) return;

    if (this.designMode) {
      event.preventDefault();
      event.stopPropagation();
      if (this.activeComponent) this.addPlacement(this.activeComponent, event.clientX, event.clientY);
      else if (!this.blankCanvas) this.captureRearrangeTarget(target);
      this.render();
      return;
    }

    if (this.pending) {
      event.preventDefault();
      event.stopPropagation();
      this.flash("Finish or cancel the current annotation");
      return;
    }

    const interactive = target.closest("button, a, input, select, textarea, [role='button'], [onclick]");
    if (interactive && !this.settings.blockInteractions) return;
    event.preventDefault();
    event.stopPropagation();
    this.openPending(target, event.clientX, event.clientY);
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      if (this.pending) this.pending = null;
      else if (this.panelMode) this.panelMode = null;
      else if (this.drawMode) this.drawMode = false;
      else if (this.designMode) this.leaveDesignMode();
      else if (this.active) this.deactivate();
      this.render();
      return;
    }
    if (!this.active || event.repeat) return;
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "c" && event.shiftKey) {
      event.preventDefault();
      void this.copyOutput(false);
    }
  }

  private onShadowClick(event: Event): void {
    event.stopPropagation();
    const target = event.target as HTMLElement;
    const action = target.closest<HTMLElement>("[data-action]")?.dataset.action;
    if (!action) return;

    switch (action) {
      case "toggle-active":
        this.active ? this.deactivate() : this.activate();
        break;
      case "toggle-markers":
        this.showMarkers = !this.showMarkers;
        break;
      case "toggle-draw":
        this.drawMode = !this.drawMode;
        this.designMode = false;
        this.panelMode = null;
        this.resizeCanvas();
        break;
      case "toggle-layout":
        this.designMode = !this.designMode;
        this.drawMode = false;
        this.panelMode = this.designMode ? "layout" : null;
        if (!this.designMode) this.restoreRearrangedElements();
        break;
      case "toggle-freeze":
        this.frozen ? unfreeze() : freeze();
        this.frozen = !this.frozen;
        break;
      case "settings":
        this.panelMode = this.panelMode === "settings" ? null : "settings";
        break;
      case "close-panel":
        this.panelMode = null;
        break;
      case "copy":
        void this.copyOutput(false);
        break;
      case "submit":
        void this.copyOutput(true);
        break;
      case "clear":
        void this.clearAll();
        break;
      case "cancel-popup":
        this.pending = null;
        break;
      case "save-popup":
        void this.commitPending();
        break;
      case "delete-popup":
        if (this.pending?.annotation) void this.deleteAnnotation(this.pending.annotation.id);
        break;
      case "marker": {
        const id = target.closest<HTMLElement>("[data-id]")?.dataset.id;
        if (id) {
          if (this.settings.markerClickBehavior === "delete") void this.deleteAnnotation(id);
          else this.editAnnotation(id);
        }
        break;
      }
      case "select-component": {
        const component = target.closest<HTMLElement>("[data-component]")?.dataset.component as ComponentType;
        this.activeComponent = this.activeComponent === component ? null : component;
        break;
      }
      case "toggle-blank":
        this.toggleBlankCanvas();
        break;
      case "delete-placement": {
        const id = target.closest<HTMLElement>("[data-id]")?.dataset.id;
        if (id) this.deletePlacement(id);
        break;
      }
      case "delete-rearrange": {
        const id = target.closest<HTMLElement>("[data-id]")?.dataset.id;
        if (id) this.deleteRearrange(id);
        break;
      }
      case "clear-drawings":
        this.drawStrokes = [];
        this.redrawCanvas();
        break;
    }
    this.render();
  }

  private onShadowInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    if (target.dataset.field === "comment" && this.pending) this.pending.draft = target.value;
    if (target.dataset.field === "wireframe-purpose") {
      this.wireframePurpose = target.value;
      this.saveRouteState();
    }
    if (target.dataset.field === "webhook-url") {
      this.settings.webhookUrl = target.value;
      saveSettings(this.settings);
    }
  }

  private onShadowChange(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    const field = target.dataset.setting as keyof ToolbarSettings | undefined;
    if (!field) return;
    const value: unknown = target instanceof HTMLInputElement && target.type === "checkbox"
      ? target.checked
      : target.value;
    (this.settings as unknown as Record<string, unknown>)[field] = value;
    saveSettings(this.settings);
    this.applyAccent();
    this.render();
  }

  private onShadowPointerDown(event: PointerEvent): void {
    event.stopPropagation();
    const target = event.target as HTMLElement;
    if (target === this.canvas && this.drawMode) {
      event.preventDefault();
      const stroke: DrawStroke = {
        id: createId("stroke"),
        points: [{ x: event.clientX, y: event.clientY + this.window.scrollY }],
        color: COLOR_VALUES[this.settings.annotationColorId],
      };
      this.drawing = stroke;
      this.drawStrokes.push(stroke);
      this.canvas.setPointerCapture(event.pointerId);
      return;
    }

    const overlay = target.closest<HTMLElement>("[data-overlay-kind]");
    if (!overlay) return;
    const kind = overlay.dataset.overlayKind as "placement" | "rearrange";
    const id = overlay.dataset.id;
    if (!id) return;
    const resize = Boolean(target.closest("[data-resize]"));
    const rect = kind === "placement"
      ? this.placements.find((item) => item.id === id)
      : this.rearrange.sections.find((item) => item.id === id)?.currentRect;
    if (!rect) return;
    event.preventDefault();
    this.overlayDrag = {
      kind,
      id,
      resize,
      startX: event.clientX,
      startY: event.clientY,
      original: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
    };
  }

  private onCanvasPointerMove(event: PointerEvent): void {
    if (!this.drawing || event.target !== this.canvas) return;
    this.drawing.points.push({ x: event.clientX, y: event.clientY + this.window.scrollY });
    this.redrawCanvas();
  }

  private onCanvasPointerUp(event: PointerEvent): void {
    if (!this.drawing || event.target !== this.canvas) return;
    this.drawing = null;
    try {
      this.canvas.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture may already have been released.
    }
    this.redrawCanvas();
  }

  private onOverlayPointerMove(event: PointerEvent): void {
    const drag = this.overlayDrag;
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    const next = drag.resize
      ? {
          ...drag.original,
          width: Math.max(24, drag.original.width + dx),
          height: Math.max(18, drag.original.height + dy),
        }
      : {
          ...drag.original,
          x: drag.original.x + dx,
          y: drag.original.y + dy,
        };
    if (drag.kind === "placement") {
      const item = this.placements.find((placement) => placement.id === drag.id);
      if (item) Object.assign(item, next);
    } else {
      const item = this.rearrange.sections.find((section) => section.id === drag.id);
      if (item) item.currentRect = next;
      this.applyRearrangedElements();
    }
    this.renderOverlays();
  }

  private onOverlayPointerUp(): void {
    const drag = this.overlayDrag;
    if (!drag) return;
    this.overlayDrag = null;
    this.saveRouteState();
    if (drag.kind === "placement") {
      const placement = this.placements.find((item) => item.id === drag.id);
      if (placement) void this.syncPlacement(placement);
    } else {
      const section = this.rearrange.sections.find((item) => item.id === drag.id);
      if (section) void this.syncRearrangeSection(section);
    }
  }

  private activate(): void {
    this.active = true;
    this.applyAccent();
  }

  private deactivate(): void {
    this.active = false;
    this.pending = null;
    this.drawMode = false;
    this.designMode = false;
    this.panelMode = null;
    this.hoverTarget = null;
    this.hoverRect = null;
    if (this.frozen) {
      unfreeze();
      this.frozen = false;
    }
    this.restoreRearrangedElements();
  }

  private leaveDesignMode(): void {
    this.designMode = false;
    this.activeComponent = null;
    this.panelMode = null;
    this.restoreRearrangedElements();
  }

  private inspectMetadata(target: HTMLElement): Annotation["framework"] {
    if (!this.settings.metadataEnabled) return undefined;
    for (const adapter of this.config.metadata ?? []) {
      try {
        const result = adapter.inspect(target);
        if (!result) continue;
        const name = result.framework || adapter.id;
        return {
          name,
          componentPath: result.componentPath ? [...result.componentPath] : undefined,
          source: result.source ? { ...result.source } : undefined,
          confidence: result.confidence,
        };
      } catch (cause) {
        this.emitError("metadata", `Metadata adapter ${adapter.id} failed`, true, cause);
      }
    }
    return undefined;
  }

  private collectTarget(target: HTMLElement, x: number, y: number): CollectedTarget {
    const identified = identifyElement(target);
    const rect = target.getBoundingClientRect();
    const fixed = isFixed(target);
    const selection = this.window.getSelection()?.toString().trim().slice(0, 500) || undefined;
    const styles = Object.entries(getDetailedComputedStyles(target))
      .map(([name, value]) => `${name}: ${value}`)
      .join("; ");
    const framework = this.inspectMetadata(target);
    const source = framework?.source
      ? [framework.source.file, framework.source.line, framework.source.column]
          .filter((part) => part !== undefined)
          .join(":")
      : undefined;
    return {
      x: (x / this.window.innerWidth) * 100,
      y: fixed ? y : y + this.window.scrollY,
      element: identified.name,
      elementPath: identified.path,
      selectedText: selection,
      boundingBox: {
        x: rect.left,
        y: fixed ? rect.top : rect.top + this.window.scrollY,
        width: rect.width,
        height: rect.height,
      },
      nearbyText: getNearbyText(target),
      cssClasses: getElementClasses(target),
      nearbyElements: getNearbyElements(target),
      computedStyles: styles,
      fullPath: getFullElementPath(target),
      accessibility: getAccessibilityInfo(target),
      isFixed: fixed,
      framework,
      reactComponents: framework?.name === "react" && framework.componentPath
        ? framework.componentPath.join(" > ")
        : undefined,
      sourceFile: source,
    };
  }

  private openPending(target: HTMLElement, x: number, y: number): void {
    this.pending = { mode: "add", clientX: x, clientY: y, draft: "", target: this.collectTarget(target, x, y) };
    this.render();
    this.focusPopup();
  }

  private openMultiSelection(rect: DOMRect): void {
    const found = new Set<HTMLElement>();
    const columns = Math.max(2, Math.min(8, Math.ceil(rect.width / 80)));
    const rows = Math.max(2, Math.min(8, Math.ceil(rect.height / 60)));
    for (let col = 0; col <= columns; col += 1) {
      for (let row = 0; row <= rows; row += 1) {
        const x = rect.left + (rect.width * col) / columns;
        const y = rect.top + (rect.height * row) / rows;
        for (const element of this.document.elementsFromPoint(x, y)) {
          if (element === this.host || this.host.contains(element)) continue;
          if (!(element instanceof this.HTMLElementCtor)) continue;
          const candidateRect = element.getBoundingClientRect();
          if (candidateRect.width > 0 && candidateRect.height > 0 && intersects(rect, candidateRect)) {
            found.add(element);
            break;
          }
        }
      }
    }
    const elements = [...found];
    if (!elements.length) return;
    const first = elements[0];
    const target = this.collectTarget(first, rect.left + rect.width / 2, rect.top + rect.height / 2);
    target.element = `${elements.length} selected elements`;
    target.isMultiSelect = true;
    target.boundingBox = {
      x: rect.left,
      y: rect.top + this.window.scrollY,
      width: rect.width,
      height: rect.height,
    };
    target.elementBoundingBoxes = elements.map((element) => {
      const box = element.getBoundingClientRect();
      return { x: box.left, y: box.top + this.window.scrollY, width: box.width, height: box.height };
    });
    this.pending = {
      mode: "add",
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height / 2,
      draft: "",
      target,
    };
    this.render();
    this.focusPopup();
  }

  private focusPopup(): void {
    this.window.setTimeout(() => this.popup.querySelector<HTMLTextAreaElement>("textarea")?.focus(), 0);
  }

  private nearestDrawingIndex(target: CollectedTarget): number | undefined {
    const px = (target.x / 100) * this.window.innerWidth;
    const py = target.isFixed ? target.y + this.window.scrollY : target.y;
    let best: { index: number; distance: number } | undefined;
    this.drawStrokes.forEach((stroke, index) => {
      for (const point of stroke.points) {
        const distance = Math.hypot(point.x - px, point.y - py);
        if (distance <= 24 && (!best || distance < best.distance)) best = { index, distance };
      }
    });
    return best?.index;
  }

  private async commitPending(): Promise<void> {
    const pending = this.pending;
    if (!pending || !pending.draft.trim()) {
      this.flash("Add a feedback note first");
      return;
    }
    if (pending.mode === "edit" && pending.annotation) {
      const annotation = { ...pending.annotation, comment: pending.draft.trim(), updatedAt: new Date().toISOString() };
      this.annotations = this.annotations.map((item) => item.id === annotation.id ? annotation : item);
      this.pending = null;
      this.saveRouteState();
      this.config.onAnnotationUpdate?.(annotation);
      this.emitAnnotations("update", [annotation]);
      void this.fireWebhook("annotation.update", { annotation });
      if (this.config.endpoint) {
        void updateAnnotationOnServer(this.config.endpoint, annotation.id, { comment: annotation.comment })
          .catch((cause) => this.emitError("sync", "Failed to update annotation", true, cause));
      }
      this.render();
      return;
    }
    if (!pending.target) return;
    const annotation: Annotation = {
      ...pending.target,
      id: createId(),
      comment: pending.draft.trim(),
      timestamp: Date.now(),
      drawingIndex: this.nearestDrawingIndex(pending.target),
      url: this.pathname(),
      status: "pending",
    };
    this.annotations = [...this.annotations, annotation];
    this.pending = null;
    this.saveRouteState();
    this.config.onAnnotationAdd?.(annotation);
    this.emitAnnotations("add", [annotation]);
    void this.fireWebhook("annotation.add", { annotation });
    void this.syncNewAnnotation(annotation);
    this.render();
  }

  private editAnnotation(id: string): void {
    const annotation = this.annotations.find((item) => item.id === id);
    if (!annotation) return;
    const x = (annotation.x / 100) * this.window.innerWidth;
    const y = annotation.isFixed ? annotation.y : annotation.y - this.window.scrollY;
    this.pending = {
      mode: "edit",
      clientX: x,
      clientY: y,
      draft: annotation.comment,
      annotation,
    };
    this.render();
    this.focusPopup();
  }

  private async deleteAnnotation(id: string): Promise<void> {
    const annotation = this.annotations.find((item) => item.id === id);
    if (!annotation) return;
    this.annotations = this.annotations.filter((item) => item.id !== id);
    this.pending = null;
    this.saveRouteState();
    this.config.onAnnotationDelete?.(annotation);
    this.emitAnnotations("delete", [annotation]);
    void this.fireWebhook("annotation.delete", { annotation });
    if (this.config.endpoint) {
      void deleteAnnotationFromServer(this.config.endpoint, id)
        .catch((cause) => this.emitError("sync", "Failed to delete annotation", true, cause));
    }
    this.render();
  }

  private async clearAll(): Promise<void> {
    if (!this.annotations.length && !this.placements.length && !this.rearrange.sections.length && !this.drawStrokes.length) return;
    const removed = [...this.annotations];
    const remoteDesignIds = [
      ...this.placements.map((placement) => this.placementRemoteIds.get(placement.id) ?? placement.id),
      ...this.rearrange.sections.map((section) => this.rearrangeRemoteIds.get(section.id) ?? section.id),
    ];
    this.annotations = [];
    this.placements = [];
    this.rearrange = { sections: [], originalOrder: [], detectedAt: Date.now() };
    this.drawStrokes = [];
    this.pending = null;
    clearStoredAnnotations(this.route);
    clearDesignPlacements(this.route);
    clearRearrangeState(this.route);
    clearWireframeState(this.route);
    this.restoreRearrangedElements();
    this.placementRemoteIds.clear();
    this.rearrangeRemoteIds.clear();
    this.config.onAnnotationsClear?.(removed);
    this.emitAnnotations("clear", removed);
    void this.fireWebhook("annotations.clear", { annotations: removed });
    if (this.config.endpoint) {
      for (const id of [...removed.map((annotation) => annotation.id), ...remoteDesignIds]) {
        void deleteAnnotationFromServer(this.config.endpoint, id).catch(() => undefined);
      }
    }
    this.redrawCanvas();
    this.render();
  }

  private output(): string {
    const chunks: string[] = [];
    const feedback = generateOutput(this.annotations, this.route, this.settings.outputDetail);
    if (feedback) chunks.push(feedback);
    const design = generateDesignOutput(
      this.placements,
      { width: this.window.innerWidth, height: this.window.innerHeight },
      { blankCanvas: this.blankCanvas, wireframePurpose: this.wireframePurpose },
      this.settings.outputDetail,
    );
    if (design) chunks.push(design);
    const rearrange = generateRearrangeOutput(
      this.rearrange,
      this.settings.outputDetail,
      { width: this.window.innerWidth, height: this.window.innerHeight },
    );
    if (rearrange) chunks.push(rearrange);
    return chunks.join("\n\n---\n\n");
  }

  private async copyOutput(submit: boolean): Promise<void> {
    const output = this.output();
    if (!output) {
      this.flash("Nothing to copy");
      return;
    }
    const detail: AgentationEventDetail = submit
      ? { type: "submit", output, annotations: this.annotations }
      : { type: "copy", output, annotations: this.annotations };
    const event = this.emit(detail, true);
    if (submit) this.config.onSubmit?.(output, [...this.annotations]);
    else this.config.onCopy?.(output);

    if (!event.defaultPrevented && this.config.copyToClipboard !== false) {
      try {
        await this.window.navigator.clipboard.writeText(output);
      } catch (cause) {
        this.emitError("clipboard", "Failed to copy annotations", true, cause);
      }
    }
    if (submit && this.config.endpoint && this.currentSessionId) {
      try {
        await requestAction(this.config.endpoint, this.currentSessionId, output);
      } catch (cause) {
        this.emitError("sync", "Failed to send annotations to the agent", true, cause);
      }
    }
    if (submit) void this.fireWebhook("annotations.submit", { output, annotations: this.annotations }, true);
    this.flash(submit ? "Sent" : "Copied");
    if (this.settings.autoClearAfterCopy) await this.clearAll();
  }

  private addPlacement(type: ComponentType, clientX: number, clientY: number): void {
    const size = DEFAULT_SIZES[type];
    const placement: DesignPlacement = {
      id: createId("placement"),
      type,
      x: Math.max(0, clientX - size.width / 2),
      y: Math.max(0, clientY + this.window.scrollY - size.height / 2),
      width: size.width,
      height: size.height,
      scrollY: this.window.scrollY,
      timestamp: Date.now(),
    };
    this.placements = [...this.placements, placement];
    this.activeComponent = null;
    this.saveRouteState();
    void this.syncPlacement(placement);
  }

  private deletePlacement(id: string): void {
    this.placements = this.placements.filter((placement) => placement.id !== id);
    this.saveRouteState();
    const remoteId = this.placementRemoteIds.get(id) ?? id;
    this.placementRemoteIds.delete(id);
    if (this.config.endpoint) void deleteAnnotationFromServer(this.config.endpoint, remoteId).catch(() => undefined);
  }

  private captureRearrangeTarget(target: HTMLElement): void {
    const selector = uniqueSelector(target);
    if (this.rearrange.sections.some((section) => section.selector === selector)) return;
    const rect = target.getBoundingClientRect();
    const identified = identifyElement(target);
    const section: DetectedSection = {
      id: createId("section"),
      label: identified.name,
      tagName: target.localName,
      selector,
      role: target.getAttribute("role"),
      className: target.className || null,
      textSnippet: target.textContent?.trim().slice(0, 120) || null,
      originalRect: {
        x: rect.left,
        y: rect.top + this.window.scrollY,
        width: rect.width,
        height: rect.height,
      },
      currentRect: {
        x: rect.left,
        y: rect.top + this.window.scrollY,
        width: rect.width,
        height: rect.height,
      },
      originalIndex: this.rearrange.sections.length,
      isFixed: isFixed(target),
    };
    this.rearrange = {
      ...this.rearrange,
      sections: [...this.rearrange.sections, section],
      originalOrder: [...this.rearrange.originalOrder, section.id],
    };
    this.saveRouteState();
    void this.syncRearrangeSection(section);
  }

  private deleteRearrange(id: string): void {
    const backup = this.rearrangedElements.get(id);
    if (backup) this.restoreElement(backup);
    this.rearrangedElements.delete(id);
    this.rearrange = {
      ...this.rearrange,
      sections: this.rearrange.sections.filter((section) => section.id !== id),
      originalOrder: this.rearrange.originalOrder.filter((item) => item !== id),
    };
    this.saveRouteState();
    const remoteId = this.rearrangeRemoteIds.get(id) ?? id;
    this.rearrangeRemoteIds.delete(id);
    if (this.config.endpoint) void deleteAnnotationFromServer(this.config.endpoint, remoteId).catch(() => undefined);
  }

  private applyRearrangedElements(): void {
    for (const section of this.rearrange.sections) {
      let backup = this.rearrangedElements.get(section.id);
      if (!backup) {
        const element = this.document.querySelector<HTMLElement>(section.selector);
        if (!element) continue;
        backup = {
          element,
          transform: element.style.transform,
          transformOrigin: element.style.transformOrigin,
          transition: element.style.transition,
          position: element.style.position,
          zIndex: element.style.zIndex,
        };
        this.rearrangedElements.set(section.id, backup);
      }
      const dx = section.currentRect.x - section.originalRect.x;
      const dy = section.currentRect.y - section.originalRect.y;
      const sx = section.originalRect.width ? section.currentRect.width / section.originalRect.width : 1;
      const sy = section.originalRect.height ? section.currentRect.height / section.originalRect.height : 1;
      backup.element.style.transformOrigin = "top left";
      backup.element.style.transition = "none";
      backup.element.style.position ||= "relative";
      backup.element.style.zIndex = "9999";
      backup.element.style.transform = `${backup.transform ? `${backup.transform} ` : ""}translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    }
  }

  private restoreElement(backup: MoveBackup): void {
    backup.element.style.transform = backup.transform;
    backup.element.style.transformOrigin = backup.transformOrigin;
    backup.element.style.transition = backup.transition;
    backup.element.style.position = backup.position;
    backup.element.style.zIndex = backup.zIndex;
  }

  private restoreRearrangedElements(): void {
    for (const backup of this.rearrangedElements.values()) this.restoreElement(backup);
    this.rearrangedElements.clear();
  }

  private toggleBlankCanvas(): void {
    if (!this.blankCanvas) {
      saveDesignPlacements(this.route, this.placements);
      saveRearrangeState(this.route, this.rearrange);
      const wireframe = loadWireframeState<RearrangeState>(this.route);
      this.placements = (wireframe?.placements as DesignPlacement[] | undefined) ?? [];
      this.rearrange = wireframe?.rearrange ?? { sections: [], originalOrder: [], detectedAt: Date.now() };
      this.wireframePurpose = wireframe?.purpose ?? "";
      this.blankCanvas = true;
      this.restoreRearrangedElements();
    } else {
      saveWireframeState(this.route, {
        rearrange: this.rearrange,
        placements: this.placements,
        purpose: this.wireframePurpose,
      });
      this.placements = loadDesignPlacements<DesignPlacement>(this.route);
      this.rearrange = loadRearrangeState<RearrangeState>(this.route) ?? {
        sections: [],
        originalOrder: [],
        detectedAt: Date.now(),
      };
      this.blankCanvas = false;
    }
  }

  private async initializeSync(): Promise<void> {
    const generation = ++this.syncGeneration;
    const endpoint = this.config.endpoint;
    if (!endpoint) {
      this.currentSessionId = null;
      return;
    }
    try {
      let sessionId = this.config.sessionId ?? loadSessionId(this.route);
      let remote: Annotation[] = [];
      if (sessionId) {
        const session = await getSession(endpoint, sessionId);
        remote = session.annotations;
      } else {
        const session = await createSession(endpoint, this.pathname());
        sessionId = session.id;
        saveSessionId(this.route, sessionId);
        this.config.onSessionCreated?.(sessionId);
        this.emit({ type: "session-created", sessionId });
      }
      if (generation !== this.syncGeneration || this.destroyed) return;
      this.currentSessionId = sessionId;
      const remoteFeedback = remote.filter((annotation) => !annotation.kind || annotation.kind === "feedback");
      for (const annotation of remote) {
        if (annotation.kind === "placement" && annotation.placement) {
          this.placementRemoteIds.set(annotation.id, annotation.id);
          if (!this.placements.some((placement) => placement.id === annotation.id)) {
            this.placements.push({
              id: annotation.id,
              type: annotation.placement.componentType as ComponentType,
              x: (annotation.x / 100) * this.window.innerWidth,
              y: annotation.y,
              width: annotation.placement.width,
              height: annotation.placement.height,
              scrollY: annotation.placement.scrollY,
              timestamp: annotation.timestamp,
              text: annotation.placement.text,
            });
          }
        }
        if (annotation.kind === "rearrange" && annotation.rearrange) {
          this.rearrangeRemoteIds.set(annotation.id, annotation.id);
          if (!this.rearrange.sections.some((section) => section.id === annotation.id)) {
            const change = annotation.rearrange;
            this.rearrange.sections.push({
              id: annotation.id,
              label: change.label,
              tagName: change.tagName,
              selector: change.selector,
              role: null,
              className: null,
              textSnippet: null,
              originalRect: change.originalRect,
              currentRect: change.currentRect,
              originalIndex: this.rearrange.sections.length,
            });
            this.rearrange.originalOrder.push(annotation.id);
          }
        }
      }
      const merged = new Map<string, Annotation>();
      for (const annotation of [...remoteFeedback, ...this.annotations]) merged.set(annotation.id, annotation);
      this.annotations = [...merged.values()];
      this.saveRouteState();
      this.emitAnnotations("remote", remoteFeedback);
      for (const annotation of this.annotations) {
        if (remoteFeedback.some((item) => item.id === annotation.id)) continue;
        void this.syncNewAnnotation(annotation);
      }
      for (const placement of this.placements) {
        if (!this.placementRemoteIds.has(placement.id)) void this.syncPlacement(placement);
      }
      for (const section of this.rearrange.sections) {
        if (!this.rearrangeRemoteIds.has(section.id)) void this.syncRearrangeSection(section);
      }
      this.render();
    } catch (cause) {
      if (generation === this.syncGeneration) {
        this.currentSessionId = null;
        this.emitError("sync", "Could not initialize Agentation sync; continuing locally", true, cause);
      }
    }
  }

  private async syncNewAnnotation(annotation: Annotation): Promise<void> {
    if (!this.config.endpoint || !this.currentSessionId) return;
    try {
      const synced = await syncAnnotation(this.config.endpoint, this.currentSessionId, {
        ...annotation,
        sessionId: this.currentSessionId,
        url: this.pathname(),
      });
      if (synced.id !== annotation.id) {
        this.annotations = this.annotations.map((item) => item.id === annotation.id ? synced : item);
        this.saveRouteState();
        this.renderMarkers();
      }
    } catch (cause) {
      this.emitError("sync", "Failed to sync annotation; it remains stored locally", true, cause);
    }
  }

  private async syncPlacement(placement: DesignPlacement): Promise<void> {
    if (!this.config.endpoint || !this.currentSessionId) return;
    const annotation: Annotation = {
      id: placement.id,
      x: (placement.x / this.window.innerWidth) * 100,
      y: placement.y,
      comment: placement.text || `Add ${placement.type}`,
      element: `[design:${placement.type}]`,
      elementPath: "[placement]",
      timestamp: placement.timestamp,
      url: this.pathname(),
      intent: "change",
      severity: "important",
      kind: "placement",
      placement: {
        componentType: placement.type,
        width: placement.width,
        height: placement.height,
        scrollY: placement.scrollY,
        text: placement.text,
      },
    };
    try {
      const remoteId = this.placementRemoteIds.get(placement.id);
      if (remoteId) {
        await updateAnnotationOnServer(this.config.endpoint, remoteId, annotation);
      } else {
        const synced = await syncAnnotation(this.config.endpoint, this.currentSessionId, annotation);
        this.placementRemoteIds.set(placement.id, synced.id);
      }
    } catch (cause) {
      this.emitError("sync", "Failed to sync layout placement", true, cause);
    }
  }

  private async syncRearrangeSection(section: DetectedSection): Promise<void> {
    if (!this.config.endpoint || !this.currentSessionId) return;
    const annotation: Annotation = {
      id: section.id,
      x: (section.currentRect.x / this.window.innerWidth) * 100,
      y: section.currentRect.y,
      comment: section.note || `Rearrange ${section.label}`,
      element: section.selector,
      elementPath: "[rearrange]",
      timestamp: Date.now(),
      url: this.pathname(),
      intent: "change",
      severity: "important",
      kind: "rearrange",
      rearrange: {
        selector: section.selector,
        label: section.label,
        tagName: section.tagName,
        originalRect: section.originalRect,
        currentRect: section.currentRect,
      },
    };
    try {
      const remoteId = this.rearrangeRemoteIds.get(section.id);
      if (remoteId) {
        await updateAnnotationOnServer(this.config.endpoint, remoteId, annotation);
      } else {
        const synced = await syncAnnotation(this.config.endpoint, this.currentSessionId, annotation);
        this.rearrangeRemoteIds.set(section.id, synced.id);
      }
    } catch (cause) {
      this.emitError("sync", "Failed to sync rearranged section", true, cause);
    }
  }

  private async fireWebhook(event: string, payload: Record<string, unknown>, force = false): Promise<boolean> {
    const target = this.settings.webhookUrl || this.config.webhookUrl;
    if (!target || (!this.settings.webhooksEnabled && !force)) return false;
    try {
      const response = await fetch(target, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ event, ...payload, url: this.window.location.href, timestamp: Date.now() }),
      });
      if (!response.ok) throw new Error(`Webhook returned ${response.status}`);
      return true;
    } catch (cause) {
      this.emitError("webhook", "Agentation webhook failed", true, cause);
      return false;
    }
  }

  private emitAnnotations(reason: Extract<AgentationEventDetail, { type: "annotations" }>["reason"], affected: Annotation[]): void {
    this.emit({ type: "annotations", reason, current: this.annotations, affected });
  }

  private emitError(
    operation: Extract<AgentationEventDetail, { type: "error" }>["operation"],
    message: string,
    recoverable: boolean,
    cause?: unknown,
  ): void {
    this.emit({ type: "error", operation, message, recoverable, cause });
  }

  private emit(detail: AgentationEventDetail, cancelable = false): AgentationEvent {
    const event = new this.window.CustomEvent<AgentationEventDetail>("agentation", {
      detail,
      bubbles: true,
      composed: true,
      cancelable,
    });
    this.host.dispatchEvent(event);
    try {
      this.config.onEvent?.(event);
    } catch (cause) {
      console.error("[Agentation] onEvent callback failed", cause);
    }
    return event;
  }

  private flash(message: string): void {
    this.toast.textContent = message;
    this.toast.hidden = false;
    if (this.toastTimer !== undefined) this.window.clearTimeout(this.toastTimer);
    this.toastTimer = this.window.setTimeout(() => {
      this.toast.hidden = true;
    }, 1500);
  }

  private loadDemoAnnotations(): void {
    for (const demo of this.config.demoAnnotations ?? []) {
      const target = this.document.querySelector<HTMLElement>(demo.selector);
      if (!target) continue;
      const rect = target.getBoundingClientRect();
      const annotation: Annotation = {
        ...this.collectTarget(target, rect.left + rect.width / 2, rect.top + rect.height / 2),
        id: createId("demo"),
        comment: demo.comment,
        selectedText: demo.selectedText,
        timestamp: Date.now(),
      };
      this.annotations.push(annotation);
    }
    this.saveRouteState();
    this.render();
  }

  private render(): void {
    if (this.destroyed) return;
    this.applyAccent();
    this.renderToolbar();
    this.renderPanel();
    this.renderPopup();
    this.renderHover();
    this.renderSelection();
    this.renderMarkers();
    this.renderOverlays();
    this.resizeCanvas();
    this.redrawCanvas();
  }

  private applyAccent(): void {
    this.host.style.setProperty("--ag-accent", COLOR_VALUES[this.settings.annotationColorId]);
  }

  private renderToolbar(): void {
    if (!this.active) {
      this.toolbar.innerHTML = `<button class="ag-btn" data-action="toggle-active" aria-label="Open Agentation">Annotate</button>`;
      return;
    }
    const count = this.annotations.length + this.placements.length + this.rearrange.sections.length;
    this.toolbar.innerHTML = `
      <button class="ag-btn" data-action="toggle-active" aria-label="Close Agentation">×</button>
      <span class="ag-count">${count}</span>
      <span class="ag-divider"></span>
      <button class="ag-btn" data-action="toggle-markers" aria-pressed="${this.showMarkers}">Markers</button>
      <button class="ag-btn" data-action="toggle-draw" aria-pressed="${this.drawMode}">Draw</button>
      <button class="ag-btn" data-action="toggle-layout" aria-pressed="${this.designMode}">Layout</button>
      <button class="ag-btn" data-action="toggle-freeze" aria-pressed="${this.frozen}">Pause</button>
      <span class="ag-divider"></span>
      <button class="ag-btn" data-action="copy">Copy</button>
      ${this.config.endpoint ? `<button class="ag-btn" data-action="submit">Send</button>` : ""}
      <button class="ag-btn ag-btn-danger" data-action="clear">Clear</button>
      <button class="ag-btn" data-action="settings" aria-pressed="${this.panelMode === "settings"}">Settings</button>
    `;
  }

  private renderPanel(): void {
    if (!this.active || !this.panelMode) {
      this.panel.hidden = true;
      this.panel.innerHTML = "";
      return;
    }
    this.panel.hidden = false;
    if (this.panelMode === "settings") {
      this.panel.innerHTML = `
        <div class="ag-popup-title">Agentation settings</div>
        <label class="ag-field">Output detail
          <select data-setting="outputDetail">
            ${(["compact", "standard", "detailed", "forensic"] as const).map((value) => `<option value="${value}" ${this.settings.outputDetail === value ? "selected" : ""}>${value}</option>`).join("")}
          </select>
        </label>
        <label class="ag-field">Annotation color
          <select data-setting="annotationColorId">
            ${Object.keys(COLOR_VALUES).map((value) => `<option value="${value}" ${this.settings.annotationColorId === value ? "selected" : ""}>${value}</option>`).join("")}
          </select>
        </label>
        <label class="ag-check"><input type="checkbox" data-setting="blockInteractions" ${this.settings.blockInteractions ? "checked" : ""}> Block page interactions while annotating</label>
        <label class="ag-check"><input type="checkbox" data-setting="metadataEnabled" ${this.settings.metadataEnabled ? "checked" : ""}> Collect framework metadata</label>
        <label class="ag-check"><input type="checkbox" data-setting="autoClearAfterCopy" ${this.settings.autoClearAfterCopy ? "checked" : ""}> Clear after copy/send</label>
        <label class="ag-field">Marker click
          <select data-setting="markerClickBehavior">
            <option value="edit" ${this.settings.markerClickBehavior === "edit" ? "selected" : ""}>Edit</option>
            <option value="delete" ${this.settings.markerClickBehavior === "delete" ? "selected" : ""}>Delete</option>
          </select>
        </label>
        <label class="ag-field">Webhook URL
          <input data-field="webhook-url" value="${escapeHtml(this.settings.webhookUrl)}" placeholder="https://…">
        </label>
        <label class="ag-check"><input type="checkbox" data-setting="webhooksEnabled" ${this.settings.webhooksEnabled ? "checked" : ""}> Enable webhooks</label>
        <div class="ag-actions"><button class="ag-btn" data-action="close-panel">Done</button></div>
      `;
      return;
    }

    this.panel.innerHTML = `
      <div class="ag-popup-title">Layout mode — select a component to place, or click a page section to rearrange</div>
      <label class="ag-check"><input type="checkbox" data-action="toggle-blank" ${this.blankCanvas ? "checked" : ""}> Blank wireframe canvas</label>
      ${this.blankCanvas ? `<input class="ag-purpose" data-field="wireframe-purpose" value="${escapeHtml(this.wireframePurpose)}" placeholder="What is this page for?">` : ""}
      ${COMPONENT_REGISTRY.map((section) => `
        <div class="ag-section-title">${escapeHtml(section.section)}</div>
        <div class="ag-grid">${section.items.map((item) => `<button class="ag-chip" data-action="select-component" data-component="${item.type}" data-active="${this.activeComponent === item.type}">${escapeHtml(item.label)}</button>`).join("")}</div>
      `).join("")}
      <div class="ag-actions"><button class="ag-btn" data-action="close-panel">Hide palette</button></div>
    `;
  }

  private renderPopup(): void {
    if (!this.pending) {
      this.popup.hidden = true;
      this.popup.innerHTML = "";
      return;
    }
    const width = 360;
    const left = Math.max(12, Math.min(this.window.innerWidth - width - 12, this.pending.clientX + 14));
    const top = Math.max(12, Math.min(this.window.innerHeight - 190, this.pending.clientY + 14));
    this.popup.style.left = `${left}px`;
    this.popup.style.top = `${top}px`;
    this.popup.hidden = false;
    const label = this.pending.annotation?.element ?? this.pending.target?.element ?? "Annotation";
    const source = this.pending.annotation ? sourceString(this.pending.annotation) : undefined;
    this.popup.innerHTML = `
      <div class="ag-popup-title">${escapeHtml(label)}${source ? ` · ${escapeHtml(source)}` : ""}</div>
      <textarea data-field="comment" placeholder="What should change?">${escapeHtml(this.pending.draft)}</textarea>
      <div class="ag-actions">
        ${this.pending.mode === "edit" ? `<button class="ag-btn ag-btn-danger" data-action="delete-popup">Delete</button>` : ""}
        <button class="ag-btn" data-action="cancel-popup">Cancel</button>
        <button class="ag-btn" data-action="save-popup">${this.pending.mode === "edit" ? "Save" : "Add"}</button>
      </div>
    `;
  }

  private renderHover(): void {
    if (!this.active || !this.hoverTarget || !this.hoverRect || this.pending || this.drawMode || this.designMode) {
      this.hoverLayer.innerHTML = "";
      return;
    }
    const info = identifyElement(this.hoverTarget);
    this.hoverLayer.innerHTML = `<div class="ag-hover" style="left:${this.hoverRect.left}px;top:${this.hoverRect.top}px;width:${this.hoverRect.width}px;height:${this.hoverRect.height}px"><span class="ag-hover-label">${escapeHtml(info.name)}</span></div>`;
  }

  private renderSelection(): void {
    if (!this.selectionStart || !this.selectionCurrent) {
      this.selectionLayer.innerHTML = "";
      return;
    }
    const left = Math.min(this.selectionStart.x, this.selectionCurrent.x);
    const top = Math.min(this.selectionStart.y, this.selectionCurrent.y);
    const width = Math.abs(this.selectionStart.x - this.selectionCurrent.x);
    const height = Math.abs(this.selectionStart.y - this.selectionCurrent.y);
    this.selectionLayer.innerHTML = `<div class="ag-selection-rect" style="left:${left}px;top:${top}px;width:${width}px;height:${height}px"></div>`;
  }

  private renderMarkers(): void {
    if (!this.active || !this.showMarkers || this.designMode) {
      this.markerLayer.innerHTML = "";
      return;
    }
    this.markerLayer.innerHTML = this.annotations.map((annotation, index) => {
      const left = (annotation.x / 100) * this.window.innerWidth;
      const top = annotation.isFixed ? annotation.y : annotation.y - this.window.scrollY;
      return `<button class="ag-marker" data-action="marker" data-id="${escapeHtml(annotation.id)}" style="left:${left}px;top:${top}px" aria-label="Annotation ${index + 1}: ${escapeHtml(annotation.comment)}">${index + 1}</button>`;
    }).join("");
  }

  private renderOverlays(): void {
    this.blankLayer.hidden = !(this.active && this.designMode && this.blankCanvas);
    if (!this.active || !this.designMode) {
      this.overlayLayer.innerHTML = "";
      return;
    }
    this.applyRearrangedElements();
    const placements = this.placements.map((placement) => `
      <div class="ag-placement" data-overlay-kind="placement" data-id="${escapeHtml(placement.id)}" style="left:${placement.x}px;top:${placement.y - this.window.scrollY}px;width:${placement.width}px;height:${placement.height}px">
        <span class="ag-placement-label">${escapeHtml(placement.type)}</span>
        <button class="ag-delete" data-action="delete-placement" data-id="${escapeHtml(placement.id)}" aria-label="Delete placement">×</button>
        <span class="ag-resize" data-resize></span>
      </div>
    `).join("");
    const sections = this.blankCanvas ? "" : this.rearrange.sections.map((section) => `
      <div class="ag-rearrange" data-overlay-kind="rearrange" data-id="${escapeHtml(section.id)}" style="left:${section.currentRect.x}px;top:${section.currentRect.y - this.window.scrollY}px;width:${section.currentRect.width}px;height:${section.currentRect.height}px">
        <span class="ag-rearrange-label">${escapeHtml(section.label)}</span>
        <button class="ag-delete" data-action="delete-rearrange" data-id="${escapeHtml(section.id)}" aria-label="Remove section">×</button>
        <span class="ag-resize" data-resize></span>
      </div>
    `).join("");
    this.overlayLayer.innerHTML = placements + sections;
  }

  private renderPositions(): void {
    this.renderMarkers();
    this.renderOverlays();
    this.redrawCanvas();
  }

  private resizeCanvas(): void {
    const ratio = this.window.devicePixelRatio || 1;
    const width = Math.round(this.window.innerWidth * ratio);
    const height = Math.round(this.window.innerHeight * ratio);
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.canvas.style.width = `${this.window.innerWidth}px`;
      this.canvas.style.height = `${this.window.innerHeight}px`;
    }
    this.canvas.hidden = !this.active || (!this.drawMode && this.drawStrokes.length === 0);
    this.canvas.dataset.passive = String(!this.drawMode);
  }

  private redrawCanvas(): void {
    const context = this.canvas.getContext("2d");
    if (!context) return;
    const ratio = this.window.devicePixelRatio || 1;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, this.window.innerWidth, this.window.innerHeight);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 4;
    for (const stroke of this.drawStrokes) {
      if (stroke.points.length < 2) continue;
      context.strokeStyle = stroke.color;
      context.beginPath();
      context.moveTo(stroke.points[0].x, stroke.points[0].y - this.window.scrollY);
      for (const point of stroke.points.slice(1)) context.lineTo(point.x, point.y - this.window.scrollY);
      context.stroke();
    }
  }
}

export function defineAgentationElement(realm?: Window): CustomElementConstructor | undefined {
  const target = realm ?? (typeof window !== "undefined" ? window : undefined);
  if (!target) return undefined;
  const existing = target.customElements.get(TAG_NAME);
  if (existing) return existing;
  const HTMLElementBase = (target as Window & typeof globalThis).HTMLElement;

  class NativeAgentationElement extends HTMLElementBase implements AgentationElement {
    private runtime?: NativeAgentation;
    private nextConfig: AgentationConfig = {};

    get config(): AgentationConfig {
      return { ...this.nextConfig };
    }

    set config(value: AgentationConfig) {
      this.nextConfig = { ...(value ?? {}) };
      this.runtime?.configure(this.nextConfig);
    }

    connectedCallback(): void {
      if (this.runtime) return;
      if (Object.prototype.hasOwnProperty.call(this, "config")) {
        const preUpgradeConfig = (this as AgentationElement).config;
        delete (this as unknown as Record<string, unknown>).config;
        this.config = preUpgradeConfig;
      }
      const document = this.ownerDocument;
      const mounted = instances.get(document);
      if (mounted) throw new Error("Only one Agentation instance may be mounted per document");
      this.runtime = new NativeAgentation(this, this.nextConfig);
      instances.set(document, this.runtime);
    }

    disconnectedCallback(): void {
      this.runtime?.destroy();
      this.runtime = undefined;
    }

    getRuntime(): NativeAgentation | undefined {
      return this.runtime;
    }
  }

  target.customElements.define(TAG_NAME, NativeAgentationElement);
  return NativeAgentationElement;
}

export function mountAgentation(
  document: Document,
  config: AgentationConfig = {},
): AgentationController {
  if (!document.defaultView || !document.body) {
    throw new Error("mountAgentation requires a browser Document with a body");
  }
  if (instances.has(document)) {
    throw new Error("Only one Agentation instance may be mounted per document");
  }
  defineAgentationElement(document.defaultView);
  const element = document.createElement(TAG_NAME) as AgentationElement & {
    getRuntime?: () => NativeAgentation | undefined;
  };
  element.config = config;
  document.body.append(element);
  const runtime = element.getRuntime?.();
  if (!runtime) {
    element.remove();
    throw new Error("Agentation failed to initialize");
  }
  let destroyed = false;
  return {
    element,
    configure(next) {
      if (destroyed) throw new Error("Agentation controller has been destroyed");
      element.config = next;
    },
    getAnnotations() {
      return runtime.getAnnotations();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      runtime.destroy();
      element.remove();
    },
  };
}
