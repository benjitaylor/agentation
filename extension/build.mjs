import * as esbuild from "esbuild";
import * as sass from "sass";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const watch = process.argv.includes("--watch");

const pkg = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../package/package.json"), "utf-8")
);
const VERSION = pkg.version;

// SCSS CSS Modules plugin — mirrors package/tsup.config.ts exactly
function scssModulesPlugin() {
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
          let classNames = {};
          const postcssResult = await postcss([
            postcssModules({
              getJSON(cssFileName, json) {
                classNames = json;
              },
              generateScopedName: "[name]__[local]___[hash:base64:5]",
            }),
          ]).process(css, { from: args.path });
          css = postcssResult.css;

          return {
            contents: `
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
`,
            loader: "js",
          };
        } else {
          return {
            contents: `
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
            loader: "js",
          };
        }
      });
    },
  };
}

const ctx = await esbuild.context({
  entryPoints: [path.resolve(__dirname, "src/content.tsx")],
  bundle: true,
  outfile: path.resolve(__dirname, "dist/content.js"),
  format: "iife",
  target: "chrome120",
  jsx: "automatic",
  jsxImportSource: "react",
  plugins: [scssModulesPlugin()],
  alias: {
    agentation: path.resolve(__dirname, "../package/src/index.ts"),
  },
  define: {
    "process.env.NODE_ENV": '"production"',
    __VERSION__: JSON.stringify(VERSION),
  },
});

if (watch) {
  await ctx.watch();
  console.log("Watching for changes...");
} else {
  await ctx.rebuild();
  await ctx.dispose();
  console.log("Built extension/dist/content.js");
}
