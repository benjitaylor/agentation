import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
  },
  {
    entry: ["src/cli.ts"],
    format: ["esm"],
    dts: true,
    banner: {
      js: "#!/usr/bin/env node",
    },
  },
]);
