import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { loadSettings, saveSettings, exportAllData, importData, clearAllData, getAllAnnotations } from "../shared/storage";
import type { Settings, ExportData } from "../shared/types";
import { DEFAULT_SETTINGS, ACCENT_COLORS } from "../shared/types";
import "./options.css";

function Options() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [totalAnnotations, setTotalAnnotations] = useState(0);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    loadSettings().then(setSettings);

    getAllAnnotations().then(annotations => {
      const total = Object.values(annotations).reduce((sum, arr) => sum + arr.length, 0);
      setTotalAnnotations(total);
    });
  }, []);

  const handleSettingChange = async (key: keyof Settings, value: unknown) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveSettings(newSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const dateStr = new Date().toISOString().split("T")[0];
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
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setImporting(true);
      try {
        const text = await file.text();
        const data: ExportData = JSON.parse(text);
        await importData(data);

        const newSettings = await loadSettings();
        setSettings(newSettings);

        const annotations = await getAllAnnotations();
        const total = Object.values(annotations).reduce((sum, arr) => sum + arr.length, 0);
        setTotalAnnotations(total);
      } catch (e) {
        console.error("Import failed:", e);
        alert("Failed to import data. Please check the file format.");
      }
      setImporting(false);
    };
    input.click();
  };

  const handleClearAll = async () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }

    await clearAllData();
    setTotalAnnotations(0);
    setSettings(DEFAULT_SETTINGS);
    setConfirmClear(false);
  };

  return (
    <div className="options">
      <div className="options-container">
        <header className="options-header">
          <h1 className="options-title">
            <span className="options-title-slash">/</span>
            agentation
          </h1>
          <p className="options-subtitle">Settings and Data Management</p>
        </header>

        <section className="options-section">
          <h2 className="options-section-title">General Settings</h2>

          <div className="options-field">
            <label className="options-label">Default Output Detail</label>
            <select
              className="options-select"
              value={settings.outputDetailLevel}
              onChange={e => handleSettingChange("outputDetailLevel", e.target.value)}
            >
              <option value="compact">Compact</option>
              <option value="standard">Standard</option>
              <option value="detailed">Detailed</option>
              <option value="forensic">Forensic</option>
            </select>
          </div>

          <div className="options-field">
            <label className="options-label">Default Accent Color</label>
            <div className="options-colors">
              {ACCENT_COLORS.map(color => (
                <button
                  key={color}
                  className={`options-color ${settings.accentColor === color ? "selected" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleSettingChange("accentColor", color)}
                />
              ))}
            </div>
          </div>

          <div className="options-field">
            <label className="options-checkbox">
              <input
                type="checkbox"
                checked={settings.autoClear}
                onChange={e => handleSettingChange("autoClear", e.target.checked)}
              />
              <span>Auto-clear annotations after copying</span>
            </label>
          </div>

          <div className="options-field">
            <label className="options-label">Theme</label>
            <select
              className="options-select"
              value={String(settings.darkMode)}
              onChange={e => {
                const value = e.target.value;
                handleSettingChange("darkMode", value === "system" ? "system" : value === "true");
              }}
            >
              <option value="system">System</option>
              <option value="true">Dark</option>
              <option value="false">Light</option>
            </select>
          </div>

          {saved && <div className="options-saved">Settings saved!</div>}
        </section>

        <section className="options-section">
          <h2 className="options-section-title">Data Management</h2>

          <div className="options-stats">
            <div className="options-stat">
              <span className="options-stat-value">{totalAnnotations}</span>
              <span className="options-stat-label">Total Annotations</span>
            </div>
          </div>

          <div className="options-actions">
            <button
              className="options-button"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? "Exporting..." : "Export All Data"}
            </button>

            <button
              className="options-button"
              onClick={handleImport}
              disabled={importing}
            >
              {importing ? "Importing..." : "Import Data"}
            </button>

            <button
              className={`options-button options-button-danger ${confirmClear ? "confirm" : ""}`}
              onClick={handleClearAll}
            >
              {confirmClear ? "Click again to confirm" : "Clear All Data"}
            </button>
          </div>
        </section>

        <footer className="options-footer">
          <p>Agentation v1.0.0</p>
          <p>
            <a href="https://agentation.dev" target="_blank" rel="noopener noreferrer">
              agentation.dev
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
