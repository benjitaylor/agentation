import solidDevtools from "solid-devtools/vite";
import type { PluginOption } from "vite";

export type AgentationSolidMetadataOptions = {
  /** Add source locations to native JSX elements. Defaults to true. */
  jsxLocation?: boolean;
  /** Add source locations to supported component declarations. Defaults to true. */
  componentLocation?: boolean;
};

/**
 * Dev-server-only Solid compiler instrumentation used by the Solid metadata
 * adapter. The Agentation toolbar still works without it and degrades to DOM
 * selectors and accessibility metadata.
 */
export function agentationSolidMetadata(
  options: AgentationSolidMetadataOptions = {},
): PluginOption {
  return solidDevtools({
    locator: {
      key: false,
      jsxLocation: options.jsxLocation ?? true,
      componentLocation: options.componentLocation ?? true,
    },
  });
}

export default agentationSolidMetadata;
