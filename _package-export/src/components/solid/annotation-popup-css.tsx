import { createSignal, createEffect, onCleanup, onMount, type JSX } from "solid-js";
import styles from "../annotation-popup-css/styles.module.scss";

// =============================================================================
// Types
// =============================================================================

export interface AnnotationPopupCSSProps {
  /** Element name to display in header */
  element: string;
  /** Optional timestamp display (e.g., "@ 1.23s" for animation feedback) */
  timestamp?: string;
  /** Optional selected/highlighted text */
  selectedText?: string;
  /** Placeholder text for the textarea */
  placeholder?: string;
  /** Initial value for textarea (for edit mode) */
  initialValue?: string;
  /** Label for submit button (default: "Add") */
  submitLabel?: string;
  /** Called when annotation is submitted with text */
  onSubmit: (text: string) => void;
  /** Called when popup is cancelled/dismissed */
  onCancel: () => void;
  /** Position styles (left, top) */
  style?: JSX.CSSProperties;
  /** Custom color for submit button and textarea focus (hex) */
  accentColor?: string;
  /** External exit state (parent controls exit animation) */
  isExiting?: boolean;
  /** Light mode styling */
  lightMode?: boolean;
  /** Ref callback to expose imperative handle */
  ref?: (handle: AnnotationPopupCSSHandle) => void;
}

export interface AnnotationPopupCSSHandle {
  /** Shake the popup (e.g., when user clicks outside) */
  shake: () => void;
}

// =============================================================================
// Component
// =============================================================================

export function AnnotationPopupCSS(props: AnnotationPopupCSSProps) {
  const [text, setText] = createSignal(props.initialValue ?? "");
  const [isShaking, setIsShaking] = createSignal(false);
  const [animState, setAnimState] = createSignal<"initial" | "enter" | "entered" | "exit">("initial");
  const [isFocused, setIsFocused] = createSignal(false);

  let textareaRef: HTMLTextAreaElement | undefined;
  let popupRef: HTMLDivElement | undefined;

  // Shake animation
  const shake = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      textareaRef?.focus();
    }, 250);
  };

  // Expose shake to parent via ref callback
  onMount(() => {
    props.ref?.({ shake });
  });

  // Sync with parent exit state
  createEffect(() => {
    if (props.isExiting && animState() !== "exit") {
      setAnimState("exit");
    }
  });

  // Animate in on mount and focus textarea
  onMount(() => {
    // Start enter animation
    requestAnimationFrame(() => {
      setAnimState("enter");
    });
    // Transition to entered state after animation completes
    const enterTimer = setTimeout(() => {
      setAnimState("entered");
    }, 200); // Match animation duration
    const focusTimer = setTimeout(() => {
      if (textareaRef) {
        textareaRef.focus();
        textareaRef.selectionStart = textareaRef.selectionEnd = textareaRef.value.length;
        textareaRef.scrollTop = textareaRef.scrollHeight;
      }
    }, 50);

    onCleanup(() => {
      clearTimeout(enterTimer);
      clearTimeout(focusTimer);
    });
  });

  // Handle cancel with exit animation
  const handleCancel = () => {
    setAnimState("exit");
    setTimeout(() => {
      props.onCancel();
    }, 150); // Match exit animation duration
  };

  // Handle submit
  const handleSubmit = () => {
    if (!text().trim()) return;
    props.onSubmit(text().trim());
  };

  // Handle keyboard
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  const popupClassName = () => [
    styles.popup,
    props.lightMode ? styles.light : "",
    animState() === "enter" ? styles.enter : "",
    animState() === "entered" ? styles.entered : "",
    animState() === "exit" ? styles.exit : "",
    isShaking() ? styles.shake : "",
  ].filter(Boolean).join(" ");

  return (
    <div
      ref={(el) => popupRef = el}
      class={popupClassName()}
      data-annotation-popup
      style={props.style}
      onClick={(e) => e.stopPropagation()}
    >
      <div class={styles.header}>
        <span class={styles.element}>{props.element}</span>
        {props.timestamp && <span class={styles.timestamp}>{props.timestamp}</span>}
      </div>

      {props.selectedText && (
        <div class={styles.quote}>
          &ldquo;{props.selectedText.slice(0, 80)}
          {props.selectedText.length > 80 ? "..." : ""}&rdquo;
        </div>
      )}

      <textarea
        ref={(el) => textareaRef = el}
        class={styles.textarea}
        style={{ "border-color": isFocused() ? (props.accentColor ?? "#3c82f7") : undefined }}
        placeholder={props.placeholder ?? "What should change?"}
        value={text()}
        onInput={(e) => setText(e.currentTarget.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        rows={2}
        onKeyDown={handleKeyDown}
      />

      <div class={styles.actions}>
        <button class={styles.cancel} onClick={handleCancel}>
          Cancel
        </button>
        <button
          class={styles.submit}
          style={{
            "background-color": props.accentColor ?? "#3c82f7",
            opacity: text().trim() ? 1 : 0.4,
          }}
          onClick={handleSubmit}
          disabled={!text().trim()}
        >
          {props.submitLabel ?? "Add"}
        </button>
      </div>
    </div>
  );
}

export default AnnotationPopupCSS;
