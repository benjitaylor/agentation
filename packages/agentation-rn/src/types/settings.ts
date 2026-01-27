import type { OutputDetailLevel } from './annotation';

export interface AgenationSettings {
  outputDetail: OutputDetailLevel;
  clearAfterCopy: boolean;
  annotationColor: string;
}

export const DEFAULT_SETTINGS: AgenationSettings = {
  outputDetail: 'standard',
  clearAfterCopy: false,
  annotationColor: '#3c82f7',
};
