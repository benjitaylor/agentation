"use client";

import { useLatestAction } from "../../hooks/use-latest-action";
import { mergeSessionFeedback } from "../../utils/merge-session-feedback";
import { createPageEvents, createFrameProjector, viewportRect, parentFrame, captureFrameContext } from "../../utils/frame-dom";
import { deepElementFromPoint, pierceElementFromPoint, annotationElementFromPoint } from "../../utils/hit-testing";
import { useDisabledControlsPassThrough, withDisabledControlsHittable } from "../../utils/disabled-controls";

import { useState, useCallback, useEffect, useLayoutEffect, useRef, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { usePagePath, runPageTask, matchesPage } from "../../utils/page-routing";
import { createPortal } from "react-dom";
import { useFeedbackPortal } from "./use-feedback-portal";
import { ShadowRoot } from "../shadow-root";

import {
  AnnotationPopupCSS,
  AnnotationPopupCSSHandle,
} from "../annotation-popup-css";
import {
  IconGear,
  IconCopyAnimated,
  IconSendArrow,
  IconTrashAlt,
  IconEyeAnimated,
  IconPausePlayAnimated,
  IconLayout,
} from "../icons";
import { HelpTooltip } from "../help-tooltip";
import { ToolbarToggleIcon } from "./toolbar-toggle-icon";
import { DesignMode } from "../design-mode";
import { DesignPalette } from "../design-mode/palette";
import { RearrangeOverlay } from "../design-mode/rearrange";
import { generateDesignOutput, generateRearrangeOutput } from "../design-mode/output";
import { detectPageSections } from "../design-mode/section-detection";
import { DEFAULT_SIZES, type DesignPlacement, type ComponentType as DesignComponentType, type RearrangeState } from "../design-mode/types";
import {
  identifyElement,
  getNearbyText,
  getElementClasses,
  getDetailedComputedStyles,
  getForensicComputedStyles,
  parseComputedStylesString,
  getFullElementPath,
  getAccessibilityInfo,
  getNearbyElements,
  closestCrossingShadow,
} from "../../utils/element-identification";
import {
  loadAnnotations,
  loadAllAnnotations,
  saveAnnotations,
  getStorageKey,
  loadSessionId,
  saveSessionId,
  clearSessionId,
  saveAnnotationsWithSyncMarker,
  loadDesignPlacements,
  saveDesignPlacements,
  clearDesignPlacements,
  loadRearrangeState,
  saveRearrangeState,
  clearRearrangeState,
  loadWireframeState,
  saveWireframeState,
  clearWireframeState,
  loadToolbarHidden,
  saveToolbarHidden,
} from "../../utils/storage";
import {
  createSession,
  getSession,
  syncAnnotation,
  updateAnnotation as updateAnnotationOnServer,
  deleteAnnotation as deleteAnnotationFromServer,
} from "../../utils/sync";
import { getReactComponentName } from "../../utils/react-detection";
import {
  getSourceLocation,
  findNearestComponentSource,
  formatSourceLocation,
} from "../../utils/source-location";
import {
  installAnimationFreeze,
  freeze as freezeAll,
  unfreeze as unfreezeAll,
  originalSetTimeout,
  originalSetInterval,
  originalRequestAnimationFrame,
} from "../../utils/freeze-animations";

import type { Annotation } from "../../types";
import { generateOutput, generateOutputHeader } from "../../utils/generate-output";
import { captureElementAttributes, DEFAULT_IDENTIFYING_ATTRIBUTES } from "../../utils/element-attributes";
import { formatCopyOutput, type CopyFormat } from "../../utils/copy-format";
import { copyTextToClipboard } from "../../utils/clipboard";
import { createShadowSync } from "../../utils/shadow-sync";
import { subscribeSessionResolutions } from "../../utils/session-resolutions";
import { AnnotationCard } from "./annotation-card";
import { css as annotationCardCss } from "./annotation-card/styles.module.scss";
import { AnnotationMarker } from "./annotation-marker";
import { SettingsPanel } from "./settings-panel";
import { HoverTooltip } from "./hover-tooltip";

import { css as resetCss } from "../reset.scss";
import styles, { css as toolbarCss } from "./styles.module.scss";
import designStyles, {
  css as designModeCss,
} from "../design-mode/styles.module.scss";
import { css as popupCss } from "../annotation-popup-css/styles.module.scss";
import { css as checkboxCss } from "../checkbox/styles.module.scss";
import { css as helpTooltipCss } from "../help-tooltip/styles.module.scss";
import { css as iconTransitionsCss } from "../icon-transitions.module.scss";
import { css as annotationMarkerCss } from "./annotation-marker/styles.module.scss";
import { css as checkboxFieldCss } from "./settings-panel/checkbox-field/styles.module.scss";
import { css as settingsPanelCss } from "./settings-panel/styles.module.scss";
import { css as switchCss } from "../switch/styles.module.scss";

const shadowCss = [
  resetCss,
  toolbarCss,
  popupCss,
  checkboxCss,
  designModeCss,
  helpTooltipCss,
  iconTransitionsCss,
  annotationMarkerCss,
  annotationCardCss,
  checkboxFieldCss,
  settingsPanelCss,
  switchCss,
].join("\n");
/**
 * Composes element identification with React component detection.
 * This is the boundary where we combine framework-agnostic element ID
 * with React-specific component name detection.
 */
function identifyElementWithReact(
  element: HTMLElement,
  reactMode: ReactComponentMode = "filtered",
  attributeNames?: readonly string[],
): {
  /** Combined name for display (React path + element) */
  name: string;
  /** Raw element name without React path */
  elementName: string;
  /** DOM path */
  path: string;
  /** React component path (e.g., '<SideNav> <LinkComponent>') */
  reactComponents: string | null;
} {
  const { name: elementName, path } = identifyElement(element, attributeNames);

  // If React detection is off, just return element info
  if (reactMode === "off") {
    return { name: elementName, elementName, path, reactComponents: null };
  }

  const reactInfo = getReactComponentName(element, { mode: reactMode });

  return {
    name: reactInfo.path ? `${reactInfo.path} ${elementName}` : elementName,
    elementName,
    path,
    reactComponents: reactInfo.path,
  };
}

// Module-level flag to prevent re-animating on SPA page navigation
let hasPlayedEntranceAnimation = false;

// =============================================================================
// Types
// =============================================================================

type HoverInfo = {
  element: string;
  elementName: string;
  elementPath: string;
  rect: DOMRect | null;
  reactComponents?: string | null;
  isPiercing?: boolean;
};

type PendingMultiSelectElement = {
  element: HTMLElement;
  rect: DOMRect;
  name: string;
  path: string;
  reactComponents?: string;
};

export type OutputDetailLevel =
  | "compact"
  | "standard"
  | "detailed"
  | "forensic";
// ReactComponentMode is now derived from outputDetail when reactEnabled is true
export type ReactComponentMode = "smart" | "filtered" | "all" | "off";
type MarkerClickBehavior = "edit" | "delete";

export type ToolbarSettings = {
  outputDetail: OutputDetailLevel;
  autoClearAfterCopy: boolean;
  annotationColorId: string;
  blockInteractions: boolean;
  reactEnabled: boolean;
  markerClickBehavior: MarkerClickBehavior;
  webhookUrl: string;
  webhooksEnabled: boolean;
};

const DEFAULT_SETTINGS: ToolbarSettings = {
  outputDetail: "standard",
  autoClearAfterCopy: false,
  annotationColorId: "blue",
  blockInteractions: true,
  reactEnabled: true,
  markerClickBehavior: "edit",
  webhookUrl: "",
  webhooksEnabled: true,
};

// Simple URL validation - checks for valid http(s) URL format
const isValidUrl = (url: string): boolean => {
  if (!url || !url.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

// Maps output detail level to React detection mode
const OUTPUT_TO_REACT_MODE: Record<OutputDetailLevel, ReactComponentMode> = {
  compact: "off",
  standard: "filtered",
  detailed: "smart",
  forensic: "all",
};

const isPrimaryMultiSelectModifierActive = (event: {
  metaKey: boolean;
  ctrlKey: boolean;
}): boolean => event.metaKey || event.ctrlKey;

export const COLOR_OPTIONS = [
  { id: "indigo",  label: "Indigo",  srgb: "#6155F5", p3: "color(display-p3 0.38 0.33 0.96)" },
  { id: "blue",    label: "Blue",    srgb: "#0088FF", p3: "color(display-p3 0.00 0.53 1.00)" },
  { id: "cyan",    label: "Cyan",    srgb: "#00C3D0", p3: "color(display-p3 0.00 0.76 0.82)" },
  { id: "green",   label: "Green",   srgb: "#34C759", p3: "color(display-p3 0.20 0.78 0.35)" },
  { id: "yellow",  label: "Yellow",  srgb: "#FFCC00", p3: "color(display-p3 1.00 0.80 0.00)" },
  { id: "orange",  label: "Orange",  srgb: "#FF8D28", p3: "color(display-p3 1.00 0.55 0.16)" },
  { id: "red",     label: "Red",     srgb: "#FF383C", p3: "color(display-p3 1.00 0.22 0.24)" },
];

const agentationColorTokensCss = [
  ...COLOR_OPTIONS.map(
    (c) => `
    [data-agentation-accent="${c.id}"] {
      --agentation-color-accent: ${c.srgb};
    }
    @supports (color: color(display-p3 0 0 0)) {
      [data-agentation-accent="${c.id}"] {
        --agentation-color-accent: ${c.p3};
      }
    }
  `,
  ),
  `:host {
    ${COLOR_OPTIONS.map((c) => `--agentation-color-${c.id}: ${c.srgb};`).join("\n")}
  }`,
  `@supports (color: color(display-p3 0 0 0)) {
    :host {
      ${COLOR_OPTIONS.map((c) => `--agentation-color-${c.id}: ${c.p3};`).join("\n")}
    }
  }`,
].join("");

// =============================================================================
// Utils
// =============================================================================

function isElementFixed(element: HTMLElement): boolean {
  let outer = element;
  for (let frame = parentFrame(outer.ownerDocument); frame; frame = parentFrame(outer.ownerDocument)) outer = frame;
  let current: HTMLElement | null = outer;
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const position = style.position;
    if (position === "fixed" || position === "sticky") {
      return true;
    }
    current = current.parentElement;
  }
  return false;
}

function isRenderableAnnotation(annotation: Annotation): boolean {
  return annotation.kind !== "placement" && annotation.kind !== "rearrange" &&
    annotation.status !== "resolved" && annotation.status !== "dismissed";
}

function detectSourceFile(element: Element): string | undefined {
  const result = getSourceLocation(element as HTMLElement);
  const loc = result.found ? result : findNearestComponentSource(element as HTMLElement);
  if (loc.found && loc.source) {
    return formatSourceLocation(loc.source, "path");
  }
  return undefined;
}

// =============================================================================
// Types for Props
// =============================================================================

export type DemoAnnotation = {
  selector: string;
  comment: string;
  selectedText?: string;
};

export type PageFeedbackToolbarCSSProps = {
  demoAnnotations?: DemoAnnotation[];
  demoDelay?: number;
  enableDemoMode?: boolean;
  /** Callback fired when an annotation is added. */
  onAnnotationAdd?: (annotation: Annotation) => void;
  /** Callback fired when an annotation is deleted. */
  onAnnotationDelete?: (annotation: Annotation) => void;
  /** Callback fired when an annotation comment is edited. */
  onAnnotationUpdate?: (annotation: Annotation) => void;
  /** Callback fired when all annotations are cleared. Receives the annotations that were cleared. */
  onAnnotationsClear?: (annotations: Annotation[]) => void;
  /** Callback fired after a Copy attempt. Receives formatted output even if clipboard access fails. */
  onCopy?: (output: string) => void;
  /** Callback fired when "Send to Agent" is clicked. Receives the markdown output and annotations. */
  onSubmit?: (output: string, annotations: Annotation[]) => void;
  /** Whether to copy to clipboard when the copy button is clicked. Defaults to true. */
  copyToClipboard?: boolean;
  /** Server URL for sync (e.g., "http://localhost:4747"). If not provided, uses localStorage only. */
  endpoint?: string;
  /** Pre-existing session ID to join. If not provided with endpoint, creates a new session. */
  sessionId?: string;
  /** Called when a new session is created (only when endpoint is provided without sessionId). */
  onSessionCreated?: (sessionId: string) => void;
  /** Webhook URL to receive annotation events. */
  webhookUrl?: string;
  /** Custom class name applied to the toolbar container. Use to adjust positioning or z-index. */
  className?: string;
  /** Separate feedback and sessions by pathname + hash. Defaults to false. */
  useHashLocation?: boolean;
  /** Optional app name included in copied and submitted feedback. */
  appName?: string;
  /** Enable global keyboard shortcuts. Popup Enter/Escape remain available. Defaults to true. */
  enableKeyboardShortcuts?: boolean;
  /** Stable data attributes used in element paths. Replaces the default identifying list. */
  identifyingAttributes?: readonly string[];
  /** Format the Copy action. Send to Agent always receives structured markdown. */
  copyFormat?: CopyFormat;
  /** Show Open in editor when source metadata exists. The host chooses the editor integration. */
  onOpenSource?: (sourceFile: string) => void;
  /** Mount inside a host modal/popover to share its focus and top layer. Defaults to document.body. */
  portalContainer?: HTMLElement | ShadowRoot | null;
};

/** Alias for PageFeedbackToolbarCSSProps */
export type AgentationProps = PageFeedbackToolbarCSSProps;

// =============================================================================
// Component
// =============================================================================

export function PageFeedbackToolbarCSS(props: PageFeedbackToolbarCSSProps = {}) {
  const pathname = usePagePath(props.useHashLocation ?? false);
  const activeState = useState(false);
  const portalHost = useFeedbackPortal(props.portalContainer);
  if (!portalHost) return null;
  return createPortal(<PageFeedbackToolbarForRoute
    {...props}
    key={props.useHashLocation ? pathname : undefined}
    pathname={pathname}
    activeState={activeState}
    portalHost={portalHost}
  />, portalHost);
}

function PageFeedbackToolbarForRoute({
  pathname,
  activeState,
  portalHost,
  useHashLocation = false,
  appName,
  enableKeyboardShortcuts = true,
  identifyingAttributes = DEFAULT_IDENTIFYING_ATTRIBUTES,
  copyFormat = "markdown",
  onOpenSource,
  portalContainer,
  demoAnnotations,
  demoDelay = 1000,
  enableDemoMode = false,
  onAnnotationAdd,
  onAnnotationDelete,
  onAnnotationUpdate,
  onAnnotationsClear,
  onCopy,
  onSubmit,
  copyToClipboard = true,
  endpoint,
  sessionId: initialSessionId,
  onSessionCreated,
  webhookUrl,
  className: userClassName,
}: PageFeedbackToolbarCSSProps & {
  pathname: string;
  activeState: [boolean, Dispatch<SetStateAction<boolean>>];
  portalHost: HTMLDivElement;
}) {
  const [isActive, setIsActive] = activeState;
  const [, updateFrameScroll] = useState(0);
  // This owns live subscriptions, so its lifetime must survive memo-cache
  // invalidation during a development refresh.
  const [pageEvents] = useState(() => createPageEvents(document, () => updateFrameScroll(value => value + 1)));
  useEffect(() => { pageEvents.start(); return () => pageEvents.stop(); }, [pageEvents]);
  const copyAttribute = typeof copyFormat === "object" ? copyFormat.attribute : undefined;
  const attributeNames = useMemo(() => copyAttribute
    ? [...identifyingAttributes, copyAttribute]
    : identifyingAttributes, [identifyingAttributes, copyAttribute]);
  const routeAlive = useRef(true);
  useLayoutEffect(() => {
    routeAlive.current = true;
    return () => { routeAlive.current = false; };
  }, []);
  const routeTask = useCallback(<T,>(work: () => Promise<T>): Promise<T> =>
    useHashLocation ? runPageTask(JSON.stringify([endpoint, pathname]), work) : work(),
    [endpoint, pathname, useHashLocation]);
  const serverIds = useRef(new Map<string, string>());
  const deletedIds = useRef(new Set<string>());
  const keepFeedback = (annotation: Annotation) => isRenderableAnnotation(annotation) &&
    !deletedIds.current.has(annotation.id);
  const syncPageAnnotation = async (...args: Parameters<typeof syncAnnotation>) => {
    const saved = await syncAnnotation(...args);
    const sent = args[2];
    const localId = sent.id;
    if (localId) {
      serverIds.current.set(localId, saved.id);
      if (deletedIds.current.has(localId)) deletedIds.current.add(saved.id);
    }
    // Hash routes already queue edits/deletes behind creation. On ordinary
    // pages those actions may have reached the server before its ID existed.
    if (!useHashLocation) {
      const pagePath = new URL(sent.url || window.location.href).pathname;
      const latest = loadAnnotations<Annotation>(pagePath).find(a => a.id === localId);
      try {
        if (deletedIds.current.has(localId)) {
          await deleteAnnotationFromServer(args[0], saved.id);
        } else if (latest && latest.comment !== sent.comment) {
          await updateAnnotationOnServer(args[0], saved.id, { comment: latest.comment });
          return { ...saved, comment: latest.comment };
        }
      } catch (error) {
        console.warn("[Agentation] Failed to apply changes made during sync:", error);
      }
    }
    return saved;
  };
  const scopeSession = (session: Awaited<ReturnType<typeof getSession>>) =>
    useHashLocation ? { ...session, annotations: session.annotations.filter(a =>
      !deletedIds.current.has(a.id) && matchesPage(a.url || session.url, pathname, window.location.origin)) } : session;
  const latestPathname = useRef(pathname);
  latestPathname.current = pathname;
  const applySessionFeedback = (before: Annotation[], incoming: Annotation[], sessionId: string, pagePath = pathname) => {
    const merged = mergeSessionFeedback(before, loadAnnotations<Annotation>(pagePath), incoming, serverIds.current)
      .filter(keepFeedback);
    // A response for a page the host has since navigated away from must not
    // become the new page's notes.
    if (pagePath === latestPathname.current && routeAlive.current) setAnnotations(merged);
    saveAnnotationsWithSyncMarker(pagePath, merged, sessionId);
  };
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [showMarkers, setShowMarkers] = useState(true);
  const [isToolbarHidden, setIsToolbarHidden] = useState(() => loadToolbarHidden());
  const [isToolbarHiding, setIsToolbarHiding] = useState(false);

  // Install before host passive effects schedule animation loops. Merely
  // importing Agentation must leave the host page's timing functions alone.
  useLayoutEffect(() => {
    installAnimationFreeze();
  }, []);

  // Stop toolbar events after React's portal delegation, before they reach host
  // bubble listeners. Capture-phase dismissal belongs to the host integration.
  const portalWrapperRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const focusControlsOnOpenRef = useRef(false);
  const focusLauncherOnCloseRef = useRef(false);
  const focusSettingsOnOpenRef = useRef(false);

  useLayoutEffect(() => {
    if (isActive && focusControlsOnOpenRef.current) {
      focusControlsOnOpenRef.current = false;
      controlsRef.current?.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
    } else if (!isActive && focusLauncherOnCloseRef.current) {
      focusLauncherOnCloseRef.current = false;
      launcherRef.current?.focus();
    }
  }, [isActive]);
  useEffect(() => {
    const stop = (e: Event) => {
      const wrapper = portalWrapperRef.current;
      if (wrapper && e.composedPath().includes(wrapper)) {
        e.stopPropagation();
      }
    };
    const events = ["mousedown", "click", "pointerdown"] as const;
    events.forEach((evt) => portalHost.addEventListener(evt, stop));
    return () => {
      events.forEach((evt) => portalHost.removeEventListener(evt, stop));
    };
  }, [portalHost]);

  // Unified marker visibility state - controls both toolbar and eye toggle
  const [markersVisible, setMarkersVisible] = useState(false);
  const [markersExiting, setMarkersExiting] = useState(false);
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [pendingAnnotation, setPendingAnnotation] = useState<{
    id: string;
    x: number;
    y: number;
    clientY: number;
    element: string;
    elementPath: string;
    selectedText?: string;
    isSubmitted?: boolean;
    boundingBox?: { x: number; y: number; width: number; height: number };
    nearbyText?: string;
    cssClasses?: string;
    isMultiSelect?: boolean;
    isFixed?: boolean;
    fullPath?: string;
    accessibility?: string;
    computedStyles?: string;
    computedStylesObj?: Record<string, string>;
    nearbyElements?: string;
    reactComponents?: string;
    sourceFile?: string;
    attributes?: Record<string, string>;
    frame?: Annotation["frame"];
    elementBoundingBoxes?: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
    // Element references for modifier-click multi-select (for live position queries)
    multiSelectElements?: HTMLElement[];
    // Element reference for single-select (for live position queries)
    targetElement?: HTMLElement;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const copyAction = useLatestAction();
  const sendAction = useLatestAction();
  const [sendState, setSendState] = useState<
    "idle" | "sending" | "sent" | "failed"
  >("idle");
  const [isClearing, setIsClearing] = useState(false);
  const clearingIds = useRef(new Set<string>());
  const pendingClearIds = useRef(new Set<string>());
  const clearLayoutTimer = useRef<ReturnType<typeof originalSetTimeout>>();
  const finishClearBatch = useCallback(() => {
    if (!clearingIds.current.size && !clearLayoutTimer.current) setIsClearing(false);
  }, []);
  useEffect(() => () => clearTimeout(clearLayoutTimer.current), []);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [hoveredTargetElement, setHoveredTargetElement] =
    useState<HTMLElement | null>(null);
  const [hoveredTargetElements, setHoveredTargetElements] = useState<
    HTMLElement[]
  >([]); // For modifier-click multi-select hover
  const [renumberFrom, setRenumberFrom] = useState<number | null>(null);
  const renumberTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (renumberTimeoutRef.current) clearTimeout(renumberTimeoutRef.current);
  }, []);
  const [editingAnnotation, setEditingAnnotation] = useState<Annotation | null>(
    null,
  );
  const editingTriggerRef = useRef<HTMLButtonElement | null>(null);
  const editingFromKeyboardRef = useRef(false);
  const [restoreEditPreview, setRestoreEditPreview] = useState(false);
  useLayoutEffect(() => {
    if (editingAnnotation || !editingTriggerRef.current) return;
    const trigger = editingTriggerRef.current;
    editingTriggerRef.current = null;
    if (pendingAnnotation) return;
    const target = isActive && trigger.isConnected && !trigger.disabled
      ? trigger : launcherRef.current;
    target?.focus({ preventScroll: true });
  }, [editingAnnotation, isActive, pendingAnnotation]);

  const [editingTargetElement, setEditingTargetElement] =
    useState<HTMLElement | null>(null);
  const [editingTargetElements, setEditingTargetElements] = useState<
    HTMLElement[]
  >([]); // For modifier-click multi-select
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsPage, setSettingsPage] = useState<"main" | "automations">(
    "main",
  );
  const [tooltipsHidden, setTooltipsHidden] = useState(false);

  // Layout mode state
  const [isDesignMode, setIsDesignMode] = useState(false);
  const [designOverlayExiting, setDesignOverlayExiting] = useState(false);
  const [designPlacements, setDesignPlacements] = useState<DesignPlacement[]>([]);
  const [activeDesignComponent, setActiveDesignComponent] = useState<DesignComponentType | null>(null);
  const designPlacementsLoaded = useRef(false);
  // Sub-mode state removed — unified mode renders both overlays simultaneously
  const [blankCanvas, setBlankCanvas] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false); // delays .visible by one frame on mount
  const [canvasOpacity, setCanvasOpacity] = useState(1);
  const [canvasPurpose, setCanvasPurpose] = useState<import("../design-mode/types").CanvasPurpose>("new-page");
  const [wireframePurpose, setWireframePurpose] = useState("");
  const [designInteracting, setDesignInteracting] = useState(false);
  const [rearrangeState, setRearrangeState] = useState<RearrangeState | null>(null);
  const rearrangeLoaded = useRef(false);
  // Stash explore/wireframe state for full isolation between modes
  const exploreStashRef = useRef<{ rearrange: RearrangeState | null; placements: DesignPlacement[] }>({ rearrange: null, placements: [] });
  const wireframeStashRef = useRef<{ rearrange: RearrangeState | null; placements: DesignPlacement[] }>({ rearrange: null, placements: [] });
  // Cross-overlay deselect signals — bump one to deselect the other
  const [designDeselectSignal, setDesignDeselectSignal] = useState(0);
  const [rearrangeDeselectSignal, setRearrangeDeselectSignal] = useState(0);
  const [clearingPlacements, setClearingPlacements] = useState<DesignPlacement[]>([]);
  const [clearingRearrange, setClearingRearrange] = useState<RearrangeState | null>(null);
  const layoutSnapshot = useRef({ designPlacements, rearrangeState, blankCanvas, wireframePurpose });
  layoutSnapshot.current = { designPlacements, rearrangeState, blankCanvas, wireframePurpose };
  const clearingLayout = useRef({ placements: clearingPlacements, rearrange: clearingRearrange });
  // Track selections for cross-overlay drag coordination
  const designSelectedIdsRef = useRef<Set<string>>(new Set());
  const rearrangeSelectedIdsRef = useRef<Set<string>>(new Set());
  // Track start positions for cross-drag (set when drag starts)
  const crossDragStartRef = useRef<Map<string, { x: number; y: number }> | null>(null);
  const designExitTimer = useRef<ReturnType<typeof originalSetTimeout>>();

  // Delay blank canvas .visible by one frame when becoming visible so CSS transition fires
  const canvasShouldBeVisible = isDesignMode && isActive && !designOverlayExiting && blankCanvas;
  useEffect(() => {
    if (canvasShouldBeVisible) {
      setCanvasReady(false);
      const raf = originalRequestAnimationFrame(() => {
        setCanvasReady(true);
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setCanvasReady(false);
    }
  }, [canvasShouldBeVisible]);

  // Shadow annotation tracking (design → server sync)
  const placementAnnotationMap = useRef(new Map<string, string>()); // placementId → server annotationId
  const existingLayoutAnnotations = useRef<Annotation[]>([]);
  const rearrangeAnnotationMap = useRef(new Map<string, string>()); // sectionId → server annotationId
  const layoutSync = useRef<{ placements: ReturnType<typeof createShadowSync>; rearrange: ReturnType<typeof createShadowSync> } | null>(null);

  // Draw mode state
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [drawStrokes, setDrawStrokes] = useState<Array<{ id: string; points: Array<{x: number, y: number}>; color: string; fixed: boolean }>>([]);
  const drawStrokesRef = useRef(drawStrokes);
  drawStrokesRef.current = drawStrokes;
  const [hoveredDrawingIdx, setHoveredDrawingIdx] = useState<number | null>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<Array<{x: number, y: number}>>([]);
  const dimAmountRef = useRef(0);
  const visualHighlightRef = useRef<number | null>(null);
  const exitingStrokeIdRef = useRef<string | null>(null);
  const exitingAlphaRef = useRef(1);

  const [tooltipSessionActive, setTooltipSessionActive] = useState(false);
  const tooltipSessionTimerRef = useRef<ReturnType<typeof originalSetTimeout> | null>(
    null,
  );

  // Primary-modifier multi-select state
  const [pendingMultiSelectElements, setPendingMultiSelectElements] = useState<
    PendingMultiSelectElement[]
  >([]);
  const legacyMultiSelectRef = useRef(false);

  // Hide tooltips after button click until mouse leaves
  const hideTooltipsUntilMouseLeave = () => {
    setTooltipsHidden(true);
  };

  const showTooltipsAgain = () => {
    setTooltipsHidden(false);
  };

  const handleControlsMouseEnter = () => {
    if (!tooltipSessionActive) {
      tooltipSessionTimerRef.current = originalSetTimeout(
        () => setTooltipSessionActive(true),
        850,
      );
    }
  };

  const handleControlsMouseLeave = () => {
    if (tooltipSessionTimerRef.current) {
      clearTimeout(tooltipSessionTimerRef.current);
      tooltipSessionTimerRef.current = null;
    }
    setTooltipSessionActive(false);
    showTooltipsAgain();
  };

  useEffect(() => {
    return () => {
      if (tooltipSessionTimerRef.current)
        clearTimeout(tooltipSessionTimerRef.current);
    };
  }, []);

  const [settings, setSettings] = useState<ToolbarSettings>(() => {
    try {
    const saved = JSON.parse(localStorage.getItem("feedback-toolbar-settings") ?? "");
      return {
        ...DEFAULT_SETTINGS,
        ...saved,
      annotationColorId: COLOR_OPTIONS.find(c => c.id === saved.annotationColorId)
          ? saved.annotationColorId
          : DEFAULT_SETTINGS.annotationColorId,
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showEntranceAnimation, setShowEntranceAnimation] = useState(false);

  const updateSettings = useCallback((patch: Partial<ToolbarSettings>) => {
    setSettings(current => ({ ...current, ...patch }));
  }, []);
  const toggleTheme = useCallback(() => {
    portalWrapperRef.current?.classList.add(styles.disableTransitions);
    setIsDarkMode((previous) => !previous);
    originalRequestAnimationFrame(() => {
      portalWrapperRef.current?.classList.remove(styles.disableTransitions);
    });
  }, []);

  // Check if running in development mode - React detection only works in development mode
  const isDevMode = process.env.NODE_ENV === "development";

  // Effective React mode - derived from outputDetail when enabled
  const effectiveReactMode: ReactComponentMode =
    isDevMode && settings.reactEnabled
      ? OUTPUT_TO_REACT_MODE[settings.outputDetail]
      : "off";

  // Server sync state
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    useHashLocation ? null : initialSessionId ?? null,
  );
  const sessionInitializedRef = useRef(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected"
  >(endpoint ? "connecting" : "disconnected");

  // Draggable toolbar state
  const [toolbarPosition, setToolbarPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isDraggingToolbar, setIsDraggingToolbar] = useState(false);
  const toolbarDragRef = useRef<{
    x: number;
    y: number;
    toolbarX: number;
    toolbarY: number;
    dragging: boolean;
  } | null>(null);
  const justFinishedToolbarDragRef = useRef(false);

  // For animations - track which markers have animated in and which are exiting
  const animatedMarkers = useRef(new Set<string>());
  const markerKeys = useRef(new Map<string, string>());
  const handleMarkerEntered = useCallback((id: string) => {
    animatedMarkers.current.add(id);
    if (recentlyAddedIdRef.current === id) recentlyAddedIdRef.current = null;
  }, []);
  const [exitingMarkers, setExitingMarkers] = useState<Set<string>>(new Set());
  const [pendingExiting, setPendingExiting] = useState(false);
  const [editExiting, setEditExiting] = useState(false);

  // Multi-select drag state - use refs for all drag visuals to avoid re-renders
  const [isDragging, setIsDragging] = useState(false);
  const mouseDownPosRef = useRef<{ x: number; y: number } | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragRectRef = useRef<HTMLDivElement | null>(null);
  const highlightsContainerRef = useRef<HTMLDivElement | null>(null);
  const justFinishedDragRef = useRef(false);
  const lastElementUpdateRef = useRef(0);
  const recentlyAddedIdRef = useRef<string | null>(null);
  const prevConnectionStatusRef = useRef<typeof connectionStatus | null>(null);
  const DRAG_THRESHOLD = 8;
  const ELEMENT_UPDATE_THROTTLE = 50; // Faster updates since no React re-renders

  const popupRef = useRef<AnnotationPopupCSSHandle>(null);
  const editPopupRef = useRef<AnnotationPopupCSSHandle>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof originalSetTimeout> | null>(null);

  const finishSettingsExit = useCallback(() => setSettingsPage("main"), []);
  useEffect(() => {
    if (!showSettings) setTooltipsHidden(false);
  }, [showSettings]);

  useLayoutEffect(() => {
    if (showSettings && focusSettingsOnOpenRef.current) {
      focusSettingsOnOpenRef.current = false;
      portalWrapperRef.current?.querySelector<HTMLButtonElement>(
        '[data-agentation-settings-panel] button',
      )?.focus();
    }
  }, [showSettings]);

  // Unified marker visibility - depends on toolbar active, showMarkers toggle, and not blank canvas
  // This single effect handles all marker show/hide animations
  const shouldShowMarkers = isActive && showMarkers && !isDesignMode;
  useEffect(() => {
    if (shouldShowMarkers) {
      // Show markers - reset animations and make visible
      setMarkersExiting(false);
      setMarkersVisible(true);
      animatedMarkers.current.clear();
      // Each marker reports its actual animation end, including its stagger.
    } else if (markersVisible) {
      // Hide markers - start exit animation, then unmount
      setMarkersExiting(true);
      const timer = originalSetTimeout(() => {
        setMarkersVisible(false);
        setMarkersExiting(false);
      }, 250);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShowMarkers]);

  // Mount and load
  useEffect(() => {
    setMounted(true);
    setScrollY(window.scrollY);
    const stored = loadAnnotations<Annotation>(pathname);
    setAnnotations(stored.filter(isRenderableAnnotation));

    // Trigger entrance animation only on first load (not on SPA navigation)
    if (!hasPlayedEntranceAnimation) {
      setShowEntranceAnimation(true);
      hasPlayedEntranceAnimation = true;
      // Remove animation class after it completes (toolbar: 500ms, badge: 400ms delay + 300ms)
      originalSetTimeout(() => setShowEntranceAnimation(false), 750);
    }

    // Load saved theme preference, default to dark mode
    try {
      const savedTheme = localStorage.getItem("feedback-toolbar-theme");
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === "dark");
      }
      // If no saved preference, keep default (dark mode)
    } catch (e) {
      // Ignore localStorage errors
    }

    // Load saved toolbar position
    try {
      const savedPosition = localStorage.getItem("feedback-toolbar-position");
      if (savedPosition) {
        const pos = JSON.parse(savedPosition);
        if (typeof pos.x === "number" && typeof pos.y === "number") {
          setToolbarPosition(pos);
        }
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [pathname]);

  // Save settings
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(
        "feedback-toolbar-settings",
        JSON.stringify(settings),
      );
    }
  }, [settings, mounted]);

  // Save theme preference
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(
        "feedback-toolbar-theme",
        isDarkMode ? "dark" : "light",
      );
    }
  }, [isDarkMode, mounted]);

  // Save toolbar position when drag ends
  const prevDraggingRef = useRef(false);
  useEffect(() => {
    const wasDragging = prevDraggingRef.current;
    prevDraggingRef.current = isDraggingToolbar;

    // Save position when dragging ends (transition from true to false)
    if (wasDragging && !isDraggingToolbar && toolbarPosition && mounted) {
      localStorage.setItem(
        "feedback-toolbar-position",
        JSON.stringify(toolbarPosition),
      );
    }
  }, [isDraggingToolbar, toolbarPosition, mounted]);

  // Initialize server session (when endpoint is provided)
  useEffect(() => {
    if (!endpoint || !mounted || sessionInitializedRef.current) return;
    sessionInitializedRef.current = true;
    setConnectionStatus("connecting");
    const currentUrl = window.location.href;

    const initSession = async () => {
      try {
        // Check for stored session ID to rejoin on refresh
        const storedSessionId = loadSessionId(pathname);
        const sessionIdToJoin = initialSessionId || storedSessionId;
        let sessionEstablished = false;

        if (sessionIdToJoin) {
          // Join existing session - server annotations are authoritative
          try {
            const beforeJoin = loadAnnotations<Annotation>(pathname);
            const session = scopeSession(await getSession(endpoint, sessionIdToJoin));
            existingLayoutAnnotations.current = session.annotations.filter(a => a.kind === "placement" || a.kind === "rearrange");
            if (routeAlive.current) {
              setCurrentSessionId(session.id);
              setConnectionStatus("connected");
            }
            saveSessionId(pathname, session.id);
            sessionEstablished = true;

            // Find local annotations that need to be synced:
            // 1. Annotations never synced to any session
            // 2. Annotations synced to a different session
            // 3. Annotations marked as synced to THIS session but missing from server
            //    (handles server-side deletion)
            const allLocalAnnotations = loadAnnotations<Annotation>(pathname).filter(isRenderableAnnotation);
            const serverIds = new Set(session.annotations.map((a) => a.id));
            const localToMerge = allLocalAnnotations.filter((a) => {
              // If it exists on server, don't re-upload
              if (serverIds.has(a.id)) return false;
              // Otherwise, needs to be synced (whether never synced, synced elsewhere, or missing from server)
              return true;
            });

            // Sync unsynced local annotations to this session
            if (localToMerge.length > 0) {
              const baseUrl =
                typeof window !== "undefined" ? window.location.origin : "";
              const pageUrl = `${baseUrl}${pathname}`;

              const results = await Promise.allSettled(
                localToMerge.map((annotation) =>
                  syncPageAnnotation(endpoint, session.id, {
                    ...annotation,
                    sessionId: session.id,
                    url: pageUrl,
                  }),
                ),
              );

              const syncedAnnotations = results.map((result, i) => {
                if (result.status === "fulfilled") {
                  return result.value;
                }
                console.warn(
                  "[Agentation] Failed to sync annotation:",
                  result.reason,
                );
                return localToMerge[i];
              });

              // Mark merged annotations as synced
              const allAnnotations = [
                ...session.annotations,
                ...syncedAnnotations,
              ];
              applySessionFeedback(beforeJoin, allAnnotations, session.id);
            } else {
              applySessionFeedback(beforeJoin, session.annotations, session.id);
            }
          } catch (joinError) {
            // Session doesn't exist or expired - will create new below
            console.warn(
              "[Agentation] Could not join session, creating new:",
              joinError,
            );
            // Clear the stored session ID since it's invalid
            clearSessionId(pathname);
            // sessionEstablished remains false, will create new session
          }
        }

        // Create new session if we don't have one yet (either no stored ID, or rejoin failed)
        if (!sessionEstablished) {
          // Create new session for current page
          const session = await createSession(endpoint, currentUrl);
          saveSessionId(pathname, session.id);
          if (routeAlive.current) {
            setCurrentSessionId(session.id);
            setConnectionStatus("connected");
            onSessionCreated?.(session.id);
          }

          // Only sync annotations that have never been synced (no _syncedTo marker)
          const allAnnotations = useHashLocation
            ? new Map([[pathname, loadAnnotations<Annotation>(pathname)]])
            : loadAllAnnotations<Annotation>();
          const baseUrl =
            typeof window !== "undefined" ? window.location.origin : "";

          // Sync annotations from all pages in parallel
          const syncPromises: Promise<void>[] = [];
          for (const [pagePath, annotations] of allAnnotations) {
            // Filter to only unsynced annotations
            const unsyncedAnnotations = annotations.filter(
              (a) => isRenderableAnnotation(a) && !(a as Annotation & { _syncedTo?: string })._syncedTo,
            );
            if (unsyncedAnnotations.length === 0) continue;

            const pageUrl = `${baseUrl}${pagePath}`;
            const isCurrentPage = pagePath === pathname;

            syncPromises.push(
              (async () => {
                try {
                  // Use current session for current page, create new sessions for other pages
                  const targetSession = isCurrentPage
                    ? session
                    : await createSession(endpoint, pageUrl);

                  const results = await Promise.allSettled(
                    unsyncedAnnotations.map((annotation) =>
                      syncPageAnnotation(endpoint, targetSession.id, {
                        ...annotation,
                        sessionId: targetSession.id,
                        url: pageUrl,
                      }),
                    ),
                  );

                  // Mark synced annotations and update local state for current page
                  const syncedAnnotations = results.map((result, i) => {
                    if (result.status === "fulfilled") {
                      return result.value;
                    }
                    console.warn(
                      "[Agentation] Failed to sync annotation:",
                      result.reason,
                    );
                    return unsyncedAnnotations[i];
                  });

                  applySessionFeedback(unsyncedAnnotations, syncedAnnotations, targetSession.id, pagePath);
                } catch (err) {
                  console.warn(
                    `[Agentation] Failed to sync annotations for ${pagePath}:`,
                    err,
                  );
                }
              })(),
            );
          }

          await Promise.allSettled(syncPromises);
        }
      } catch (error) {
        // Network error - continue in local-only mode
        if (routeAlive.current) setConnectionStatus("disconnected");
        console.warn(
          "[Agentation] Failed to initialize session, using local storage:",
          error,
        );
      }
    };

    void routeTask(initSession);
  }, [endpoint, initialSessionId, mounted, onSessionCreated, pathname, routeTask]);

  // Periodic health check for server connection
  useEffect(() => {
    if (!endpoint || !mounted) return;

    const checkHealth = async () => {
      try {
        const response = await fetch(`${endpoint}/health`);
        if (response.ok) {
          setConnectionStatus("connected");
        } else {
          setConnectionStatus("disconnected");
        }
      } catch {
        setConnectionStatus("disconnected");
      }
    };

    // Check immediately, then every 10 seconds
    checkHealth();
    const interval = originalSetInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, [endpoint, mounted]);

  const currentAnnotationsRef = useRef(annotations);
  const hasPendingFeedbackRef = useRef(false);
  useLayoutEffect(() => {
    currentAnnotationsRef.current = annotations;
    hasPendingFeedbackRef.current = annotations.length > 0 || designPlacements.length > 0 ||
      (rearrangeState?.sections.length ?? 0) > 0;
  }, [annotations, designPlacements.length, rearrangeState?.sections.length]);

  const finishMarkerRemoval = useCallback((id: string) => {
    const wasClearing = clearingIds.current.has(id);
    if (wasClearing) {
      pendingClearIds.current.delete(id);
      if (pendingClearIds.current.size) return;
    }
    // Retain a clearing batch until its final visible exit. Numbers and the
    // badge then update once, instead of rolling on every individual finish.
    const removed = wasClearing ? new Set(clearingIds.current) : new Set([id]);
    if (wasClearing) {
      clearingIds.current.clear();
      finishClearBatch();
    }
    for (const removedId of removed) {
      markerKeys.current.delete(removedId);
      animatedMarkers.current.delete(removedId);
    }
    setAnnotations(previous => previous.filter(a => !removed.has(a.id)));
    setExitingMarkers(previous => new Set([...previous].filter(id => !removed.has(id))));
    const notes = wasClearing ? [] : currentAnnotationsRef.current.filter(a => a.kind !== "placement" && a.kind !== "rearrange");
    const index = notes.findIndex(a => a.id === id);
    if (index >= 0 && index < notes.length - 1) {
      setRenumberFrom(previous => previous === null ? index : Math.min(previous, index));
      if (renumberTimeoutRef.current) clearTimeout(renumberTimeoutRef.current);
      renumberTimeoutRef.current = originalSetTimeout(() => setRenumberFrom(null), 200);
    }
  }, [finishClearBatch]);

  // Apply both live resolutions and statuses missed during a broken stream.
  useEffect(() => {
    if (!endpoint || !mounted || !currentSessionId) return;

    const remove = (annotation: Annotation) => {
      const { id, kind } = annotation;

      if (kind === "placement") {
        // Reverse-lookup: find which placementId maps to this annotation ID
        for (const [placementId, annotationId] of placementAnnotationMap.current) {
          if (annotationId === id) {
            layoutSync.current?.placements.forget(placementId);
            setDesignPlacements((prev) => prev.filter((p) => p.id !== placementId));
            break;
          }
        }
      } else if (kind === "rearrange") {
        // Reverse-lookup: find which sectionId maps to this annotation ID
        for (const [sectionId, annotationId] of rearrangeAnnotationMap.current) {
          if (annotationId === id) {
            layoutSync.current?.rearrange.forget(sectionId);
            setRearrangeState((prev) => {
              if (!prev) return null;
              const remaining = prev.sections.filter((s) => s.id !== sectionId);
              if (remaining.length === 0) return null;
              return { ...prev, sections: remaining };
            });
            break;
          }
        }
      } else {
        // Feedback annotation — trigger exit animation then remove.
        if (!currentAnnotationsRef.current.some(a => a.id === id)) return;
        setExitingMarkers((prev) => new Set(prev).add(id));
      }
    };
    const stop = subscribeSessionResolutions(endpoint, currentSessionId,
      () => hasPendingFeedbackRef.current, remove);
    return stop;
  }, [endpoint, mounted, currentSessionId]);


  // Sync local annotations when connection is restored
  useEffect(() => {
    if (!endpoint || !mounted) return;

    // Check if we just reconnected (was disconnected, now connected)
    const wasDisconnected = prevConnectionStatusRef.current === "disconnected";
    const isNowConnected = connectionStatus === "connected";
    prevConnectionStatusRef.current = connectionStatus;

    if (wasDisconnected && isNowConnected) {
      // Sync any local annotations that aren't on the server
      const syncLocalAnnotations = async () => {
        try {
          const localAnnotations = loadAnnotations<Annotation>(pathname).filter(isRenderableAnnotation);
          if (localAnnotations.length === 0) return;

          const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
          const pageUrl = `${baseUrl}${pathname}`;

          // Get or create session
          let sessionId = currentSessionId;
          let serverAnnotations: Annotation[] = [];

          if (sessionId) {
            // Try to get existing session
            try {
              const session = scopeSession(await getSession(endpoint, sessionId));
              serverAnnotations = session.annotations;
            } catch {
              // Session doesn't exist anymore, create new one
              sessionId = null;
            }
          }

          if (!sessionId) {
            // Create new session
            const newSession = await createSession(endpoint, pageUrl);
            sessionId = newSession.id;
            if (routeAlive.current) setCurrentSessionId(sessionId);
            saveSessionId(pathname, sessionId);
          }

          // Find annotations that need syncing
          const serverIds = new Set(serverAnnotations.map((a) => a.id));
          const unsyncedLocal = localAnnotations.filter((a) => !serverIds.has(a.id));

          if (unsyncedLocal.length > 0) {
            const results = await Promise.allSettled(
              unsyncedLocal.map((annotation) =>
                syncPageAnnotation(endpoint, sessionId!, {
                  ...annotation,
                  sessionId: sessionId!,
                  url: pageUrl,
                })
              )
            );

            const syncedAnnotations = results.map((result, i) => {
              if (result.status === "fulfilled") {
                return result.value;
              }
              console.warn("[Agentation] Failed to sync annotation on reconnect:", result.reason);
              return unsyncedLocal[i];
            });

            // Update local state with server + synced annotations
            const allAnnotations = [...serverAnnotations, ...syncedAnnotations];
            applySessionFeedback(localAnnotations, allAnnotations, sessionId!);
          }
        } catch (err) {
          console.warn("[Agentation] Failed to sync on reconnect:", err);
        }
      };

      void routeTask(syncLocalAnnotations);
    }
  }, [connectionStatus, endpoint, mounted, currentSessionId, pathname, routeTask]);

  const hideToolbarTemporarily = useCallback(() => {
    if (isToolbarHiding) return;
    setIsToolbarHiding(true);
    setShowSettings(false);
    setIsActive(false);
    originalSetTimeout(() => {
      saveToolbarHidden(true);
      setIsToolbarHidden(true);
      setIsToolbarHiding(false);
    }, 400);
  }, [isToolbarHiding]);

  // Demo annotations
  useEffect(() => {
    if (!enableDemoMode) return;
    if (!mounted || !demoAnnotations || demoAnnotations.length === 0) return;
    if (annotations.length > 0) return;

    const timeoutIds: ReturnType<typeof originalSetTimeout>[] = [];

    timeoutIds.push(
      originalSetTimeout(() => {
        setIsActive(true);
      }, demoDelay - 200),
    );

    demoAnnotations.forEach((demo, index) => {
      const annotationDelay = demoDelay + index * 300;

      timeoutIds.push(
        originalSetTimeout(() => {
          const element = document.querySelector(demo.selector) as HTMLElement;
          if (!element) return;

          const rect = viewportRect(element);
          const { name, path } = identifyElement(element);

          const newAnnotation: Annotation = {
            id: `demo-${Date.now()}-${index}`,
            x: ((rect.left + rect.width / 2) / window.innerWidth) * 100,
            y: rect.top + rect.height / 2 + window.scrollY,
            comment: demo.comment,
            element: name,
            elementPath: path,
            timestamp: Date.now(),
            selectedText: demo.selectedText,
            boundingBox: {
              x: rect.left,
              y: rect.top + window.scrollY,
              width: rect.width,
              height: rect.height,
            },
            nearbyText: getNearbyText(element),
            cssClasses: getElementClasses(element),
          };

          setAnnotations((prev) => [...prev, newAnnotation]);
        }, annotationDelay),
      );
    });

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [enableDemoMode, mounted, demoAnnotations, demoDelay]);

  // Track scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      updateFrameScroll(value => value + 1);
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = originalSetTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    pageEvents.addEventListener("scroll", handleScroll, { passive: true, capture: true });
    return () => {
      pageEvents.removeEventListener("scroll", handleScroll, true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [pageEvents]);

  // Save annotations (preserving sync markers if connected to a session)
  useEffect(() => {
    if (!mounted) return;
    const saved = annotations.filter(a => !exitingMarkers.has(a.id));
    if (saved.length > 0) {
      if (currentSessionId) {
        // Connected to session - save with sync marker to prevent re-upload on refresh
        saveAnnotationsWithSyncMarker(pathname, saved, currentSessionId);
      } else {
        // Not connected - save without markers (will sync when connected)
        saveAnnotations(pathname, saved);
      }
    } else {
      localStorage.removeItem(getStorageKey(pathname));
    }
  }, [annotations, pathname, mounted, currentSessionId, isClearing, exitingMarkers]);

  // Load design placements from localStorage on mount
  useEffect(() => {
    if (mounted && !designPlacementsLoaded.current) {
      designPlacementsLoaded.current = true;
      const stored = loadDesignPlacements<DesignPlacement>(pathname);
      if (stored.length > 0) setDesignPlacements(stored);
    }
  }, [mounted, pathname]);

  // Save design placements to localStorage (only explore-mode data — wireframe has its own key)
  useEffect(() => {
    if (mounted && designPlacementsLoaded.current && !blankCanvas) {
      const saved = designPlacements.filter(p => !clearingPlacements.includes(p));
      if (saved.length > 0) {
        saveDesignPlacements(pathname, saved);
      } else {
        clearDesignPlacements(pathname);
      }
    }
  }, [designPlacements, pathname, mounted, blankCanvas, clearingPlacements]);

  // Load rearrange state from localStorage on mount
  useEffect(() => {
    if (mounted && !rearrangeLoaded.current) {
      rearrangeLoaded.current = true;
      const stored = loadRearrangeState<RearrangeState>(pathname);
      if (stored) {
        // Migrate old state that lacks currentRect
        const migrated = {
          ...stored,
          sections: stored.sections.map(s => ({
            ...s,
            currentRect: s.currentRect ?? { ...s.originalRect },
          })),
        };
        setRearrangeState(migrated);
      }
    }
  }, [mounted, pathname]);

  // Save rearrange state to localStorage (only explore-mode data — wireframe has its own key)
  useEffect(() => {
    if (mounted && rearrangeLoaded.current && !blankCanvas) {
      if (rearrangeState && rearrangeState !== clearingRearrange) {
        saveRearrangeState(pathname, rearrangeState);
      } else {
        clearRearrangeState(pathname);
      }
    }
  }, [rearrangeState, pathname, mounted, blankCanvas, clearingRearrange]);

  // Load wireframe stash from localStorage on mount
  const wireframeLoaded = useRef(false);
  useEffect(() => {
    if (mounted && !wireframeLoaded.current) {
      wireframeLoaded.current = true;
      const stored = loadWireframeState<RearrangeState>(pathname);
      if (stored) {
        wireframeStashRef.current = {
          rearrange: stored.rearrange,
          placements: (stored.placements || []) as DesignPlacement[],
        };
        if (stored.purpose) setWireframePurpose(stored.purpose);
      }
    }
  }, [mounted, pathname]);

  // Save wireframe stash to localStorage when it changes
  useEffect(() => {
    if (!mounted || !wireframeLoaded.current || isClearing) return;
    const stash = wireframeStashRef.current;
    // Save current wireframe state: either from stash (if in explore mode) or live (if in wireframe mode)
    if (blankCanvas) {
      // Currently in wireframe — save live state
      const hasContent = (rearrangeState?.sections?.length ?? 0) > 0 || designPlacements.length > 0 || wireframePurpose;
      if (hasContent) {
        saveWireframeState(pathname, { rearrange: rearrangeState, placements: designPlacements, purpose: wireframePurpose });
      } else {
        clearWireframeState(pathname);
      }
    } else {
      // In explore mode — save stash
      const hasContent = (stash.rearrange?.sections?.length ?? 0) > 0 || stash.placements.length > 0 || wireframePurpose;
      if (hasContent) {
        saveWireframeState(pathname, { rearrange: stash.rearrange, placements: stash.placements, purpose: wireframePurpose });
      } else {
        clearWireframeState(pathname);
      }
    }
  }, [rearrangeState, designPlacements, wireframePurpose, blankCanvas, pathname, mounted, isClearing]);

  // Initialize empty rearrange state when entering explore mode
  // Sections are captured on click, not auto-detected
  useEffect(() => {
    if (isDesignMode && !rearrangeState) {
      setRearrangeState({
        sections: [],
        originalOrder: [],
        detectedAt: Date.now(),
      });
    }
  }, [isDesignMode, rearrangeState]);

  // Each session owns its queues. Late responses cannot overwrite a new session's IDs.
  useEffect(() => {
    if (!endpoint || !currentSessionId) return;
    const transport = {
      create: (annotation: Annotation) => routeTask(() => syncAnnotation(endpoint, currentSessionId, annotation)),
      update: (id: string, annotation: Annotation) => routeTask(() => updateAnnotationOnServer(endpoint, id, annotation)),
      remove: (id: string) => routeTask(() => deleteAnnotationFromServer(endpoint, id)),
    };
    placementAnnotationMap.current = new Map();
    rearrangeAnnotationMap.current = new Map();
    const queues = {
      placements: createShadowSync(transport, placementAnnotationMap.current, existingLayoutAnnotations.current.filter(a => a.kind === "placement")),
      rearrange: createShadowSync(transport, rearrangeAnnotationMap.current, existingLayoutAnnotations.current.filter(a => a.kind === "rearrange")),
    };
    layoutSync.current = queues;
    return () => {
      queues.placements.dispose();
      queues.rearrange.dispose();
      if (layoutSync.current === queues) layoutSync.current = null;
    };
  }, [endpoint, currentSessionId, pathname, routeTask]);

  // Save note and geometry changes, including edits made while creation is pending.
  useEffect(() => {
    const pageUrl = window.location.pathname + window.location.search + window.location.hash;
    layoutSync.current?.placements.replace(designPlacements.filter(p => !clearingPlacements.includes(p)).map(p => ({
      id: p.id,
      x: (p.x / window.innerWidth) * 100,
      y: p.y,
      comment: `Place ${p.type} at (${Math.round(p.x)}, ${Math.round(p.y)}), ${p.width}×${p.height}px${p.text ? ` — "${p.text}"` : ""}`,
      element: `[design:${p.type}]`,
      elementPath: "[placement]",
      timestamp: p.timestamp,
      url: pageUrl,
      intent: "change",
      severity: "important",
      kind: "placement",
      placement: { componentType: p.type, width: p.width, height: p.height, scrollY: p.scrollY, text: p.text },
    })));
  }, [designPlacements, endpoint, currentSessionId, pathname, clearingPlacements]);

  // Debounce pointer movement; the queue serializes requests and retains newer edits.
  useEffect(() => {
    const queues = layoutSync.current;
    if (!queues) return;
    if (rearrangeState === clearingRearrange) {
      queues.rearrange.replace([]);
      return;
    }
    const timer = originalSetTimeout(() => {
      const pageUrl = window.location.pathname + window.location.search + window.location.hash;
      const annotations: Annotation[] = [];
      for (const section of rearrangeState?.sections ?? []) {
        const orig = section.originalRect;
        const curr = section.currentRect;
        const hasMoved = Math.abs(orig.x - curr.x) > 1 || Math.abs(orig.y - curr.y) > 1 ||
          Math.abs(orig.width - curr.width) > 1 || Math.abs(orig.height - curr.height) > 1;
        if (!hasMoved && !section.note) continue;
        const notePart = section.note ? ` — "${section.note}"` : "";
        annotations.push({
          id: section.id,
          x: (curr.x / window.innerWidth) * 100,
          y: curr.y,
          comment: hasMoved
            ? `Move ${section.label} section (${section.tagName}) — from (${Math.round(orig.x)},${Math.round(orig.y)}) ${Math.round(orig.width)}×${Math.round(orig.height)} to (${Math.round(curr.x)},${Math.round(curr.y)}) ${Math.round(curr.width)}×${Math.round(curr.height)}${notePart}`
            : `Note on ${section.label} section (${section.tagName})${notePart}`,
          element: section.selector,
          elementPath: "[rearrange]",
          timestamp: rearrangeState!.detectedAt,
          url: pageUrl,
          intent: "change",
          severity: "important",
          kind: "rearrange",
          rearrange: { selector: section.selector, label: section.label, tagName: section.tagName, originalRect: orig, currentRect: curr },
        });
      }
      queues.rearrange.replace(annotations);
    }, 300);
    return () => clearTimeout(timer);
  }, [rearrangeState, endpoint, currentSessionId, pathname, clearingRearrange]);

  // Reopening owns the overlay immediately, including during an unfinished exit.
  const openDesignMode = useCallback(() => {
    clearTimeout(designExitTimer.current);
    setDesignOverlayExiting(false);
    setIsDesignMode(true);
  }, []);

  useEffect(() => () => clearTimeout(designExitTimer.current), []);

  // Close layout mode — palette + overlays exit concurrently
  const closeDesignMode = useCallback(() => {
    setDesignOverlayExiting(true);
    setIsDesignMode(false);
    setActiveDesignComponent(null);
    // Don't reset subMode here — it causes a crossfade during exit animation.
    // It stays on the last-used tab for next time.
    clearTimeout(designExitTimer.current);
    designExitTimer.current = originalSetTimeout(() => {
      setDesignOverlayExiting(false);
    }, 300);
  }, []);

  // Deactivate toolbar — if in layout mode, animate out overlays independently
  const deactivate = useCallback(() => {
    const root = launcherRef.current?.getRootNode() as ShadowRoot | undefined;
    focusLauncherOnCloseRef.current = !!root?.activeElement &&
      !!portalWrapperRef.current?.contains(root.activeElement);
    if (focusLauncherOnCloseRef.current) (root?.activeElement as HTMLElement)?.blur();
    setShowSettings(false);
    if (isDesignMode) {
      setDesignOverlayExiting(true);
      setIsDesignMode(false);
      setActiveDesignComponent(null);
      clearTimeout(designExitTimer.current);
      designExitTimer.current = originalSetTimeout(() => {
        setDesignOverlayExiting(false);
      }, 300);
    }
    setIsActive(false);
  }, [isDesignMode]);

  // Freeze animations (delegates to freeze-animations utility)
  const freezeAnimations = useCallback(() => {
    if (isFrozen) return;
    freezeAll();
    setIsFrozen(true);
  }, [isFrozen]);

  const unfreezeAnimations = useCallback(() => {
    if (!isFrozen) return;
    unfreezeAll();
    setIsFrozen(false);
  }, [isFrozen]);

  const toggleFreeze = useCallback(() => {
    if (isFrozen) {
      unfreezeAnimations();
    } else {
      freezeAnimations();
    }
  }, [isFrozen, freezeAnimations, unfreezeAnimations]);

  // Create pending annotation from modifier-click multi-select
  const createMultiSelectPendingAnnotation = useCallback((items = pendingMultiSelectElements) => {
    const selection = items.filter(item => item.element.isConnected);
    if (selection.length === 0) {
      setPendingMultiSelectElements([]);
      return;
    }

    const firstItem = selection[0];
    const firstEl = firstItem.element;
    const isMulti = selection.length > 1;

    // Get fresh rects for all elements
    const freshRects = selection.map((item) =>
      viewportRect(item.element),
    );

    if (!isMulti) {
      // Single element - treat as regular annotation (not multi-select)
      const rect = freshRects[0];
      const isFixed = isElementFixed(firstEl);

      setPendingAnnotation({
        id: Date.now().toString(),
        x: (rect.left / window.innerWidth) * 100,
        y: isFixed ? rect.top : rect.top + window.scrollY,
        clientY: rect.top,
        element: firstItem.name,
        elementPath: firstItem.path,
        boundingBox: {
          x: rect.left,
          y: isFixed ? rect.top : rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
        },
        isFixed,
        fullPath: getFullElementPath(firstEl),
        accessibility: getAccessibilityInfo(firstEl),
        computedStyles: getForensicComputedStyles(firstEl),
        computedStylesObj: getDetailedComputedStyles(firstEl),
        nearbyElements: getNearbyElements(firstEl),
        cssClasses: getElementClasses(firstEl),
        nearbyText: getNearbyText(firstEl),
        reactComponents: firstItem.reactComponents,
        targetElement: firstEl,
        sourceFile: detectSourceFile(firstEl),
        attributes: captureElementAttributes(firstEl, attributeNames),
      });
    } else {
      // Multiple elements - multi-select annotation
      const bounds = {
        left: Math.min(...freshRects.map((r) => r.left)),
        top: Math.min(...freshRects.map((r) => r.top)),
        right: Math.max(...freshRects.map((r) => r.right)),
        bottom: Math.max(...freshRects.map((r) => r.bottom)),
      };

      const names = selection
        .slice(0, 5)
        .map((item) => item.name)
        .join(", ");
      const suffix =
        selection.length > 5
          ? ` +${selection.length - 5} more`
          : "";

      const elementBoundingBoxes = freshRects.map((rect) => ({
        x: rect.left,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      }));

      // Position marker near the last selected element (most recent click)
      const lastItem = selection[selection.length - 1];
      const lastEl = lastItem.element;
      const lastRect = freshRects[freshRects.length - 1];
      const lastCenterX = lastRect.left + lastRect.width / 2;
      const lastCenterY = lastRect.top + lastRect.height / 2;
      const lastIsFixed = isElementFixed(lastEl);

      setPendingAnnotation({
        id: Date.now().toString(),
        x: (lastCenterX / window.innerWidth) * 100,
        y: lastIsFixed ? lastCenterY : lastCenterY + window.scrollY,
        clientY: lastCenterY,
        element: `${selection.length} elements: ${names}${suffix}`,
        elementPath: "multi-select",
        boundingBox: {
          x: bounds.left,
          y: bounds.top + window.scrollY,
          width: bounds.right - bounds.left,
          height: bounds.bottom - bounds.top,
        },
        isMultiSelect: true,
        isFixed: lastIsFixed,
        elementBoundingBoxes,
        multiSelectElements: selection.map((item) => item.element),
        targetElement: lastEl, // Anchor marker/popup to last clicked element
        fullPath: getFullElementPath(firstEl),
        accessibility: getAccessibilityInfo(firstEl),
        computedStyles: getForensicComputedStyles(firstEl),
        computedStylesObj: getDetailedComputedStyles(firstEl),
        nearbyElements: getNearbyElements(firstEl),
        cssClasses: getElementClasses(firstEl),
        nearbyText: getNearbyText(firstEl),
        sourceFile: detectSourceFile(firstEl),
        attributes: captureElementAttributes(firstEl, attributeNames),
      });
    }

    setPendingMultiSelectElements([]);
    setHoverInfo(null);
  }, [pendingMultiSelectElements, attributeNames]);

  // Reset state when deactivating
  useEffect(() => {
    if (!isActive) {
      setPendingAnnotation(null);
      setEditingAnnotation(null);
      setEditingTargetElement(null);
      setEditingTargetElements([]);
      setHoverInfo(null);
      setShowSettings(false); // Close settings when toolbar closes
      setPendingMultiSelectElements([]); // Clear multi-select
      legacyMultiSelectRef.current = false; // Reset modifier tracking
      if (isFrozen) {
        unfreezeAnimations();
      }
    }
  }, [isActive, isFrozen, unfreezeAnimations]);

  // Unmount safety — if component is removed while frozen, unfreeze the page
  useEffect(() => {
    return () => {
      unfreezeAll();
    };
  }, []);

  useDisabledControlsPassThrough(isActive, pageEvents);

  // Custom cursor
  useEffect(() => {
    if (!isActive) return;

    const textElementsSelector = [
      "p", "span", "h1", "h2", "h3", "h4", "h5", "h6",
      "li", "td", "th", "label", "blockquote", "figcaption",
      "caption", "legend", "dt", "dd", "pre", "code",
      "em", "strong", "b", "i", "u", "s", "a",
      "time", "address", "cite", "q", "abbr", "dfn",
      "mark", "small", "sub", "sup", "[contenteditable]"
    ].join(", ");

    const style = document.createElement("style");
    style.id = "agentation-cursor";
    // Text elements get text cursor (higher specificity with body prefix)
    // Everything else gets crosshair
    style.textContent = `
      body { cursor: crosshair !important; }
      body :is(${textElementsSelector}) { cursor: text !important; }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById("agentation-cursor");
      if (existingStyle) existingStyle.remove();
    };
  }, [isActive]);


  // Cursor change when hovering a drawing stroke (both draw mode and normal mode)
  useEffect(() => {
    if (hoveredDrawingIdx !== null && isActive) {
      document.documentElement.setAttribute("data-drawing-hover", "");
      return () => document.documentElement.removeAttribute("data-drawing-hover");
    }
  }, [hoveredDrawingIdx, isActive]);

  // Re-evaluate the same point when the deep-selection modifier changes.
  useEffect(() => {
    if (!isActive || pendingAnnotation || editingAnnotation || isDrawMode || isDesignMode) return;
    let lastMouse: { x: number; y: number } | null = null;
    const evaluateHover = (x: number, y: number, piercing: boolean) => {
      const normalElement = deepElementFromPoint(x, y);
      const elementUnder = piercing ? pierceElementFromPoint(x, y) : normalElement;
      if (!elementUnder || closestCrossingShadow(elementUnder,
          "[data-feedback-toolbar], [data-annotation-popup], [data-annotation-marker]")) {
        setHoverInfo(null);
        return;
      }
      const { name, elementName, path, reactComponents } =
        identifyElementWithReact(elementUnder, effectiveReactMode, attributeNames);
      setHoverInfo({ element: name, elementName, elementPath: path,
        rect: viewportRect(elementUnder), reactComponents,
        isPiercing: piercing && elementUnder !== normalElement });
      setHoverPosition({ x, y });
    };
    const handleMouseMove = (e: MouseEvent) => {
      const target = (e.composedPath()[0] || e.target) as HTMLElement;
      if (closestCrossingShadow(target,
          "[data-feedback-toolbar], [data-annotation-popup], [data-annotation-marker]")) {
        lastMouse = null;
        setHoverInfo(null);
        return;
      }
      lastMouse = { x: e.clientX, y: e.clientY };
      evaluateHover(e.clientX, e.clientY, isPrimaryMultiSelectModifierActive(e));
    };
    const handleKeyChange = (e: KeyboardEvent) => {
      if ((e.key === "Meta" || e.key === "Control") && lastMouse) {
        evaluateHover(lastMouse.x, lastMouse.y, isPrimaryMultiSelectModifierActive(e));
      }
    };
    const clearHover = () => { lastMouse = null; setHoverInfo(null); };
    pageEvents.addEventListener("mousemove", handleMouseMove);
    pageEvents.addEventListener("keydown", handleKeyChange);
    pageEvents.addEventListener("keyup", handleKeyChange);
    pageEvents.addEventListener("mouseleave", clearHover);
    window.addEventListener("blur", clearHover);
    return () => {
      pageEvents.removeEventListener("mousemove", handleMouseMove);
      pageEvents.removeEventListener("keydown", handleKeyChange);
      pageEvents.removeEventListener("keyup", handleKeyChange);
      pageEvents.removeEventListener("mouseleave", clearHover);
      window.removeEventListener("blur", clearHover);
    };
  }, [isActive, pendingAnnotation, editingAnnotation, isDrawMode, isDesignMode, effectiveReactMode, attributeNames]);

  // Start editing an annotation (right-click or click on drawing stroke)
  const startEditAnnotation = useCallback((annotation: Annotation, trigger?: HTMLButtonElement) => {
    if (editingAnnotation && !editExiting) {
      editPopupRef.current?.shake();
      return;
    }
    if (pendingAnnotation && !pendingExiting) {
      // Read the current field rather than mirroring its draft in toolbar state.
      const draft = portalWrapperRef.current?.querySelector<HTMLTextAreaElement>(
        "[data-annotation-popup]:not([data-annotation-card]) textarea",
      );
      if (draft?.value.trim()) {
        popupRef.current?.shake();
        return;
      }
      setPendingExiting(true);
    }
    editingTriggerRef.current = trigger ?? null;
    editingFromKeyboardRef.current = trigger?.matches(":focus-visible") ?? false;
    setRestoreEditPreview(false);
    setEditExiting(false);
    setEditingAnnotation(annotation);
    setHoveredMarkerId(null);
    setHoveredTargetElement(null);
    setHoveredTargetElements([]);

    // Try to find elements at the annotation's position(s) for live tracking
    if (annotation.elementBoundingBoxes?.length) {
      // Modifier-click: find element at each bounding box center
      const elements: HTMLElement[] = [];
      for (const bb of annotation.elementBoundingBoxes) {
        const centerX = bb.x + bb.width / 2;
        const centerY = bb.y + bb.height / 2 - window.scrollY;
        const el = annotationElementFromPoint(centerX, centerY, bb);
        if (el) elements.push(el);
      }
      setEditingTargetElements(elements);
      setEditingTargetElement(null);
    } else if (annotation.boundingBox) {
      // Single element
      const bb = annotation.boundingBox;
      const centerX = bb.x + bb.width / 2;
      // Convert document coords to viewport coords (unless fixed)
      const centerY = annotation.isFixed
        ? bb.y + bb.height / 2
        : bb.y + bb.height / 2 - window.scrollY;
      const el = annotationElementFromPoint(centerX, centerY, bb);

      // Validate found element's size roughly matches stored bounding box
      if (el) {
        const elRect = viewportRect(el);
        const widthRatio = elRect.width / bb.width;
        const heightRatio = elRect.height / bb.height;
        if (widthRatio < 0.5 || heightRatio < 0.5) {
          setEditingTargetElement(null);
        } else {
          setEditingTargetElement(el);
        }
      } else {
        setEditingTargetElement(null);
      }
      setEditingTargetElements([]);
    } else {
      setEditingTargetElement(null);
      setEditingTargetElements([]);
    }
  }, [pendingAnnotation, pendingExiting, editingAnnotation, editExiting]);

  // Handle click
  useEffect(() => {
    if (!isActive || isDrawMode || isDesignMode) return;

    const handleClick = (e: MouseEvent) => {
      if (justFinishedDragRef.current) {
        justFinishedDragRef.current = false;
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Use composedPath to get actual target inside shadow DOM, falling back to e.target
      const target = (e.composedPath()[0] || e.target) as HTMLElement;

      if (closestCrossingShadow(target, "[data-feedback-toolbar]")) return;
      if (closestCrossingShadow(target, "[data-annotation-popup]")) return;
      if (closestCrossingShadow(target, "[data-annotation-marker]")) return;

      // Handle modifier-click for multi-element selection
      if (
        isPrimaryMultiSelectModifierActive(e) &&
        !pendingAnnotation &&
        !editingAnnotation
      ) {
        e.preventDefault();
        e.stopPropagation();

        // Read the gesture itself, including keys held before activation.
        legacyMultiSelectRef.current = e.shiftKey;
        const elementUnder = pierceElementFromPoint(e.clientX, e.clientY);
        if (!elementUnder) return;

        const rect = viewportRect(elementUnder);
        const { name, path, reactComponents } = identifyElementWithReact(
          elementUnder,
          effectiveReactMode,
          attributeNames,
        );

        // Toggle: check if already selected
        const existingIndex = pendingMultiSelectElements.findIndex(
          (item) => item.element === elementUnder,
        );

        if (existingIndex >= 0) {
          // Deselect
          setPendingMultiSelectElements((prev) =>
            prev.filter((_, i) => i !== existingIndex),
          );
        } else {
          // Select
          setPendingMultiSelectElements((prev) => [
            ...prev,
            {
              element: elementUnder,
              rect,
              name,
              path,
              reactComponents: reactComponents ?? undefined,
            },
          ]);
        }
        return;
      }

      const isInteractive = closestCrossingShadow(
        target,
        "button, a, input, select, textarea, [role='button'], [onclick]",
      );

      // Block page interactions when enabled. Stop propagation for every
      // target, not just native interactive elements: framework handlers
      // (e.g. a React onClick on a <tr>) are delegated to the root and would
      // otherwise still fire from this capture-phase listener.
      if (settings.blockInteractions) {
        e.preventDefault();
        e.stopPropagation();
        // Still create annotation on the element
      }

      if (pendingAnnotation && !pendingExiting) {
        if (isInteractive && !settings.blockInteractions) {
          return;
        }
        e.preventDefault();
        popupRef.current?.shake();
        return;
      }

      if (editingAnnotation && !editExiting) {
        if (isInteractive && !settings.blockInteractions) {
          return;
        }
        e.preventDefault();
        editPopupRef.current?.shake();
        return;
      }

      e.preventDefault();

      const elementUnder = deepElementFromPoint(e.clientX, e.clientY);
      if (!elementUnder) return;

      const { name, path, reactComponents } = identifyElementWithReact(
        elementUnder,
        effectiveReactMode,
        attributeNames,
      );
      const rect = viewportRect(elementUnder);
      const x = (e.clientX / window.innerWidth) * 100;

      const isFixed = isElementFixed(elementUnder);
      const y = isFixed ? e.clientY : e.clientY + window.scrollY;

      const selection = elementUnder.ownerDocument.defaultView?.getSelection();
      let selectedText: string | undefined;
      if (selection && selection.toString().trim().length > 0) {
        selectedText = selection.toString().trim().slice(0, 500);
      }

      // Capture computed styles - filtered for popup, full for forensic output
      const computedStylesObj = getDetailedComputedStyles(elementUnder);
      const computedStylesStr = getForensicComputedStyles(elementUnder);

      setPendingExiting(false);
      setPendingAnnotation({
        id: Date.now().toString(),
        x,
        y,
        clientY: e.clientY,
        element: name,
        elementPath: path,
        selectedText,
        boundingBox: {
          x: rect.left,
          y: isFixed ? rect.top : rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
        },
        nearbyText: getNearbyText(elementUnder),
        cssClasses: getElementClasses(elementUnder),
        isFixed,
        fullPath: getFullElementPath(elementUnder),
        accessibility: getAccessibilityInfo(elementUnder),
        computedStyles: computedStylesStr,
        computedStylesObj,
        nearbyElements: getNearbyElements(elementUnder),
        reactComponents: reactComponents ?? undefined,
        sourceFile: detectSourceFile(elementUnder),
        attributes: captureElementAttributes(elementUnder, attributeNames),
        frame: captureFrameContext(elementUnder, e.clientX, e.clientY),
        targetElement: elementUnder, // Store for live position queries
      });
      setHoverInfo(null);
    };

    // Use capture phase to intercept before element handlers
    pageEvents.addEventListener("click", handleClick, true);
    return () => pageEvents.removeEventListener("click", handleClick, true);
  }, [
    isActive,
    isDrawMode,
    isDesignMode,
    pendingAnnotation,
    pendingExiting,
    editingAnnotation,
    editExiting,
    settings.blockInteractions,
    effectiveReactMode,
    attributeNames,
    pendingMultiSelectElements,
  ]);

  // Modifier-click multi-select: keyup listener for modifier release
  useEffect(() => {
    if (!isActive) return;

    const handleKeyUp = (e: KeyboardEvent) => {
      const releasedPrimary = (e.key === "Meta" || e.key === "Control") &&
        !isPrimaryMultiSelectModifierActive(e);
      const releasedLegacyShift = e.key === "Shift" && legacyMultiSelectRef.current;
      if ((releasedPrimary || releasedLegacyShift) && !dragStartRef.current &&
          pendingMultiSelectElements.length > 0) {
        createMultiSelectPendingAnnotation();
      }
    };

    const handleBlur = () => {
      legacyMultiSelectRef.current = false;
      setPendingMultiSelectElements([]);
      setHoverInfo(null);
      mouseDownPosRef.current = null;
      dragStartRef.current = null;
      setIsDragging(false);
      highlightsContainerRef.current?.replaceChildren();
    };

    pageEvents.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      pageEvents.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isActive, pendingMultiSelectElements, createMultiSelectPendingAnnotation]);

  // Multi-select drag - mousedown
  useEffect(() => {
    if (!isActive || pendingAnnotation || isDrawMode || isDesignMode) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      justFinishedDragRef.current = false;
      // Use composedPath to get actual target inside shadow DOM
      const target = (e.composedPath()[0] || e.target) as HTMLElement;

      if (closestCrossingShadow(target, "[data-feedback-toolbar]")) return;
      if (closestCrossingShadow(target, "[data-annotation-marker]")) return;
      if (closestCrossingShadow(target, "[data-annotation-popup]")) return;

      // Don't start drag on text elements - allow native text selection
      const textTags = new Set([
        "P",
        "SPAN",
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
        "LI",
        "TD",
        "TH",
        "LABEL",
        "BLOCKQUOTE",
        "FIGCAPTION",
        "CAPTION",
        "LEGEND",
        "DT",
        "DD",
        "PRE",
        "CODE",
        "EM",
        "STRONG",
        "B",
        "I",
        "U",
        "S",
        "A",
        "TIME",
        "ADDRESS",
        "CITE",
        "Q",
        "ABBR",
        "DFN",
        "MARK",
        "SMALL",
        "SUB",
        "SUP",
      ]);

      if (
        !isPrimaryMultiSelectModifierActive(e) &&
        (textTags.has(target.tagName) || target.isContentEditable)
      ) {
        return;
      }

      e.preventDefault(); // Prevent text selection during drag area annotation
      mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
    };

    pageEvents.addEventListener("mousedown", handleMouseDown);
    return () => pageEvents.removeEventListener("mousedown", handleMouseDown);
  }, [isActive, pendingAnnotation, isDrawMode, isDesignMode]);

  // Multi-select drag - mousemove (fully optimized with direct DOM updates)
  useEffect(() => {
    if (!isActive || pendingAnnotation) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseDownPosRef.current) return;

      const dx = e.clientX - mouseDownPosRef.current.x;
      const dy = e.clientY - mouseDownPosRef.current.y;
      const distance = dx * dx + dy * dy;
      const thresholdSq = DRAG_THRESHOLD * DRAG_THRESHOLD;

      if (!isDragging && distance >= thresholdSq) {
        dragStartRef.current = mouseDownPosRef.current;
        setIsDragging(true);
        e.preventDefault(); // Prevent text selection during drag
      }

      if ((isDragging || distance >= thresholdSq) && dragStartRef.current) {
        // Direct DOM update for drag rectangle - no React state
        if (dragRectRef.current) {
          const left = Math.min(dragStartRef.current.x, e.clientX);
          const top = Math.min(dragStartRef.current.y, e.clientY);
          const width = Math.abs(e.clientX - dragStartRef.current.x);
          const height = Math.abs(e.clientY - dragStartRef.current.y);
          dragRectRef.current.style.transform = `translate(${left}px, ${top}px)`;
          dragRectRef.current.style.width = `${width}px`;
          dragRectRef.current.style.height = `${height}px`;
        }

        // Throttle element detection (still no React re-renders)
        const now = Date.now();
        if (now - lastElementUpdateRef.current < ELEMENT_UPDATE_THROTTLE) {
          return;
        }
        lastElementUpdateRef.current = now;

        const startX = dragStartRef.current.x;
        const startY = dragStartRef.current.y;
        const left = Math.min(startX, e.clientX);
        const top = Math.min(startY, e.clientY);
        const right = Math.max(startX, e.clientX);
        const bottom = Math.max(startY, e.clientY);
        const midX = (left + right) / 2;
        const midY = (top + bottom) / 2;

        // Sample corners, edges, and center for element detection
        const candidateElements = new Set<HTMLElement>();
        const points = [
          [left, top],
          [right, top],
          [left, bottom],
          [right, bottom],
          [midX, midY],
          [midX, top],
          [midX, bottom],
          [left, midY],
          [right, midY],
        ];

        for (const [x, y] of points) {
          const elements = withDisabledControlsHittable(() => document.elementsFromPoint(x, y));
          for (const el of elements) {
            if (el instanceof HTMLElement) candidateElements.add(el);
          }
        }

        // Also check nearby elements
        const nearbyElements = pageEvents.querySelectorAll(
          "button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th, div, span, section, article, aside, nav",
        );
        for (const el of nearbyElements) {
          if (el instanceof HTMLElement) {
            const rect = viewportRect(el);
            // Check if element's center point is inside or if it overlaps significantly
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const centerInside =
              centerX >= left &&
              centerX <= right &&
              centerY >= top &&
              centerY <= bottom;

            const overlapX =
              Math.min(rect.right, right) - Math.max(rect.left, left);
            const overlapY =
              Math.min(rect.bottom, bottom) - Math.max(rect.top, top);
            const overlapArea =
              overlapX > 0 && overlapY > 0 ? overlapX * overlapY : 0;
            const elementArea = rect.width * rect.height;
            const overlapRatio =
              elementArea > 0 ? overlapArea / elementArea : 0;

            if (centerInside || overlapRatio > 0.5) {
              candidateElements.add(el);
            }
          }
        }

        const allMatching: DOMRect[] = [];
        const meaningfulTags = new Set([
          "BUTTON",
          "A",
          "INPUT",
          "IMG",
          "P",
          "H1",
          "H2",
          "H3",
          "H4",
          "H5",
          "H6",
          "LI",
          "LABEL",
          "TD",
          "TH",
          "SECTION",
          "ARTICLE",
          "ASIDE",
          "NAV",
        ]);

        for (const el of candidateElements) {
          if (
            closestCrossingShadow(el, "[data-feedback-toolbar]") ||
            closestCrossingShadow(el, "[data-annotation-marker]")
          )
            continue;

          const rect = viewportRect(el);
          if (
            rect.width > window.innerWidth * 0.8 &&
            rect.height > window.innerHeight * 0.5
          )
            continue;
          if (rect.width < 10 || rect.height < 10) continue;

          if (
            rect.left < right &&
            rect.right > left &&
            rect.top < bottom &&
            rect.bottom > top
          ) {
            const tagName = el.tagName;
            let shouldInclude = meaningfulTags.has(tagName);

            // For divs and spans, only include if they have meaningful content
            if (!shouldInclude && (tagName === "DIV" || tagName === "SPAN")) {
              const hasText =
                el.textContent && el.textContent.trim().length > 0;
              const isInteractive =
                el.onclick !== null ||
                el.getAttribute("role") === "button" ||
                el.getAttribute("role") === "link" ||
                el.classList.contains("clickable") ||
                el.hasAttribute("data-clickable");

              if (
                (hasText || isInteractive) &&
                !el.querySelector("p, h1, h2, h3, h4, h5, h6, button, a")
              ) {
                shouldInclude = true;
              }
            }

            if (shouldInclude) {
              // Check if any existing match contains this element (filter children)
              let dominated = false;
              for (const existingRect of allMatching) {
                if (
                  existingRect.left <= rect.left &&
                  existingRect.right >= rect.right &&
                  existingRect.top <= rect.top &&
                  existingRect.bottom >= rect.bottom
                ) {
                  // Existing rect contains this one - keep the smaller one
                  dominated = true;
                  break;
                }
              }
              if (!dominated) allMatching.push(rect);
            }
          }
        }

        // Direct DOM update for highlights - no React state
        if (highlightsContainerRef.current) {
          const container = highlightsContainerRef.current;
          // Reuse existing divs or create new ones
          while (container.children.length > allMatching.length) {
            container.removeChild(container.lastChild!);
          }
          allMatching.forEach((rect, i) => {
            let div = container.children[i] as HTMLDivElement;
            if (!div) {
              div = document.createElement("div");
              div.className = styles.selectedElementHighlight;
              container.appendChild(div);
            }
            div.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
            div.style.width = `${rect.width}px`;
            div.style.height = `${rect.height}px`;
          });
        }
      }
    };

    pageEvents.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => pageEvents.removeEventListener("mousemove", handleMouseMove);
  }, [isActive, pendingAnnotation, isDragging, DRAG_THRESHOLD]);

  // Multi-select drag - mouseup
  useEffect(() => {
    if (!isActive) return;

    const handleMouseUp = (e: MouseEvent) => {
      const wasDragging = isDragging;
      const dragStart = dragStartRef.current;

      if (isDragging && dragStart) {
        justFinishedDragRef.current = true;

        // Do final element detection for accurate count
        const left = Math.min(dragStart.x, e.clientX);
        const top = Math.min(dragStart.y, e.clientY);
        const right = Math.max(dragStart.x, e.clientX);
        const bottom = Math.max(dragStart.y, e.clientY);

        // Query all meaningful elements and check bounding box intersection
        const allMatching: { element: HTMLElement; rect: DOMRect }[] = [];
        const selector =
          "button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th";

        pageEvents.querySelectorAll(selector).forEach((el) => {
          if (!(el instanceof HTMLElement)) return;
          if (
            closestCrossingShadow(el, "[data-feedback-toolbar]") ||
            closestCrossingShadow(el, "[data-annotation-marker]")
          )
            return;

          const rect = viewportRect(el);
          if (
            rect.width > window.innerWidth * 0.8 &&
            rect.height > window.innerHeight * 0.5
          )
            return;
          if (rect.width < 10 || rect.height < 10) return;

          // Check if element intersects with selection
          if (
            rect.left < right &&
            rect.right > left &&
            rect.top < bottom &&
            rect.bottom > top
          ) {
            allMatching.push({ element: el, rect });
          }
        });

        // Filter out parent elements that contain other matched elements
        const finalElements = allMatching.filter(
          ({ element: el }) =>
            !allMatching.some(
              ({ element: other }) => other !== el && el.contains(other),
            ),
        );

        const x = (e.clientX / window.innerWidth) * 100;
        const y = e.clientY + window.scrollY;
        const shouldAccumulateMultiSelect =
          (isPrimaryMultiSelectModifierActive(e) || pendingMultiSelectElements.length > 0) &&
          !pendingAnnotation &&
          !editingAnnotation;

        if (finalElements.length > 0) {
          if (shouldAccumulateMultiSelect) {
            const combined = [...pendingMultiSelectElements];
            for (const { element, rect } of finalElements) {
              if (combined.some(item => item.element === element)) continue;
              const { name, path, reactComponents } = identifyElementWithReact(element, effectiveReactMode, attributeNames);
              combined.push({ element, rect, name, path, reactComponents: reactComponents ?? undefined });
            }
            legacyMultiSelectRef.current = e.shiftKey;
            if (isPrimaryMultiSelectModifierActive(e)) setPendingMultiSelectElements(combined);
            else createMultiSelectPendingAnnotation(combined);
          } else {
            const bounds = finalElements.reduce(
              (acc, { rect }) => ({
                left: Math.min(acc.left, rect.left),
                top: Math.min(acc.top, rect.top),
                right: Math.max(acc.right, rect.right),
                bottom: Math.max(acc.bottom, rect.bottom),
              }),
              {
                left: Infinity,
                top: Infinity,
                right: -Infinity,
                bottom: -Infinity,
              },
            );

            const elementNames = finalElements
              .slice(0, 5)
              .map(({ element }) => identifyElement(element).name)
              .join(", ");
            const suffix =
              finalElements.length > 5
                ? ` +${finalElements.length - 5} more`
                : "";

            // Capture computed styles from first element - filtered for popup, full for forensic output
            const firstElement = finalElements[0].element;
            const firstElementComputedStyles =
              getDetailedComputedStyles(firstElement);
            const firstElementComputedStylesStr =
              getForensicComputedStyles(firstElement);

            setPendingAnnotation({
              id: Date.now().toString(),
              x,
              y,
              clientY: e.clientY,
              element: `${finalElements.length} elements: ${elementNames}${suffix}`,
              elementPath: "multi-select",
              boundingBox: {
                x: bounds.left,
                y: bounds.top + window.scrollY,
                width: bounds.right - bounds.left,
                height: bounds.bottom - bounds.top,
              },
              isMultiSelect: true,
              // Forensic data from first element
              fullPath: getFullElementPath(firstElement),
              accessibility: getAccessibilityInfo(firstElement),
              computedStyles: firstElementComputedStylesStr,
              computedStylesObj: firstElementComputedStyles,
              nearbyElements: getNearbyElements(firstElement),
              cssClasses: getElementClasses(firstElement),
              nearbyText: getNearbyText(firstElement),
              sourceFile: detectSourceFile(firstElement),
        attributes: captureElementAttributes(firstElement, attributeNames),
            });
          }
        } else if (shouldAccumulateMultiSelect && !isPrimaryMultiSelectModifierActive(e)) {
          createMultiSelectPendingAnnotation();
        } else if (!shouldAccumulateMultiSelect) {
          // No elements selected, but allow annotation on empty area
          const width = Math.abs(right - left);
          const height = Math.abs(bottom - top);

          // Only create if drag area is meaningful size (not just a click)
          if (width > 20 && height > 20) {
            setPendingAnnotation({
              id: Date.now().toString(),
              x,
              y,
              clientY: e.clientY,
              element: "Area selection",
              elementPath: `region at (${Math.round(left)}, ${Math.round(top)})`,
              boundingBox: {
                x: left,
                y: top + window.scrollY,
                width,
                height,
              },
              isMultiSelect: true,
            });
          }
        }
        setHoverInfo(null);
      } else if (wasDragging) {
        justFinishedDragRef.current = true;
      }

      mouseDownPosRef.current = null;
      dragStartRef.current = null;
      setIsDragging(false);
      // Clear highlights container
      if (highlightsContainerRef.current) {
        highlightsContainerRef.current.innerHTML = "";
      }
    };

    pageEvents.addEventListener("mouseup", handleMouseUp);
    return () => pageEvents.removeEventListener("mouseup", handleMouseUp);
  }, [
    isActive,
    isDragging,
    pendingAnnotation,
    editingAnnotation,
    effectiveReactMode,
    attributeNames,
    pendingMultiSelectElements,
    createMultiSelectPendingAnnotation,
  ]);

  // Fire webhook for annotation events - returns true on success, false on failure
  const fireWebhook = useCallback(
    async (
      event: string,
      payload: Record<string, unknown>,
      force?: boolean,
    ): Promise<boolean> => {
      // Settings webhookUrl overrides prop
      const targetUrl = settings.webhookUrl || webhookUrl;
      // Skip if no URL, or if webhooks disabled (unless force is true for manual sends)
      if (!targetUrl || (!settings.webhooksEnabled && !force)) return false;

      try {
        const response = await fetch(targetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event,
            timestamp: Date.now(),
            url:
              typeof window !== "undefined" ? window.location.href : undefined,
            ...payload,
          }),
        });
        return response.ok;
      } catch (error) {
        console.warn("[Agentation] Webhook failed:", error);
        return false;
      }
    },
    [webhookUrl, settings.webhookUrl, settings.webhooksEnabled],
  );

  // Add annotation
  const addAnnotation = useCallback(
    (comment: string) => {
      if (!pendingAnnotation || pendingAnnotation.isSubmitted) return;

      const newAnnotation: Annotation = {
        id: pendingAnnotation.id,
        x: pendingAnnotation.x,
        y: pendingAnnotation.y,
        comment,
        element: pendingAnnotation.element,
        elementPath: pendingAnnotation.elementPath,
        timestamp: Date.now(),
        selectedText: pendingAnnotation.selectedText,
        boundingBox: pendingAnnotation.boundingBox,
        nearbyText: pendingAnnotation.nearbyText,
        cssClasses: pendingAnnotation.cssClasses,
        isMultiSelect: pendingAnnotation.isMultiSelect,
        isFixed: pendingAnnotation.isFixed,
        fullPath: pendingAnnotation.fullPath,
        accessibility: pendingAnnotation.accessibility,
        computedStyles: pendingAnnotation.computedStyles,
        nearbyElements: pendingAnnotation.nearbyElements,
        reactComponents: pendingAnnotation.reactComponents,
        sourceFile: pendingAnnotation.sourceFile,
        attributes: pendingAnnotation.attributes,
        frame: pendingAnnotation.frame,
        elementBoundingBoxes: pendingAnnotation.elementBoundingBoxes,
        // Protocol fields for server sync
        ...(endpoint && currentSessionId
          ? {
              sessionId: currentSessionId,
              url:
                typeof window !== "undefined"
                  ? window.location.href
                  : undefined,
              status: "pending" as const,
            }
          : {}),
      };

      setAnnotations((prev) => [...prev, newAnnotation]);
      setPendingAnnotation({ ...pendingAnnotation, isSubmitted: true });
      // Prevent immediate hover on newly added marker
      recentlyAddedIdRef.current = newAnnotation.id;

      // Fire callback
      onAnnotationAdd?.(newAnnotation);
      fireWebhook("annotation.add", { annotation: newAnnotation });

      // Animate out the pending annotation UI
      setPendingExiting(true);

      window.getSelection()?.removeAllRanges();

      // Sync to server (non-blocking, but update local ID with server's ID)
      if (endpoint && currentSessionId) {
        routeTask(async () => {
            const serverAnnotation = await syncPageAnnotation(endpoint, currentSessionId, newAnnotation);
            if (useHashLocation) {
              // Keep the old route's saved ID correct even if its UI unmounted.
              // Read the latest storage so unrelated additions/deletions survive.
              const saved = loadAnnotations<Annotation>(pathname);
              saveAnnotationsWithSyncMarker(pathname, saved.map(a => a.id === newAnnotation.id
                ? { ...a, id: serverAnnotation.id } : a), currentSessionId);
            }
            if (!routeAlive.current || deletedIds.current.has(newAnnotation.id)) return;
            // Update local annotation with server-assigned ID
            if (serverAnnotation.id !== newAnnotation.id) {
              markerKeys.current.set(serverAnnotation.id, newAnnotation.id);
              if (recentlyAddedIdRef.current === newAnnotation.id) recentlyAddedIdRef.current = serverAnnotation.id;
              setAnnotations((prev) =>
                prev.map((a) =>
                  a.id === newAnnotation.id
                    ? { ...a, id: serverAnnotation.id }
                    : a,
                ),
              );
              // Also update the animated markers set
              if (animatedMarkers.current.delete(newAnnotation.id)) {
                animatedMarkers.current.add(serverAnnotation.id);
              }
            }
          })
          .catch((error) => {
            console.warn("[Agentation] Failed to sync annotation:", error);
          });
      }
    },
    [
      pendingAnnotation,
      onAnnotationAdd,
      fireWebhook,
      endpoint,
      currentSessionId,
      routeTask,
      pathname,
      useHashLocation,
    ],
  );

  // Cancel annotation with exit animation
  const cancelAnnotation = useCallback(() => {
    setPendingExiting(true);
  }, []);

  const finishPendingExit = useCallback(() => {
    setPendingAnnotation(null);
    setPendingExiting(false);
  }, []);

  // Delete annotation with exit animation
  const deleteAnnotation = useCallback(
    (id: string) => {
      if (deletedIds.current.has(id)) return;
      deletedIds.current.add(id);
      const deletedAnnotation = annotations.find(a => a.id === id);

      // Close edit panel with exit animation if deleting the annotation being edited
      if (editingAnnotation?.id === id) {
        setRestoreEditPreview(false);
        setEditExiting(true);
      }

      setExitingMarkers((prev) => new Set(prev).add(id));

      // Fire callback
      if (deletedAnnotation) {
        onAnnotationDelete?.(deletedAnnotation);
        fireWebhook("annotation.delete", { annotation: deletedAnnotation });
      }

      // Sync delete to server (non-blocking)
      if (endpoint) {
        routeTask(() => deleteAnnotationFromServer(endpoint, serverIds.current.get(id) ?? id)).catch((error) => {
          console.warn(
            "[Agentation] Failed to delete annotation from server:",
            error,
          );
        });
      }
    },
    [annotations, editingAnnotation, onAnnotationDelete, fireWebhook, endpoint, routeTask],
  );

  // Handle marker hover - finds element(s) for live position tracking
  const handleMarkerHover = useCallback(
    (annotation: Annotation | null) => {
    if (!annotation) {
      setHoveredMarkerId(null);
      setHoveredTargetElement(null);
      setHoveredTargetElements([]);
      return;
    }

    setHoveredMarkerId(annotation.id);

    // Find elements at the annotation's position(s) for live tracking
    if (annotation.elementBoundingBoxes?.length) {
      // Modifier-click: find element at each bounding box center
      const elements: HTMLElement[] = [];
      for (const bb of annotation.elementBoundingBoxes) {
        const centerX = bb.x + bb.width / 2;
        const centerY = bb.y + bb.height / 2 - window.scrollY;
        const el = annotationElementFromPoint(centerX, centerY, bb);
        if (el) elements.push(el);
      }
      setHoveredTargetElements(elements);
      setHoveredTargetElement(null);
    } else if (annotation.boundingBox) {
      // Single element
      const bb = annotation.boundingBox;
      const centerX = bb.x + bb.width / 2;
      const centerY = annotation.isFixed
        ? bb.y + bb.height / 2
        : bb.y + bb.height / 2 - window.scrollY;
      const el = annotationElementFromPoint(centerX, centerY, bb);

      // Validate found element's size roughly matches stored bounding box
      // (prevents using wrong child element when clicking center of a container)
      if (el) {
        const elRect = viewportRect(el);
        const widthRatio = elRect.width / bb.width;
        const heightRatio = elRect.height / bb.height;
        // If found element is much smaller than stored, it's probably a child - don't use it
        if (widthRatio < 0.5 || heightRatio < 0.5) {
          setHoveredTargetElement(null);
        } else {
          setHoveredTargetElement(el);
        }
      } else {
        setHoveredTargetElement(null);
      }
      setHoveredTargetElements([]);
    } else {
      setHoveredTargetElement(null);
      setHoveredTargetElements([]);
    }
    },
    [],
  );

  // Update annotation (edit mode submit)
  const updateAnnotation = useCallback(
    (newComment: string) => {
      if (!editingAnnotation) return;

      const updatedAnnotation = { ...editingAnnotation, comment: newComment };
      setEditingAnnotation(updatedAnnotation);

      setAnnotations((prev) =>
        prev.map((a) =>
          a.id === editingAnnotation.id ? updatedAnnotation : a,
        ),
      );

      // Fire callback
      onAnnotationUpdate?.(updatedAnnotation);
      fireWebhook("annotation.update", { annotation: updatedAnnotation });

      // Sync update to server (non-blocking)
      if (endpoint) {
        routeTask(() => updateAnnotationOnServer(endpoint, serverIds.current.get(editingAnnotation.id) ?? editingAnnotation.id, {
          comment: newComment,
        })).catch((error) => {
          console.warn(
            "[Agentation] Failed to update annotation on server:",
            error,
          );
        });
      }

      // Return to the anchored preview when focus or the pointer belongs there.
      setRestoreEditPreview(editingFromKeyboardRef.current || !!editingTriggerRef.current?.matches(":hover"));
      setEditExiting(true);
    },
    [editingAnnotation, onAnnotationUpdate, fireWebhook, endpoint, routeTask],
  );

  // Cancel editing with exit animation
  const cancelEditAnnotation = useCallback(() => {
    setRestoreEditPreview(editingFromKeyboardRef.current || !!editingTriggerRef.current?.matches(":hover"));
    setEditExiting(true);
  }, []);

  const finishEditExit = useCallback(() => {
    if (restoreEditPreview && editingAnnotation && !pendingAnnotation) setHoveredMarkerId(editingAnnotation.id);
    setEditingAnnotation(null);
    setEditingTargetElement(null);
    setEditingTargetElements([]);
    setEditExiting(false);
  }, [restoreEditPreview, editingAnnotation, pendingAnnotation]);

  const clearLayout = useCallback((placements: DesignPlacement[], rearrange: RearrangeState | null) => {
    if (!placements.length && !rearrange) return;
    setIsClearing(true);
    const layoutBatch = {
      placements: [...clearingLayout.current.placements, ...placements],
      rearrange: rearrange ?? clearingLayout.current.rearrange,
    };
    clearingLayout.current = layoutBatch;
    setClearingPlacements(layoutBatch.placements);
    setClearingRearrange(layoutBatch.rearrange);
    clearTimeout(clearLayoutTimer.current);
    clearLayoutTimer.current = originalSetTimeout(() => {
      setDesignPlacements(previous => previous.filter(p => !layoutBatch.placements.includes(p)));
      setRearrangeState(previous => previous === layoutBatch.rearrange ? null : previous);
      clearingLayout.current = { placements: [], rearrange: null };
      setClearingPlacements([]);
      setClearingRearrange(null);
      clearLayoutTimer.current = undefined;
      finishClearBatch();
    }, 200);
  }, [finishClearBatch]);

  // Clear all with staggered animation
  const clearAll = useCallback(() => {
    if (!routeAlive.current) return;
    // A delayed copy/send completion owns only its original, unchanged notes.
    // `annotations` is the snapshot taken when the action ran; match it against
    // the live list by ID and comment rather than object identity, because a
    // server ID swap or session merge recreates the object. serverIds maps the
    // local ID the snapshot still holds to the ID the server assigned since.
    const live = new Map(currentAnnotationsRef.current.map(note => [note.id, note]));
    const batch: Annotation[] = [];
    for (const note of annotations) {
      const now = live.get(serverIds.current.get(note.id) ?? note.id) ?? live.get(note.id);
      if (now && now.comment === note.comment && !deletedIds.current.has(now.id) && !batch.includes(now)) batch.push(now);
    }
    const count = batch.length;
    const currentLayout = layoutSnapshot.current;
    const placements = designPlacements.filter(p => currentLayout.designPlacements.includes(p) && !clearingLayout.current.placements.includes(p));
    const rearrange = rearrangeState === currentLayout.rearrangeState && rearrangeState !== clearingLayout.current.rearrange ? rearrangeState : null;
    const strokes = drawStrokes.filter(stroke => drawStrokesRef.current.includes(stroke));
    if (count === 0 && strokes.length === 0 && placements.length === 0 && !rearrange) return;
    for (const annotation of batch) {
      deletedIds.current.add(annotation.id);
      clearingIds.current.add(annotation.id);
      pendingClearIds.current.add(annotation.id);
    }
    setExitingMarkers(previous => new Set([...previous, ...batch.map(a => a.id)]));

    onAnnotationsClear?.(batch);
    fireWebhook("annotations.clear", { annotations: batch });

    // Sync deletions to server (non-blocking)
    if (endpoint) {
      Promise.all(
        batch.map((a) =>
          routeTask(() => deleteAnnotationFromServer(endpoint, serverIds.current.get(a.id) ?? a.id)).catch((error) => {
            console.warn(
              "[Agentation] Failed to delete annotation from server:",
              error,
            );
          }),
        ),
      );
    }

    setIsClearing(true);

    setDrawStrokes(previous => previous.filter(stroke => !strokes.includes(stroke)));
    if (strokes.length > 0 && strokes.length === drawStrokesRef.current.length) {
      const canvas = drawCanvasRef.current;
      canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    }

    clearLayout(placements, rearrange);
    if (blankCanvas === currentLayout.blankCanvas && wireframePurpose === currentLayout.wireframePurpose && designPlacements === currentLayout.designPlacements && rearrangeState === currentLayout.rearrangeState) {
      if (blankCanvas) setBlankCanvas(false);
      if (wireframePurpose) setWireframePurpose("");
      wireframeStashRef.current = { rearrange: null, placements: [] };
      clearWireframeState(pathname);
    }
    // Persistence effects save only feedback outside the exiting batch.

    // Visible markers report their actual exits. Hidden markers are completed
    // by the existing removal effect, so neither case needs a count-based wait.
    finishClearBatch();
  }, [pathname, annotations, drawStrokes, designPlacements, rearrangeState, blankCanvas, wireframePurpose, onAnnotationsClear, fireWebhook, endpoint, routeTask, finishClearBatch, clearLayout]);

  // Copy output
  const copyOutput = useCallback(async () => {
    const action = copyAction.start();
    const displayUrl =
      typeof window !== "undefined"
        ? window.location.pathname +
          window.location.search +
          window.location.hash
        : pathname;
    const wireframeOnly = isDesignMode && blankCanvas;

    let output: string;
    if (wireframeOnly) {
      // In wireframe mode, skip annotations and draw strokes — only include layout
      if (designPlacements.length === 0 && !rearrangeState && !wireframePurpose) return;
      output = appName ? generateOutputHeader(displayUrl, appName) : "";
    } else {
      output = generateOutput(
        annotations,
        displayUrl,
        settings.outputDetail,
        { appName },
      );
      if (!output && drawStrokes.length === 0 && designPlacements.length === 0 && !rearrangeState) return;
      if (!output) output = generateOutputHeader(displayUrl, appName);
    }

    // Describe draw strokes as text by detecting elements underneath
    if (!wireframeOnly && drawStrokes.length > 0) {
      // Collect drawing indices that have linked annotations (skip those in standalone section)
      const linkedDrawingIndices = new Set<number>();
      for (const a of annotations) {
        if (a.drawingIndex != null) linkedDrawingIndices.add(a.drawingIndex);
      }

      // Temporarily hide the draw canvas so elementFromPoint hits real page elements
      const canvas = drawCanvasRef.current;
      if (canvas) canvas.style.visibility = "hidden";

      const strokeDescriptions: string[] = [];
      const scrollY = window.scrollY;
      for (let strokeIdx = 0; strokeIdx < drawStrokes.length; strokeIdx++) {
        // Skip strokes that have a linked annotation — their info is in the annotation output
        if (linkedDrawingIndices.has(strokeIdx)) continue;
        const stroke = drawStrokes[strokeIdx];
        if (stroke.points.length < 2) continue;

        // Get viewport coords for analysis (fixed strokes are already in viewport coords)
        const viewportPoints = stroke.fixed
          ? stroke.points
          : stroke.points.map(p => ({ x: p.x, y: p.y - scrollY }));

        // Bounding box (viewport coords)
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const p of viewportPoints) {
          minX = Math.min(minX, p.x);
          minY = Math.min(minY, p.y);
          maxX = Math.max(maxX, p.x);
          maxY = Math.max(maxY, p.y);
        }
        const bboxW = maxX - minX;
        const bboxH = maxY - minY;
        const bboxDiag = Math.hypot(bboxW, bboxH);

        // Start/end analysis
        const start = viewportPoints[0];
        const end = viewportPoints[viewportPoints.length - 1];
        const startEndDist = Math.hypot(end.x - start.x, end.y - start.y);

        // Gesture classification
        let gesture: "circle" | "box" | "underline" | "arrow" | "drawing";
        const closedLoop = startEndDist < bboxDiag * 0.35;
        const aspectRatio = bboxW / Math.max(bboxH, 1);

        if (closedLoop && bboxDiag > 20) {
          // Closed loop — circle vs box: measure how many points hug the bbox edges
          // Box strokes spend time near edges; circles stay more centered
          const edgeThreshold = Math.max(bboxW, bboxH) * 0.15;
          let edgePoints = 0;
          for (const p of viewportPoints) {
            const nearLeft = p.x - minX < edgeThreshold;
            const nearRight = maxX - p.x < edgeThreshold;
            const nearTop = p.y - minY < edgeThreshold;
            const nearBottom = maxY - p.y < edgeThreshold;
            if ((nearLeft || nearRight) && (nearTop || nearBottom)) edgePoints++;
          }
          // If many points are near corners, it's a box
          gesture = edgePoints > viewportPoints.length * 0.15 ? "box" : "circle";
        } else if (aspectRatio > 3 && bboxH < 40) {
          gesture = "underline";
        } else if (startEndDist > bboxDiag * 0.5) {
          gesture = "arrow";
        } else {
          gesture = "drawing";
        }

        // Sample elements along the stroke
        const sampleCount = Math.min(10, viewportPoints.length);
        const step = Math.max(1, Math.floor(viewportPoints.length / sampleCount));
        const seenElements = new Set<HTMLElement>();
        const elementNames: string[] = [];

        const samplePoints = [start];
        for (let i = step; i < viewportPoints.length - 1; i += step) {
          samplePoints.push(viewportPoints[i]);
        }
        samplePoints.push(end);

        for (const p of samplePoints) {
          const el = deepElementFromPoint(p.x, p.y);
          if (!el || seenElements.has(el)) continue;
          if (closestCrossingShadow(el, "[data-feedback-toolbar]")) continue;
          seenElements.add(el);
          const { name } = identifyElement(el);
          if (!elementNames.includes(name)) {
            elementNames.push(name);
          }
        }

        // Format description
        const region = `${Math.round(minX)},${Math.round(minY)} → ${Math.round(maxX)},${Math.round(maxY)}`;
        let desc: string;

        if ((gesture === "circle" || gesture === "box") && elementNames.length > 0) {
          const verb = gesture === "box" ? "Boxed" : "Circled";
          desc = `${verb} **${elementNames[0]}**${elementNames.length > 1 ? ` (and ${elementNames.slice(1).join(", ")})` : ""} (region: ${region})`;
        } else if (gesture === "underline" && elementNames.length > 0) {
          desc = `Underlined **${elementNames[0]}** (${region})`;
        } else if (gesture === "arrow" && elementNames.length >= 2) {
          desc = `Arrow from **${elementNames[0]}** to **${elementNames[elementNames.length - 1]}** (${Math.round(start.x)},${Math.round(start.y)} → ${Math.round(end.x)},${Math.round(end.y)})`;
        } else if (elementNames.length > 0) {
          desc = `${gesture === "arrow" ? "Arrow" : "Drawing"} near **${elementNames.join("**, **")}** (region: ${region})`;
        } else {
          desc = `Drawing at ${region}`;
        }
        strokeDescriptions.push(desc);
      }

      // Restore canvas
      if (canvas) canvas.style.visibility = "";

      if (strokeDescriptions.length > 0) {
        output += `\n**Drawings:**\n`;
        strokeDescriptions.forEach((d, i) => {
          output += `${i + 1}. ${d}\n`;
        });
      }
    }

    // Append design layout section if there are placements (or purpose in wireframe mode)
    if (designPlacements.length > 0 || (wireframeOnly && wireframePurpose)) {
      output += "\n" + generateDesignOutput(designPlacements, {
            width: window.innerWidth,
            height: window.innerHeight,
      }, { blankCanvas, wireframePurpose: wireframePurpose || undefined }, settings.outputDetail);
    }

    // Append rearrange section if sections were reordered
    if (rearrangeState) {
      const rearrangeOutput = generateRearrangeOutput(rearrangeState, settings.outputDetail, {
          width: window.innerWidth,
          height: window.innerHeight,
      });
      if (rearrangeOutput) {
        output += "\n" + rearrangeOutput;
      }
    }

    output = formatCopyOutput(annotations, output, copyFormat);
    // Missing metadata must not clear notes or replace the user's clipboard.
    if (!output) { setCopied(false); return; }
    const copiedOk = !copyToClipboard || await copyTextToClipboard(output);

    // Preserve callback delivery even when the system clipboard is unavailable.
    onCopy?.(output);

    if (!copyAction.isCurrent(action)) return;
    setCopied(copiedOk);
    if (!copiedOk) return;
    copyAction.schedule(action, () => setCopied(false), 2000);

    if (settings.autoClearAfterCopy) {
      copyAction.schedule(action, clearAll, 500);
    }
  }, [
    annotations,
    drawStrokes,
    designPlacements,
    rearrangeState,
    blankCanvas,
    isDesignMode,
    canvasPurpose,
    wireframePurpose,
    pathname,
    settings.outputDetail,
    effectiveReactMode,
    attributeNames,
    settings.autoClearAfterCopy,
    clearAll,
    copyAction,
    copyToClipboard,
    copyFormat,
    appName,
    onCopy,
  ]);

  // Manual "Send Annotations" is available when the host app provides an
  // onSubmit callback, or a webhook target (prop or settings) with auto-send
  // off. Without this, onSubmit-only consumers can never reach the button.
  const hasWebhookTarget =
    isValidUrl(settings.webhookUrl) || isValidUrl(webhookUrl || "");
  const canSend =
    onSubmit != null || (hasWebhookTarget && !settings.webhooksEnabled);
  // Match the CSS surface widths; MCP status does not control Send visibility.
  const toolbarContentWidth = isActive ? (canSend ? 337 : 297) : 44;

  // Send to webhook
  const sendToWebhook = useCallback(async () => {
    const action = sendAction.start();
    const submissionUrl = typeof window !== "undefined" ? window.location.href : pathname;
    const displayUrl =
      typeof window !== "undefined"
        ? window.location.pathname +
          window.location.search +
          window.location.hash
        : pathname;
    let output = generateOutput(
      annotations,
      displayUrl,
      settings.outputDetail,
      { appName },
    );
    if (!output && designPlacements.length === 0 && !rearrangeState) return;
    if (!output) output = generateOutputHeader(displayUrl, appName);

    // Append design layout section if there are placements
    if (designPlacements.length > 0) {
      output += "\n" + generateDesignOutput(designPlacements, {
            width: window.innerWidth,
            height: window.innerHeight,
      }, { blankCanvas, wireframePurpose: wireframePurpose || undefined }, settings.outputDetail);
    }

    // Append rearrange section if sections were reordered
    if (rearrangeState) {
      const rearrangeOutput = generateRearrangeOutput(rearrangeState, settings.outputDetail, {
          width: window.innerWidth,
          height: window.innerHeight,
      });
      if (rearrangeOutput) {
        output += "\n" + rearrangeOutput;
      }
    }

    // Start sending (arrow fades)
    setSendState("sending");

    // A callback can throw or return a rejected promise. Treat that as failed
    // delivery so feedback is retained and the send control can recover.
    let callbackOk = true;
    try {
      await onSubmit?.(output, annotations);
    } catch (error) {
      console.warn("[Agentation] Submit callback failed:", error);
      callbackOk = false;
    }

    if (!sendAction.isCurrent(action)) return;

    // Fire webhook and check result (force=true to bypass webhooksEnabled check for manual sends)
    const webhookOk = hasWebhookTarget
      ? await fireWebhook("submit", { output, annotations, url: submissionUrl }, true)
      : true;
    // Without a webhook target, onSubmit is the delivery mechanism — don't
    // report the webhook no-op as a failure.
    const success = callbackOk && webhookOk && canSend;

    if (!sendAction.isCurrent(action)) return;

    // Show result
    setSendState(success ? "sent" : "failed");
    sendAction.schedule(action, () => setSendState("idle"), 2500);

    // Clear annotations if send succeeded and autoClearAfterCopy is enabled
    if (success && settings.autoClearAfterCopy) {
      sendAction.schedule(action, clearAll, 500);
    }
  }, [
    onSubmit,
    appName,
    fireWebhook,
    annotations,
    designPlacements,
    rearrangeState,
    blankCanvas,
    canvasPurpose,
    pathname,
    settings.outputDetail,
    effectiveReactMode,
    attributeNames,
    settings.autoClearAfterCopy,
    clearAll,
    hasWebhookTarget,
    canSend,
    sendAction,
  ]);

  // Keep release listeners installed before a press. State-driven listener
  // setup can miss a quick mouseup and leave the next pointer movement dragging.
  useEffect(() => {
    const DRAG_THRESHOLD = 10; // pixels

    const endDrag = (released = false) => {
      if (toolbarDragRef.current?.dragging) {
        justFinishedToolbarDragRef.current = released;
        setIsDraggingToolbar(false);
      }
      toolbarDragRef.current = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const dragStartPos = toolbarDragRef.current;
      if (!dragStartPos) return;
      if ((e.buttons & 1) === 0) {
        endDrag();
        return;
      }
      const deltaX = e.clientX - dragStartPos.x;
      const deltaY = e.clientY - dragStartPos.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Start dragging once threshold is exceeded
      if (!dragStartPos.dragging && distance > DRAG_THRESHOLD) {
        dragStartPos.dragging = true;
        setIsDraggingToolbar(true);
      }

      if (dragStartPos.dragging) {
        // Calculate new position
        let newX = dragStartPos.toolbarX + deltaX;
        let newY = dragStartPos.toolbarY + deltaY;

        // Constrain to viewport
        const padding = 20;
        const wrapperWidth = 337; // .toolbar wrapper width
        const toolbarHeight = 44;

        // Content is right-aligned within wrapper via margin-left: auto
        // Calculate content width based on state
        const contentWidth = toolbarContentWidth;

        // Content offset from wrapper left edge
        const contentOffset = wrapperWidth - contentWidth;

        // Min X: content left edge >= padding
        const minX = padding - contentOffset;
        // Max X: wrapper right edge <= viewport - padding
        const maxX = window.innerWidth - padding - wrapperWidth;

        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(
          padding,
          Math.min(window.innerHeight - toolbarHeight - padding, newY),
        );

        setToolbarPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => endDrag(true);
    const handleBlur = () => endDrag();

    pageEvents.addEventListener("mousemove", handleMouseMove);
    pageEvents.addEventListener("mouseup", handleMouseUp, true);
    window.addEventListener("blur", handleBlur);

    return () => {
      pageEvents.removeEventListener("mousemove", handleMouseMove);
      pageEvents.removeEventListener("mouseup", handleMouseUp, true);
      window.removeEventListener("blur", handleBlur);
    };
  }, [toolbarContentWidth]);

  // Handle toolbar drag start
  const handleToolbarMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Ignore only the click generated by a drag's release. Some browsers do
      // not generate that click, so a new press must clear any leftover flag.
      justFinishedToolbarDragRef.current = false;
      toolbarDragRef.current = null;

      // Only drag when clicking the toolbar background (not buttons or settings)
      if (e.button !== 0 ||
        ((e.target as HTMLElement).closest("button") &&
          ((e.target as HTMLElement).closest("button") !== launcherRef.current || isActive)) ||
        (e.target as HTMLElement).closest('[data-agentation-settings-panel]')
      ) {
        return;
      }

      // Don't prevent default yet - let onClick work for collapsed state

      // Get toolbar parent's actual current position (toolbarPosition is applied to parent)
      const toolbarParent = (e.currentTarget as HTMLElement).parentElement;
      if (!toolbarParent) return;

      const rect = viewportRect(toolbarParent);

      toolbarDragRef.current = {
        x: e.clientX,
        y: e.clientY,
        // A viewport correction may still be moving. Grab what is on screen,
        // not the destination stored in state.
        toolbarX: rect.left,
        toolbarY: rect.top,
        dragging: false,
      };
      // Don't set isDraggingToolbar yet - wait for actual movement
    },
    [isActive],
  );

  // Clamp before paint when the surface expands, including Send appearing.
  // Position and width share the same CSS transition, so the edge correction
  // happens together with expansion instead of jumping ahead of it.
  useLayoutEffect(() => {
    if (!toolbarPosition) return;

    const constrainPosition = () => {
      const padding = 20;
      const wrapperWidth = 337; // .toolbar wrapper width
      const toolbarHeight = 44;

      let newX = toolbarPosition.x;
      let newY = toolbarPosition.y;

      // Content is right-aligned within wrapper via margin-left: auto
      // Calculate content width based on state
      const contentWidth = toolbarContentWidth;

      // Content offset from wrapper left edge
      const contentOffset = wrapperWidth - contentWidth;

      // Min X: content left edge >= padding
      const minX = padding - contentOffset;
      // Max X: wrapper right edge <= viewport - padding
      const maxX = window.innerWidth - padding - wrapperWidth;

      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(
        padding,
        Math.min(window.innerHeight - toolbarHeight - padding, newY),
      );

      // Only update if position changed
      if (newX !== toolbarPosition.x || newY !== toolbarPosition.y) {
        setToolbarPosition({ x: newX, y: newY });
      }
    };

    // Constrain immediately when isActive changes or on mount
    constrainPosition();

    window.addEventListener("resize", constrainPosition);
    return () => window.removeEventListener("resize", constrainPosition);
  }, [toolbarPosition, toolbarContentWidth]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!enableKeyboardShortcuts) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.isComposing || e.altKey) return;
      // Document listeners see the shadow host as target. Inspect the original
      // element so typing in web components never triggers toolbar shortcuts.
      const target = (e.composedPath()[0] || e.target) as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      if (e.key === "Escape") {
        if (portalContainer && !pendingAnnotation && !editingAnnotation &&
            (isActive || showSettings || isDesignMode || isDrawMode || pendingMultiSelectElements.length)) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (showSettings) {
          e.preventDefault();
          setShowSettings(false);
          settingsButtonRef.current?.focus();
          return;
        }
        // Exit layout mode first if active
        if (isDesignMode) {
          if (activeDesignComponent) {
            setActiveDesignComponent(null);
          } else {
            closeDesignMode();
          }
          return;
        }
        // Exit draw mode first if active
        if (isDrawMode) {
          setIsDrawMode(false);
          return;
        }
        // Clear multi-select if active
        if (pendingMultiSelectElements.length > 0) {
          setPendingMultiSelectElements([]);
          return;
        }
        if (pendingAnnotation || editingAnnotation) {
          // Let popup handle
        } else if (isActive) {
          hideTooltipsUntilMouseLeave();
          deactivate();
        }
      }

      // Cmd+Shift+F / Ctrl+Shift+F to toggle feedback mode
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "f" || e.key === "F")) {
        e.preventDefault();
        hideTooltipsUntilMouseLeave();
        if (isActive) {
          deactivate();
        } else {
          launcherRef.current?.blur();
          focusControlsOnOpenRef.current = true;
          setIsActive(true);
        }
        return;
      }

      // Single-key shortcuts belong to the expanded toolbar. Skip them when
      // it is collapsed (the host page owns the keyboard then), when typing,
      // or when modifier keys are held.
      if (!isActive || isTyping || e.metaKey || e.ctrlKey) return;

      if (e.repeat) return;

      // "P" to toggle pause/freeze
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        hideTooltipsUntilMouseLeave();
        toggleFreeze();
      }

      // "L" to toggle layout mode
      if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        hideTooltipsUntilMouseLeave();
        if (isDrawMode) setIsDrawMode(false);
        if (showSettings) setShowSettings(false);
        if (pendingAnnotation) cancelAnnotation();
        if (isDesignMode) {
          closeDesignMode();
        } else {
          openDesignMode();
        }
      }

      // "H" to toggle marker visibility
      if (e.key === "h" || e.key === "H") {
        if (annotations.length > 0) {
          e.preventDefault();
          hideTooltipsUntilMouseLeave();
          setShowMarkers((prev) => !prev);
        }
      }

      // "C" to copy output
      if (e.key === "c" || e.key === "C") {
        if (annotations.length > 0 || designPlacements.length > 0 || rearrangeState) {
          e.preventDefault();
          hideTooltipsUntilMouseLeave();
          copyOutput();
        }
      }

      // "X" to clear all
      if (e.key === "x" || e.key === "X") {
        if (annotations.length > 0 || designPlacements.length > 0 || rearrangeState) {
          e.preventDefault();
          hideTooltipsUntilMouseLeave();
          clearAll();
          if (designPlacements.length > 0) setDesignPlacements([]);
          if (rearrangeState) setRearrangeState(null);
        }
      }

      // "S" to send annotations
      if (e.key === "s" || e.key === "S") {
        if (
          annotations.length > 0 &&
          canSend &&
          sendState === "idle"
        ) {
          e.preventDefault();
          hideTooltipsUntilMouseLeave();
          sendToWebhook();
        }
      }
    };

    const capture = !!portalContainer;
    pageEvents.addEventListener("keydown", handleKeyDown, capture);
    return () => pageEvents.removeEventListener("keydown", handleKeyDown, capture);
  }, [
    enableKeyboardShortcuts,
    portalContainer,
    editingAnnotation,
    isActive,
    isDrawMode,
    isDesignMode,
    activeDesignComponent,
    designPlacements,
    rearrangeState,
    pendingAnnotation,
    annotations.length,
    canSend,
    sendState,
    sendToWebhook,
    toggleFreeze,
    copyOutput,
    clearAll,
    pendingMultiSelectElements,
    showSettings,
    deactivate,
    openDesignMode,
    closeDesignMode,
  ]);

  const hasAnnotations = annotations.length > 0;

  // Saved order owns numbering and the badge. Scrolling only changes visibility.
  const projectFrameAnnotation = createFrameProjector();
  const markerAnnotations = annotations.filter(
    (a) => a.kind !== "placement" && a.kind !== "rearrange",
  );
  const visibleAnnotations = markerAnnotations.flatMap((annotation, index) => {
    const projected = projectFrameAnnotation(annotation);
    return projected
      ? [{ annotation: projected, index }]
      : [];
  });
  const pendingMarker = pendingAnnotation && !pendingAnnotation.isSubmitted
    ? projectFrameAnnotation({ ...pendingAnnotation, comment: "", timestamp: 0 }) : null;
  const renderedMarkers = [
    ...(markersVisible ? visibleAnnotations.map(item => ({ ...item, pending: false })) : []),
    ...(pendingMarker ? [{ annotation: pendingMarker, index: markerAnnotations.length, pending: true }] : []),
  ];

  // Hidden markers have no animation to wait for (including offscreen frames).
  useEffect(() => {
    const renderedIds = new Set(markersVisible && !isToolbarHidden
      ? visibleAnnotations.map(({ annotation }) => annotation.id) : []);
    if (recentlyAddedIdRef.current && !renderedIds.has(recentlyAddedIdRef.current)) {
      recentlyAddedIdRef.current = null;
    }
    for (const id of exitingMarkers) {
      if (!renderedIds.has(id)) finishMarkerRemoval(id);
    }
  });
  useEffect(() => {
    if (editingAnnotation && exitingMarkers.has(editingAnnotation.id)) {
      setRestoreEditPreview(false);
      setEditExiting(true);
    }
  }, [editingAnnotation, exitingMarkers]);

  const handleMarkerEnter = useCallback((annotation: Annotation) => {
    if (!markersExiting && annotation.id !== recentlyAddedIdRef.current) {
      handleMarkerHover(annotation);
    }
  }, [markersExiting, handleMarkerHover]);
  const handleMarkerLeave = useCallback((id: string) => {
    // Blur from the previous focus target must not clear a newer pointer hover.
    if (hoveredMarkerId === id) handleMarkerHover(null);
  }, [hoveredMarkerId, handleMarkerHover]);
  const handleMarkerClick = useCallback((annotation: Annotation, trigger: HTMLButtonElement) => {
    if (editingAnnotation && !editExiting) {
      editPopupRef.current?.shake();
      return;
    }
    if (pendingExiting) finishPendingExit();
    if (settings.markerClickBehavior === "delete") deleteAnnotation(annotation.id);
    else startEditAnnotation(annotation, trigger);
  }, [settings.markerClickBehavior, deleteAnnotation, startEditAnnotation, pendingExiting, finishPendingExit, editingAnnotation, editExiting]);

  const cardAnnotation = editingAnnotation ?? (shouldShowMarkers && !pendingAnnotation && !isClearing
    ? annotations.find(a => a.id === hoveredMarkerId && !exitingMarkers.has(a.id)) : null);

  const freezeLabel = isFrozen ? "Resume animations" : "Pause animations";
  const designModeLabel = isDesignMode ? "Exit layout mode" : "Layout mode";
  const markersLabel = showMarkers ? "Hide markers" : "Show markers";
  const metadataCopy = copyFormat !== "markdown";
  const missingCopyMetadata = metadataCopy && !formatCopyOutput(annotations, "", copyFormat);
  const copyLabel = typeof copyFormat === "object" ? `Copy ${copyFormat.attribute}`
    : copyFormat === "source" ? "Copy source paths"
    : copyFormat === "classes" ? "Copy classes"
    : isDesignMode && blankCanvas ? "Copy layout" : "Copy feedback";
  const controlTabIndex = isActive ? 0 : -1;

  if (!mounted) return null;
  if (isToolbarHidden) return null;

  return (
    <ShadowRoot host="agentation-toolbar" className={userClassName}>
      <style data-agentation-styles="toolbar">{shadowCss}{agentationColorTokensCss}</style>
      <div ref={portalWrapperRef} className={styles.positionContext} style={{ display: "contents" }} data-agentation-theme={isDarkMode ? "dark" : "light"} data-agentation-accent={settings.annotationColorId} data-agentation-root="">
          {/* Toolbar */}
          <div
            className={styles.toolbar}
            data-feedback-toolbar
            data-agentation-toolbar
            data-dragging={isDraggingToolbar || undefined}
            style={
              toolbarPosition
                ? {
                    left: toolbarPosition.x,
                    top: toolbarPosition.y,
                    right: "auto",
                    bottom: "auto",
                  }
                : undefined
            }
          >
            {/* Morphing container */}
            <div
              className={`${styles.toolbarContainer} ${isActive ? styles.expanded : styles.collapsed} ${showEntranceAnimation ? styles.entrance : ""} ${isToolbarHiding ? styles.hiding : ""} ${canSend ? styles.serverConnected : ""}`}
              onMouseDown={handleToolbarMouseDown}
            >
              {/* Controls content - visible when expanded */}
              <div
                className={`${styles.controlsContent} ${isActive ? styles.visible : styles.hidden} ${
                  toolbarPosition && toolbarPosition.y < 100
                    ? styles.tooltipBelow
                    : ""
                } ${tooltipsHidden || showSettings ? styles.tooltipsHidden : ""} ${tooltipSessionActive ? styles.tooltipsInSession : ""}`}
                ref={(node) => {
                  controlsRef.current = node;
                  node?.toggleAttribute("inert", !isActive);
                }}
                role="group"
                aria-label="Feedback controls"
                aria-hidden={!isActive}
                onMouseEnter={handleControlsMouseEnter}
                onMouseLeave={handleControlsMouseLeave}
              >
                <div
                  className={`${styles.buttonWrapper} ${
                    toolbarPosition && toolbarPosition.x < 120
                      ? styles.buttonWrapperAlignLeft
                      : ""
                  }`}
                >
                  <button
                    className={styles.controlButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      hideTooltipsUntilMouseLeave();
                      toggleFreeze();
                    }}
                    data-active={isFrozen}
                    aria-label={freezeLabel}
                    aria-pressed={isFrozen}
                    tabIndex={controlTabIndex}
                  >
                    <IconPausePlayAnimated size={24} isPaused={isFrozen} />
                  </button>
                  <span className={styles.buttonTooltip}>
                    {freezeLabel}
                    {enableKeyboardShortcuts && <span className={styles.shortcut}>P</span>}
                  </span>
                </div>

                {/* Draw mode disabled for now
                <div className={styles.buttonWrapper}>
                  <button
                    className={`${styles.controlButton} ${!isDarkMode ? styles.light : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      hideTooltipsUntilMouseLeave();
                      if (isDesignMode) closeDesignMode();
                      setIsDrawMode(prev => !prev);
                    }}
                    data-active={isDrawMode}
                  >
                    <IconPencil size={24} />
                  </button>
                  <span className={styles.buttonTooltip}>
                    {isDrawMode ? "Exit draw mode" : "Draw mode"}
                    {enableKeyboardShortcuts && <span className={styles.shortcut}>D</span>}
                  </span>
                </div>
                */}

                <div className={styles.buttonWrapper}>
                  <button
                    className={`${styles.controlButton} ${!isDarkMode ? styles.light : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      hideTooltipsUntilMouseLeave();
                      if (isDrawMode) setIsDrawMode(false);
                      if (showSettings) setShowSettings(false);
                      if (pendingAnnotation) cancelAnnotation();
                      if (isDesignMode) {
                        closeDesignMode();
                      } else {
                        openDesignMode();
                      }
                    }}
                    data-active={isDesignMode}
                    aria-label={designModeLabel}
                    aria-pressed={isDesignMode}
                    tabIndex={controlTabIndex}
                  style={isDesignMode && blankCanvas ? { color: '#f97316', background: 'rgba(249, 115, 22, 0.25)' } : undefined}
                  >
                    <IconLayout size={21} />
                  </button>
                  <span className={styles.buttonTooltip}>
                    {designModeLabel}
                    {enableKeyboardShortcuts && <span className={styles.shortcut}>L</span>}
                  </span>
                </div>

                <div className={styles.buttonWrapper}>
                  <button
                    className={styles.controlButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      hideTooltipsUntilMouseLeave();
                      setShowMarkers(!showMarkers);
                    }}
                    disabled={!hasAnnotations || isDesignMode}
                    aria-label={markersLabel}
                    tabIndex={controlTabIndex}
                  >
                    <IconEyeAnimated size={24} isOpen={showMarkers} />
                  </button>
                  <span className={styles.buttonTooltip}>
                    {markersLabel}
                    {enableKeyboardShortcuts && <span className={styles.shortcut}>H</span>}
                  </span>
                </div>

                <div className={styles.buttonWrapper}>
                  <button
                    className={`${styles.controlButton} ${copied ? styles.statusShowing : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      hideTooltipsUntilMouseLeave();
                      copyOutput();
                    }}
                  disabled={missingCopyMetadata || (isDesignMode && blankCanvas
                    ? designPlacements.length === 0 && !(rearrangeState?.sections?.length)
                    : !hasAnnotations && drawStrokes.length === 0 && designPlacements.length === 0 && !(rearrangeState?.sections?.length))}
                    data-active={copied}
                    aria-label={copyLabel}
                    tabIndex={controlTabIndex}
                  >
                  <IconCopyAnimated size={24} copied={copied} tint={isDesignMode && blankCanvas && (designPlacements.length > 0 || !!(rearrangeState?.sections?.length)) ? "#f97316" : undefined} />
                  </button>
                  <span className={styles.buttonTooltip}>
                  {missingCopyMetadata ? "No matching metadata" : copyLabel}
                    {enableKeyboardShortcuts && <span className={styles.shortcut}>C</span>}
                  </span>
                </div>

                {/* Send button - visible when onSubmit is provided, or a webhook URL is available AND auto-send is off */}
                <div
                  className={`${styles.buttonWrapper} ${styles.sendButtonWrapper} ${isActive && canSend ? styles.sendButtonVisible : ""}`}
                >
                  <button
                    className={`${styles.controlButton} ${sendState === "sent" || sendState === "failed" ? styles.statusShowing : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      hideTooltipsUntilMouseLeave();
                      sendToWebhook();
                    }}
                    disabled={
                      !hasAnnotations || !canSend || sendState === "sending"
                    }
                    data-no-hover={sendState === "sent" || sendState === "failed"}
                    tabIndex={isActive && canSend ? 0 : -1}
                    aria-label="Send Annotations"
                    aria-hidden={!canSend}
                  >
                    <IconSendArrow size={24} state={sendState} />
                    {hasAnnotations && sendState === "idle" && (
                    <span
                      className={styles.buttonBadge}
                    >
                        {annotations.length}
                      </span>
                    )}
                  </button>
                  <span className={styles.buttonTooltip}>
                    Send Annotations
                    {enableKeyboardShortcuts && <span className={styles.shortcut}>S</span>}
                  </span>
                </div>

                <div className={styles.buttonWrapper}>
                  <button
                    className={styles.controlButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      hideTooltipsUntilMouseLeave();
                      clearAll();
                    }}
                  disabled={!hasAnnotations && drawStrokes.length === 0 && designPlacements.length === 0 && !(rearrangeState?.sections?.length)}
                    data-danger
                    aria-label="Clear all"
                    tabIndex={controlTabIndex}
                  >
                    <IconTrashAlt size={24} />
                  </button>
                  <span className={styles.buttonTooltip}>
                    Clear all
                    {enableKeyboardShortcuts && <span className={styles.shortcut}>X</span>}
                  </span>
                </div>

                <div className={styles.buttonWrapper}>
                  <button
                    ref={settingsButtonRef}
                    aria-label="Settings"
                    aria-expanded={showSettings}
                    tabIndex={controlTabIndex}
                    className={styles.controlButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      hideTooltipsUntilMouseLeave();
                      if (isDesignMode) closeDesignMode();
                      focusSettingsOnOpenRef.current = !showSettings && e.detail === 0;
                      setShowSettings(!showSettings);
                    }}
                  >
                    <IconGear size={24} />
                  </button>
                  {endpoint && connectionStatus !== "disconnected" && (
                    <span
                      className={`${styles.mcpIndicator} ${styles[connectionStatus]} ${showSettings ? styles.hidden : ""}`}
                      title={
                        connectionStatus === "connected"
                          ? "MCP Connected"
                          : "MCP Connecting..."
                      }
                    />
                  )}
                  <span className={styles.buttonTooltip}>Settings</span>
                </div>

              <div
                className={styles.divider}
              />

                <div className={styles.togglePlaceholder} aria-hidden="true" />
              </div>

              {/* One persistent button and icon in the right end cap. */}
              <div
                className={`${styles.buttonWrapper} ${styles.toggleWrapper} ${
                  toolbarPosition && toolbarPosition.y < 100 ? styles.tooltipBelow : ""
                } ${!isActive || tooltipsHidden || showSettings ? styles.tooltipsHidden : ""} ${tooltipSessionActive ? styles.tooltipsInSession : ""} ${
                  toolbarPosition && typeof window !== "undefined" && toolbarPosition.x > window.innerWidth - 120
                    ? styles.buttonWrapperAlignRight : ""
                }`}
                onMouseEnter={handleControlsMouseEnter}
                onMouseLeave={handleControlsMouseLeave}
              >
                <button
                  ref={launcherRef}
                  type="button"
                  className={`${styles.toggleContent} ${isActive ? styles.expandedToggle : ""}`}
                  aria-label={isActive ? "Exit" : "Start feedback mode"}
                  aria-expanded={isActive}
                  aria-keyshortcuts={enableKeyboardShortcuts ? "Meta+Shift+F Control+Shift+F" : undefined}
                  title={isActive ? undefined : enableKeyboardShortcuts ? "Start feedback mode (⌘⇧F / Ctrl+Shift+F)" : "Start feedback mode"}
                  onClick={(e) => {
                    if (justFinishedToolbarDragRef.current) {
                      justFinishedToolbarDragRef.current = false;
                      e.preventDefault();
                      return;
                    }
                    e.stopPropagation();
                    if (isActive) {
                      hideTooltipsUntilMouseLeave();
                      deactivate();
                    } else {
                      e.currentTarget.blur();
                      focusControlsOnOpenRef.current = e.detail === 0;
                      setIsActive(true);
                    }
                  }}
                >
                  <span className={styles.toggleIcon}>
                    <ToolbarToggleIcon active={isActive} />
                    {markerAnnotations.length > 0 && (
                      <span className={`${styles.badge} ${isActive ? styles.fadeOut : ""} ${showEntranceAnimation ? styles.entrance : ""}`}>
                        {markerAnnotations.length}
                      </span>
                    )}
                  </span>
                </button>
                <span className={styles.buttonTooltip} aria-hidden={!isActive}>
                  Exit{enableKeyboardShortcuts && <span className={styles.shortcut}>Esc</span>}
                </span>
              </div>

              {/* Layout Mode Palette */}
              <DesignPalette
                visible={isDesignMode && isActive}
                activeType={activeDesignComponent}
                onSelect={(type) => {
                  setActiveDesignComponent(activeDesignComponent === type ? null : type);
                }}
                isDarkMode={isDarkMode}
                sectionCount={rearrangeState?.sections.length ?? 0}
                onDetectSections={() => {
                  const sections = detectPageSections();
                  const existing = rearrangeState?.sections ?? [];
                  const existingSelectors = new Set(existing.map(s => s.selector));
                  const newSections = sections.filter(s => !existingSelectors.has(s.selector));
                  const merged = [...existing, ...newSections];
                  const mergedOrder = [...(rearrangeState?.originalOrder ?? []), ...newSections.map(s => s.id)];
                  setRearrangeState({
                    sections: merged,
                    originalOrder: mergedOrder,
                    detectedAt: Date.now(),
                  });
                }}
                placementCount={designPlacements.length}
                onClearPlacements={() => {
                  clearLayout(designPlacements, rearrangeState);
                }}
                blankCanvas={blankCanvas}
                onBlankCanvasChange={(on) => {
                  const emptyRearrange = { sections: [], originalOrder: [], detectedAt: Date.now() };
                  if (on) {
                    // Entering wireframe: stash all explore state, restore wireframe state
                    exploreStashRef.current = { rearrange: rearrangeState, placements: designPlacements };
                    setRearrangeState(wireframeStashRef.current.rearrange || emptyRearrange);
                    setDesignPlacements(wireframeStashRef.current.placements);
                    setActiveDesignComponent(null);
                  } else {
                    // Leaving wireframe: stash all wireframe state, restore explore state
                    wireframeStashRef.current = { rearrange: rearrangeState, placements: designPlacements };
                    setRearrangeState(exploreStashRef.current.rearrange || emptyRearrange);
                    setDesignPlacements(exploreStashRef.current.placements);
                  }
                  setBlankCanvas(on);
                }}
                wireframePurpose={wireframePurpose}
                onWireframePurposeChange={setWireframePurpose}
                Tooltip={HelpTooltip}
                onDragStart={(type, e) => {
                  e.preventDefault();
                  const def = DEFAULT_SIZES[type];
                  let preview: HTMLDivElement | null = null;
                  let didDrag = false;
                  const startX = e.clientX;
                  const startY = e.clientY;

                  // Find toolbar bottom for distance-based scaling
                  const toolbar = (e.target as HTMLElement).closest("[data-feedback-toolbar]");
                  const toolbarTop = toolbar?.getBoundingClientRect().top ?? window.innerHeight;

                  const onMove = (ev: MouseEvent) => {
                    const dx = ev.clientX - startX;
                    const dy = ev.clientY - startY;

                    if (!didDrag && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
                      didDrag = true;
                      preview = document.createElement("div");
                      preview.className = `${designStyles.dragPreview}${blankCanvas ? ` ${designStyles.dragPreviewWireframe}` : ""}`;
                      portalWrapperRef.current?.appendChild(preview);
                    }

                    if (!preview) return;

                    // Scale up as cursor moves away from toolbar
                    const dist = Math.max(0, toolbarTop - ev.clientY);
                    const progress = Math.min(1, dist / 180);
                    const eased = 1 - Math.pow(1 - progress, 2); // ease-out

                    const minW = 28;
                    const minH = 20;
                    const maxW = Math.min(140, def.width * 0.18);
                    const maxH = Math.min(90, def.height * 0.18);
                    const w = minW + (maxW - minW) * eased;
                    const h = minH + (maxH - minH) * eased;

                    preview.style.width = `${w}px`;
                    preview.style.height = `${h}px`;
                    preview.style.left = `${ev.clientX - w / 2}px`;
                    preview.style.top = `${ev.clientY - h / 2}px`;
                    preview.style.opacity = `${0.5 + 0.5 * eased}`;
                    preview.textContent = eased > 0.25 ? type : "";
                  };

                  const onUp = (ev: MouseEvent) => {
                    window.removeEventListener("mousemove", onMove);
                    window.removeEventListener("mouseup", onUp);
                    if (preview) preview.remove();

                    if (didDrag) {
                      const w = def.width;
                      const h = def.height;
                      const scrollY = window.scrollY;
                      const x = Math.max(0, ev.clientX - w / 2);
                      const y = Math.max(0, ev.clientY + scrollY - h / 2);
                      const placement: DesignPlacement = {
                        id: `dp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                        type,
                        x,
                        y,
                        width: w,
                        height: h,
                        scrollY,
                        timestamp: Date.now(),
                      };
                      setDesignPlacements((prev) => [...prev, placement]);
                      setActiveDesignComponent(null);
                      // Deselect any previously selected placements
                      designSelectedIdsRef.current = new Set();
                      setDesignDeselectSignal(n => n + 1);
                    }
                  };

                  window.addEventListener("mousemove", onMove);
                  window.addEventListener("mouseup", onUp);
                }}
              />

              <SettingsPanel
                settings={settings}
                onSettingsChange={updateSettings}
                isDarkMode={isDarkMode}
                onToggleTheme={toggleTheme}
                isDevMode={isDevMode}
                connectionStatus={connectionStatus}
                endpoint={endpoint}
                onExited={finishSettingsExit}
                isOpen={isActive && showSettings}
                toolbarNearBottom={!!toolbarPosition && toolbarPosition.y < 230}
                settingsPage={settingsPage}
                onSettingsPageChange={setSettingsPage}
                onHideToolbar={hideToolbarTemporarily}
              />
            </div>
          </div>

          {/* Blank canvas backdrop — stays mounted so opacity transition works on open/close */}
          {(isDesignMode || designOverlayExiting) && (
            <div
              className={`${designStyles.blankCanvas} ${canvasReady ? designStyles.visible : ""} ${designInteracting ? designStyles.gridActive : ""}`}
            style={{ '--canvas-opacity': canvasOpacity } as React.CSSProperties}
              data-feedback-toolbar
            />
          )}

          {/* Wireframe hint — bottom-left notice */}
          {isDesignMode && blankCanvas && canvasReady && (
            <div className={designStyles.wireframeNotice} data-feedback-toolbar>
              <div className={designStyles.wireframeOpacityRow}>
              <span className={designStyles.wireframeOpacityLabel}>Toggle Opacity</span>
                <input
                  type="range"
                  className={designStyles.wireframeOpacitySlider}
                  min={0}
                  max={1}
                  step={0.01}
                  value={canvasOpacity}
                  onChange={(e) => setCanvasOpacity(Number(e.target.value))}
                />
              </div>
              <div className={designStyles.wireframeNoticeTitleRow}>
              <span className={designStyles.wireframeNoticeTitle}>Wireframe Mode</span>
                <span className={designStyles.wireframeNoticeDivider} />
                <button
                  className={designStyles.wireframeStartOver}
                  onClick={() => {
                  clearLayout(designPlacements, rearrangeState);
                  wireframeStashRef.current = { rearrange: null, placements: [] };
                    setWireframePurpose("");
                    clearWireframeState(pathname);
                  }}
                >
                  Start Over
                </button>
              </div>
            Drag components onto the canvas.<br />Copied output will only include the wireframed layout.
            </div>
          )}

          {/* Layout mode overlay — passthrough when no component selected */}
          {(isDesignMode || designOverlayExiting) && (
            <DesignMode
              placements={designPlacements}
              onChange={setDesignPlacements}
              activeComponent={
                designOverlayExiting ? null : activeDesignComponent
              }
              onActiveComponentChange={setActiveDesignComponent}
              isDarkMode={isDarkMode}
              exiting={designOverlayExiting}
              onInteractionChange={setDesignInteracting}
              passthrough={!activeDesignComponent}
              extraSnapRects={rearrangeState?.sections.map((s) => s.currentRect)}
              deselectSignal={designDeselectSignal}
              clearingPlacements={clearingPlacements}
              wireframe={blankCanvas}
              onSelectionChange={(ids, isShift) => {
                designSelectedIdsRef.current = ids;
                if (!isShift) {
                  rearrangeSelectedIdsRef.current = new Set();
                  setRearrangeDeselectSignal(n => n + 1);
                }
              }}
              onDragMove={(dx, dy) => {
                // Move selected rearrange sections by same delta
                const selIds = rearrangeSelectedIdsRef.current;
                if (!selIds.size || !rearrangeState) return;
                // Cache start positions on first move
                if (!crossDragStartRef.current) {
                  crossDragStartRef.current = new Map();
                  for (const s of rearrangeState.sections) {
                    if (selIds.has(s.id)) {
                      crossDragStartRef.current.set(s.id, { x: s.currentRect.x, y: s.currentRect.y });
                    }
                  }
                }
                for (const s of rearrangeState.sections) {
                  if (!selIds.has(s.id)) continue;
                  const start = crossDragStartRef.current.get(s.id);
                  if (!start) continue;
                  const outlineEl = portalWrapperRef.current?.querySelector<HTMLElement>(`[data-rearrange-section="${s.id}"]`);
                  if (outlineEl) outlineEl.style.transform = `translate(${dx}px, ${dy}px)`;
                }
              }}
              onDragEnd={(dx, dy, committed) => {
                const selIds = rearrangeSelectedIdsRef.current;
                const starts = crossDragStartRef.current;
                crossDragStartRef.current = null;
                if (!selIds.size || !rearrangeState || !starts) return;
                // Clear outline transforms
                for (const id of selIds) {
                  const el = portalWrapperRef.current?.querySelector<HTMLElement>(`[data-rearrange-section="${id}"]`);
                  if (el) el.style.transform = "";
                }
                if (committed) {
                  setRearrangeState(prev => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      sections: prev.sections.map(s => {
                        const start = starts.get(s.id);
                        if (!start) return s;
                        return { ...s, currentRect: { ...s.currentRect, x: Math.max(0, start.x + dx), y: Math.max(0, start.y + dy) } };
                      }),
                    };
                  });
                }
              }}
            />
          )}

          {/* Rearrange overlay — always active alongside design overlay */}
          {(isDesignMode || designOverlayExiting) && rearrangeState && (
            <RearrangeOverlay
              rearrangeState={rearrangeState}
              onChange={setRearrangeState}
              isDarkMode={isDarkMode}
              exiting={designOverlayExiting}
              blankCanvas={blankCanvas}
              extraSnapRects={designPlacements.map(p => ({ x: p.x, y: p.y, width: p.width, height: p.height }))}
              clearing={rearrangeState === clearingRearrange}
              deselectSignal={rearrangeDeselectSignal}
              onSelectionChange={(ids, isShift) => {
                rearrangeSelectedIdsRef.current = ids;
                if (!isShift) {
                  designSelectedIdsRef.current = new Set();
                  setDesignDeselectSignal(n => n + 1);
                }
              }}
              onDragMove={(dx, dy) => {
                // Move selected design placements by same delta
                const selIds = designSelectedIdsRef.current;
                if (!selIds.size) return;
                // Cache start positions on first move
                if (!crossDragStartRef.current) {
                  crossDragStartRef.current = new Map();
                  for (const p of designPlacements) {
                    if (selIds.has(p.id)) {
                      crossDragStartRef.current.set(p.id, { x: p.x, y: p.y });
                    }
                  }
                }
                // Imperatively move placement divs
                for (const id of selIds) {
                  const el = portalWrapperRef.current?.querySelector<HTMLElement>(`[data-design-placement="${id}"]`);
                  if (el) el.style.transform = `translate(${dx}px, ${dy}px)`;
                }
              }}
              onDragEnd={(dx, dy, committed) => {
                const selIds = designSelectedIdsRef.current;
                const starts = crossDragStartRef.current;
                crossDragStartRef.current = null;
                if (!selIds.size || !starts) return;
                // Clear transforms
                for (const id of selIds) {
                  const el = portalWrapperRef.current?.querySelector<HTMLElement>(`[data-design-placement="${id}"]`);
                  if (el) el.style.transform = "";
                }
                if (committed) {
                  setDesignPlacements(prev => prev.map(p => {
                    const start = starts.get(p.id);
                    if (!start) return p;
                    return { ...p, x: Math.max(0, start.x + dx), y: Math.max(0, start.y + dy) };
                  }));
                }
              }}
            />
          )}

          {/* Draw canvas — outside overlay so it can fade on toolbar close */}
          <canvas
            ref={drawCanvasRef}
            className={`${styles.drawCanvas} ${isDrawMode ? styles.active : ""}`}
            aria-hidden="true"
          style={{ opacity: shouldShowMarkers ? 1 : 0, transition: "opacity 0.15s ease" }}
            data-feedback-toolbar
          />

          {/* Markers layer - normal scrolling markers */}
          <div className={styles.markersLayer} data-feedback-toolbar>
            {renderedMarkers
                .filter(({ annotation }) => !annotation.isFixed)
                .map(({ annotation, index, pending }, layerIndex, arr) => (
                  <AnnotationMarker
                    key={markerKeys.current.get(annotation.id) ?? annotation.id}
                    annotation={annotation}
                    pending={pending}
                    globalIndex={index}
                    layerIndex={layerIndex}
                    layerSize={arr.length}
                    isExiting={pending ? pendingExiting : markersExiting}
                    isClearing={clearingIds.current.has(annotation.id)}
                    isAnimated={animatedMarkers.current.has(annotation.id)}
                    isNew={recentlyAddedIdRef.current === annotation.id}
                    onEnterComplete={handleMarkerEntered}
                    isHovered={!markersExiting && hoveredMarkerId === annotation.id}
                    isRemoving={exitingMarkers.has(annotation.id)}
                    onRemoveComplete={finishMarkerRemoval}
                    isEditingAny={!!editingAnnotation}
                    renumberFrom={renumberFrom}
                    markerClickBehavior={settings.markerClickBehavior}
                    onHoverEnter={handleMarkerEnter}
                    onHoverLeave={handleMarkerLeave}
                    onClick={handleMarkerClick}
                    onContextMenu={startEditAnnotation}
                  />
                ))}

          </div>

          {/* Fixed markers layer */}
          <div className={styles.fixedMarkersLayer} data-feedback-toolbar>
            {renderedMarkers
                .filter(({ annotation }) => annotation.isFixed)
                .map(({ annotation, index, pending }, layerIndex, arr) => (
                  <AnnotationMarker
                    key={markerKeys.current.get(annotation.id) ?? annotation.id}
                    annotation={annotation}
                    pending={pending}
                    globalIndex={index}
                    layerIndex={layerIndex}
                    layerSize={arr.length}
                    isExiting={pending ? pendingExiting : markersExiting}
                    isClearing={clearingIds.current.has(annotation.id)}
                    isAnimated={animatedMarkers.current.has(annotation.id)}
                    isNew={recentlyAddedIdRef.current === annotation.id}
                    onEnterComplete={handleMarkerEntered}
                    isHovered={!markersExiting && hoveredMarkerId === annotation.id}
                    isRemoving={exitingMarkers.has(annotation.id)}
                    onRemoveComplete={finishMarkerRemoval}
                    isEditingAny={!!editingAnnotation}
                    renumberFrom={renumberFrom}
                    markerClickBehavior={settings.markerClickBehavior}
                    onHoverEnter={handleMarkerEnter}
                    onHoverLeave={handleMarkerLeave}
                    onClick={handleMarkerClick}
                    onContextMenu={startEditAnnotation}
                  />
                ))}

          </div>


          {/* Labels sit above saved markers, independently of the highlight layer. */}
          {isActive && hoverInfo && !pendingAnnotation && !editingAnnotation && !isScrolling && !isDragging && (
            <HoverTooltip
              x={hoverPosition.x}
              y={hoverPosition.y}
              elementName={hoverInfo.elementName}
              reactComponents={hoverInfo.reactComponents}
            />
          )}

          {/* Interactive overlay */}
          {isActive && (
            <div
              className={styles.overlay}
              data-feedback-toolbar
              // Sharing the toolbar layer puts this later sibling above it,
              // including when consumers override className z-index.
              style={
                pendingAnnotation || editingAnnotation
                  ? { zIndex: "inherit" }
                  : undefined
              }
            >
              {/* Hover highlight */}
              {hoverInfo?.rect &&
                !pendingAnnotation &&
                !isScrolling &&
                !isDragging && (
                  <div
                    className={`${styles.hoverHighlight} ${styles.enter}`}
                    style={{
                      left: hoverInfo.rect.left,
                      top: hoverInfo.rect.top,
                      width: hoverInfo.rect.width,
                      height: hoverInfo.rect.height,
                    borderColor: "color-mix(in srgb, var(--agentation-color-accent) 50%, transparent)",
                    backgroundColor: "color-mix(in srgb, var(--agentation-color-accent) 4%, transparent)",
                    ...(hoverInfo.isPiercing ? { borderStyle: "dashed" } : {}),
                    }}
                  />
                )}

              {/* Modifier-click multi-select highlights (during selection, before releasing modifiers) */}
              {pendingMultiSelectElements
                .filter((item) => item.element.isConnected)
                .map((item, index) => {
                  const rect = viewportRect(item.element);
                  // Only show green if 2+ elements selected, otherwise use default blue
                  const isMulti = pendingMultiSelectElements.length > 1;
                  return (
                    <div
                      key={index}
                      className={
                        isMulti
                          ? styles.multiSelectOutline
                          : styles.singleSelectOutline
                      }
                      style={{
                        position: "fixed",
                        left: rect.left,
                        top: rect.top,
                        width: rect.width,
                        height: rect.height,
                        ...(isMulti
                          ? {}
                          : {
                            borderColor: "color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)",
                            backgroundColor: "color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)",
                            }),
                      }}
                    />
                  );
                })}

              {/* Marker hover outline (shows bounding box of hovered annotation) */}
              {hoveredMarkerId &&
                !pendingAnnotation &&
                (() => {
                  const hoveredAnnotation = annotations.find(
                    (a) => a.id === hoveredMarkerId,
                  );
                  if (!hoveredAnnotation?.boundingBox) return null;

                  // Render individual element boxes if available (modifier-click multi-select)
                  if (hoveredAnnotation.elementBoundingBoxes?.length) {
                    // Use live positions from hoveredTargetElements when available
                    if (hoveredTargetElements.length > 0) {
                      return hoveredTargetElements
                        .filter((el) => el.isConnected)
                        .map((el, index) => {
                          const rect = viewportRect(el);
                          return (
                            <div
                              key={`hover-outline-live-${index}`}
                              className={`${styles.multiSelectOutline} ${styles.enter}`}
                              style={{
                                left: rect.left,
                                top: rect.top,
                                width: rect.width,
                                height: rect.height,
                              }}
                            />
                          );
                        });
                    }
                    // Fallback to stored bounding boxes
                    return hoveredAnnotation.elementBoundingBoxes.map(
                      (bb, index) => (
                        <div
                          key={`hover-outline-${index}`}
                          className={`${styles.multiSelectOutline} ${styles.enter}`}
                          style={{
                            left: bb.x,
                            top: bb.y - scrollY,
                            width: bb.width,
                            height: bb.height,
                          }}
                        />
                      ),
                    );
                  }

                  // Single element: use live position from hoveredTargetElement when available
                  const rect =
                  hoveredTargetElement && hoveredTargetElement.isConnected
                      ? viewportRect(hoveredTargetElement)
                      : null;

                  const bb = rect
                  ? { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
                    : {
                        x: hoveredAnnotation.boundingBox.x,
                        y: hoveredAnnotation.isFixed
                          ? hoveredAnnotation.boundingBox.y
                          : hoveredAnnotation.boundingBox.y - scrollY,
                        width: hoveredAnnotation.boundingBox.width,
                        height: hoveredAnnotation.boundingBox.height,
                      };

                  const isMulti = hoveredAnnotation.isMultiSelect;
                  return (
                    <div
                      className={`${isMulti ? styles.multiSelectOutline : styles.singleSelectOutline} ${styles.enter}`}
                      style={{
                        left: bb.x,
                        top: bb.y,
                        width: bb.width,
                        height: bb.height,
                        ...(isMulti
                          ? {}
                          : {
                            borderColor: "color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)",
                            backgroundColor: "color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)",
                            }),
                      }}
                    />
                  );
                })()}

              {/* Pending annotation marker + popup */}
              {pendingAnnotation && (
                <>
                  {/* Show element/area outline while adding annotation */}
                  {pendingAnnotation.multiSelectElements?.length
                    ? // Modifier-click multi-select: show individual boxes with live positions
                      pendingAnnotation.multiSelectElements
                        .filter((el) => el.isConnected)
                        .map((el, index) => {
                          const rect = viewportRect(el);
                          return (
                            <div
                              key={`pending-multi-${index}`}
                              className={`${styles.multiSelectOutline} ${pendingExiting ? styles.exit : styles.enter}`}
                              style={{
                                left: rect.left,
                                top: rect.top,
                                width: rect.width,
                                height: rect.height,
                              }}
                            />
                          );
                        })
                    : // Single element or drag multi-select: show single box
                      pendingAnnotation.targetElement &&
                        pendingAnnotation.targetElement.isConnected
                      ? // Single-click: use live getBoundingClientRect for consistent positioning
                        (() => {
                          const rect =
                            viewportRect(pendingAnnotation.targetElement!);
                          return (
                            <div
                              className={`${styles.singleSelectOutline} ${pendingExiting ? styles.exit : styles.enter}`}
                              style={{
                                left: rect.left,
                                top: rect.top,
                                width: rect.width,
                                height: rect.height,
                                borderColor: "color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)",
                                backgroundColor: "color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)",
                              }}
                            />
                          );
                        })()
                      : // Drag selection or fallback: use stored boundingBox
                        pendingAnnotation.boundingBox && (
                          <div
                            className={`${pendingAnnotation.isMultiSelect ? styles.multiSelectOutline : styles.singleSelectOutline} ${pendingExiting ? styles.exit : styles.enter}`}
                            style={{
                              left: pendingAnnotation.boundingBox.x,
                              top: pendingAnnotation.boundingBox.y - scrollY,
                              width: pendingAnnotation.boundingBox.width,
                              height: pendingAnnotation.boundingBox.height,
                              ...(pendingAnnotation.isMultiSelect
                                ? {}
                                : {
                                    borderColor: "color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)",
                                    backgroundColor: "color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)",
                                  }),
                            }}
                          />
                        )}

                  {(() => {
                    // Use stored coordinates - they match what will be saved
                    const positioned = projectFrameAnnotation(pendingAnnotation) ?? pendingAnnotation;
                    const markerX = positioned.x;
                    const markerY = positioned.isFixed
                      ? positioned.y
                      : positioned.y - scrollY;

                    return (
                      <>
                        <AnnotationPopupCSS
                          key={pendingAnnotation.id}
                          ref={popupRef}
                          element={pendingAnnotation.element}
                          selectedText={pendingAnnotation.selectedText}
                          allowEmpty={typeof copyFormat === "object" && !!pendingAnnotation.attributes?.[copyFormat.attribute]}
                          onOpenSource={onOpenSource && pendingAnnotation.sourceFile
                            ? () => onOpenSource(pendingAnnotation.sourceFile!) : undefined}
                          computedStyles={pendingAnnotation.computedStylesObj}
                          placeholder={
                            typeof copyFormat === "object" && pendingAnnotation.attributes?.[copyFormat.attribute]
                              ? "Add a note (optional)"
                              : pendingAnnotation.element === "Area selection"
                              ? "What should change in this area?"
                              : pendingAnnotation.isMultiSelect
                                ? "Feedback for this group of elements..."
                                : "What should change?"
                          }
                          onSubmit={addAnnotation}
                          onExitComplete={finishPendingExit}
                          onCancel={cancelAnnotation}
                          isExiting={pendingExiting}
                          lightMode={!isDarkMode}
                          accentColor={
                            pendingAnnotation.isMultiSelect
                              ? "var(--agentation-color-green)"
                              : "var(--agentation-color-accent)"
                          }
                          style={{
                            // Popup is 280px wide, centered with translateX(-50%), so 140px each side
                            // Clamp so popup stays 20px from viewport edges
                            left: Math.max(
                              160,
                              Math.min(
                                window.innerWidth - 160,
                                (markerX / 100) * window.innerWidth,
                              ),
                            ),
                            // Position popup above or below marker to keep marker visible
                            ...(markerY > window.innerHeight - 290
                              ? { bottom: window.innerHeight - markerY + 20 }
                              : { top: markerY + 20 }),
                          }}
                        />
                      </>
                    );
                  })()}
                </>
              )}

              {/* Edit annotation popup */}
              {editingAnnotation && (
                <>
                  {/* Show element/area outline while editing */}
                  {editingAnnotation.elementBoundingBoxes?.length
                    ? // Modifier-click: show individual element boxes (use live rects when available)
                      (() => {
                        // Use live positions from editingTargetElements when available
                        if (editingTargetElements.length > 0) {
                          return editingTargetElements
                            .filter((el) => el.isConnected)
                            .map((el, index) => {
                              const rect = viewportRect(el);
                              return (
                                <div
                                  key={`edit-multi-live-${index}`}
                                  className={`${styles.multiSelectOutline} ${styles.enter}`}
                                  style={{
                                    left: rect.left,
                                    top: rect.top,
                                    width: rect.width,
                                    height: rect.height,
                                  }}
                                />
                              );
                            });
                        }
                        // Fallback to stored bounding boxes
                        return editingAnnotation.elementBoundingBoxes!.map(
                          (bb, index) => (
                            <div
                              key={`edit-multi-${index}`}
                              className={`${styles.multiSelectOutline} ${styles.enter}`}
                              style={{
                                left: bb.x,
                                top: bb.y - scrollY,
                                width: bb.width,
                                height: bb.height,
                              }}
                            />
                          ),
                        );
                      })()
                    : // Single element or drag multi-select: show single box
                      (() => {
                        // Use live position from editingTargetElement when available
                        const rect =
                          editingTargetElement &&
                          editingTargetElement.isConnected
                            ? viewportRect(editingTargetElement)
                            : null;

                        const bb = rect
                        ? { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
                          : editingAnnotation.boundingBox
                            ? {
                                x: editingAnnotation.boundingBox.x,
                                y: editingAnnotation.isFixed
                                  ? editingAnnotation.boundingBox.y
                                  : editingAnnotation.boundingBox.y - scrollY,
                                width: editingAnnotation.boundingBox.width,
                                height: editingAnnotation.boundingBox.height,
                              }
                            : null;

                        if (!bb) return null;

                        return (
                          <div
                            className={`${editingAnnotation.isMultiSelect ? styles.multiSelectOutline : styles.singleSelectOutline} ${styles.enter}`}
                            style={{
                              left: bb.x,
                              top: bb.y,
                              width: bb.width,
                              height: bb.height,
                              ...(editingAnnotation.isMultiSelect
                                ? {}
                                : {
                                  borderColor: "color-mix(in srgb, var(--agentation-color-accent) 60%, transparent)",
                                  backgroundColor: "color-mix(in srgb, var(--agentation-color-accent) 5%, transparent)",
                                  }),
                            }}
                          />
                        );
                      })()}


                </>
              )}

              {/* Drag selection - all visuals use refs for smooth 60fps */}
              {isDragging && (
                <>
                  <div ref={dragRectRef} className={styles.dragSelection} />
                  <div
                    ref={highlightsContainerRef}
                    className={styles.highlightsContainer}
                  />
                </>
              )}
            </div>
          )}
          <AnnotationCard
            ref={editPopupRef}
            annotation={cardAnnotation ? projectFrameAnnotation(cardAnnotation) ?? editingAnnotation : null}
            editing={!!editingAnnotation}
            exiting={editExiting}
            restorePreview={restoreEditPreview}
            scrollY={scrollY}
            lightMode={!isDarkMode}
            onExited={finishEditExit}
            editorProps={cardAnnotation ? {
              element: cardAnnotation.element,
              selectedText: cardAnnotation.selectedText,
              allowEmpty: typeof copyFormat === "object" && !!cardAnnotation.attributes?.[copyFormat.attribute],
              onOpenSource: onOpenSource && cardAnnotation.sourceFile
                ? () => onOpenSource(cardAnnotation.sourceFile!) : undefined,
              computedStyles: parseComputedStylesString(cardAnnotation.computedStyles),
              placeholder: "Edit your feedback...",
              initialValue: cardAnnotation.comment,
              submitLabel: "Save",
              onSubmit: updateAnnotation,
              onCancel: cancelEditAnnotation,
              onDelete: () => deleteAnnotation(cardAnnotation.id),
              accentColor: cardAnnotation.isMultiSelect
                ? "var(--agentation-color-green)" : "var(--agentation-color-accent)",
            } : undefined}
          />

      </div>
    </ShadowRoot>
  );
}

export default PageFeedbackToolbarCSS;
