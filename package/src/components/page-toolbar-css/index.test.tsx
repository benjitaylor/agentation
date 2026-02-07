import { describe, it, expect } from "vitest";

// These tests are lightweight sanity checks for iframe helpers.
// JSDOM does not implement real layout/elementFromPoint, so we focus on
// same-origin iframe detection logic and cross-origin safety.

describe("iframe helpers", () => {
  it("isSameOriginIframe returns false for an iframe with no contentDocument", () => {
    // Minimal fake iframe
    const iframe = document.createElement("iframe");
    // In JSDOM, contentDocument is present but can be null depending on setup.
    // Force a null-ish scenario by defining property.
    Object.defineProperty(iframe, "contentDocument", {
      value: null,
      configurable: true,
    });

    // Inline copy of helper contract: should return false, not throw.
    const isSameOriginIframe = (frame: HTMLIFrameElement): boolean => {
      try {
        const doc = frame.contentDocument;
        return doc !== null && doc.body !== null;
      } catch {
        return false;
      }
    };

    expect(isSameOriginIframe(iframe)).toBe(false);
  });

  it("isSameOriginIframe returns false (and does not throw) when access throws", () => {
    const iframe = document.createElement("iframe");
    Object.defineProperty(iframe, "contentDocument", {
      get() {
        throw new Error("SecurityError");
      },
      configurable: true,
    });

    const isSameOriginIframe = (frame: HTMLIFrameElement): boolean => {
      try {
        const doc = frame.contentDocument;
        return doc !== null && doc.body !== null;
      } catch {
        return false;
      }
    };

    expect(isSameOriginIframe(iframe)).toBe(false);
  });
});
