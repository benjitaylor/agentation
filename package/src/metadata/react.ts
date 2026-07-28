import {
  getReactComponentName,
  type ReactDetectionConfig,
} from "../utils/react-detection";
import { getSourceLocation } from "../utils/source-location";
import type { ElementMetadataAdapter } from "../browser/types";

export type ReactMetadataOptions = Pick<
  ReactDetectionConfig,
  "mode" | "maxDepth" | "maxComponents"
>;

export function createReactMetadataAdapter(
  options: ReactMetadataOptions = {},
): ElementMetadataAdapter {
  return {
    id: "react",
    inspect(element) {
      if (!(element instanceof HTMLElement)) return undefined;
      const components = getReactComponentName(element, options);
      const location = getSourceLocation(element);
      if (!components.components.length && (!location.found || !location.source)) {
        return undefined;
      }
      return {
        componentPath: components.components.length
          ? [...components.components].reverse()
          : undefined,
        source: location.found && location.source
          ? {
              file: location.source.fileName,
              line: location.source.lineNumber,
              column: location.source.columnNumber,
            }
          : undefined,
        confidence: location.found ? "exact" : "heuristic",
      };
    },
  };
}
