export const AGENTATION_STYLES = String.raw`
:host {
  all: initial;
  position: fixed;
  inset: 0;
  z-index: 2147483646;
  pointer-events: none;
  color-scheme: light dark;
  --ag-bg: rgba(20, 20, 22, .96);
  --ag-panel: rgba(35, 35, 39, .98);
  --ag-fg: #f8fafc;
  --ag-muted: #a1a1aa;
  --ag-border: rgba(255, 255, 255, .14);
  --ag-accent: #60a5fa;
  --ag-danger: #f87171;
  --ag-shadow: 0 12px 38px rgba(0, 0, 0, .34);
  font: 13px/1.35 ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
*, *::before, *::after { box-sizing: border-box; }
button, input, textarea, select { font: inherit; }
button { color: inherit; }
.ag-toolbar {
  position: fixed;
  right: 18px;
  bottom: 18px;
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 42px;
  padding: 5px;
  border: 1px solid var(--ag-border);
  border-radius: 12px;
  background: var(--ag-bg);
  color: var(--ag-fg);
  box-shadow: var(--ag-shadow);
  pointer-events: auto;
  user-select: none;
}
.ag-toolbar[hidden], .ag-panel[hidden], .ag-popup[hidden] { display: none; }
.ag-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 9px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
}
.ag-btn:hover { background: rgba(255,255,255,.1); }
.ag-btn[aria-pressed="true"], .ag-btn[data-active="true"] { background: var(--ag-accent); color: #07111f; }
.ag-btn-danger:hover { background: rgba(248,113,113,.18); color: var(--ag-danger); }
.ag-count { min-width: 18px; padding: 1px 5px; border-radius: 999px; background: rgba(255,255,255,.13); font-size: 11px; text-align: center; }
.ag-divider { width: 1px; height: 22px; background: var(--ag-border); margin: 0 2px; }
.ag-hover {
  position: fixed;
  border: 2px solid var(--ag-accent);
  border-radius: 4px;
  background: rgba(96,165,250,.08);
  pointer-events: none;
}
.ag-hover-label {
  position: absolute;
  left: -2px;
  bottom: calc(100% + 4px);
  max-width: 360px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 3px 6px;
  border-radius: 4px;
  background: var(--ag-accent);
  color: #07111f;
  font: 11px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace;
}
.ag-marker {
  position: fixed;
  width: 25px;
  height: 25px;
  transform: translate(-50%, -50%);
  border: 2px solid white;
  border-radius: 999px;
  background: var(--ag-accent);
  color: #07111f;
  box-shadow: 0 3px 10px rgba(0,0,0,.35);
  cursor: pointer;
  pointer-events: auto;
  font-weight: 700;
  font-size: 11px;
}
.ag-marker:hover { transform: translate(-50%, -50%) scale(1.12); }
.ag-popup, .ag-panel {
  position: fixed;
  width: min(360px, calc(100vw - 24px));
  padding: 12px;
  border: 1px solid var(--ag-border);
  border-radius: 12px;
  background: var(--ag-panel);
  color: var(--ag-fg);
  box-shadow: var(--ag-shadow);
  pointer-events: auto;
}
.ag-popup { z-index: 8; }
.ag-panel { right: 18px; bottom: 70px; max-height: min(70vh, 620px); overflow: auto; }
.ag-popup-title { margin: 0 0 8px; color: var(--ag-muted); font-size: 11px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ag-popup textarea { width: 100%; min-height: 88px; resize: vertical; border: 1px solid var(--ag-border); border-radius: 8px; padding: 8px; background: rgba(0,0,0,.22); color: var(--ag-fg); outline: none; }
.ag-popup textarea:focus { border-color: var(--ag-accent); }
.ag-actions { display: flex; justify-content: flex-end; gap: 6px; margin-top: 8px; }
.ag-field { display: grid; gap: 4px; margin: 10px 0; color: var(--ag-muted); font-size: 11px; }
.ag-field input, .ag-field select { width: 100%; padding: 7px 8px; border: 1px solid var(--ag-border); border-radius: 7px; background: rgba(0,0,0,.22); color: var(--ag-fg); }
.ag-check { display: flex; align-items: center; gap: 8px; margin: 9px 0; cursor: pointer; }
.ag-check input { accent-color: var(--ag-accent); }
.ag-section-title { margin: 10px 0 6px; color: var(--ag-muted); font-size: 10px; text-transform: uppercase; letter-spacing: .08em; }
.ag-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 5px; }
.ag-chip { padding: 7px 5px; border: 1px solid var(--ag-border); border-radius: 7px; background: transparent; color: var(--ag-fg); cursor: pointer; overflow: hidden; text-overflow: ellipsis; }
.ag-chip:hover, .ag-chip[data-active="true"] { border-color: var(--ag-accent); background: rgba(96,165,250,.13); }
.ag-selection-rect { position: fixed; border: 1px dashed var(--ag-accent); background: rgba(96,165,250,.12); pointer-events: none; }
.ag-canvas { position: fixed; inset: 0; width: 100vw; height: 100vh; pointer-events: auto; cursor: crosshair; }
.ag-canvas[data-passive="true"] { pointer-events: none; }
.ag-blank { position: fixed; inset: 0; background: #f5f5f4; pointer-events: none; }
.ag-placement, .ag-rearrange {
  position: fixed;
  border: 2px solid var(--ag-accent);
  border-radius: 7px;
  background: rgba(96,165,250,.13);
  color: #0f172a;
  pointer-events: auto;
  cursor: move;
  overflow: visible;
}
.ag-placement-label, .ag-rearrange-label { position: absolute; left: 4px; top: 3px; padding: 2px 5px; border-radius: 4px; background: var(--ag-accent); color: #07111f; font-size: 10px; }
.ag-delete { position: absolute; right: -9px; top: -9px; width: 20px; height: 20px; border: 0; border-radius: 999px; background: var(--ag-danger); color: white; cursor: pointer; }
.ag-resize { position: absolute; right: -5px; bottom: -5px; width: 12px; height: 12px; border: 2px solid white; border-radius: 3px; background: var(--ag-accent); cursor: nwse-resize; }
.ag-purpose { width: 100%; margin-bottom: 8px; padding: 7px 8px; border: 1px solid var(--ag-border); border-radius: 7px; background: rgba(0,0,0,.22); color: var(--ag-fg); }
.ag-status { color: var(--ag-muted); font-size: 11px; padding: 0 4px; }
.ag-toast { position: fixed; left: 50%; bottom: 78px; transform: translateX(-50%); padding: 8px 12px; border-radius: 8px; background: var(--ag-bg); color: var(--ag-fg); box-shadow: var(--ag-shadow); pointer-events: none; }
@media (prefers-color-scheme: light) {
  :host { --ag-bg: rgba(255,255,255,.97); --ag-panel: rgba(255,255,255,.99); --ag-fg: #18181b; --ag-muted: #71717a; --ag-border: rgba(0,0,0,.14); }
}
@media (max-width: 720px) { .ag-toolbar { display: none; } }
`;
