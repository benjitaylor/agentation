import { useState, useEffect, useCallback } from 'react';
import type { OutputDetailLevel, AgenationSettings } from '../types';
import { DEFAULT_SETTINGS, COLOR_OPTIONS } from '../types';
import { loadSettings, saveSettings } from '../utils/storage';

const DETAIL_LEVEL_ORDER: OutputDetailLevel[] = ['compact', 'standard', 'detailed', 'forensic'];

function getNextDetailLevel(current: OutputDetailLevel): OutputDetailLevel {
  const currentIndex = DETAIL_LEVEL_ORDER.indexOf(current);
  const nextIndex = (currentIndex + 1) % DETAIL_LEVEL_ORDER.length;
  return DETAIL_LEVEL_ORDER[nextIndex];
}

export interface ToolbarSettingsOptions {
  controlledOutputDetail?: OutputDetailLevel;
  onOutputDetailChange?: (level: OutputDetailLevel) => void;
  controlledClearAfterCopy?: boolean;
  onClearAfterCopyChange?: (value: boolean) => void;
  controlledAnnotationColor?: string;
  onAnnotationColorChange?: (color: string) => void;
}

export interface ToolbarSettingsResult {
  currentOutputDetail: OutputDetailLevel;
  currentClearAfterCopy: boolean;
  currentAnnotationColor: string;
  handleOutputDetailCycle: () => void;
  handleClearAfterCopyToggle: () => void;
  handleAnnotationColorCycle: () => void;
}

export function useToolbarSettings(options: ToolbarSettingsOptions): ToolbarSettingsResult {
  const {
    controlledOutputDetail,
    onOutputDetailChange,
    controlledClearAfterCopy,
    onClearAfterCopyChange,
    controlledAnnotationColor,
    onAnnotationColorChange,
  } = options;

  const [internalSettings, setInternalSettings] = useState<AgenationSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadSettings().then(setInternalSettings);
  }, []);

  const currentOutputDetail = controlledOutputDetail ?? internalSettings.outputDetail;
  const currentClearAfterCopy = controlledClearAfterCopy ?? internalSettings.clearAfterCopy;
  const currentAnnotationColor = controlledAnnotationColor ?? internalSettings.annotationColor;

  const handleOutputDetailCycle = useCallback(() => {
    const nextLevel = getNextDetailLevel(currentOutputDetail);
    if (onOutputDetailChange) {
      onOutputDetailChange(nextLevel);
    } else {
      setInternalSettings(prev => ({ ...prev, outputDetail: nextLevel }));
      saveSettings({ outputDetail: nextLevel });
    }
  }, [currentOutputDetail, onOutputDetailChange]);

  const handleClearAfterCopyToggle = useCallback(() => {
    const newValue = !currentClearAfterCopy;
    if (onClearAfterCopyChange) {
      onClearAfterCopyChange(newValue);
    } else {
      setInternalSettings(prev => ({ ...prev, clearAfterCopy: newValue }));
      saveSettings({ clearAfterCopy: newValue });
    }
  }, [currentClearAfterCopy, onClearAfterCopyChange]);

  const handleAnnotationColorCycle = useCallback(() => {
    const currentIndex = COLOR_OPTIONS.findIndex(c => c.value === currentAnnotationColor);
    const nextIndex = (currentIndex + 1) % COLOR_OPTIONS.length;
    const nextColor = COLOR_OPTIONS[nextIndex].value;
    if (onAnnotationColorChange) {
      onAnnotationColorChange(nextColor);
    } else {
      setInternalSettings(prev => ({ ...prev, annotationColor: nextColor }));
      saveSettings({ annotationColor: nextColor });
    }
  }, [currentAnnotationColor, onAnnotationColorChange]);

  return {
    currentOutputDetail,
    currentClearAfterCopy,
    currentAnnotationColor,
    handleOutputDetailCycle,
    handleClearAfterCopyToggle,
    handleAnnotationColorCycle,
  };
}
