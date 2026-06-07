import { defineConfig } from "tsup";
import * as sass from "sass";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import * as path from "path";
import * as fs from "fs";
import type { Plugin } from "esbuild";

// Read version from the main agentation package
const pkg = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../package/package.json"),
    "utf-8"
  )
);
const VERSION = pkg.version;

// SCSS CSS Modules plugin — same as the main package build
function scssModulesPlugin(): Plugin {
  return {
    name: "scss-modules",
    setup(build) {
      build.onLoad({ filter: /\.scss$/ }, async (args) => {
        const isModule = args.path.includes(".module.");
        const parentDir = path.basename(path.dirname(args.path));
        const baseName = path.basename(
          args.path,
          isModule ? ".module.scss" : ".scss"
        );
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
        } else {
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

export default defineConfig({
  entry: ["src/standalone.ts"],
  format: ["iife"],
  outDir: "gem/app/assets/javascripts",
  globalName: "Agentation",
  // Bundle everything — React, Agentation, all deps — into one file
  noExternal: [/.*/],
  platform: "browser",
  target: "es2020",
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  esbuildPlugins: [scssModulesPlugin()],
  define: {
    "process.env.NODE_ENV": '"production"',
    __VERSION__: JSON.stringify(VERSION),
  },
  outExtension: () => ({ js: ".js" }),
  esbuildOptions(options) {
    options.entryNames = "agentation";
  },
});
