const fs = require("node:fs");
const path = require("node:path");
const {
  createManifestScript,
  isFileInside,
} = require("./core.cjs");

const DEFAULT_MANIFEST_PATH = "_agentation/source-manifest.js";
const NEXT_COMPONENT_IMPORTS = [
  { source: "next/image", imported: "default" },
  { source: "next/link", imported: "default" },
];

function prependRule(existingRule, agentationRule) {
  if (!existingRule) return agentationRule;
  return Array.isArray(existingRule)
    ? [agentationRule, ...existingRule]
    : [agentationRule, existingRule];
}

function writeManifest({ rootDir, sourceDirs, manifestFile }) {
  const source = createManifestScript(
    rootDir,
    sourceDirs,
    NEXT_COMPONENT_IMPORTS,
  );
  fs.mkdirSync(path.dirname(manifestFile), { recursive: true });
  fs.writeFileSync(manifestFile, source);
}

function withAgentationSourceLocations(nextConfig = {}, options = {}) {
  // Source instrumentation changes rendered DOM, so development stays untouched
  // unless a caller explicitly opts in. `next build` sets NODE_ENV=production.
  const enabled = options.enabled ?? process.env.NODE_ENV === "production";
  if (!enabled) return nextConfig;

  const projectDir = path.resolve(options.projectDir ?? process.cwd());
  const rootDir = path.resolve(options.rootDir ?? projectDir);
  const sourceDirs = (options.sourceDirs ?? [options.sourceDir ?? "src"]).map(
    (sourceDir) => path.resolve(rootDir, sourceDir),
  );
  const manifestPath = options.manifestPath ?? DEFAULT_MANIFEST_PATH;
  const publicDir = path.resolve(projectDir, "public");
  const manifestFile = path.resolve(publicDir, manifestPath);

  if (!isFileInside(publicDir, manifestFile)) {
    throw new Error("Agentation manifestPath must stay inside the public directory");
  }

  const loader = {
    loader: path.join(__dirname, "turbopack-loader.cjs"),
    options: {
      rootDir,
      sourceDirs,
      instrumentedImports: NEXT_COMPONENT_IMPORTS,
    },
  };

  // Next 16 loads its config before starting the Turbopack build. The manifest
  // must exist before Next copies public assets into the production output.
  writeManifest({ rootDir, sourceDirs, manifestFile });

  const rule = { loaders: [loader] };
  const existingRules = nextConfig.turbopack?.rules ?? {};

  return {
    ...nextConfig,
    turbopack: {
      ...nextConfig.turbopack,
      rules: {
        ...existingRules,
        "*.js": prependRule(existingRules["*.js"], rule),
        "*.jsx": prependRule(existingRules["*.jsx"], rule),
        "*.tsx": prependRule(existingRules["*.tsx"], rule),
      },
    },
  };
}

module.exports = { withAgentationSourceLocations };
