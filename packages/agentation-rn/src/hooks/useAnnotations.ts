import { useState, useCallback } from 'react';
import { Platform, Dimensions, PixelRatio } from 'react-native';
import { debugError } from '../utils/debug';
import type { Annotation, OutputDetailLevel } from '../types';
import { generateId, getTimestamp, copyToClipboard } from '../utils/helpers';
import { detectComponentAtPoint, formatElementPath, getComponentType } from '../utils/componentDetection';
import { generateMarkdown } from '../utils/markdownGeneration';
import { getNavigationInfo, NavigationResolver } from '../utils/navigationDetection';

export interface UseAnnotationsOptions {
  initialAnnotations?: Annotation[];
  onAnnotationAdd?: (annotation: Annotation) => void;
  onAnnotationUpdate?: (annotation: Annotation) => void;
  onAnnotationDelete?: (annotation: Annotation) => void;
  onCopy?: (markdown: string) => void;
  copyToClipboard?: boolean;
  navigationResolver?: NavigationResolver;
}

export interface UseAnnotationsReturn {
  annotations: Annotation[];
  createAnnotation: (
    x: number,
    y: number,
    viewInstance: unknown,
    comment: string
  ) => Promise<Annotation | null>;
  updateAnnotation: (id: string, comment: string) => void;
  deleteAnnotation: (id: string) => void;
  clearAll: () => void;
  copyMarkdown: (outputDetail?: OutputDetailLevel) => Promise<void>;
  getAnnotation: (id: string) => Annotation | undefined;
}

export function useAnnotations(
  options: UseAnnotationsOptions
): UseAnnotationsReturn {
  const {
    initialAnnotations = [],
    onAnnotationAdd,
    onAnnotationUpdate,
    onAnnotationDelete,
    onCopy,
    copyToClipboard: shouldCopyToClipboard = true,
    navigationResolver,
  } = options;

  const [annotations, setAnnotations] = useState<Annotation[]>(initialAnnotations);

  const createAnnotation = useCallback(
    async (
      x: number,
      y: number,
      viewInstance: unknown,
      comment: string
    ): Promise<Annotation | null> => {
      try {
        const detection = await detectComponentAtPoint(viewInstance, x, y);

        if (!detection.success || !detection.codeInfo) {
          debugError('Component detection failed:', detection.error);
          return null;
        }

        const {
          codeInfo,
          bounds,
          parentComponents,
          accessibility,
          testID,
          textContent,
          fullPath,
          nearbyElements,
          isFixed,
        } = detection;

        const screenDims = Dimensions.get('window');
        const navInfo = getNavigationInfo(navigationResolver);

        const annotation: Annotation = {
          id: generateId(),
          x,
          y,
          comment,
          element: codeInfo.componentName || 'Unknown',
          elementPath: formatElementPath(codeInfo),
          timestamp: getTimestamp(),
          componentType: getComponentType(codeInfo),
          sourcePath: codeInfo.relativePath,
          lineNumber: codeInfo.lineNumber,
          columnNumber: codeInfo.columnNumber,
          boundingBox: bounds || undefined,
          parentComponents,
          accessibility,
          testID,
          nearbyText: textContent,
          fullPath,
          nearbyElements,
          isFixed,
          routeName: navInfo?.routeName,
          routeParams: navInfo?.routeParams,
          navigationPath: navInfo?.navigationPath,
          platform: Platform.OS as 'ios' | 'android' | 'web',
          screenDimensions: {
            width: screenDims.width,
            height: screenDims.height,
          },
          pixelRatio: PixelRatio.get(),
        };

        setAnnotations(prev => [...prev, annotation]);
        onAnnotationAdd?.(annotation);

        return annotation;
      } catch (error) {
        debugError('Failed to create annotation:', error);
        return null;
      }
    },
    [navigationResolver, onAnnotationAdd]
  );

  const updateAnnotation = useCallback(
    (id: string, comment: string) => {
      const existing = annotations.find(a => a.id === id);
      if (!existing) return;

      const updated = { ...existing, comment, timestamp: getTimestamp() };
      setAnnotations(prev => prev.map(ann => ann.id === id ? updated : ann));
      onAnnotationUpdate?.(updated);
    },
    [annotations, onAnnotationUpdate]
  );

  const deleteAnnotation = useCallback(
    (id: string) => {
      const annotation = annotations.find(a => a.id === id);
      if (!annotation) return;

      setAnnotations(prev => prev.filter(ann => ann.id !== id));
      onAnnotationDelete?.(annotation);
    },
    [annotations, onAnnotationDelete]
  );

  const clearAll = useCallback(() => {
    setAnnotations([]);
  }, []);

  const copyMarkdownFn = useCallback(async (outputDetail?: OutputDetailLevel) => {
    try {
      const output = generateMarkdown(annotations, outputDetail);

      if (shouldCopyToClipboard) {
        await copyToClipboard(output.content);
      }

      onCopy?.(output.content);
    } catch (error) {
      debugError('Failed to copy markdown:', error);
      throw error;
    }
  }, [annotations, onCopy, shouldCopyToClipboard]);

  const getAnnotation = useCallback(
    (id: string) => {
      return annotations.find(ann => ann.id === id);
    },
    [annotations]
  );

  return {
    annotations,
    createAnnotation,
    updateAnnotation,
    deleteAnnotation,
    clearAll,
    copyMarkdown: copyMarkdownFn,
    getAnnotation,
  };
}
