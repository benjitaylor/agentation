import './chunks/modulepreload-polyfill-DTsWB9Rp.js';
import { c as createRoot, j as jsxRuntimeExports, R as React, r as reactExports } from './chunks/client-DJHG-Y1K.js';
import { D as DEFAULT_SETTINGS, d as loadSettings, f as getAllAnnotations, A as ACCENT_COLORS, b as saveSettings, e as exportAllData, i as importData, c as clearAllData } from './chunks/storage-BlbiK-hs.js';

function Options() {
  const [settings, setSettings] = reactExports.useState(DEFAULT_SETTINGS);
  const [totalAnnotations, setTotalAnnotations] = reactExports.useState(0);
  const [saved, setSaved] = reactExports.useState(false);
  const [exporting, setExporting] = reactExports.useState(false);
  const [importing, setImporting] = reactExports.useState(false);
  const [confirmClear, setConfirmClear] = reactExports.useState(false);
  reactExports.useEffect(() => {
    loadSettings().then(setSettings);
    getAllAnnotations().then((annotations) => {
      const total = Object.values(annotations).reduce((sum, arr) => sum + arr.length, 0);
      setTotalAnnotations(total);
    });
  }, []);
  const handleSettingChange = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveSettings(newSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2e3);
  };
  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const dateStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      a.download = `agentation-export-${dateStr}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed:", e);
    }
    setExporting(false);
  };
  const handleImport = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setImporting(true);
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        await importData(data);
        const newSettings = await loadSettings();
        setSettings(newSettings);
        const annotations = await getAllAnnotations();
        const total = Object.values(annotations).reduce((sum, arr) => sum + arr.length, 0);
        setTotalAnnotations(total);
      } catch (e2) {
        console.error("Import failed:", e2);
        alert("Failed to import data. Please check the file format.");
      }
      setImporting(false);
    };
    input.click();
  };
  const handleClearAll = async () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3e3);
      return;
    }
    await clearAllData();
    setTotalAnnotations(0);
    setSettings(DEFAULT_SETTINGS);
    setConfirmClear(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "options", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "options-container", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "options-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "options-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "options-title-slash", children: "/" }),
        "agentation"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "options-subtitle", children: "Settings and Data Management" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "options-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "options-section-title", children: "General Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "options-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "options-label", children: "Default Output Detail" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            className: "options-select",
            value: settings.outputDetailLevel,
            onChange: (e) => handleSettingChange("outputDetailLevel", e.target.value),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "compact", children: "Compact" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "standard", children: "Standard" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "detailed", children: "Detailed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "forensic", children: "Forensic" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "options-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "options-label", children: "Default Accent Color" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "options-colors", children: ACCENT_COLORS.map((color) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `options-color ${settings.accentColor === color ? "selected" : ""}`,
            style: { backgroundColor: color },
            onClick: () => handleSettingChange("accentColor", color)
          },
          color
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "options-field", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "options-checkbox", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: settings.autoClear,
            onChange: (e) => handleSettingChange("autoClear", e.target.checked)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Auto-clear annotations after copying" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "options-field", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "options-label", children: "Theme" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            className: "options-select",
            value: String(settings.darkMode),
            onChange: (e) => {
              const value = e.target.value;
              handleSettingChange("darkMode", value === "system" ? "system" : value === "true");
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "system", children: "System" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "true", children: "Dark" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "false", children: "Light" })
            ]
          }
        )
      ] }),
      saved && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "options-saved", children: "Settings saved!" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "options-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "options-section-title", children: "Data Management" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "options-stats", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "options-stat", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "options-stat-value", children: totalAnnotations }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "options-stat-label", children: "Total Annotations" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "options-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "options-button",
            onClick: handleExport,
            disabled: exporting,
            children: exporting ? "Exporting..." : "Export All Data"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "options-button",
            onClick: handleImport,
            disabled: importing,
            children: importing ? "Importing..." : "Import Data"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `options-button options-button-danger ${confirmClear ? "confirm" : ""}`,
            onClick: handleClearAll,
            children: confirmClear ? "Click again to confirm" : "Clear All Data"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "options-footer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Agentation v1.0.0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://agentation.dev", target: "_blank", rel: "noopener noreferrer", children: "agentation.dev" }) })
    ] })
  ] }) });
}
const root = createRoot(document.getElementById("root"));
root.render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Options, {}) })
);
