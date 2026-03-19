"use client";

import { useState, useEffect } from "react";

// Animated demo showing text selection annotation workflow

export function TextSelectionDemo() {
  const [typedText, setTypedText] = useState("");
  const [cursorPos, setCursorPos] = useState({ x: 300, y: 180 });
  const [showSelection, setShowSelection] = useState(false);
  const [selectionWidth, setSelectionWidth] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showMarker, setShowMarker] = useState(false);
  const [isTextCursor, setIsTextCursor] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const feedbackText = "Typo: \"recieve\" → \"receive\"";

  // During selection, derive cursor X from selection width to guarantee sync
  const selectionStartX = 76;
  const actualCursorX = isSelecting ? (selectionStartX + selectionWidth) : cursorPos.x;

  useEffect(() => {
    const runAnimation = async () => {
      // Reset
      setTypedText("");
      setCursorPos({ x: 300, y: 180 });
      setShowSelection(false);
      setSelectionWidth(0);
      setShowPopup(false);
      setShowMarker(false);
      setIsTextCursor(false);
      setIsSelecting(false);

      await delay(600);

      // Move into text area, switch to I-beam
      setCursorPos({ x: 150, y: 72 });
      await delay(400);
      setIsTextCursor(true);
      await delay(300);

      // Move to "recieve" - positioned at start of word
      setCursorPos({ x: selectionStartX, y: 72 });
      await delay(400);

      // Start selection - cursor position now derived from selectionWidth
      setIsSelecting(true);
      setShowSelection(true);

      // Animate selection growing - only update width, cursor follows automatically
      const endWidth = 42;
      const steps = 14;
      const stepSize = endWidth / steps;

      for (let i = 0; i <= steps; i++) {
        const w = Math.round(i * stepSize);
        setSelectionWidth(w);
        await delay(20);
      }

      // Update cursor position for post-selection state before turning off isSelecting
      setCursorPos({ x: selectionStartX + endWidth, y: 72 });
      setIsSelecting(false);
      await delay(250);

      // Show popup
      setShowPopup(true);
      await delay(300);

      // Type feedback
      for (let i = 0; i <= feedbackText.length; i++) {
        setTypedText(feedbackText.slice(0, i));
        await delay(30);
      }
      await delay(400);

      // Submit
      setShowPopup(false);
      await delay(200);
      setShowMarker(true);

      await delay(2500);

      setShowMarker(false);
      setShowSelection(false);
      await delay(300);
    };

    runAnimation();
    const interval = setInterval(runAnimation, 9000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tsd-container">
      <style>{`
        .tsd-container {
          position: relative;
          width: 100%;
          max-width: 400px;
          margin: 1.5rem auto;
          aspect-ratio: 4 / 3;
          background: #faf9f7;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08);
        }

        .tsd-browser-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 12px;
          background: #fff;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }

        .tsd-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .tsd-dot:nth-child(1) {
          background: #ff5f57;
        }

        .tsd-dot:nth-child(2) {
          background: #febc2e;
        }

        .tsd-dot:nth-child(3) {
          background: #28c840;
        }

        .tsd-url {
          flex: 1;
          margin-left: 8px;
          padding: 4px 10px;
          background: rgba(0,0,0,0.04);
          border-radius: 6px;
          font-size: 10px;
          color: rgba(0,0,0,0.4);
          font-family: system-ui, sans-serif;
        }

        .tsd-content {
          position: relative;
          padding: 16px 20px;
          height: calc(100% - 38px);
        }

        .tsd-article-title {
          font-size: 13px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 10px;
          font-family: Georgia, 'Times New Roman', serif;
        }

        .tsd-article-text {
          font-size: 10.5px;
          line-height: 1.7;
          color: #333;
          font-family: Georgia, 'Times New Roman', serif;
        }

        .tsd-article-text span.typo {
          position: relative;
        }

        .tsd-highlight {
          position: absolute;
          top: 68px;
          left: 76px;
          height: 13px;
          background: rgba(59, 130, 246, 0.3);
          border-radius: 1px;
          opacity: 0;
          transition: opacity 0.1s ease;
          pointer-events: none;
        }

        .tsd-highlight.visible {
          opacity: 1;
        }

        .tsd-marker {
          position: absolute;
          top: 74px;
          left: 97px;
          width: 20px;
          height: 20px;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
          font-family: system-ui, sans-serif;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.3);
          transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 40;
        }

        .tsd-marker.visible {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        .tsd-popup {
          position: absolute;
          top: 95px;
          left: 50%;
          width: 200px;
          padding: 10px 12px 12px;
          background: #1a1a1a;
          border-radius: 14px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08);
          opacity: 0;
          transform: translateX(-50%) scale(0.95) translateY(4px);
          transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 50;
        }

        .tsd-popup.visible {
          opacity: 1;
          transform: translateX(-50%) scale(1) translateY(0);
        }

        .tsd-popup-header {
          font-size: 10px;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          margin-bottom: 6px;
          font-family: system-ui, sans-serif;
        }

        .tsd-popup-input {
          width: 100%;
          min-height: 36px;
          padding: 6px 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          font-size: 11px;
          color: #fff;
          font-family: system-ui, sans-serif;
          line-height: 1.4;
          box-sizing: border-box;
        }

        .tsd-popup-actions {
          display: flex;
          justify-content: flex-end;
          gap: 5px;
          margin-top: 6px;
        }

        .tsd-popup-btn {
          padding: 5px 12px;
          font-size: 10px;
          font-weight: 500;
          border-radius: 14px;
          font-family: system-ui, sans-serif;
        }

        .tsd-popup-btn.cancel { background: transparent; color: rgba(255,255,255,0.5); }
        .tsd-popup-btn.submit { background: #3b82f6; color: white; }

        .tsd-cursor {
          position: absolute;
          pointer-events: none;
          z-index: 100;
          transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1), top 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          display: grid;
        }

        .tsd-cursor.selecting {
          transition: none;
        }

        .tsd-cursor-pointer, .tsd-cursor-text {
          grid-area: 1 / 1;
          transform: scale(1);
          transform-origin: top left;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .tsd-cursor-text {
          transform: translateX(-5px);
        }

        .tsd-cursor-pointer.hidden {
          transform: scale(0);
          opacity: 0;
        }

        .tsd-cursor-text.hidden {
          transform: translateX(-5px) scale(0);
          opacity: 0;
        }

        .tsd-cursor svg {
          display: block;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
        }

        .tsd-toolbar {
          position: absolute;
          bottom: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          background: #1a1a1a;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.15);
          width: 200px;
          height: 36px;
          border-radius: 20px;
          padding: 0 6px;
        }

        .tsd-toolbar-buttons {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .tsd-toolbar-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.6);
          transition: color 0.2s ease;
        }

        .tsd-toolbar-btn.active { color: rgba(255,255,255,0.95); }

        .tsd-toolbar-divider {
          width: 1px;
          height: 12px;
          background: rgba(255,255,255,0.15);
          margin: 0 2px;
        }
      `}</style>

      <div className="tsd-browser-bar">
        <div className="tsd-dot" />
        <div className="tsd-dot" />
        <div className="tsd-dot" />
        <div className="tsd-url">localhost:3000/blog</div>
      </div>

      <div className="tsd-content">
        <div className="tsd-article-title">The Art of Writing</div>
        <p className="tsd-article-text">
          You will recieve a confirmation email shortly after signing up for our newsletter.
          Please check your inbox and follow the instructions to complete your subscription.
          We send weekly updates with the latest articles and tips.
        </p>

        <div
          className={`tsd-highlight ${showSelection ? "visible" : ""}`}
          style={{ width: selectionWidth }}
        />

        <div className={`tsd-marker ${showMarker ? "visible" : ""}`}>1</div>

        <div className={`tsd-popup ${showPopup ? "visible" : ""}`}>
          <div className="tsd-popup-header">"recieve"</div>
          <div className="tsd-popup-input">
            {typedText}<span style={{ opacity: 0.4 }}>|</span>
          </div>
          <div className="tsd-popup-actions">
            <div className="tsd-popup-btn cancel">Cancel</div>
            <div className="tsd-popup-btn submit">Add</div>
          </div>
        </div>

        <div className={`tsd-cursor ${isSelecting ? 'selecting' : ''}`} style={{ left: actualCursorX, top: cursorPos.y }}>
          <div className={`tsd-cursor-pointer ${isTextCursor ? 'hidden' : ''}`}>
            <svg height="24" width="24" viewBox="0 0 32 32">
              <g fill="none" fillRule="evenodd" transform="translate(10 7)">
                <path d="m6.148 18.473 1.863-1.003 1.615-.839-2.568-4.816h4.332l-11.379-11.408v16.015l3.316-3.221z" fill="#fff"/>
                <path d="m6.431 17 1.765-.941-2.775-5.202h3.604l-8.025-8.043v11.188l2.53-2.442z" fill="#000"/>
              </g>
            </svg>
          </div>
          <div className={`tsd-cursor-text ${isTextCursor ? '' : 'hidden'}`}>
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path d="M5 1V13M2 1H8M2 13H8" stroke="#000" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <div className="tsd-toolbar">
          <div className="tsd-toolbar-buttons">
            <div className="tsd-toolbar-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M8 6L8 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M16 18L16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="tsd-toolbar-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3.91752 12.7539C3.65127 12.2996 3.65037 11.7515 3.9149 11.2962C4.9042 9.59346 7.72688 5.49994 12 5.49994C16.2731 5.49994 19.0958 9.59346 20.0851 11.2962C20.3496 11.7515 20.3487 12.2996 20.0825 12.7539C19.0908 14.4459 16.2694 18.4999 12 18.4999C7.73064 18.4999 4.90918 14.4459 3.91752 12.7539Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14.8261C13.5608 14.8261 14.8261 13.5608 14.8261 12C14.8261 10.4392 13.5608 9.17392 12 9.17392C10.4392 9.17392 9.17391 10.4392 9.17391 12C9.17391 13.5608 10.4392 14.8261 12 14.8261Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={`tsd-toolbar-btn ${showMarker ? "active" : ""}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className={`tsd-toolbar-btn ${showMarker ? "active" : ""}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M10 11.5L10.125 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 11.5L13.87 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 7.5V6.25C9 5.42157 9.67157 4.75 10.5 4.75H13.5C14.3284 4.75 15 5.42157 15 6.25V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.5 7.75H18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M6.75 7.75L7.11691 16.189C7.16369 17.2649 7.18708 17.8028 7.41136 18.2118C7.60875 18.5717 7.91211 18.8621 8.28026 19.0437C8.69854 19.25 9.23699 19.25 10.3139 19.25H13.6861C14.763 19.25 15.3015 19.25 15.7197 19.0437C16.0879 18.8621 16.3912 18.5717 16.5886 18.2118C16.8129 17.8028 16.8363 17.2649 16.8831 16.189L17.25 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="tsd-toolbar-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M10.6504 5.81117C10.9939 4.39628 13.0061 4.39628 13.3496 5.81117C13.5715 6.72517 14.6187 7.15891 15.4219 6.66952C16.6652 5.91193 18.0881 7.33479 17.3305 8.57815C16.8411 9.38134 17.2748 10.4285 18.1888 10.6504C19.6037 10.9939 19.6037 13.0061 18.1888 13.3496C17.2748 13.5715 16.8411 14.6187 17.3305 15.4219C18.0881 16.6652 16.6652 18.0881 15.4219 17.3305C14.6187 16.8411 13.5715 17.2748 13.3496 18.1888C13.0061 19.6037 10.9939 19.6037 10.6504 18.1888C10.4285 17.2748 9.38135 16.8411 8.57815 17.3305C7.33479 18.0881 5.91193 16.6652 6.66952 15.4219C7.15891 14.6187 6.72517 13.5715 5.81117 13.3496C4.39628 13.0061 4.39628 10.9939 5.81117 10.6504C6.72517 10.4285 7.15891 9.38134 6.66952 8.57815C5.91193 7.33479 7.33479 5.91192 8.57815 6.66952C9.38135 7.15891 10.4285 6.72517 10.6504 5.81117Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="tsd-toolbar-divider" />
            <div className="tsd-toolbar-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M16.25 16.25L7.75 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.75 16.25L16.25 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
