/**
 * 将文本复制到剪贴板, 优先使用现代 Clipboard API,
 * 在非安全上下文 (HTTP, 非 localhost) 下回退到 execCommand 方案.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  // 优先使用 Clipboard API (需要安全上下文: HTTPS 或 localhost)
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // 权限被拒绝或写入失败, 继续尝试回退方案
    }
  }

  // 回退方案: 使用临时 textarea + execCommand('copy')
  // 适用于非安全上下文 (HTTP) 或 Clipboard API 不可用的环境
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const succeeded = document.execCommand("copy");
    document.body.removeChild(textarea);
    return succeeded;
  } catch {
    return false;
  }
}
