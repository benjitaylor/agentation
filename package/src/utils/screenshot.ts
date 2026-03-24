// =============================================================================
// Drawing Screenshots
// =============================================================================
//
// Captures a DOM region with drawing strokes composited on top.
//
// Uses `modern-screenshot` (optional peer dep) for DOM-to-image capture.
// If not installed, falls back to stroke-only canvas capture.
//

// Cache the import result so we only try once
let _domCaptureModule: {
  domToCanvas: (node: Node, options?: Record<string, unknown>) => Promise<HTMLCanvasElement>;
} | null | undefined; // null = tried and failed, undefined = not tried yet

async function getDomCapture() {
  if (_domCaptureModule !== undefined) return _domCaptureModule;
  try {
    _domCaptureModule = await import("modern-screenshot");
    return _domCaptureModule;
  } catch {
    _domCaptureModule = null;
    return null;
  }
}

/**
 * Check whether DOM capture is available (modern-screenshot is installed).
 * Returns a cached result after the first check.
 */
export async function isDomCaptureAvailable(): Promise<boolean> {
  return (await getDomCapture()) !== null;
}


// ---------------------------------------------------------------------------
// Find capture target element
// ---------------------------------------------------------------------------

/**
 * Find the smallest DOM element that covers a given viewport region.
 * Uses elementsFromPoint to get all elements at the region center,
 * then picks the smallest one that fully contains the capture area.
 */
function findCaptureTarget(
  captureX: number,
  captureY: number,
  captureW: number,
  captureH: number,
): HTMLElement {
  const cx = captureX + captureW / 2;
  const cy = captureY + captureH / 2;

  // elementsFromPoint returns elements from most specific (smallest) to least
  const elements = document.elementsFromPoint(cx, cy);

  for (const el of elements) {
    if (!(el instanceof HTMLElement)) continue;
    // Skip agentation UI
    if (el.hasAttribute("data-agentation-root")) continue;
    if (el.closest?.("[data-agentation-root]")) continue;
    if (el.tagName === "CANVAS") continue;
    // Skip html/body — we want something more specific
    if (el === document.documentElement || el === document.body) continue;

    const rect = el.getBoundingClientRect();
    // Accept elements that cover at least ~90% of the capture region
    if (
      rect.left <= captureX + captureW * 0.1 &&
      rect.top <= captureY + captureH * 0.1 &&
      rect.right >= captureX + captureW * 0.9 &&
      rect.bottom >= captureY + captureH * 0.9
    ) {
      return el;
    }
  }

  return document.body;
}

// ---------------------------------------------------------------------------
// DOM capture (modern-screenshot)
// ---------------------------------------------------------------------------

/**
 * Capture a viewport region as a JPEG data URL using DOM-to-image.
 * Composites drawing strokes on top.
 *
 * Returns null if modern-screenshot is not installed or capture fails.
 */
