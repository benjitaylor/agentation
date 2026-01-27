export interface CodeInfo {
  relativePath: string;
  lineNumber: number;
  columnNumber?: number;
  componentName?: string;
}

export interface InspectInfo {
  name: string;
  codeInfo: CodeInfo | null;
}

export interface ComponentDetection {
  success: boolean;
  codeInfo: CodeInfo | null;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  error?: string;
  parentComponents?: string[];
  accessibility?: string;
  testID?: string;
  textContent?: string;
  fullPath?: string;
  nearbyElements?: string;
  isFixed?: boolean;
}
