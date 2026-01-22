import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { loadAnnotations } from "../shared/storage";
import "./popup.css";

function Popup() {
  const [annotationCount, setAnnotationCount] = useState(0);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get current tab and load annotations
    chrome.tabs.query({ active: true, currentWindow: true }).then(async ([tab]) => {
      if (tab?.url) {
        setCurrentUrl(tab.url);
        const annotations = await loadAnnotations(tab.url);
        setAnnotationCount(annotations.length);
      }
      setIsLoading(false);
    });
  }, []);

  const handleToggle = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_TOOLBAR" });
      window.close();
    }
  };

  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  const hostname = currentUrl ? new URL(currentUrl).hostname : "";

  return (
    <div className="popup">
      <div className="popup-header">
        <div className="popup-brand">
          <span className="popup-brand-slash">/</span>
          agentation
        </div>
        <span className="popup-version">v1.0.0</span>
      </div>

      <div className="popup-content">
        {isLoading ? (
          <div className="popup-loading">Loading...</div>
        ) : (
          <>
            <div className="popup-site">
              <span className="popup-site-label">Current site:</span>
              <span className="popup-site-hostname">{hostname || "N/A"}</span>
            </div>

            <div className="popup-stats">
              <div className="popup-stat">
                <span className="popup-stat-value">{annotationCount}</span>
                <span className="popup-stat-label">annotation{annotationCount !== 1 ? "s" : ""}</span>
              </div>
            </div>

            <button className="popup-button popup-button-primary" onClick={handleToggle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M11.5 12L5.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 6.75L5.5 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.25 17.25L5.5 17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 12.75L16.5179 13.9677C16.8078 14.6494 17.3506 15.1922 18.0323 15.4821L19.25 16L18.0323 16.5179C17.3506 16.8078 16.8078 17.3506 16.5179 18.0323L16 19.25L15.4821 18.0323C15.1922 17.3506 14.6494 16.8078 13.9677 16.5179L12.75 16L13.9677 15.4821C14.6494 15.1922 15.1922 14.6494 15.4821 13.9677L16 12.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              Toggle Toolbar
            </button>

            <div className="popup-shortcut">
              <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd>
            </div>
          </>
        )}
      </div>

      <div className="popup-footer">
        <button className="popup-link" onClick={handleOpenOptions}>
          Options
        </button>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
