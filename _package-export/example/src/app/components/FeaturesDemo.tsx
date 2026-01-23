"use client";

import { useState, useEffect, useRef } from "react";
import "./FeaturesDemo.css";

type FeatureKey = "text-selection" | "element-click" | "multi-select" | "area-selection" | "animation-pause";

interface Feature {
  key: FeatureKey;
  label: string;
  caption: string;
}

const features: Feature[] = [
  {
    key: "text-selection",
    label: "Text",
    caption: "Select text to annotate typos, content issues, or copy changes.\nThe quoted text is included in the output.",
  },
  {
    key: "element-click",
    label: "Elements",
    caption: "Click any element to add feedback.\nAgentation identifies it by class name, ID, or semantic content.",
  },
  {
    key: "multi-select",
    label: "Multi-Select",
    caption: "Drag to select multiple elements at once.\nAll selected elements are included in a single annotation.",
  },
  {
    key: "area-selection",
    label: "Area",
    caption: "Drag to select any region, even empty space.\nUseful for layout feedback or indicating where something should go.",
  },
  {
    key: "animation-pause",
    label: "Animation",
    caption: "Freeze CSS animations to annotate specific states.\nClick pause in the toolbar to stop all animations.",
  },
];

export function FeaturesDemo() {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>("text-selection");
  const [animationKey, setAnimationKey] = useState(0);

  const handleFeatureChange = (feature: FeatureKey) => {
    setActiveFeature(feature);
    setAnimationKey((k) => k + 1); // Reset animation when switching
  };

  const currentFeature = features.find((f) => f.key === activeFeature)!;

  return (
    <div className="fd-container">
      <div className="fd-tabs">
        {features.map((feature) => (
          <button
            key={feature.key}
            className={`fd-tab ${activeFeature === feature.key ? "active" : ""}`}
            onClick={() => handleFeatureChange(feature.key)}
          >
            {feature.label}
          </button>
        ))}
      </div>

      <div className="fd-demo">
        {activeFeature === "text-selection" && <TextSelectionDemo key={animationKey} />}
        {activeFeature === "element-click" && <ElementClickDemo key={animationKey} />}
        {activeFeature === "multi-select" && <MultiSelectDemo key={animationKey} />}
        {activeFeature === "area-selection" && <AreaSelectionDemo key={animationKey} />}
        {activeFeature === "animation-pause" && <AnimationPauseDemo key={animationKey} />}
      </div>

      <p key={activeFeature} style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(0,0,0,0.5)', whiteSpace: 'pre-line', lineHeight: 1.3, animation: 'fadeIn 0.3s ease' }}>{currentFeature.caption}</p>
    </div>
  );
}

