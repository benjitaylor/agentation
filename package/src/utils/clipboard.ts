/**
 * Copy text to the system clipboard.
 *
 * Tries the async Clipboard API first, then falls back to a temporary
 * textarea + `document.execCommand("copy")` for contexts where
 * `navigator.clipboard.writeText` is denied (unfocused documents,
 * embedded browsers, missing permissions, non-HTTPS).
 *
 * @returns `true` if text was written to the clipboard, otherwise `false`.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to execCommand fallback
  }

  return copyTextViaExecCommand(text);
}

function copyTextViaExecCommand(text: string): boolean {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.cssText =
      "position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none;";
    document.body.appendChild(textarea);

    const selection = document.getSelection();
    const previousRange =
      selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);

    const ok = document.execCommand("copy");

    document.body.removeChild(textarea);

    if (previousRange && selection) {
      selection.removeAllRanges();
      selection.addRange(previousRange);
    }

    return ok;
  } catch {
    return false;
  }
}
