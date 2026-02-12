import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { PageFeedbackToolbarCSS } from "./index";
import type { Annotation } from "../../types";
import { getStorageKey } from "../../utils/storage";

// Mock clipboard API
const mockClipboard = {
  writeText: vi.fn().mockResolvedValue(undefined),
};

beforeEach(() => {
  const storage = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, String(value));
    },
    removeItem: (key: string) => {
      storage.delete(key);
    },
    clear: () => {
      storage.clear();
    },
    key: (index: number) => Array.from(storage.keys())[index] ?? null,
    get length() {
      return storage.size;
    },
  });

  vi.stubGlobal("navigator", {
    clipboard: mockClipboard,
    userAgent: "test-agent",
  });
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

  describe("reconnect sync filtering", () => {
    it("should exclude resolved and dismissed annotations from copy output after reconnect sync", async () => {
      const onCopy = vi.fn();
      const now = Date.now();
      const pathname = window.location.pathname;
      const storageKey = getStorageKey(pathname);
      const expectedInitWarn =
        "[Agentation] Failed to initialize session, using local storage:";
      const originalWarn = console.warn;
      const warnSpy = vi.spyOn(console, "warn").mockImplementation((...args) => {
        if (args[0] === expectedInitWarn) {
          return;
        }
        originalWarn(...args);
      });

      try {
        const localAnnotations: Annotation[] = [
          {
            id: "pending-1",
            x: 10,
            y: 20,
            comment: "Pending feedback",
            element: "Button",
            elementPath: "body > button",
            timestamp: now,
            status: "pending",
          },
          {
            id: "resolved-1",
            x: 20,
            y: 30,
            comment: "Resolved feedback",
            element: "Card",
            elementPath: "body > div.card",
            timestamp: now,
            status: "resolved",
          },
          {
            id: "dismissed-1",
            x: 30,
            y: 40,
            comment: "Dismissed feedback",
            element: "Nav",
            elementPath: "body > nav",
            timestamp: now,
            status: "dismissed",
          },
        ];

        const jsonResponse = (data: unknown, ok = true) =>
          ({
            ok,
            status: ok ? 200 : 500,
            json: async () => data,
          }) as Response;

        class MockEventSource {
          constructor(_url: string) {}
          addEventListener(_type: string, _listener: EventListener) {}
          removeEventListener(_type: string, _listener: EventListener) {}
          close() {}
        }

        let createSessionCalls = 0;
        let resolveHealth: ((value: Response) => void) | null = null;
        const healthPromise = new Promise<Response>((resolve) => {
          resolveHealth = resolve;
        });

        const fetchMock = vi.fn(
          async (input: RequestInfo | URL, init?: RequestInit) => {
            const url = String(input);
            const method = init?.method ?? "GET";

            if (url === "http://api/health" && method === "GET") {
              return healthPromise;
            }

            if (url === "http://api/sessions" && method === "POST") {
              createSessionCalls += 1;
              // First create attempt is during initSession; fail it to force
              // disconnected -> connected transition via health check.
              if (createSessionCalls === 1) {
                throw new Error("init createSession failed");
              }
              return jsonResponse({
                id: "reconnect-session",
                url: "http://example.com",
                status: "active",
                createdAt: new Date(now).toISOString(),
              });
            }

            if (
              url === "http://api/sessions/reconnect-session/annotations" &&
              method === "POST"
            ) {
              const payload = JSON.parse(String(init?.body ?? "{}")) as Annotation;
              return jsonResponse(payload);
            }

            throw new Error(`Unexpected fetch call: ${method} ${url}`);
          },
        );

        vi.stubGlobal("fetch", fetchMock);
        vi.stubGlobal("EventSource", MockEventSource);

        localStorage.removeItem(storageKey);

        render(
          <PageFeedbackToolbarCSS
            endpoint="http://api"
            copyToClipboard={false}
            onCopy={onCopy}
          />,
        );

        await waitFor(() => {
          const createCalls = fetchMock.mock.calls.filter(
            ([url, init]) =>
              String(url) === "http://api/sessions" &&
              (init?.method ?? "GET") === "POST",
          );
          expect(createCalls.length).toBeGreaterThanOrEqual(1);
        });

        await waitFor(() => {
          expect(warnSpy).toHaveBeenCalledWith(expectedInitWarn, expect.any(Error));
        });

        // Seed mixed-status local annotations while disconnected.
        localStorage.setItem(storageKey, JSON.stringify(localAnnotations));

        // Resolve health check as connected so reconnect sync effect runs.
        resolveHealth?.(jsonResponse({}, true));

        await waitFor(() => {
          const syncCalls = fetchMock.mock.calls.filter(
            ([url, init]) =>
              String(url) === "http://api/sessions/reconnect-session/annotations" &&
              (init?.method ?? "GET") === "POST",
          );
          expect(syncCalls).toHaveLength(3);
        });

        fireEvent.keyDown(document, { key: "c" });

        await waitFor(() => {
          expect(onCopy).toHaveBeenCalled();
        });

        const output = String(onCopy.mock.calls.at(-1)?.[0] ?? "");
        expect(output).toContain("Pending feedback");
        expect(output).not.toContain("Resolved feedback");
        expect(output).not.toContain("Dismissed feedback");
      } finally {
        warnSpy.mockRestore();
      }
    });

    it("should exclude resolved annotations returned by init session sync from copy output", async () => {
      const onCopy = vi.fn();
      const now = Date.now();
      const pathname = window.location.pathname;
      const storageKey = getStorageKey(pathname);

      const localAnnotations: Annotation[] = [
        {
          id: "pending-init-keep",
          x: 10,
          y: 20,
          comment: "Pending init feedback keep",
          element: "Button",
          elementPath: "body > button",
          timestamp: now,
          status: "pending",
        },
        {
          id: "pending-init-to-resolve",
          x: 20,
          y: 30,
          comment: "Pending init feedback to resolve",
          element: "Card",
          elementPath: "body > div.card",
          timestamp: now,
          status: "pending",
        },
      ];

      const jsonResponse = (data: unknown, ok = true) =>
        ({
          ok,
          status: ok ? 200 : 500,
          json: async () => data,
        }) as Response;

      class MockEventSource {
        constructor(_url: string) {}
        addEventListener(_type: string, _listener: EventListener) {}
        removeEventListener(_type: string, _listener: EventListener) {}
        close() {}
      }

      const fetchMock = vi.fn(
        async (input: RequestInfo | URL, init?: RequestInit) => {
          const url = String(input);
          const method = init?.method ?? "GET";

          if (url === "http://api/health" && method === "GET") {
            return jsonResponse({}, true);
          }

          if (url === "http://api/sessions" && method === "POST") {
            return jsonResponse({
              id: "init-session",
              url: "http://example.com",
              status: "active",
              createdAt: new Date(now).toISOString(),
            });
          }

          if (
            url === "http://api/sessions/init-session/annotations" &&
            method === "POST"
          ) {
            const payload = JSON.parse(String(init?.body ?? "{}")) as Annotation;
            if (payload.id === "pending-init-to-resolve") {
              return jsonResponse({
                ...payload,
                status: "resolved",
                comment: "Resolved by server during init sync",
              });
            }
            return jsonResponse(payload);
          }

          throw new Error(`Unexpected fetch call: ${method} ${url}`);
        },
      );

      vi.stubGlobal("fetch", fetchMock);
      vi.stubGlobal("EventSource", MockEventSource);

      localStorage.setItem(storageKey, JSON.stringify(localAnnotations));

      render(
        <PageFeedbackToolbarCSS
          endpoint="http://api"
          copyToClipboard={false}
          onCopy={onCopy}
        />,
      );

      await waitFor(() => {
        const syncCalls = fetchMock.mock.calls.filter(
          ([url, init]) =>
            String(url) === "http://api/sessions/init-session/annotations" &&
            (init?.method ?? "GET") === "POST",
        );
        expect(syncCalls).toHaveLength(2);
      });

      fireEvent.keyDown(document, { key: "c" });

      await waitFor(() => {
        expect(onCopy).toHaveBeenCalled();
      });

      const output = String(onCopy.mock.calls.at(-1)?.[0] ?? "");
      expect(output).toContain("Pending init feedback keep");
      expect(output).not.toContain("Resolved by server during init sync");
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
