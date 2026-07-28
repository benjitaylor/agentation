import { createEffect, onCleanup, onMount } from "solid-js";
import { mountAgentation } from "./browser/runtime";
import type { AgentationConfig, AgentationController } from "./browser/types";
import { createSolidMetadataAdapter } from "./metadata/solid";

export type AgentationProps = AgentationConfig & {
  class?: string;
};

export function Agentation(props: AgentationProps = {}): null {
  let controller: AgentationController | undefined;
  let disposed = false;
  let latest: AgentationConfig = {};

  createEffect(() => {
    const { class: className, ...config } = props;
    latest = {
      ...config,
      className: className ?? config.className,
      metadata: config.metadata ?? [createSolidMetadataAdapter()],
    };
    controller?.configure(latest);
  });

  onMount(() => {
    if (disposed) return;
    controller = mountAgentation(document, latest);
  });

  onCleanup(() => {
    disposed = true;
    controller?.destroy();
  });

  return null;
}

export { createSolidMetadataAdapter } from "./metadata/solid";
export { defineAgentationElement, mountAgentation } from "./browser/runtime";
export type {
  AgentationConfig,
  AgentationController,
  AgentationElement,
  AgentationEvent,
  AgentationEventDetail,
  ElementMetadata,
  ElementMetadataAdapter,
} from "./browser/types";
export type {
  Annotation,
  FrameworkMetadata,
  OutputDetailLevel,
  SourceLocation,
} from "./types";
