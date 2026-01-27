import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { debugLog, debugError } from '../utils/debug';
import type { AgenationProps, Annotation, ComponentDetection, DemoAnnotation, AgenationSettings, OutputDetailLevel } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { loadSettings, saveSettings } from '../utils/storage';
import { useAnnotations } from '../hooks/useAnnotations';
import { generateId, getTimestamp, formatDetectedElement } from '../utils/helpers';
import { detectComponentAtPoint } from '../utils/componentDetection';
import { Toolbar } from './Toolbar';
import { AnnotationMarker } from './AnnotationMarker';
import { AnnotationPopup } from './AnnotationPopup';
import { AgenationContext, AgenationContextValue } from '../context/AgenationContext';


export type { AgenationProps };

function convertDemoAnnotations(demoAnnotations: DemoAnnotation[]): Annotation[] {
  return demoAnnotations.map((demo) => {
    const parts = demo.selector.split(':');
    const element = parts[0] || 'Unknown';
    const lineNumber = parts[1] ? parseInt(parts[1], 10) : undefined;

    return {
      id: generateId(),
      x: 0,
      y: 0,
      comment: demo.comment,
      element,
      elementPath: demo.selector,
      timestamp: getTimestamp(),
      selectedText: demo.selectedText,
      lineNumber,
    };
  });
}

