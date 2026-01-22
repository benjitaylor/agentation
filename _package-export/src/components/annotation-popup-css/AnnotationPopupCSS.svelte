<script lang="ts">
  import { onMount } from 'svelte';
  import styles from './styles.module.scss';

  // =============================================================================
  // Types
  // =============================================================================

  interface Props {
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
    style?: string;
    /** Custom color for submit button and textarea focus (hex) */
    accentColor?: string;
    /** External exit state (parent controls exit animation) */
    isExiting?: boolean;
    /** Light mode styling */
    lightMode?: boolean;
  }

  let {
    element,
    timestamp,
    selectedText,
    placeholder = 'What should change?',
    initialValue = '',
    submitLabel = 'Add',
    onSubmit,
    onCancel,
    style = '',
    accentColor = '#3c82f7',
    isExiting = false,
    lightMode = false,
  }: Props = $props();

  // =============================================================================
  // State
  // =============================================================================

  let text = $state(initialValue);
  let isShaking = $state(false);
  let animState = $state<'initial' | 'enter' | 'entered' | 'exit'>('initial');
  let isFocused = $state(false);
  let textareaRef: HTMLTextAreaElement | null = $state(null);
  let popupRef: HTMLDivElement | null = $state(null);

  // =============================================================================
  // Derived
  // =============================================================================

  let popupClassName = $derived(
    [
      styles.popup,
      lightMode ? styles.light : '',
      animState === 'enter' ? styles.enter : '',
      animState === 'entered' ? styles.entered : '',
      animState === 'exit' ? styles.exit : '',
      isShaking ? styles.shake : '',
    ]
      .filter(Boolean)
      .join(' ')
  );

  // =============================================================================
  // Effects
  // =============================================================================

  // Sync with parent exit state
  $effect(() => {
    if (isExiting && animState !== 'exit') {
      animState = 'exit';
    }
  });

  // =============================================================================
  // Functions
  // =============================================================================

  // Shake animation - exposed for parent to call
  export function shake() {
    isShaking = true;
    setTimeout(() => {
      isShaking = false;
      textareaRef?.focus();
    }, 250);
  }

  // Handle cancel with exit animation
  function handleCancel() {
    animState = 'exit';
    setTimeout(() => {
      onCancel();
    }, 150); // Match exit animation duration
  }

  // Handle submit
  function handleSubmit() {
    if (!text.trim()) return;
    onSubmit(text.trim());
  }

  // Handle keyboard
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  }

  // =============================================================================
  // Lifecycle
  // =============================================================================

  onMount(() => {
    // Start enter animation
    requestAnimationFrame(() => {
      animState = 'enter';
    });

    // Transition to entered state after animation completes
    const enterTimer = setTimeout(() => {
      animState = 'entered';
    }, 200); // Match animation duration

    const focusTimer = setTimeout(() => {
      if (textareaRef) {
        textareaRef.focus();
        textareaRef.selectionStart = textareaRef.selectionEnd = textareaRef.value.length;
        textareaRef.scrollTop = textareaRef.scrollHeight;
      }
    }, 50);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(focusTimer);
    };
  });
</script>

<div
  bind:this={popupRef}
  class={popupClassName}
  data-annotation-popup
  {style}
  onclick={(e) => e.stopPropagation()}
  role="dialog"
>
  <div class={styles.header}>
    <span class={styles.element}>{element}</span>
    {#if timestamp}
      <span class={styles.timestamp}>{timestamp}</span>
    {/if}
  </div>

  {#if selectedText}
    <div class={styles.quote}>
      &ldquo;{selectedText.slice(0, 80)}{selectedText.length > 80 ? '...' : ''}&rdquo;
    </div>
  {/if}

  <textarea
    bind:this={textareaRef}
    class={styles.textarea}
    style="border-color: {isFocused ? accentColor : undefined}"
    {placeholder}
    bind:value={text}
    onfocus={() => (isFocused = true)}
    onblur={() => (isFocused = false)}
    rows="2"
    onkeydown={handleKeyDown}
  ></textarea>

  <div class={styles.actions}>
    <button class={styles.cancel} onclick={handleCancel}>
      Cancel
    </button>
    <button
      class={styles.submit}
      style="background-color: {accentColor}; opacity: {text.trim() ? 1 : 0.4}"
      onclick={handleSubmit}
      disabled={!text.trim()}
    >
      {submitLabel}
    </button>
  </div>
</div>
