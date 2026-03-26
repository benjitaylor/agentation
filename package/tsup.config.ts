import { defineConfig, type Options } from "tsup";
import * as sass from "sass";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import * as path from "path";
import * as fs from "fs";
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

// SSR-safe style injection (always update for HMR)
if (typeof document !== 'undefined') {
  let style = document.getElementById('feedback-tool-styles-${styleId}');
  if (!style) {
    style = document.createElement('style');
    style.id = 'feedback-tool-styles-${styleId}';
    document.head.appendChild(style);
  }
  style.textContent = css;
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
    document.head.appendChild(style);
  }
  style.textContent = css;
}
export default {};
`;
          return { contents, loader: "js" };
        }
      });
    },
  };
}

export default defineConfig((options) => {
  if (!options.watch) {
    fs.rmSync("dist", { recursive: true, force: true });
  }

  return [
    // React component
    {
      entry: ["src/index.ts"],
      format: ["cjs", "esm"],
      dts: true,
      splitting: false,
      sourcemap: true,
      clean: false,
      external: ["react", "react-dom"],
      esbuildPlugins: [scssModulesPlugin()],
      define: {
        __VERSION__: JSON.stringify(VERSION),
        "process.env.NODE_ENV": JSON.stringify("production"),
      },
      banner: {
        js: '"use client";',
      },
    },
    // Browser module API
    {
      entry: {
        browser: "src/browser.tsx",
      },
      format: ["cjs", "esm"],
      dts: true,
      splitting: false,
      sourcemap: true,
      clean: false,
      esbuildPlugins: [scssModulesPlugin()],
      define: {
        __VERSION__: JSON.stringify(VERSION),
        "process.env.NODE_ENV": JSON.stringify("production"),
      },
      banner: {
        js: '"use client";',
      },
    },
    // Script-tag bundle
    {
      entry: {
        agentation: "src/browser.tsx",
      },
      format: ["iife"],
      globalName: "Agentation",
      dts: false,
      splitting: false,
      sourcemap: false,
      minify: true,
      clean: false,
      esbuildPlugins: [scssModulesPlugin()],
      define: {
        __VERSION__: JSON.stringify(VERSION),
        "process.env.NODE_ENV": JSON.stringify("production"),
      },
      outExtension({ format }) {
        if (format === "iife") {
          return {
            js: ".browser.min.js",
          };
        }
        return {
          js: ".js",
        };
      },
      banner: {
        js: '"use client";',
      },
    },
  ];
});
