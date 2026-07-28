import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Agentation, PageFeedbackToolbarCSS } from "./react";

afterEach(() => {
  cleanup();
  document.body.replaceChildren();
});

describe("React compatibility wrapper", () => {
  it("mounts the custom element and removes it on unmount", () => {
    const view = render(<Agentation copyToClipboard={false} />);
    const element = document.querySelector("agentation-overlay");
    expect(element?.shadowRoot?.querySelector('[data-action="toggle-active"]')).not.toBeNull();

    view.unmount();
    expect(document.querySelector("agentation-overlay")).toBeNull();
  });

  it("keeps PageFeedbackToolbarCSS as a source-compatible alias", () => {
    expect(PageFeedbackToolbarCSS).toBe(Agentation);
  });
});
