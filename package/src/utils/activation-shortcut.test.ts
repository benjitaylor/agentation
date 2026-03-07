import { describe, expect, it } from "vitest";

import {
  DEFAULT_ACTIVATION_SHORTCUT,
  eventToActivationShortcut,
  formatActivationShortcut,
  matchesActivationShortcut,
} from "./activation-shortcut";

describe("activation-shortcut", () => {
  it("formats the default shortcut for macOS", () => {
    expect(formatActivationShortcut(DEFAULT_ACTIVATION_SHORTCUT, "mac")).toBe(
      "Cmd + Shift + F",
    );
  });

  it("captures a shortcut from a keyboard event", () => {
    const shortcut = eventToActivationShortcut(
      new KeyboardEvent("keydown", {
        key: "a",
        metaKey: true,
        shiftKey: true,
      }),
      "mac",
    );

    expect(shortcut).toEqual({
      key: "A",
      modifiers: ["mod", "shift"],
    });
  });

  it("matches the configured shortcut", () => {
    const shortcut = {
      key: "A",
      modifiers: ["mod", "shift"] as const,
    };

    expect(
      matchesActivationShortcut(
        new KeyboardEvent("keydown", {
          key: "a",
          metaKey: true,
          shiftKey: true,
        }),
        shortcut,
        "mac",
      ),
    ).toBe(true);

    expect(
      matchesActivationShortcut(
        new KeyboardEvent("keydown", {
          key: "f",
          metaKey: true,
          shiftKey: true,
        }),
        shortcut,
        "mac",
      ),
    ).toBe(false);
  });
});
