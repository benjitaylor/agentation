import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mountAgentation } from "./runtime";
import type { AgentationEvent } from "./types";

const RECT = {
  x: 20,
  y: 30,
  left: 20,
  top: 30,
  right: 140,
  bottom: 70,
  width: 120,
  height: 40,
  toJSON: () => ({}),
} as DOMRect;

beforeEach(() => {
  document.body.replaceChildren();
  localStorage.clear();
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.replaceChildren();
  localStorage.clear();
});

describe("native Agentation runtime", () => {
  it("mounts once per document and releases the document on destroy", () => {
    const first = mountAgentation(document);
    expect(first.element.shadowRoot?.querySelector('[data-action="toggle-active"]')).not.toBeNull();
    expect(() => mountAgentation(document)).toThrow(/one Agentation instance/i);

    first.destroy();
    expect(document.querySelector("agentation-overlay")).toBeNull();

    const second = mountAgentation(document);
    expect(second.element.isConnected).toBe(true);
    second.destroy();
  });

  it("annotates a host element with neutral framework metadata", async () => {
    const pageButton = document.createElement("button");
    pageButton.textContent = "Save profile";
    pageButton.getBoundingClientRect = () => RECT;
    document.body.append(pageButton);
    const onAnnotationAdd = vi.fn();
    const controller = mountAgentation(document, {
      onAnnotationAdd,
      metadata: [{
        id: "solid",
        inspect: () => ({
          componentPath: ["App", "Profile", "Button"],
          source: { file: "src/Profile.tsx", line: 42, column: 7 },
          confidence: "exact",
        }),
      }],
    });
    const root = controller.element.shadowRoot!;

    (root.querySelector('[data-action="toggle-active"]') as HTMLButtonElement).click();
    pageButton.dispatchEvent(new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientX: 80,
      clientY: 50,
    }));

    const textarea = root.querySelector<HTMLTextAreaElement>('textarea[data-field="comment"]')!;
    textarea.value = "Increase the hit target";
    textarea.dispatchEvent(new InputEvent("input", { bubbles: true }));
    (root.querySelector('[data-action="save-popup"]') as HTMLButtonElement).click();

    expect(onAnnotationAdd).toHaveBeenCalledTimes(1);
    const annotation = onAnnotationAdd.mock.calls[0][0];
    expect(annotation).toMatchObject({
      comment: "Increase the hit target",
      framework: {
        name: "solid",
        componentPath: ["App", "Profile", "Button"],
        source: { file: "src/Profile.tsx", line: 42, column: 7 },
        confidence: "exact",
      },
      sourceFile: "src/Profile.tsx:42:7",
    });
    expect(annotation.reactComponents).toBeUndefined();
    expect(controller.getAnnotations()).toHaveLength(1);
    expect(root.querySelectorAll(".ag-marker")).toHaveLength(1);
    controller.destroy();
  });

  it("emits cancelable copy output before writing to the clipboard", () => {
    const controller = mountAgentation(document, {
      enableDemoMode: true,
      demoDelay: 0,
      demoAnnotations: [],
    });
    localStorage.setItem("feedback-annotations-/", JSON.stringify([{
      id: "ann_1",
      x: 50,
      y: 100,
      comment: "Use the primary token",
      element: "button",
      elementPath: "main > button",
      timestamp: Date.now(),
    }]));
    controller.destroy();

    const remounted = mountAgentation(document);
    const root = remounted.element.shadowRoot!;
    let output = "";
    remounted.element.addEventListener("agentation", ((event: AgentationEvent) => {
      if (event.detail.type !== "copy") return;
      output = event.detail.output;
      event.preventDefault();
    }) as EventListener);
    (root.querySelector('[data-action="toggle-active"]') as HTMLButtonElement).click();
    (root.querySelector('[data-action="copy"]') as HTMLButtonElement).click();

    expect(output).toContain("Use the primary token");
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    remounted.destroy();
  });
});
