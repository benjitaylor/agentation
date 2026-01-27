import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-native',
    '@react-native-async-storage/async-storage',
    'expo-clipboard',
    '@callstack/liquid-glass',
    'react-native-safe-area-context',
    'react-native-dev-inspector',
    'react-native-screens',
    'react-native-svg',
  ],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
