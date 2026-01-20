"use client";

import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import styles from "./styles.module.scss";

// =============================================================================
// Types
// =============================================================================

export interface AnnotationPopupProps {
  /** Element name to display in header */
  element: string;
  /** Optional timestamp display (e.g., "@ 1.23s" for animation feedback) */
  timestamp?: string;
  /** Optional selected/highlighted text */
  selectedText?: string;
  /** Placeholder text for the textarea */
  placeholder?: string;
  /** Called when annotation is submitted with text */
  onSubmit: (text: string) => void;
  /** Called when popup is cancelled/dismissed */
  onCancel: () => void;
  /** Position styles (left, top) */
  style?: React.CSSProperties;
  /** Color variant for submit button */
  variant?: "blue" | "green";
}

export interface AnnotationPopupHandle {
  /** Shake the popup (e.g., when user clicks outside) */
  shake: () => void;
}

// =============================================================================
// Component
// =============================================================================

export const AnnotationPopup = forwardRef<AnnotationPopupHandle, AnnotationPopupProps>(
  function AnnotationPopup(
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
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const controls = useAnimation();

    // Animate in on mount and focus textarea
    useEffect(() => {
      controls.start({ opacity: 1, scale: 1, y: 0 });
      const timer = setTimeout(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
          textarea.scrollTop = textarea.scrollHeight;
        }
      }, 10);
      return () => clearTimeout(timer);
    }, [controls]);

    // Shake animation - subtle shake for the popup container
    const shake = useCallback(async () => {
      await controls.start({
        x: [0, -3, 3, -2, 2, 0],
        transition: { duration: 0.25, ease: "easeOut" },
      });
      textareaRef.current?.focus();
    }, [controls]);

    // Expose shake to parent via ref (for click-outside behavior)
    useImperativeHandle(ref, () => ({
      shake,
    }), [shake]);

    // Handle submit - only submits if there's text
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
          // Escape always closes
          onCancel();
        }
      },
      [handleSubmit, onCancel]
    );

    return (
      <motion.div
        className={styles.popup}
        data-annotation-popup
        initial={{ opacity: 0, scale: 0.95, y: 4 }}
        animate={controls}
        exit={{ opacity: 0, scale: 0.95, y: 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
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
          className={`${styles.textarea} ${variant === "green" ? styles.green : ""}`}
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
      </motion.div>
    );
  }
);

// =============================================================================
// Wrapper for AnimatePresence (convenience export)
// =============================================================================

export function AnnotationPopupPresence({
  isOpen,
  ...props
}: AnnotationPopupProps & { isOpen: boolean }) {
  return (
    <AnimatePresence>
      {isOpen && <AnnotationPopup {...props} />}
    </AnimatePresence>
  );
}

export default AnnotationPopup;
