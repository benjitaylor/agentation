const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { createManifest, createManifestScript, transformSource } = require("./core.cjs");

const NEXT_COMPONENT_IMPORTS = [
  { source: "next/image", imported: "default" },
  { source: "next/link", imported: "default" },
];

test("instruments intrinsic elements and direct Next built-ins only", () => {
  const rootDir = "/repo";
  const filename = "/repo/src/example.tsx";
  const source = `
    import NextImage from "next/image";
    import NextLink from "next/link";
    import { Image, Link } from "./components";

    export function Example() {
      return <main><NextImage src="/a.png" alt="A" /><NextLink href="/a">A</NextLink><Image /><Link /></main>;
    }

    export function Shadowed(NextLink) {
      return <NextLink href="/shadowed">Shadowed custom component</NextLink>;
    }
  `;
  const result = transformSource({
    source,
    filename,
    rootDir,
    inject: true,
    instrumentedImports: NEXT_COMPONENT_IMPORTS,
  });

  assert.match(result.code, /<main data-agentation-id=/);
  assert.match(result.code, /<NextImage[^>]+data-agentation-id=/);
  assert.match(result.code, /<NextLink[^>]+data-agentation-id=/);
  assert.doesNotMatch(result.code, /<Image[^>]+data-agentation-id=/);
  assert.doesNotMatch(result.code, /<Link[^>]+data-agentation-id=/);
  assert.doesNotMatch(result.code, /<NextLink href="\/shadowed"[^>]+data-agentation-id=/);
});

test("builds one manifest from multiple source directories", (context) => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "agentation-source-"));
  context.after(() => fs.rmSync(rootDir, { recursive: true, force: true }));

  const appDir = path.join(rootDir, "apps/web/src");
  const uiDir = path.join(rootDir, "packages/ui/src");
  fs.mkdirSync(appDir, { recursive: true });
  fs.mkdirSync(uiDir, { recursive: true });
  fs.writeFileSync(path.join(appDir, "page.tsx"), "export const Page = () => <main />;");
  fs.writeFileSync(path.join(appDir, "layout.js"), "export const Layout = () => <section />;");
  fs.writeFileSync(path.join(uiDir, "card.tsx"), "export const Card = () => <article />;");

  const manifest = createManifest(rootDir, [appDir, uiDir]);
  assert.equal(manifest.version, 1);
  assert.deepEqual(
    Object.values(manifest.locations)
      .map(([fileIndex]) => manifest.files[fileIndex])
      .sort(),
    [
      "apps/web/src/layout.js",
      "apps/web/src/page.tsx",
      "packages/ui/src/card.tsx",
    ],
  );
  assert.doesNotMatch(createManifestScript(rootDir, [appDir, uiDir]), /fileName/);
});
