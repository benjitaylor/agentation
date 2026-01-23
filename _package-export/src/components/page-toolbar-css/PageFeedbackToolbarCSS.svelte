<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import AnnotationPopupCSS from '../annotation-popup-css/AnnotationPopupCSS.svelte';
  import {
    IconListSparkle,
    IconPausePlayAnimated,
    IconEyeAnimated,
    IconCopyAnimated,
    IconTrashAlt,
    IconGear,
    IconXmarkLarge,
    IconPlus,
    IconXmark,
    IconClose,
    IconCheckSmallAnimated,
    IconHelp,
    IconSun,
    IconMoon,
  } from '../icons.svelte';
  import {
    identifyElement,
    getNearbyText,
    getElementClasses,
    getDetailedComputedStyles,
    getFullElementPath,
    getAccessibilityInfo,
    getNearbyElements,
  } from '../../utils/element-identification';
  import {
    loadAnnotations,
    saveAnnotations,
    getStorageKey,
  } from '../../utils/storage';

  import type { Annotation } from '../../types';
  import styles from './styles.module.scss';

  // Module-level flag to prevent re-animating on SPA page navigation
  let hasPlayedEntranceAnimation = false;

  // =============================================================================
  // Types
  // =============================================================================

  type HoverInfo = {
    element: string;
    elementPath: string;
    rect: DOMRect | null;
  };

  type OutputDetailLevel = 'compact' | 'standard' | 'detailed' | 'forensic';

  type ToolbarSettings = {
    outputDetail: OutputDetailLevel;
    autoClearAfterCopy: boolean;
    annotationColor: string;
    blockInteractions: boolean;
  };

  const DEFAULT_SETTINGS: ToolbarSettings = {
    outputDetail: 'standard',
    autoClearAfterCopy: false,
    annotationColor: '#3c82f7',
    blockInteractions: false,
  };

  const OUTPUT_DETAIL_OPTIONS: { value: OutputDetailLevel; label: string }[] = [
    { value: 'compact', label: 'Compact' },
    { value: 'standard', label: 'Standard' },
    { value: 'detailed', label: 'Detailed' },
    { value: 'forensic', label: 'Forensic' },
  ];

  const COLOR_OPTIONS = [
    { value: '#AF52DE', label: 'Purple' },
    { value: '#3c82f7', label: 'Blue' },
    { value: '#5AC8FA', label: 'Cyan' },
    { value: '#34C759', label: 'Green' },
    { value: '#FFD60A', label: 'Yellow' },
    { value: '#FF9500', label: 'Orange' },
    { value: '#FF3B30', label: 'Red' },
  ];

  // =============================================================================
  // Props
  // =============================================================================

  export type DemoAnnotation = {
    selector: string;
    comment: string;
    selectedText?: string;
  };

  interface Props {
    demoAnnotations?: DemoAnnotation[];
    demoDelay?: number;
    enableDemoMode?: boolean;
  }

  let {
    demoAnnotations,
    demoDelay = 1000,
    enableDemoMode = false,
  }: Props = $props();

  // =============================================================================
  // Utils
  // =============================================================================

  function isElementFixed(element: HTMLElement): boolean {
    let current: HTMLElement | null = element;
    while (current && current !== document.body) {
      const style = window.getComputedStyle(current);
      const position = style.position;
      if (position === 'fixed' || position === 'sticky') {
        return true;
      }
      current = current.parentElement;
    }
    return false;
  }

  function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function generateOutput(
    annotations: Annotation[],
    pathname: string,
    detailLevel: OutputDetailLevel = 'standard'
  ): string {
    if (annotations.length === 0) return '';

    const viewport =
      typeof window !== 'undefined'
        ? `${window.innerWidth}×${window.innerHeight}`
        : 'unknown';

    let output = `## Page Feedback: ${pathname}\n`;

    if (detailLevel === 'forensic') {
      output += `\n**Environment:**\n`;
      output += `- Viewport: ${viewport}\n`;
      if (typeof window !== 'undefined') {
        output += `- URL: ${window.location.href}\n`;
        output += `- User Agent: ${navigator.userAgent}\n`;
        output += `- Timestamp: ${new Date().toISOString()}\n`;
        output += `- Device Pixel Ratio: ${window.devicePixelRatio}\n`;
      }
      output += `\n---\n`;
    } else if (detailLevel !== 'compact') {
      output += `**Viewport:** ${viewport}\n`;
    }
    output += '\n';

    annotations.forEach((a, i) => {
      if (detailLevel === 'compact') {
        output += `${i + 1}. **${a.element}**: ${a.comment}`;
        if (a.selectedText) {
          output += ` (re: "${a.selectedText.slice(0, 30)}${a.selectedText.length > 30 ? '...' : ''}")`;
        }
        output += '\n';
      } else if (detailLevel === 'forensic') {
        output += `### ${i + 1}. ${a.element}\n`;
        if (a.isMultiSelect && a.fullPath) {
          output += `*Forensic data shown for first element of selection*\n`;
        }
        if (a.fullPath) {
          output += `**Full DOM Path:** ${a.fullPath}\n`;
        }
        if (a.cssClasses) {
          output += `**CSS Classes:** ${a.cssClasses}\n`;
        }
        if (a.boundingBox) {
          output += `**Position:** x:${Math.round(a.boundingBox.x)}, y:${Math.round(a.boundingBox.y)} (${Math.round(a.boundingBox.width)}×${Math.round(a.boundingBox.height)}px)\n`;
        }
        output += `**Annotation at:** ${a.x.toFixed(1)}% from left, ${Math.round(a.y)}px from top\n`;
        if (a.selectedText) {
          output += `**Selected text:** "${a.selectedText}"\n`;
        }
        if (a.nearbyText && !a.selectedText) {
          output += `**Context:** ${a.nearbyText.slice(0, 100)}\n`;
        }
        if (a.computedStyles) {
          output += `**Computed Styles:** ${a.computedStyles}\n`;
        }
        if (a.accessibility) {
          output += `**Accessibility:** ${a.accessibility}\n`;
        }
        if (a.nearbyElements) {
          output += `**Nearby Elements:** ${a.nearbyElements}\n`;
        }
        output += `**Feedback:** ${a.comment}\n\n`;
      } else {
        output += `### ${i + 1}. ${a.element}\n`;
        output += `**Location:** ${a.elementPath}\n`;

        if (detailLevel === 'detailed') {
          if (a.cssClasses) {
            output += `**Classes:** ${a.cssClasses}\n`;
          }
          if (a.boundingBox) {
            output += `**Position:** ${Math.round(a.boundingBox.x)}px, ${Math.round(a.boundingBox.y)}px (${Math.round(a.boundingBox.width)}×${Math.round(a.boundingBox.height)}px)\n`;
          }
        }

        if (a.selectedText) {
          output += `**Selected text:** "${a.selectedText}"\n`;
        }

        if (detailLevel === 'detailed' && a.nearbyText && !a.selectedText) {
          output += `**Context:** ${a.nearbyText.slice(0, 100)}\n`;
        }

        output += `**Feedback:** ${a.comment}\n\n`;
      }
    });

    return output.trim();
  }

  // =============================================================================
  // State
  // =============================================================================

  let isActive = $state(false);
  let annotations = $state<Annotation[]>([]);
  let showMarkers = $state(true);
  let markersVisible = $state(false);
  let markersExiting = $state(false);
  let hoverInfo = $state<HoverInfo | null>(null);
  let hoverPosition = $state({ x: 0, y: 0 });
  let pendingAnnotation = $state<{
    x: number;
    y: number;
    clientY: number;
    element: string;
    elementPath: string;
    selectedText?: string;
    boundingBox?: { x: number; y: number; width: number; height: number };
    nearbyText?: string;
    cssClasses?: string;
    isMultiSelect?: boolean;
    isFixed?: boolean;
    fullPath?: string;
    accessibility?: string;
    computedStyles?: string;
    nearbyElements?: string;
  } | null>(null);
  let copied = $state(false);
  let cleared = $state(false);
  let isClearing = $state(false);
  let hoveredMarkerId = $state<string | null>(null);
  let deletingMarkerId = $state<string | null>(null);
  let renumberFrom = $state<number | null>(null);
  let editingAnnotation = $state<Annotation | null>(null);
  let scrollY = $state(0);
  let isScrolling = $state(false);
  let mounted = $state(false);
  let isFrozen = $state(false);
  let showSettings = $state(false);
  let showSettingsVisible = $state(false);
  let settings = $state<ToolbarSettings>({ ...DEFAULT_SETTINGS });
  let isDarkMode = $state(true);
  let showEntranceAnimation = $state(false);

  // Draggable toolbar state
  let toolbarPosition = $state<{ x: number; y: number } | null>(null);
  let isDraggingToolbar = $state(false);
  let dragStartPos = $state<{
    x: number;
    y: number;
    toolbarX: number;
    toolbarY: number;
  } | null>(null);
  let dragRotation = $state(0);

  // For animations
  let animatedMarkers = $state<Set<string>>(new Set());
  let exitingMarkers = $state<Set<string>>(new Set());
  let pendingExiting = $state(false);
  let editExiting = $state(false);

  // Multi-select drag state
  let isDragging = $state(false);

  // Non-reactive refs (using regular variables)
  let justFinishedToolbarDragRef = false;
  let mouseDownPosRef: { x: number; y: number } | null = null;
  let dragStartRef: { x: number; y: number } | null = null;
  let dragRectRef: HTMLDivElement | null = null;
  let highlightsContainerRef: HTMLDivElement | null = null;
  let justFinishedDragRef = false;
  let lastElementUpdateRef = 0;
  let recentlyAddedIdRef: string | null = null;
  let scrollTimeoutRef: ReturnType<typeof setTimeout> | null = null;
  const DRAG_THRESHOLD = 8;
  const ELEMENT_UPDATE_THROTTLE = 50;

  // Component refs
  let popupRef: AnnotationPopupCSS | null = null;
  let editPopupRef: AnnotationPopupCSS | null = null;

  // Portal container
  let portalContainer: HTMLDivElement | null = null;

  // Get pathname
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';

  // =============================================================================
  // Derived State
  // =============================================================================

  let hasAnnotations = $derived(annotations.length > 0);
  let shouldShowMarkers = $derived(isActive && showMarkers);
  let visibleAnnotations = $derived(annotations.filter((a) => !exitingMarkers.has(a.id)));
  let exitingAnnotationsList = $derived(annotations.filter((a) => exitingMarkers.has(a.id)));

  // =============================================================================
  // Effects
  // =============================================================================

  // Handle showSettings changes with exit animation
  $effect(() => {
    if (showSettings) {
      showSettingsVisible = true;
    } else {
      const timer = setTimeout(() => (showSettingsVisible = false), 0);
      return () => clearTimeout(timer);
    }
  });

  // Unified marker visibility
  $effect(() => {
    if (shouldShowMarkers) {
      markersExiting = false;
      markersVisible = true;
      animatedMarkers = new Set();
      const timer = setTimeout(() => {
        animatedMarkers = new Set([...animatedMarkers, ...annotations.map((a) => a.id)]);
      }, 350);
      return () => clearTimeout(timer);
    } else if (markersVisible) {
      markersExiting = true;
      const timer = setTimeout(() => {
        markersVisible = false;
        markersExiting = false;
      }, 250);
      return () => clearTimeout(timer);
    }
  });

  // Save settings
  $effect(() => {
    if (mounted) {
      localStorage.setItem('feedback-toolbar-settings', JSON.stringify(settings));
    }
  });

  // Save theme preference
  $effect(() => {
    if (mounted) {
      localStorage.setItem('feedback-toolbar-theme', isDarkMode ? 'dark' : 'light');
    }
  });

  // Save annotations
  $effect(() => {
    if (mounted && annotations.length > 0) {
      saveAnnotations(pathname, annotations);
    } else if (mounted && annotations.length === 0) {
      localStorage.removeItem(getStorageKey(pathname));
    }
  });

  // Reset state when deactivating
  $effect(() => {
    if (!isActive) {
      pendingAnnotation = null;
      editingAnnotation = null;
      hoverInfo = null;
      showSettings = false;
      if (isFrozen) {
        unfreezeAnimations();
      }
    }
  });

  // Constrain toolbar position on resize or active change
  $effect(() => {
    if (!toolbarPosition) return;

    const constrainPosition = () => {
      const padding = 20;
      const containerWidth = 257;
      const circleWidth = 44;
      const toolbarHeight = 44;

      let newX = toolbarPosition!.x;
      let newY = toolbarPosition!.y;

      if (isActive) {
        newX = Math.max(padding, Math.min(window.innerWidth - containerWidth - padding, newX));
      } else {
        const circleOffset = containerWidth - circleWidth;
        const minX = padding - circleOffset;
        const maxX = window.innerWidth - padding - circleOffset - circleWidth;
        newX = Math.max(minX, Math.min(maxX, newX));
      }

      newY = Math.max(padding, Math.min(window.innerHeight - toolbarHeight - padding, newY));

      if (newX !== toolbarPosition!.x || newY !== toolbarPosition!.y) {
        toolbarPosition = { x: newX, y: newY };
      }
    };

    constrainPosition();

    window.addEventListener('resize', constrainPosition);
    return () => window.removeEventListener('resize', constrainPosition);
  });

  // =============================================================================
  // Functions
  // =============================================================================

  function freezeAnimations() {
    if (isFrozen) return;

    const style = document.createElement('style');
    style.id = 'feedback-freeze-styles';
    style.textContent = `
      *:not([data-feedback-toolbar]):not([data-feedback-toolbar] *):not([data-annotation-popup]):not([data-annotation-popup] *):not([data-annotation-marker]):not([data-annotation-marker] *),
      *:not([data-feedback-toolbar]):not([data-feedback-toolbar] *):not([data-annotation-popup]):not([data-annotation-popup] *):not([data-annotation-marker]):not([data-annotation-marker] *)::before,
      *:not([data-feedback-toolbar]):not([data-feedback-toolbar] *):not([data-annotation-popup]):not([data-annotation-popup] *):not([data-annotation-marker]):not([data-annotation-marker] *)::after {
        animation-play-state: paused !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);

    document.querySelectorAll('video').forEach((video) => {
      if (!video.paused) {
        video.dataset.wasPaused = 'false';
        video.pause();
      }
    });

    isFrozen = true;
  }

  function unfreezeAnimations() {
    if (!isFrozen) return;

    const style = document.getElementById('feedback-freeze-styles');
    if (style) style.remove();

    document.querySelectorAll('video').forEach((video) => {
      if (video.dataset.wasPaused === 'false') {
        video.play();
        delete video.dataset.wasPaused;
      }
    });

    isFrozen = false;
  }

  function toggleFreeze() {
    if (isFrozen) {
      unfreezeAnimations();
    } else {
      freezeAnimations();
    }
  }

  function addAnnotation(comment: string) {
    if (!pendingAnnotation) return;

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      x: pendingAnnotation.x,
      y: pendingAnnotation.y,
      comment,
      element: pendingAnnotation.element,
      elementPath: pendingAnnotation.elementPath,
      timestamp: Date.now(),
      selectedText: pendingAnnotation.selectedText,
      boundingBox: pendingAnnotation.boundingBox,
      nearbyText: pendingAnnotation.nearbyText,
      cssClasses: pendingAnnotation.cssClasses,
      isMultiSelect: pendingAnnotation.isMultiSelect,
      isFixed: pendingAnnotation.isFixed,
      fullPath: pendingAnnotation.fullPath,
      accessibility: pendingAnnotation.accessibility,
      computedStyles: pendingAnnotation.computedStyles,
      nearbyElements: pendingAnnotation.nearbyElements,
    };

    annotations = [...annotations, newAnnotation];
    recentlyAddedIdRef = newAnnotation.id;
    setTimeout(() => {
      recentlyAddedIdRef = null;
    }, 300);
    setTimeout(() => {
      animatedMarkers = new Set([...animatedMarkers, newAnnotation.id]);
    }, 250);

    pendingExiting = true;
    setTimeout(() => {
      pendingAnnotation = null;
      pendingExiting = false;
    }, 150);

    window.getSelection()?.removeAllRanges();
  }

  function cancelAnnotation() {
    pendingExiting = true;
    setTimeout(() => {
      pendingAnnotation = null;
      pendingExiting = false;
    }, 150);
  }

  function deleteAnnotation(id: string) {
    const deletedIndex = annotations.findIndex((a) => a.id === id);
    deletingMarkerId = id;
    exitingMarkers = new Set([...exitingMarkers, id]);

    setTimeout(() => {
      annotations = annotations.filter((a) => a.id !== id);
      const newExiting = new Set(exitingMarkers);
      newExiting.delete(id);
      exitingMarkers = newExiting;
      deletingMarkerId = null;

      if (deletedIndex < annotations.length) {
        renumberFrom = deletedIndex;
        setTimeout(() => (renumberFrom = null), 200);
      }
    }, 150);
  }

  function startEditAnnotation(annotation: Annotation) {
    editingAnnotation = annotation;
    hoveredMarkerId = null;
  }

  function updateAnnotation(newComment: string) {
    if (!editingAnnotation) return;

    annotations = annotations.map((a) =>
      a.id === editingAnnotation!.id ? { ...a, comment: newComment } : a
    );

    editExiting = true;
    setTimeout(() => {
      editingAnnotation = null;
      editExiting = false;
    }, 150);
  }

  function cancelEditAnnotation() {
    editExiting = true;
    setTimeout(() => {
      editingAnnotation = null;
      editExiting = false;
    }, 150);
  }

  function clearAll() {
    const count = annotations.length;
    if (count === 0) return;

    isClearing = true;
    cleared = true;

    const totalAnimationTime = count * 30 + 200;
    setTimeout(() => {
      annotations = [];
      animatedMarkers = new Set();
      localStorage.removeItem(getStorageKey(pathname));
      isClearing = false;
    }, totalAnimationTime);

    setTimeout(() => (cleared = false), 1500);
  }

  async function copyOutput() {
    const output = generateOutput(annotations, pathname, settings.outputDetail);
    if (!output) return;

    await navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => (copied = false), 2000);

    if (settings.autoClearAfterCopy) {
      setTimeout(() => clearAll(), 500);
    }
  }

  function handleToolbarMouseDown(e: MouseEvent) {
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest(`.${styles.settingsPanel}`)
    ) {
      return;
    }

    const toolbarParent = (e.currentTarget as HTMLElement).parentElement;
    if (!toolbarParent) return;

    const rect = toolbarParent.getBoundingClientRect();
    const currentX = toolbarPosition?.x ?? rect.left;
    const currentY = toolbarPosition?.y ?? rect.top;

    const randomRotation = (Math.random() - 0.5) * 10;
    dragRotation = randomRotation;

    dragStartPos = {
      x: e.clientX,
      y: e.clientY,
      toolbarX: currentX,
      toolbarY: currentY,
    };
  }

  function getTooltipPosition(annotation: Annotation): string {
    const tooltipMaxWidth = 200;
    const tooltipEstimatedHeight = 80;
    const markerSize = 22;
    const gap = 10;

    const markerX = (annotation.x / 100) * window.innerWidth;
    const markerY = typeof annotation.y === 'string' ? parseFloat(annotation.y) : annotation.y;

    let styleStr = '';

    const spaceBelow = window.innerHeight - markerY - markerSize - gap;
    if (spaceBelow < tooltipEstimatedHeight) {
      styleStr += `top: auto; bottom: calc(100% + ${gap}px);`;
    }

    const centerX = markerX - tooltipMaxWidth / 2;
    const edgePadding = 10;

    if (centerX < edgePadding) {
      const offset = edgePadding - centerX;
      styleStr += `left: calc(50% + ${offset}px);`;
    } else if (centerX + tooltipMaxWidth > window.innerWidth - edgePadding) {
      const overflow = centerX + tooltipMaxWidth - (window.innerWidth - edgePadding);
      styleStr += `left: calc(50% - ${overflow}px);`;
    }

    return styleStr;
  }

  // =============================================================================
  // Event Handlers Setup
  // =============================================================================

  function setupEventListeners() {
    // Scroll handler
    const handleScroll = () => {
      scrollY = window.scrollY;
      isScrolling = true;

      if (scrollTimeoutRef) {
        clearTimeout(scrollTimeoutRef);
      }

      scrollTimeoutRef = setTimeout(() => {
        isScrolling = false;
      }, 150);
    };

    // Mouse move handler for hover info
    const handleMouseMove = (e: MouseEvent) => {
      if (!isActive || pendingAnnotation) return;

      if ((e.target as HTMLElement).closest('[data-feedback-toolbar]')) {
        hoverInfo = null;
        return;
      }

      const elementUnder = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      if (!elementUnder || elementUnder.closest('[data-feedback-toolbar]')) {
        hoverInfo = null;
        return;
      }

      const { name, path } = identifyElement(elementUnder);
      const rect = elementUnder.getBoundingClientRect();

      hoverInfo = { element: name, elementPath: path, rect };
      hoverPosition = { x: e.clientX, y: e.clientY };
    };

    // Click handler
    const handleClick = (e: MouseEvent) => {
      if (!isActive) return;

      if (justFinishedDragRef) {
        justFinishedDragRef = false;
        return;
      }

      const target = e.target as HTMLElement;

      if (target.closest('[data-feedback-toolbar]')) return;
      if (target.closest('[data-annotation-popup]')) return;
      if (target.closest('[data-annotation-marker]')) return;

      const isInteractive = target.closest(
        "button, a, input, select, textarea, [role='button'], [onclick]"
      );

      if (settings.blockInteractions && isInteractive) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (pendingAnnotation) {
        if (isInteractive && !settings.blockInteractions) {
          return;
        }
        e.preventDefault();
        popupRef?.shake();
        return;
      }

      if (editingAnnotation) {
        if (isInteractive && !settings.blockInteractions) {
          return;
        }
        e.preventDefault();
        editPopupRef?.shake();
        return;
      }

      e.preventDefault();

      const elementUnder = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      if (!elementUnder) return;

      const { name, path } = identifyElement(elementUnder);
      const rect = elementUnder.getBoundingClientRect();
      const x = (e.clientX / window.innerWidth) * 100;

      const isFixed = isElementFixed(elementUnder);
      const y = isFixed ? e.clientY : e.clientY + window.scrollY;

      const selection = window.getSelection();
      let selectedText: string | undefined;
      if (selection && selection.toString().trim().length > 0) {
        selectedText = selection.toString().trim().slice(0, 500);
      }

      const computedStylesObj = getDetailedComputedStyles(elementUnder);
      const computedStylesStr = Object.entries(computedStylesObj)
        .map(([k, v]) => `${k}: ${v}`)
        .join('; ');

      pendingAnnotation = {
        x,
        y,
        clientY: e.clientY,
        element: name,
        elementPath: path,
        selectedText,
        boundingBox: {
          x: rect.left,
          y: isFixed ? rect.top : rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
        },
        nearbyText: getNearbyText(elementUnder),
        cssClasses: getElementClasses(elementUnder),
        isFixed,
        fullPath: getFullElementPath(elementUnder),
        accessibility: getAccessibilityInfo(elementUnder),
        computedStyles: computedStylesStr,
        nearbyElements: getNearbyElements(elementUnder),
      };
      hoverInfo = null;
    };

    // Mousedown for drag selection
    const handleMouseDown = (e: MouseEvent) => {
      if (!isActive || pendingAnnotation) return;

      const target = e.target as HTMLElement;

      if (target.closest('[data-feedback-toolbar]')) return;
      if (target.closest('[data-annotation-marker]')) return;
      if (target.closest('[data-annotation-popup]')) return;

      const textTags = new Set([
        'P', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TD', 'TH',
        'LABEL', 'BLOCKQUOTE', 'FIGCAPTION', 'CAPTION', 'LEGEND', 'DT', 'DD',
        'PRE', 'CODE', 'EM', 'STRONG', 'B', 'I', 'U', 'S', 'A', 'TIME',
        'ADDRESS', 'CITE', 'Q', 'ABBR', 'DFN', 'MARK', 'SMALL', 'SUB', 'SUP',
      ]);

      if (textTags.has(target.tagName) || target.isContentEditable) {
        return;
      }

      mouseDownPosRef = { x: e.clientX, y: e.clientY };
    };

    // Mousemove for drag selection
    const handleDragMouseMove = (e: MouseEvent) => {
      if (!isActive || pendingAnnotation || !mouseDownPosRef) return;

      const dx = e.clientX - mouseDownPosRef.x;
      const dy = e.clientY - mouseDownPosRef.y;
      const distance = dx * dx + dy * dy;
      const thresholdSq = DRAG_THRESHOLD * DRAG_THRESHOLD;

      if (!isDragging && distance >= thresholdSq) {
        dragStartRef = mouseDownPosRef;
        isDragging = true;
      }

      if ((isDragging || distance >= thresholdSq) && dragStartRef) {
        if (dragRectRef) {
          const left = Math.min(dragStartRef.x, e.clientX);
          const top = Math.min(dragStartRef.y, e.clientY);
          const width = Math.abs(e.clientX - dragStartRef.x);
          const height = Math.abs(e.clientY - dragStartRef.y);
          dragRectRef.style.transform = `translate(${left}px, ${top}px)`;
          dragRectRef.style.width = `${width}px`;
          dragRectRef.style.height = `${height}px`;
        }

        const now = Date.now();
        if (now - lastElementUpdateRef < ELEMENT_UPDATE_THROTTLE) {
          return;
        }
        lastElementUpdateRef = now;

        const startX = dragStartRef.x;
        const startY = dragStartRef.y;
        const left = Math.min(startX, e.clientX);
        const top = Math.min(startY, e.clientY);
        const right = Math.max(startX, e.clientX);
        const bottom = Math.max(startY, e.clientY);

        const allMatching: DOMRect[] = [];
        const meaningfulTags = new Set([
          'BUTTON', 'A', 'INPUT', 'IMG', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
          'LI', 'LABEL', 'TD', 'TH', 'SECTION', 'ARTICLE', 'ASIDE', 'NAV',
        ]);

        const nearbyElements = document.querySelectorAll(
          'button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th, div, span, section, article, aside, nav'
        );

        for (const el of nearbyElements) {
          if (!(el instanceof HTMLElement)) continue;
          if (
            el.closest('[data-feedback-toolbar]') ||
            el.closest('[data-annotation-marker]')
          )
            continue;

          const rect = el.getBoundingClientRect();
          if (rect.width > window.innerWidth * 0.8 && rect.height > window.innerHeight * 0.5)
            continue;
          if (rect.width < 10 || rect.height < 10) continue;

          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const centerInside =
            centerX >= left && centerX <= right && centerY >= top && centerY <= bottom;

          const overlapX = Math.min(rect.right, right) - Math.max(rect.left, left);
          const overlapY = Math.min(rect.bottom, bottom) - Math.max(rect.top, top);
          const overlapArea = overlapX > 0 && overlapY > 0 ? overlapX * overlapY : 0;
          const elementArea = rect.width * rect.height;
          const overlapRatio = elementArea > 0 ? overlapArea / elementArea : 0;

          if (centerInside || overlapRatio > 0.5) {
            const tagName = el.tagName;
            let shouldInclude = meaningfulTags.has(tagName);

            if (!shouldInclude && (tagName === 'DIV' || tagName === 'SPAN')) {
              const hasText = el.textContent && el.textContent.trim().length > 0;
              const isInteractive =
                el.onclick !== null ||
                el.getAttribute('role') === 'button' ||
                el.getAttribute('role') === 'link';

              if (
                (hasText || isInteractive) &&
                !el.querySelector('p, h1, h2, h3, h4, h5, h6, button, a')
              ) {
                shouldInclude = true;
              }
            }

            if (shouldInclude) {
              allMatching.push(rect);
            }
          }
        }

        if (highlightsContainerRef) {
          const container = highlightsContainerRef;
          while (container.children.length > allMatching.length) {
            container.removeChild(container.lastChild!);
          }
          allMatching.forEach((rect, i) => {
            let div = container.children[i] as HTMLDivElement;
            if (!div) {
              div = document.createElement('div');
              div.className = styles.selectedElementHighlight;
              container.appendChild(div);
            }
            div.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
            div.style.width = `${rect.width}px`;
            div.style.height = `${rect.height}px`;
          });
        }
      }
    };

    // Mouseup for drag selection
    const handleMouseUp = (e: MouseEvent) => {
      if (!isActive) return;

      const wasDragging = isDragging;
      const localDragStart = dragStartRef;

      if (isDragging && localDragStart) {
        justFinishedDragRef = true;

        const left = Math.min(localDragStart.x, e.clientX);
        const top = Math.min(localDragStart.y, e.clientY);
        const right = Math.max(localDragStart.x, e.clientX);
        const bottom = Math.max(localDragStart.y, e.clientY);

        const allMatching: { element: HTMLElement; rect: DOMRect }[] = [];
        const selector =
          'button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th';

        document.querySelectorAll(selector).forEach((el) => {
          if (!(el instanceof HTMLElement)) return;
          if (
            el.closest('[data-feedback-toolbar]') ||
            el.closest('[data-annotation-marker]')
          )
            return;

          const rect = el.getBoundingClientRect();
          if (rect.width > window.innerWidth * 0.8 && rect.height > window.innerHeight * 0.5)
            return;
          if (rect.width < 10 || rect.height < 10) return;

          if (
            rect.left < right &&
            rect.right > left &&
            rect.top < bottom &&
            rect.bottom > top
          ) {
            allMatching.push({ element: el, rect });
          }
        });

        const finalElements = allMatching.filter(
          ({ element: el }) =>
            !allMatching.some(({ element: other }) => other !== el && el.contains(other))
        );

        const x = (e.clientX / window.innerWidth) * 100;
        const y = e.clientY + window.scrollY;

        if (finalElements.length > 0) {
          const bounds = finalElements.reduce(
            (acc, { rect }) => ({
              left: Math.min(acc.left, rect.left),
              top: Math.min(acc.top, rect.top),
              right: Math.max(acc.right, rect.right),
              bottom: Math.max(acc.bottom, rect.bottom),
            }),
            { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
          );

          const elementNames = finalElements
            .slice(0, 5)
            .map(({ element }) => identifyElement(element).name)
            .join(', ');
          const suffix =
            finalElements.length > 5 ? ` +${finalElements.length - 5} more` : '';

          const firstElement = finalElements[0].element;
          const firstElementComputedStyles = getDetailedComputedStyles(firstElement);
          const firstElementComputedStylesStr = Object.entries(firstElementComputedStyles)
            .map(([k, v]) => `${k}: ${v}`)
            .join('; ');

          pendingAnnotation = {
            x,
            y,
            clientY: e.clientY,
            element: `${finalElements.length} elements: ${elementNames}${suffix}`,
            elementPath: 'multi-select',
            boundingBox: {
              x: bounds.left,
              y: bounds.top + window.scrollY,
              width: bounds.right - bounds.left,
              height: bounds.bottom - bounds.top,
            },
            isMultiSelect: true,
            fullPath: getFullElementPath(firstElement),
            accessibility: getAccessibilityInfo(firstElement),
            computedStyles: firstElementComputedStylesStr,
            nearbyElements: getNearbyElements(firstElement),
            cssClasses: getElementClasses(firstElement),
            nearbyText: getNearbyText(firstElement),
          };
        } else {
          const width = Math.abs(right - left);
          const height = Math.abs(bottom - top);

          if (width > 20 && height > 20) {
            pendingAnnotation = {
              x,
              y,
              clientY: e.clientY,
              element: 'Area selection',
              elementPath: `region at (${Math.round(left)}, ${Math.round(top)})`,
              boundingBox: {
                x: left,
                y: top + window.scrollY,
                width,
                height,
              },
              isMultiSelect: true,
            };
          }
        }
        hoverInfo = null;
      } else if (wasDragging) {
        justFinishedDragRef = true;
      }

      mouseDownPosRef = null;
      dragStartRef = null;
      isDragging = false;
      if (highlightsContainerRef) {
        highlightsContainerRef.innerHTML = '';
      }
    };

    // Toolbar drag handlers
    const handleToolbarDragMove = (e: MouseEvent) => {
      if (!dragStartPos) return;

      const TOOLBAR_DRAG_THRESHOLD = 5;

      const deltaX = e.clientX - dragStartPos.x;
      const deltaY = e.clientY - dragStartPos.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (!isDraggingToolbar && distance > TOOLBAR_DRAG_THRESHOLD) {
        isDraggingToolbar = true;
      }

      if (isDraggingToolbar || distance > TOOLBAR_DRAG_THRESHOLD) {
        let newX = dragStartPos.toolbarX + deltaX;
        let newY = dragStartPos.toolbarY + deltaY;

        const padding = 20;
        const containerWidth = 257;
        const circleWidth = 44;
        const toolbarHeight = 44;

        if (isActive) {
          newX = Math.max(padding, Math.min(window.innerWidth - containerWidth - padding, newX));
        } else {
          const circleOffset = containerWidth - circleWidth;
          const minX = padding - circleOffset;
          const maxX = window.innerWidth - padding - circleOffset - circleWidth;
          newX = Math.max(minX, Math.min(maxX, newX));
        }

        newY = Math.max(padding, Math.min(window.innerHeight - toolbarHeight - padding, newY));

        toolbarPosition = { x: newX, y: newY };
      }
    };

    const handleToolbarDragEnd = () => {
      if (isDraggingToolbar) {
        justFinishedToolbarDragRef = true;
        setTimeout(() => {
          justFinishedToolbarDragRef = false;
        }, 50);
      }
      isDraggingToolbar = false;
      dragStartPos = null;
    };

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (pendingAnnotation) {
          // Let popup handle
        } else if (isActive) {
          isActive = false;
        }
      }
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleDragMouseMove, { passive: true });
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleToolbarDragMove);
    document.addEventListener('mouseup', handleToolbarDragEnd);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleDragMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleToolbarDragMove);
      document.removeEventListener('mouseup', handleToolbarDragEnd);
      document.removeEventListener('keydown', handleKeyDown);
      if (scrollTimeoutRef) {
        clearTimeout(scrollTimeoutRef);
      }
    };
  }

  function setupCursorStyle() {
    if (!isActive) return;

    const style = document.createElement('style');
    style.id = 'feedback-cursor-styles';
    style.textContent = `
      body * {
        cursor: crosshair !important;
      }
      body p, body span, body h1, body h2, body h3, body h4, body h5, body h6,
      body li, body td, body th, body label, body blockquote, body figcaption,
      body caption, body legend, body dt, body dd, body pre, body code,
      body em, body strong, body b, body i, body u, body s, body a,
      body time, body address, body cite, body q, body abbr, body dfn,
      body mark, body small, body sub, body sup, body [contenteditable],
      body p *, body span *, body h1 *, body h2 *, body h3 *, body h4 *,
      body h5 *, body h6 *, body li *, body a *, body label *, body pre *,
      body code *, body blockquote *, body [contenteditable] * {
        cursor: text !important;
      }
      [data-feedback-toolbar], [data-feedback-toolbar] * {
        cursor: default !important;
      }
      [data-annotation-marker], [data-annotation-marker] * {
        cursor: pointer !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById('feedback-cursor-styles');
      if (existingStyle) existingStyle.remove();
    };
  }

  // =============================================================================
  // Lifecycle
  // =============================================================================

  let cleanupEventListeners: (() => void) | null = null;
  let cleanupCursorStyle: (() => void) | undefined = undefined;

  onMount(() => {
    mounted = true;
    scrollY = window.scrollY;

    // Load stored annotations
    const stored = loadAnnotations<Annotation>(pathname);
    annotations = stored;

    // Trigger entrance animation only on first load
    if (!hasPlayedEntranceAnimation) {
      showEntranceAnimation = true;
      hasPlayedEntranceAnimation = true;
      setTimeout(() => (showEntranceAnimation = false), 750);
    }

    // Load settings
    try {
      const storedSettings = localStorage.getItem('feedback-toolbar-settings');
      if (storedSettings) {
        settings = { ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) };
      }
    } catch (e) {
      // Ignore parsing errors
    }

    // Load theme preference
    try {
      const savedTheme = localStorage.getItem('feedback-toolbar-theme');
      if (savedTheme !== null) {
        isDarkMode = savedTheme === 'dark';
      }
    } catch (e) {
      // Ignore localStorage errors
    }

    // Create portal container
    portalContainer = document.createElement('div');
    portalContainer.id = 'agentation-svelte-portal';
    document.body.appendChild(portalContainer);

    // Setup event listeners
    cleanupEventListeners = setupEventListeners();

    // Demo annotations
    if (enableDemoMode && demoAnnotations && demoAnnotations.length > 0 && annotations.length === 0) {
      const timeoutIds: ReturnType<typeof setTimeout>[] = [];

      timeoutIds.push(
        setTimeout(() => {
          isActive = true;
        }, demoDelay - 200)
      );

      demoAnnotations.forEach((demo, index) => {
        const annotationDelay = demoDelay + index * 300;

        timeoutIds.push(
          setTimeout(() => {
            const element = document.querySelector(demo.selector) as HTMLElement;
            if (!element) return;

            const rect = element.getBoundingClientRect();
            const { name, path } = identifyElement(element);

            const newAnnotation: Annotation = {
              id: `demo-${Date.now()}-${index}`,
              x: ((rect.left + rect.width / 2) / window.innerWidth) * 100,
              y: rect.top + rect.height / 2 + window.scrollY,
              comment: demo.comment,
              element: name,
              elementPath: path,
              timestamp: Date.now(),
              selectedText: demo.selectedText,
              boundingBox: {
                x: rect.left,
                y: rect.top + window.scrollY,
                width: rect.width,
                height: rect.height,
              },
              nearbyText: getNearbyText(element),
              cssClasses: getElementClasses(element),
            };

            annotations = [...annotations, newAnnotation];
          }, annotationDelay)
        );
      });

      return () => {
        timeoutIds.forEach(clearTimeout);
      };
    }
  });

  onDestroy(() => {
    cleanupEventListeners?.();
    cleanupCursorStyle?.();
    if (portalContainer) {
      portalContainer.remove();
    }
    if (isFrozen) {
      unfreezeAnimations();
    }
  });

  // Effect to handle cursor style based on isActive
  $effect(() => {
    cleanupCursorStyle?.();
    if (isActive) {
      cleanupCursorStyle = setupCursorStyle();
    }
  });
