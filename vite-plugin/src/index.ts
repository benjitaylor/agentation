import type { Plugin, HtmlTagDescriptor } from 'vite'

export interface AgentationPluginOptions {
  /**
   * Enable/disable the plugin.
   * @default true in development
   */
  enabled?: boolean
}

const VIRTUAL_ID = 'virtual:agentation-inject'
const RESOLVED_ID = '\0' + VIRTUAL_ID

const injectCode = `
import { Agentation } from 'agentation';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

let root = null;

function init() {
  const existing = document.getElementById('agentation-root');
  if (existing) {
    // Clean up previous root if it exists (HMR case)
    if (root) {
      root.unmount();
    }
    existing.remove();
  }

  const container = document.createElement('div');
  container.id = 'agentation-root';
  document.body.appendChild(container);

  root = createRoot(container);
  root.render(createElement(Agentation));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (root) {
      root.unmount();
      root = null;
    }
    const container = document.getElementById('agentation-root');
    if (container) {
      container.remove();
    }
  });
}
`

export default function agentationPlugin(options: AgentationPluginOptions = {}): Plugin {
  const { enabled = true } = options

  return {
    name: 'vite-plugin-agentation',
    apply: 'serve',

    config() {
      return {
        optimizeDeps: {
          include: ['agentation', 'react', 'react-dom/client']
        }
      }
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) {
        return RESOLVED_ID
      }
    },

    load(id) {
      if (id === RESOLVED_ID) {
        return injectCode
      }
    },

    transformIndexHtml() {
      if (!enabled) return []

      const tags: HtmlTagDescriptor[] = [
        {
          tag: 'script',
          attrs: {
            type: 'module',
            src: `/@id/${VIRTUAL_ID}`
          },
          injectTo: 'body'
        }
      ]

      return tags
    }
  }
}

export { agentationPlugin }
