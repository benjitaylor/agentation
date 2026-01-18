import { defineConfig } from "tsup";
import { sassPlugin } from "esbuild-sass-plugin";

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
      type: "css-text",
      // CSS modules support - transforms class names and exports mapping
      transform: async (source, resolveDir, filePath) => {
        // Simple CSS modules implementation for .module.scss files
        if (filePath.includes(".module.")) {
          const classMap: Record<string, string> = {};
          let transformed = source;

          // Extract and transform class names
          const classRegex = /\.([a-zA-Z_][a-zA-Z0-9_-]*)\s*(?=[{,:])/g;
          let match;
          while ((match = classRegex.exec(source)) !== null) {
            const className = match[1];
            if (!classMap[className]) {
              // Generate a scoped class name
              const hash = Buffer.from(filePath + className).toString("base64").slice(0, 5);
              classMap[className] = `${className}_${hash}`;
            }
          }

          // Replace class names in CSS
          for (const [original, scoped] of Object.entries(classMap)) {
            transformed = transformed.replace(
              new RegExp(`\\.${original}(?=[\\s{,:\\[])`, "g"),
              `.${scoped}`
            );
          }

          // Return both the CSS and the class mapping
          const exportCode = `
const styles = ${JSON.stringify(classMap)};
export default styles;
const css = ${JSON.stringify(transformed)};
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}
`;
          return exportCode;
        }

        // Regular SCSS - just inject styles
        return `
const css = ${JSON.stringify(source)};
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}
export default {};
`;
      },
    }),
  ],
});
