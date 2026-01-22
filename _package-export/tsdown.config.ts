import { defineConfig } from "tsdown";
import * as sass from "sass";
import * as path from "path";
import * as fs from "fs";
import { compile, preprocess } from "svelte/compiler";
import type { Plugin } from "rolldown";

// Read version from package.json at build time
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const VERSION = pkg.version;

// Custom SCSS plugin for rolldown
function scssPlugin(): Plugin {
  return {
    name: "scss",
    async load(id) {
      if (!id.endsWith(".scss")) return null;

      const parentDir = path.basename(path.dirname(id));
      const baseName = path.basename(id, ".module.scss").replace(".scss", "");
      const styleId = `${parentDir}-${baseName}`;

      const result = sass.compile(id);
      const css = result.css;

      const isModule = id.includes(".module.");
      let classNames: Record<string, string> = {};

      if (isModule) {
        const classMatches = css.matchAll(/\.([a-zA-Z_][a-zA-Z0-9_-]*)/g);
        for (const match of classMatches) {
          const className = match[1];
          const hash = Buffer.from(styleId + className).toString('base64').slice(0, 5);
          classNames[className] = `${className}_${hash}`;
        }

        let scopedCss = css;
        for (const [original, scoped] of Object.entries(classNames)) {
          scopedCss = scopedCss.replace(new RegExp(`\\.${original}(?![a-zA-Z0-9_-])`, 'g'), `.${scoped}`);
        }

        return {
          code: `
const css = ${JSON.stringify(scopedCss)};
const classNames = ${JSON.stringify(classNames)};

if (typeof document !== 'undefined') {
  let style = document.getElementById('feedback-tool-styles-${styleId}');
  if (!style) {
    style = document.createElement('style');
    style.id = 'feedback-tool-styles-${styleId}';
    style.textContent = css;
    document.head.appendChild(style);
  }
}

export default classNames;
`,
          moduleType: "js",
        };
      } else {
        return {
          code: `
const css = ${JSON.stringify(css)};
if (typeof document !== 'undefined') {
  let style = document.getElementById('feedback-tool-styles-${styleId}');
  if (!style) {
    style = document.createElement('style');
    style.id = 'feedback-tool-styles-${styleId}';
    style.textContent = css;
    document.head.appendChild(style);
  }
}
export default {};
`,
          moduleType: "js",
        };
      }
    },
  };
}

// Svelte plugin for rolldown
function sveltePlugin(): Plugin {
  return {
    name: "svelte",
    async load(id) {
      if (!id.endsWith(".svelte")) return null;

      const source = await fs.promises.readFile(id, "utf-8");

      const preprocessed = await preprocess(source, [
        {
          script: ({ content, attributes }) => {
            if (attributes.lang === "ts") {
              return { code: content };
            }
            return { code: content };
          },
        },
      ], {
        filename: id,
      });

      const compiled = compile(preprocessed.code, {
        filename: id,
        generate: "client",
        css: "injected",
        dev: false,
        runes: true,
      });

      return {
        code: compiled.js.code,
        moduleType: "ts",
      };
    },
  };
}

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: false,
  sourcemap: true,
  clean: true,
  external: ["svelte", "svelte/internal", "svelte/internal/client", "svelte/store"],
  plugins: [sveltePlugin(), scssPlugin()],
  define: {
    __VERSION__: JSON.stringify(VERSION),
  },
});