function getCurrentRouteName(): string | undefined {
  try {
    const globalNav = (global as any).__REACT_NAVIGATION_DEVTOOLS__;
    if (globalNav?.navigatorRef?.current) {
      const state = globalNav.navigatorRef.current.getRootState?.();
      if (state) {
        let current = state;
        while (current.routes && current.index !== undefined) {
          current = current.routes[current.index];
          if (!current.state) return current.name;
        }
        return current.name;
      }
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export function Agentation({
  children,
  disabled = false,
  demoAnnotations,
  onAnnotationAdd,
  onAnnotationDelete,
  onAnnotationUpdate,
  onAnnotationsClear,
  onCopy,
  copyToClipboard = true,
  toolbarOffset,
}: AgenationProps) {
  const insets = useSafeAreaInsets();

  if (disabled || !__DEV__) {
    return <>{children}</>;
  }

  const toolbarHeight = Math.max(insets.bottom, 16) + 16 + 56 + (toolbarOffset?.y ?? 0);

  const [isActive, setIsActive] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [pendingTap, setPendingTap] = useState<{ x: number; y: number } | null>(null);
  const [pendingDetection, setPendingDetection] = useState<ComponentDetection | null>(null);
  const [currentRoute, setCurrentRoute] = useState<string | undefined>(getCurrentRouteName());
  const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });
  const [settings, setSettings] = useState<AgenationSettings>(DEFAULT_SETTINGS);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const contentRef = useRef<View>(null);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const handleAnnotationColorChange = useCallback((color: string) => {
    const newSettings = { ...settings, annotationColor: color };
    setSettings(newSettings);
    saveSettings({ annotationColor: color });
  }, [settings]);

  const handleClearAfterCopyChange = useCallback((value: boolean) => {
    const newSettings = { ...settings, clearAfterCopy: value };
    setSettings(newSettings);
    saveSettings({ clearAfterCopy: value });
  }, [settings]);

  const handleOutputDetailChange = useCallback((level: OutputDetailLevel) => {
    const newSettings = { ...settings, outputDetail: level };
    setSettings(newSettings);
    saveSettings({ outputDetail: level });
  }, [settings]);

  const handleSettingsMenuChange = useCallback((isOpen: boolean) => {
    setIsSettingsMenuOpen(isOpen);
  }, []);

  const handleShowMarkersChange = useCallback((show: boolean) => {
    setShowMarkers(show);
  }, []);

  const reportScrollOffset = useCallback((x: number, y: number) => {
    setScrollOffset({ x, y });
  }, []);

  const contextValue = useMemo<AgenationContextValue>(() => ({
    reportScrollOffset,
    scrollOffset,
    isDarkMode,
    setIsDarkMode,
  }), [reportScrollOffset, scrollOffset, isDarkMode]);

  const updateCurrentRoute = useCallback(() => {
    const route = getCurrentRouteName();
    if (route !== currentRoute) {
      setCurrentRoute(route);
    }
  }, [currentRoute]);

  const initialAnnotations = useMemo(() => {
    if (!demoAnnotations || !demoAnnotations.length) {
      return undefined;
    }
    return convertDemoAnnotations(demoAnnotations);
  }, [demoAnnotations]);

  const {
    annotations,
    createAnnotation,
    updateAnnotation,
    deleteAnnotation,
    clearAll,
    copyMarkdown,
  } = useAnnotations({
    initialAnnotations,
    onAnnotationAdd,
    onAnnotationUpdate,
    onAnnotationDelete,
    onCopy,
    copyToClipboard,
  });

  const handleToggleMode = useCallback(() => {
    setIsActive(prev => {
      const newMode = !prev;
      if (!newMode) {
        setSelectedAnnotation(null);
        setPopupVisible(false);
        setPendingTap(null);
        setPendingDetection(null);
      }
      return newMode;
    });
  }, []);

  const handleOverlayStartShouldSetResponder = useCallback(
    (e: GestureResponderEvent): boolean => {
      const touch = e.nativeEvent.touches?.[0] || e.nativeEvent;
      const locationX = touch.locationX ?? touch.pageX;
      const locationY = touch.locationY ?? touch.pageY;

      debugLog('Overlay touch at:', locationX, locationY);

      setPendingTap({ x: locationX, y: locationY });
      setSelectedAnnotation(null);
      setPendingDetection(null);
      setPopupVisible(true);

      detectComponentAtPoint(contentRef.current, locationX, locationY)
        .then(detection => {
          setPendingDetection(detection);
        })
        .catch((e) => debugError('Detection failed:', e));

      return true;
    },
    []
  );

  const handleMarkerPress = useCallback((annotation: Annotation) => {
    setSelectedAnnotation(annotation);
    setPendingTap({ x: annotation.x, y: annotation.y });
    setPopupVisible(true);
  }, []);

  const handleMarkerEdit = useCallback((annotation: Annotation) => {
    setSelectedAnnotation(annotation);
    setPendingTap({ x: annotation.x, y: annotation.y });
    setPopupVisible(true);
  }, []);

  const handleMarkerDelete = useCallback(
    (id: string) => {
      deleteAnnotation(id);
    },
    [deleteAnnotation]
  );

  const handlePopupSave = useCallback(
    async (comment: string) => {
      updateCurrentRoute();

      if (selectedAnnotation) {
        updateAnnotation(selectedAnnotation.id, comment);
      } else if (pendingTap) {
        await createAnnotation(
          pendingTap.x,
          pendingTap.y,
          contentRef.current,
          comment
        );
      }

      setPopupVisible(false);
      setPendingTap(null);
      setSelectedAnnotation(null);
      setPendingDetection(null);
    },
    [selectedAnnotation, pendingTap, updateAnnotation, createAnnotation, updateCurrentRoute]
  );

  const handlePopupCancel = useCallback(() => {
    setPopupVisible(false);
    setPendingTap(null);
    setSelectedAnnotation(null);
    setPendingDetection(null);
  }, []);

  const handlePopupDelete = useCallback(() => {
    if (selectedAnnotation) {
      deleteAnnotation(selectedAnnotation.id);
    }
    setPopupVisible(false);
    setPendingTap(null);
    setSelectedAnnotation(null);
  }, [selectedAnnotation, deleteAnnotation]);

  const handleCopyMarkdown = useCallback(async () => {
    await copyMarkdown(settings.outputDetail);
    if (settings.clearAfterCopy) {
      clearAll();
    }
  }, [copyMarkdown, settings.outputDetail, settings.clearAfterCopy, clearAll]);

  const handleMarkerRemoveComplete = useCallback((id: string) => {
    setRemovingIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    deleteAnnotation(id);
  }, [deleteAnnotation]);

  const handleClearAll = useCallback(() => {
    if (onAnnotationsClear) {
      onAnnotationsClear([...annotations]);
    }
    // Stagger the removal animations (reverse order - last markers exit first, matching web)
    const STAGGER_DELAY = 20; // ms between each marker starting to animate out
    const reversedAnnotations = [...annotations].reverse();
    reversedAnnotations.forEach((annotation, index) => {
      setTimeout(() => {
        setRemovingIds(prev => new Set([...prev, annotation.id]));
      }, index * STAGGER_DELAY);
    });
  }, [onAnnotationsClear, annotations]);

  useEffect(() => {
    const route = getCurrentRouteName();
    if (route !== currentRoute) {
      setCurrentRoute(route);
    }
  }, [annotations, currentRoute]);

  const visibleAnnotations = useMemo(() => {
    return annotations.filter(annotation => {
      if (!annotation.routeName && !currentRoute) return true;
      if (!annotation.routeName) return true;
      return annotation.routeName === currentRoute;
    });
  }, [annotations, currentRoute]);

  const selectedAnnotationIndex = useMemo(() => {
    if (!selectedAnnotation) return -1;
    return visibleAnnotations.findIndex(a => a.id === selectedAnnotation.id);
  }, [visibleAnnotations, selectedAnnotation]);

  return (
    <AgenationContext.Provider value={contextValue}>
      <View style={styles.container} collapsable={false}>
        <View
          ref={contentRef}
          style={styles.content}
          collapsable={false}
        >
          {children}
        </View>

        <>
          {isActive && !popupVisible && (
            <View
              style={styles.overlayTouch}
              onStartShouldSetResponder={handleOverlayStartShouldSetResponder}
            />
          )}

          {showMarkers && (
            <View style={styles.markersContainer} pointerEvents="box-none">
              {visibleAnnotations.map((annotation, index) => (
                <AnnotationMarker
                  key={annotation.id}
                  annotation={annotation}
                  index={index}
                  isSelected={selectedAnnotation?.id === annotation.id}
                  onPress={() => handleMarkerPress(annotation)}
                  onEdit={handleMarkerEdit}
                  onDelete={handleMarkerDelete}
                  scrollOffset={scrollOffset}
                  color={settings.annotationColor}
                  isRemoving={removingIds.has(annotation.id)}
                  onRemoveComplete={() => handleMarkerRemoveComplete(annotation.id)}
                />
              ))}
            </View>
          )}

          <AnnotationPopup
            annotation={selectedAnnotation}
            position={pendingTap || { x: 0, y: 0 }}
            visible={popupVisible}
            onSave={handlePopupSave}
            onCancel={handlePopupCancel}
            onDelete={selectedAnnotation ? handlePopupDelete : undefined}
            detectedElement={formatDetectedElement(pendingDetection?.codeInfo || null)}
            toolbarHeight={toolbarHeight}
            settingsMenuHeight={isSettingsMenuOpen ? 140 : 0}
            accentColor={settings.annotationColor}
            isDarkMode={isDarkMode}
          />

          {popupVisible && selectedAnnotation && selectedAnnotationIndex !== -1 && (
            <View style={styles.selectedMarkerContainer} pointerEvents="none">
              <AnnotationMarker
                annotation={selectedAnnotation}
                index={selectedAnnotationIndex}
                isSelected
                onPress={() => {}}
                scrollOffset={scrollOffset}
                color={settings.annotationColor}
                skipEntryAnimation
              />
            </View>
          )}

          <Toolbar
            isActive={isActive}
            annotationCount={annotations.length}
            onToggleMode={handleToggleMode}
            onCopyMarkdown={handleCopyMarkdown}
            onClearAll={handleClearAll}
            offset={toolbarOffset}
            annotationColor={settings.annotationColor}
            onAnnotationColorChange={handleAnnotationColorChange}
            outputDetail={settings.outputDetail}
            onOutputDetailChange={handleOutputDetailChange}
            clearAfterCopy={settings.clearAfterCopy}
            onClearAfterCopyChange={handleClearAfterCopyChange}
            onSettingsMenuChange={handleSettingsMenuChange}
            showMarkers={showMarkers}
            onShowMarkersChange={handleShowMarkersChange}
          />
        </>
      </View>
    </AgenationContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  overlayTouch: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  markersContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  selectedMarkerContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1001,
  },
});
