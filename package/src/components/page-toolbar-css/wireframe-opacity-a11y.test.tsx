import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, waitFor, within, act } from "@testing-library/react";
import { PageFeedbackToolbarCSS } from "./index";

function toolbarRoot() {
  return document.querySelector("agentation-toolbar")!.shadowRoot! as unknown as HTMLElement;
}

const mockClipboard = { writeText: vi.fn().mockResolvedValue(undefined) };

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.stubGlobal("navigator", { clipboard: mockClipboard, userAgent: "test-agent" });
  vi.stubGlobal("ResizeObserver", class { observe() {} unobserve() {} disconnect() {} });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("wireframe canvas opacity slider accessibility", () => {
  it("exposes an accessible name via the visible 'Toggle Opacity' label", async () => {
    render(<PageFeedbackToolbarCSS />);
    const ui = within(toolbarRoot());

    // Activate the toolbar, enter layout mode, then switch to a blank wireframe canvas.
    fireEvent.keyDown(document, { key: "f", ctrlKey: true, shiftKey: true });
    fireEvent.click(ui.getByRole("button", { name: "Layout mode" }));
    fireEvent.click(ui.getByRole("button", { name: "Wireframe New Page" }));

    // The opacity slider only mounts once the blank canvas is marked ready (one frame later).
    const root = toolbarRoot();
    const slider = await waitFor(() => {
      const el = root.querySelector<HTMLInputElement>('input[type="range"]');
      expect(el).not.toBeNull();
      return el!;
    });

    // Its accessible name comes from the associated visible "Toggle Opacity" label.
    const labelId = slider.getAttribute("aria-labelledby");
    expect(labelId).toBeTruthy();
    expect(root.querySelector(`#${labelId}`)?.textContent?.trim()).toBe("Toggle Opacity");

    // And it is therefore reachable by its accessible name.
    expect(ui.getByRole("slider", { name: "Toggle Opacity" })).toBe(slider);

    await act(async () => {});
  });
});
