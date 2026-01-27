import { debugLog } from './debug';

export interface FiberCodeInfo {
  fileName: string;
  lineNumber: number;
  columnNumber?: number;
  componentName?: string;
}

export interface InspectorData {
  hierarchy: Array<{
    name: string;
    source?: {
      fileName: string;
      lineNumber: number;
      columnNumber?: number;
    };
    getInspectorData?: (findNodeHandle: (instance: unknown) => number | null) => {
      props: Record<string, unknown>;
      measure: (callback: (x: number, y: number, width: number, height: number, left: number, top: number) => void) => void;
    };
  }>;
  selectedIndex: number;
  frame: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  touchedViewTag?: number;
}

interface FiberNode {
  type: unknown;
  _debugSource?: {
    fileName?: string;
    lineNumber?: number;
    columnNumber?: number;
  };
  memoizedProps?: Record<string, unknown>;
  pendingProps?: Record<string, unknown>;
  stateNode?: { _nativeTag?: number };
  return: FiberNode | null;
  child: FiberNode | null;
  sibling: FiberNode | null;
}

interface ReactRenderer {
  rendererConfig?: {
    getInspectorDataForViewAtPoint?: (
      viewRef: unknown,
      x: number,
      y: number,
      callback: (data: InspectorData | null) => void
    ) => void;
  };
  findFiberByHostInstance?: (instance: unknown) => FiberNode | null;
}

declare global {
  var __REACT_DEVTOOLS_GLOBAL_HOOK__: {
    renderers?: Map<number, ReactRenderer>;
    getFiberRoots?: (rendererId: number) => Set<{ current: FiberNode }>;
  } | undefined;
}

export function getInspectorDataForViewAtPoint(
  viewRef: unknown,
  x: number,
  y: number
): Promise<InspectorData | null> {
  return new Promise((resolve) => {
    const hook = global.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!hook || !hook.renderers) {
      debugLog(' No DevTools hook');
      resolve(null);
      return;
    }

    debugLog(' Renderers available:', hook.renderers.size);

    for (const [rendererId, renderer] of hook.renderers) {
      const hasAPI = !!renderer?.rendererConfig?.getInspectorDataForViewAtPoint;
      debugLog(' Renderer', rendererId, 'has rendererConfig.getInspectorDataForViewAtPoint:', hasAPI);

      if (renderer?.rendererConfig?.getInspectorDataForViewAtPoint) {
        try {
          renderer.rendererConfig.getInspectorDataForViewAtPoint(
            viewRef,
            x,
            y,
            (data: InspectorData | null) => {
              debugLog(' Inspector data received');
              if (data) {
                debugLog(' Hierarchy length:', data.hierarchy?.length);
                debugLog(' Selected index:', data.selectedIndex);
                data.hierarchy?.forEach((item, i) => {
                  debugLog(`Hierarchy[${i}]: name=${item.name}, hasSource=${!!item.source}`);
                  if (item.source) {
                    debugLog(`  Source: ${item.source.fileName}:${item.source.lineNumber}`);
                  }
                });
              } else {
                debugLog(' No data returned from inspector');
              }
              resolve(data);
            }
          );
          return;
        } catch (e) {
          debugLog(' getInspectorDataForViewAtPoint error:', e);
        }
      }
    }

    resolve(null);
  });
}

export function getFiberFromInstance(instance: unknown): FiberNode | null {
  if (!instance) return null;

  if (typeof instance === 'number') {
    return getFiberFromNativeTag(instance);
  }

  if (typeof instance === 'object' && instance !== null) {
    const obj = instance as Record<string, FiberNode>;
    for (const key of Object.keys(obj)) {
      if (key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$')) {
        return obj[key];
      }
    }

    const hook = global.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (hook && hook.renderers) {
      for (const [, renderer] of hook.renderers) {
        if (renderer.findFiberByHostInstance) {
          try {
            const fiber = renderer.findFiberByHostInstance(instance);
            if (fiber) return fiber;
          } catch (e) {
            // Ignore
          }
        }
      }
    }
  }

  return null;
}

