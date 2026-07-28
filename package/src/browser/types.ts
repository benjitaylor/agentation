import type { Annotation, FrameworkMetadata } from "../types";

export type ElementMetadata = Omit<FrameworkMetadata, "name"> & {
  framework?: string;
};

export interface ElementMetadataAdapter {
  readonly id: string;
  /** Best-effort, synchronous, side-effect-free metadata lookup. */
  inspect(element: Element): ElementMetadata | undefined;
}

export type DemoAnnotation = {
  selector: string;
  comment: string;
  selectedText?: string;
};

export type AgentationEventDetail =
  | {
      type: "annotations";
      reason: "add" | "update" | "delete" | "clear" | "load" | "remote";
      current: readonly Annotation[];
      affected: readonly Annotation[];
    }
  | { type: "copy"; output: string; annotations: readonly Annotation[] }
  | { type: "submit"; output: string; annotations: readonly Annotation[] }
  | { type: "session-created"; sessionId: string }
  | {
      type: "error";
      operation: "configuration" | "storage" | "sync" | "clipboard" | "webhook" | "metadata";
      message: string;
      recoverable: boolean;
      cause?: unknown;
    };

export type AgentationEvent = CustomEvent<AgentationEventDetail>;

export type AgentationConfig = {
  demoAnnotations?: readonly DemoAnnotation[];
  demoDelay?: number;
  enableDemoMode?: boolean;
  onAnnotationAdd?: (annotation: Annotation) => void;
  onAnnotationDelete?: (annotation: Annotation) => void;
  onAnnotationUpdate?: (annotation: Annotation) => void;
  onAnnotationsClear?: (annotations: Annotation[]) => void;
  onCopy?: (markdown: string) => void;
  onSubmit?: (output: string, annotations: Annotation[]) => void;
  copyToClipboard?: boolean;
  endpoint?: string;
  sessionId?: string;
  onSessionCreated?: (sessionId: string) => void;
  webhookUrl?: string;
  className?: string;
  metadata?: readonly ElementMetadataAdapter[];
  onEvent?: (event: AgentationEvent) => void;
};

export interface AgentationElement extends HTMLElement {
  config: AgentationConfig;
}

export interface AgentationController {
  readonly element: AgentationElement;
  configure(config: AgentationConfig): void;
  getAnnotations(): readonly Annotation[];
  destroy(): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "agentation-overlay": AgentationElement;
  }

  interface HTMLElementEventMap {
    agentation: AgentationEvent;
  }
}
