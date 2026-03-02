"use client";

import { useState, useEffect, useRef } from "react";
import "./FeaturesDemo.css";
import "./DeepSelectDemo.css";

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/* ─────────────────────────────────────────────────────────
 * ANIMATION STORYBOARD
 *
 *    0ms   reset — cursor top-right, caption: idle
 *  600ms   cursor moves toward "Export" button
 * 1000ms   NORMAL: solid highlight on entire card + overlay flash
 *          → tooltip: div.AnimatePresence (wrong/dimmed)
 *          → caption: "Normal hover selects the invisible wrapper."
 * 2600ms   highlight + tooltip fade out
 * 3000ms   caption: "Hold ⌘ to pierce through overlay layers."
 * 5000ms   PIERCE: dashed highlight on just the button
 *          → tooltip: button "Export" (correct/bright)
 *          → caption: "Deep select finds the actual element underneath."
 * 6400ms   popup appears, types "Add loading state"
 * 8200ms   popup closes, marker placed
 * 10200ms  marker fades, loop
 * ───────────────────────────────────────────────────────── */

const LOOP_INTERVAL = 11800;
const CHART_HEIGHTS = [45, 60, 35, 75, 55, 90, 70, 85];

type CaptionKey = "idle" | "cmd" | "correct";

const CAPTIONS: Record<CaptionKey, string> = {
  idle: "Normal hover selects the invisible animation wrapper.",
  cmd: "Hold \u2318 to pierce through overlay layers.",
  correct: "Deep select finds the actual element underneath.",
};

