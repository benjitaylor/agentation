import * as Clipboard from 'expo-clipboard';
import { debugError } from './debug';

export function generateId(): string {
  return `ann_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export function getTimestamp(): number {
  return Date.now();
}

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await Clipboard.setStringAsync(text);
  } catch (error) {
    debugError('Failed to copy to clipboard:', error);
    throw error;
  }
}

export function formatDetectedElement(
  codeInfo: { relativePath?: string; lineNumber?: number; componentName?: string } | null
): string | undefined {
  if (!codeInfo) return undefined;
  const filename = codeInfo.relativePath?.split('/').pop();
  if (filename) {
    return codeInfo.lineNumber ? `${filename}:${codeInfo.lineNumber}` : filename;
  }
  return codeInfo.componentName;
}
