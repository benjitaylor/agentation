import { describe, expect, it } from "vitest";
import type { Annotation } from "../types";
import { generateOutput } from "./generate-output";

const annotation: Annotation = {
  id: "1",
  x: 10,
  y: 20,
  comment: "Check this",
  element: 'image "logo"',
  elementPath: "multi-select",
  timestamp: 1,
  isMultiSelect: true,
  fullPath: "body > main > img",
  sourceFile: "static/js/agentation.js:1:2",
  reactComponentStack: "    at Logo (https://example.com/static/js/home.js:2:100)",
};

describe("component stacks in copied feedback", () => {
  it.each(["standard", "detailed", "forensic"] as const)("exports the stack in %s feedback", (detailLevel) => {
    const output = generateOutput([annotation], "/", detailLevel);
    expect(output).toContain("React component stack (nearest first");
    expect(output).toContain(annotation.reactComponentStack);
    expect(output).not.toContain("**Source:** static/js/agentation.js:1:2");
  });

  it("keeps the source line for existing annotations without a stack", () => {
    const output = generateOutput([{ ...annotation, reactComponentStack: undefined }], "/");
    expect(output).toContain("**Source:** static/js/agentation.js:1:2");
  });
});
