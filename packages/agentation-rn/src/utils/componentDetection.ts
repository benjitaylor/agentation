import { debugLog, debugWarn, debugError } from './debug';
import type { CodeInfo, ComponentDetection } from '../types';
import {
  getFiberFromInstance,
  findNearestUserComponentWithSource,
  findNearestUserComponent,
  extractRelativePath,
  isComponentDetectionAvailable as checkAvailability,
  getInspectorDataForViewAtPoint,
  type FiberCodeInfo,
  type InspectorData,
} from './fiberTraversal';

const DETECTION_TIMEOUT = 3000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>(resolve => setTimeout(() => resolve(null), ms)),
  ]);
}

interface MeasurableView {
  measure: (callback: (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => void) => void;
}

function isMeasurable(view: unknown): view is MeasurableView {
  return view !== null && typeof view === 'object' && 'measure' in view && typeof (view as MeasurableView).measure === 'function';
}

async function measureView(viewInstance: unknown): Promise<{ x: number; y: number; width: number; height: number } | null> {
  return new Promise((resolve) => {
    try {
      if (!isMeasurable(viewInstance)) {
        resolve(null);
        return;
      }

      viewInstance.measure((_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
        resolve({
          x: pageX,
          y: pageY,
          width,
          height,
        });
      });
    } catch (error) {
      debugWarn('Error measuring view:', error);
      resolve(null);
    }
  });
}

function convertCodeInfo(fiberInfo: FiberCodeInfo): CodeInfo {
  return {
    relativePath: extractRelativePath(fiberInfo.fileName),
    lineNumber: fiberInfo.lineNumber,
    columnNumber: fiberInfo.columnNumber,
    componentName: fiberInfo.componentName,
  };
}

export async function detectComponent(
  viewInstance: unknown
): Promise<ComponentDetection> {
  if (!__DEV__) {
    return {
      success: false,
      codeInfo: null,
      bounds: null,
      error: 'Component detection only works in development mode',
    };
  }

  try {
    const fiber = getFiberFromInstance(viewInstance);

    if (fiber) {
      const fiberCodeInfo = findNearestUserComponentWithSource(fiber);
      if (fiberCodeInfo) {
        return {
          success: true,
          codeInfo: convertCodeInfo(fiberCodeInfo),
          bounds: await measureView(viewInstance),
        };
      }

      const componentInfo = findNearestUserComponent(fiber);
      if (componentInfo) {
        return {
          success: true,
          codeInfo: {
            relativePath: 'unknown',
            lineNumber: 0,
            columnNumber: 0,
            componentName: componentInfo.componentName || 'Unknown',
          },
          bounds: await measureView(viewInstance),
        };
      }
    }

    return {
      success: true,
      codeInfo: {
        relativePath: 'Unknown',
        lineNumber: 0,
        columnNumber: 0,
        componentName: 'TappedComponent',
      },
      bounds: await measureView(viewInstance),
      error: 'Could not find component info',
    };
  } catch (error) {
    return {
      success: false,
      codeInfo: null,
      bounds: null,
      error: error instanceof Error ? error.message : 'Unknown error during component detection',
    };
  }
}

interface InspectorProps {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  testID?: string;
  style?: Record<string, unknown> | Array<Record<string, unknown> | null | undefined>;
  children?: unknown;
  __callerSource?: {
    fileName?: string;
    lineNumber?: number;
    columnNumber?: number;
  };
}

export async function detectComponentAtPoint(
  viewRef: unknown,
  x: number,
  y: number
): Promise<ComponentDetection> {
  if (!__DEV__) {
    return {
      success: false,
      codeInfo: null,
      bounds: null,
      error: 'Component detection only works in development mode',
    };
  }

  try {
    const inspectorData = await withTimeout(
      getInspectorDataForViewAtPoint(viewRef, x, y),
      DETECTION_TIMEOUT
    ) as InspectorData | null;

    if (inspectorData && inspectorData.hierarchy && inspectorData.hierarchy.length) {
      const bounds = inspectorData.frame ? {
        x: inspectorData.frame.left,
        y: inspectorData.frame.top,
        width: inspectorData.frame.width,
        height: inspectorData.frame.height,
      } : null;

      const allComponents = inspectorData.hierarchy
        .map(item => item.name)
        .filter(name => name && !name.startsWith('RCT') && name !== 'View');

      const parentComponents = allComponents.slice(0, -1);
      const fullPath = allComponents.join(' > ');
      const nearbyElements = allComponents.slice(-3).join(', ');

      const { findNodeHandle } = require('react-native');

      let accessibility: string | undefined;
      let testID: string | undefined;
      let textContent: string | undefined;
      let isFixed = false;

      for (const item of inspectorData.hierarchy) {
        if (item.source) {
          debugLog(' Found source via hierarchy.source:', item.name);
          return {
            success: true,
            codeInfo: {
              relativePath: extractRelativePath(item.source.fileName),
              lineNumber: item.source.lineNumber,
              columnNumber: item.source.columnNumber,
              componentName: item.name,
            },
            bounds,
            parentComponents,
            accessibility,
            testID,
            textContent,
            fullPath,
            nearbyElements,
            isFixed,
          };
        }
      }

      const startIndex = inspectorData.selectedIndex ?? inspectorData.hierarchy.length - 1;

      for (let i = startIndex; i >= 0; i--) {
        const item = inspectorData.hierarchy[i];
        if (item.getInspectorData) {
          try {
            const data = item.getInspectorData(findNodeHandle);
            const props = (data?.props || {}) as InspectorProps;

            if (!accessibility && (props.accessibilityLabel || props.accessibilityHint || props.accessibilityRole)) {
              const parts: string[] = [];
              if (props.accessibilityRole) parts.push(`role="${props.accessibilityRole}"`);
              if (props.accessibilityLabel) parts.push(`label="${props.accessibilityLabel}"`);
              if (props.accessibilityHint) parts.push(`hint="${props.accessibilityHint}"`);
              accessibility = parts.join(', ');
            }

            if (!testID && props.testID) {
              testID = props.testID;
            }

            if (props.style) {
              const style = Array.isArray(props.style)
                ? Object.assign({}, ...props.style.filter(Boolean))
                : props.style;
              if (style.position === 'absolute' || style.position === 'fixed') {
                isFixed = true;
              }
            }

            if (!textContent && item.name === 'Text' && props.children) {
              const text = typeof props.children === 'string' ? props.children :
                          Array.isArray(props.children) ? props.children.filter(c => typeof c === 'string').join('') : '';
              if (text) {
                textContent = text.slice(0, 100);
              }
            }

            if (props.__callerSource) {
              const callerSource = props.__callerSource;
              const fileName = callerSource.fileName || '';

              if (fileName.includes('Agentation') || fileName.includes('node_modules')) {
                debugLog(' Skipping library component:', item.name, fileName);
                continue;
              }

              debugLog(' Found __callerSource via getInspectorData:', item.name, callerSource);
              return {
                success: true,
                codeInfo: {
                  relativePath: extractRelativePath(fileName || 'unknown'),
                  lineNumber: callerSource.lineNumber || 0,
                  columnNumber: callerSource.columnNumber,
                  componentName: item.name,
                },
                bounds,
                parentComponents,
                accessibility,
                testID,
                textContent,
                fullPath,
                nearbyElements,
                isFixed,
              };
            }
          } catch (e) {
            // getInspectorData might fail for some items
          }
        }
      }

      const selectedItem = inspectorData.hierarchy[inspectorData.selectedIndex] ||
                          inspectorData.hierarchy[0];
      debugLog(' No source found, using component name:', selectedItem?.name);
      return {
        success: true,
        codeInfo: {
          relativePath: 'unknown',
          lineNumber: 0,
          columnNumber: 0,
          componentName: selectedItem?.name || 'Unknown',
        },
        bounds,
        parentComponents,
        accessibility,
        testID,
        textContent,
        fullPath,
        nearbyElements,
        isFixed,
      };
    }

    return detectComponent(viewRef);
  } catch (error) {
    debugError('detectComponentAtPoint error:', error);
    return detectComponent(viewRef);
  }
}

export function formatElementPath(codeInfo: CodeInfo): string {
  return `${codeInfo.relativePath}:${codeInfo.lineNumber}`;
}

export function formatElementPathWithColumn(codeInfo: CodeInfo): string {
  if (codeInfo.columnNumber !== undefined) {
    return `${codeInfo.relativePath}:${codeInfo.lineNumber}:${codeInfo.columnNumber}`;
  }
  return formatElementPath(codeInfo);
}

export function getComponentType(codeInfo: CodeInfo): string {
  return codeInfo.componentName || 'Unknown';
}

export function isComponentDetectionAvailable(): boolean {
  return checkAvailability();
}

export function getDetectionErrorMessage(error: string): string {
  if (error.includes('development mode')) {
    return 'Component detection only works in development builds. Make sure __DEV__ is true.';
  }

  if (error.includes('source information')) {
    return 'No source maps found. Make sure you are running a development build with source maps enabled.';
  }

  if (error.includes('React Fiber')) {
    return 'Could not access React internals. This may not be a valid React component.';
  }

  return error;
}
