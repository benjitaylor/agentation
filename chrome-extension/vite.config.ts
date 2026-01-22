import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

// Custom plugin to copy manifest and handle extension-specific build
function chromeExtensionPlugin() {
  return {
    name: 'chrome-extension',
    writeBundle() {
      // Copy manifest.json to dist
      copyFileSync(
        resolve(__dirname, 'manifest.json'),
        resolve(__dirname, 'dist/manifest.json')
      );

      // Copy icons
      const iconsDir = resolve(__dirname, 'dist/icons');
      if (!existsSync(iconsDir)) {
        mkdirSync(iconsDir, { recursive: true });
      }
      const srcIconsDir = resolve(__dirname, 'public/icons');
      if (existsSync(srcIconsDir)) {
        ['icon-16.png', 'icon-32.png', 'icon-48.png', 'icon-128.png'].forEach(icon => {
          const src = resolve(srcIconsDir, icon);
          if (existsSync(src)) {
            copyFileSync(src, resolve(iconsDir, icon));
          }
        });
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), chromeExtensionPlugin()],
  build: {
    outDir: 'dist',
    emptyDirBeforeWrite: true,
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/content-script.tsx'),
        background: resolve(__dirname, 'src/background/service-worker.ts'),
        popup: resolve(__dirname, 'src/popup/popup.html'),
        options: resolve(__dirname, 'src/options/options.html'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'content') return 'content.js';
          if (chunkInfo.name === 'background') return 'background.js';
          return '[name].js';
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            if (assetInfo.name.includes('content')) return 'content.css';
            return '[name][extname]';
          }
          return 'assets/[name][extname]';
        }
      }
    },
    target: 'esnext',
    minify: false, // Easier debugging during development
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  }
});
