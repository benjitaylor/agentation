export type OutputDetailLevel = 'compact' | 'standard' | 'detailed' | 'forensic';

export const COLOR_OPTIONS = [
  { value: '#AF52DE', label: 'Purple' },
  { value: '#3c82f7', label: 'Blue' },
  { value: '#5AC8FA', label: 'Cyan' },
  { value: '#34C759', label: 'Green' },
  { value: '#FFD60A', label: 'Yellow' },
  { value: '#FF9500', label: 'Orange' },
  { value: '#FF3B30', label: 'Red' },
] as const;

export type DemoAnnotation = {
  selector: string;
  comment: string;
  selectedText?: string;
};

export interface Annotation {
  id: string;
  x: number;
  y: number;
  comment: string;
  element: string;
  elementPath: string;
  timestamp: number;
  componentType?: string;
  sourcePath?: string;
  lineNumber?: number;
  columnNumber?: number;
  testID?: string;
  selectedText?: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  nearbyText?: string;
  nearbyElements?: string;
  fullPath?: string;
  accessibility?: string;
  parentComponents?: string[];
  isMultiSelect?: boolean;
  isFixed?: boolean;
  routeName?: string;
  routeParams?: Record<string, unknown>;
  navigationPath?: string;
  platform?: 'ios' | 'android' | 'web';
  screenDimensions?: {
    width: number;
    height: number;
  };
  pixelRatio?: number;
}

export type StorageKey = `@agentation:${string}`;

export interface MarkdownOutput {
  content: string;
  count: number;
  screen: string;
  timestamp: number;
}
