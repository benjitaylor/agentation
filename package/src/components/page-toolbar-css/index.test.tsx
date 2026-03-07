import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PageFeedbackToolbarCSS } from "./index";
import type { Annotation } from "../../types";

// Mock clipboard API
const mockClipboard = {
  writeText: vi.fn().mockResolvedValue(undefined),
};

const createLocalStorageMock = () => {
  const store = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    clear: vi.fn(() => {
      store.clear();
    }),
  };
};

beforeEach(() => {
  vi.stubGlobal("navigator", {
    clipboard: mockClipboard,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)",
    platform: "MacIntel",
  });
  vi.stubGlobal("localStorage", createLocalStorageMock());
  mockClipboard.writeText.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("PageFeedbackToolbarCSS", () => {
  describe("onAnnotationAdd callback", () => {
    it("should accept onAnnotationAdd prop without errors", () => {
      const handleAnnotation = vi.fn();
      expect(() =>
        render(<PageFeedbackToolbarCSS onAnnotationAdd={handleAnnotation} />)
      ).not.toThrow();
    });

    it("should type-check annotation callback parameter", () => {
      // This test verifies TypeScript types are correct at compile time
      const handleAnnotation = (annotation: Annotation) => {
        // Verify all expected properties are accessible
        expect(annotation).toHaveProperty("id");
        expect(annotation).toHaveProperty("x");
        expect(annotation).toHaveProperty("y");
        expect(annotation).toHaveProperty("comment");
        expect(annotation).toHaveProperty("element");
        expect(annotation).toHaveProperty("elementPath");
        expect(annotation).toHaveProperty("timestamp");
      };

      render(<PageFeedbackToolbarCSS onAnnotationAdd={handleAnnotation} />);
    });
  });

  describe("copyToClipboard prop", () => {
    it("should default copyToClipboard to true", () => {
      // Component should render without explicit copyToClipboard prop
      expect(() => render(<PageFeedbackToolbarCSS />)).not.toThrow();
    });

    it("should accept copyToClipboard={false} without errors", () => {
      expect(() =>
        render(<PageFeedbackToolbarCSS copyToClipboard={false} />)
      ).not.toThrow();
    });

    it("should accept copyToClipboard={true} without errors", () => {
      expect(() =>
        render(<PageFeedbackToolbarCSS copyToClipboard={true} />)
      ).not.toThrow();
    });
  });

  describe("combined props", () => {
    it("should accept both onAnnotationAdd and copyToClipboard props", () => {
      const handleAnnotation = vi.fn();
      expect(() =>
        render(
          <PageFeedbackToolbarCSS
            onAnnotationAdd={handleAnnotation}
            copyToClipboard={false}
          />
        )
      ).not.toThrow();
    });
  });

  describe("activation shortcut settings", () => {
    it("captures and persists a custom activation shortcut from settings", async () => {
      render(<PageFeedbackToolbarCSS />);

      fireEvent.click(screen.getByTitle("Start feedback mode"));
      fireEvent.click(screen.getByLabelText("Open settings"));

      expect(screen.getByText("Activation Shortcut")).toBeTruthy();

      const captureButton = screen.getByRole("button", {
        name: "Set activation shortcut",
      });

      fireEvent.focus(captureButton);
      fireEvent.keyDown(captureButton, {
        key: "a",
        metaKey: true,
        shiftKey: true,
      });

      await waitFor(() => {
        const raw = localStorage.getItem("feedback-toolbar-settings");
        expect(raw).toBeTruthy();
        expect(raw).toContain('"key":"A"');
        expect(raw).toContain('"modifiers":["mod","shift"]');
      });

      expect(screen.getByText("Cmd + Shift + A")).toBeTruthy();
    });

    it("uses the stored activation shortcut instead of the default one", async () => {
      localStorage.setItem(
        "feedback-toolbar-settings",
        JSON.stringify({
          activationShortcut: {
            key: "A",
            modifiers: ["mod", "shift"],
          },
        }),
      );

      render(<PageFeedbackToolbarCSS />);

      expect(screen.getByTitle("Start feedback mode")).toBeTruthy();

      fireEvent.keyDown(document, {
        key: "f",
        metaKey: true,
        shiftKey: true,
      });

      expect(screen.getByTitle("Start feedback mode")).toBeTruthy();

      fireEvent.keyDown(document, {
        key: "a",
        metaKey: true,
        shiftKey: true,
      });

      await waitFor(() => {
        expect(screen.queryByTitle("Start feedback mode")).toBeNull();
      });
    });
  });
});

describe("Annotation type", () => {
  it("should include all required fields", () => {
    const annotation: Annotation = {
      id: "test-id",
      x: 50,
      y: 100,
      comment: "Test comment",
      element: "Button",
      elementPath: "body > div > button",
      timestamp: Date.now(),
    };

    expect(annotation.id).toBe("test-id");
    expect(annotation.x).toBe(50);
    expect(annotation.y).toBe(100);
    expect(annotation.comment).toBe("Test comment");
    expect(annotation.element).toBe("Button");
    expect(annotation.elementPath).toBe("body > div > button");
    expect(typeof annotation.timestamp).toBe("number");
  });

  it("should allow optional metadata fields", () => {
    const annotation: Annotation = {
      id: "test-id",
      x: 50,
      y: 100,
      comment: "Test comment",
      element: "Button",
      elementPath: "body > div > button",
      timestamp: Date.now(),
      selectedText: "Selected text content",
      boundingBox: { x: 100, y: 200, width: 150, height: 40 },
      nearbyText: "Context around the element",
      cssClasses: "btn btn-primary",
      nearbyElements: "div, span, a",
      computedStyles: "color: blue; font-size: 14px",
      fullPath: "html > body > div#app > main > button.btn",
      accessibility: "role=button, aria-label=Submit",
      isMultiSelect: false,
      isFixed: false,
    };

    expect(annotation.selectedText).toBe("Selected text content");
    expect(annotation.boundingBox).toEqual({
      x: 100,
      y: 200,
      width: 150,
      height: 40,
    });
    expect(annotation.cssClasses).toBe("btn btn-primary");
    expect(annotation.fullPath).toBe("html > body > div#app > main > button.btn");
    expect(annotation.accessibility).toBe("role=button, aria-label=Submit");
    expect(annotation.isMultiSelect).toBe(false);
    expect(annotation.isFixed).toBe(false);
  });
});
