import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { PageFeedbackToolbarCSS } from "./index";

const originalPoint = document.elementFromPoint;
const originalStack = document.elementsFromPoint;
const root = () => document.querySelector("agentation-toolbar")!.shadowRoot!;
const popup = () => root().querySelector("[data-annotation-popup]");
const activate = () => fireEvent.keyDown(document, { key: "f", ctrlKey: true, shiftKey: true });
const STYLE = "#agentation-disabled-controls";

beforeEach(() => {
  localStorage.clear(); sessionStorage.clear();
  vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn() }, userAgent: "test-agent" });
});
afterEach(() => {
  cleanup(); document.elementFromPoint = originalPoint; document.elementsFromPoint = originalStack;
  vi.unstubAllGlobals(); vi.restoreAllMocks();
});

/**
 * Browsers route the click to the wrapper while the pass-through style is
 * active, and hit testing (mocked here) resolves the control underneath.
 */
function clickThroughWrapper(wrapper: HTMLElement, control: HTMLElement) {
  document.elementFromPoint = () => {
    // The hit-test attribute must be set while the control is resolved.
    expect(document.documentElement.hasAttribute("data-agentation-hit-test")).toBe(true);
    return control;
  };
  document.elementsFromPoint = () => [control, wrapper, document.body];
  vi.spyOn(control, "getBoundingClientRect").mockReturnValue(new DOMRect(10, 10, 80, 30));
  fireEvent.click(wrapper, { clientX: 15, clientY: 15 });
}

const cases: [string, string, string][] = [
  ["button", '<button disabled>Submit order</button>', "button"],
  ["input", '<input disabled type="text" aria-label="Email" />', "input"],
  ["select", '<select disabled aria-label="Country"><option>UK</option></select>', "select"],
  ["textarea", '<textarea disabled aria-label="Notes"></textarea>', "textarea"],
  ["fieldset descendant", '<fieldset disabled><label for="n">Name</label><input id="n" type="text" /></fieldset>', "input"],
  ["option", '<select aria-label="Size"><option disabled>Small</option></select>', "option"],
  ["optgroup", '<select aria-label="Plan"><optgroup disabled label="Paid"><option>Pro</option></optgroup></select>', "optgroup"],
];

describe("annotating disabled controls", () => {
  it("routes the pointer past disabled controls only while active", () => {
    render(<><div><button disabled>Off</button></div><PageFeedbackToolbarCSS /></>);
    expect(document.querySelector(STYLE)).toBeNull();
    activate();
    expect(document.querySelector(STYLE)).not.toBeNull();
    activate();
    expect(document.querySelector(STYLE)).toBeNull();
  });

  it("covers a frame once the pointer enters it", async () => {
    render(<><iframe title="frame" /><PageFeedbackToolbarCSS /></>);
    const inner = document.querySelector("iframe")!.contentDocument!;
    activate();
    await Promise.resolve();
    expect(inner.querySelector(STYLE)).toBeNull();
    fireEvent.pointerOver(inner.body);
    expect(inner.querySelector(STYLE)).not.toBeNull();
    activate();
    expect(inner.querySelector(STYLE)).toBeNull();
  });

  it.each(cases)("opens an annotation on a disabled %s", (_label, html, tag) => {
    const onAnnotationAdd = vi.fn();
    render(<><div data-testid="wrapper" dangerouslySetInnerHTML={{ __html: html }} /><PageFeedbackToolbarCSS onAnnotationAdd={onAnnotationAdd} /></>);
    const wrapper = document.querySelector<HTMLElement>('[data-testid="wrapper"]')!;
    const control = wrapper.querySelector<HTMLElement>(tag)!;
    expect(control.matches(":disabled")).toBe(true);
    activate();
    clickThroughWrapper(wrapper, control);
    expect(popup()).not.toBeNull();
    expect(popup()!.textContent).toContain(tag);
  });

  it("reports the disabled control on hover", () => {
    render(<><div data-testid="wrapper"><button disabled>Pay now</button></div><PageFeedbackToolbarCSS /></>);
    const wrapper = document.querySelector<HTMLElement>('[data-testid="wrapper"]')!;
    const control = wrapper.querySelector("button")!;
    activate();
    document.elementFromPoint = () => control;
    document.elementsFromPoint = () => [control, wrapper, document.body];
    vi.spyOn(control, "getBoundingClientRect").mockReturnValue(new DOMRect(10, 10, 80, 30));
    fireEvent.mouseMove(wrapper, { clientX: 15, clientY: 15 });
    expect(root().textContent).toContain("Pay now");
  });
});