</script>

{#if mounted && portalContainer}
  {@const _ = (() => {
    // Render portal content
    tick().then(() => {
      if (!portalContainer) return;
      // Portal rendering is handled by Svelte's reactivity
    });
    return null;
  })()}
{/if}

<!-- Toolbar -->
<div
  class={styles.toolbar}
  data-feedback-toolbar
  style={toolbarPosition
    ? `left: ${toolbarPosition.x}px; top: ${toolbarPosition.y}px; right: auto; bottom: auto;`
    : ''}
>
  <!-- Morphing container -->
  <div
    class="{styles.toolbarContainer} {!isDarkMode ? styles.light : ''} {isActive
      ? styles.expanded
      : styles.collapsed} {showEntranceAnimation ? styles.entrance : ''} {isDraggingToolbar
      ? styles.dragging
      : ''}"
    onclick={!isActive
      ? (e) => {
          if (justFinishedToolbarDragRef) {
            e.preventDefault();
            return;
          }
          isActive = true;
        }
      : undefined}
    onmousedown={handleToolbarMouseDown}
    role={!isActive ? 'button' : undefined}
    tabindex={!isActive ? 0 : -1}
    title={!isActive ? 'Start feedback mode' : undefined}
    style={isDraggingToolbar
      ? `transform: scale(1.05) rotate(${dragRotation}deg); cursor: grabbing;`
      : ''}
  >
    <!-- Toggle content - visible when collapsed -->
    <div class="{styles.toggleContent} {!isActive ? styles.visible : styles.hidden}">
      <IconListSparkle size={24} />
      {#if hasAnnotations}
        <span
          class="{styles.badge} {isActive ? styles.fadeOut : ''} {showEntranceAnimation
            ? styles.entrance
            : ''}"
          style="background-color: {settings.annotationColor}"
        >
          {annotations.length}
        </span>
      {/if}
    </div>

    <!-- Controls content - visible when expanded -->
    <div class="{styles.controlsContent} {isActive ? styles.visible : styles.hidden}">
      <button
        class="{styles.controlButton} {!isDarkMode ? styles.light : ''}"
        onclick={(e) => {
          e.stopPropagation();
          toggleFreeze();
        }}
        title={isFrozen ? 'Resume animations' : 'Pause animations'}
        data-active={isFrozen}
      >
        <IconPausePlayAnimated size={24} isPaused={isFrozen} />
      </button>

      <button
        class="{styles.controlButton} {!isDarkMode ? styles.light : ''}"
        onclick={(e) => {
          e.stopPropagation();
          showMarkers = !showMarkers;
        }}
        disabled={!hasAnnotations}
        title={showMarkers ? 'Hide markers' : 'Show markers'}
      >
        <IconEyeAnimated size={24} isOpen={showMarkers} />
      </button>

      <button
        class="{styles.controlButton} {!isDarkMode ? styles.light : ''}"
        onclick={(e) => {
          e.stopPropagation();
          copyOutput();
        }}
        disabled={!hasAnnotations}
        title="Copy feedback"
        data-active={copied}
      >
        <IconCopyAnimated size={24} {copied} />
      </button>

      <button
        class="{styles.controlButton} {!isDarkMode ? styles.light : ''}"
        onclick={(e) => {
          e.stopPropagation();
          clearAll();
        }}
        disabled={!hasAnnotations}
        title="Clear all"
        data-danger
      >
        <IconTrashAlt size={24} />
      </button>

      <button
        class="{styles.controlButton} {!isDarkMode ? styles.light : ''}"
        onclick={(e) => {
          e.stopPropagation();
          showSettings = !showSettings;
        }}
        title="Settings"
      >
        <IconGear size={24} />
      </button>

      <div class="{styles.divider} {!isDarkMode ? styles.light : ''}"></div>

      <button
        class="{styles.controlButton} {!isDarkMode ? styles.light : ''}"
        onclick={(e) => {
          e.stopPropagation();
          isActive = false;
        }}
        title="Exit feedback mode"
      >
        <IconXmarkLarge size={24} />
      </button>
    </div>

    <!-- Settings Panel -->
    <div
      class="{styles.settingsPanel} {isDarkMode ? styles.dark : styles.light} {showSettingsVisible
        ? styles.enter
        : styles.exit}"
      onclick={(e) => e.stopPropagation()}
      style={toolbarPosition && toolbarPosition.y < 230
        ? 'bottom: auto; top: calc(100% + 0.5rem);'
        : ''}
    >
      <div class={styles.settingsHeader}>
        <span class={styles.settingsBrand}>
          agentation-svelte
        </span>
        <span class={styles.settingsVersion}>v{__VERSION__}</span>
        <button
          class={styles.themeToggle}
          onclick={() => (isDarkMode = !isDarkMode)}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {#if isDarkMode}
            <IconSun size={14} />
          {:else}
            <IconMoon size={14} />
          {/if}
        </button>
      </div>

      <div class={styles.settingsSection}>
        <div class={styles.settingsRow}>
          <div class="{styles.settingsLabel} {!isDarkMode ? styles.light : ''}">
            Output Detail
            <span class={styles.helpIcon} data-tooltip="Controls how much detail is included in the copied output">
              <IconHelp size={20} />
            </span>
          </div>
          <button
            class="{styles.cycleButton} {!isDarkMode ? styles.light : ''}"
            onclick={() => {
              const currentIndex = OUTPUT_DETAIL_OPTIONS.findIndex(
                (opt) => opt.value === settings.outputDetail
              );
              const nextIndex = (currentIndex + 1) % OUTPUT_DETAIL_OPTIONS.length;
              settings = { ...settings, outputDetail: OUTPUT_DETAIL_OPTIONS[nextIndex].value };
            }}
          >
            <span class={styles.cycleButtonText}>
              {OUTPUT_DETAIL_OPTIONS.find((opt) => opt.value === settings.outputDetail)?.label}
            </span>
            <span class={styles.cycleDots}>
              {#each OUTPUT_DETAIL_OPTIONS as option}
                <span
                  class="{styles.cycleDot} {!isDarkMode ? styles.light : ''} {settings.outputDetail ===
                  option.value
                    ? styles.active
                    : ''}"
                ></span>
              {/each}
            </span>
          </button>
        </div>
      </div>

      <div class={styles.settingsSection}>
        <div
          class="{styles.settingsLabel} {styles.settingsLabelMarker} {!isDarkMode
            ? styles.light
            : ''}"
        >
          Marker Colour
        </div>
        <div class={styles.colorOptions}>
          {#each COLOR_OPTIONS as color}
            <div
              onclick={() => (settings = { ...settings, annotationColor: color.value })}
              style="border-color: {settings.annotationColor === color.value
                ? color.value
                : 'transparent'}"
              class="{styles.colorOptionRing} {settings.annotationColor === color.value
                ? styles.selected
                : ''}"
              role="button"
              tabindex="0"
              onkeydown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  settings = { ...settings, annotationColor: color.value };
                }
              }}
            >
              <div
                class="{styles.colorOption} {settings.annotationColor === color.value
                  ? styles.selected
                  : ''}"
                style="background-color: {color.value}"
                title={color.label}
              ></div>
            </div>
          {/each}
        </div>
      </div>

      <div class={styles.settingsSection}>
        <label class={styles.settingsToggle}>
          <input
            type="checkbox"
            id="autoClearAfterCopy"
            bind:checked={settings.autoClearAfterCopy}
          />
          <label
            class="{styles.customCheckbox} {settings.autoClearAfterCopy ? styles.checked : ''}"
            for="autoClearAfterCopy"
          >
            {#if settings.autoClearAfterCopy}
              <IconCheckSmallAnimated size={14} />
            {/if}
          </label>
          <span class="{styles.toggleLabel} {!isDarkMode ? styles.light : ''}">
            Clear after output
            <span
              class={styles.helpIcon}
              data-tooltip="Automatically clear annotations after copying"
            >
              <IconHelp size={20} />
            </span>
          </span>
        </label>
        <label class={styles.settingsToggle}>
          <input
            type="checkbox"
            id="blockInteractions"
            bind:checked={settings.blockInteractions}
          />
          <label
            class="{styles.customCheckbox} {settings.blockInteractions ? styles.checked : ''}"
            for="blockInteractions"
          >
            {#if settings.blockInteractions}
              <IconCheckSmallAnimated size={14} />
            {/if}
          </label>
          <span class="{styles.toggleLabel} {!isDarkMode ? styles.light : ''}">
            Block page interactions
          </span>
        </label>
      </div>
    </div>
  </div>
</div>

<!-- Markers layer - normal scrolling markers -->
<div class={styles.markersLayer} data-feedback-toolbar>
  {#if markersVisible}
    {#each visibleAnnotations.filter((a) => !a.isFixed) as annotation, index (annotation.id)}
      {@const isHovered = !markersExiting && hoveredMarkerId === annotation.id}
      {@const isDeleting = deletingMarkerId === annotation.id}
      {@const showDeleteState = isHovered || isDeleting}
      {@const isMulti = annotation.isMultiSelect}
      {@const markerColor = isMulti ? '#34C759' : settings.annotationColor}
      {@const globalIndex = annotations.findIndex((a) => a.id === annotation.id)}
      {@const needsEnterAnimation = !animatedMarkers.has(annotation.id)}
      {@const animClass = markersExiting
        ? styles.exit
        : isClearing
          ? styles.clearing
          : needsEnterAnimation
            ? styles.enter
            : ''}
      <div
        class="{styles.marker} {showDeleteState ? styles.hovered : ''} {isMulti
          ? styles.multiSelect
          : ''} {animClass}"
        data-annotation-marker
        style="left: {annotation.x}%; top: {annotation.y}px; background-color: {showDeleteState
          ? undefined
          : markerColor}; animation-delay: {markersExiting
          ? `${(visibleAnnotations.length - 1 - index) * 20}ms`
          : `${index * 20}ms`};"
        onmouseenter={() =>
          !markersExiting && annotation.id !== recentlyAddedIdRef && (hoveredMarkerId = annotation.id)}
        onmouseleave={() => (hoveredMarkerId = null)}
        onclick={(e) => {
          e.stopPropagation();
          if (!markersExiting) deleteAnnotation(annotation.id);
        }}
        oncontextmenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!markersExiting) startEditAnnotation(annotation);
        }}
        role="button"
        tabindex="0"
      >
        {#if showDeleteState}
          <IconXmark size={isMulti ? 18 : 16} />
        {:else}
          <span
            class={renumberFrom !== null && globalIndex >= renumberFrom ? styles.renumber : ''}
          >
            {globalIndex + 1}
          </span>
        {/if}
        {#if isHovered && !editingAnnotation}
          <div
            class="{styles.markerTooltip} {!isDarkMode ? styles.light : ''} {styles.enter}"
            style={getTooltipPosition(annotation)}
          >
            <span class={styles.markerQuote}>
              {annotation.element}
              {#if annotation.selectedText}
                {` "${annotation.selectedText.slice(0, 30)}${annotation.selectedText.length > 30 ? '...' : ''}"`}
              {/if}
            </span>
            <span class={styles.markerNote}>
              {annotation.comment}
            </span>
          </div>
        {/if}
      </div>
    {/each}

    <!-- Exiting markers (normal) -->
    {#if !markersExiting}
      {#each exitingAnnotationsList.filter((a) => !a.isFixed) as annotation (annotation.id)}
        {@const isMulti = annotation.isMultiSelect}
        <div
          class="{styles.marker} {styles.hovered} {isMulti ? styles.multiSelect : ''} {styles.exit}"
          data-annotation-marker
          style="left: {annotation.x}%; top: {annotation.y}px;"
        >
          <IconXmark size={isMulti ? 12 : 10} />
        </div>
      {/each}
    {/if}
  {/if}
</div>

<!-- Fixed markers layer -->
<div class={styles.fixedMarkersLayer} data-feedback-toolbar>
  {#if markersVisible}
    {#each visibleAnnotations.filter((a) => a.isFixed) as annotation, index (annotation.id)}
      {@const fixedAnnotations = visibleAnnotations.filter((a) => a.isFixed)}
      {@const isHovered = !markersExiting && hoveredMarkerId === annotation.id}
      {@const isDeleting = deletingMarkerId === annotation.id}
      {@const showDeleteState = isHovered || isDeleting}
      {@const isMulti = annotation.isMultiSelect}
      {@const markerColor = isMulti ? '#34C759' : settings.annotationColor}
      {@const globalIndex = annotations.findIndex((a) => a.id === annotation.id)}
      {@const needsEnterAnimation = !animatedMarkers.has(annotation.id)}
      {@const animClass = markersExiting
        ? styles.exit
        : isClearing
          ? styles.clearing
          : needsEnterAnimation
            ? styles.enter
            : ''}
      <div
        class="{styles.marker} {styles.fixed} {showDeleteState ? styles.hovered : ''} {isMulti
          ? styles.multiSelect
          : ''} {animClass}"
        data-annotation-marker
        style="left: {annotation.x}%; top: {annotation.y}px; background-color: {showDeleteState
          ? undefined
          : markerColor}; animation-delay: {markersExiting
          ? `${(fixedAnnotations.length - 1 - index) * 20}ms`
          : `${index * 20}ms`};"
        onmouseenter={() =>
          !markersExiting && annotation.id !== recentlyAddedIdRef && (hoveredMarkerId = annotation.id)}
        onmouseleave={() => (hoveredMarkerId = null)}
        onclick={(e) => {
          e.stopPropagation();
          if (!markersExiting) deleteAnnotation(annotation.id);
        }}
        oncontextmenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!markersExiting) startEditAnnotation(annotation);
        }}
        role="button"
        tabindex="0"
      >
        {#if showDeleteState}
          <IconClose size={isMulti ? 12 : 10} />
        {:else}
          <span
            class={renumberFrom !== null && globalIndex >= renumberFrom ? styles.renumber : ''}
          >
            {globalIndex + 1}
          </span>
        {/if}
        {#if isHovered && !editingAnnotation}
          <div
            class="{styles.markerTooltip} {!isDarkMode ? styles.light : ''} {styles.enter}"
            style={getTooltipPosition(annotation)}
          >
            <span class={styles.markerQuote}>
              {annotation.element}
              {#if annotation.selectedText}
                {` "${annotation.selectedText.slice(0, 30)}${annotation.selectedText.length > 30 ? '...' : ''}"`}
              {/if}
            </span>
            <span class={styles.markerNote}>
              {annotation.comment}
            </span>
          </div>
        {/if}
      </div>
    {/each}

    <!-- Exiting markers (fixed) -->
    {#if !markersExiting}
      {#each exitingAnnotationsList.filter((a) => a.isFixed) as annotation (annotation.id)}
        {@const isMulti = annotation.isMultiSelect}
        <div
          class="{styles.marker} {styles.fixed} {styles.hovered} {isMulti
            ? styles.multiSelect
            : ''} {styles.exit}"
          data-annotation-marker
          style="left: {annotation.x}%; top: {annotation.y}px;"
        >
          <IconClose size={isMulti ? 12 : 10} />
        </div>
      {/each}
    {/if}
  {/if}
</div>

<!-- Interactive overlay -->
{#if isActive}
  <div
    class={styles.overlay}
    data-feedback-toolbar
    style={pendingAnnotation || editingAnnotation ? 'z-index: 99999;' : ''}
  >
    <!-- Hover highlight -->
    {#if hoverInfo?.rect && !pendingAnnotation && !isScrolling && !isDragging}
      <div
        class="{styles.hoverHighlight} {styles.enter}"
        style="left: {hoverInfo.rect.left}px; top: {hoverInfo.rect.top}px; width: {hoverInfo.rect
          .width}px; height: {hoverInfo.rect.height}px; border-color: {settings.annotationColor}80; background-color: {settings.annotationColor}0A;"
      ></div>
    {/if}

    <!-- Marker hover outline -->
    {#if hoveredMarkerId && !pendingAnnotation}
      {@const hoveredAnnotation = annotations.find((a) => a.id === hoveredMarkerId)}
      {#if hoveredAnnotation?.boundingBox}
        {@const bb = hoveredAnnotation.boundingBox}
        {@const isMulti = hoveredAnnotation.isMultiSelect}
        <div
          class="{isMulti ? styles.multiSelectOutline : styles.singleSelectOutline} {styles.enter}"
          style="left: {bb.x}px; top: {bb.y - scrollY}px; width: {bb.width}px; height: {bb.height}px; {isMulti
            ? ''
            : `border-color: ${settings.annotationColor}99; background-color: ${settings.annotationColor}0D;`}"
        ></div>
      {/if}
    {/if}

    <!-- Hover tooltip -->
    {#if hoverInfo && !pendingAnnotation && !isScrolling && !isDragging}
      <div
        class="{styles.hoverTooltip} {styles.enter}"
        style="left: {Math.max(8, Math.min(hoverPosition.x, window.innerWidth - 100))}px; top: {Math.max(
          hoverPosition.y - 32,
          8
        )}px;"
      >
        {hoverInfo.element}
      </div>
    {/if}

    <!-- Pending annotation marker + popup -->
    {#if pendingAnnotation}
      <!-- Show element/area outline while adding annotation -->
      {#if pendingAnnotation.boundingBox}
        <div
          class="{pendingAnnotation.isMultiSelect
            ? styles.multiSelectOutline
            : styles.singleSelectOutline} {pendingExiting ? styles.exit : styles.enter}"
          style="left: {pendingAnnotation.boundingBox.x}px; top: {pendingAnnotation.boundingBox.y -
            scrollY}px; width: {pendingAnnotation.boundingBox.width}px; height: {pendingAnnotation
            .boundingBox.height}px; {pendingAnnotation.isMultiSelect
            ? ''
            : `border-color: ${settings.annotationColor}99; background-color: ${settings.annotationColor}0D;`}"
        ></div>
      {/if}

      <div
        class="{styles.marker} {styles.pending} {pendingAnnotation.isMultiSelect
          ? styles.multiSelect
          : ''} {pendingExiting ? styles.exit : styles.enter}"
        style="left: {pendingAnnotation.x}%; top: {pendingAnnotation.clientY}px; background-color: {pendingAnnotation.isMultiSelect
          ? '#34C759'
          : settings.annotationColor};"
      >
        <IconPlus size={12} />
      </div>

      <AnnotationPopupCSS
        bind:this={popupRef}
        element={pendingAnnotation.element}
        selectedText={pendingAnnotation.selectedText}
        placeholder={pendingAnnotation.element === 'Area selection'
          ? 'What should change in this area?'
          : pendingAnnotation.isMultiSelect
            ? 'Feedback for this group of elements...'
            : 'What should change?'}
        onSubmit={addAnnotation}
        onCancel={cancelAnnotation}
        isExiting={pendingExiting}
        lightMode={!isDarkMode}
        accentColor={pendingAnnotation.isMultiSelect ? '#34C759' : settings.annotationColor}
        style="left: {Math.max(
          160,
          Math.min(window.innerWidth - 160, (pendingAnnotation.x / 100) * window.innerWidth)
        )}px; top: {Math.max(
          20,
          Math.min(pendingAnnotation.clientY + 20, window.innerHeight - 180)
        )}px;"
      />
    {/if}

    <!-- Edit annotation popup -->
    {#if editingAnnotation}
      <!-- Show element/area outline while editing -->
      {#if editingAnnotation.boundingBox}
        <div
          class="{editingAnnotation.isMultiSelect
            ? styles.multiSelectOutline
            : styles.singleSelectOutline} {styles.enter}"
          style="left: {editingAnnotation.boundingBox.x}px; top: {editingAnnotation.boundingBox.y -
            scrollY}px; width: {editingAnnotation.boundingBox.width}px; height: {editingAnnotation
            .boundingBox.height}px; {editingAnnotation.isMultiSelect
            ? ''
            : `border-color: ${settings.annotationColor}99; background-color: ${settings.annotationColor}0D;`}"
        ></div>
      {/if}

      <AnnotationPopupCSS
        bind:this={editPopupRef}
        element={editingAnnotation.element}
        selectedText={editingAnnotation.selectedText}
        placeholder="Edit your feedback..."
        initialValue={editingAnnotation.comment}
        submitLabel="Save"
        onSubmit={updateAnnotation}
        onCancel={cancelEditAnnotation}
        isExiting={editExiting}
        lightMode={!isDarkMode}
        accentColor={editingAnnotation.isMultiSelect ? '#34C759' : settings.annotationColor}
        style="left: {Math.max(
          160,
          Math.min(window.innerWidth - 160, (editingAnnotation.x / 100) * window.innerWidth)
        )}px; top: {Math.max(
          20,
          Math.min(
            (editingAnnotation.isFixed ? editingAnnotation.y : editingAnnotation.y - scrollY) + 20,
            window.innerHeight - 180
          )
        )}px;"
      />
    {/if}

    <!-- Drag selection -->
    {#if isDragging}
      <div bind:this={dragRectRef} class={styles.dragSelection}></div>
      <div bind:this={highlightsContainerRef} class={styles.highlightsContainer}></div>
    {/if}
  </div>
{/if}