function getFiberFromNativeTag(tag: number): FiberNode | null {
  debugLog(' getFiberFromNativeTag called with tag:', tag);
  const hook = global.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!hook || !hook.renderers || !hook.getFiberRoots) {
    debugLog(' Missing hook parts:', {
      hook: !!hook,
      renderers: !!hook?.renderers,
      getFiberRoots: !!hook?.getFiberRoots,
    });
    return null;
  }

  for (const [rendererId] of hook.renderers) {
    const roots = hook.getFiberRoots(rendererId);
    debugLog(' Renderer', rendererId, 'roots:', roots?.size || 0);
    for (const root of roots) {
      const fiber = findFiberByNativeTag(root.current, tag);
      if (fiber) {
        debugLog(' Found fiber for tag', tag);
        return fiber;
      }
    }
  }
  debugLog(' No fiber found for tag', tag);
  return null;
}

function findFiberByNativeTag(fiber: FiberNode | null, tag: number): FiberNode | null {
  if (!fiber) return null;
  if (fiber.stateNode && fiber.stateNode._nativeTag === tag) return fiber;
  const childResult = findFiberByNativeTag(fiber.child, tag);
  if (childResult) return childResult;
  return findFiberByNativeTag(fiber.sibling, tag);
}

export function findNearestUserComponentWithSource(fiber: FiberNode | null): FiberCodeInfo | null {
  if (!fiber) return null;

  let current: FiberNode | null = fiber;
  let iterations = 0;

  while (current && iterations < 50) {
    iterations++;

    if (current._debugSource) {
      debugLog(' Found _debugSource on fiber');
      return {
        fileName: current._debugSource.fileName || 'unknown',
        lineNumber: current._debugSource.lineNumber || 0,
        columnNumber: current._debugSource.columnNumber,
        componentName: getComponentName(current),
      };
    }

    const props = current.memoizedProps || current.pendingProps;
    if (props && (props as Record<string, unknown>).__callerSource) {
      const callerSource = (props as Record<string, unknown>).__callerSource as {
        fileName?: string;
        lineNumber?: number;
        columnNumber?: number;
      };
      debugLog(' Found __callerSource in props:', JSON.stringify(callerSource));
      return {
        fileName: callerSource.fileName || 'unknown',
        lineNumber: callerSource.lineNumber || 0,
        columnNumber: callerSource.columnNumber,
        componentName: getComponentName(current),
      };
    }

    current = current.return;
  }

  return null;
}

export function findNearestUserComponent(fiber: FiberNode | null): FiberCodeInfo | null {
  if (!fiber) return null;

  let current: FiberNode | null = fiber;
  let iterations = 0;
  let hostName: string | null = null;

  while (current && iterations < 50) {
    iterations++;
    const type = current.type;

    if (type && typeof type === 'string' && !hostName) {
      hostName = type;
    }

    if (type && typeof type === 'function') {
      const funcType = type as { displayName?: string; name?: string };
      const name = funcType.displayName || funcType.name;
      if (name && name !== 'Anonymous' && !name.startsWith('_')) {
        return {
          fileName: 'unknown',
          lineNumber: 0,
          componentName: name,
        };
      }
    }

    current = current.return;
  }

  if (hostName) {
    return {
      fileName: 'unknown',
      lineNumber: 0,
      componentName: hostName,
    };
  }

  return null;
}

function getComponentName(fiber: FiberNode): string {
  if (!fiber || !fiber.type) return 'Unknown';
  const type = fiber.type;
  if (typeof type === 'function') {
    const funcType = type as { displayName?: string; name?: string };
    return funcType.displayName || funcType.name || 'Anonymous';
  }
  if (typeof type === 'string') return type;
  return 'Unknown';
}

export function extractRelativePath(absolutePath: string): string {
  if (!absolutePath) return 'unknown';
  const markers = ['/src/', '/app/', '/components/', '/screens/'];
  for (const marker of markers) {
    const index = absolutePath.indexOf(marker);
    if (index !== -1) return absolutePath.slice(index + 1);
  }
  const parts = absolutePath.split('/');
  return parts[parts.length - 1] || absolutePath;
}

export function isComponentDetectionAvailable(): boolean {
  return __DEV__ && !!global.__REACT_DEVTOOLS_GLOBAL_HOOK__;
}
