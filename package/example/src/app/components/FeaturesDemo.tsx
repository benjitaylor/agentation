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
    caption: "Hold `⌘`+`⇧` and click elements individually, or drag to select multiple at once.\nAll selected elements are included in a single annotation.",
  },
  {
    key: "area-selection",
    label: "Area",
    caption: "Drag to select any region, even empty space.\nUseful for layout feedback or indicating where something should go.",
  },
  {
    key: "animation-pause",
    label: "Animation",
    caption: "Freeze animations to annotate specific states.\nClick pause in the toolbar to stop all animations.",
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
  const [reactEnabled, setReactEnabled] = useState(true);
  const [clearAfterCopy, setClearAfterCopy] = useState(false);
  const [blockInteractions, setBlockInteractions] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 190, y: 20 });
  const [isClicking, setIsClicking] = useState(false);
  const [activeCaption, setActiveCaption] = useState<string | null>("output");

  // Refs for measuring element positions
  const containerRef = useRef<HTMLDivElement>(null);
  const cycleBtnRef = useRef<HTMLButtonElement>(null);
  const reactToggleRef = useRef<HTMLLabelElement>(null);
  const greenColorRef = useRef<HTMLDivElement>(null);
  const clearCheckboxRef = useRef<HTMLSpanElement>(null);
  const blockCheckboxRef = useRef<HTMLSpanElement>(null);
  const themeToggleRef = useRef<HTMLButtonElement>(null);
  const mcpLinkRef = useRef<HTMLButtonElement>(null);

  // Measured positions
  const positionsRef = useRef({
    cycleBtn: { x: 178, y: 82 },
    reactToggle: { x: 195, y: 112 },
    greenColor: { x: 106, y: 175 },
    clearCheckbox: { x: 24, y: 220 },
    blockCheckbox: { x: 24, y: 242 },
    themeToggle: { x: 194, y: 42 },
    mcpLink: { x: 105, y: 280 },
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
    const reactPos = getCenter(reactToggleRef);
    const greenPos = getCenter(greenColorRef);
    const clearPos = getCenter(clearCheckboxRef);
    const blockPos = getCenter(blockCheckboxRef);
    const themePos = getCenter(themeToggleRef);
    const mcpPos = getCenter(mcpLinkRef);

    if (cyclePos) positionsRef.current.cycleBtn = cyclePos;
    if (reactPos) positionsRef.current.reactToggle = reactPos;
    if (greenPos) positionsRef.current.greenColor = greenPos;
    if (clearPos) positionsRef.current.clearCheckbox = clearPos;
    if (blockPos) positionsRef.current.blockCheckbox = blockPos;
    if (themePos) positionsRef.current.themeToggle = themePos;
    if (mcpPos) positionsRef.current.mcpLink = mcpPos;
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
      setReactEnabled(true);
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
      await delay(2200);
      if (cancelled) return;

      // Toggle React components off
      setActiveCaption("react");
      setCursorPos(pos.reactToggle);
      await delay(1000);
      if (cancelled) return;
      await click();
      setReactEnabled(false);
      await delay(2200);
      if (cancelled) return;

      // Click green color (4th option)
      setActiveCaption("color");
      setCursorPos(pos.greenColor);
      await delay(1000);
      if (cancelled) return;
      await click();
      setSelectedColor(3);
      await delay(2200);
      if (cancelled) return;

      // Click "Clear on copy/send" checkbox
      setActiveCaption("clear");
      setCursorPos(pos.clearCheckbox);
      await delay(1000);
      if (cancelled) return;
      await click();
      setClearAfterCopy(true);
      await delay(2200);
      if (cancelled) return;

      // Click "Block page interactions" checkbox
      setActiveCaption("block");
      setCursorPos(pos.blockCheckbox);
      await delay(1000);
      if (cancelled) return;
      await click();
      setBlockInteractions(true);
      await delay(2200);
      if (cancelled) return;

      // Click theme toggle (dark/light)
      setActiveCaption("theme");
      setCursorPos(pos.themeToggle);
      await delay(1000);
      if (cancelled) return;
      await click();
      setIsDarkMode(false);
      await delay(2500);
      if (cancelled) return;

      // Pause before loop
      await delay(1500);
    };

    runAnimation();
    let interval = setInterval(runAnimation, 28000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        cancelled = true;
        clearInterval(interval);
        setTimeout(() => {
          cancelled = false;
          runAnimation();
          interval = setInterval(runAnimation, 28000);
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
    react: "Include React component names in annotations.",
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
              <svg width="72" height="16" viewBox="0 -6 678 166" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M79.6666 100.561L104.863 15.5213C107.828 4.03448 99.1201 -3.00582 88.7449 1.25541L3.52015 39.6065C1.48217 40.5329 0 42.7562 0 45.1647C0 48.6848 2.77907 51.4639 6.29922 51.4639C7.22558 51.4639 8.15193 51.2786 9.07829 50.9081L93.7472 12.7422C97.2674 11.0748 93.7472 8.29572 92.6356 12.1864L67.624 97.2259C66.5123 100.931 69.4767 105.193 73.7379 105.193C76.517 105.193 79.1108 103.155 79.6666 100.561ZM663.641 100.005C665.679 107.231 677.537 104.081 675.499 96.8553L666.05 66.2856C663.456 57.7631 655.489 55.7251 648.82 61.098L618.991 86.6654C617.324 87.9623 621.029 89.815 621.214 88.1476L625.846 61.6538C626.958 55.3546 624.179 50.5375 615.841 50.5375L579.158 51.0934C576.008 51.0934 578.417 53.8724 578.417 57.022C578.417 60.1716 580.825 61.6538 583.975 61.6538L616.212 60.9127C616.397 60.9127 614.544 59.6158 614.544 59.8011L609.727 88.7034C607.875 99.6344 617.694 102.784 626.031 95.7437L655.86 70.1763L654.192 69.6205L663.641 100.005ZM571.191 89.0739C555.443 88.7034 562.298 61.4685 578.787 61.8391C594.72 62.0243 587.124 89.2592 571.191 89.0739ZM571.006 100.375C601.575 100.931 611.024 51.6492 579.158 51.0934C547.847 50.5375 540.065 99.8197 571.006 100.375ZM521.909 46.4616C525.985 46.4616 529.505 42.9414 529.505 38.6802C529.505 34.4189 525.985 31.0841 521.909 31.0841C517.833 31.0841 514.127 34.6042 514.127 38.6802C514.127 42.7562 517.648 46.4616 521.909 46.4616ZM472.256 103.525C493.192 103.71 515.98 73.3259 519.13 62.3949L509.866 60.9127C505.234 73.3259 497.638 101.672 519.871 102.043C536.545 102.228 552.479 85.3685 563.595 70.1763C564.151 69.2499 564.706 68.1383 564.706 66.8414C564.706 63.6918 563.965 61.098 560.816 61.098C558.963 61.098 557.296 62.0243 556.184 63.5065C546.365 77.0313 530.802 90.9266 522.094 90.7414C511.904 90.5561 517.462 71.4732 519.871 64.9887C523.391 55.7251 512.831 53.5019 509.681 60.9127C506.531 68.6941 488.19 92.4088 475.035 92.2235C467.439 92.0383 464.29 83.8863 472.441 59.9864L486.707 17.7445C487.634 14.4097 485.41 10.519 481.334 10.519C478.741 10.519 476.517 12.1864 475.962 14.4097L461.696 56.4662C451.506 86.4801 455.211 103.155 472.256 103.525ZM447.43 42.5709L496.527 41.4593C499.306 41.4593 501.529 39.0507 501.529 36.2717C501.529 33.3073 499.306 31.0841 496.341 31.0841L447.245 32.1957C444.466 32.1957 442.242 34.4189 442.242 37.3833C442.242 40.1624 444.466 42.5709 447.43 42.5709ZM422.974 106.304C435.387 106.489 457.249 94.8173 472.441 53.8724C473.553 50.7228 472.071 48.3143 468.365 48.3143C466.142 48.3143 464.29 49.6112 463.548 51.6492C450.394 87.2212 431.682 96.1142 424.456 95.929C419.454 95.929 417.972 93.3352 418.713 85.5538C419.454 78.1429 410.376 74.9933 406.114 81.1073C401.297 87.777 394.442 94.2615 385.549 94.0763C370.172 93.891 376.471 67.0267 399.815 67.3972C408.338 67.5825 414.452 71.4732 417.045 76.6608C417.786 78.3282 419.454 79.6251 421.492 79.6251C424.271 79.6251 426.679 77.2166 426.679 74.4375C426.679 73.6964 426.494 72.9553 426.124 72.2143C421.862 63.6918 412.414 57.3926 400 57.2073C363.502 56.6515 353.497 104.451 383.326 104.822C397.036 105.193 410.005 94.0763 413.34 85.9243C412.599 86.8507 408.338 86.6654 408.523 84.4422C407.411 97.4111 410.931 106.119 422.974 106.304ZM335.897 104.266C335.897 115.012 347.569 117.606 347.569 103.34C347.569 89.0739 358.5 54.4282 361.464 45.1647L396.666 43.6825C405.929 43.1267 404.262 33.1221 397.036 33.3073L364.984 34.4189L368.875 22.7469C369.801 20.1531 370.542 17.9298 370.542 16.2624C370.542 13.4833 368.504 11.8159 365.911 11.8159C362.946 11.8159 360.352 12.7422 357.573 21.0794L352.942 35.16L330.153 36.0864C326.263 36.4569 323.483 38.1244 323.483 41.6445C323.483 45.5352 326.448 47.0174 330.709 46.8321L349.421 45.9058C345.901 56.6515 335.897 90.7414 335.897 104.266ZM186.939 78.6988C193.979 56.4662 212.877 54.984 212.877 62.9507C212.877 68.3236 203.984 77.0313 186.939 78.6988ZM113.942 150.955C142.844 152.437 159.704 111.492 160.63 80.5515C161.556 73.3259 153.96 70.3616 148.773 75.7344C141.918 83.1453 129.505 93.1499 119.685 93.1499C103.011 93.1499 116.165 59.8011 143.956 59.8011C149.514 59.8011 153.59 61.6538 156.184 64.0623C160.815 68.3236 170.82 62.0243 165.818 56.0957C161.927 51.4639 155.072 48.129 144.882 48.129C102.455 48.129 83.7426 105.007 116.721 105.007C134.692 105.007 151.367 88.3329 155.257 82.7747C154.516 83.5158 149.329 81.2925 149.699 79.4398L149.143 83.5158C148.958 107.045 134.322 141.506 116.536 139.838C113.386 139.468 112.089 137.43 112.089 134.836C112.089 128.907 122.094 119.273 145.067 113.53C159.518 109.824 152.293 101.487 143.4 104.081C111.163 113.53 99.6759 127.425 99.6759 137.8C99.6759 145.026 105.605 150.584 113.942 150.955ZM194.72 109.454C214.359 109.454 239 95.3732 251.228 77.9577C250.301 82.96 246.596 96.8553 246.596 101.487C246.596 110.01 254.748 109.454 261.232 102.784L288.097 75.5491L290.32 85.7391C293.284 99.4491 299.213 104.822 308.847 104.822C326.263 104.822 342.196 85.7391 349.421 74.8081L344.049 63.6918C339.787 74.8081 321.631 92.5941 311.626 92.5941C306.994 92.5941 304.771 89.815 303.289 83.7011L300.325 71.2879C297.916 60.7275 289.023 58.3189 279.018 68.1383L261.788 84.8127L264.382 69.991C266.235 59.2453 255.674 58.1337 250.116 65.915C241.779 77.0313 216.767 97.7817 196.387 97.7817C187.865 97.7817 185.456 93.7057 185.456 88.3329C230.848 84.998 239.185 47.2027 208.986 47.2027C172.858 47.2027 157.11 109.454 194.72 109.454Z" fill="currentColor"/>
              </svg>
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
              <span className="sd-label">
                Output Detail
                <span className="sd-help-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <path d="M12 17h.01"/>
                  </svg>
                </span>
              </span>
              <button ref={cycleBtnRef} className="sd-cycle-btn">
                <span className="sd-cycle-text" key={outputDetail}>{OUTPUT_DETAIL_OPTIONS[outputDetail]}</span>
                <span className="sd-cycle-dots">
                  {OUTPUT_DETAIL_OPTIONS.map((_, i) => (
                    <span key={i} className={`sd-cycle-dot ${outputDetail === i ? "active" : ""}`} />
                  ))}
                </span>
              </button>
            </div>

            {/* React Components */}
            <div className="sd-row sd-row-margin-top">
              <span className="sd-label">
                React Components
                <span className="sd-help-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <path d="M12 17h.01"/>
                  </svg>
                </span>
              </span>
              <label ref={reactToggleRef} className="sd-toggle-switch">
                <input type="checkbox" checked={reactEnabled} readOnly />
                <span className={`sd-toggle-slider ${reactEnabled ? "checked" : ""}`} />
              </label>
            </div>

            {/* Hide Until Restart */}
            <div className="sd-row sd-row-margin-top">
              <span className="sd-label">
                Hide Until Restart
                <span className="sd-help-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <path d="M12 17h.01"/>
                  </svg>
                </span>
              </span>
              <label className="sd-toggle-switch">
                <input type="checkbox" checked={false} readOnly />
                <span className="sd-toggle-slider" />
              </label>
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
              <span className="sd-checkbox-label">
                Clear on copy/send
                <span className="sd-help-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <path d="M12 17h.01"/>
                  </svg>
                </span>
              </span>
            </label>
            <label className="sd-checkbox-row sd-checkbox-row-margin-bottom">
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

          {/* Manage MCP & Webhooks */}
          <div className="sd-section sd-section-extra-padding">
            <button ref={mcpLinkRef} className="sd-nav-link">
              <span>Manage MCP & Webhooks</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
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

// ============================================================
// REACT DETECTION DEMO
// ============================================================
export function ReactDetectionDemo() {
  const [cursorPos, setCursorPos] = useState({ x: 100, y: 80 });
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [activeCaption, setActiveCaption] = useState("button");
  const [showLabel, setShowLabel] = useState(false);
  const [labelExiting, setLabelExiting] = useState(false);
  const [labelPos, setLabelPos] = useState({ x: 0, y: 0, below: false });

  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const navItemRef = useRef<HTMLDivElement>(null);
  const sidebarItemRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const getElementPosition = (ref: React.RefObject<HTMLElement | null>, preferBelow = false) => {
    if (!ref.current || !contentRef.current) return null;
    const contentRect = contentRef.current.getBoundingClientRect();
    const rect = ref.current.getBoundingClientRect();

    // Center cursor on element
    const cursorX = rect.left - contentRect.left + rect.width / 2;
    const cursorY = rect.top - contentRect.top + rect.height / 2;

    // Clamp labelX to stay within bounds (labels are ~180px wide, centered)
    const rawLabelX = rect.left - contentRect.left + rect.width / 2;
    const labelX = Math.max(100, Math.min(rawLabelX, contentRect.width - 100));

    // Check if we have room above, otherwise put below
    const spaceAbove = rect.top - contentRect.top;
    const below = preferBelow || spaceAbove < 35;
    const labelY = below
      ? Math.min(rect.bottom - contentRect.top + 10, contentRect.height - 30)
      : Math.max(rect.top - contentRect.top - 10, 30);

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
      setActiveCaption(element);

      const pos = getElementPosition(ref, preferBelow);
      if (!pos) return;

      setCursorPos({ x: pos.cursorX, y: pos.cursorY });

      await delay(400);
      if (cancelled) return;

      setActiveElement(element);
      setLabelPos({ x: pos.labelX, y: pos.labelY, below: pos.below });
      setLabelExiting(false);
      setShowLabel(true);

      await delay(duration);
      if (cancelled) return;

      // Fade out
      setLabelExiting(true);
      await delay(150);
      if (cancelled) return;

      setShowLabel(false);
      setActiveElement(null);
      setLabelExiting(false);
    };

    const runAnimation = async () => {
      setCursorPos({ x: 100, y: 80 });
      setActiveElement(null);
      setShowLabel(false);
      setLabelExiting(false);

      await delay(400);
      if (cancelled) return;

      await hoverElement("button", buttonRef, true);
      if (cancelled) return;

      await hoverElement("navItem", navItemRef, true);
      if (cancelled) return;

      await hoverElement("sidebarItem", sidebarItemRef);
      if (cancelled) return;

      await hoverElement("card", cardRef);
      if (cancelled) return;

      await delay(500);
    };

    runAnimation();
    let interval = setInterval(runAnimation, 11000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        cancelled = true;
        clearInterval(interval);
        setTimeout(() => {
          cancelled = false;
          runAnimation();
          interval = setInterval(runAnimation, 11000);
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

  const labels: Record<string, React.ReactNode> = {
    button: <><span className="rdd-bracket">&lt;</span>App<span className="rdd-bracket">&gt;</span> <span className="rdd-bracket">&lt;</span>Header<span className="rdd-bracket">&gt;</span> <span className="rdd-bracket">&lt;</span>Button<span className="rdd-bracket">&gt;</span></>,
    navItem: <><span className="rdd-bracket">&lt;</span>App<span className="rdd-bracket">&gt;</span> <span className="rdd-bracket">&lt;</span>Header<span className="rdd-bracket">&gt;</span> <span className="rdd-bracket">&lt;</span>NavLink<span className="rdd-bracket">&gt;</span></>,
    sidebarItem: <><span className="rdd-bracket">&lt;</span>App<span className="rdd-bracket">&gt;</span> <span className="rdd-bracket">&lt;</span>Sidebar<span className="rdd-bracket">&gt;</span> <span className="rdd-bracket">&lt;</span>MenuItem<span className="rdd-bracket">&gt;</span></>,
    card: <><span className="rdd-bracket">&lt;</span>App<span className="rdd-bracket">&gt;</span> <span className="rdd-bracket">&lt;</span>Dashboard<span className="rdd-bracket">&gt;</span> <span className="rdd-bracket">&lt;</span>Card<span className="rdd-bracket">&gt;</span></>,
  };

  const captions: Record<string, string> = {
    button: "Hover over any element to see its React component hierarchy.",
    navItem: "Navigate through components to understand structure.",
    sidebarItem: "Sidebar items show their own component tree.",
    card: "Dashboard cards are detected with their full path.",
  };

  return (
    <div className="fd-container">
      <div className="demo-window rdd-demo">
        <div className="demo-browser-bar">
          <div className="demo-dot" />
          <div className="demo-dot" />
          <div className="demo-dot" />
          <div className="demo-url">localhost:3000/dashboard</div>
        </div>

        <div className="demo-content rdd-page" ref={contentRef}>
          {/* Faux dashboard UI */}
          <div className="rdd-header">
            <div className="rdd-logo" />
            <div className="rdd-nav">
              <div ref={navItemRef} className={`rdd-nav-item active ${activeElement === "navItem" ? "hovered" : ""}`} />
              <div className="rdd-nav-item" />
              <div className="rdd-nav-item" />
            </div>
            <div ref={buttonRef} className={`rdd-btn ${activeElement === "button" ? "hovered" : ""}`} />
          </div>

          <div className="rdd-content-area">
            <div className="rdd-sidebar">
              <div ref={sidebarItemRef} className={`rdd-sidebar-item ${activeElement === "sidebarItem" ? "hovered" : ""}`} />
              <div className="rdd-sidebar-item" />
              <div className="rdd-sidebar-item" />
            </div>
            <div className="rdd-main">
              <div ref={cardRef} className={`rdd-card ${activeElement === "card" ? "hovered" : ""}`} />
              <div className="rdd-card" />
            </div>
          </div>

          {/* Label */}
          {showLabel && activeElement && (
            <div
              className={`rdd-label ${labelPos.below ? "below" : "above"} ${labelExiting ? "exiting" : ""}`}
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

      // Move cursor to input area (inside popup, keep pointer)
      setCursorPos({ x: 280, y: 125 });
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

      // Close popup and show marker
      setShowPopup(false);
      setIsCrosshair(true);
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

// ============================================================
// AGENT CHAT DEMO (exported)
// ============================================================
interface ChatMessage {
  role: "user" | "agent" | "diff";
  text: string;
  progress: number; // 0 to 1
  isTyping?: boolean;
  files?: { name: string; added: number; removed: number }[];
}

// ============================================================
// LAYOUT MODE DEMO (tabbed: Add + Rearrange)
// ============================================================

// --- Palette icon SVGs (matching real layout mode icons) ---
const _s = "currentColor";
const _sw = "0.5";

function DemoIcon({ type }: { type: string }) {
  switch (type) {
    case "hero":
      return (<svg viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1" y="1" width="18" height="14" rx="1" stroke={_s} strokeWidth={_sw} /><rect x="5" y="5" width="10" height="1.5" rx=".5" fill={_s} opacity=".35" /><rect x="7" y="8" width="6" height="1" rx=".5" fill={_s} opacity=".15" /><rect x="7.5" y="10.5" width="5" height="2.5" rx="1" stroke={_s} strokeWidth={_sw} /></svg>);
    case "card":
      return (<svg viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="1" width="16" height="14" rx="1.5" stroke={_s} strokeWidth={_sw} /><rect x="2" y="1" width="16" height="5.5" rx="1" fill={_s} opacity=".04" /><rect x="4" y="8.5" width="8" height="1" rx=".5" fill={_s} opacity=".25" /><rect x="4" y="11" width="11" height="1" rx=".5" fill={_s} opacity=".12" /></svg>);
    case "navigation":
      return (<svg viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1" y="4" width="18" height="8" rx="1" stroke={_s} strokeWidth={_sw} /><rect x="2.5" y="7" width="3" height="1.5" rx=".5" fill={_s} opacity=".4" /><rect x="7" y="7" width="2.5" height="1.5" rx=".5" fill={_s} opacity=".25" /><rect x="11" y="7" width="2.5" height="1.5" rx=".5" fill={_s} opacity=".25" /></svg>);
    case "footer":
      return (<svg viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1" y="7" width="18" height="8" rx="1" stroke={_s} strokeWidth={_sw} /><rect x="3" y="9.5" width="4" height="1" rx=".5" fill={_s} opacity=".25" /><rect x="9" y="9.5" width="4" height="1" rx=".5" fill={_s} opacity=".25" /><rect x="15" y="9.5" width="3" height="1" rx=".5" fill={_s} opacity=".2" /></svg>);
    case "form":
      return (<svg viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="1" width="16" height="14" rx="1.5" stroke={_s} strokeWidth={_sw} /><rect x="4" y="3.5" width="12" height="2.5" rx=".75" stroke={_s} strokeWidth={_sw} /><rect x="4" y="7.5" width="12" height="2.5" rx=".75" stroke={_s} strokeWidth={_sw} /><rect x="10" y="11.5" width="6" height="2.5" rx=".75" stroke={_s} strokeWidth={_sw} /></svg>);
    case "table":
      return (<svg viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1" y="2" width="18" height="12" rx="1" stroke={_s} strokeWidth={_sw} /><line x1="1" y1="5.5" x2="19" y2="5.5" stroke={_s} strokeWidth=".3" opacity=".25" /><line x1="1" y1="9" x2="19" y2="9" stroke={_s} strokeWidth=".3" opacity=".25" /><line x1="7" y1="2" x2="7" y2="14" stroke={_s} strokeWidth=".3" opacity=".25" /><line x1="13" y1="2" x2="13" y2="14" stroke={_s} strokeWidth=".3" opacity=".25" /></svg>);
    case "sidebar":
      return (<svg viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="1" y="1" width="7" height="14" rx="1" stroke={_s} strokeWidth={_sw} /><rect x="2.5" y="4" width="4" height="1" rx=".5" fill={_s} opacity=".3" /><rect x="2.5" y="6.5" width="3.5" height="1" rx=".5" fill={_s} opacity=".15" /><rect x="2.5" y="9" width="4" height="1" rx=".5" fill={_s} opacity=".15" /></svg>);
    case "button":
      return (<svg viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="3" y="5" width="14" height="6" rx="2" stroke={_s} strokeWidth={_sw} /><rect x="6" y="7.5" width="8" height="1" rx=".5" fill={_s} opacity=".3" /></svg>);
    default:
      return (<svg viewBox="0 0 20 16" width="20" height="16" fill="none"><rect x="2" y="2" width="16" height="12" rx="1" stroke={_s} strokeWidth={_sw} /></svg>);
  }
}

// --- Mini skeleton renderers for placement boxes ---
function MiniNavSkeleton() {
  return (
    <div style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 8px", gap: 4 }}>
      <div style={{ width: 16, height: 8, borderRadius: 2, border: "1px dashed var(--agd-stroke)", background: "var(--agd-fill)" }} />
      <div style={{ flex: 1, display: "flex", gap: 4, marginLeft: 6 }}>
        <div style={{ width: 12, height: 2, borderRadius: 1, background: "var(--agd-bar)" }} />
        <div style={{ width: 14, height: 2, borderRadius: 1, background: "var(--agd-bar)" }} />
        <div style={{ width: 10, height: 2, borderRadius: 1, background: "var(--agd-bar)" }} />
      </div>
      <div style={{ width: 18, height: 8, borderRadius: 3, border: "1px dashed var(--agd-stroke)", background: "var(--agd-fill)" }} />
    </div>
  );
}

function MiniHeroSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 4 }}>
      <div style={{ width: "50%", height: 3, borderRadius: 1, background: "var(--agd-bar-strong)" }} />
      <div style={{ width: "60%", height: 2, borderRadius: 1, background: "var(--agd-bar)" }} />
      <div style={{ width: "35%", height: 2, borderRadius: 1, background: "var(--agd-bar)" }} />
      <div style={{ width: 28, height: 8, borderRadius: 3, border: "1px dashed var(--agd-stroke)", marginTop: 3 }} />
    </div>
  );
}

function MiniCardSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ height: "40%", background: "var(--agd-fill)", borderBottom: "1px dashed var(--agd-stroke)" }} />
      <div style={{ flex: 1, padding: 4, display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ width: "60%", height: 2, borderRadius: 1, background: "var(--agd-bar-strong)" }} />
        <div style={{ width: "85%", height: 2, borderRadius: 1, background: "var(--agd-bar)" }} />
        <div style={{ width: "50%", height: 2, borderRadius: 1, background: "var(--agd-bar)" }} />
      </div>
    </div>
  );
}

function MiniFormSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: 4, gap: 3 }}>
      <div style={{ height: 8, borderRadius: 2, border: "1px dashed var(--agd-stroke)", background: "var(--agd-fill)" }} />
      <div style={{ height: 8, borderRadius: 2, border: "1px dashed var(--agd-stroke)", background: "var(--agd-fill)" }} />
      <div style={{ width: 24, height: 8, borderRadius: 3, border: "1px dashed var(--agd-stroke)", alignSelf: "flex-end", marginTop: "auto" }} />
    </div>
  );
}

function MiniSkeleton({ type }: { type: string }) {
  switch (type) {
    case "navigation": return <MiniNavSkeleton />;
    case "hero": return <MiniHeroSkeleton />;
    case "card": return <MiniCardSkeleton />;
    case "form": return <MiniFormSkeleton />;
    default: return <MiniHeroSkeleton />;
  }
}

// --- Section colors (matching real layout mode) ---
const DMD_SECTION_COLORS = [
  { bg: "rgba(59, 130, 246, 0.08)", border: "rgba(59, 130, 246, 0.5)", pill: "#3b82f6" },
  { bg: "rgba(139, 92, 246, 0.08)", border: "rgba(139, 92, 246, 0.5)", pill: "#8b5cf6" },
  { bg: "rgba(236, 72, 153, 0.08)", border: "rgba(236, 72, 153, 0.5)", pill: "#ec4899" },
  { bg: "rgba(34, 197, 94, 0.08)", border: "rgba(34, 197, 94, 0.5)", pill: "#22c55e" },
];

// --- Component registry (subset for demo) ---
const DMD_COMPONENTS = [
  { section: "Layout", items: [
    { type: "navigation", label: "Navigation" },
    { type: "hero", label: "Hero" },
    { type: "sidebar", label: "Sidebar" },
    { type: "footer", label: "Footer" },
  ]},
  { section: "Content", items: [
    { type: "card", label: "Card" },
    { type: "table", label: "Table" },
  ]},
  { section: "Controls", items: [
    { type: "button", label: "Button" },
    { type: "form", label: "Form" },
  ]},
];

interface Placement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  type: string;
  badge?: "moved" | "resized";
  dragging?: boolean;
  fading?: boolean;
}

interface Ghost {
  label: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  dropping?: boolean;
}

type CursorType = "pointer" | "grab" | "grabbing";


export function DesignModeDemo() {
  const [paletteVisible, setPaletteVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [ghost, setGhost] = useState<Ghost | null>(null);
  const [sizeLabel, setSizeLabel] = useState<{ x: number; y: number; w: number; h: number; fading?: boolean } | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 160, y: 150 });
  const [cursorType, setCursorType] = useState<CursorType>("pointer");
  const [isClicking, setIsClicking] = useState(false);
  const [cursorSpeed, setCursorSpeed] = useState<"normal" | "instant">("normal");
  const [footerCount, setFooterCount] = useState(0);

  // Refs for dynamic cursor positioning — measures zoomed palette item positions
  const bodyRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const getItemCenter = (type: string) => {
    const body = bodyRef.current;
    const item = itemRefs.current[type];
    if (!body || !item) return { x: 420, y: 55 };
    const bRect = body.getBoundingClientRect();
    const iRect = item.getBoundingClientRect();
    return { x: iRect.left - bRect.left + iRect.width / 2, y: iRect.top - bRect.top + iRect.height / 2 };
  };

  // Section y-offsets for rearrange animation (CSS transitions handle smoothness)
  const [heroOffset, setHeroOffset] = useState(0);
  const [cardsOffset, setCardsOffset] = useState(0);
  const [footerOffset, setFooterOffset] = useState(0);
  const [outlinesVisible, setOutlinesVisible] = useState(false);
  const [heroOutlineDragging, setHeroOutlineDragging] = useState(false);
  const [heroBadge, setHeroBadge] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const click = async () => { setIsClicking(true); await delay(100); if (!cancelled) setIsClicking(false); };

    const dragTo = async (sx: number, sy: number, ex: number, ey: number, steps: number, onStep?: (x: number, y: number) => void) => {
      setCursorSpeed("instant");
      for (let i = 0; i <= steps; i++) {
        if (cancelled) return;
        const t = i / steps;
        const eased = 1 - Math.pow(1 - t, 3);
        const x = sx + (ex - sx) * eased;
        const y = sy + (ey - sy) * eased;
        setCursorPos({ x, y });
        onStep?.(x, y);
        await delay(20);
      }
      setCursorSpeed("normal");
    };

    // Page section positions (within canvas)
    // Nav: y=8, h=14 | Hero: y=28, h=50 | Cards: y=86, h=62 | Footer: y=156, h=22
    const heroY = 28, heroH = 50;
    const cardsY = 86, cardsH = 62;
    const footerY = 156;

    const run = async () => {
      // Reset all state
      setPaletteVisible(false); setOutlinesVisible(false);
      setHoveredItem(null); setActiveItem(null);
      setPlacements([]); setGhost(null); setSizeLabel(null);
      setCursorType("pointer"); setCursorSpeed("normal");
      setCursorPos({ x: 120, y: 120 });
      setFooterCount(0);
      setHeroOffset(0); setCardsOffset(0); setFooterOffset(0);
      setHeroOutlineDragging(false); setHeroBadge(null);
      await delay(800); if (cancelled) return;

      // Activate layout mode: palette + outlines
      setPaletteVisible(true); setOutlinesVisible(true);
      await delay(600); if (cancelled) return;

      // --- Phase 1: Rearrange — grab Hero, drag below Cards ---
      const heroCX = 140, heroCY = heroY + heroH / 2;
      setCursorPos({ x: heroCX, y: heroCY });
      await delay(400); if (cancelled) return;
      setCursorType("grab");
      await delay(350); if (cancelled) return;

      await click();
      setCursorType("grabbing");
      setHeroOutlineDragging(true);
      await delay(100); if (cancelled) return;

      // Animate hero down, cards up
      // Hero goes from y=28 to y=28+cardsH+8=98 → offset +70
      // Cards go from y=86 to y=28 → offset -58
      const heroTargetOffset = 70;
      const cardsTargetOffset = -58;
      const heroCYEnd = heroCY + heroTargetOffset;

      setCursorSpeed("instant");
      const steps = 28;
      for (let i = 0; i <= steps; i++) {
        if (cancelled) return;
        const t = i / steps;
        const eased = 1 - Math.pow(1 - t, 3);
        setCursorPos({ x: heroCX, y: heroCY + (heroCYEnd - heroCY) * eased });
        setHeroOffset(heroTargetOffset * eased);
        // Cards start moving after 25% of the drag
        const ct = Math.max(0, (t - 0.25) / 0.5);
        const cEased = ct >= 1 ? 1 : ct <= 0 ? 0 : 1 - Math.pow(1 - ct, 2);
        setCardsOffset(cardsTargetOffset * cEased);
        await delay(20);
      }
      if (cancelled) return;

      setCursorSpeed("normal");
      setCursorType("pointer");
      setHeroOutlineDragging(false);
      setHeroBadge("moved");
      setFooterCount(1);
      await delay(800); if (cancelled) return;

      // --- Phase 2: Place Form from palette ---
      const formPos = getItemCenter("form");
      setCursorPos(formPos); await delay(400); if (cancelled) return;
      setHoveredItem("form");
      await delay(300); if (cancelled) return;

      await click();
      setActiveItem("form"); setHoveredItem(null);
      setCursorType("grabbing");
      await delay(100); if (cancelled) return;

      // Ghost starts at palette item, drags to canvas
      const formW = 160, formH = 50;
      setGhost({ label: "Form", type: "form", x: formPos.x - formW / 2, y: formPos.y - formH / 2, width: formW, height: formH });
      await delay(80); if (cancelled) return;

      // Drop target: between moved hero (now at y≈98) and footer
      const formDropX = 16, formDropY = footerY + footerOffset - formH - 6;
      await dragTo(formPos.x, formPos.y, formDropX + formW / 2, formDropY + formH / 2, 30, (x, y) => {
        setGhost(g => g ? { ...g, x: x - formW / 2, y: y - formH / 2 } : g);
      });
      if (cancelled) return;

      setGhost(g => g ? { ...g, x: formDropX, y: formDropY, dropping: true } : g);
      await delay(250); if (cancelled) return;
      setGhost(null);
      // Push footer down to make room
      setFooterOffset(prev => prev + formH + 8);
      setPlacements([{ id: "form", x: formDropX, y: formDropY, width: formW, height: formH, label: "Form", type: "form" }]);
      setCursorType("pointer"); setActiveItem(null);
      setFooterCount(2);
      setSizeLabel({ x: formDropX, y: formDropY, w: formW, h: formH });
      await delay(600); if (cancelled) return;
      setSizeLabel(prev => prev ? { ...prev, fading: true } : null);
      await delay(300); if (cancelled) return;
      setSizeLabel(null);

      // Hold
      await delay(2500); if (cancelled) return;

      // Fade
      setPlacements(prev => prev.map(p => ({ ...p, fading: true })));
      setOutlinesVisible(false);
      await delay(400); if (cancelled) return;
    };

    run();
    const iv = setInterval(run, 12000);
    const vis = () => { if (document.visibilityState === 'visible') { cancelled = true; clearInterval(iv); setTimeout(() => { cancelled = false; run(); }, 100); } };
    document.addEventListener('visibilitychange', vis);
    return () => { cancelled = true; clearInterval(iv); document.removeEventListener('visibilitychange', vis); };
  }, []);

  return (
    <div className="dmd-outer">
      <div className="demo-window dmd-window">
        <DmdBrowserBar />
        <div className="dmd-body" ref={bodyRef}>
          <div className="dmd-canvas">
            {/* Faux page content */}
            <div className="dmd-page">
              <div className="dmd-page-nav">
                <div className="dmd-page-hero-text" style={{ width: "30%", height: 6 }} />
              </div>
              <div className={`dmd-page-hero ${heroOutlineDragging ? "dragging" : ""}`} style={{ transform: `translateY(${heroOffset}px)` }}>
                {outlinesVisible && <div className="dmd-outline blue"><span className="dmd-outline-label blue">Hero</span></div>}
                {heroBadge && <span className="dmd-section-badge moved">{heroBadge}</span>}
                <div className="dmd-page-hero-text" />
                <div className="dmd-page-hero-text" style={{ width: "60%", height: 4, marginTop: 4, opacity: 0.5 }} />
              </div>
              <div className="dmd-page-cards" style={{ transform: `translateY(${cardsOffset}px)` }}>
                {outlinesVisible && <div className="dmd-outline purple"><span className="dmd-outline-label purple">Cards</span></div>}
                <div className="dmd-page-card"><div className="dmd-page-card-title" /><div className="dmd-page-card-body" /></div>
                <div className="dmd-page-card"><div className="dmd-page-card-title" /><div className="dmd-page-card-body" /></div>
                <div className="dmd-page-card"><div className="dmd-page-card-title" /><div className="dmd-page-card-body" /></div>
              </div>
              <div className="dmd-page-footer" style={{ transform: `translateY(${footerOffset}px)` }}>
                {outlinesVisible && <div className="dmd-outline green"><span className="dmd-outline-label green">Footer</span></div>}
              </div>
            </div>

            {/* New placements from palette */}
            {placements.map(p => (
              <div key={p.id} className={`dmd-placement ${p.fading ? "fading" : ""}`}
                style={{ left: p.x, top: p.y, width: p.width, height: p.height, "--agd-stroke": "rgba(59,130,246,0.35)", "--agd-fill": "rgba(59,130,246,0.06)", "--agd-bar": "rgba(59,130,246,0.18)", "--agd-bar-strong": "rgba(59,130,246,0.28)" } as React.CSSProperties}>
                <span className="dmd-placement-label">{p.label}</span>
                <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 5 }}>
                  <MiniSkeleton type={p.type} />
                </div>
                <div className="dmd-placement-handle nw" /><div className="dmd-placement-handle ne" />
                <div className="dmd-placement-handle se" /><div className="dmd-placement-handle sw" />
                {sizeLabel && sizeLabel.x === p.x && sizeLabel.y === p.y && (
                  <span className={`dmd-size-label ${sizeLabel.fading ? "fading" : ""}`}>{sizeLabel.w} × {sizeLabel.h}</span>
                )}
              </div>
            ))}
          </div>

          {ghost && (
            <div className={`dmd-ghost ${ghost.dropping ? "dropping" : ""}`}
              style={{ left: ghost.x, top: ghost.y, width: ghost.width, height: ghost.height }}>
              <span className="dmd-ghost-label">{ghost.label}</span>
            </div>
          )}

          <div className={`dmd-palette ${paletteVisible ? "visible" : ""}`}>
            <div className="dmd-panel-toggle">
              <div className="dmd-panel-check"><svg viewBox="0 0 10 10" width="10" height="10"><path d="M2 5L4.5 7.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg></div>
              <span className="dmd-panel-toggle-label">Wireframe New Page</span>
            </div>
            <div className="dmd-items">
              {DMD_COMPONENTS.map(group => (
                <div key={group.section}>
                  <div className="dmd-section-title">{group.section}</div>
                  {group.items.map(item => (
                    <div key={item.type} ref={el => { itemRefs.current[item.type] = el; }} className={`dmd-item ${activeItem === item.type ? "active" : ""} ${hoveredItem === item.type ? "hovered" : ""}`}>
                      <div className="dmd-item-icon"><DemoIcon type={item.type} /></div>
                      <span className="dmd-item-label">{item.label}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {footerCount > 0 && (
              <div className="dmd-palette-footer">
                <span>{footerCount} {footerCount === 1 ? "Change" : "Changes"}</span>
                <span className="dmd-clear-btn">Clear</span>
              </div>
            )}
          </div>

          <DmdCursor x={cursorPos.x} y={cursorPos.y} type={cursorType} clicking={isClicking} speed={cursorSpeed} />
        </div>

        {/* Faux toolbar — simple dots suggesting buttons */}
        <div className="dmd-faux-toolbar">
          <div className="dmd-faux-btn" /><div className="dmd-faux-btn" /><div className="dmd-faux-btn" />
          <div className="dmd-faux-btn dim" /><div className="dmd-faux-btn dim" />
          <div className="dmd-faux-btn" />
          <div className="dmd-faux-divider" />
          <div className="dmd-faux-btn" />
        </div>
      </div>
      <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'rgba(0,0,0,0.5)', whiteSpace: 'pre-line', lineHeight: 1.3 }}>
        {"Rearrange existing sections or drag new components from the palette.\nAll changes sync to agents in real time as structured annotations."}
      </p>
    </div>
  );
}

// --- Cursor SVGs ---
const CURSOR_POINTER_SVG = (
  <svg height="24" width="24" viewBox="0 0 32 32"><g fill="none" fillRule="evenodd" transform="translate(10 7)"><path d="m6.148 18.473 1.863-1.003 1.615-.839-2.568-4.816h4.332l-11.379-11.408v16.015l3.316-3.221z" fill="#fff"/><path d="m6.431 17 1.765-.941-2.775-5.202h3.604l-8.025-8.043v11.188l2.53-2.442z" fill="#000"/></g></svg>
);

// macOS open hand cursor (from daviddarnes/mac-cursors via stageshow)
const CURSOR_GRAB_SVG = (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><g transform="translate(7 6)"><path d="m4.5557 8.5742c-.098-.375-.196-.847-.406-1.552-.167-.557-.342-.859-.47-1.233-.155-.455-.303-.721-.496-1.181-.139-.329-.364-1.048-.457-1.44-.119-.509.033-.924.244-1.206.253-.339.962-.49 1.357-.351.371.13.744.512.916.788.288.46.357.632.717 1.542.393.992.564 1.918.611 2.231l.085.452c-.001-.04-.043-1.122-.044-1.162-.035-1.029-.06-1.823-.038-2.939.002-.126.064-.587.084-.715.078-.5.305-.8.673-.979.412-.201.926-.215 1.401-.017.423.173.626.55.687 1.022.014.109.094.987.093 1.107-.013 1.025.006 1.641.015 2.174.004.231.003 1.625.017 1.469.061-.656.094-3.189.344-3.942.144-.433.405-.746.794-.929.431-.203 1.113-.07 1.404.243.285.305.446.692.482 1.153.032.405-.019.897-.02 1.245 0 .867-.021 1.324-.037 2.121-.001.038-.015.298.023.182.094-.28.188-.542.266-.745.049-.125.241-.614.359-.859.114-.234.211-.369.415-.688.2-.313.415-.448.668-.561.54-.235 1.109.112 1.301.591.086.215.009.713-.028 1.105-.061.647-.254 1.306-.352 1.648-.128.447-.274 1.235-.34 1.601-.072.394-.234 1.382-.359 1.82-.086.301-.371.978-.652 1.384 0 0-1.074 1.25-1.192 1.812-.117.563-.078.567-.101.965-.024.399.121.923.121.923s-.802.104-1.234.034c-.391-.062-.875-.841-1-1.078-.172-.328-.539-.265-.682-.023-.225.383-.709 1.07-1.051 1.113-.668.084-2.054.03-3.139.02 0 0 .185-1.011-.227-1.358-.305-.26-.83-.784-1.144-1.06l-.832-.921c-.284-.36-.629-1.093-1.243-1.985-.348-.504-1.027-1.085-1.284-1.579-.223-.425-.331-.954-.19-1.325.225-.594.675-.897 1.362-.832.519.05.848.206 1.238.537.225.19.573.534.75.748.163.195.203.276.377.509.23.307.302.459.214.121" fill="#fff" /><g stroke="#000" strokeLinecap="round" strokeWidth=".75"><path d="m4.5557 8.5742c-.098-.375-.196-.847-.406-1.552-.167-.557-.342-.859-.47-1.233-.155-.455-.303-.721-.496-1.181-.139-.329-.364-1.048-.457-1.44-.119-.509.033-.924.244-1.206.253-.339.962-.49 1.357-.351.371.13.744.512.916.788.288.46.357.632.717 1.542.393.992.564 1.918.611 2.231l.085.452c-.001-.04-.043-1.122-.044-1.162-.035-1.029-.06-1.823-.038-2.939.002-.126.064-.587.084-.715.078-.5.305-.8.673-.979.412-.201.926-.215 1.401-.017.423.173.626.55.687 1.022.014.109.094.987.093 1.107-.013 1.025.006 1.641.015 2.174.004.231.003 1.625.017 1.469.061-.656.094-3.189.344-3.942.144-.433.405-.746.794-.929.431-.203 1.113-.07 1.404.243.285.305.446.692.482 1.153.032.405-.019.897-.02 1.245 0 .867-.021 1.324-.037 2.121-.001.038-.015.298.023.182.094-.28.188-.542.266-.745.049-.125.241-.614.359-.859.114-.234.211-.369.415-.688.2-.313.415-.448.668-.561.54-.235 1.109.112 1.301.591.086.215.009.713-.028 1.105-.061.647-.254 1.306-.352 1.648-.128.447-.274 1.235-.34 1.601-.072.394-.234 1.382-.359 1.82-.086.301-.371.978-.652 1.384 0 0-1.074 1.25-1.192 1.812-.117.563-.078.567-.101.965-.024.399.121.923.121.923s-.802.104-1.234.034c-.391-.062-.875-.841-1-1.078-.172-.328-.539-.265-.682-.023-.225.383-.709 1.07-1.051 1.113-.668.084-2.054.03-3.139.02 0 0 .185-1.011-.227-1.358-.305-.26-.83-.784-1.144-1.06l-.832-.921c-.284-.36-.629-1.093-1.243-1.985-.348-.504-1.027-1.085-1.284-1.579-.223-.425-.331-.954-.19-1.325.225-.594.675-.897 1.362-.832.519.05.848.206 1.238.537.225.19.573.534.75.748.163.195.203.276.377.509.23.307.302.459.214.121" strokeLinejoin="round" /><path d="m11.566 12.734v-3.459" /><path d="m9.551 12.746-.016-3.473" /><path d="m7.555 9.305.021 3.426" /></g></g></svg>
);

// macOS closed/grabbing hand cursor (from daviddarnes/mac-cursors via stageshow)
const CURSOR_GRABBING_SVG = (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><g transform="translate(8 9)"><path d="m3.44281398 1.68449726c-.74326136.27630142-1.05584685.8131257-1.07636853 1.38003696-.01344897.37336893.06665513.72649286.23114214 1.18694303-.02596219-.07267623.09676488.29282004.12116236.37362273.05052942.16918921-.4865367-.05865774-.81377307.00741883-.36363321.07113868-.84783757.38332307-1.10006887.79754775-.29643467.48542737-.3109609 1.04368567-.08235979 2.04824266.12491868.54736183.36572145 1.00836814.71076689 1.44594879.15329951.1944118.5713628.64726015.60307236.6875974l.84854343.94062339c.15080214.1358526.25794954.2361946.57590427.5380259.3147558.2987762.4647038.4380078.60308951.555976.05846214.0492474.10784267.1797116.12740685.3736249.01609788.1595565.01049553.3375341-.0090192.5090254-.00674888.0593077-.01325791.1020883-.01698742.1224696-.04189161.228932.13269563.4403386.36541902.4424835.21585671.0019894.38528595.0046546.82216479.0123538.09483476.0016698.09483476.0016698.18993053.0033129 1.16876447.0200186 1.75308289.0147904 2.17807912-.0385723.45429894-.0572869.92650915-.6110188 1.32698393-1.2957591.34289141.6108338.81859723 1.2057867 1.2995685 1.2820532.1510118.0244148.3353555.0322555.548787.0275887.1606725-.0035131.3307029-.0140241.5021961-.0293376.1276907-.0114022.2293359-.0228648.29003-.0307451.2258836-.0293282.373669-.251611.3133108-.4712481-.0130351-.0474332-.0339838-.1345011-.0551094-.2441635-.0245945-.1276687-.0423383-.2523857-.0503381-.365988-.0050217-.0713101-.0059948-.1359317-.0027687-.1918983.0059157-.0980798.0077938-.1530073.0108033-.281125.0010795-.0448938.0010795-.0448938.0024606-.0845172.0054208-.1364475.0233824-.2649146.0815132-.544638.0250088-.1201275.1473169-.352189.3398902-.639435.0571394-.0852302.1195783-.1742239.1864664-.26609712.1272143-.17473362.2641361-.35131772.4011075-.52030772.082051-.10123129.145482-.17695689.1808122-.21807676.2967593-.42378347.612817-1.11823437.7291396-1.52536348.1117407-.39153936.202351-1.12501196.254373-1.81690429.029923-.39968605.0410555-.72381216.0410555-1.23011613.0000742-.09758414.0000742-.09758414.0002975-.17670236.0003569-.11115478.0003569-.11115478.000115-.20711835-.0008934-.15683883-.0055282-.31323355-.0207085-.69507578-.0313109-.81293139-.4771727-1.33911388-1.1344906-1.44058831-.559108-.08631314-1.0586051.08188477-1.2779293.31625977-.0755526.08073733.0036753-.2781823-.2159489-.62316278-.1644465-.25841586-.593184-.58905957-.9209287-.65355552-.335487-.06535532-.73539548-.05811715-1.1017193.00667481-.32093157.05742909-.68608434.33741751-.87176225.64688068-.12411885.20686477.03884667-.00592296-.09368743-.23401341-.18231052-.31422641-.60754287-.59486422-1.01411454-.67799709-.34643562-.07139428-.74182572-.04452925-1.09945614.0633873-.43336319.1291117-1.01795827.61460976-.94899189 1.15552627-.34375-.54091651-1.25026717-.691379-1.97906097-.42111797z" fill="#000" /><path d="m7.31951013 1.62138197c.20710357.04234751.44724204.20083012.51632974.31990811.08404358.1446387.15562749.36413806.21048667.6366124.02933373.14569467.12179446 1.2125285.29383112 1.32370243.41279229.04533731.41279229.04533731.52658055-.12364345.03545705-.07383858.03545705-.07383858.04226523-.1029106.01416796-.06009544.02463332-.12677987.0351322-.21754028l.00854738-.07915386.00047673-.00942804.00327525-.03167185c.01085148-.11424313.04184125-.4312127.05388392-.53034902.03788792-.31189663.08766449-.52757784.13944093-.6138719.0713024-.11883734.31942298-.28274442.43149612-.30279961.2804398-.04960082.58940103-.05519288.82623993-.00905543.1084394.02134018.3709471.22378689.432331.32024744.1291079.20279957.2524316.84889766.3225486 1.4970065-.0102194.04624251-.0102194.04624251.1640069.28984194.5843296-.06677889.5843296-.06677889.5703629-.17490247.0159511-.03856429.0284824-.08294031.045969-.15118961.0423876-.16089067.0697594-.25204451.111066-.35549917.0288558-.07227096.0592914-.13391873.0904889-.18278042.1209187-.19031132.4335712-.319392.7077174-.27707028.2943447.04543991.4816904.26653537.4994912.72869815.0148821.37434892.0193146.5239164.0201469.6700184l-.0004247.37954865c0 .48831141-.0104951.79388164-.0389535 1.17400348-.0480918.63962116-.1348512 1.34192123-.227649 1.66708484-.0946325.33121345-.3766371.95084197-.6003915 1.27298482-.0161892.01580846-.0841508.09694273-.1710333.20413492-.1445842.17838247-.2892181.36491271-.4247891.5511244-.0723398.09936149-.1402862.19620479-.2030964.2898938-.2440054.36396314-.400553.66098894-.4512157.90434304-.0659304.3172546-.0893838.4850003-.0966379.6675968-.0017072.0490782-.0017072.0490782-.002845.096677-.0028064.119476-.004437.1671639-.0097087.2545848-.0052654.091322-.0038193.187354.00332.2887353.0103318.1467182.1058713.3478531.1058713.3478531s-.2321503-.0119819-.3742084-.0088758c-.1718098.0037567-.3147843-.0023244-.4138162-.0183342-.1440353-.0228411-.53014068-.5057331-.7278511-.8821737-.30227042-.5764228-1.03604858-.5484427-1.33684295-.0394061-.26854779.4591613-.65918083.9172326-.7740684.9317199-.37404082.0469647-.94643778.0520862-2.07160079.0328144-.09480875-.0016381-.46003446-.0128683-.64600494-.0157445-.18597048-.0028763.05008807-.1790283.02786486-.399297-.03726222-.36933-.15125405-.6704984-.38877094-.8705429-.12241569-.1043631-.26774964-.2393104-.56509654-.5215613-.33323493-.3163366-.44236499-.4185353-.57290215-.533275l-.80130455-.89071892c-.03955779-.05174211-.45812831-.5051399-.5872217-.6688539-.28069963-.35597842-.47062947-.71959073-.56844755-1.14820437-.18921973-.83150113-.1793328-1.21146622-.00855589-1.49112273.13743587-.2257023.43815377-.4195862.60596039-.45241793.17165981-.03465512.55153059-.01648617.62179422.02229321.09902279.05401056.13357243.07300285.16379074.09097645.03572494.02124891.05965747.03799198.08182912.05708809.03426437.02951139.07235014.07170412.12420211.14044502.03611591.04821025.07806642.1053997.1423779.19304882.06054643.0816627.09183576.12069421.13369221.1590035.28038907.25662728.68391532.03238058.65052057-.32606956-.00567036-.06086415-.02203766-.12694598-.05458621-.23708502-.04356824-.15021272.00433013-.05284275-.26002629-.56642281-.08720664-.16942124-.13955864-.28835362-.17428227-.4046158l-.03412852-.10219113c-.03838756-.11059767-.09558223-.26854489-.12612861-.35199347l-.02009957-.05467087.002.008-.05974804-.17751191c-.09232236-.28807194-.13413567-.51358087-.12645475-.72681781.01040781-.28751553.16037753-.54506871.58790983-.70400047.40142488-.1488616 1.07786076.00117106 1.20581167.27856864.04319814.09369738.08927466.21199471.13900415.35457792l.03930997.11680217c.05539717.16759437.13470873.41493582.13860471.42816881.02724222.08344874.0471839.13860719.06943813.18441246.00217869.06301886.00217869.06301886.35429398.23177937.41699479-.29154152.41699479-.29154152.38019201-.37525838.00571063-.08773482.00758408-.17356287.00965287-.37317647.00242546-.23402898.00423842-.33154773.00994479-.45966208.01316411-.29554918.0437926-.51142116.09291227-.63864415.09160418-.23801371.25279279-.40993649.4432431-.46667832.24458613-.07380253.51465245-.09215236.73323569-.04710649zm1.21356228 4.27672201c-.20710459.00095412-.37422255.16961903-.37326843.37672361l.016 3.473c.00095412.20710459.16961903.37422251.37672361.37326841.20710459-.0009541.37422255-.16961901.37326843-.37672359l-.016-3.473c-.00095412-.20710459-.16961903-.37422255-.37672361-.37326843zm2.03332759.00229602c-.2071068 0-.375.16789322-.375.375v3.459c0 .20710678.1678932.375.375.375s.375-.16789322.375-.375v-3.459c0-.20710678-.1678932-.375-.375-.375zm-4.01399856.02930704c-.20710289.00126946-.37396385.17018863-.3726944.37729152l.021 3.426c.00126946.20710289.17018863.37396384.37729152.37269444.20710289-.0012695.37396385-.17018867.3726944-.37729156l-.021-3.426c-.00126946-.20710289-.17018863-.37396385-.37729152-.3726944z" fill="#fff" /></g></svg>
);

// --- Multi-state cursor using shared demo-cursor system ---
function DmdCursor({ x, y, type, clicking, speed }: { x: number; y: number; type: CursorType; clicking?: boolean; speed?: "normal" | "instant" }) {
  return (
    <div className={`demo-cursor ${speed === "instant" ? "dragging" : ""}`} style={{ left: x, top: y }}>
      <div className={`demo-cursor-pointer ${type !== "pointer" ? "hidden" : ""}`}>{CURSOR_POINTER_SVG}</div>
      <div className={`demo-cursor-grab ${type !== "grab" ? "hidden" : ""}`}>{CURSOR_GRAB_SVG}</div>
      <div className={`demo-cursor-grabbing ${type !== "grabbing" ? "hidden" : ""}`}>{CURSOR_GRABBING_SVG}</div>
    </div>
  );
}

// --- Browser bar for layout mode demos (shared .demo-browser-bar) ---
function DmdBrowserBar() {
  return (
    <div className="demo-browser-bar">
      <div className="demo-dot" />
      <div className="demo-dot" />
      <div className="demo-dot" />
      <div className="demo-url">localhost:3000/dashboard</div>
    </div>
  );
}



// ============================================================
// AGENT CHAT DEMO
// ============================================================

export function AgentChatDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showDiff, setShowDiff] = useState(false);
  const [fading, setFading] = useState(false);

  const conversation: { role: "user" | "agent"; text: string }[] = [
    { role: "user", text: "What annotations do I have?" },
    { role: "agent", text: "**12 annotations across 4 pages.** 7 are on /dashboard — mostly spacing and alignment. Want me to fix them?" },
    { role: "user", text: "Yes" },
    { role: "agent", text: "**Done.** Fixed card padding, stat grid alignment, button colors, and header spacing. All 12 marked as resolved." },
  ];

  // Parse **semibold** text
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <span key={i} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</span>;
      }
      return part;
    });
  };

  const diffFiles = [
    { name: "Dashboard.tsx", added: 32, removed: 8 },
    { name: "globals.css", added: 14, removed: 0 },
  ];

  useEffect(() => {
    let cancelled = false;
    let msgCount = 0;

    const streamText = async (textLength: number) => {
      const targetIndex = msgCount - 1;
      const duration = 500 + textLength * 8; // Longer text = longer duration
      const startTime = Date.now();

      const animate = () => {
        if (cancelled) return;
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out for smoother ending
        const easedProgress = 1 - Math.pow(1 - progress, 2);

        setMessages(prev => prev.map((m, idx) =>
          idx === targetIndex ? { ...m, progress: easedProgress } : m
        ));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
      await delay(duration);
    };

    const runAnimation = async () => {
      setMessages([]);
      setShowDiff(false);
      msgCount = 0;

      await delay(400);
      if (cancelled) return;

      for (let i = 0; i < conversation.length; i++) {
        if (cancelled) return;
        const msg = conversation[i];
        const isLast = i === conversation.length - 1;

        if (msg.role === "agent") {
          // Show "Thinking..."
          setMessages(prev => [...prev, { ...msg, progress: 0, isTyping: true }]);
          msgCount++;
          // Thinking duration
          await delay(500 + Math.random() * 150);
          if (cancelled) return;

          // Start streaming
          setMessages(prev => prev.map((m, idx) =>
            idx === msgCount - 1 ? { ...m, isTyping: false } : m
          ));

          await streamText(msg.text.length);

          // Show diff immediately when final message finishes streaming
          if (isLast) {
            setShowDiff(true);
          }
        } else {
          setMessages(prev => [...prev, { ...msg, progress: 1 }]);
          msgCount++;
        }

        if (!isLast) {
          // Pause after each message before next one appears
          await delay(600);
          if (cancelled) return;
        }
      }

      // Hold for a moment, then fade out
      await delay(2000);
      if (cancelled) return;
      setFading(true);
      await delay(400);
      if (cancelled) return;

      // Clear and restart
      setMessages([]);
      setShowDiff(false);
      setFading(false);
      await delay(600);
      if (cancelled) return;

      // Loop
      runAnimation();
    };

    runAnimation();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        cancelled = true;
        setTimeout(() => {
          cancelled = false;
          setMessages([]);
          setShowDiff(false);
          setFading(false);
          runAnimation();
        }, 100);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className="acd-container">
      <div className="acd-chat">
        <div className={`acd-content-wrap${fading ? ' acd-fading' : ''}`}>
        {messages.map((msg, i) => (
          <div key={i} className="acd-message">
            <span className={`acd-label acd-label-${msg.role}`}>{msg.role === "user" ? "You" : "Agent"}</span>
            <span className="acd-content">
              {msg.isTyping ? (
                <span className="acd-shimmer-text">Thinking...</span>
              ) : (
                <span
                  className={`acd-stream${msg.progress >= 1 ? ' complete' : ''}`}
                  style={{
                    '--reveal': `${msg.progress * 100}%`,
                  } as React.CSSProperties}
                >
                  {renderText(msg.text)}
                </span>
              )}
            </span>
          </div>
        ))}
        {showDiff && (
          <div className="acd-diff">
            {diffFiles.map((file, i) => {
              const ext = file.name.split('.').pop();
              const isTsx = ext === 'tsx' || ext === 'ts' || ext === 'jsx' || ext === 'js';
              const isCss = ext === 'css' || ext === 'scss';
              return (
                <span key={i} className="acd-diff-file">
                  {isTsx ? (
                    // React/TS icon
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="2.5" fill="#61dafb"/>
                      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61dafb" strokeWidth="1.5" fill="none"/>
                      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61dafb" strokeWidth="1.5" fill="none" transform="rotate(60 12 12)"/>
                      <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61dafb" strokeWidth="1.5" fill="none" transform="rotate(120 12 12)"/>
                    </svg>
                  ) : isCss ? (
                    // CSS icon
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6">
                      <path d="M4.192 3.143h15.615l-1.42 16.034-6.404 1.812-6.369-1.813L4.192 3.143ZM16.9 6.424l-9.8-.002.158 1.926 7.529.002-.189 2.02H9.66l.17 1.918h4.518l-.201 2.187-2.146.598-2.148-.596-.136-1.533H7.59l.267 2.983 4.144 1.166 4.137-1.164.558-6.162.087-.876.318-3.467Z"/>
                    </svg>
                  ) : (
                    // Generic file icon
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" opacity="0.5">
                      <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"/>
                    </svg>
                  )}
                  <span className="acd-diff-name">{file.name}</span>
                  <span className="acd-diff-added">+{file.added}</span>
                  {file.removed > 0 && <span className="acd-diff-removed">-{file.removed}</span>}
                </span>
              );
            })}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
