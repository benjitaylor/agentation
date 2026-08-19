# Agentation source locations

This first-party plugin lives in the Agentation monorepo because its manifest
format is consumed directly by the Agentation runtime and must evolve atomically
with that lookup contract.

Build-time JSX instrumentation for exact production source locations. It adds a
short `data-agentation-id` to rendered DOM and generates a manifest that maps the
ID back to `file:line:column` without shipping source code.

The manifest stores file paths once and represents each location as a compact
`[fileIndex, line, column]` tuple.

Instrumentation is enabled for production builds only by default. Development
servers stay unchanged. Pass `enabled: true` only when development instrumentation
is intentional.

## Next.js 16 (Turbopack)

Single-project repositories use `src` and `public` by default:

```js
const { withAgentationSourceLocations } = require("@agentation/source-locations/next");

module.exports = withAgentationSourceLocations({});
```

For a monorepo, distinguish the application directory that owns `public` from the
repository root used in reported source paths:

```js
const path = require("node:path");
const { withAgentationSourceLocations } = require("@agentation/source-locations/next");

module.exports = withAgentationSourceLocations(nextConfig, {
  projectDir: __dirname,
  rootDir: path.resolve(__dirname, "../.."),
  sourceDirs: ["apps/web/src", "packages/ui/src"],
});
```

Load the generated manifest before Agentation in the production document:

```tsx
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Script
          src="/_agentation/source-manifest.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
```

The Next plugin instruments intrinsic JSX plus components imported directly from
`next/image` and `next/link`. It intentionally does not instrument arbitrary custom
components or wrappers, because forwarding an unknown DOM attribute is not part of
their contract. Existing Turbopack `.tsx` and `.jsx` rules are preserved.

## Vite 7 + React

```js
import { defineConfig } from "vite";
import { agentationSourceLocations } from "@agentation/source-locations/vite";

export default defineConfig({
  plugins: [agentationSourceLocations()],
});
```

Vite injects the manifest script into built HTML. A monorepo can use the same
`rootDir` and `sourceDirs` options shown above. Vite instruments intrinsic JSX; it
does not need Next-specific component handling.

Add `public/_agentation/` to `.gitignore` in Next projects. The file is generated
during each build.
