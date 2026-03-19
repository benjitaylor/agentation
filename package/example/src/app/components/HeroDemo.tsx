"use client";

import { useState, useEffect, useRef } from "react";

// Animated demo showing the agentation workflow
// This is purely for documentation - uses visual copies of the real UI

export function HeroDemo() {
  const [typedText, setTypedText] = useState("");
  const [cursorPos, setCursorPos] = useState({ x: 280, y: 180 });
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(false);
  const [isToolbarHovered, setIsToolbarHovered] = useState(false);
  const [isToolbarClicking, setIsToolbarClicking] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showNewMarker, setShowNewMarker] = useState(false);
  const [isCrosshair, setIsCrosshair] = useState(false);
  const [btnPos, setBtnPos] = useState({ x: 20, y: 82, width: 68, height: 33 });

  // New states for extended demo
  const [dragBox, setDragBox] = useState({ visible: false, x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [areaOutline, setAreaOutline] = useState({ visible: false, x: 0, y: 0, width: 0, height: 0 });
  const [showGreenMarker, setShowGreenMarker] = useState(false);
  const [greenMarkerPos, setGreenMarkerPos] = useState({ x: 0, y: 0 });
  const [copyClicked, setCopyClicked] = useState(false);
  const [copyHovered, setCopyHovered] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalText, setTerminalText] = useState("");
  const [popupHeader, setPopupHeader] = useState("button.submit-btn");
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [headerText] = useState("Benji's Dashboard");
  const [textSelection, setTextSelection] = useState({ visible: false, x: 0, y: 0, width: 0 });
  const [showOrangeMarker, setShowOrangeMarker] = useState(false);
  const [orangeMarkerPos, setOrangeMarkerPos] = useState({ x: 0, y: 0 });
  const [isIBeam, setIsIBeam] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [selectedSidebarIcons, setSelectedSidebarIcons] = useState<number[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<number[]>([]);

  const btnRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const timePosRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const contentRef = useRef<HTMLDivElement>(null);
  const copyBtnRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const sidebarIconsRef = useRef<HTMLDivElement>(null);
  const btnPosRef = useRef({ x: 20, y: 82, width: 68, height: 33 });
  const metricsPosRef = useRef({ x: 0, y: 26, width: 175, height: 58 });
  const toolbarPosRef = useRef({ x: 280, y: 210 });
  const sidebarIconsPosRef = useRef({ x: 10, y: 40, width: 24, height: 70 });

  // Measure element positions
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
    if (metricsRef.current && contentRef.current) {
      const metricsRect = metricsRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      // Get first two cards (about 2/3 of the row width)
      const twoCardsWidth = metricsRect.width * 0.72;
      metricsPosRef.current = {
        x: metricsRect.left - contentRect.left,
        y: metricsRect.top - contentRect.top,
        width: twoCardsWidth,
        height: metricsRect.height,
      };
    }
    if (toolbarRef.current && contentRef.current) {
      const toolbarRect = toolbarRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      toolbarPosRef.current = {
        x: toolbarRect.left - contentRect.left + toolbarRect.width / 2,
        y: toolbarRect.top - contentRect.top + toolbarRect.height / 2,
      };
    }
    if (sidebarIconsRef.current && contentRef.current) {
      const iconsRect = sidebarIconsRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      sidebarIconsPosRef.current = {
        x: iconsRect.left - contentRect.left,
        y: iconsRect.top - contentRect.top,
        width: iconsRect.width,
        height: iconsRect.height,
      };
    }
    if (timeRef.current && contentRef.current) {
      const timeRect = timeRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      timePosRef.current = {
        x: timeRect.left - contentRect.left,
        y: timeRect.top - contentRect.top,
        width: timeRect.width,
        height: timeRect.height,
      };
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

  const feedbackText1 = "Change to primary style";
  const feedbackText2 = "Add hover states";
  const feedbackText3 = "Make this more prominent";

  // Different terminal output for mobile (metrics instead of sidebar)
  const getTerminalOutput = (mobile: boolean) => mobile ? `## Page Feedback

### 1. button.export-btn
Change to primary style

### 2. Metrics cards
Add hover states

### 3. "${headerText}"
Make this more prominent` : `## Page Feedback

### 1. button.export-btn
Change to primary style

### 2. Sidebar icons
Add hover states

### 3. "${headerText}"
Make this more prominent`;

  // Animation sequence
  useEffect(() => {
    let cancelled = false;
    let interval: ReturnType<typeof setInterval>;

    const resetState = () => {
      setTypedText("");
      setCursorPos({ x: 400, y: 180 });
      setIsToolbarExpanded(false);
      setIsToolbarHovered(false);
      setIsToolbarClicking(false);
      setShowHighlight(false);
      setShowPopup(false);
      setShowNewMarker(false);
      setIsCrosshair(false);
      setDragBox({ visible: false, x: 0, y: 0, width: 0, height: 0 });
      setIsDragging(false);
      setAreaOutline({ visible: false, x: 0, y: 0, width: 0, height: 0 });
      setShowGreenMarker(false);
      setCopyClicked(false);
      setCopyHovered(false);
      setShowTerminal(false);
      setTerminalText("");
      setPopupHeader("button.submit-btn");
      setPopupPos({ x: 0, y: 0 });
      setTextSelection({ visible: false, x: 0, y: 0, width: 0 });
      setShowOrangeMarker(false);
      setIsIBeam(false);
      setIsMobileView(window.innerWidth <= 640);
      setSelectedSidebarIcons([]);
      setSelectedMetrics([]);
    };

    const runAnimation = async () => {
      // Reset state
      resetState();

      // Check if mobile (sidebar hidden below 640px)
      const isMobile = window.innerWidth <= 640;
      setIsMobileView(isMobile);

      if (cancelled) return;
      await delay(600);
      if (cancelled) return;

      // Move cursor to toolbar center (measured position)
      const toolbarPos = toolbarPosRef.current;
      setCursorPos({ x: toolbarPos.x, y: toolbarPos.y });
      await delay(400);
      if (cancelled) return;

      // Hover toolbar
      setIsToolbarHovered(true);
      await delay(300);
      if (cancelled) return;

      // Click toolbar (press down)
      setIsToolbarClicking(true);
      await delay(100);
      if (cancelled) return;

      // Release click and expand
      setIsToolbarClicking(false);
      setIsToolbarHovered(false);
      setIsToolbarExpanded(true);
      await delay(400);
      if (cancelled) return;

      // Switch to crosshair cursor
      setIsCrosshair(true);
      await delay(200);
      if (cancelled) return;

      // Move cursor toward the button center
      const pos = btnPosRef.current;
      setCursorPos({ x: pos.x + pos.width / 2, y: pos.y + pos.height / 2 });
      await delay(500);
      if (cancelled) return;

      // Show hover highlight
      setShowHighlight(true);
      await delay(400);
      if (cancelled) return;

      // Click - hide highlight, show popup near cursor
      setShowHighlight(false);
      await delay(100);
      if (cancelled) return;
      // Position popup below cursor, more to the left to stay in bounds
      const containerWidth = contentRef.current?.offsetWidth || 300;
      const cursorX = pos.x + pos.width / 2;
      const popupX = Math.min(Math.max(100, cursorX - 80), containerWidth - 100);
      setPopupPos({ x: popupX, y: pos.y + pos.height + 7 });
      setShowPopup(true);
      await delay(300);
      if (cancelled) return;

      // Type feedback
      for (let i = 0; i <= feedbackText1.length; i++) {
        if (cancelled) return;
        setTypedText(feedbackText1.slice(0, i));
        await delay(35);
      }
      if (cancelled) return;
      await delay(300);
      if (cancelled) return;

      // Submit - hide popup, show marker
      setShowPopup(false);
      await delay(200);
      if (cancelled) return;
      setShowNewMarker(true);
      await delay(600);
      if (cancelled) return;

      // === DRAG SELECTION ===
      if (!isMobile) {
        // Desktop: Drag over sidebar icons (upwards)
        const sidebarPos = sidebarIconsPosRef.current;
        const dragStartX = sidebarPos.x + sidebarPos.width + 2;
        const dragStartY = sidebarPos.y + sidebarPos.height + 2;
        setCursorPos({ x: dragStartX, y: dragStartY });
        await delay(500);
        if (cancelled) return;

        // Start drag - select the sidebar icons (dragging up)
        setIsDragging(true);
        const dragEndX = sidebarPos.x - 2;
        const dragEndY = sidebarPos.y - 2;
        setDragBox({ visible: true, x: dragStartX, y: dragStartY, width: 0, height: 0 });

        // Animate drag smoothly
        const steps = 16;
        for (let i = 1; i <= steps; i++) {
          if (cancelled) return;
          const progress = i / steps;
          const currentX = dragStartX + (dragEndX - dragStartX) * progress;
          const currentY = dragStartY + (dragEndY - dragStartY) * progress;
          setCursorPos({ x: currentX, y: currentY });
          // Calculate box with positive width/height regardless of drag direction
          setDragBox({
            visible: true,
            x: Math.min(dragStartX, currentX),
            y: Math.min(dragStartY, currentY),
            width: Math.abs(currentX - dragStartX),
            height: Math.abs(currentY - dragStartY),
          });
          // Select icons as they're encompassed (bottom to top: 2, 1, 0)
          if (progress > 0.25) setSelectedSidebarIcons((s) => (s.includes(2) ? s : [...s, 2]));
          if (progress > 0.5) setSelectedSidebarIcons((s) => (s.includes(1) ? s : [...s, 1]));
          if (progress > 0.75) setSelectedSidebarIcons((s) => (s.includes(0) ? s : [...s, 0]));
          await delay(25);
        }
        if (cancelled) return;
        await delay(200);
        if (cancelled) return;

        // Release drag - hide drag box, show area outline
        setIsDragging(false);
        setDragBox({ visible: false, x: 0, y: 0, width: 0, height: 0 });
        setSelectedSidebarIcons([]);
        setAreaOutline({
          visible: true,
          x: Math.min(dragStartX, dragEndX),
          y: Math.min(dragStartY, dragEndY),
          width: Math.abs(dragEndX - dragStartX),
          height: Math.abs(dragEndY - dragStartY),
        });
        setPopupHeader("Sidebar icons");
        setTypedText("");
        // Position popup to the right of the sidebar selection
        setPopupPos({ x: dragEndX + 110, y: (dragStartY + dragEndY) / 2 - 40 });
        setShowPopup(true);
        await delay(300);
        if (cancelled) return;

        // Type second feedback
        for (let i = 0; i <= feedbackText2.length; i++) {
          if (cancelled) return;
          setTypedText(feedbackText2.slice(0, i));
          await delay(35);
        }
        if (cancelled) return;
        await delay(300);
        if (cancelled) return;

        // Submit - hide popup, show green marker at release point
        setShowPopup(false);
        await delay(200);
        if (cancelled) return;
        // Place marker at top-right corner of selection (near cursor end, but not cropped)
        setGreenMarkerPos({ x: dragStartX, y: dragEndY });
        setShowGreenMarker(true);
        await delay(400);
        if (cancelled) return;
      } else {
        // Mobile: Drag over metrics cards (horizontal)
        const metricsPos = metricsPosRef.current;
        const dragStartX = metricsPos.x - 2;
        const dragStartY = metricsPos.y + metricsPos.height / 2;
        setCursorPos({ x: dragStartX, y: dragStartY });
        await delay(400);
        if (cancelled) return;

        // Start drag - select across the metrics cards
        setIsDragging(true);
        const dragEndX = metricsPos.x + metricsPos.width;
        const dragEndY = metricsPos.y + metricsPos.height + 2;
        setDragBox({ visible: true, x: dragStartX, y: metricsPos.y - 2, width: 0, height: 0 });

        // Animate drag smoothly (fewer steps for mobile)
        const steps = 12;
        for (let i = 1; i <= steps; i++) {
          if (cancelled) return;
          const progress = i / steps;
          const currentX = dragStartX + (dragEndX - dragStartX) * progress;
          setCursorPos({ x: currentX, y: dragStartY });
          setDragBox({
            visible: true,
            x: metricsPos.x - 2,
            y: metricsPos.y - 2,
            width: currentX - dragStartX,
            height: metricsPos.height + 4,
          });
          // Select metrics as they're encompassed (left to right: 0, 1, 2)
          if (progress > 0.2) setSelectedMetrics((s) => (s.includes(0) ? s : [...s, 0]));
          if (progress > 0.5) setSelectedMetrics((s) => (s.includes(1) ? s : [...s, 1]));
          if (progress > 0.8) setSelectedMetrics((s) => (s.includes(2) ? s : [...s, 2]));
          await delay(25);
        }
        if (cancelled) return;
        await delay(150);
        if (cancelled) return;

        // Release drag - hide drag box, show area outline
        setIsDragging(false);
        setDragBox({ visible: false, x: 0, y: 0, width: 0, height: 0 });
        setSelectedMetrics([]);
        setAreaOutline({
          visible: true,
          x: metricsPos.x - 2,
          y: metricsPos.y - 2,
          width: metricsPos.width + 2,
          height: metricsPos.height + 4,
        });
        setPopupHeader("Metrics cards");
        setTypedText("");
        // Position popup below the metrics selection
        const containerWidth = contentRef.current?.offsetWidth || 300;
        setPopupPos({ x: Math.min(metricsPos.x + metricsPos.width / 2, containerWidth - 100), y: dragEndY + 7 });
        setShowPopup(true);
        await delay(250);
        if (cancelled) return;

        // Type feedback (short for mobile)
        const mobileDragFeedback = "Add hover states";
        for (let i = 0; i <= mobileDragFeedback.length; i++) {
          if (cancelled) return;
          setTypedText(mobileDragFeedback.slice(0, i));
          await delay(30);
        }
        if (cancelled) return;
        await delay(250);
        if (cancelled) return;

        // Submit - hide popup, show green marker
        setShowPopup(false);
        await delay(150);
        if (cancelled) return;
        setGreenMarkerPos({ x: dragEndX, y: metricsPos.y + metricsPos.height / 2 });
        setShowGreenMarker(true);
        await delay(300);
        if (cancelled) return;
      }

      // === TEXT SELECTION ===
      // Move cursor to the time text
      const timePos = timePosRef.current;
      const textStartX = timePos.x;
      const textEndX = timePos.x + timePos.width;
      const textY = timePos.y + timePos.height / 2;

      // Move to start of text and switch to I-beam cursor
      setIsCrosshair(false);
      setIsIBeam(true);
      setCursorPos({ x: textStartX, y: textY });
      await delay(500);
      if (cancelled) return;

      // Start selection
      setIsDragging(true);
      setTextSelection({ visible: true, x: textStartX, y: timePos.y, width: 0 });

      // Animate text selection across the time
      const textSteps = 12;
      for (let i = 1; i <= textSteps; i++) {
        if (cancelled) return;
        const progress = i / textSteps;
        const currentX = textStartX + (textEndX - textStartX) * progress;
        setCursorPos({ x: currentX, y: textY });
        setTextSelection({ visible: true, x: textStartX, y: timePos.y - 2, width: currentX - textStartX });
        await delay(30);
      }
      if (cancelled) return;
      await delay(200);
      if (cancelled) return;

      // Release selection - show popup
      setIsDragging(false);
      setPopupHeader(`"${headerText}"`);
      setTypedText("");
      // Position popup below the time
      const textPopupX = Math.min(Math.max(100, (textStartX + textEndX) / 2), (contentRef.current?.offsetWidth || 300) - 100);
      setPopupPos({ x: textPopupX, y: timePos.y + timePos.height + 7 });
      setShowPopup(true);
      await delay(300);
      if (cancelled) return;

      // Type third feedback
      const textFeedback = feedbackText3;
      for (let i = 0; i <= textFeedback.length; i++) {
        if (cancelled) return;
        setTypedText(textFeedback.slice(0, i));
        await delay(35);
      }
      if (cancelled) return;
      await delay(300);
      if (cancelled) return;

      // Submit - hide popup, show orange marker
      setShowPopup(false);
      await delay(200);
      if (cancelled) return;
      setOrangeMarkerPos({ x: textEndX + 2, y: timePos.y + timePos.height / 2 });
      setShowOrangeMarker(true);
      setTextSelection({ visible: false, x: 0, y: 0, width: 0 });
      // Switch from I-beam back to crosshair
      setIsIBeam(false);
      setIsCrosshair(true);
      await delay(400);
      if (cancelled) return;

      // === COPY OUTPUT ===

      // Measure copy button position now that toolbar is expanded
      let copyX = 400, copyY = 222; // fallback
      if (copyBtnRef.current && contentRef.current) {
        const copyRect = copyBtnRef.current.getBoundingClientRect();
        const contentRect = contentRef.current.getBoundingClientRect();
        copyX = copyRect.left - contentRect.left + copyRect.width / 2;
        copyY = copyRect.top - contentRect.top + copyRect.height / 2;
      }

      // Move cursor to copy button
      setCursorPos({ x: copyX, y: copyY });
      await delay(350);
      if (cancelled) return;

      // Switch to pointer when hovering copy button
      setIsCrosshair(false);
      setCopyHovered(true);
      await delay(400);
      if (cancelled) return;

      // Click copy button
      setCopyHovered(false);
      setCopyClicked(true);
      await delay(400);
      if (cancelled) return;

      // Show terminal first (empty, just with Claude welcome)
      setShowTerminal(true);
      await delay(600);
      if (cancelled) return;

      // Now "paste" the output - type it quickly to show it appearing
      const terminalOutput = getTerminalOutput(isMobile);
      const lines = terminalOutput.split('\n');
      let currentText = '';
      for (const line of lines) {
        if (cancelled) return;
        currentText += line + '\n';
        setTerminalText(currentText.trim());
        await delay(80);
      }

      // Pause before loop
      if (cancelled) return;
      await delay(800);
      if (cancelled) return;

      // Reset for next loop - close toolbar with terminal for clean restart
      setShowNewMarker(false);
      setShowGreenMarker(false);
      setShowOrangeMarker(false);
      setAreaOutline({ visible: false, x: 0, y: 0, width: 0, height: 0 });
      setCopyClicked(false);
      setCopyHovered(false);
      setShowTerminal(false);
      setIsToolbarExpanded(false);
      setIsCrosshair(false);
      await delay(400);
    };

    const startAnimation = () => {
      cancelled = false;
      runAnimation();
      // Slightly shorter interval on mobile (faster animations, shorter text)
      const loopInterval = window.innerWidth <= 640 ? 14000 : 16000;
      interval = setInterval(runAnimation, loopInterval);
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        // Page became visible - cancel current animation and restart fresh
        cancelled = true;
        clearInterval(interval);
        resetState();
        setTimeout(() => {
          startAnimation();
        }, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    startAnimation();

    return () => {
      cancelled = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className="hero-demo-container">
      <style suppressHydrationWarning>{`
        .hero-demo-container {
          position: relative;
          width: 100%;
          margin: 1.5rem 0;
        }

        .hero-demo-browser {
          position: relative;
          width: 100%;
          height: 300px;
          background: #F6F5F4;
          border-radius: 12px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.06),
            0 4px 16px rgba(0, 0, 0, 0.08);
        }

        .hero-demo-browser-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 12px;
          background: #fff;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .hero-demo-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .hero-demo-dot.red { background: #ff5f57; }
        .hero-demo-dot.yellow { background: #febc2e; }
        .hero-demo-dot.green { background: #28c840; }

        .hero-demo-url-bar {
          flex: 1;
          margin-left: 8px;
          padding: 4px 10px;
          background: rgba(0, 0, 0, 0.04);
          border-radius: 6px;
          font-size: 10px;
          color: rgba(0, 0, 0, 0.4);
          font-family: system-ui, -apple-system, sans-serif;
        }

        .hero-demo-content {
          position: relative;
          height: calc(100% - 38px);
          display: flex;
          overflow: hidden;
        }

        /* Sidebar - narrow icon-only */
        .hero-demo-sidebar {
          width: 44px;
          background: #fff;
          border-right: 1px solid rgba(0, 0, 0, 0.06);
          padding: 12px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .hero-demo-sidebar-logo {
          width: 20px;
          height: 20px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 5px;
          margin-bottom: 8px;
        }

        .hero-demo-sidebar-icon {
          width: 16px;
          height: 16px;
          background: rgba(0, 0, 0, 0.08);
          border-radius: 4px;
        }

        .hero-demo-sidebar-icon.active {
          background: rgba(0, 0, 0, 0.15);
        }

        .hero-demo-sidebar-icon.selected {
          box-shadow: 0 0 0 2px #22c55e;
          background: rgba(34, 197, 94, 0.15);
        }

        .hero-demo-sidebar-icon.circle {
          border-radius: 50%;
        }

        .hero-demo-sidebar-icons {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .hero-demo-sidebar-bottom {
          margin-top: auto;
        }

        /* Main content area */
        .hero-demo-main {
          flex: 1;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          overflow: hidden;
        }

        /* Header row */
        .hero-demo-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .hero-demo-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hero-demo-logo {
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.08) 100%);
          border-radius: 5px;
        }

        .hero-demo-title-text {
          font-size: 11px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.5);
          font-family: system-ui, -apple-system, sans-serif;
        }

        .hero-demo-button {
          width: 55px;
          height: 26px;
          background: rgba(0, 0, 0, 0.08);
          border-radius: 5px;
        }

        .hero-demo-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }

        /* Metrics row */
        .hero-demo-metrics {
          display: flex;
          gap: 12px;
        }

        .hero-demo-metric {
          flex: 1;
          background: white;
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
          transition: box-shadow 0.15s ease, background 0.15s ease;
        }

        .hero-demo-metric.selected {
          box-shadow: 0 0 0 2px #22c55e;
          background: rgba(34, 197, 94, 0.04);
        }

        .hero-demo-metric-label {
          width: 45px;
          height: 5px;
          background: rgba(0, 0, 0, 0.08);
          border-radius: 2px;
          margin-bottom: 8px;
        }

        .hero-demo-metric-value {
          width: 50px;
          height: 18px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }

        .hero-demo-metric-value.wide {
          width: 65px;
        }

        /* Table */
        .hero-demo-table {
          flex: 1;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }

        .hero-demo-table-header {
          display: flex;
          padding: 10px 14px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          gap: 20px;
        }

        .hero-demo-th {
          height: 6px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 2px;
        }

        .hero-demo-table-row {
          display: flex;
          padding: 12px 14px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          gap: 20px;
          align-items: center;
        }

        .hero-demo-td {
          height: 7px;
          background: rgba(0, 0, 0, 0.06);
          border-radius: 2px;
        }

        .hero-demo-td-pill {
          width: 48px;
          height: 18px;
          background: rgba(0, 0, 0, 0.04);
          border-radius: 9px;
        }

        .hero-demo-button-highlight {
          position: absolute;
          border: 2px solid rgba(59, 130, 246, 0.7);
          border-radius: 8px;
          background: transparent;
          opacity: 0;
          transform: scale(0.98);
          transition: opacity 0.12s ease-out, transform 0.12s ease-out;
          pointer-events: none;
          box-sizing: border-box;
        }

        .hero-demo-button-highlight.visible {
          opacity: 1;
          transform: scale(1);
        }

        /* Drag selection box - dashed style like FeaturesDemo */
        .hero-demo-drag-box {
          position: absolute;
          border: 1.5px dashed #22c55e;
          border-radius: 8px;
          background: rgba(34, 197, 94, 0.08);
          pointer-events: none;
          z-index: 45;
        }

        /* Area outline - stays visible after drag */
        .hero-demo-area-outline {
          position: absolute;
          border: 2px dashed #22c55e;
          border-radius: 8px;
          opacity: 0;
          transition: opacity 0.15s ease;
          pointer-events: none;
          background: rgba(34, 197, 94, 0.05);
          z-index: 44;
        }

        .hero-demo-area-outline.visible {
          opacity: 1;
        }

        /* Cursor */
        .hero-demo-cursor {
          position: absolute;
          pointer-events: none;
          z-index: 100;
          transition: left 0.35s cubic-bezier(0.4, 0, 0.2, 1), top 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          display: grid;
        }

        .hero-demo-cursor.dragging {
          transition: none;
        }

        .hero-demo-cursor.dragging * {
          transition: none !important;
        }

        .hero-demo-cursor-pointer,
        .hero-demo-cursor-crosshair,
        .hero-demo-cursor-ibeam {
          grid-area: 1 / 1;
          transform: scale(1);
          transform-origin: top left;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .hero-demo-cursor-pointer.hidden {
          transform: scale(0);
          opacity: 0;
        }

        .hero-demo-cursor-crosshair.hidden {
          transform: scale(0);
          opacity: 0;
        }

        .hero-demo-cursor-ibeam.hidden {
          transform: scale(0);
          opacity: 0;
        }

        .hero-demo-cursor-ibeam {
          transform-origin: center center;
        }

        .hero-demo-cursor svg {
          display: block;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
        }

        /* Toolbar - dark mode */
        .hero-demo-toolbar {
          position: absolute;
          bottom: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1a1a1a;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25), 0 4px 16px rgba(0, 0, 0, 0.15);
          transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1), border-radius 0.4s cubic-bezier(0.19, 1, 0.22, 1), padding 0.4s cubic-bezier(0.19, 1, 0.22, 1), transform 0.15s ease, background 0.15s ease;
          width: 36px;
          height: 36px;
          border-radius: 18px;
        }

        .hero-demo-toolbar.hovered:not(.expanded) {
          background: #2a2a2a;
          transform: scale(1.05);
        }

        .hero-demo-toolbar.clicking:not(.expanded) {
          background: #333;
          transform: scale(0.95);
        }

        .hero-demo-toolbar.expanded {
          width: 200px;
          border-radius: 20px;
          padding: 0 6px 0 6px;
          justify-content: flex-start;
        }

        .hero-demo-toolbar-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          color: rgba(255, 255, 255, 0.85);
        }

        .hero-demo-toolbar.expanded .hero-demo-toolbar-icon {
          display: none;
        }

        .hero-demo-toolbar-buttons {
          display: none;
          align-items: center;
          gap: 3px;
        }

        .hero-demo-toolbar.expanded .hero-demo-toolbar-buttons {
          display: flex;
        }

        .hero-demo-toolbar-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.85);
          transition: color 0.2s ease, background-color 0.2s ease, opacity 0.2s ease;
        }

        .hero-demo-toolbar-btn.active {
          color: #3b82f6;
          background-color: rgba(59, 130, 246, 0.25);
        }

        .hero-demo-toolbar-btn.hovered {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .hero-demo-toolbar-btn.disabled {
          opacity: 0.35;
        }

        .hero-demo-toolbar-divider {
          width: 1px;
          height: 12px;
          background: rgba(255, 255, 255, 0.15);
          margin: 0 2px;
        }

        /* Popup - dark mode */
        .hero-demo-popup {
          position: absolute;
          width: 200px;
          padding: 10px 12px 12px;
          background: #1a1a1a;
          border-radius: 14px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
          opacity: 0;
          transform: translate(-50%, 0) scale(0.95) translateY(4px);
          transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 50;
        }

        .hero-demo-popup.visible {
          opacity: 1;
          transform: translate(-50%, 0) scale(1) translateY(0);
        }

        .hero-demo-popup-header {
          font-size: 10px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 6px;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .hero-demo-popup-input {
          width: 100%;
          height: 40px;
          padding: 6px 8px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          font-size: 11px;
          color: #fff;
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.4;
          box-sizing: border-box;
        }

        .hero-demo-popup-actions {
          display: flex;
          justify-content: flex-end;
          gap: 5px;
          margin-top: 6px;
        }

        .hero-demo-popup-btn {
          padding: 5px 12px;
          font-size: 10px;
          font-weight: 500;
          border-radius: 14px;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .hero-demo-popup-btn.cancel {
          background: transparent;
          color: rgba(255, 255, 255, 0.5);
        }

        .hero-demo-popup-btn.submit {
          background: #3b82f6;
          color: white;
        }

        .hero-demo-popup-btn.submit.green {
          background: #22c55e;
        }

        .hero-demo-popup-btn.submit.orange {
          background: #f59e0b;
        }

        /* Marker - matches real marker */
        .hero-demo-marker {
          position: absolute;
          width: 22px;
          height: 22px;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          font-family: system-ui, -apple-system, sans-serif;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.3);
          transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 40;
        }

        .hero-demo-marker.visible {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }

        .hero-demo-marker.green {
          background: #34c759;
          border-radius: 6px;
          width: 26px;
          height: 26px;
        }

        .hero-demo-marker.orange {
          background: #f59e0b;
        }

        /* Text selection highlight */
        .hero-demo-text-selection {
          position: absolute;
          background: rgba(59, 130, 246, 0.25);
          border-radius: 2px;
          pointer-events: none;
          z-index: 35;
          height: 16px;
        }

        /* Browser fades when terminal appears */
        .hero-demo-browser {
          transition: opacity 0.3s ease;
        }

        .hero-demo-browser.faded {
          opacity: 0.4;
        }

        /* Terminal - Cream style with Claude bot */
        .hero-demo-terminal {
          position: absolute;
          top: 20px;
          right: 25px;
          width: 340px;
          height: 280px;
          background: #faf9f7;
          border-radius: 10px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.08),
            0 4px 16px rgba(0, 0, 0, 0.12),
            0 12px 32px rgba(0, 0, 0, 0.08);
          opacity: 0;
          transform: translateY(8px) scale(0.98);
          transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 60;
        }

        .hero-demo-terminal.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .hero-demo-terminal-bar {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 12px;
          background: #fff;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .hero-demo-terminal-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .hero-demo-terminal-dot.red { background: #ff5f57; }
        .hero-demo-terminal-dot.yellow { background: #febc2e; }
        .hero-demo-terminal-dot.green { background: #28c840; }

        .hero-demo-terminal-title {
          flex: 1;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.85);
          font-family: system-ui, -apple-system, sans-serif;
          margin-right: 36px;
        }

        .hero-demo-terminal-content {
          padding: 12px 14px;
          font-family: "SF Mono", "SFMono-Regular", ui-monospace, Consolas, monospace;
          font-size: 10px;
          line-height: 1.6;
          color: rgba(0, 0, 0, 0.7);
          white-space: pre-wrap;
          overflow: hidden;
        }

        .hero-demo-terminal-welcome {
          margin-bottom: 8px;
        }

        /* Mobile responsive */
        @media (max-width: 640px) {
          .hero-demo-browser {
            height: 260px;
            border-radius: 10px;
          }

          .hero-demo-browser-bar {
            padding: 8px 10px;
          }

          .hero-demo-dot {
            width: 6px;
            height: 6px;
          }

          .hero-demo-url-bar {
            font-size: 9px;
            padding: 3px 8px;
          }

          .hero-demo-sidebar {
            display: none;
          }

          .hero-demo-main {
            padding: 12px;
            gap: 10px;
          }

          .hero-demo-logo {
            width: 14px;
            height: 14px;
          }

          .hero-demo-title-text {
            font-size: 10px;
          }

          .hero-demo-button {
            width: 45px;
            height: 22px;
          }

          .hero-demo-avatar {
            width: 22px;
            height: 22px;
          }

          .hero-demo-metrics {
            gap: 8px;
          }

          .hero-demo-metric {
            padding: 10px;
          }

          .hero-demo-metric-label {
            width: 35px;
            height: 4px;
            margin-bottom: 6px;
          }

          .hero-demo-metric-value {
            width: 40px;
            height: 14px;
          }

          .hero-demo-table-header {
            padding: 8px 10px;
            gap: 14px;
          }

          .hero-demo-th {
            height: 5px;
          }

          .hero-demo-table-row {
            padding: 10px;
            gap: 14px;
          }

          .hero-demo-td {
            height: 6px;
          }

          .hero-demo-td-pill {
            width: 38px;
            height: 14px;
          }

          .hero-demo-toolbar {
            width: 28px;
            height: 28px;
            border-radius: 14px;
            bottom: 8px;
            right: 8px;
          }

          .hero-demo-toolbar.expanded {
            width: auto;
            border-radius: 16px;
            padding: 4px 8px;
          }

          .hero-demo-toolbar-btn {
            width: 22px;
            height: 22px;
          }

          .hero-demo-toolbar-btn svg {
            width: 13px;
            height: 13px;
          }

          .hero-demo-toolbar-divider {
            height: 16px;
            margin: 0 4px;
          }

          .hero-demo-popup {
            width: 190px;
            padding: 8px 10px 10px;
            border-radius: 12px;
          }

          .hero-demo-popup-header {
            font-size: 9px;
          }

          .hero-demo-popup-input {
            height: 32px;
            font-size: 9px;
          }

          .hero-demo-popup-btn {
            padding: 4px 10px;
            font-size: 9px;
          }

          .hero-demo-marker {
            width: 18px;
            height: 18px;
            font-size: 10px;
          }

          .hero-demo-marker.green {
            width: 22px;
            height: 22px;
          }

          .hero-demo-marker.orange {
            width: 18px;
            height: 18px;
          }

          .hero-demo-terminal {
            top: 10px;
            right: 10px;
            left: 10px;
            width: auto;
            height: 240px;
            border-radius: 8px;
          }

          .hero-demo-terminal-bar {
            padding: 10px 12px;
          }

          .hero-demo-terminal-dot {
            width: 10px;
            height: 10px;
          }

          .hero-demo-terminal-title {
            font-size: 11px;
            margin-right: 30px;
          }

          .hero-demo-terminal-content {
            padding: 10px 12px;
            font-size: 9px;
          }
        }
      `}</style>

      {/* Browser window */}
      <div className={`hero-demo-browser ${showTerminal ? 'faded' : ''}`}>
        {/* Browser chrome */}
        <div className="hero-demo-browser-bar">
          <div className="hero-demo-dot red" />
          <div className="hero-demo-dot yellow" />
          <div className="hero-demo-dot green" />
          <div className="hero-demo-url-bar">localhost:3000</div>
        </div>

        {/* Fake page content - Stripe dashboard style */}
        <div className="hero-demo-content" ref={contentRef}>
          {/* Sidebar - minimal icons only */}
          <div className="hero-demo-sidebar">
            <div className="hero-demo-sidebar-logo" />
            <div className="hero-demo-sidebar-icons" ref={sidebarIconsRef}>
              <div className={`hero-demo-sidebar-icon ${selectedSidebarIcons.includes(0) ? "selected" : ""}`} />
              <div className={`hero-demo-sidebar-icon active ${selectedSidebarIcons.includes(1) ? "selected" : ""}`} />
              <div className={`hero-demo-sidebar-icon ${selectedSidebarIcons.includes(2) ? "selected" : ""}`} />
            </div>
            <div className="hero-demo-sidebar-bottom">
              <div className="hero-demo-sidebar-icon circle" />
            </div>
          </div>

          {/* Main content */}
          <div className="hero-demo-main">
            {/* Header */}
            <div className="hero-demo-header">
              <div className="hero-demo-header-left">
                <div className="hero-demo-logo" />
                <span className="hero-demo-title-text" ref={timeRef}>{headerText}</span>
              </div>
              <div className="hero-demo-button" ref={btnRef} />
            </div>

            {/* Metrics row */}
            <div className="hero-demo-metrics" ref={metricsRef}>
              <div className={`hero-demo-metric ${selectedMetrics.includes(0) ? "selected" : ""}`}>
                <div className="hero-demo-metric-label" />
                <div className="hero-demo-metric-value" />
              </div>
              <div className={`hero-demo-metric ${selectedMetrics.includes(1) ? "selected" : ""}`}>
                <div className="hero-demo-metric-label" style={{ width: 55 }} />
                <div className="hero-demo-metric-value wide" />
              </div>
              <div className={`hero-demo-metric ${selectedMetrics.includes(2) ? "selected" : ""}`}>
                <div className="hero-demo-metric-label" style={{ width: 38 }} />
                <div className="hero-demo-metric-value" style={{ width: 40 }} />
              </div>
            </div>

            {/* Table */}
            <div className="hero-demo-table">
              <div className="hero-demo-table-header">
                <div className="hero-demo-th" style={{ width: 60 }} />
                <div className="hero-demo-th" style={{ width: 45 }} />
                <div className="hero-demo-th" style={{ width: 40 }} />
              </div>
              <div className="hero-demo-table-row">
                <div className="hero-demo-td" style={{ width: 70 }} />
                <div className="hero-demo-td" style={{ width: 50 }} />
                <div className="hero-demo-td-pill" />
              </div>
              <div className="hero-demo-table-row">
                <div className="hero-demo-td" style={{ width: 55 }} />
                <div className="hero-demo-td" style={{ width: 42 }} />
                <div className="hero-demo-td-pill" style={{ width: 42 }} />
              </div>
              <div className="hero-demo-table-row">
                <div className="hero-demo-td" style={{ width: 62 }} />
                <div className="hero-demo-td" style={{ width: 38 }} />
                <div className="hero-demo-td-pill" />
              </div>
            </div>

          {/* Toolbar - using exact real icons */}
          <div ref={toolbarRef} className={`hero-demo-toolbar ${isToolbarExpanded ? "expanded" : ""} ${isToolbarHovered ? "hovered" : ""} ${isToolbarClicking ? "clicking" : ""}`}>
            {/* Collapsed icon - IconListSparkle */}
            <div className="hero-demo-toolbar-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M11.5 12L5.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 6.75L5.5 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.25 17.25L5.5 17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 12.75L16.5179 13.9677C16.8078 14.6494 17.3506 15.1922 18.0323 15.4821L19.25 16L18.0323 16.5179C17.3506 16.8078 16.8078 17.3506 16.5179 18.0323L16 19.25L15.4821 18.0323C15.1922 17.3506 14.6494 16.8078 13.9677 16.5179L12.75 16L13.9677 15.4821C14.6494 15.1922 15.1922 14.6494 15.4821 13.9677L16 12.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* Expanded buttons - exact order from real toolbar */}
            <div className="hero-demo-toolbar-buttons">
              {/* Pause */}
              <div className="hero-demo-toolbar-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M8 6L8 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M16 18L16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              {/* Eye */}
              <div className="hero-demo-toolbar-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3.91752 12.7539C3.65127 12.2996 3.65037 11.7515 3.9149 11.2962C4.9042 9.59346 7.72688 5.49994 12 5.49994C16.2731 5.49994 19.0958 9.59346 20.0851 11.2962C20.3496 11.7515 20.3487 12.2996 20.0825 12.7539C19.0908 14.4459 16.2694 18.4999 12 18.4999C7.73064 18.4999 4.90918 14.4459 3.91752 12.7539Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 14.8261C13.5608 14.8261 14.8261 13.5608 14.8261 12C14.8261 10.4392 13.5608 9.17392 12 9.17392C10.4392 9.17392 9.17391 10.4392 9.17391 12C9.17391 13.5608 10.4392 14.8261 12 14.8261Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {/* Copy - shows checkmark when clicked */}
              <div ref={copyBtnRef} className={`hero-demo-toolbar-btn ${copyClicked ? "active" : ""} ${copyHovered ? "hovered" : ""}`}>
                {copyClicked ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12L10 17L19 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              {/* Trash */}
              <div className="hero-demo-toolbar-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M10 11.5L10.125 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 11.5L13.87 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 7.5V6.25C9 5.42157 9.67157 4.75 10.5 4.75H13.5C14.3284 4.75 15 5.42157 15 6.25V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.5 7.75H18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M6.75 7.75L7.11691 16.189C7.16369 17.2649 7.18708 17.8028 7.41136 18.2118C7.60875 18.5717 7.91211 18.8621 8.28026 19.0437C8.69854 19.25 9.23699 19.25 10.3139 19.25H13.6861C14.763 19.25 15.3015 19.25 15.7197 19.0437C16.0879 18.8621 16.3912 18.5717 16.5886 18.2118C16.8129 17.8028 16.8363 17.2649 16.8831 16.189L17.25 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              {/* Gear */}
              <div className="hero-demo-toolbar-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M10.6504 5.81117C10.9939 4.39628 13.0061 4.39628 13.3496 5.81117C13.5715 6.72517 14.6187 7.15891 15.4219 6.66952C16.6652 5.91193 18.0881 7.33479 17.3305 8.57815C16.8411 9.38134 17.2748 10.4285 18.1888 10.6504C19.6037 10.9939 19.6037 13.0061 18.1888 13.3496C17.2748 13.5715 16.8411 14.6187 17.3305 15.4219C18.0881 16.6652 16.6652 18.0881 15.4219 17.3305C14.6187 16.8411 13.5715 17.2748 13.3496 18.1888C13.0061 19.6037 10.9939 19.6037 10.6504 18.1888C10.4285 17.2748 9.38135 16.8411 8.57815 17.3305C7.33479 18.0881 5.91193 16.6652 6.66952 15.4219C7.15891 14.6187 6.72517 13.5715 5.81117 13.3496C4.39628 13.0061 4.39628 10.9939 5.81117 10.6504C6.72517 10.4285 7.15891 9.38134 6.66952 8.57815C5.91193 7.33479 7.33479 5.91192 8.57815 6.66952C9.38135 7.15891 10.4285 6.72517 10.6504 5.81117Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>

              <div className="hero-demo-toolbar-divider" />

              {/* X */}
              <div className="hero-demo-toolbar-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M16.25 16.25L7.75 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.75 16.25L16.25 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          </div>

          {/* Overlays - positioned relative to hero-demo-content */}

          {/* Highlight overlay for button */}
          <div
            className={`hero-demo-button-highlight ${showHighlight ? "visible" : ""}`}
            style={{ top: btnPos.y - 4, left: btnPos.x - 4, width: btnPos.width + 8, height: btnPos.height + 8 }}
          />

          {/* Drag selection box */}
          {dragBox.visible && (
            <div
              className="hero-demo-drag-box"
              style={{ left: dragBox.x, top: dragBox.y, width: dragBox.width, height: dragBox.height }}
            />
          )}

          {/* Area outline - stays visible after drag */}
          <div
            className={`hero-demo-area-outline ${areaOutline.visible ? "visible" : ""}`}
            style={{ left: areaOutline.x, top: areaOutline.y, width: areaOutline.width, height: areaOutline.height }}
          />

          {/* Existing markers */}
          <div className="hero-demo-marker visible" style={{ top: '52px', left: '104px' }}>
            1
          </div>
          <div className="hero-demo-marker visible" style={{ top: '105px', left: '224px' }}>
            2
          </div>

          {/* New marker - appears after annotation */}
          <div className={`hero-demo-marker ${showNewMarker ? "visible" : ""}`} style={{ top: btnPos.y + btnPos.height / 2, left: btnPos.x + btnPos.width / 2 }}>
            3
          </div>

          {/* Green marker for drag selection */}
          <div className={`hero-demo-marker green ${showGreenMarker ? "visible" : ""}`} style={{ top: greenMarkerPos.y, left: greenMarkerPos.x }}>
            4
          </div>

          {/* Text selection highlight */}
          {textSelection.visible && (
            <div
              className="hero-demo-text-selection"
              style={{ left: textSelection.x, top: textSelection.y, width: textSelection.width }}
            />
          )}

          {/* Orange marker for text selection */}
          <div className={`hero-demo-marker orange ${showOrangeMarker ? "visible" : ""}`} style={{ top: orangeMarkerPos.y, left: orangeMarkerPos.x }}>
            {isMobileView ? 3 : 5}
          </div>

          {/* Popup */}
          <div className={`hero-demo-popup ${showPopup ? "visible" : ""}`} style={{ left: popupPos.x, top: popupPos.y }}>
            <div className="hero-demo-popup-header">{popupHeader}</div>
            <div className="hero-demo-popup-input">
              {typedText}
              <span style={{ opacity: 0.4 }}>|</span>
            </div>
            <div className="hero-demo-popup-actions">
              <div className="hero-demo-popup-btn cancel">Cancel</div>
              <div className={`hero-demo-popup-btn submit ${popupHeader === "Sidebar icons" ? "green" : ""} ${popupHeader.startsWith('"') ? "orange" : ""}`}>Add</div>
            </div>
          </div>

          {/* Cursor */}
          <div
            className={`hero-demo-cursor ${isDragging ? 'dragging' : ''}`}
            style={{ left: cursorPos.x, top: cursorPos.y }}
          >
            <div className={`hero-demo-cursor-pointer ${isCrosshair || isIBeam ? 'hidden' : ''}`}>
              <svg height="24" width="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fillRule="evenodd" transform="translate(10 7)">
                  <path d="m6.148 18.473 1.863-1.003 1.615-.839-2.568-4.816h4.332l-11.379-11.408v16.015l3.316-3.221z" fill="#fff"/>
                  <path d="m6.431 17 1.765-.941-2.775-5.202h3.604l-8.025-8.043v11.188l2.53-2.442z" fill="#000"/>
                </g>
              </svg>
            </div>
            <div className={`hero-demo-cursor-crosshair ${isCrosshair && !isIBeam ? '' : 'hidden'}`}>
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <line x1="8.5" y1="0" x2="8.5" y2="17" stroke="black" strokeWidth="1"/>
                <line x1="0" y1="8.5" x2="17" y2="8.5" stroke="black" strokeWidth="1"/>
              </svg>
            </div>
            <div className={`hero-demo-cursor-ibeam ${isIBeam ? '' : 'hidden'}`}>
              <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                <path d="M3 1H7M3 15H7M5 1V15" stroke="black" strokeWidth="1" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal window - Ghostty style overlay */}
      <div className={`hero-demo-terminal ${showTerminal ? "visible" : ""}`}>
        <div className="hero-demo-terminal-bar">
          <div className="hero-demo-terminal-dot red" />
          <div className="hero-demo-terminal-dot yellow" />
          <div className="hero-demo-terminal-dot green" />
          <div className="hero-demo-terminal-title">Benji's Project</div>
        </div>
        <div className="hero-demo-terminal-content">
          <div className="hero-demo-terminal-welcome">
            {/* Claude Code welcome box - pixel-perfect recreation */}
            <svg viewBox="0 0 240 76" fill="none" style={{ width: '100%', height: 'auto', display: 'block' }}>
              {/* Orange box border */}
              <rect x="4" y="4" width="148" height="68" rx="3" stroke="#D97757" strokeWidth="1.5" fill="none" />

              {/* Title to the right of box */}
              <text x="160" y="16" fill="rgba(0,0,0,0.7)" fontSize="9" fontFamily="ui-monospace, SFMono-Regular, monospace" fontWeight="500">Claude Code</text>
              <text x="160" y="26" fill="rgba(0,0,0,0.4)" fontSize="7" fontFamily="ui-monospace, SFMono-Regular, monospace">v2.1.14</text>

              {/* Welcome text */}
              <text x="78" y="20" fill="rgba(0,0,0,0.6)" fontSize="8" fontFamily="ui-monospace, SFMono-Regular, monospace" textAnchor="middle">Welcome back Benji!</text>

              {/* Claude bot icon */}
              <g transform="translate(56, 26) scale(0.35)">
                <path d="M104.998 0H20.998V16.2H104.998V0Z" fill="#D77757"/>
                <path d="M34.998 16.1953H20.998V32.3953H34.998V16.1953Z" fill="#D77757"/>
                <rect x="35" y="14.7266" width="56" height="29.4545" fill="black"/>
                <path d="M84 14.7266H42V36.8175H84V14.7266Z" fill="#D77757"/>
                <path d="M105.002 16.1953H91.002V32.3953H105.002V16.1953Z" fill="#D77757"/>
                <path d="M119 32.4023H7V48.6023H119V32.4023Z" fill="#D77757"/>
                <path d="M104.998 48.5977H20.998V64.7977H104.998V48.5977Z" fill="#D77757"/>
                <path d="M35 64.8047H28V81.0047H35V64.8047Z" fill="#D77757"/>
                <path d="M49 64.8047H42V81.0047H49V64.8047Z" fill="#D77757"/>
                <path d="M84 64.8047H77V81.0047H84V64.8047Z" fill="#D77757"/>
                <path d="M98.002 64.8047H91.002V81.0047H98.002V64.8047Z" fill="#D77757"/>
              </g>

              {/* Bottom info */}
              <text x="78" y="62" fill="rgba(0,0,0,0.4)" fontSize="7" fontFamily="ui-monospace, SFMono-Regular, monospace" textAnchor="middle">Opus 4.5 · ~/Code/agentation</text>
            </svg>
          </div>
          {terminalText}
          <span style={{ opacity: 0.4 }}>█</span>
        </div>
      </div>
    </div>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
