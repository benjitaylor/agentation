import { defineConfig, type Options } from "tsup";
import * as sass from "sass";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import * as path from "path";
import * as fs from "fs";
import { compile, preprocess } from "svelte/compiler";
import type { Plugin } from "esbuild";

// Read version from package.json at build time
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const VERSION = pkg.version;

// Custom SCSS CSS Modules plugin with SSR-safe style injection
function scssModulesPlugin(): Plugin {
  return {
    name: "scss-modules",
    setup(build) {
      // Handle all .scss files
      build.onLoad({ filter: /\.scss$/ }, async (args) => {
        const isModule = args.path.includes(".module.");
        // Use parent directory + filename for unique style IDs
        const parentDir = path.basename(path.dirname(args.path));
        const baseName = path.basename(args.path, isModule ? ".module.scss" : ".scss");
        const styleId = `${parentDir}-${baseName}`;

        // Compile SCSS to CSS
        const result = sass.compile(args.path);
        let css = result.css;

        if (isModule) {
          // Process with postcss-modules to get class name mappings
          let classNames: Record<string, string> = {};
          const postcssResult = await postcss([
            postcssModules({
              getJSON(cssFileName, json) {
                classNames = json;
              },
              generateScopedName: "[name]__[local]___[hash:base64:5]",
            }),
          ]).process(css, { from: args.path });

          css = postcssResult.css;

          // Generate JS that exports class names and injects styles (SSR-safe)
          const contents = `
const css = ${JSON.stringify(css)};
const classNames = ${JSON.stringify(classNames)};

// SSR-safe style injection
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
`;
          return { contents, loader: "js" };
        } else {
          // Regular SCSS - no CSS modules processing
          const contents = `
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
`;
          return { contents, loader: "js" };
        }
      });
    },
  };
}

// Svelte plugin for esbuild
function sveltePlugin(): Plugin {
  return {
    name: "svelte",
    setup(build) {
      build.onLoad({ filter: /\.svelte$/ }, async (args) => {
        const source = await fs.promises.readFile(args.path, "utf-8");

        // Preprocess to handle TypeScript in script tags
        const preprocessed = await preprocess(source, [
          {
            script: ({ content, attributes }) => {
              if (attributes.lang === "ts") {
                // We'll let esbuild handle the TypeScript
                return { code: content };
              }
              return { code: content };
            },
          },
        ], {
          filename: args.path,
        });

        // Compile Svelte to JavaScript
        const compiled = compile(preprocessed.code, {
          filename: args.path,
          generate: "client",
          css: "injected",
          dev: false,
          runes: true,
        });

        // Return the compiled JavaScript
        return {
          contents: compiled.js.code,
          loader: "ts",
          warnings: compiled.warnings.map((w) => ({
            text: w.message,
            location: w.start
              ? {
                  file: args.path,
                  line: w.start.line,
                  column: w.start.column,
                }
              : undefined,
          })),
        };
      });

      // Handle .svelte.ts files (Svelte 5 module scripts)
      build.onLoad({ filter: /\.svelte\.ts$/ }, async (args) => {
        const source = await fs.promises.readFile(args.path, "utf-8");
        return {
          contents: source,
          loader: "ts",
        };
      });
    },
  };
}

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: false, // Svelte components don't work with automatic DTS generation
  splitting: false,
  sourcemap: true,
  clean: !options.watch, // Only clean on build, not during watch
  external: ["svelte", "svelte/internal", "svelte/internal/client", "svelte/store"],
  esbuildPlugins: [sveltePlugin(), scssModulesPlugin()],
  define: {
    __VERSION__: JSON.stringify(VERSION),
  },
  esbuildOptions(options) {
    options.conditions = ["svelte", "browser"];
  },
}));