export async function captureDomRegion(
  regionX: number,
  regionY: number,
  regionW: number,
  regionH: number,
  strokes: Array<{
    points: Array<{ x: number; y: number }>;
    color: string;
    fixed: boolean;
  }>,
  padding = 32,
  quality = 0.85,
): Promise<string | null> {
  const mod = await getDomCapture();
  if (!mod) return null;

  // Region to capture in viewport coords
  const captureX = Math.max(0, regionX - padding);
  const captureY = Math.max(0, regionY - padding);
  const captureW = regionW + padding * 2;
  const captureH = regionH + padding * 2;

  // Output size (capped)
  const maxDim = 600;
  const outScale = Math.min(1, maxDim / Math.max(captureW, captureH));
  const outW = Math.round(captureW * outScale);
  const outH = Math.round(captureH * outScale);
  if (outW < 1 || outH < 1) return null;

  // Hide agentation UI so it doesn't appear in the capture
  const agentationRoot = document.querySelector("[data-agentation-root]") as HTMLElement | null;
  const prevVisibility = agentationRoot?.style.visibility;
  if (agentationRoot) agentationRoot.style.visibility = "hidden";

  try {
    const target = findCaptureTarget(captureX, captureY, captureW, captureH);
    const targetRect = target.getBoundingClientRect();

    // Render the target element at 1:1 CSS pixel scale
    const domCanvas = await mod.domToCanvas(target, {
      backgroundColor: "#ffffff",
      timeout: 5000,
    });

    // domToCanvas renders the element's full scrollable content.
    // We need to map our viewport capture region to the domCanvas coords.
    //
    // For non-scrollable elements: domCanvas size ≈ targetRect size
    // For scrollable elements: domCanvas size ≈ scrollWidth × scrollHeight
    //
    // The offset within the canvas depends on whether the target has scrolled content.
    // Use the ratio of canvas size to actual element dimensions.
    const ratioX = domCanvas.width / (target.scrollWidth || targetRect.width);
    const ratioY = domCanvas.height / (target.scrollHeight || targetRect.height);

    // Convert viewport offset to element-content offset
    // targetRect.top is viewport-relative; for scrolled elements we need to add scrollTop
    const scrollLeft = target === document.body ? window.scrollX : target.scrollLeft;
    const scrollTop = target === document.body ? window.scrollY : target.scrollTop;

    const elContentX = (captureX - targetRect.left + scrollLeft) * ratioX;
    const elContentY = (captureY - targetRect.top + scrollTop) * ratioY;
    const cropW = captureW * ratioX;
    const cropH = captureH * ratioY;

    // Create output canvas and crop
    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // White background in case crop extends beyond domCanvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outW, outH);

    ctx.drawImage(
      domCanvas,
      elContentX, elContentY, cropW, cropH,
      0, 0, outW, outH,
    );

    // Composite drawing strokes on top
    drawStrokesOnCanvas(ctx, strokes, captureX, captureY, outScale);

    return canvas.toDataURL("image/jpeg", quality);
  } catch (err) {
    console.warn("[Agentation] DOM capture failed:", err);
    return null;
  } finally {
    // Always restore agentation UI
    if (agentationRoot) agentationRoot.style.visibility = prevVisibility ?? "";
  }
}

// ---------------------------------------------------------------------------
// Stroke-only fallback
// ---------------------------------------------------------------------------

/**
 * Capture drawing strokes as a PNG data URL (fallback when DOM capture
 * isn't available). Renders strokes on a light background.
 */
export function captureDrawingStrokes(
  regionX: number,
  regionY: number,
  regionW: number,
  regionH: number,
  strokes: Array<{
    points: Array<{ x: number; y: number }>;
    color: string;
    fixed: boolean;
  }>,
  padding = 32,
): string | null {
  try {
    const captureX = Math.max(0, regionX - padding);
    const captureY = Math.max(0, regionY - padding);
    const captureW = regionW + padding * 2;
    const captureH = regionH + padding * 2;

    const maxDim = 400;
    const scale = Math.min(1, maxDim / Math.max(captureW, captureH));
    const outW = Math.round(captureW * scale);
    const outH = Math.round(captureH * scale);

    if (outW < 1 || outH < 1) return null;

    const canvas = document.createElement("canvas");
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.fillRect(0, 0, outW, outH);

    drawStrokesOnCanvas(ctx, strokes, captureX, captureY, scale);

    return canvas.toDataURL("image/png");
  } catch (err) {
    console.warn("[Agentation] Stroke capture failed:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Shared: draw strokes onto a canvas
// ---------------------------------------------------------------------------

function drawStrokesOnCanvas(
  ctx: CanvasRenderingContext2D,
  strokes: Array<{
    points: Array<{ x: number; y: number }>;
    color: string;
    fixed: boolean;
  }>,
  originX: number,
  originY: number,
  scale: number,
) {
  const scrollY = window.scrollY;
  for (const stroke of strokes) {
    if (stroke.points.length < 2) continue;

    ctx.save();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = Math.max(2, 2.5 * scale);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    for (let i = 0; i < stroke.points.length; i++) {
      const p = stroke.points[i];
      const vx = p.x;
      const vy = stroke.fixed ? p.y : p.y - scrollY;
      const cx = (vx - originX) * scale;
      const cy = (vy - originY) * scale;

      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.restore();
  }
}
