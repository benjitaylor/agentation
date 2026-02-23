"use client";

import React, { useCallback } from "react";
import type { TaggedElement, Phase, PhaseKind, SelectedPhase } from "../../utils/motion-types";
import { EasingEditor } from "./EasingEditor";
import { IconPlus, IconXmark } from "../icons";
import styles from "./styles.module.scss";

// =============================================================================
// PropertiesPanel
// =============================================================================
// Right sidebar showing properties for the currently selected phase.
// Tabs: ENTER / IDLE / EXIT
// =============================================================================

const EASING_PRESETS = ["ease", "ease-in", "ease-out", "ease-in-out", "linear"];

interface PropertiesPanelProps {
  element: TaggedElement | null;
  selectedPhase: SelectedPhase | null;
  onUpdatePhase: (elementId: string, phase: PhaseKind, updates: Partial<Phase>) => void;
  onSelectPhase: (phase: PhaseKind) => void;
}

export function PropertiesPanel({
  element,
  selectedPhase,
  onUpdatePhase,
  onSelectPhase,
}: PropertiesPanelProps) {
  const activePhaseKind: PhaseKind = selectedPhase?.phase ?? "enter";
  const phase: Phase | null = element
    ? element[activePhaseKind]
    : null;

  const update = useCallback(
    (updates: Partial<Phase>) => {
      if (!element) return;
      onUpdatePhase(element.id, activePhaseKind, updates);
    },
    [element, activePhaseKind, onUpdatePhase]
  );

  // ── Keyframe helpers ────────────────────────────────────────────────────────

  function updateKeyframeProp(
    frameIndex: number,
    prop: string,
    value: string,
    isKey: boolean
  ) {
    if (!phase) return;
    const newKeyframes = phase.keyframes.map((kf, i) => {
      if (i !== frameIndex) return kf;
      // isKey=true means we're renaming the property key
      if (isKey) {
        const newKf: Keyframe = {};
        for (const [k, v] of Object.entries(kf)) {
          if (k === "offset") {
            newKf.offset = kf.offset;
          } else {
            // Replace old key with new key
            newKf[value as keyof Keyframe] = v as string;
          }
        }
        return newKf;
      } else {
        return { ...kf, [prop]: value };
      }
    });
    update({ keyframes: newKeyframes });
  }

  function removeKeyframeProp(frameIndex: number, prop: string) {
    if (!phase) return;
    const newKeyframes = phase.keyframes.map((kf, i) => {
      if (i !== frameIndex) return kf;
      const copy = { ...kf };
      delete (copy as Record<string, unknown>)[prop];
      return copy;
    });
    update({ keyframes: newKeyframes });
  }

  function addKeyframe() {
    if (!phase) return;
    const newKf: Keyframe = { opacity: "1" };
    update({ keyframes: [...phase.keyframes, newKf] });
  }

  if (!element) {
    return (
      <aside className={styles.propertiesPanel} data-feedback-toolbar>
        <div className={styles.propertiesHeader}>Properties</div>
        <div className={styles.emptyState}>
          <span className={styles.emptyStateText}>Select a phase block to edit</span>
        </div>
      </aside>
    );
  }

  const tabs: PhaseKind[] = ["enter", "idle", "exit"];

  return (
    <aside className={styles.propertiesPanel} data-feedback-toolbar>
      <div className={styles.propertiesHeader}>Properties</div>

      {/* Phase tabs */}
      <div className={styles.phaseTabRow}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.phaseTab} ${activePhaseKind === tab ? styles.active : ""}`}
            onClick={() => onSelectPhase(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {phase && (
        <div className={styles.propsSections}>
          {/* Enable toggle */}
          <label className={styles.propToggle}>
            <input
              type="checkbox"
              checked={phase.enabled}
              onChange={(e) => update({ enabled: e.target.checked })}
            />
            <span>Enabled</span>
          </label>

          {/* Duration */}
          <div className={styles.propRow}>
            <span className={styles.propLabel}>Duration</span>
            <input
              type="number"
              className={styles.propInput}
              value={phase.duration}
              min={0}
              step={50}
              onChange={(e) => update({ duration: Math.max(0, parseInt(e.target.value, 10) || 0) })}
            />
            <span className={styles.propUnit}>ms</span>
          </div>

          {/* Delay */}
          <div className={styles.propRow}>
            <span className={styles.propLabel}>Delay</span>
            <input
              type="number"
              className={styles.propInput}
              value={phase.delay}
              min={0}
              step={50}
              onChange={(e) => update({ delay: Math.max(0, parseInt(e.target.value, 10) || 0) })}
            />
            <span className={styles.propUnit}>ms</span>
          </div>

          {/* Easing */}
          <div className={styles.propSection}>
            <div className={styles.propRow}>
              <span className={styles.propLabel}>Easing</span>
              <input
                type="text"
                className={`${styles.propInput} ${styles.wide}`}
                value={phase.easing}
                onChange={(e) => update({ easing: e.target.value })}
              />
            </div>
            {/* Easing presets */}
            <div className={styles.easingPresets}>
              {EASING_PRESETS.map((preset) => (
                <button
                  key={preset}
                  className={`${styles.easingPreset} ${phase.easing === preset ? styles.active : ""}`}
                  onClick={() => update({ easing: preset })}
                >
                  {preset}
                </button>
              ))}
            </div>
            {/* Easing visualizer */}
            <EasingEditor value={phase.easing} />
          </div>

          {/* Iterations (idle only) */}
          {activePhaseKind === "idle" && (
            <div className={styles.propRow}>
              <span className={styles.propLabel}>Repeat</span>
              <input
                type="text"
                className={styles.propInput}
                value={phase.iterations === "infinite" ? "∞" : String(phase.iterations)}
                onChange={(e) => {
                  const v = e.target.value.trim();
                  if (v === "∞" || v === "infinite") {
                    update({ iterations: "infinite" });
                  } else {
                    const n = parseInt(v, 10);
                    if (!isNaN(n) && n > 0) update({ iterations: n });
                  }
                }}
              />
            </div>
          )}

          {/* Direction (idle only) */}
          {activePhaseKind === "idle" && (
            <div className={styles.propRow}>
              <span className={styles.propLabel}>Direction</span>
              <select
                className={`${styles.propInput} ${styles.wide}`}
                value={phase.direction}
                onChange={(e) =>
                  update({ direction: e.target.value as Phase["direction"] })
                }
              >
                <option value="normal">normal</option>
                <option value="alternate">alternate</option>
                <option value="reverse">reverse</option>
                <option value="alternate-reverse">alternate-reverse</option>
              </select>
            </div>
          )}

          {/* Keyframes editor */}
          <div className={styles.propSection}>
            <span className={styles.propSectionLabel}>Keyframes</span>
            <div className={styles.keyframesSection}>
              {phase.keyframes.map((kf, frameIndex) => {
                const frameLabel =
                  frameIndex === 0
                    ? "from"
                    : frameIndex === phase.keyframes.length - 1
                    ? "to"
                    : `${Math.round((frameIndex / (phase.keyframes.length - 1)) * 100)}%`;

                // Get all props except "offset"
                const props = Object.entries(kf).filter(([k]) => k !== "offset");

                return (
                  <div key={frameIndex}>
                    <div
                      style={{
                        fontSize: "9px",
                        color: "rgba(255,255,255,0.3)",
                        fontFamily: "monospace",
                        marginBottom: 2,
                      }}
                    >
                      {frameLabel}
                    </div>
                    {props.map(([propKey, propVal]) => (
                      <div key={propKey} className={styles.keyframeRow}>
                        <input
                          type="text"
                          className={styles.keyframePropInput}
                          value={propKey}
                          onChange={(e) =>
                            updateKeyframeProp(frameIndex, propKey, e.target.value, true)
                          }
                          placeholder="property"
                        />
                        <input
                          type="text"
                          className={styles.keyframeValueInput}
                          value={String(propVal ?? "")}
                          onChange={(e) =>
                            updateKeyframeProp(frameIndex, propKey, e.target.value, false)
                          }
                          placeholder="value"
                        />
                        <button
                          className={styles.removeKeyframeBtn}
                          onClick={() => removeKeyframeProp(frameIndex, propKey)}
                          title="Remove property"
                        >
                          <IconXmark size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            <button className={styles.addKeyframeBtn} onClick={addKeyframe}>
              <IconPlus size={10} />
              Add keyframe
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
