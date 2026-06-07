import { describe, it, expect, vi, afterEach } from "vitest";
import { copyTextToClipboard } from "./clipboard";

describe("copyTextToClipboard", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("should use navigator.clipboard.writeText when available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    const result = await copyTextToClipboard("hello");

    expect(writeText).toHaveBeenCalledWith("hello");
    expect(result).toBe(true);
  });

  it("should fall back to execCommand when clipboard API throws", async () => {
    const writeText = vi.fn().mockRejectedValue(new DOMException("not allowed"));
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    // jsdom does not implement execCommand, so we need to define it
    document.execCommand = vi.fn().mockReturnValue(true);

    const result = await copyTextToClipboard("hello");

    expect(writeText).toHaveBeenCalled();
    expect(document.execCommand).toHaveBeenCalledWith("copy");
    expect(result).toBe(true);
  });

  it("should fall back to execCommand when clipboard API is unavailable", async () => {
    vi.stubGlobal("navigator", {});

    document.execCommand = vi.fn().mockReturnValue(true);

    const result = await copyTextToClipboard("hello");

    expect(document.execCommand).toHaveBeenCalledWith("copy");
    expect(result).toBe(true);
  });

  it("should return false when both methods fail", async () => {
    vi.stubGlobal("navigator", {});

    document.execCommand = vi.fn().mockImplementation(() => {
      throw new Error("not supported");
    });

    const result = await copyTextToClipboard("hello");

    expect(result).toBe(false);
  });

  it("should clean up the textarea element after fallback copy", async () => {
    vi.stubGlobal("navigator", {});
    document.execCommand = vi.fn().mockReturnValue(true);

    const appendSpy = vi.spyOn(document.body, "appendChild");
    const removeSpy = vi.spyOn(document.body, "removeChild");

    await copyTextToClipboard("hello");

    expect(appendSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledTimes(1);

    // Verify the textarea was created with the correct value
    const textarea = appendSpy.mock.calls[0][0] as HTMLTextAreaElement;
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea.value).toBe("hello");
  });
});
