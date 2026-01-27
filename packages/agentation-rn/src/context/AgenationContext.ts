import { createContext } from 'react';

export interface AgenationContextValue {
  reportScrollOffset: (x: number, y: number) => void;
  scrollOffset: { x: number; y: number };
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export const AgenationContext = createContext<AgenationContextValue | null>(null);
