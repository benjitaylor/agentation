import { defineConfig } from "@solidjs/start/config";

// Plugin to polyfill Solid 2.0's "use" function for agentation/solid
function solidUsePolyfill() {
  return {
    name: "solid-use-polyfill",
    transform(code: string, id: string) {
      // Only transform agentation/solid imports
      if (!id.includes("agentation") || !id.includes("solid")) {
        return null;
      }

      // Replace import of "use" from solid-js/web with inline implementation
      if (code.includes('import { use as') && code.includes('from "solid-js/web"')) {
        // Add polyfill and remove the use import
        const polyfill = `
// Polyfill for Solid 2.0's "use" function (ref forwarding)
function _$use(callback, element) { callback(element); }
function _$use2(callback, element) { callback(element); }
`;
        // Remove the use import but keep other imports
        const modifiedCode = code
          .replace(/import \{ use as _\$use2? \} from "solid-js\/web";?\n?/g, '')
          .replace(/import \{([^}]+), use as _\$use2?([^}]*)\} from "solid-js\/web"/g, 'import {$1$2} from "solid-js/web"');

        return polyfill + modifiedCode;
      }

      return null;
    }
  };
}

export default defineConfig({
  vite: {
    plugins: [solidUsePolyfill()],
  },
});
