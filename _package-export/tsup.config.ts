import { defineConfig } from "tsup";
import { sassPlugin, postcssModules } from "esbuild-sass-plugin";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "framer-motion"],
  esbuildPlugins: [
    sassPlugin({
      filter: /\.module\.scss$/,
      type: "style",
      transform: postcssModules({}),
    }),
    sassPlugin({
      filter: /\.scss$/,
      type: "style",
    }),
  ],
});
