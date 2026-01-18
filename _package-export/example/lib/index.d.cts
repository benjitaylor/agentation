import * as react from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';

declare function PageFeedbackToolbar(): react.ReactPortal | null;

declare function PageFeedbackToolbarCSS(): react.ReactPortal | null;

interface AnnotationPopupProps$1 {
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
interface AnnotationPopupHandle$1 {
    /** Shake the popup (e.g., when user clicks outside) */
    shake: () => void;
}
declare const AnnotationPopup: react.ForwardRefExoticComponent<AnnotationPopupProps$1 & react.RefAttributes<AnnotationPopupHandle$1>>;
declare function AnnotationPopupPresence({ isOpen, ...props }: AnnotationPopupProps$1 & {
    isOpen: boolean;
}): react_jsx_runtime.JSX.Element;

interface AnnotationPopupProps {
    element: string;
    timestamp?: string;
    selectedText?: string;
    placeholder?: string;
    onSubmit: (text: string) => void;
    onCancel: () => void;
    style?: React.CSSProperties;
    variant?: "blue" | "green";
}
interface AnnotationPopupHandle {
    shake: () => void;
}
declare const AnnotationPopupCSS: react.ForwardRefExoticComponent<AnnotationPopupProps & react.RefAttributes<AnnotationPopupHandle>>;

declare const IconFeedback$1: ({ size }: {
    size?: number;
}) => react_jsx_runtime.JSX.Element;
declare const IconPlay$1: ({ size }: {
    size?: number;
}) => react_jsx_runtime.JSX.Element;
declare const IconPause$1: ({ size }: {
    size?: number;
}) => react_jsx_runtime.JSX.Element;
declare const EyeMorphIcon$1: ({ size, visible }: {
    size?: number;
    visible: boolean;
}) => react_jsx_runtime.JSX.Element;
declare const CopyMorphIcon$1: ({ size, checked }: {
    size?: number;
    checked: boolean;
}) => react_jsx_runtime.JSX.Element;
declare const TrashMorphIcon$1: ({ size, checked }: {
    size?: number;
    checked: boolean;
}) => react_jsx_runtime.JSX.Element;
declare const IconExternal$1: ({ size }: {
    size?: number;
}) => react_jsx_runtime.JSX.Element;
declare const IconChevronDown$1: ({ size }: {
    size?: number;
}) => react_jsx_runtime.JSX.Element;
declare const IconClose$1: ({ size }: {
    size?: number;
}) => react_jsx_runtime.JSX.Element;
declare const IconPlus$1: ({ size }: {
    size?: number;
}) => react_jsx_runtime.JSX.Element;

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

declare const iconsCss_CopyMorphIcon: typeof CopyMorphIcon;
declare const iconsCss_EyeMorphIcon: typeof EyeMorphIcon;
declare const iconsCss_IconChevronDown: typeof IconChevronDown;
declare const iconsCss_IconClose: typeof IconClose;
declare const iconsCss_IconExternal: typeof IconExternal;
declare const iconsCss_IconFeedback: typeof IconFeedback;
declare const iconsCss_IconPause: typeof IconPause;
declare const iconsCss_IconPlay: typeof IconPlay;
declare const iconsCss_IconPlus: typeof IconPlus;
declare const iconsCss_TrashMorphIcon: typeof TrashMorphIcon;
declare namespace iconsCss {
  export { iconsCss_CopyMorphIcon as CopyMorphIcon, iconsCss_EyeMorphIcon as EyeMorphIcon, iconsCss_IconChevronDown as IconChevronDown, iconsCss_IconClose as IconClose, iconsCss_IconExternal as IconExternal, iconsCss_IconFeedback as IconFeedback, iconsCss_IconPause as IconPause, iconsCss_IconPlay as IconPlay, iconsCss_IconPlus as IconPlus, iconsCss_TrashMorphIcon as TrashMorphIcon };
}

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

export { PageFeedbackToolbar as Agentation, PageFeedbackToolbarCSS as AgentationCSS, type Annotation, AnnotationPopup, AnnotationPopupCSS, type AnnotationPopupHandle$1 as AnnotationPopupHandle, AnnotationPopupPresence, type AnnotationPopupProps$1 as AnnotationPopupProps, CopyMorphIcon$1 as CopyMorphIcon, EyeMorphIcon$1 as EyeMorphIcon, PageFeedbackToolbar as FeedbackToolbar, IconChevronDown$1 as IconChevronDown, IconClose$1 as IconClose, IconExternal$1 as IconExternal, IconFeedback$1 as IconFeedback, IconPause$1 as IconPause, IconPlay$1 as IconPlay, IconPlus$1 as IconPlus, iconsCss as IconsCSS, PageFeedbackToolbar, PageFeedbackToolbarCSS, TrashMorphIcon$1 as TrashMorphIcon, getElementClasses, getElementPath, getNearbyText, getStorageKey, identifyAnimationElement, identifyElement, loadAnnotations, saveAnnotations };
