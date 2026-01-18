import * as react from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

type DemoAnnotation$1 = {
    selector: string;
    comment: string;
    selectedText?: string;
};
type PageFeedbackToolbarProps = {
    /**
     * Demo annotations that animate in on page load.
     * Each annotation targets an element by CSS selector.
     */
    demoAnnotations?: DemoAnnotation$1[];
    /**
     * Delay in ms before demo annotations start appearing.
     * Default: 1000
     */
    demoDelay?: number;
};
declare function PageFeedbackToolbar({ demoAnnotations, demoDelay, }?: PageFeedbackToolbarProps): react.ReactPortal | null;

type DemoAnnotation = {
    selector: string;
    comment: string;
    selectedText?: string;
};
type PageFeedbackToolbarCSSProps = {
    demoAnnotations?: DemoAnnotation[];
    demoDelay?: number;
};
declare function PageFeedbackToolbarCSS({ demoAnnotations, demoDelay, }?: PageFeedbackToolbarCSSProps): react.ReactPortal | null;

interface AnnotationPopupProps {
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
interface AnnotationPopupHandle {
    /** Shake the popup (e.g., when user clicks outside) */
    shake: () => void;
}
declare const AnnotationPopup: react.ForwardRefExoticComponent<AnnotationPopupProps & react.RefAttributes<AnnotationPopupHandle>>;
declare function AnnotationPopupPresence({ isOpen, ...props }: AnnotationPopupProps & {
    isOpen: boolean;
}): react_jsx_runtime.JSX.Element;

interface AnnotationPopupCSSProps {
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
    /** Custom color for submit button and textarea focus (hex) */
    accentColor?: string;
}
interface AnnotationPopupCSSHandle {
    /** Shake the popup (e.g., when user clicks outside) */
    shake: () => void;
}
declare const AnnotationPopupCSS: react.ForwardRefExoticComponent<AnnotationPopupCSSProps & react.RefAttributes<AnnotationPopupCSSHandle>>;

declare const IconFeedback: ({ size }: {
    size?: number;
}) => react_jsx_runtime.JSX.Element;
declare const IconPlay: ({ size }: {
    size?: number;
}) => react_jsx_runtime.JSX.Element;
declare const IconPause: ({ size }: {
    size?: number;
}) => react_jsx_runtime.JSX.Element;
declare const EyeMorphIcon: ({ size, visible }: {
    size?: number;
    visible: boolean;
}) => react_jsx_runtime.JSX.Element;
declare const CopyMorphIcon: ({ size, checked }: {
    size?: number;
    checked: boolean;
}) => react_jsx_runtime.JSX.Element;
declare const TrashMorphIcon: ({ size, checked }: {
    size?: number;
    checked: boolean;
}) => react_jsx_runtime.JSX.Element;
declare const IconExternal: ({ size }: {
    size?: number;
}) => react_jsx_runtime.JSX.Element;
declare const IconChevronDown: ({ size }: {
    size?: number;
}) => react_jsx_runtime.JSX.Element;
declare const IconClose: ({ size }: {
    size?: number;
}) => react_jsx_runtime.JSX.Element;
declare const IconPlus: ({ size }: {
    size?: number;
}) => react_jsx_runtime.JSX.Element;
declare const IconSettings: ({ size }: {
    size?: number;
}) => react_jsx_runtime.JSX.Element;
declare const IconDocument: ({ size }: {
    size?: number;
}) => react_jsx_runtime.JSX.Element;
declare const IconCheck: ({ size }: {
    size?: number;
}) => react_jsx_runtime.JSX.Element;
declare const IconPalette: ({ size }: {
    size?: number;
}) => react_jsx_runtime.JSX.Element;

/**
 * Gets a readable path for an element (e.g., "article > section > p")
 */
declare function getElementPath(target: HTMLElement, maxDepth?: number): string;
/**
 * Identifies an element and returns a human-readable name + path
 */
declare function identifyElement(target: HTMLElement): {
    name: string;
    path: string;
};
/**
 * Gets text content from element and siblings for context
 */
declare function getNearbyText(element: HTMLElement): string;
/**
 * Simplified element identifier for animation feedback (less verbose)
 */
declare function identifyAnimationElement(target: HTMLElement): string;
/**
 * Gets CSS class names from an element (cleaned of module hashes)
 */
declare function getElementClasses(target: HTMLElement): string;

type Annotation = {
    id: string;
    x: number;
    y: number;
    comment: string;
    element: string;
    elementPath: string;
    timestamp: number;
    selectedText?: string;
    boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    nearbyText?: string;
    cssClasses?: string;
    nearbyElements?: string;
    computedStyles?: string;
    fullPath?: string;
    accessibility?: string;
    isMultiSelect?: boolean;
    isFixed?: boolean;
};

declare function getStorageKey(pathname: string): string;
declare function loadAnnotations<T = Annotation>(pathname: string): T[];
declare function saveAnnotations<T = Annotation>(pathname: string, annotations: T[]): void;

export { PageFeedbackToolbar as Agentation, PageFeedbackToolbarCSS as AgentationCSS, type Annotation, AnnotationPopup, AnnotationPopupCSS, type AnnotationPopupCSSHandle, type AnnotationPopupCSSProps, type AnnotationPopupHandle, AnnotationPopupPresence, type AnnotationPopupProps, CopyMorphIcon, type DemoAnnotation$1 as DemoAnnotation, EyeMorphIcon, PageFeedbackToolbar as FeedbackToolbar, IconCheck, IconChevronDown, IconClose, IconDocument, IconExternal, IconFeedback, IconPalette, IconPause, IconPlay, IconPlus, IconSettings, PageFeedbackToolbar, PageFeedbackToolbarCSS, TrashMorphIcon, getElementClasses, getElementPath, getNearbyText, getStorageKey, identifyAnimationElement, identifyElement, loadAnnotations, saveAnnotations };
