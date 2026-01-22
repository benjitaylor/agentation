import './chunks/modulepreload-polyfill-DTsWB9Rp.js';
import { c as createRoot, j as jsxRuntimeExports, R as React, r as reactExports } from './chunks/client-DJHG-Y1K.js';
import { l as loadAnnotations } from './chunks/storage-BlbiK-hs.js';

function Popup() {
  const [annotationCount, setAnnotationCount] = reactExports.useState(0);
  const [currentUrl, setCurrentUrl] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup-brand", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "popup-brand-slash", children: "/" }),
        "agentation"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "popup-version", children: "v1.0.0" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "popup-content", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "popup-loading", children: "Loading..." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup-site", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "popup-site-label", children: "Current site:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "popup-site-hostname", children: hostname || "N/A" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "popup-stats", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup-stat", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "popup-stat-value", children: annotationCount }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "popup-stat-label", children: [
          "annotation",
          annotationCount !== 1 ? "s" : ""
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "popup-button popup-button-primary", onClick: handleToggle, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M11.5 12L5.5 12", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18.5 6.75L5.5 6.75", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9.25 17.25L5.5 17.25", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 12.75L16.5179 13.9677C16.8078 14.6494 17.3506 15.1922 18.0323 15.4821L19.25 16L18.0323 16.5179C17.3506 16.8078 16.8078 17.3506 16.5179 18.0323L16 19.25L15.4821 18.0323C15.1922 17.3506 14.6494 16.8078 13.9677 16.5179L12.75 16L13.9677 15.4821C14.6494 15.1922 15.1922 14.6494 15.4821 13.9677L16 12.75Z", stroke: "currentColor", strokeWidth: "1.5", strokeLinejoin: "round" })
        ] }),
        "Toggle Toolbar"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "popup-shortcut", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "Ctrl" }),
        " + ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "Shift" }),
        " + ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "A" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "popup-footer", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "popup-link", onClick: handleOpenOptions, children: "Options" }) })
  ] });
}
const root = createRoot(document.getElementById("root"));
root.render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Popup, {}) })
);
