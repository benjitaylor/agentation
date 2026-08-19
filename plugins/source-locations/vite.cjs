const path = require("node:path");
const {
  SOURCE_EXTENSION,
  createManifestScript,
  isFileInside,
  transformSource,
} = require("./core.cjs");

const DEFAULT_MANIFEST_PATH = "_agentation/source-manifest.js";

function joinBase(base, manifestPath) {
  return `${base.endsWith("/") ? base : `${base}/`}${manifestPath}`;
}

function agentationSourceLocations(options = {}) {
  let rootDir;
  let sourceDirs;
  let base;
  let command;
  const manifestPath = options.manifestPath ?? DEFAULT_MANIFEST_PATH;

  return {
    name: "agentation-source-locations",
    enforce: "pre",
    // Vite build is the default scope. Set enabled:true to opt into dev/HMR.
    apply(_config, environment) {
      return options.enabled ?? environment.command === "build";
    },

    configResolved(config) {
      rootDir = path.resolve(options.rootDir ?? config.root);
      sourceDirs = (options.sourceDirs ?? [options.sourceDir ?? "src"]).map(
        (sourceDir) => path.resolve(rootDir, sourceDir),
      );
      base = config.base;
      command = config.command;
    },

    buildStart() {
      if (command !== "build") return;
      this.emitFile({
        type: "asset",
        fileName: manifestPath,
        source: createManifestScript(rootDir, sourceDirs),
      });
    },

    transform(source, id) {
      const filename = id.split("?", 1)[0];
      if (
        !SOURCE_EXTENSION.test(filename) ||
        !sourceDirs.some((sourceDir) => isFileInside(sourceDir, filename))
      ) {
        return null;
      }

      return transformSource({
        source,
        filename,
        rootDir,
        inject: true,
      });
    },

    transformIndexHtml() {
      return [
        {
          tag: "script",
          attrs: { src: joinBase(base, manifestPath) },
          injectTo: "head-prepend",
        },
      ];
    },

    configureServer(server) {
      const manifestUrl = joinBase(base, manifestPath);
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
        if (pathname !== manifestUrl) {
          next();
          return;
        }

        response.statusCode = 200;
        response.setHeader("Content-Type", "text/javascript; charset=utf-8");
        response.setHeader("Cache-Control", "no-store");
        response.end(createManifestScript(rootDir, sourceDirs));
      });
    },

    handleHotUpdate(context) {
      if (
        SOURCE_EXTENSION.test(context.file) &&
        sourceDirs.some((sourceDir) => isFileInside(sourceDir, context.file))
      ) {
        context.server.ws.send({ type: "full-reload" });
      }
    },
  };
}

module.exports = { agentationSourceLocations };
