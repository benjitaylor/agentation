import { describe, it, expect, beforeEach, afterEach } from "vitest";

// =============================================================================
// Mock Types for React Fiber Structures
// =============================================================================

interface MockDebugSource {
  fileName: string;
  lineNumber: number;
  columnNumber?: number;
}

interface MockFiberNode {
  _debugSource?: MockDebugSource | null;
  _debugOwner?: MockFiberNode | null;
  return?: MockFiberNode | null;
  type?: string | Function | { displayName?: string; name?: string };
  elementType?: { displayName?: string; name?: string; $$typeof?: symbol };
  tag?: number;
}

// React fiber tag constants (from React source)
const FiberTags = {
  FunctionComponent: 0,
  ClassComponent: 1,
  HostRoot: 3,
  HostComponent: 5,
  HostText: 6,
  ForwardRef: 11,
  MemoComponent: 14,
  SimpleMemoComponent: 15,
};

// =============================================================================
// Helper Functions for Creating Mock Elements
// =============================================================================

function createMockElement(): HTMLElement {
  return document.createElement("div");
}

function attachReact18Fiber(
  element: HTMLElement,
  fiber: MockFiberNode,
  randomSuffix = "abc123"
): void {
  // React 18 uses __reactFiber$ prefix with random suffix
  (element as Record<string, unknown>)[`__reactFiber$${randomSuffix}`] = fiber;
}

function attachReact17Fiber(
  element: HTMLElement,
  fiber: MockFiberNode,
  randomSuffix = "abc123"
): void {
  // React 17 uses __reactInternalInstance$ prefix
  (element as Record<string, unknown>)[`__reactInternalInstance$${randomSuffix}`] =
    fiber;
}

function createDebugSource(
  fileName: string,
  lineNumber: number,
  columnNumber?: number
): MockDebugSource {
  return {
    fileName,
    lineNumber,
    ...(columnNumber !== undefined && { columnNumber }),
  };
}

function createFunctionComponentFiber(
  name: string,
  debugSource?: MockDebugSource | null,
  parent?: MockFiberNode
): MockFiberNode {
  const Component = function () {};
  Object.defineProperty(Component, "name", { value: name });

  return {
    _debugSource: debugSource,
    _debugOwner: parent,
    return: parent,
    type: Component,
    tag: FiberTags.FunctionComponent,
  };
}

function createClassComponentFiber(
  name: string,
  debugSource?: MockDebugSource | null,
  parent?: MockFiberNode
): MockFiberNode {
  class Component {}
  Object.defineProperty(Component, "name", { value: name });

  return {
    _debugSource: debugSource,
    _debugOwner: parent,
    return: parent,
    type: Component,
    tag: FiberTags.ClassComponent,
  };
}

function createHostComponentFiber(
  tagName: string,
  parent?: MockFiberNode
): MockFiberNode {
  return {
    _debugSource: null,
    _debugOwner: parent,
    return: parent,
    type: tagName,
    tag: FiberTags.HostComponent,
  };
}

function createMemoFiber(
  innerFiber: MockFiberNode,
  debugSource?: MockDebugSource | null
): MockFiberNode {
  return {
    _debugSource: debugSource,
    _debugOwner: innerFiber._debugOwner,
    return: innerFiber.return,
    type: innerFiber.type,
    elementType: {
      $$typeof: Symbol.for("react.memo"),
      displayName: `Memo(${
        typeof innerFiber.type === "function" ? innerFiber.type.name : "Component"
      })`,
    },
    tag: FiberTags.MemoComponent,
  };
}

function createForwardRefFiber(
  name: string,
  debugSource?: MockDebugSource | null,
  parent?: MockFiberNode
): MockFiberNode {
  const Component = function () {};
  Object.defineProperty(Component, "name", { value: name });

  return {
    _debugSource: debugSource,
    _debugOwner: parent,
    return: parent,
    type: Component,
    elementType: {
      $$typeof: Symbol.for("react.forward_ref"),
      displayName: name,
    },
    tag: FiberTags.ForwardRef,
  };
}

// =============================================================================
// Mock Implementation of getSourceLocation
// This simulates what the actual implementation should do
// =============================================================================

interface SourceLocation {
  fileName: string;
  lineNumber: number;
  columnNumber?: number;
  componentName?: string;
}

