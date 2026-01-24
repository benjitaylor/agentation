import { defineConfig } from "tsup";
import * as sass from "sass";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import * as path from "path";
import * as fs from "fs";
import type { Plugin } from "esbuild";

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const VERSION = pkg.version;

function scssModulesPlugin(): Plugin {
  return {
    name: "scss-modules",
    setup(build) {
      build.onLoad({ filter: /\.scss$/ }, async (args) => {
        const isModule = args.path.includes(".module.");
        const parentDir = path.basename(path.dirname(args.path));
        const baseName = path.basename(args.path, isModule ? ".module.scss" : ".scss");
        const styleId = `${parentDir}-${baseName}`;

        const result = sass.compile(args.path);
        let css = result.css;

        if (isModule) {
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

          const contents = `
const css = ${JSON.stringify(css)};
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
`;
          return { contents, loader: "js" };
        }

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
      });
    },
  };
}

export default defineConfig((options) => [
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: !options.watch,
    external: ["react", "react-dom"],
    esbuildPlugins: [scssModulesPlugin()],
    define: {
      __VERSION__: JSON.stringify(VERSION),
    },
    banner: {
      js: '"use client";',
    },
  },
  {
    entry: ["src/vanilla.ts"],
    format: ["esm"],
    outDir: "dist",
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: false,
    esbuildPlugins: [scssModulesPlugin()],
    define: {
      __VERSION__: JSON.stringify(VERSION),
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
  },
  {
    entry: { agentation: "src/vanilla.ts" },
    format: ["iife"],
    outDir: "dist",
    globalName: "Agentation",
    splitting: false,
    sourcemap: true,
    clean: false,
    minify: true,
    esbuildPlugins: [scssModulesPlugin()],
    define: {
      __VERSION__: JSON.stringify(VERSION),
      "process.env.NODE_ENV": JSON.stringify("production"),
    },
  },
]);
