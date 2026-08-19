const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { withAgentationSourceLocations } = require("./next.cjs");
const { agentationSourceLocations } = require("./vite.cjs");

test("Next stays disabled outside production unless explicitly enabled", () => {
  const nextConfig = { reactStrictMode: true };
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "development";

  try {
    assert.equal(withAgentationSourceLocations(nextConfig), nextConfig);
  } finally {
    if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousNodeEnv;
  }
});

test("Next supports monorepo roots and runs before existing Turbopack rules", (context) => {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "agentation-next-"));
  context.after(() => fs.rmSync(rootDir, { recursive: true, force: true }));

  const projectDir = path.join(rootDir, "apps/web");
  const sourceDir = path.join(projectDir, "src");
  fs.mkdirSync(path.join(projectDir, "public"), { recursive: true });
  fs.mkdirSync(sourceDir, { recursive: true });
  fs.writeFileSync(path.join(sourceDir, "page.tsx"), "export const Page = () => <main />;");

  const existingRule = { loaders: ["existing-loader"] };
  const result = withAgentationSourceLocations(
    { turbopack: { rules: { "*.tsx": existingRule } } },
    {
      enabled: true,
      projectDir,
      rootDir,
      sourceDirs: ["apps/web/src"],
    },
  );

  assert.match(
    result.turbopack.rules["*.tsx"][0].loaders[0].loader,
    /turbopack-loader\.cjs$/,
  );
  assert.equal(result.turbopack.rules["*.tsx"][1], existingRule);
  assert.equal(result.turbopack.rules["*.tsx"].length, 2);
  assert.ok(result.turbopack.rules["*.js"]);
  assert.ok(result.turbopack.rules["*.jsx"]);
  assert.ok(fs.existsSync(path.join(projectDir, "public/_agentation/source-manifest.js")));
});

test("Vite is build-only by default and supports an explicit override", () => {
  const plugin = agentationSourceLocations();
  assert.equal(plugin.apply({}, { command: "build" }), true);
  assert.equal(plugin.apply({}, { command: "serve" }), false);
  assert.equal(
    agentationSourceLocations({ enabled: true }).apply({}, { command: "serve" }),
    true,
  );
});
