import { defineConfig } from "tsup";
import * as fs from "fs";

// Read version from package.json at build time
const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const VERSION = pkg.version;

export default defineConfig([
  // Main library export
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ["@modelcontextprotocol/sdk", "zod", "better-sqlite3"],
    define: {
      __VERSION__: JSON.stringify(VERSION),
    },
  },
  // CLI
  {
    entry: ["src/cli.ts"],
    format: ["cjs"],
    dts: false,
    splitting: false,
    sourcemap: true,
    clean: false,
    external: ["@modelcontextprotocol/sdk", "zod", "better-sqlite3"],
    define: {
      __VERSION__: JSON.stringify(VERSION),
    },
    banner: {
      js: "#!/usr/bin/env node",
    },
  },
]);