function getFiberFromElement(element: HTMLElement): MockFiberNode | null {
  // Try React 18+ fiber key (__reactFiber$...)
  const react18Key = Object.keys(element).find((key) =>
    key.startsWith("__reactFiber$")
  );
  if (react18Key) {
    return (element as Record<string, unknown>)[react18Key] as MockFiberNode;
  }

  // Try React 17 internal instance key (__reactInternalInstance$...)
  const react17Key = Object.keys(element).find((key) =>
    key.startsWith("__reactInternalInstance$")
  );
  if (react17Key) {
    return (element as Record<string, unknown>)[react17Key] as MockFiberNode;
  }

  return null;
}

function getComponentName(fiber: MockFiberNode): string | undefined {
  if (!fiber.type) return undefined;

  // Check elementType for wrapped components (memo, forwardRef)
  if (fiber.elementType?.displayName) {
    return fiber.elementType.displayName;
  }

  if (typeof fiber.type === "function") {
    const displayName = (fiber.type as { displayName?: string }).displayName;
    if (displayName) return displayName;

    const name = fiber.type.name;
    // Return undefined for empty string (anonymous functions)
    if (name && name.length > 0) return name;
    return undefined;
  }

  if (typeof fiber.type === "object" && fiber.type !== null) {
    const typed = fiber.type as { displayName?: string; name?: string };
    if (typed.displayName) return typed.displayName;
    if (typed.name && typed.name.length > 0) return typed.name;
    return undefined;
  }

  return undefined;
}

function findDebugSourceInFiberTree(fiber: MockFiberNode): {
  source: MockDebugSource;
  componentName?: string;
} | null {
  let current: MockFiberNode | null | undefined = fiber;
  let depth = 0;
  const maxDepth = 50; // Prevent infinite loops

  while (current && depth < maxDepth) {
    // Check if this fiber has debug source
    if (current._debugSource) {
      return {
        source: current._debugSource,
        componentName: getComponentName(current),
      };
    }

    // Walk up the fiber tree via _debugOwner first (component ownership)
    // then fall back to return (parent fiber)
    current = current._debugOwner || current.return;
    depth++;
  }

  return null;
}

function getSourceLocation(element: HTMLElement): SourceLocation | null {
  const fiber = getFiberFromElement(element);

  if (!fiber) {
    return null;
  }

  const result = findDebugSourceInFiberTree(fiber);

  if (!result) {
    return null;
  }

  return {
    fileName: result.source.fileName,
    lineNumber: result.source.lineNumber,
    ...(result.source.columnNumber !== undefined && {
      columnNumber: result.source.columnNumber,
    }),
    ...(result.componentName && { componentName: result.componentName }),
  };
}

// =============================================================================
// Tests
// =============================================================================

