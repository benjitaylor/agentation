import { beforeEach, describe, expect, it, vi } from "vitest";

type RootLike = {
  render: ReturnType<typeof vi.fn>;
  unmount: ReturnType<typeof vi.fn>;
};

const rootMocks: RootLike[] = [];

const createRootMock = vi.fn((container: Element) => {
  const root = {
    container,
    render: vi.fn(),
    unmount: vi.fn(),
  };
  rootMocks.push(root);
  return root;
});

vi.mock("react-dom/client", () => ({
  createRoot: createRootMock,
}));

vi.mock("./components/page-toolbar-css", () => ({
  PageFeedbackToolbarCSS: (props: Record<string, unknown>) => (
    <div data-testid="mock-toolbar">{JSON.stringify(props)}</div>
  ),
}));

beforeEach(() => {
  createRootMock.mockClear();
  rootMocks.length = 0;
  document.getElementById("agentation-browser-root")?.remove();
  delete window.Agentation;
  vi.resetModules();
});

describe("browser entrypoint", () => {
  it("registers the global API with the current version", async () => {
    await import("./browser");

    expect(window.Agentation).toBeDefined();
    expect(window.Agentation?.mount).toBeTypeOf("function");
    expect(window.Agentation?.version).toBe("test");
  });

  it("mounts a single root, reuses it across updates, and tears it down cleanly", async () => {
    const { mountAgentation } = await import("./browser");

    const handle = mountAgentation({ copyToClipboard: false });

    expect(createRootMock).toHaveBeenCalledTimes(1);
    expect(document.querySelectorAll("#agentation-browser-root")).toHaveLength(1);
    expect(rootMocks[0]?.render).toHaveBeenCalledTimes(1);

    const secondHandle = mountAgentation({ copyToClipboard: true });
    expect(secondHandle).toBe(handle);
    expect(createRootMock).toHaveBeenCalledTimes(1);
    expect(rootMocks[0]?.render).toHaveBeenCalledTimes(2);

    handle.update({ webhookUrl: "https://example.test/hook" });
    expect(rootMocks[0]?.render).toHaveBeenCalledTimes(3);

    handle.destroy();
    expect(rootMocks[0]?.unmount).toHaveBeenCalledTimes(1);
    expect(document.getElementById("agentation-browser-root")).toBeNull();

    const remountedHandle = mountAgentation();
    expect(remountedHandle).not.toBe(handle);
    expect(createRootMock).toHaveBeenCalledTimes(2);
  });

  it("throws a clear error outside the browser", async () => {
    const { mountAgentation } = await import("./browser");

    const documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, "document");
    const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: undefined,
    });

    try {
      expect(() => mountAgentation()).toThrow(
        "Agentation browser entrypoint requires a DOM environment.",
      );
    } finally {
      if (documentDescriptor) {
        Object.defineProperty(globalThis, "document", documentDescriptor);
      }
      if (windowDescriptor) {
        Object.defineProperty(globalThis, "window", windowDescriptor);
      }
    }
  });
});