export function DeepSelectDemo() {
  const [cursorPos, setCursorPos] = useState({ x: 280, y: 40 });
  const [activeCaption, setActiveCaption] = useState<CaptionKey>("idle");

  const [highlight, setHighlight] = useState<{
    visible: boolean;
    mode: "normal" | "pierce";
    rect: { x: number; y: number; w: number; h: number };
  }>({ visible: false, mode: "normal", rect: { x: 0, y: 0, w: 0, h: 0 } });

  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    text: string;
    type: "wrong" | "correct";
    x: number;
    y: number;
  }>({ visible: false, text: "", type: "wrong", x: 0, y: 0 });

  const [showPopup, setShowPopup] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showMarker, setShowMarker] = useState(false);
  const [overlayFlash, setOverlayFlash] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const cardPosRef = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const btnPosRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const measure = () => {
    if (!cardRef.current || !btnRef.current || !contentRef.current) return;
    const cRect = contentRef.current.getBoundingClientRect();
    const cardRect = cardRef.current.getBoundingClientRect();
    const bRect = btnRef.current.getBoundingClientRect();
    cardPosRef.current = {
      x: cardRect.left - cRect.left,
      y: cardRect.top - cRect.top,
      w: cardRect.width,
      h: cardRect.height,
    };
    btnPosRef.current = {
      x: bRect.left - cRect.left,
      y: bRect.top - cRect.top,
      w: bRect.width,
      h: bRect.height,
    };
  };

  useEffect(() => {
    const timer = setTimeout(measure, 100);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const feedbackText = "Add loading state";

    const run = async () => {
      // Reset
      setCursorPos({ x: 280, y: 40 });
      setHighlight({ visible: false, mode: "normal", rect: { x: 0, y: 0, w: 0, h: 0 } });
      setTooltip({ visible: false, text: "", type: "wrong", x: 0, y: 0 });
      setShowPopup(false);
      setTypedText("");
      setShowMarker(false);
      setOverlayFlash(false);
      setActiveCaption("idle");

      await delay(600);
      if (cancelled) return;

      // Re-measure before using positions (layout may have shifted)
      measure();
      const card = cardPosRef.current;
      const btn = btnPosRef.current;
      setCursorPos({ x: btn.x + btn.w / 2, y: btn.y + btn.h / 2 });
      await delay(400);
      if (cancelled) return;

      // Normal hover — highlights the whole card (the overlay intercepts)
      setOverlayFlash(true);
      setHighlight({
        visible: true,
        mode: "normal",
        rect: { x: card.x - 3, y: card.y - 3, w: card.w + 6, h: card.h + 6 },
      });
      setTooltip({
        visible: true,
        text: "div.AnimatePresence",
        type: "wrong",
        x: card.x + card.w / 2,
        y: card.y - 10,
      });
      await delay(1600);
      if (cancelled) return;

      // Fade highlight + tooltip + overlay flash
      setHighlight((h) => ({ ...h, visible: false }));
      setTooltip((t) => ({ ...t, visible: false }));
      setOverlayFlash(false);
      await delay(400);
      if (cancelled) return;

      // ⌘ beat — caption explains the feature
      setActiveCaption("cmd");
      await delay(2000);
      if (cancelled) return;

      // Pierce hover — highlights just the button
      setActiveCaption("correct");
      setHighlight({
        visible: true,
        mode: "pierce",
        rect: { x: btn.x - 3, y: btn.y - 3, w: btn.w + 6, h: btn.h + 6 },
      });
      setTooltip({
        visible: true,
        text: 'button "Export"',
        type: "correct",
        x: btn.x + btn.w / 2,
        y: btn.y - 10,
      });
      await delay(1400);
      if (cancelled) return;

      // Click — show popup
      setShowPopup(true);
      await delay(300);
      if (cancelled) return;

      // Type feedback
      for (let i = 0; i <= feedbackText.length; i++) {
        if (cancelled) return;
        setTypedText(feedbackText.slice(0, i));
        await delay(30);
      }
      await delay(400);
      if (cancelled) return;

      // Close popup, show marker
      setShowPopup(false);
      setHighlight((h) => ({ ...h, visible: false }));
      setTooltip((t) => ({ ...t, visible: false }));
      await delay(200);
      if (cancelled) return;
      setShowMarker(true);

      await delay(2200);
      if (cancelled) return;

      // Clean up for next loop
      setShowMarker(false);
      await delay(300);
    };

    run();
    let interval = setInterval(run, LOOP_INTERVAL);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        cancelled = true;
        clearInterval(interval);
        setTimeout(() => {
          cancelled = false;
          run();
          interval = setInterval(run, LOOP_INTERVAL);
        }, 100);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="fd-container">
      <div className="demo-window">
        <div className="demo-browser-bar">
          <div className="demo-dot" />
          <div className="demo-dot" />
          <div className="demo-dot" />
          <div className="demo-url">localhost:3000/dashboard</div>
        </div>

        <div className="demo-content" ref={contentRef}>
          <div className="dsd-page-layout">
            {/* Sidebar nav */}
            <div className="dsd-sidebar">
              <div className="dsd-sidebar-item active" />
              <div className="dsd-sidebar-item" />
              <div className="dsd-sidebar-item" />
              <div className="dsd-sidebar-item" />
            </div>

            {/* Main content area */}
            <div className="dsd-main">
              <div className="dsd-faux-title" />

              <div className="dsd-card" ref={cardRef}>
                {/* Invisible overlay — the problem */}
                <div className={`dsd-overlay ${overlayFlash ? "flash" : ""}`} />
                <div className="dsd-card-header">
                  <div className="dsd-card-icon" />
                  <div className="dsd-card-label">Monthly Revenue</div>
                </div>
                <div className="dsd-card-value">$12.4k</div>
                <div className="dsd-chart">
                  {CHART_HEIGHTS.map((h, i) => (
                    <div key={i} className="dsd-chart-bar" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="dsd-export-btn" ref={btnRef}>Export</div>
              </div>

              {/* Secondary metric cards */}
              <div className="dsd-mini-cards">
                <div className="dsd-mini-card">
                  <div className="dsd-mini-label">Users</div>
                  <div className="dsd-mini-value">1,847</div>
                </div>
                <div className="dsd-mini-card">
                  <div className="dsd-mini-label">Conversion</div>
                  <div className="dsd-mini-value">3.2%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Highlight */}
          <div
            className={`ds-highlight ${highlight.visible ? "visible" : ""} ${highlight.mode}`}
            style={{
              left: highlight.rect.x,
              top: highlight.rect.y,
              width: highlight.rect.w,
              height: highlight.rect.h,
            }}
          />

          {/* Tooltip */}
          <div
            className={`ds-tooltip ${tooltip.visible ? "visible" : ""} ${tooltip.type}`}
            style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
          >
            {tooltip.type === "correct" && <div className="ds-pierce-label">{"\u21E3"} deep select</div>}
            {tooltip.text}
          </div>

          {/* Popup */}
          <div className={`demo-popup ${showPopup ? "visible" : ""}`} style={{ top: 80 }}>
            <div className="demo-popup-header">button &quot;Export&quot;</div>
            <div className="demo-popup-input">
              {typedText}<span style={{ opacity: 0.4 }}>|</span>
            </div>
            <div className="demo-popup-actions">
              <div className="demo-popup-btn cancel">Cancel</div>
              <div className="demo-popup-btn submit">Add</div>
            </div>
          </div>

          {/* Marker */}
          <div
            className={`demo-marker ${showMarker ? "visible" : ""}`}
            style={{
              top: btnPosRef.current.y + btnPosRef.current.h / 2,
              left: btnPosRef.current.x + btnPosRef.current.w + 4,
            }}
          >
            1
          </div>

          {/* Cursor — offset by half SVG size so crosshair center lands on target */}
          <div className="demo-cursor" style={{ left: cursorPos.x - 8.5, top: cursorPos.y - 8.5 }}>
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <line x1="8.5" y1="0" x2="8.5" y2="17" stroke="black" strokeWidth="1" />
              <line x1="0" y1="8.5" x2="17" y2="8.5" stroke="black" strokeWidth="1" />
            </svg>
          </div>

          {/* Toolbar */}
          <div className="demo-toolbar">
            <div className="demo-toolbar-buttons">
              <ToolbarIcon icon="pause" />
              <ToolbarIcon icon="eye" disabled={!showMarker} />
              <ToolbarIcon icon="copy" disabled={!showMarker} />
              <ToolbarIcon icon="trash" disabled={!showMarker} />
              <ToolbarIcon icon="settings" />
              <div className="demo-toolbar-divider" />
              <ToolbarIcon icon="close" />
            </div>
          </div>
        </div>
      </div>

      {/* Caption — updates with animation state, matching SmartIdentificationDemo pattern */}
      <p key={activeCaption} style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(0,0,0,0.5)', lineHeight: 1.5, animation: 'fadeIn 0.3s ease' }}>
        {CAPTIONS[activeCaption]}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
 * Shared toolbar icon — same as FeaturesDemo
 * ───────────────────────────────────────────────────────── */

function ToolbarIcon({ icon, disabled }: { icon: string; disabled?: boolean }) {
  const disabledStyle = disabled ? { opacity: 0.35 } : undefined;

  const icons: Record<string, React.ReactNode> = {
    pause: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M8 6L8 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 18L16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    eye: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3.91752 12.7539C3.65127 12.2996 3.65037 11.7515 3.9149 11.2962C4.9042 9.59346 7.72688 5.49994 12 5.49994C16.2731 5.49994 19.0958 9.59346 20.0851 11.2962C20.3496 11.7515 20.3487 12.2996 20.0825 12.7539C19.0908 14.4459 16.2694 18.4999 12 18.4999C7.73064 18.4999 4.90918 14.4459 3.91752 12.7539Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 14.8261C13.5608 14.8261 14.8261 13.5608 14.8261 12C14.8261 10.4392 13.5608 9.17392 12 9.17392C10.4392 9.17392 9.17391 10.4392 9.17391 12C9.17391 13.5608 10.4392 14.8261 12 14.8261Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    copy: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    trash: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M10 11.5L10.125 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 11.5L13.87 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 7.5V6.25C9 5.42157 9.67157 4.75 10.5 4.75H13.5C14.3284 4.75 15 5.42157 15 6.25V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5.5 7.75H18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6.75 7.75L7.11691 16.189C7.16369 17.2649 7.18708 17.8028 7.41136 18.2118C7.60875 18.5717 7.91211 18.8621 8.28026 19.0437C8.69854 19.25 9.23699 19.25 10.3139 19.25H13.6861C14.763 19.25 15.3015 19.25 15.7197 19.0437C16.0879 18.8621 16.3912 18.5717 16.5886 18.2118C16.8129 17.8028 16.8363 17.2649 16.8831 16.189L17.25 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    settings: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M10.6504 5.81117C10.9939 4.39628 13.0061 4.39628 13.3496 5.81117C13.5715 6.72517 14.6187 7.15891 15.4219 6.66952C16.6652 5.91193 18.0881 7.33479 17.3305 8.57815C16.8411 9.38134 17.2748 10.4285 18.1888 10.6504C19.6037 10.9939 19.6037 13.0061 18.1888 13.3496C17.2748 13.5715 16.8411 14.6187 17.3305 15.4219C18.0881 16.6652 16.6652 18.0881 15.4219 17.3305C14.6187 16.8411 13.5715 17.2748 13.3496 18.1888C13.0061 19.6037 10.9939 19.6037 10.6504 18.1888C10.4285 17.2748 9.38135 16.8411 8.57815 17.3305C7.33479 18.0881 5.91193 16.6652 6.66952 15.4219C7.15891 14.6187 6.72517 13.5715 5.81117 13.3496C4.39628 13.0061 4.39628 10.9939 5.81117 10.6504C6.72517 10.4285 7.15891 9.38134 6.66952 8.57815C5.91193 7.33479 7.33479 5.91192 8.57815 6.66952C9.38135 7.15891 10.4285 6.72517 10.6504 5.81117Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    close: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M16.25 16.25L7.75 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.75 16.25L16.25 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };

  return (
    <div className="demo-toolbar-btn" style={disabledStyle}>
      <div className="demo-toolbar-icon">
        {icons[icon]}
      </div>
    </div>
  );
}
