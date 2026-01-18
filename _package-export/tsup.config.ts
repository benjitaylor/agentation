import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "framer-motion"],
  // TODO: Configure CSS extraction once styles are converted
  // injectStyle: true, // or extract to separate file
});
