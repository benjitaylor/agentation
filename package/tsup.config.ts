import { defineConfig } from "tsup";
import * as sass from "sass";
import postcss from "postcss";
import postcssModules from "postcss-modules";
import * as fs from "fs";
import type { Plugin } from "esbuild";

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const VERSION = pkg.version;

const scssModulesPlugin = (): Plugin => {
  return {
    name: "scss-modules",
    setup(build) {
      build.onLoad({ filter: /\.scss$/ }, async (args) => {
        const isModule = args.path.includes(".module.");
        const { css: sassOutput } = sass.compile(args.path);

        if (!isModule) {
          return {
            contents: `export const css = ${JSON.stringify(sassOutput)};`,
            loader: "js",
          };
        }

        let classNames: Record<string, string> = {};
        const { css } = await postcss([
          postcssModules({
            getJSON(_, json) {
              classNames = json;
            },
            generateScopedName: "[name]__[local]___[hash:base64:5]",
          }),
        ]).process(sassOutput, { from: args.path });

        return {
          contents: `
            export const css = ${JSON.stringify(css)};
            export default ${JSON.stringify(classNames)};
          `,
          loader: "js",
        };
      });
    },
  };
};

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
]);
