import { useEffect, useRef } from "react";
import { mountAgentation } from "./browser/runtime";
import type { AgentationConfig, AgentationController } from "./browser/types";
import { createReactMetadataAdapter } from "./metadata/react";

export type AgentationProps = AgentationConfig;
export type DemoAnnotation = NonNullable<AgentationConfig["demoAnnotations"]>[number];

export function Agentation(props: AgentationProps = {}): null {
  const controllerRef = useRef<AgentationController>();
  const latestRef = useRef<AgentationConfig>(props);
  latestRef.current = {
    ...props,
    metadata: props.metadata ?? [createReactMetadataAdapter()],
  };

  useEffect(() => {
    controllerRef.current = mountAgentation(document, latestRef.current);
    return () => {
      controllerRef.current?.destroy();
      controllerRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.configure(latestRef.current);
  });

  return null;
}

export const PageFeedbackToolbarCSS = Agentation;
