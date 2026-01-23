import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    __VERSION__: JSON.stringify("test"),
  },
  test: {
    environment: "jsdom",
    globals: true,
    css: true,
  },
});
