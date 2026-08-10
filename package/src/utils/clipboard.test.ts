import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { copyTextToClipboard } from "./clipboard";

function stubExecCommand(impl: Document["execCommand"]) {
  Object.defineProperty(document, "execCommand", {
    configurable: true,
    writable: true,
    value: impl,
  });
  return vi.spyOn(document, "execCommand");
}

describe("copyTextToClipboard", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("returns true when Clipboard API write succeeds", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      clipboard: { writeText },
    });

    await expect(copyTextToClipboard("hello")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("hello");
  });

  it("falls back to execCommand when Clipboard API throws", async () => {
    const writeText = vi
      .fn()
      .mockRejectedValue(new Error("Document is not focused."));
    vi.stubGlobal("navigator", {
      clipboard: { writeText },
    });
    const exec = stubExecCommand(vi.fn().mockReturnValue(true));

    await expect(copyTextToClipboard("fallback text")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("fallback text");
    expect(exec).toHaveBeenCalledWith("copy");
  });

  it("falls back to execCommand when Clipboard API is missing", async () => {
    vi.stubGlobal("navigator", {});
    const exec = stubExecCommand(vi.fn().mockReturnValue(true));

    await expect(copyTextToClipboard("no api")).resolves.toBe(true);
    expect(exec).toHaveBeenCalledWith("copy");
  });

  it("returns false when both Clipboard API and execCommand fail", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    vi.stubGlobal("navigator", {
      clipboard: { writeText },
    });
    stubExecCommand(vi.fn().mockReturnValue(false));

    await expect(copyTextToClipboard("nope")).resolves.toBe(false);
  });

  it("returns false when execCommand throws", async () => {
    vi.stubGlobal("navigator", {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error("denied")),
      },
    });
    stubExecCommand(
      vi.fn(() => {
        throw new Error("exec failed");
      }),
    );

    await expect(copyTextToClipboard("boom")).resolves.toBe(false);
  });
});
