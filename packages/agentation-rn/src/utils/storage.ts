import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Annotation, StorageKey, AgenationSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { debugError } from './debug';

const SETTINGS_KEY = '@agentation:settings';

export function getStorageKey(screenName: string): StorageKey {
  return `@agentation:${screenName}`;
}

export async function saveAnnotations(
  screenName: string,
  annotations: Annotation[]
): Promise<void> {
  try {
    const key = getStorageKey(screenName);
    const json = JSON.stringify(annotations);
    await AsyncStorage.setItem(key, json);
  } catch (error) {
    debugError('Failed to save annotations:', error);
    throw error;
  }
}

export async function loadAnnotations(
  screenName: string
): Promise<Annotation[]> {
  try {
    const key = getStorageKey(screenName);
    const json = await AsyncStorage.getItem(key);

    if (!json) {
      return [];
    }

    const annotations = JSON.parse(json) as Annotation[];
    return annotations;
  } catch (error) {
    debugError('Failed to load annotations:', error);
    return [];
  }
}

export async function saveSettings(
  settings: Partial<AgenationSettings>
): Promise<void> {
  try {
    const current = await loadSettings();
    const merged = { ...current, ...settings };
    const json = JSON.stringify(merged);
    await AsyncStorage.setItem(SETTINGS_KEY, json);
  } catch (error) {
    debugError('Failed to save settings:', error);
    throw error;
  }
}

export async function loadSettings(): Promise<AgenationSettings> {
  try {
    const json = await AsyncStorage.getItem(SETTINGS_KEY);

    if (!json) {
      return DEFAULT_SETTINGS;
    }

    const stored = JSON.parse(json) as Partial<AgenationSettings>;
    return { ...DEFAULT_SETTINGS, ...stored };
  } catch (error) {
    debugError('Failed to load settings:', error);
    return DEFAULT_SETTINGS;
  }
}
