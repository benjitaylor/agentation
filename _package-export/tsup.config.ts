import { defineConfig, type Options } from "tsup";
import * as sass from "sass";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import * as path from "path";
import * as fs from "fs";
import type { Plugin } from "esbuild";
import { solidPlugin } from "esbuild-plugin-solid";

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

// React build configuration
const reactConfig = {
  entry: ["src/index.ts"],
  format: ["cjs", "esm"] as const,
  dts: true,
  splitting: false,
  sourcemap: true,
  external: ["react", "react-dom"],
  esbuildPlugins: [scssModulesPlugin()],
  define: {
    __VERSION__: JSON.stringify(VERSION),
  },
  banner: {
    js: '"use client";',
  },
};

// Solid build configuration
const solidConfig = {
  entry: ["src/solid.ts"],
  format: ["cjs", "esm"] as const,
  dts: true,
  tsconfig: "tsconfig.solid.json",
  splitting: false,
  sourcemap: true,
  external: ["solid-js", "solid-js/web"],
  esbuildPlugins: [solidPlugin(), scssModulesPlugin()],
  define: {
    __VERSION__: JSON.stringify(VERSION),
  },
  // No "use client" banner for Solid (SolidStart uses different patterns)
};

export default defineConfig((options) => [
  {
    ...reactConfig,
    clean: !options.watch,
  },
  {
    ...solidConfig,
    clean: false, // Don't clean on second build (would delete React output)
  },
]);
