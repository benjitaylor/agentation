/**
 * Copy text to the clipboard with a fallback for non-secure contexts.
 *
 * `navigator.clipboard.writeText` requires a **secure context** (HTTPS,
 * localhost, or 127.0.0.1). When the page is served over plain HTTP on a
 * LAN IP such as `http://10.2.3.4:3000`, the Clipboard API is unavailable
 * and silently fails.
 *
 * This helper tries the modern Clipboard API first, then falls back to the
 * legacy `document.execCommand("copy")` approach which works in all contexts.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  // 1. Try modern Clipboard API (requires secure context)
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // SecurityError in non-secure contexts or permission denied – fall through
    }
  }

  // 2. Fallback: hidden textarea + execCommand("copy")
  const textarea = document.createElement("textarea");
  textarea.value = text;

  // Move off-screen so it's invisible but still selectable
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "-9999px";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}
