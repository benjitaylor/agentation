/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from "vitest";
import {
  getReactComponentName,
  isReactPage,
  clearReactDetectionCache,
  DEFAULT_SKIP_EXACT,
  DEFAULT_SKIP_PATTERNS,
} from "./react-detection";

// Define the mock fiber type
type MockFiber = {
  tag: number;
  type: { name: string; displayName: string };
  elementType: { name: string; displayName: string };
  return: MockFiber | null;
};

// Helper to create a mock fiber
function createMockFiber(
  name: string,
  parent?: MockFiber,
  options: { tag?: number } = {},
): MockFiber {
  return {
    tag: options.tag ?? 0, // FunctionComponent
    type: { name, displayName: name },
    elementType: { name, displayName: name },
    return: parent || null,
  };
}

// Helper to attach fiber to an element
function attachFiber(element: HTMLElement, fiber: unknown) {
  (element as unknown as Record<string, unknown>)["__reactFiber$test"] = fiber;
}

// Helper to create element with fiber attached
function createElementWithFiber(
  fiber: MockFiber,
  options: { className?: string } = {},
) {
  const element = document.createElement("div");
  if (options.className) {
    element.className = options.className;
  }
  attachFiber(element, fiber);
  document.body.appendChild(element);
  return element;
}

describe("react-detection", () => {
  beforeEach(() => {
    clearReactDetectionCache();
    document.body.innerHTML = "";
  });

  describe("isReactPage", () => {
    it("returns false for non-React pages", () => {
      expect(isReactPage()).toBe(false);
    });

    it("returns true when React fiber is on body", () => {
      attachFiber(document.body, createMockFiber("App"));
      expect(isReactPage()).toBe(true);
    });

    it("returns true when React fiber is on #root", () => {
      const root = document.createElement("div");
      root.id = "root";
      attachFiber(root, createMockFiber("App"));
      document.body.appendChild(root);
      expect(isReactPage()).toBe(true);
    });

    it("returns true when React fiber is on #__next", () => {
      const next = document.createElement("div");
      next.id = "__next";
      attachFiber(next, createMockFiber("App"));
      document.body.appendChild(next);
      expect(isReactPage()).toBe(true);
    });

    it("returns true when React fiber is on immediate child of body", () => {
      const child = document.createElement("div");
      attachFiber(child, createMockFiber("App"));
      document.body.appendChild(child);
      expect(isReactPage()).toBe(true);
    });

    it("caches the result", () => {
      attachFiber(document.body, createMockFiber("App"));
      expect(isReactPage()).toBe(true);
      // Remove the fiber
      delete (document.body as unknown as Record<string, unknown>)["__reactFiber$test"];
      // Should still return true due to cache
      expect(isReactPage()).toBe(true);
    });
  });

  describe("clearReactDetectionCache", () => {
    it("resets the detection cache", () => {
      attachFiber(document.body, createMockFiber("App"));
      expect(isReactPage()).toBe(true);
      delete (document.body as unknown as Record<string, unknown>)["__reactFiber$test"];
      clearReactDetectionCache();
      expect(isReactPage()).toBe(false);
    });
  });

  describe("getReactComponentName", () => {
    it("returns empty result for non-React elements", () => {
      const element = document.createElement("div");
      document.body.appendChild(element);
      const result = getReactComponentName(element);
      expect(result.path).toBeNull();
      expect(result.components).toEqual([]);
    });

    it("extracts single component name", () => {
      const fiber = createMockFiber("Button");
      const element = createElementWithFiber(fiber);
      const result = getReactComponentName(element);
      expect(result.components).toContain("Button");
      expect(result.path).toContain("<Button>");
    });

    it("extracts component hierarchy", () => {
      const app = createMockFiber("App");
      const layout = createMockFiber("Layout", app);
      const button = createMockFiber("Button", layout);
      const element = createElementWithFiber(button);

      const result = getReactComponentName(element, { mode: "all" });
      expect(result.components).toContain("Button");
      expect(result.components).toContain("Layout");
      expect(result.components).toContain("App");
      // Path should be outermost to innermost
      expect(result.path).toBe("<App> <Layout> <Button>");
    });

    it("uses displayName when available", () => {
      const fiber = {
        tag: 0,
        type: { displayName: "MyDisplayName", name: "InternalName" },
        elementType: { displayName: "MyDisplayName", name: "InternalName" },
        return: null,
      };
      const element = createElementWithFiber(fiber as ReturnType<typeof createMockFiber>);
      const result = getReactComponentName(element);
      expect(result.components).toContain("MyDisplayName");
    });

    it("respects maxComponents config", () => {
      const c1 = createMockFiber("Component1");
      const c2 = createMockFiber("Component2", c1);
      const c3 = createMockFiber("Component3", c2);
      const c4 = createMockFiber("Component4", c3);
      const element = createElementWithFiber(c4);

      const result = getReactComponentName(element, {
        mode: "all",
        maxComponents: 2,
      });
      expect(result.components.length).toBeLessThanOrEqual(2);
    });

    it("caches results per element in 'all' mode", () => {
      const fiber = createMockFiber("CachedComponent");
      const element = createElementWithFiber(fiber);

      // Cache only works in "all" mode
      const result1 = getReactComponentName(element, { mode: "all" });
      // Modify the fiber (shouldn't affect cached result)
      fiber.type.name = "ModifiedName";
      const result2 = getReactComponentName(element, { mode: "all" });

      expect(result1).toBe(result2); // Same reference = cached
    });
  });

  describe("filter modes", () => {
    it("mode: filtered skips DEFAULT_SKIP_EXACT names", () => {
      const fragment = createMockFiber("Fragment");
      const app = createMockFiber("App", fragment);
      const element = createElementWithFiber(app);

      const result = getReactComponentName(element, { mode: "filtered" });
      expect(result.components).not.toContain("Fragment");
      expect(result.components).toContain("App");
    });

    it("mode: filtered skips Provider patterns", () => {
      const provider = createMockFiber("ThemeProvider");
      const app = createMockFiber("App", provider);
      const element = createElementWithFiber(app);

      const result = getReactComponentName(element, { mode: "filtered" });
      expect(result.components).not.toContain("ThemeProvider");
    });

    it("mode: all includes more components", () => {
      const app = createMockFiber("App");
      const layout = createMockFiber("Layout", app);
      const element = createElementWithFiber(layout);

      const allResult = getReactComponentName(element, { mode: "all" });
      clearReactDetectionCache();
      const filteredResult = getReactComponentName(element, { mode: "filtered" });

      // All mode should generally include at least as many components
      expect(allResult.components.length).toBeGreaterThanOrEqual(
        filteredResult.components.length,
      );
    });
  });

  describe("DEFAULT_SKIP_EXACT", () => {
    it("includes React internals", () => {
      expect(DEFAULT_SKIP_EXACT.has("Fragment")).toBe(true);
      expect(DEFAULT_SKIP_EXACT.has("Suspense")).toBe(true);
      expect(DEFAULT_SKIP_EXACT.has("StrictMode")).toBe(true);
    });

    it("includes routing internals", () => {
      expect(DEFAULT_SKIP_EXACT.has("Routes")).toBe(true);
      expect(DEFAULT_SKIP_EXACT.has("Route")).toBe(true);
      expect(DEFAULT_SKIP_EXACT.has("Outlet")).toBe(true);
    });
  });

  describe("DEFAULT_SKIP_PATTERNS", () => {
    it("matches Boundary patterns", () => {
      const matches = DEFAULT_SKIP_PATTERNS.some((p) => p.test("ErrorBoundary"));
      expect(matches).toBe(true);
    });

    it("matches Provider patterns", () => {
      const matches = DEFAULT_SKIP_PATTERNS.some((p) => p.test("ThemeProvider"));
      expect(matches).toBe(true);
    });

    it("matches Router patterns", () => {
      const matches = DEFAULT_SKIP_PATTERNS.some((p) => p.test("BrowserRouter"));
      expect(matches).toBe(true);
    });

    it("does not match user components", () => {
      const matches = DEFAULT_SKIP_PATTERNS.some((p) => p.test("UserProfile"));
      expect(matches).toBe(false);
    });

    it("does not match ServerStatus (avoid false positives)", () => {
      const matches = DEFAULT_SKIP_PATTERNS.some((p) => p.test("ServerStatus"));
      expect(matches).toBe(false);
    });

    it("does not match ClientProfile (avoid false positives)", () => {
      const matches = DEFAULT_SKIP_PATTERNS.some((p) => p.test("ClientProfile"));
      expect(matches).toBe(false);
    });
  });

  describe("smart mode", () => {
    it("includes components that match CSS classes", () => {
      const fiber = createMockFiber("SideNav");
      const element = createElementWithFiber(fiber, { className: "side-nav" });

      const result = getReactComponentName(element, { mode: "smart" });
      expect(result.components).toContain("SideNav");
    });

    it("includes components matching user patterns (e.g., Page suffix)", () => {
      const fiber = createMockFiber("HomePage");
      const element = createElementWithFiber(fiber);

      const result = getReactComponentName(element, { mode: "smart" });
      expect(result.components).toContain("HomePage");
    });

    it("excludes components that do not correlate with DOM", () => {
      const inner = createMockFiber("InternalWrapper");
      const button = createMockFiber("SubmitButton", inner);
      const element = createElementWithFiber(button, { className: "btn" });

      const result = getReactComponentName(element, { mode: "smart" });
      // SubmitButton matches user pattern (Button$), InternalWrapper does not
      expect(result.components).toContain("SubmitButton");
      expect(result.components).not.toContain("InternalWrapper");
    });

    it("matches partial class names", () => {
      const fiber = createMockFiber("NavigationMenu");
      const element = createElementWithFiber(fiber, { className: "main-navigation" });

      const result = getReactComponentName(element, { mode: "smart" });
      expect(result.components).toContain("NavigationMenu");
    });
  });

  describe("minified name filtering", () => {
    it("filters single letter names", () => {
      const minified = createMockFiber("e");
      const app = createMockFiber("App", minified);
      const element = createElementWithFiber(app);

      const result = getReactComponentName(element, { mode: "all" });
      expect(result.components).not.toContain("e");
      expect(result.components).toContain("App");
    });

    it("filters two letter names", () => {
      const minified = createMockFiber("Zt");
      const app = createMockFiber("App", minified);
      const element = createElementWithFiber(app);

      const result = getReactComponentName(element, { mode: "all" });
      expect(result.components).not.toContain("Zt");
    });
  });

  describe("cache behavior with different modes", () => {
    it("caches separately per mode", () => {
      // Use a component that passes all filters but only correlates with DOM in smart mode
      const helper = createMockFiber("HelperUtil");
      const card = createMockFiber("ProductCard", helper);
      const element = createElementWithFiber(card, { className: "product-card" });

      // First call with filtered mode
      const filteredResult = getReactComponentName(element, { mode: "filtered" });
      // Then call with smart mode on same element
      const domResult = getReactComponentName(element, { mode: "smart" });

      // Both should include ProductCard
      expect(filteredResult.components).toContain("ProductCard");
      expect(domResult.components).toContain("ProductCard");

      // Filtered includes HelperUtil, smart does not (doesn't match DOM or patterns)
      expect(filteredResult.components).toContain("HelperUtil");
      expect(domResult.components).not.toContain("HelperUtil");
    });
  });

  describe("error handling", () => {
    it("returns empty result for corrupted fiber", () => {
      const element = document.createElement("div");
      // Attach a corrupted fiber that will throw when accessed
      Object.defineProperty(element, "__reactFiber$test", {
        get() {
          throw new Error("Corrupted fiber");
        },
      });
      document.body.appendChild(element);
      attachFiber(document.body, createMockFiber("App")); // Make it a React page

      const result = getReactComponentName(element);
      expect(result.path).toBeNull();
      expect(result.components).toEqual([]);
    });
  });
});
