import { afterEach, describe, expect, it } from "vitest";
import {
  passThroughDisabledControls,
  restoreDisabledControls,
  withDisabledControlsHittable,
} from "./disabled-controls";

const STYLE = "#agentation-disabled-controls";
afterEach(() => { restoreDisabledControls(); document.body.replaceChildren(); });

describe("disabled controls", () => {
  it("hides disabled controls from the pointer only while installed", () => {
    expect(document.querySelector(STYLE)).toBeNull();
    passThroughDisabledControls(document);
    passThroughDisabledControls(document);
    expect(document.querySelectorAll(STYLE)).toHaveLength(1);
    expect(document.querySelector(STYLE)!.textContent).toContain(":disabled{pointer-events:none !important}");
    restoreDisabledControls();
    expect(document.querySelector(STYLE)).toBeNull();
  });

  it("restores disabled controls for the duration of a hit test", () => {
    passThroughDisabledControls(document);
    const root = document.documentElement;
    const result = withDisabledControlsHittable(() => root.hasAttribute("data-agentation-hit-test"));
    expect(result).toBe(true);
    expect(root.hasAttribute("data-agentation-hit-test")).toBe(false);
  });

  it("cleans up even when the hit test throws", () => {
    passThroughDisabledControls(document);
    expect(() => withDisabledControlsHittable(() => { throw new Error("boom"); })).toThrow("boom");
    expect(document.documentElement.hasAttribute("data-agentation-hit-test")).toBe(false);
  });

  it("leaves the document untouched when nothing is installed", () => {
    withDisabledControlsHittable(() => {
      expect(document.documentElement.hasAttribute("data-agentation-hit-test")).toBe(false);
    });
  });

  it("installs into frame documents and removes on restore", () => {
    const frame = document.body.appendChild(document.createElement("iframe"));
    const inner = frame.contentDocument!;
    passThroughDisabledControls(document);
    passThroughDisabledControls(inner);
    expect(inner.querySelector(STYLE)).not.toBeNull();
    withDisabledControlsHittable(() => {
      expect(inner.documentElement.hasAttribute("data-agentation-hit-test")).toBe(true);
    });
    restoreDisabledControls();
    expect(inner.querySelector(STYLE)).toBeNull();
    expect(document.querySelector(STYLE)).toBeNull();
  });
});