// ============================================================
// TEXT SELECTION DEMO
// ============================================================
function TextSelectionDemo() {
  const [typedText, setTypedText] = useState("");
  const [cursorPos, setCursorPos] = useState({ x: 300, y: 180 });
  const [showSelection, setShowSelection] = useState(false);
  const [selectionWidth, setSelectionWidth] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showMarker, setShowMarker] = useState(false);
  const [isTextCursor, setIsTextCursor] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [wordPos, setWordPos] = useState({ x: 52, y: 57, width: 44 });

  const wordRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wordPosRef = useRef({ x: 52, y: 57, width: 44 });

  // Measure the actual position of "recieve"
  const measure = () => {
    if (wordRef.current && contentRef.current) {
      const wordRect = wordRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const newPos = {
        x: wordRect.left - contentRect.left,
        y: wordRect.top - contentRect.top,
        width: wordRect.width,
      };
      wordPosRef.current = newPos;
      setWordPos(newPos);
    }
  };

  // Measure on mount and resize
  useEffect(() => {
    const timer = setTimeout(measure, 100);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const feedbackText = "Fix typo";
  const actualCursorX = isSelecting ? wordPos.x + selectionWidth : cursorPos.x;

  useEffect(() => {
    let cancelled = false;

    const runAnimation = async () => {
      setTypedText("");
      setCursorPos({ x: 300, y: 180 });
      setShowSelection(false);
      setSelectionWidth(0);
      setShowPopup(false);
      setShowMarker(false);
      setIsTextCursor(false);
      setIsSelecting(false);

      await delay(600);
      if (cancelled) return;

      const pos = wordPosRef.current;
      // Move toward the text - switch to I-beam mid-motion
      setCursorPos({ x: pos.x, y: pos.y });
      await delay(180);
      if (cancelled) return;
      setIsTextCursor(true);
      await delay(250);
      if (cancelled) return;

      setIsSelecting(true);
      setShowSelection(true);

      const endWidth = pos.width;
      const steps = 14;
      const stepSize = endWidth / steps;

      for (let i = 0; i <= steps; i++) {
        if (cancelled) return;
        const w = Math.round(i * stepSize);
        setSelectionWidth(w);
        await delay(20);
      }

      setCursorPos({ x: pos.x + endWidth, y: pos.y });
      setIsSelecting(false);
      await delay(250);
      if (cancelled) return;

      setShowPopup(true);
      await delay(300);
      if (cancelled) return;

      for (let i = 0; i <= feedbackText.length; i++) {
        if (cancelled) return;
        setTypedText(feedbackText.slice(0, i));
        await delay(30);
      }
      await delay(400);
      if (cancelled) return;

      setShowPopup(false);
      await delay(200);
      if (cancelled) return;
      setShowMarker(true);

      await delay(1800);
      if (cancelled) return;

      setShowMarker(false);
      setShowSelection(false);
      await delay(200);
    };

    runAnimation();
    let interval = setInterval(runAnimation, 6000);

    // Restart animation cleanly when returning from background
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        cancelled = true;
        clearInterval(interval);
        setTimeout(() => {
          cancelled = false;
          runAnimation();
          interval = setInterval(runAnimation, 7000);
        }, 100);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className="demo-window text-demo">
      <div className="demo-browser-bar">
        <div className="demo-dot" />
        <div className="demo-dot" />
        <div className="demo-dot" />
        <div className="demo-url">localhost:3000/blog</div>
      </div>

      <div className="demo-content" ref={contentRef}>
        <p className="demo-quote">
          "Simple can be harder than complex: You have to work hard to get your thinking clean to make it <span ref={wordRef}>simpl</span>. But it's worth it in the end because once you get there, you can move mountains."
        </p>
        <p className="demo-quote-author">— Steve Jobs</p>

        <div className={`tsd-highlight ${showSelection ? "visible" : ""}`} style={{ left: wordPos.x - 2, top: wordPos.y - 1, width: selectionWidth + 4, height: 16 }} />
        <div className={`demo-marker ${showMarker ? "visible" : ""}`} style={{ top: wordPos.y + 1, left: wordPos.x + wordPos.width }}>1</div>

        <div className={`demo-popup ${showPopup ? "visible" : ""}`}>
          <div className="demo-popup-header">"simpl"</div>
          <div className="demo-popup-input">
            {typedText}<span style={{ opacity: 0.4 }}>|</span>
          </div>
          <div className="demo-popup-actions">
            <div className="demo-popup-btn cancel">Cancel</div>
            <div className="demo-popup-btn submit">Add</div>
          </div>
        </div>

        <div className={`demo-cursor ${isSelecting ? "selecting" : ""}`} style={{ left: actualCursorX, top: cursorPos.y }}>
          <div className={`demo-cursor-crosshair ${isTextCursor ? "hidden" : ""}`}>
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <line x1="8.5" y1="0" x2="8.5" y2="17" stroke="black" strokeWidth="1"/>
              <line x1="0" y1="8.5" x2="17" y2="8.5" stroke="black" strokeWidth="1"/>
            </svg>
          </div>
          <div className={`demo-cursor-text ${isTextCursor ? "" : "hidden"}`}>
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
              <path d="M3 1H7M3 15H7M5 1V15" stroke="#000" strokeWidth="1" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

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
  );
}

// ============================================================
// ELEMENT CLICK DEMO
// ============================================================
function ElementClickDemo() {
  const [cursorPos, setCursorPos] = useState({ x: 350, y: 80 });
  const [showHighlight, setShowHighlight] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showMarker, setShowMarker] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isCrosshair, setIsCrosshair] = useState(false);
  const [btnPos, setBtnPos] = useState({ x: 20, y: 181, width: 330, height: 32 });

  const btnRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const btnPosRef = useRef({ x: 20, y: 181, width: 330, height: 32 });

  // Measure the actual position of the button
  const measure = () => {
    if (btnRef.current && contentRef.current) {
      const btnRect = btnRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const newPos = {
        x: btnRect.left - contentRect.left,
        y: btnRect.top - contentRect.top,
        width: btnRect.width,
        height: btnRect.height,
      };
      btnPosRef.current = newPos;
      setBtnPos(newPos);
    }
  };

  // Measure on mount and resize
  useEffect(() => {
    const timer = setTimeout(measure, 100);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const feedbackText = "Make this more prominent";

  useEffect(() => {
    let cancelled = false;

    const runAnimation = async () => {
      setCursorPos({ x: 350, y: 80 });
      setShowHighlight(false);
      setShowPopup(false);
      setShowMarker(false);
      setTypedText("");
      setIsCrosshair(true); // Crosshair when toolbar is open

      await delay(600);
      if (cancelled) return;

      const pos = btnPosRef.current;
      // Move toward the upgrade button center
      setCursorPos({ x: pos.x + pos.width / 2, y: pos.y + pos.height / 2 });
      await delay(400);
      if (cancelled) return;

      // Show highlight on hover
      setShowHighlight(true);
      await delay(300);
      if (cancelled) return;

      // Click
      await delay(200);
      if (cancelled) return;
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

      setShowPopup(false);
      await delay(200);
      if (cancelled) return;
      setShowMarker(true);

      await delay(2500);
      if (cancelled) return;

      setShowMarker(false);
      setShowHighlight(false);
      await delay(300);
    };

    runAnimation();
    let interval = setInterval(runAnimation, 8000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        cancelled = true;
        clearInterval(interval);
        setTimeout(() => {
          cancelled = false;
          runAnimation();
          interval = setInterval(runAnimation, 8000);
        }, 100);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className="demo-window">
      <div className="demo-browser-bar">
        <div className="demo-dot" />
        <div className="demo-dot" />
        <div className="demo-dot" />
        <div className="demo-url">localhost:3000/account</div>
      </div>

      <div className="demo-content" ref={contentRef}>
        <div className="ecd-faux-title" />
        <div className="ecd-plan-card">
          <div className="ecd-plan-header">
            <div className="ecd-faux-badge" />
            <div className="ecd-plan-usage">
              <div className="ecd-faux-label" />
              <div className="ecd-faux-value" />
            </div>
          </div>
          <div className="ecd-plan-progress">
            <div className="ecd-plan-progress-fill" />
          </div>
          <div className="ecd-plan-features">
            <div className="ecd-feature">
              <div className="ecd-faux-check" />
              <div className="ecd-faux-text" style={{ width: 50 }} />
            </div>
            <div className="ecd-feature">
              <div className="ecd-faux-check" />
              <div className="ecd-faux-text" style={{ width: 70 }} />
            </div>
            <div className="ecd-feature disabled">
              <div className="ecd-faux-x" />
              <div className="ecd-faux-text" style={{ width: 80 }} />
            </div>
          </div>
          <div className="ecd-upgrade-btn" ref={btnRef} />
        </div>

        <div
          className={`ecd-highlight ${showHighlight ? "visible" : ""}`}
          style={{ top: btnPos.y - 4, left: btnPos.x - 4, width: btnPos.width + 8, height: btnPos.height + 8 }}
        />
        <div className={`demo-marker ${showMarker ? "visible" : ""}`} style={{ top: btnPos.y + btnPos.height / 2, left: btnPos.x + btnPos.width / 2 }}>1</div>

        <div className={`demo-popup ecd-popup ${showPopup ? "visible" : ""}`} style={{ top: 115 }}>
          <div className="demo-popup-header">&lt;button.upgrade-btn&gt;</div>
          <div className="demo-popup-input">
            {typedText}<span style={{ opacity: 0.4 }}>|</span>
          </div>
          <div className="demo-popup-actions">
            <div className="demo-popup-btn cancel">Cancel</div>
            <div className="demo-popup-btn submit">Add</div>
          </div>
        </div>

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
              <line x1="8.5" y1="0" x2="8.5" y2="17" stroke="black" strokeWidth="1"/>
              <line x1="0" y1="8.5" x2="17" y2="8.5" stroke="black" strokeWidth="1"/>
            </svg>
          </div>
        </div>

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
  );
}

// ============================================================
// MULTI-SELECT DEMO
// ============================================================
function MultiSelectDemo() {
  const [cursorPos, setCursorPos] = useState({ x: 300, y: 180 });
  const [dragBox, setDragBox] = useState({ visible: false, x: 0, y: 0, width: 0, height: 0 });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isCrosshair, setIsCrosshair] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const feedbackText = "Add priority labels";

  useEffect(() => {
    let cancelled = false;

    const runAnimation = async () => {
      setCursorPos({ x: 300, y: 180 });
      setDragBox({ visible: false, x: 0, y: 0, width: 0, height: 0 });
      setSelectedItems([]);
      setShowPopup(false);
      setShowMarkers(false);
      setTypedText("");
      setIsCrosshair(true); // Crosshair when toolbar is open
      setIsDragging(false);

      await delay(600);
      if (cancelled) return;

      // Move to start position (bottom left of list)
      setCursorPos({ x: 10, y: 148 });
      await delay(400);
      if (cancelled) return;

      await delay(200);
      if (cancelled) return;

      // Start drag from bottom, go diagonally up to the right
      setIsDragging(true);
      const startX = 15;
      const startY = 153;
      const endX = 200;
      const endY = 63;
      const steps = 20;

      setDragBox({ visible: true, x: startX, y: startY, width: 0, height: 0 });

      for (let i = 0; i <= steps; i++) {
        if (cancelled) return;
        const progress = i / steps;
        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;

        setCursorPos({ x: currentX, y: currentY });

        // For upward drag, box top is at currentY, height grows upward
        const boxTop = Math.min(startY, currentY);
        const boxHeight = Math.abs(currentY - startY);
        setDragBox({
          visible: true,
          x: startX,
          y: boxTop,
          width: currentX - startX,
          height: boxHeight,
        });

        // Select items as they're encompassed (bottom to top: 2, 1, 0)
        if (progress > 0.3) setSelectedItems((s) => (s.includes(2) ? s : [...s, 2]));
        if (progress > 0.5) setSelectedItems((s) => (s.includes(1) ? s : [...s, 1]));
        if (progress > 0.7) setSelectedItems((s) => (s.includes(0) ? s : [...s, 0]));

        await delay(25);
      }

      await delay(200);
      if (cancelled) return;

      setIsDragging(false);
      setDragBox({ visible: false, x: 0, y: 0, width: 0, height: 0 });
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

      setShowPopup(false);
      await delay(200);
      if (cancelled) return;
      setShowMarkers(true);

      await delay(2500);
      if (cancelled) return;

      setShowMarkers(false);
      setSelectedItems([]);
      await delay(300);
    };

    runAnimation();
    let interval = setInterval(runAnimation, 9000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        cancelled = true;
        clearInterval(interval);
        setTimeout(() => {
          cancelled = false;
          runAnimation();
          interval = setInterval(runAnimation, 9000);
        }, 100);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className="demo-window">
      <div className="demo-browser-bar">
        <div className="demo-dot" />
        <div className="demo-dot" />
        <div className="demo-dot" />
        <div className="demo-url">localhost:3000/tasks</div>
      </div>

      <div className="demo-content">
        <div className="msd-faux-title" />
        <div className="msd-items">
          {[100, 80, 65].map((width, i) => (
            <div key={i} className={`msd-item ${selectedItems.includes(i) ? "selected" : ""}`}>
              <div className="msd-checkbox" />
              <div className="msd-faux-text" style={{ width }} />
            </div>
          ))}
        </div>

        {dragBox.visible && (
          <div
            className="msd-drag-box"
            style={{
              left: dragBox.x,
              top: dragBox.y,
              width: dragBox.width,
              height: dragBox.height,
            }}
          />
        )}

        <div
          className={`demo-marker green ${showMarkers ? "visible" : ""}`}
          style={{ top: 63, left: 200 }}
        >
          1
        </div>

        <div className={`demo-popup ${showPopup ? "visible" : ""}`} style={{ top: 100 }}>
          <div className="demo-popup-header">3 elements selected</div>
          <div className="demo-popup-input">
            {typedText}<span style={{ opacity: 0.4 }}>|</span>
          </div>
          <div className="demo-popup-actions">
            <div className="demo-popup-btn cancel">Cancel</div>
            <div className="demo-popup-btn submit green">Add</div>
          </div>
        </div>

        <div className={`demo-cursor ${isDragging ? "dragging" : ""}`} style={{ left: cursorPos.x, top: cursorPos.y }}>
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
              <line x1="8.5" y1="0" x2="8.5" y2="17" stroke="black" strokeWidth="1"/>
              <line x1="0" y1="8.5" x2="17" y2="8.5" stroke="black" strokeWidth="1"/>
            </svg>
          </div>
        </div>

        <div className="demo-toolbar">
          <div className="demo-toolbar-buttons">
            <ToolbarIcon icon="pause" />
            <ToolbarIcon icon="eye" disabled={!showMarkers} />
            <ToolbarIcon icon="copy" disabled={!showMarkers} />
            <ToolbarIcon icon="trash" disabled={!showMarkers} />
            <ToolbarIcon icon="settings" />
            <div className="demo-toolbar-divider" />
            <ToolbarIcon icon="close" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// AREA SELECTION DEMO
// ============================================================
function AreaSelectionDemo() {
  const [cursorPos, setCursorPos] = useState({ x: 300, y: 180 });
  const [dragBox, setDragBox] = useState({ visible: false, x: 0, y: 0, width: 0, height: 0 });
  const [areaOutline, setAreaOutline] = useState({ visible: false, x: 0, y: 0, width: 0, height: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [showMarker, setShowMarker] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isCrosshair, setIsCrosshair] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const feedbackText = "Add chart here";

  useEffect(() => {
    let cancelled = false;

    const runAnimation = async () => {
      setCursorPos({ x: 300, y: 180 });
      setDragBox({ visible: false, x: 0, y: 0, width: 0, height: 0 });
      setAreaOutline({ visible: false, x: 0, y: 0, width: 0, height: 0 });
      setShowPopup(false);
      setShowMarker(false);
      setTypedText("");
      setIsCrosshair(true); // Crosshair when toolbar is open
      setIsDragging(false);

      await delay(600);
      if (cancelled) return;

      // Move to empty section area
      setCursorPos({ x: 25, y: 115 });
      await delay(400);
      if (cancelled) return;

      await delay(200);
      if (cancelled) return;

      // Start drag in empty section
      setIsDragging(true);
      const startX = 30;
      const startY = 120;
      const endX = 350;
      const endY = 175;
      const steps = 16;

      setDragBox({ visible: true, x: startX, y: startY, width: 0, height: 0 });

      for (let i = 0; i <= steps; i++) {
        if (cancelled) return;
        const progress = i / steps;
        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;

        setCursorPos({ x: currentX, y: currentY });
        setDragBox({
          visible: true,
          x: startX,
          y: startY,
          width: currentX - startX,
          height: currentY - startY,
        });

        await delay(25);
      }

      await delay(200);
      if (cancelled) return;

      // End drag - hide drag box, show area outline
      setIsDragging(false);
      setDragBox({ visible: false, x: 0, y: 0, width: 0, height: 0 });
      setAreaOutline({
        visible: true,
        x: startX,
        y: startY,
        width: endX - startX,
        height: endY - startY,
      });
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

      setShowPopup(false);
      await delay(200);
      if (cancelled) return;
      setShowMarker(true);

      await delay(2500);
      if (cancelled) return;

      setShowMarker(false);
      setAreaOutline({ visible: false, x: 0, y: 0, width: 0, height: 0 });
      await delay(300);
    };

    runAnimation();
    let interval = setInterval(runAnimation, 9000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        cancelled = true;
        clearInterval(interval);
        setTimeout(() => {
          cancelled = false;
          runAnimation();
          interval = setInterval(runAnimation, 9000);
        }, 100);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className="demo-window">
      <div className="demo-browser-bar">
        <div className="demo-dot" />
        <div className="demo-dot" />
        <div className="demo-dot" />
        <div className="demo-url">localhost:3000/landing</div>
      </div>

      <div className="demo-content">
        <div className="asd-header">
          <div className="asd-header-left">
            <div className="asd-logo" />
            <div className="asd-faux-title" />
          </div>
          <div className="asd-faux-btn" />
        </div>
        <div className="asd-stats-row">
          <div className="asd-stat-card">
            <div className="asd-faux-label" />
            <div className="asd-faux-value" />
          </div>
          <div className="asd-stat-card">
            <div className="asd-faux-label" style={{ width: 38 }} />
            <div className="asd-faux-value" style={{ width: 50 }} />
          </div>
          <div className="asd-stat-card">
            <div className="asd-faux-label" style={{ width: 30 }} />
            <div className="asd-faux-value" style={{ width: 38 }} />
          </div>
        </div>
        <div className="asd-empty-section" />

        {dragBox.visible && (
          <div
            className="asd-drag-box"
            style={{
              left: dragBox.x,
              top: dragBox.y,
              width: dragBox.width,
              height: dragBox.height,
            }}
          />
        )}

        {/* Area outline shown after selection */}
        <div
          className={`asd-area-outline ${areaOutline.visible ? "visible" : ""}`}
          style={{ top: areaOutline.y, left: areaOutline.x, width: areaOutline.width, height: areaOutline.height }}
        />

        <div
          className={`demo-marker green ${showMarker ? "visible" : ""}`}
          style={{ top: 148, left: 350 }}
        >
          1
        </div>

        <div className={`demo-popup ${showPopup ? "visible" : ""}`} style={{ top: 65 }}>
          <div className="demo-popup-header">Area selection</div>
          <div className="demo-popup-input">
            {typedText}<span style={{ opacity: 0.4 }}>|</span>
          </div>
          <div className="demo-popup-actions">
            <div className="demo-popup-btn cancel">Cancel</div>
            <div className="demo-popup-btn submit green">Add</div>
          </div>
        </div>

        <div className={`demo-cursor ${isDragging ? "dragging" : ""}`} style={{ left: cursorPos.x, top: cursorPos.y }}>
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
              <line x1="8.5" y1="0" x2="8.5" y2="17" stroke="black" strokeWidth="1"/>
              <line x1="0" y1="8.5" x2="17" y2="8.5" stroke="black" strokeWidth="1"/>
            </svg>
          </div>
        </div>

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
  );
}

// ============================================================
// ANIMATION PAUSE DEMO
// ============================================================
function AnimationPauseDemo() {
  const [cursorPos, setCursorPos] = useState({ x: 300, y: 100 });
  const [isPaused, setIsPaused] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showMarker, setShowMarker] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isCrosshair, setIsCrosshair] = useState(false);
  const [progressPos, setProgressPos] = useState({ x: 20, y: 138, width: 330, height: 12 });
  const [pauseBtnPos, setPauseBtnPos] = useState({ x: 218, y: 275, width: 28, height: 28 });

  const progressRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pauseBtnRef = useRef<HTMLDivElement>(null);
  const progressPosRef = useRef({ x: 20, y: 138, width: 330, height: 12 });
  const pauseBtnPosRef = useRef({ x: 218, y: 275, width: 28, height: 28 });

  // Measure the actual positions
  const measure = () => {
    if (progressRef.current && contentRef.current) {
      const progressRect = progressRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const newPos = {
        x: progressRect.left - contentRect.left,
        y: progressRect.top - contentRect.top,
        width: progressRect.width,
        height: progressRect.height,
      };
      progressPosRef.current = newPos;
      setProgressPos(newPos);
    }
    if (pauseBtnRef.current && contentRef.current) {
      const btnRect = pauseBtnRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const newPos = {
        x: btnRect.left - contentRect.left,
        y: btnRect.top - contentRect.top,
        width: btnRect.width,
        height: btnRect.height,
      };
      pauseBtnPosRef.current = newPos;
      setPauseBtnPos(newPos);
    }
  };

  // Measure on mount and resize
  useEffect(() => {
    const timer = setTimeout(measure, 100);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const feedbackText = "Skeleton pulses too fast";

  useEffect(() => {
    let cancelled = false;

    const runAnimation = async () => {
      setCursorPos({ x: 300, y: 100 });
      setIsPaused(false);
      setShowHighlight(false);
      setShowPopup(false);
      setShowMarker(false);
      setTypedText("");
      setIsCrosshair(true); // Crosshair in annotation mode

      await delay(800);
      if (cancelled) return;

      // Move to pause button in toolbar - switch to pointer for toolbar interaction
      setIsCrosshair(false);
      const pausePos = pauseBtnPosRef.current;
      setCursorPos({ x: pausePos.x + pausePos.width / 2, y: pausePos.y + pausePos.height / 2 });
      await delay(450);
      if (cancelled) return;

      // Click pause
      await delay(150);
      if (cancelled) return;
      setIsPaused(true);
      await delay(500);
      if (cancelled) return;

      // Move to progress bar area - switch back to crosshair for annotation
      setIsCrosshair(true);
      const pos = progressPosRef.current;
      setCursorPos({ x: pos.x + pos.width / 2, y: pos.y + pos.height / 2 });
      await delay(450);
      if (cancelled) return;

      setShowHighlight(true);
      await delay(300);
      if (cancelled) return;

      // Click and show popup
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

      setShowPopup(false);
      await delay(200);
      if (cancelled) return;
      setShowMarker(true);

      await delay(2500);
      if (cancelled) return;

      setShowMarker(false);
      setShowHighlight(false);
      setIsPaused(false);
      await delay(300);
    };

    runAnimation();
    let interval = setInterval(runAnimation, 10000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        cancelled = true;
        clearInterval(interval);
        setTimeout(() => {
          cancelled = false;
          runAnimation();
          interval = setInterval(runAnimation, 10000);
        }, 100);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className="demo-window">
      <div className="demo-browser-bar">
        <div className="demo-dot" />
        <div className="demo-dot" />
        <div className="demo-dot" />
        <div className="demo-url">localhost:3000/upload</div>
      </div>

      <div className="demo-content" ref={contentRef}>
        <div className="apd-skeleton-card" ref={progressRef}>
          <div className={`apd-skeleton-avatar ${isPaused ? "paused" : ""}`} />
          <div className="apd-skeleton-lines">
            <div className={`apd-skeleton-line ${isPaused ? "paused" : ""}`} style={{ width: '70%' }} />
            <div className={`apd-skeleton-line short ${isPaused ? "paused" : ""}`} style={{ width: '45%' }} />
          </div>
        </div>
        <div className="apd-skeleton-card">
          <div className={`apd-skeleton-avatar ${isPaused ? "paused" : ""}`} />
          <div className="apd-skeleton-lines">
            <div className={`apd-skeleton-line ${isPaused ? "paused" : ""}`} style={{ width: '85%' }} />
            <div className={`apd-skeleton-line short ${isPaused ? "paused" : ""}`} style={{ width: '55%' }} />
          </div>
        </div>

        <div
          className={`apd-highlight ${showHighlight ? "visible" : ""}`}
          style={{ top: progressPos.y - 4, left: progressPos.x - 4, width: progressPos.width + 8, height: progressPos.height + 8 }}
        />
        <div className={`demo-marker ${showMarker ? "visible" : ""}`} style={{ top: progressPos.y + progressPos.height / 2, left: progressPos.x + progressPos.width / 2 }}>1</div>

        <div className={`demo-popup ${showPopup ? "visible" : ""}`} style={{ top: 70 }}>
          <div className="demo-popup-header">&lt;div.skeleton-card&gt;</div>
          <div className="demo-popup-input">
            {typedText}<span style={{ opacity: 0.4 }}>|</span>
          </div>
          <div className="demo-popup-actions">
            <div className="demo-popup-btn cancel">Cancel</div>
            <div className="demo-popup-btn submit">Add</div>
          </div>
        </div>

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
              <line x1="8.5" y1="0" x2="8.5" y2="17" stroke="black" strokeWidth="1"/>
              <line x1="0" y1="8.5" x2="17" y2="8.5" stroke="black" strokeWidth="1"/>
            </svg>
          </div>
        </div>

        <div className="demo-toolbar">
          <div className="demo-toolbar-buttons">
            <div ref={pauseBtnRef} style={{ display: 'flex' }}>
              <ToolbarIcon icon={isPaused ? "play" : "pause"} active={isPaused} />
            </div>
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
  );
}

// ============================================================
// SHARED COMPONENTS
// ============================================================
function ToolbarIcon({ icon, active = false, disabled = false }: { icon: string; active?: boolean; disabled?: boolean }) {
  const [prevIcon, setPrevIcon] = useState(icon);
  const [animating, setAnimating] = useState(false);

  // Trigger animation when icon changes
  useEffect(() => {
    if (icon !== prevIcon) {
      setAnimating(true);
      setPrevIcon(icon);
      const timer = setTimeout(() => setAnimating(false), 200);
      return () => clearTimeout(timer);
    }
  }, [icon, prevIcon]);

  // Active button gets accent color + 25% opacity background (matching real package)
  const activeStyle = active ? {
    color: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    borderRadius: '50%',
  } : undefined;

  // Disabled buttons are dimmed
  const disabledStyle = disabled ? {
    opacity: 0.35,
  } : undefined;

  const icons: Record<string, JSX.Element> = {
    pause: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M8 6L8 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M16 18L16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    play: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M17.75 10.701C18.75 11.2783 18.75 12.7217 17.75 13.299L8.75 18.4952C7.75 19.0725 6.5 18.3509 6.5 17.1962L6.5 6.80384C6.5 5.64914 7.75 4.92746 8.75 5.50481L17.75 10.701Z" stroke="currentColor" strokeWidth="1.5"/>
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
    <div className={`demo-toolbar-btn ${active ? "active" : ""}`} style={{ ...activeStyle, ...disabledStyle }}>
      <div className={`demo-toolbar-icon ${animating ? "animating" : ""}`}>
        {icons[icon]}
      </div>
    </div>
  );
}

// ============================================================
// SETTINGS DEMO (exported)
// ============================================================
const OUTPUT_DETAIL_OPTIONS = ["Compact", "Standard", "Detailed", "Forensic"];
const COLOR_OPTIONS = [
  { value: "#AF52DE", label: "Purple" },
  { value: "#3c82f7", label: "Blue" },
  { value: "#5AC8FA", label: "Cyan" },
  { value: "#34C759", label: "Green" },
  { value: "#FFD60A", label: "Yellow" },
  { value: "#FF9500", label: "Orange" },
  { value: "#FF3B30", label: "Red" },
];

export function SettingsDemo() {
  const [showPanel, setShowPanel] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [outputDetail, setOutputDetail] = useState(1); // Standard
  const [selectedColor, setSelectedColor] = useState(1); // Blue
  const [clearAfterCopy, setClearAfterCopy] = useState(false);
  const [blockInteractions, setBlockInteractions] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 190, y: 20 });
  const [isClicking, setIsClicking] = useState(false);
  const [activeCaption, setActiveCaption] = useState<string | null>("output");

  // Refs for measuring element positions
  const containerRef = useRef<HTMLDivElement>(null);
  const cycleBtnRef = useRef<HTMLButtonElement>(null);
  const greenColorRef = useRef<HTMLDivElement>(null);
  const clearCheckboxRef = useRef<HTMLSpanElement>(null);
  const blockCheckboxRef = useRef<HTMLSpanElement>(null);
  const themeToggleRef = useRef<HTMLButtonElement>(null);

  // Measured positions
  const positionsRef = useRef({
    cycleBtn: { x: 178, y: 82 },
    greenColor: { x: 106, y: 142 },
    clearCheckbox: { x: 24, y: 188 },
    blockCheckbox: { x: 24, y: 210 },
    themeToggle: { x: 194, y: 42 },
  });

  // Measure positions
  const measurePositions = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const getCenter = (ref: React.RefObject<HTMLElement | null>) => {
      if (!ref.current) return null;
      const rect = ref.current.getBoundingClientRect();
      return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2,
      };
    };

    const cyclePos = getCenter(cycleBtnRef);
    const greenPos = getCenter(greenColorRef);
    const clearPos = getCenter(clearCheckboxRef);
    const blockPos = getCenter(blockCheckboxRef);
    const themePos = getCenter(themeToggleRef);

    if (cyclePos) positionsRef.current.cycleBtn = cyclePos;
    if (greenPos) positionsRef.current.greenColor = greenPos;
    if (clearPos) positionsRef.current.clearCheckbox = clearPos;
    if (blockPos) positionsRef.current.blockCheckbox = blockPos;
    if (themePos) positionsRef.current.themeToggle = themePos;
  };

  // Measure on mount and resize
  useEffect(() => {
    const timer = setTimeout(measurePositions, 100);
    window.addEventListener('resize', measurePositions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measurePositions);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const click = async () => {
      setIsClicking(true);
      await delay(100);
      if (!cancelled) setIsClicking(false);
    };

    const runAnimation = async () => {
      // Reset state
      setShowPanel(true);
      setIsDarkMode(true);
      setOutputDetail(1);
      setSelectedColor(1);
      setClearAfterCopy(false);
      setBlockInteractions(false);
      setActiveCaption("output");

      // Re-measure positions each cycle
      await delay(100);
      measurePositions();
      const pos = positionsRef.current;
      setCursorPos(pos.cycleBtn);
      await delay(1400);
      if (cancelled) return;

      // Click output detail to cycle to "Detailed"
      await click();
      setOutputDetail(2);
      await delay(2800);
      if (cancelled) return;

      // Click green color (4th option)
      setActiveCaption("color");
      setCursorPos(pos.greenColor);
      await delay(1000);
      if (cancelled) return;
      await click();
      setSelectedColor(3);
      await delay(2800);
      if (cancelled) return;

      // Click "Clear after output" checkbox
      setActiveCaption("clear");
      setCursorPos(pos.clearCheckbox);
      await delay(1000);
      if (cancelled) return;
      await click();
      setClearAfterCopy(true);
      await delay(2800);
      if (cancelled) return;

      // Click "Block page interactions" checkbox
      setActiveCaption("block");
      setCursorPos(pos.blockCheckbox);
      await delay(1000);
      if (cancelled) return;
      await click();
      setBlockInteractions(true);
      await delay(2800);
      if (cancelled) return;

      // Click theme toggle (dark/light)
      setActiveCaption("theme");
      setCursorPos(pos.themeToggle);
      await delay(1000);
      if (cancelled) return;
      await click();
      setIsDarkMode(false);
      await delay(3000);
      if (cancelled) return;

      // Pause before loop
      await delay(1500);
    };

    runAnimation();
    let interval = setInterval(runAnimation, 26000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        cancelled = true;
        clearInterval(interval);
        setTimeout(() => {
          cancelled = false;
          runAnimation();
          interval = setInterval(runAnimation, 26000);
        }, 100);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const currentColor = COLOR_OPTIONS[selectedColor].value;

  const captions: Record<string, string> = {
    output: "Choose how much detail to include in your output.",
    color: "Pick a marker colour that stands out against your design.",
    clear: "Automatically clear all annotations after copying.",
    block: "Prevent accidental clicks on page elements while annotating.",
    theme: "Switch between dark and light mode.",
  };

  return (
    <div className="sd-outer">
      <div className="sd-container" ref={containerRef}>
        {/* Settings Panel - exact replica (user clicks disabled, Agentation still works) */}
        <div
          className={`sd-panel ${showPanel ? "visible" : ""} ${isDarkMode ? "dark" : "light"}`}
          onClickCapture={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sd-header">
            <span className="sd-brand">
              <span className="sd-brand-slash" style={{ color: currentColor }}>/</span>
              agentation
            </span>
            <span className="sd-version">v0.3.2</span>
            <button ref={themeToggleRef} className="sd-theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 2V4M12 20V22M4 12H2M22 12H20M5.64 5.64L4.22 4.22M19.78 19.78L18.36 18.36M5.64 18.36L4.22 19.78M19.78 4.22L18.36 5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>

          {/* Output Detail */}
          <div className="sd-section">
            <div className="sd-row">
              <span className="sd-label">Output Detail</span>
              <button ref={cycleBtnRef} className="sd-cycle-btn">
                <span className="sd-cycle-text" key={outputDetail}>{OUTPUT_DETAIL_OPTIONS[outputDetail]}</span>
                <span className="sd-cycle-dots">
                  {OUTPUT_DETAIL_OPTIONS.map((_, i) => (
                    <span key={i} className={`sd-cycle-dot ${outputDetail === i ? "active" : ""}`} />
                  ))}
                </span>
              </button>
            </div>
          </div>

          {/* Marker Colour */}
          <div className="sd-section">
            <span className="sd-label sd-label-marker">Marker Colour</span>
            <div className="sd-colors">
              {COLOR_OPTIONS.map((color, i) => (
                <div
                  key={color.value}
                  ref={i === 3 ? greenColorRef : undefined}
                  className={`sd-color-ring ${selectedColor === i ? "selected" : ""}`}
                  style={{ borderColor: selectedColor === i ? color.value : "transparent" }}
                >
                  <div
                    className={`sd-color ${selectedColor === i ? "selected" : ""}`}
                    style={{ backgroundColor: color.value }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="sd-section">
            <label className="sd-checkbox-row">
              <span ref={clearCheckboxRef} className={`sd-checkbox ${clearAfterCopy ? "checked" : ""}`}>
                {clearAfterCopy && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className="sd-checkbox-label">Clear after output</span>
            </label>
            <label className="sd-checkbox-row">
              <span ref={blockCheckboxRef} className={`sd-checkbox ${blockInteractions ? "checked" : ""}`}>
                {blockInteractions && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className="sd-checkbox-label">Block page interactions</span>
            </label>
          </div>
        </div>

        {/* Cursor */}
        <div className={`sd-cursor ${isClicking ? "clicking" : ""}`} style={{ left: cursorPos.x, top: cursorPos.y }}>
          <svg height="24" width="24" viewBox="0 0 32 32">
            <g fill="none" fillRule="evenodd" transform="translate(10 7)">
              <path d="m6.148 18.473 1.863-1.003 1.615-.839-2.568-4.816h4.332l-11.379-11.408v16.015l3.316-3.221z" fill="#fff"/>
              <path d="m6.431 17 1.765-.941-2.775-5.202h3.604l-8.025-8.043v11.188l2.53-2.442z" fill="#000"/>
            </g>
          </svg>
        </div>
      </div>

      {/* Caption - outside container like other demos */}
      <p key={activeCaption} style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(0,0,0,0.5)', whiteSpace: 'pre-line', lineHeight: 1.3, animation: 'fadeIn 0.3s ease' }}>
        {activeCaption ? captions[activeCaption] : captions.output}
      </p>
    </div>
  );
}

// ============================================================
// SMART IDENTIFICATION DEMO
// ============================================================
export function SmartIdentificationDemo() {
  const [cursorPos, setCursorPos] = useState({ x: 100, y: 80 });
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [activeCaption, setActiveCaption] = useState("button");
  const [showLabel, setShowLabel] = useState(false);
  const [labelPos, setLabelPos] = useState({ x: 0, y: 0, below: false });

  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const getElementPosition = (ref: React.RefObject<HTMLElement | null>, preferBelow = false) => {
    if (!ref.current || !contentRef.current) return null;
    const contentRect = contentRef.current.getBoundingClientRect();
    const rect = ref.current.getBoundingClientRect();

    const cursorX = rect.left - contentRect.left + 14;
    const cursorY = rect.top - contentRect.top + 14;

    // Clamp labelX to stay within bounds (with generous padding for label width)
    const rawLabelX = rect.left - contentRect.left + rect.width / 2;
    const labelX = Math.max(70, Math.min(rawLabelX, contentRect.width - 70));

    // Check if we have room above, otherwise put below
    const spaceAbove = rect.top - contentRect.top;
    const below = preferBelow || spaceAbove < 30;
    const labelY = below
      ? Math.min(rect.bottom - contentRect.top + 8, contentRect.height - 30)
      : Math.max(rect.top - contentRect.top - 8, 30);

    return { cursorX, cursorY, labelX, labelY, below };
  };

  useEffect(() => {
    let cancelled = false;

    const hoverElement = async (
      element: string,
      ref: React.RefObject<HTMLElement | null>,
      preferBelow = false,
      duration: number = 1600
    ) => {
      if (cancelled) return;
      setShowLabel(false);
      setActiveElement(null);
      setActiveCaption(element);

      const pos = getElementPosition(ref, preferBelow);
      if (!pos) return;

      setCursorPos({ x: pos.cursorX, y: pos.cursorY });

      await delay(400);
      if (cancelled) return;

      setActiveElement(element);
      setLabelPos({ x: pos.labelX, y: pos.labelY, below: pos.below });
      setShowLabel(true);

      await delay(duration);
      if (cancelled) return;

      setShowLabel(false);
      setActiveElement(null);
      await delay(60);
    };

    const runAnimation = async () => {
      setCursorPos({ x: 100, y: 80 });
      setActiveElement(null);
      setShowLabel(false);

      await delay(400);
      if (cancelled) return;

      await hoverElement("button", buttonRef, true);
      if (cancelled) return;

      await hoverElement("link", linkRef, true);
      if (cancelled) return;

      await hoverElement("heading", headingRef, true);
      if (cancelled) return;

      await hoverElement("image", imageRef);
      if (cancelled) return;

      await hoverElement("input", inputRef);
      if (cancelled) return;

      await hoverElement("card", cardRef);
      if (cancelled) return;

      await delay(500);
    };

    runAnimation();
    let interval = setInterval(runAnimation, 14000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        cancelled = true;
        clearInterval(interval);
        setTimeout(() => {
          cancelled = false;
          runAnimation();
          interval = setInterval(runAnimation, 14000);
        }, 100);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const labels: Record<string, string> = {
    button: "button.Follow",
    link: "a.benji.org",
    heading: "h3.Benji Taylor",
    image: "img[alt=\"avatar\"]",
    input: "input[placeholder]",
    card: ".header-banner",
  };

  const captions: Record<string, string> = {
    button: "Buttons and links are named by their text content.",
    link: "Buttons and links are named by their text content.",
    heading: "Headings are identified by their content.",
    image: "Images use alt text or src filename.",
    input: "Inputs use labels or placeholder text.",
    card: "Other elements use class names or IDs.",
  };

  return (
    <div className="fd-container">
      <div className="demo-window sid-demo">
        <div className="demo-browser-bar">
          <div className="demo-dot" />
          <div className="demo-dot" />
          <div className="demo-dot" />
          <div className="demo-url">localhost:3000/@benjitaylor</div>
        </div>

        <div className="demo-content sid-page" ref={contentRef}>
          {/* Banner */}
          <div ref={cardRef} className={`sid-banner ${activeElement === "card" ? "hovered" : ""}`} />

          {/* Avatar overlapping banner */}
          <img
            ref={imageRef}
            src="/demo-avatar.png"
            alt="avatar"
            className={`sid-avatar ${activeElement === "image" ? "hovered" : ""}`}
          />

          {/* Follow button */}
          <button ref={buttonRef} className={`sid-follow-btn ${activeElement === "button" ? "hovered" : ""}`}>
            Follow
          </button>

          {/* Profile info */}
          <div className="sid-profile-info">
            <h3 ref={headingRef} className={`sid-name ${activeElement === "heading" ? "hovered" : ""}`}>
              Benji Taylor
            </h3>
            <span className="sid-handle">@benjitaylor</span>
            <p className="sid-bio">head of design <span className="sid-mention">@base</span>. founder <span className="sid-mention">@family</span> (acq by <span className="sid-mention">@aave</span>). tools <span className="sid-mention">@dip</span>.</p>
            <div className="sid-meta">
              <span className="sid-location">Los Angeles, CA</span>
              <a ref={linkRef} className={`sid-link ${activeElement === "link" ? "hovered" : ""}`}>
                benji.org
              </a>
            </div>
            <div className="sid-stats">
              <span><strong>394</strong> Following</span>
              <span><strong>28.3K</strong> Followers</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="sid-tabs">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search posts"
              className={`sid-search ${activeElement === "input" ? "hovered" : ""}`}
              readOnly
            />
          </div>

          {/* Label */}
          {showLabel && activeElement && (
            <div
              className={`sid-label ${labelPos.below ? "below" : "above"}`}
              style={{ left: labelPos.x, top: labelPos.y }}
            >
              {labels[activeElement]}
            </div>
          )}

          {/* Cursor - crosshair since we're in annotation mode */}
          <div className="demo-cursor" style={{ left: cursorPos.x, top: cursorPos.y }}>
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <line x1="8.5" y1="0" x2="8.5" y2="17" stroke="black" strokeWidth="1"/>
              <line x1="0" y1="8.5" x2="17" y2="8.5" stroke="black" strokeWidth="1"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Caption */}
      <p key={activeCaption} style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(0,0,0,0.5)', lineHeight: 1.5, animation: 'fadeIn 0.3s ease' }}>
        {captions[activeCaption]}
      </p>
    </div>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// COMPUTED STYLES DEMO (exported)
// ============================================================
export function ComputedStylesDemo() {
  const [cursorPos, setCursorPos] = useState({ x: 300, y: 80 });
  const [showHighlight, setShowHighlight] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showMarker, setShowMarker] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isCrosshair, setIsCrosshair] = useState(true);
  const [isStylesExpanded, setIsStylesExpanded] = useState(false);
  const [btnPos, setBtnPos] = useState({ x: 20, y: 100, width: 100, height: 36 });

  const btnRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLButtonElement>(null);
  const btnPosRef = useRef({ x: 20, y: 100, width: 100, height: 36 });
  const chevronPosRef = useRef({ x: 0, y: 0 });

  // Measure positions
  const measure = () => {
    if (btnRef.current && contentRef.current) {
      const btnRect = btnRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const newPos = {
        x: btnRect.left - contentRect.left,
        y: btnRect.top - contentRect.top,
        width: btnRect.width,
        height: btnRect.height,
      };
      btnPosRef.current = newPos;
      setBtnPos(newPos);
    }
  };

  useEffect(() => {
    const timer = setTimeout(measure, 100);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Update chevron position when popup is visible
  useEffect(() => {
    if (showPopup && chevronRef.current && contentRef.current) {
      const chevronRect = chevronRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      chevronPosRef.current = {
        x: chevronRect.left - contentRect.left + chevronRect.width / 2,
        y: chevronRect.top - contentRect.top + chevronRect.height / 2,
      };
    }
  }, [showPopup]);

  const feedbackText = "Make avatar 48px";

  useEffect(() => {
    let cancelled = false;

    const runAnimation = async () => {
      setCursorPos({ x: 300, y: 80 });
      setShowHighlight(false);
      setShowPopup(false);
      setShowMarker(false);
      setTypedText("");
      setIsCrosshair(true);
      setIsStylesExpanded(false);

      await delay(600);
      if (cancelled) return;

      const pos = btnPosRef.current;
      // Move toward the button center
      setCursorPos({ x: pos.x + pos.width / 2, y: pos.y + pos.height / 2 });
      await delay(400);
      if (cancelled) return;

      // Show highlight on hover
      setShowHighlight(true);
      await delay(300);
      if (cancelled) return;

      // Click - show popup
      await delay(200);
      if (cancelled) return;
      setShowPopup(true);
      await delay(400);
      if (cancelled) return;

      // Move to chevron to expand styles - switch to pointer cursor
      setIsCrosshair(false);
      const chevronPos = chevronPosRef.current;
      setCursorPos({ x: chevronPos.x, y: chevronPos.y });
      await delay(400);
      if (cancelled) return;

      // Click chevron to expand
      setIsStylesExpanded(true);
      await delay(1200);
      if (cancelled) return;

      // Click again to collapse
      setIsStylesExpanded(false);
      await delay(400);
      if (cancelled) return;

      // Move to input area and type - switch back to crosshair
      setIsCrosshair(true);
      setCursorPos({ x: 180, y: 168 });
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

      setShowPopup(false);
      await delay(200);
      if (cancelled) return;
      setShowMarker(true);

      await delay(2000);
      if (cancelled) return;

      setShowMarker(false);
      setShowHighlight(false);
      await delay(300);
    };

    runAnimation();
    let interval = setInterval(runAnimation, 10000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        cancelled = true;
        clearInterval(interval);
        setTimeout(() => {
          cancelled = false;
          runAnimation();
          interval = setInterval(runAnimation, 10000);
        }, 100);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const computedStyles = [
    { prop: "width", value: "44px" },
    { prop: "height", value: "44px" },
    { prop: "border-radius", value: "50%" },
    { prop: "object-fit", value: "cover" },
    { prop: "background", value: "linear-gradient(...)" },
  ];

  return (
    <div className="fd-container">
      <div className="demo-window">
        <div className="demo-browser-bar">
          <div className="demo-dot" />
          <div className="demo-dot" />
          <div className="demo-dot" />
          <div className="demo-url">localhost:3000/settings</div>
        </div>

        <div className="demo-content" ref={contentRef}>
          <div className="csd-profile-card">
            <div ref={btnRef} className="csd-avatar" />
            <div className="csd-profile-info">
              <div className="csd-name" />
              <div className="csd-email" />
            </div>
            <div className="csd-edit-btn" />
          </div>
          <div className="csd-stats-row">
            <div className="csd-stat">
              <div className="csd-stat-value" />
              <div className="csd-stat-label" />
            </div>
            <div className="csd-stat">
              <div className="csd-stat-value short" />
              <div className="csd-stat-label" />
            </div>
            <div className="csd-stat">
              <div className="csd-stat-value" />
              <div className="csd-stat-label" />
            </div>
          </div>

          <div
            className={`csd-highlight ${showHighlight ? "visible" : ""}`}
            style={{ top: btnPos.y - 4, left: btnPos.x - 4, width: btnPos.width + 8, height: btnPos.height + 8 }}
          />
          <div className={`demo-marker ${showMarker ? "visible" : ""}`} style={{ top: btnPos.y + btnPos.height / 2, left: btnPos.x + btnPos.width / 2 }}>1</div>

          <div className={`demo-popup csd-popup ${showPopup ? "visible" : ""}`} style={{ top: 55, left: '35%' }}>
            <div className="csd-popup-header">
              <button ref={chevronRef} className="csd-toggle-btn" type="button">
                <svg
                  className={`csd-chevron ${isStylesExpanded ? "expanded" : ""}`}
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M5.5 10.25L9 7.25L5.75 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="csd-element">&lt;img.avatar&gt;</span>
              </button>
            </div>

            <div className={`csd-styles-wrapper ${isStylesExpanded ? "expanded" : ""}`}>
              <div className="csd-styles-inner">
                <div className="csd-styles-block">
                  {computedStyles.map(({ prop, value }) => (
                    <div key={prop} className="csd-style-line">
                      <span className="csd-style-prop">{prop}</span>
                      : <span className="csd-style-value">{value}</span>;
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="demo-popup-input">
              {typedText}<span style={{ opacity: 0.4 }}>|</span>
            </div>
            <div className="demo-popup-actions">
              <div className="demo-popup-btn cancel">Cancel</div>
              <div className="demo-popup-btn submit">Add</div>
            </div>
          </div>

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
                <line x1="8.5" y1="0" x2="8.5" y2="17" stroke="black" strokeWidth="1"/>
                <line x1="0" y1="8.5" x2="17" y2="8.5" stroke="black" strokeWidth="1"/>
              </svg>
            </div>
          </div>

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

      <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(0,0,0,0.5)', whiteSpace: 'pre-line', lineHeight: 1.3 }}>
        Click the chevron to expand computed CSS styles for the selected element.{"\n"}Useful for debugging styling issues or communicating design specs.
      </p>
    </div>
  );
}

// ============================================================
// MARKER KEY DEMO (exported)
// ============================================================
export function MarkerKeyDemo() {
  return (
    <ul className="mkd-list">
      <li>
        <span className="mkd-marker-wrap"><span className="mkd-marker blue">1</span></span>
        Single element or text selection
      </li>
      <li>
        <span className="mkd-marker-wrap"><span className="mkd-marker green">1</span></span>
        Multi-select or area (always green)
      </li>
    </ul>
  );
}
