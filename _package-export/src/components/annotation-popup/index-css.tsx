"use client";

import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import styles from "./styles.module.scss";

// =============================================================================
// CSS Animation Styles (injected once)
// =============================================================================

const cssAnimationStyles = `
@keyframes agentation-popup-in {
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.95) translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1) translateY(0);
  }
}

@keyframes agentation-popup-shake {
  0%, 100% { transform: translateX(-50%) translateX(0); }
  20% { transform: translateX(-50%) translateX(-3px); }
  40% { transform: translateX(-50%) translateX(3px); }
  60% { transform: translateX(-50%) translateX(-2px); }
  80% { transform: translateX(-50%) translateX(2px); }
}

.agentation-popup-animate-in {
  animation: agentation-popup-in 0.2s ease-out forwards;
}

.agentation-popup-shake {
  animation: agentation-popup-shake 0.25s ease-out;
}
`;

// Inject styles once
if (typeof document !== "undefined") {
  if (!document.getElementById("agentation-popup-css-animations")) {
    const style = document.createElement("style");
    style.id = "agentation-popup-css-animations";
    style.textContent = cssAnimationStyles;
    document.head.appendChild(style);
  }
}

// =============================================================================
// Types
// =============================================================================

export interface AnnotationPopupProps {
  element: string;
  timestamp?: string;
  selectedText?: string;
  placeholder?: string;
  onSubmit: (text: string) => void;
  onCancel: () => void;
  style?: React.CSSProperties;
  variant?: "blue" | "green";
}

export interface AnnotationPopupHandle {
  shake: () => void;
}

// =============================================================================
// Component
// =============================================================================

export const AnnotationPopupCSS = forwardRef<AnnotationPopupHandle, AnnotationPopupProps>(
  function AnnotationPopupCSS(
    {
      element,
      timestamp,
      selectedText,
      placeholder = "What should change?",
      onSubmit,
      onCancel,
      style,
      variant = "blue",
    },
    ref
  ) {
    const [text, setText] = useState("");
    const [isShaking, setIsShaking] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Focus textarea on mount
    useEffect(() => {
      const timer = setTimeout(() => textareaRef.current?.focus(), 10);
      return () => clearTimeout(timer);
    }, []);

    // Shake animation - subtle shake
    const shake = useCallback(() => {
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        textareaRef.current?.focus();
      }, 250);
    }, []);

    // Expose shake to parent
    useImperativeHandle(ref, () => ({ shake }), [shake]);

    // Handle submit
    const handleSubmit = useCallback(() => {
      if (!text.trim()) return;
      onSubmit(text.trim());
    }, [text, onSubmit]);

    // Handle keyboard
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
        if (e.key === "Escape") {
          onCancel();
        }
      },
      [handleSubmit, onCancel]
    );

    return (
      <div
        ref={containerRef}
        className={`${styles.popup} agentation-popup-animate-in ${isShaking ? "agentation-popup-shake" : ""}`}
        data-annotation-popup
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <span className={styles.element}>{element}</span>
          {timestamp && <span className={styles.timestamp}>{timestamp}</span>}
        </div>

        {selectedText && (
          <div className={styles.quote}>
            &ldquo;{selectedText.slice(0, 80)}
            {selectedText.length > 80 ? "..." : ""}&rdquo;
          </div>
        )}

        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          onKeyDown={handleKeyDown}
        />

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`${styles.submit} ${variant === "green" ? styles.green : ""}`}
            onClick={handleSubmit}
            disabled={!text.trim()}
          >
            Add
          </button>
        </div>
      </div>
    );
  }
);

export default AnnotationPopupCSS;
