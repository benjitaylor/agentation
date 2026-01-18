import * as react from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

declare function PageFeedbackToolbar(): react.ReactPortal | null;

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
};

declare function getStorageKey(pathname: string): string;
declare function loadAnnotations<T = Annotation>(pathname: string): T[];
declare function saveAnnotations<T = Annotation>(pathname: string, annotations: T[]): void;

export { type Annotation, AnnotationPopup, type AnnotationPopupHandle, AnnotationPopupPresence, type AnnotationPopupProps, CopyMorphIcon, EyeMorphIcon, PageFeedbackToolbar as FeedbackToolbar, IconChevronDown, IconClose, IconExternal, IconFeedback, IconPause, IconPlay, IconPlus, PageFeedbackToolbar, TrashMorphIcon, getElementClasses, getElementPath, getNearbyText, getStorageKey, identifyAnimationElement, identifyElement, loadAnnotations, saveAnnotations };
