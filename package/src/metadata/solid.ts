import type { ElementMetadata, ElementMetadataAdapter } from "../browser/types";

export type SolidMetadataResolver = (element: Element) => ElementMetadata | undefined;

export type SolidMetadataOptions = {
  /** Optional owner-registry resolver installed before Solid mounts. */
  resolve?: SolidMetadataResolver;
  /** Attribute emitted by solid-devtools/vite with locator.jsxLocation enabled. */
  sourceAttribute?: string;
  /** Optional app/compiler attribute containing `App > Panel > Button`. */
  componentAttribute?: string;
};

function parseSourceLocation(value: string | null): ElementMetadata["source"] {
  if (!value) return undefined;
  const match = /^(.*):(\d+):(\d+)$/.exec(value);
  if (!match) return { file: value };
  return {
    file: match[1],
    line: Number(match[2]),
    column: Number(match[3]),
  };
}

export function createSolidMetadataAdapter(
  options: SolidMetadataOptions = {},
): ElementMetadataAdapter {
  const sourceAttribute = options.sourceAttribute ?? "data-source-loc";
  const componentAttribute = options.componentAttribute ?? "data-agentation-solid-components";
  return {
    id: "solid",
    inspect(element) {
      const resolved = options.resolve?.(element);
      if (resolved) return resolved;

      const exactSource = element.getAttribute(sourceAttribute);
      const sourceOwner = exactSource ? element : element.closest(`[${sourceAttribute}]`);
      const componentOwner = element.closest(`[${componentAttribute}]`);
      const componentValue = componentOwner?.getAttribute(componentAttribute)?.trim();
      const source = parseSourceLocation(sourceOwner?.getAttribute(sourceAttribute) ?? null);
      const componentPath = componentValue
        ? componentValue.split(">").map((name) => name.trim()).filter(Boolean)
        : undefined;
      if (!source && !componentPath?.length) return undefined;
      return {
        source,
        componentPath,
        confidence: exactSource ? "exact" : "nearest",
      };
    },
  };
}
