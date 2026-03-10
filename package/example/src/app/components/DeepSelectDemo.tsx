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
 *    0ms   reset — hero content hidden, cursor top-right
 *  200ms   hero entrance (fade up + scale — the motion.div animation)
 *  800ms   crosshair cursor moves toward CTA button
 * 1200ms   NORMAL: solid highlight on entire hero wrapper
 *          → tooltip: div.motion-container (wrong/dimmed)
 *          → overlay flash
 * 2800ms   highlight + tooltip fade out
 * 3000ms   caption: "Hold ⌘ to select through invisible layers."
 * 4600ms   PIERCE: dashed highlight on just the CTA button
 *          → tooltip: button "Get Started" (correct/bright)
 * 6000ms   click — popup appears, highlight/tooltip hide
 *          → cursor switches to pointer, moves to input area
 * 6600ms   typing feedback
 * 7800ms   cursor moves to Add button
 * 8200ms   click Add — popup closes, marker placed
 *          → cursor switches back to crosshair
 *10200ms   marker fades, loop
 * ───────────────────────────────────────────────────────── */

const LOOP_INTERVAL = 11800;

type CaptionKey = "idle" | "cmd" | "correct";

const CAPTIONS: Record<CaptionKey, string> = {
  idle: "Animation wrappers intercept hover on the element you want.",
  cmd: "Hold \u2318 to select through invisible layers.",
  correct: "Deep select finds what\u2019s actually underneath.",
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
  const [heroEntered, setHeroEntered] = useState(false);
  const [isCrosshair, setIsCrosshair] = useState(true);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const addBtnRef = useRef<HTMLDivElement>(null);
  const addBtnPosRef = useRef({ x: 0, y: 0 });

  const wrapperPosRef = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const ctaPosRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const measure = () => {
    if (!wrapperRef.current || !ctaRef.current || !contentRef.current) return;
    const cRect = contentRef.current.getBoundingClientRect();
    const wRect = wrapperRef.current.getBoundingClientRect();
    const bRect = ctaRef.current.getBoundingClientRect();
    wrapperPosRef.current = {
      x: wRect.left - cRect.left,
      y: wRect.top - cRect.top,
      w: wRect.width,
      h: wRect.height,
    };
    ctaPosRef.current = {
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
    const feedbackText = "Add hover state";

    const run = async () => {
      // Reset
      setCursorPos({ x: 280, y: 40 });
      setHighlight({ visible: false, mode: "normal", rect: { x: 0, y: 0, w: 0, h: 0 } });
      setTooltip({ visible: false, text: "", type: "wrong", x: 0, y: 0 });
      setShowPopup(false);
      setTypedText("");
      setShowMarker(false);
      setOverlayFlash(false);
      setHeroEntered(false);
      setIsCrosshair(true);
      setActiveCaption("idle");

      await delay(200);
      if (cancelled) return;

      // Hero entrance — the motion.div animation
      setHeroEntered(true);
      await delay(600);
      if (cancelled) return;

      // Re-measure after entrance (content is now in final position)
      measure();
      const wrapper = wrapperPosRef.current;
      const cta = ctaPosRef.current;
      setCursorPos({ x: cta.x + cta.w / 2 - 8.5, y: cta.y + cta.h / 2 - 8.5 });
      await delay(400);
      if (cancelled) return;

      // Normal hover — highlights the entire hero wrapper (animation container intercepts)
      setOverlayFlash(true);
      setHighlight({
        visible: true,
        mode: "normal",
        rect: { x: wrapper.x - 3, y: wrapper.y - 3, w: wrapper.w + 6, h: wrapper.h + 6 },
      });
      setTooltip({
        visible: true,
        text: "div.motion-container",
        type: "wrong",
        x: wrapper.x + wrapper.w / 2,
        y: wrapper.y - 10,
      });
      await delay(1600);
      if (cancelled) return;

      // Fade out
      setHighlight((h) => ({ ...h, visible: false }));
      setTooltip((t) => ({ ...t, visible: false }));
      setOverlayFlash(false);
      await delay(400);
      if (cancelled) return;

      // ⌘ beat
      setActiveCaption("cmd");
      await delay(1600);
      if (cancelled) return;

      // Pierce hover — highlights just the CTA button
      setActiveCaption("correct");
      setHighlight({
        visible: true,
        mode: "pierce",
        rect: { x: cta.x - 3, y: cta.y - 3, w: cta.w + 6, h: cta.h + 6 },
      });
      setTooltip({
        visible: true,
        text: 'button "Get Started"',
        type: "correct",
        x: cta.x + cta.w / 2,
        y: cta.y - 10,
      });
      await delay(1400);
      if (cancelled) return;

      // Click — show popup, hide highlight/tooltip
      setShowPopup(true);
      setHighlight((h) => ({ ...h, visible: false }));
      setTooltip((t) => ({ ...t, visible: false }));
      await delay(300);
      if (cancelled) return;

      // Switch to pointer cursor, move to input area
      setIsCrosshair(false);
      setCursorPos({ x: 280, y: 100 });
      await delay(300);
      if (cancelled) return;

      // Type feedback
      for (let i = 0; i <= feedbackText.length; i++) {
        if (cancelled) return;
        setTypedText(feedbackText.slice(0, i));
        await delay(35);
      }
      await delay(400);
      if (cancelled) return;

      // Move cursor to Add button
      if (addBtnRef.current && contentRef.current) {
        const abr = addBtnRef.current.getBoundingClientRect();
        const cr = contentRef.current.getBoundingClientRect();
        addBtnPosRef.current = { x: abr.left - cr.left + abr.width / 2, y: abr.top - cr.top + abr.height / 2 };
      }
      setCursorPos({ x: addBtnPosRef.current.x, y: addBtnPosRef.current.y });
      await delay(400);
      if (cancelled) return;

      // Click Add — close popup, show marker, switch back to crosshair
      setShowPopup(false);
      setIsCrosshair(true);
      await delay(200);
      if (cancelled) return;
      setShowMarker(true);

      await delay(2000);
      if (cancelled) return;

      // Clean up for next loop
      setShowMarker(false);
      setHighlight((h) => ({ ...h, visible: false }));
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
          <div className="demo-url">localhost:3000</div>
        </div>

        <div className="demo-content" ref={contentRef}>
          <div className="dsd-page">
            {/* Nav */}
            <div className="dsd-nav">
              <div className="dsd-logo">
                <div className="dsd-logo-mark" />
                Acme
              </div>
              <div className="dsd-nav-links">
                <span className="dsd-nav-link">Features</span>
                <span className="dsd-nav-link">Pricing</span>
              </div>
            </div>

            {/* Hero wrapper — the animation container */}
            <div className="dsd-hero-wrapper" ref={wrapperRef}>
              {/* Invisible animation overlay — the problem */}
              <div className={`dsd-overlay ${overlayFlash ? "flash" : ""}`} />
              <div className="dsd-wrapper-label">&lt;motion.div&gt;</div>

              <div className={`dsd-hero ${heroEntered ? "entered" : ""}`}>
                <div className="dsd-heading">
                  Ship <span className="dsd-heading-accent">faster</span> with
                  <br />
                  better feedback
                </div>
                <div className="dsd-subtitle">
                  The modern way to collect design annotations.
                </div>
                <div className="dsd-cta" ref={ctaRef}>
                  Get Started <span className="dsd-cta-arrow">&rarr;</span>
                </div>
                <div className="dsd-social-proof">
                  <div className="dsd-avatars">
                    <div className="dsd-mini-avatar" style={{ background: '#6366f1' }} />
                    <div className="dsd-mini-avatar" style={{ background: '#3b82f6' }} />
                    <div className="dsd-mini-avatar" style={{ background: '#8b5cf6' }} />
                    <div className="dsd-mini-avatar" style={{ background: '#06b6d4' }} />
                  </div>
                  <span className="dsd-social-text">Trusted by 500+ teams</span>
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
            {tooltip.text}
          </div>

          {/* Popup */}
          <div className={`demo-popup ${showPopup ? "visible" : ""}`} style={{ top: 70 }}>
            <div className="demo-popup-header">button &quot;Get Started&quot;</div>
            <div className="demo-popup-input">
              {typedText}<span style={{ opacity: 0.4 }}>|</span>
            </div>
            <div className="demo-popup-actions">
              <div className="demo-popup-btn cancel">Cancel</div>
              <div className="demo-popup-btn submit" ref={addBtnRef}>Add</div>
            </div>
          </div>

          {/* Marker */}
          <div
            className={`demo-marker ${showMarker ? "visible" : ""}`}
            style={{
              top: ctaPosRef.current.y + ctaPosRef.current.h / 2,
              left: ctaPosRef.current.x + ctaPosRef.current.w / 2,
            }}
          >
            1
          </div>

          {/* Cursor — dual mode like Computed Styles demo */}
          <div className="demo-cursor" style={{ left: cursorPos.x, top: cursorPos.y }}>
            <div className={`demo-cursor-pointer ${isCrosshair ? "hidden" : ""}`}>
              <svg height="24" width="24" viewBox="0 0 32 32">
                <g fill="none" fillRule="evenodd" transform="translate(10 7)">
                  <path d="m6.148 18.473 1.863-1.003 1.615-.839-2.568-4.816h4.332l-11.379-11.408v16.015l3.316-3.221z" fill="#fff"/>
                  <path d="m6.431 17 1.765-.941-2.775-5.202h3.604l-8.025-8.043v11.188l2.53-2.442z" fill="#000"/>
                </g>
              </svg>
            </div>
            <div className={`demo-cursor-crosshair ${isCrosshair ? "" : "hidden"}`}>
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <line x1="8.5" y1="0" x2="8.5" y2="17" stroke="black" strokeWidth="1" />
                <line x1="0" y1="8.5" x2="17" y2="8.5" stroke="black" strokeWidth="1" />
              </svg>
            </div>
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

      {/* Caption */}
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
