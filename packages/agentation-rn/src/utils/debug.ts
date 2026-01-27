const PREFIX = '[Agentation]';

export function debugLog(...args: unknown[]): void {
  if (__DEV__) {
    console.log(PREFIX, ...args);
  }
}

export function debugWarn(...args: unknown[]): void {
  if (__DEV__) {
    console.warn(PREFIX, ...args);
  }
}

export function debugError(...args: unknown[]): void {
  console.error(PREFIX, ...args);
}
