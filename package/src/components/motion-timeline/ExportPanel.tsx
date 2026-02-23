"use client";

import React, { useState, useCallback } from "react";
import type { TaggedElement, ExportFormat } from "../../utils/motion-types";
import { exportAnimation } from "../../utils/animation-export";
import { IconCopyAnimated, IconXmark } from "../icons";
import styles from "./styles.module.scss";

// =============================================================================
// ExportPanel
// =============================================================================
// Dropdown popup above the Export button.
// Lets users switch between CSS / WAAPI / Framer Motion / GSAP and copy code.
// =============================================================================

const FORMAT_LABELS: Array<{ id: ExportFormat; label: string }> = [
  { id: "css", label: "CSS" },
  { id: "waapi", label: "WAAPI" },
  { id: "framer-motion", label: "Framer Motion" },
  { id: "gsap", label: "GSAP" },
];

interface ExportPanelProps {
  elements: TaggedElement[];
  onClose: () => void;
}

export function ExportPanel({ elements, onClose }: ExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>("css");
  const [copied, setCopied] = useState(false);

  const code = exportAnimation(elements, format);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  return (
    <div className={styles.exportPanel} data-feedback-toolbar>
      <div className={styles.exportHeader}>
        {/* Format tabs */}
        <div className={styles.exportFormatTabs}>
          {FORMAT_LABELS.map(({ id, label }) => (
            <button
              key={id}
              className={`${styles.exportFormatTab} ${format === id ? styles.active : ""}`}
              onClick={() => setFormat(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.spacer} />

        {/* Close */}
        <button
          className={styles.controlBtn}
          onClick={onClose}
          title="Close export panel"
          aria-label="Close"
        >
          <IconXmark size={14} />
        </button>
      </div>

      {/* Code area */}
      <pre className={styles.exportCode}>{code}</pre>

      {/* Footer */}
      <div className={styles.exportFooter}>
        <button className={styles.copyBtn} onClick={handleCopy}>
          <IconCopyAnimated size={13} copied={copied} />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
