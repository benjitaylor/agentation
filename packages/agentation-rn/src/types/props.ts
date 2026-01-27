import type { Annotation, DemoAnnotation } from './annotation';

export interface AgenationProps {
  children: React.ReactNode;
  demoAnnotations?: DemoAnnotation[];
  onAnnotationAdd?: (annotation: Annotation) => void;
  onAnnotationDelete?: (annotation: Annotation) => void;
  onAnnotationUpdate?: (annotation: Annotation) => void;
  onAnnotationsClear?: (annotations: Annotation[]) => void;
  onCopy?: (markdown: string) => void;
  copyToClipboard?: boolean;
  disabled?: boolean;
  toolbarOffset?: {
    x?: number;
    y?: number;
  };
}

export type AgentationProps = AgenationProps;

export interface AnnotationMarkerProps {
  annotation: Annotation;
  index: number;
  isSelected: boolean;
  onPress: () => void;
}

export interface AnnotationPopupProps {
  annotation: Annotation | null;
  position: { x: number; y: number };
  visible: boolean;
  onSave: (comment: string) => void;
  onCancel: () => void;
  onDelete?: () => void;
}