describe("Source Location Detection", () => {
  let testElement: HTMLElement;

  beforeEach(() => {
    testElement = createMockElement();
    document.body.appendChild(testElement);
  });

  afterEach(() => {
    document.body.removeChild(testElement);
  });

  // ===========================================================================
  // 1. React 18 Detection
  // ===========================================================================
  describe("React 18 detection", () => {
    it("should detect source from element with __reactFiber$ and _debugSource", () => {
      const debugSource = createDebugSource(
        "/src/components/Button.tsx",
        42,
        10
      );
      const fiber = createFunctionComponentFiber("Button", debugSource);

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/components/Button.tsx");
      expect(result?.lineNumber).toBe(42);
      expect(result?.columnNumber).toBe(10);
      expect(result?.componentName).toBe("Button");
    });

    it("should handle React 18 fiber without column number", () => {
      const debugSource = createDebugSource("/src/App.tsx", 15);
      const fiber = createFunctionComponentFiber("App", debugSource);

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/App.tsx");
      expect(result?.lineNumber).toBe(15);
      expect(result?.columnNumber).toBeUndefined();
    });

    it("should handle different random suffixes for __reactFiber$", () => {
      const debugSource = createDebugSource("/src/Header.tsx", 8);
      const fiber = createFunctionComponentFiber("Header", debugSource);

      // Different React roots can have different suffixes
      attachReact18Fiber(testElement, fiber, "xyz789differentSuffix");

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/Header.tsx");
    });
  });

  // ===========================================================================
  // 2. React 17 Detection
  // ===========================================================================
  describe("React 17 detection", () => {
    it("should detect source from element with __reactInternalInstance$", () => {
      const debugSource = createDebugSource(
        "/src/components/LegacyButton.tsx",
        100
      );
      const fiber = createFunctionComponentFiber("LegacyButton", debugSource);

      attachReact17Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/components/LegacyButton.tsx");
      expect(result?.lineNumber).toBe(100);
      expect(result?.componentName).toBe("LegacyButton");
    });

    it("should handle React 17 class components", () => {
      const debugSource = createDebugSource(
        "/src/components/ClassComponent.tsx",
        25
      );
      const fiber = createClassComponentFiber("ClassComponent", debugSource);

      attachReact17Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/components/ClassComponent.tsx");
      expect(result?.componentName).toBe("ClassComponent");
    });
  });

  // ===========================================================================
  // 3. React 19 Detection (fiber exists but no _debugSource)
  // ===========================================================================
  describe("React 19 detection", () => {
    it("should return null gracefully when fiber exists but no _debugSource", () => {
      // React 19 may strip debug info in certain builds
      const fiber: MockFiberNode = {
        _debugSource: null,
        _debugOwner: null,
        return: null,
        type: function MyComponent() {},
        tag: FiberTags.FunctionComponent,
      };

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).toBeNull();
    });

    it("should return null when entire fiber tree has no debug source", () => {
      const grandparentFiber: MockFiberNode = {
        _debugSource: null,
        _debugOwner: null,
        return: null,
        type: function GrandparentComponent() {},
        tag: FiberTags.FunctionComponent,
      };

      const parentFiber: MockFiberNode = {
        _debugSource: null,
        _debugOwner: grandparentFiber,
        return: grandparentFiber,
        type: function ParentComponent() {},
        tag: FiberTags.FunctionComponent,
      };

      const fiber: MockFiberNode = {
        _debugSource: null,
        _debugOwner: parentFiber,
        return: parentFiber,
        type: function ChildComponent() {},
        tag: FiberTags.FunctionComponent,
      };

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).toBeNull();
    });
  });

  // ===========================================================================
  // 4. No React (plain HTML element)
  // ===========================================================================
  describe("No React", () => {
    it("should return null for plain HTML element without React fiber", () => {
      // testElement has no React fiber attached
      const result = getSourceLocation(testElement);

      expect(result).toBeNull();
    });

    it("should return null for element with unrelated properties", () => {
      // Add some random properties that aren't React fibers
      (testElement as Record<string, unknown>)["__someOtherLibrary$abc"] = {};
      (testElement as Record<string, unknown>)["data-testid"] = "test";

      const result = getSourceLocation(testElement);

      expect(result).toBeNull();
    });

    it("should return null for element with partial fiber-like property name", () => {
      // Property name starts similarly but isn't valid
      (testElement as Record<string, unknown>)["__reactFibe"] = {};
      (testElement as Record<string, unknown>)["__reactInternalInstanc"] = {};

      const result = getSourceLocation(testElement);

      expect(result).toBeNull();
    });
  });

  // ===========================================================================
  // 5. Production Build (React present but no debug info)
  // ===========================================================================
  describe("Production build", () => {
    it("should return null when fiber exists but _debugSource is undefined", () => {
      const fiber: MockFiberNode = {
        // Production builds don't include _debugSource at all
        return: null,
        type: function Button() {},
        tag: FiberTags.FunctionComponent,
      };

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).toBeNull();
    });

    it("should return null for production fiber tree", () => {
      // Simulate production build: fiber chain exists but no debug info anywhere
      const rootFiber: MockFiberNode = {
        return: null,
        type: function App() {},
        tag: FiberTags.FunctionComponent,
      };

      const containerFiber: MockFiberNode = {
        return: rootFiber,
        type: "div",
        tag: FiberTags.HostComponent,
      };

      const buttonFiber: MockFiberNode = {
        return: containerFiber,
        type: function Button() {},
        tag: FiberTags.FunctionComponent,
      };

      attachReact18Fiber(testElement, buttonFiber);

      const result = getSourceLocation(testElement);

      expect(result).toBeNull();
    });

    it("should handle minified component names gracefully", () => {
      // In production, component names might be minified
      const fiber: MockFiberNode = {
        _debugSource: null, // Explicitly null in prod
        return: null,
        type: function t() {}, // Minified name
        tag: FiberTags.FunctionComponent,
      };

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).toBeNull();
    });
  });

  // ===========================================================================
  // 6. Nested Components (walking up fiber tree)
  // ===========================================================================
  describe("Nested components", () => {
    it("should walk up fiber tree via _debugOwner to find source", () => {
      const parentDebugSource = createDebugSource(
        "/src/components/Card.tsx",
        30
      );
      const parentFiber = createFunctionComponentFiber("Card", parentDebugSource);

      // Child fiber has no debug source, but parent does
      const childFiber: MockFiberNode = {
        _debugSource: null,
        _debugOwner: parentFiber,
        return: parentFiber,
        type: function CardContent() {},
        tag: FiberTags.FunctionComponent,
      };

      attachReact18Fiber(testElement, childFiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/components/Card.tsx");
      expect(result?.lineNumber).toBe(30);
      expect(result?.componentName).toBe("Card");
    });

    it("should walk up multiple levels to find source", () => {
      const appDebugSource = createDebugSource("/src/App.tsx", 10);
      const appFiber = createFunctionComponentFiber("App", appDebugSource);

      const layoutFiber: MockFiberNode = {
        _debugSource: null,
        _debugOwner: appFiber,
        return: appFiber,
        type: function Layout() {},
        tag: FiberTags.FunctionComponent,
      };

      const sidebarFiber: MockFiberNode = {
        _debugSource: null,
        _debugOwner: layoutFiber,
        return: layoutFiber,
        type: function Sidebar() {},
        tag: FiberTags.FunctionComponent,
      };

      const menuItemFiber: MockFiberNode = {
        _debugSource: null,
        _debugOwner: sidebarFiber,
        return: sidebarFiber,
        type: function MenuItem() {},
        tag: FiberTags.FunctionComponent,
      };

      attachReact18Fiber(testElement, menuItemFiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/App.tsx");
      expect(result?.componentName).toBe("App");
    });

    it("should prefer closer ancestor with debug source", () => {
      const appDebugSource = createDebugSource("/src/App.tsx", 10);
      const appFiber = createFunctionComponentFiber("App", appDebugSource);

      const cardDebugSource = createDebugSource(
        "/src/components/Card.tsx",
        50
      );
      const cardFiber: MockFiberNode = {
        _debugSource: cardDebugSource,
        _debugOwner: appFiber,
        return: appFiber,
        type: function Card() {},
        tag: FiberTags.FunctionComponent,
      };
      Object.defineProperty(cardFiber.type, "name", { value: "Card" });

      const childFiber: MockFiberNode = {
        _debugSource: null,
        _debugOwner: cardFiber,
        return: cardFiber,
        type: function CardBody() {},
        tag: FiberTags.FunctionComponent,
      };

      attachReact18Fiber(testElement, childFiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      // Should get Card, not App, because it's closer
      expect(result?.fileName).toBe("/src/components/Card.tsx");
      expect(result?.lineNumber).toBe(50);
    });

    it("should handle host components (DOM elements) in the tree", () => {
      const buttonDebugSource = createDebugSource(
        "/src/components/Button.tsx",
        15
      );
      const buttonFiber = createFunctionComponentFiber("Button", buttonDebugSource);

      // Host component (actual DOM element fiber) typically doesn't have debug source
      const spanFiber = createHostComponentFiber("span", buttonFiber);

      attachReact18Fiber(testElement, spanFiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/components/Button.tsx");
      expect(result?.componentName).toBe("Button");
    });

    it("should prevent infinite loops with circular references", () => {
      // This shouldn't happen in real React, but we should handle it gracefully
      const fiber1: MockFiberNode = {
        _debugSource: null,
        type: function ComponentA() {},
        tag: FiberTags.FunctionComponent,
      };

      const fiber2: MockFiberNode = {
        _debugSource: null,
        _debugOwner: fiber1,
        return: fiber1,
        type: function ComponentB() {},
        tag: FiberTags.FunctionComponent,
      };

      // Create a cycle (shouldn't happen but let's be safe)
      fiber1._debugOwner = fiber2;
      fiber1.return = fiber2;

      attachReact18Fiber(testElement, fiber2);

      // Should not hang, should return null after max depth
      const result = getSourceLocation(testElement);

      expect(result).toBeNull();
    });
  });

  // ===========================================================================
  // 7. Third-party Components (node_modules paths)
  // ===========================================================================
  describe("Third-party components", () => {
    it("should detect source from node_modules component", () => {
      const debugSource = createDebugSource(
        "/node_modules/@chakra-ui/react/dist/Button.js",
        234
      );
      const fiber = createFunctionComponentFiber("ChakraButton", debugSource);

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe(
        "/node_modules/@chakra-ui/react/dist/Button.js"
      );
      expect(result?.lineNumber).toBe(234);
    });

    it("should handle deeply nested node_modules paths", () => {
      const debugSource = createDebugSource(
        "/node_modules/@radix-ui/react-dialog/node_modules/@radix-ui/react-primitive/dist/Primitive.js",
        56
      );
      const fiber = createFunctionComponentFiber("Primitive", debugSource);

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toContain("node_modules");
      expect(result?.fileName).toContain("Primitive.js");
    });

    it("should walk up from third-party to find user code source", () => {
      const userDebugSource = createDebugSource(
        "/src/components/Dialog.tsx",
        45
      );
      const userFiber = createFunctionComponentFiber(
        "CustomDialog",
        userDebugSource
      );

      // Radix internal component without debug source
      const radixFiber: MockFiberNode = {
        _debugSource: null, // Third party often stripped
        _debugOwner: userFiber,
        return: userFiber,
        type: function DialogPrimitive() {},
        tag: FiberTags.FunctionComponent,
      };

      attachReact18Fiber(testElement, radixFiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/components/Dialog.tsx");
      expect(result?.componentName).toBe("CustomDialog");
    });

    it("should handle scoped package names", () => {
      const debugSource = createDebugSource(
        "/node_modules/@tanstack/react-query/build/lib/useQuery.js",
        100
      );
      const fiber = createFunctionComponentFiber("QueryClientProvider", debugSource);

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toContain("@tanstack/react-query");
    });
  });

  // ===========================================================================
  // 8. Class vs Function Components
  // ===========================================================================
  describe("Class vs function components", () => {
    it("should detect source from function component", () => {
      const debugSource = createDebugSource(
        "/src/components/FunctionButton.tsx",
        20
      );
      const fiber = createFunctionComponentFiber("FunctionButton", debugSource);

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/components/FunctionButton.tsx");
      expect(result?.componentName).toBe("FunctionButton");
    });

    it("should detect source from class component", () => {
      const debugSource = createDebugSource(
        "/src/components/ClassButton.tsx",
        35
      );
      const fiber = createClassComponentFiber("ClassButton", debugSource);

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/components/ClassButton.tsx");
      expect(result?.componentName).toBe("ClassButton");
    });

    it("should handle arrow function components", () => {
      const debugSource = createDebugSource(
        "/src/components/ArrowButton.tsx",
        5
      );

      // Arrow functions can have inferred names from variable assignment
      const ArrowButton = () => {};
      const fiber: MockFiberNode = {
        _debugSource: debugSource,
        _debugOwner: null,
        return: null,
        type: ArrowButton,
        tag: FiberTags.FunctionComponent,
      };

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/components/ArrowButton.tsx");
      expect(result?.componentName).toBe("ArrowButton");
    });

    it("should handle anonymous function components", () => {
      const debugSource = createDebugSource(
        "/src/components/Anonymous.tsx",
        1
      );

      // Create a truly anonymous function by using Object property assignment
      // This ensures the function has no inferred name from assignment context
      const anonymousFunc = (() => {
        const obj: Record<string, Function> = {};
        obj[""] = function () {};
        return obj[""];
      })();

      const fiber: MockFiberNode = {
        _debugSource: debugSource,
        _debugOwner: null,
        return: null,
        type: anonymousFunc,
        tag: FiberTags.FunctionComponent,
      };

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/components/Anonymous.tsx");
      // Component name should be undefined or empty for anonymous functions
      // (JavaScript engines may assign empty string or leave it undefined)
      expect(result?.componentName === undefined || result?.componentName === "").toBe(true);
    });
  });

  // ===========================================================================
  // 9. Memo/ForwardRef Wrapped Components
  // ===========================================================================
  describe("Memo/forwardRef wrapped", () => {
    it("should find source from React.memo wrapped component", () => {
      const debugSource = createDebugSource(
        "/src/components/MemoizedList.tsx",
        88
      );
      const innerFiber = createFunctionComponentFiber("MemoizedList", debugSource);
      const memoFiber = createMemoFiber(innerFiber, debugSource);

      attachReact18Fiber(testElement, memoFiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/components/MemoizedList.tsx");
      expect(result?.lineNumber).toBe(88);
    });

    it("should find source from forwardRef wrapped component", () => {
      const debugSource = createDebugSource(
        "/src/components/FancyInput.tsx",
        12
      );
      const fiber = createForwardRefFiber("FancyInput", debugSource);

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/components/FancyInput.tsx");
      expect(result?.componentName).toBe("FancyInput");
    });

    it("should handle nested memo(forwardRef()) pattern", () => {
      const debugSource = createDebugSource(
        "/src/components/ComplexInput.tsx",
        22
      );

      const forwardRefFiber = createForwardRefFiber(
        "ComplexInput",
        debugSource
      );

      // Memo wrapping forwardRef
      const memoFiber: MockFiberNode = {
        _debugSource: debugSource,
        _debugOwner: null,
        return: null,
        type: forwardRefFiber.type,
        elementType: {
          $$typeof: Symbol.for("react.memo"),
          displayName: "Memo(ComplexInput)",
        },
        tag: FiberTags.MemoComponent,
      };

      attachReact18Fiber(testElement, memoFiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/components/ComplexInput.tsx");
    });

    it("should walk up tree when memo wrapper has no debug source", () => {
      const parentDebugSource = createDebugSource(
        "/src/components/Parent.tsx",
        77
      );
      const parentFiber = createFunctionComponentFiber("Parent", parentDebugSource);

      // Memo component without its own debug source
      const memoFiber: MockFiberNode = {
        _debugSource: null, // No debug source on the memo wrapper
        _debugOwner: parentFiber,
        return: parentFiber,
        type: function MemoChild() {},
        elementType: {
          $$typeof: Symbol.for("react.memo"),
          displayName: "Memo(MemoChild)",
        },
        tag: FiberTags.MemoComponent,
      };

      attachReact18Fiber(testElement, memoFiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/components/Parent.tsx");
      expect(result?.componentName).toBe("Parent");
    });

    it("should handle SimpleMemoComponent (functional memo)", () => {
      const debugSource = createDebugSource(
        "/src/components/SimpleList.tsx",
        33
      );

      const fiber: MockFiberNode = {
        _debugSource: debugSource,
        _debugOwner: null,
        return: null,
        type: function SimpleList() {},
        tag: FiberTags.SimpleMemoComponent,
      };

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/components/SimpleList.tsx");
    });
  });

  // ===========================================================================
  // 10. Server-rendered HTML (before hydration)
  // ===========================================================================
  describe("Server-rendered HTML", () => {
    it("should return null for SSR HTML before hydration", () => {
      // Server-rendered HTML won't have React fiber attached
      const ssrElement = document.createElement("div");
      ssrElement.setAttribute("data-reactroot", "");
      ssrElement.innerHTML = "<span>Server rendered content</span>";
      document.body.appendChild(ssrElement);

      const result = getSourceLocation(ssrElement);

      expect(result).toBeNull();

      document.body.removeChild(ssrElement);
    });

    it("should return null for elements with React root marker but no fiber", () => {
      const rootElement = document.createElement("div");
      rootElement.id = "root";
      rootElement.setAttribute("data-reactroot", "");
      document.body.appendChild(rootElement);

      // Even with React markers, if fiber isn't attached yet, return null
      const result = getSourceLocation(rootElement);

      expect(result).toBeNull();

      document.body.removeChild(rootElement);
    });

    it("should return null for streaming SSR content", () => {
      // Simulating streaming SSR where content appears before hydration
      const streamedElement = document.createElement("div");
      streamedElement.innerHTML = `
        <!--$-->
        <div>Streamed content</div>
        <!--/$-->
      `;
      document.body.appendChild(streamedElement);

      const child = streamedElement.querySelector("div") as HTMLElement;
      const result = getSourceLocation(child);

      expect(result).toBeNull();

      document.body.removeChild(streamedElement);
    });

    it("should return null for RSC payload markers", () => {
      // React Server Components payload
      const rscElement = document.createElement("script");
      rscElement.type = "application/json";
      rscElement.id = "__NEXT_DATA__";
      document.body.appendChild(rscElement);

      const container = document.createElement("div");
      container.setAttribute("data-rsc", "");
      document.body.appendChild(container);

      const result = getSourceLocation(container);

      expect(result).toBeNull();

      document.body.removeChild(rscElement);
      document.body.removeChild(container);
    });
  });

  // ===========================================================================
  // Edge Cases and Additional Coverage
  // ===========================================================================
  describe("Edge cases", () => {
    it("should handle null element type gracefully", () => {
      const debugSource = createDebugSource("/src/test.tsx", 1);
      const fiber: MockFiberNode = {
        _debugSource: debugSource,
        _debugOwner: null,
        return: null,
        type: null as unknown as string,
        tag: FiberTags.FunctionComponent,
      };

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/test.tsx");
      expect(result?.componentName).toBeUndefined();
    });

    it("should handle string type (host component)", () => {
      const debugSource = createDebugSource("/src/components/List.tsx", 55);
      const fiber: MockFiberNode = {
        _debugSource: debugSource,
        _debugOwner: null,
        return: null,
        type: "div", // Host component type is a string
        tag: FiberTags.HostComponent,
      };

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/components/List.tsx");
      expect(result?.componentName).toBeUndefined(); // String types don't have names
    });

    it("should handle components with displayName", () => {
      const debugSource = createDebugSource(
        "/src/components/HOCComponent.tsx",
        99
      );
      const Component = function OriginalName() {};
      (Component as { displayName?: string }).displayName =
        "withAuth(OriginalName)";

      const fiber: MockFiberNode = {
        _debugSource: debugSource,
        _debugOwner: null,
        return: null,
        type: Component,
        tag: FiberTags.FunctionComponent,
      };

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.componentName).toBe("withAuth(OriginalName)");
    });

    it("should handle very deep component trees", () => {
      let currentFiber: MockFiberNode | null = null;

      // Create a deep tree of 100 components
      for (let i = 99; i >= 0; i--) {
        const newFiber: MockFiberNode = {
          _debugSource: i === 0 ? createDebugSource("/src/Root.tsx", 1) : null,
          _debugOwner: currentFiber,
          return: currentFiber,
          type: function () {},
          tag: FiberTags.FunctionComponent,
        };
        Object.defineProperty(newFiber.type, "name", {
          value: `Component${i}`,
        });
        currentFiber = newFiber;
      }

      attachReact18Fiber(testElement, currentFiber!);

      const result = getSourceLocation(testElement);

      // Should find the root component at depth 0
      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/Root.tsx");
    });

    it("should handle fiber with only return (no _debugOwner)", () => {
      const parentDebugSource = createDebugSource(
        "/src/components/OnlyReturn.tsx",
        15
      );
      const parentFiber = createFunctionComponentFiber(
        "OnlyReturn",
        parentDebugSource
      );

      const fiber: MockFiberNode = {
        _debugSource: null,
        // No _debugOwner, only return
        return: parentFiber,
        type: function Child() {},
        tag: FiberTags.FunctionComponent,
      };

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe("/src/components/OnlyReturn.tsx");
    });

    it("should handle Windows-style file paths", () => {
      const debugSource = createDebugSource(
        "C:\\Users\\dev\\project\\src\\Button.tsx",
        42
      );
      const fiber = createFunctionComponentFiber("Button", debugSource);

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toBe(
        "C:\\Users\\dev\\project\\src\\Button.tsx"
      );
    });

    it("should handle webpack-transformed paths", () => {
      const debugSource = createDebugSource(
        "webpack:///./src/components/Button.tsx?abc123",
        42
      );
      const fiber = createFunctionComponentFiber("Button", debugSource);

      attachReact18Fiber(testElement, fiber);

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      expect(result?.fileName).toContain("Button.tsx");
    });

    it("should prefer React 18 fiber over React 17 if both exist", () => {
      const react18Source = createDebugSource("/src/React18.tsx", 18);
      const react18Fiber = createFunctionComponentFiber("React18", react18Source);

      const react17Source = createDebugSource("/src/React17.tsx", 17);
      const react17Fiber = createFunctionComponentFiber("React17", react17Source);

      // Attach both (unusual but let's test the priority)
      attachReact18Fiber(testElement, react18Fiber, "suffix18");
      attachReact17Fiber(testElement, react17Fiber, "suffix17");

      const result = getSourceLocation(testElement);

      expect(result).not.toBeNull();
      // Should prefer React 18
      expect(result?.fileName).toBe("/src/React18.tsx");
    });
  });
});
