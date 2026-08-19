import { afterEach, describe, expect, it } from "vitest";
import { getSourceLocation } from "./source-location";

describe("build-time source location instrumentation", () => {
  afterEach(() => {
    delete globalThis.__AGENTATION_SOURCE_MANIFEST__;
  });

  it("resolves an exact source location without a React fiber", () => {
    const element = document.createElement("button");
    element.setAttribute("data-agentation-id", "source-id");
    globalThis.__AGENTATION_SOURCE_MANIFEST__ = {
      version: 1,
      files: ["src/app/Inspector.tsx"],
      locations: { "source-id": [0, 24, 6] },
    };

    expect(getSourceLocation(element)).toEqual({
      found: true,
      source: {
        fileName: "src/app/Inspector.tsx",
        lineNumber: 24,
        columnNumber: 6,
      },
      isReactApp: true,
      isProduction: false,
    });
  });

  it("falls back when the manifest does not contain the injected id", () => {
    const element = document.createElement("button");
    element.setAttribute("data-agentation-id", "missing-id");
    globalThis.__AGENTATION_SOURCE_MANIFEST__ = {
      version: 1,
      files: [],
      locations: {},
    };

    expect(getSourceLocation(element)).toMatchObject({
      found: false,
      reason: "no-fiber",
    });
  });
});
