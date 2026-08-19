const fs = require("node:fs");
const { createHash } = require("node:crypto");
const path = require("node:path");
const { transformSync } = require("@babel/core");

const SOURCE_ATTRIBUTE = "data-agentation-id";
const SOURCE_EXTENSION = /\.(?:js|jsx|tsx)$/;
const MANIFEST_VERSION = 1;

function normalizeSourceDirs(sourceDirs) {
  return Array.isArray(sourceDirs) ? sourceDirs : [sourceDirs];
}

function normalizePath(filePath) {
  return filePath.split(path.sep).join("/");
}

function isFileInside(directory, filename) {
  const relative = path.relative(directory, filename);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function createLocation(filename, rootDir, start) {
  const fileName = normalizePath(path.relative(rootDir, filename));
  const location = {
    fileName,
    lineNumber: start.line,
    columnNumber: start.column,
  };
  const key = `${fileName}:${start.line}:${start.column}`;
  const id = createHash("sha256").update(key).digest("base64url").slice(0, 11);

  return { id, location };
}

function isIntrinsicElement(node) {
  return node.type === "JSXIdentifier" && /^[a-z]/.test(node.name);
}

function collectInstrumentedBindings(programPath, instrumentedImports) {
  const bindings = new Set();

  for (const statementPath of programPath.get("body")) {
    const statement = statementPath.node;
    if (statement.type !== "ImportDeclaration") continue;

    const allowedImports = instrumentedImports.filter(
      (item) => item.source === statement.source.value,
    );
    if (allowedImports.length === 0) continue;

    for (const specifier of statement.specifiers) {
      for (const allowedImport of allowedImports) {
        // Only an explicitly allowlisted import binding is safe to instrument.
        // A same-named local component may consume or reject unknown props.
        if (allowedImport.imported === "default" && specifier.type === "ImportDefaultSpecifier") {
          const binding = programPath.scope.getBinding(specifier.local.name);
          if (binding) bindings.add(binding);
        }
      }
    }
  }

  return bindings;
}

function shouldInstrumentElement(elementPath, bindings) {
  const node = elementPath.node.name;
  return (
    isIntrinsicElement(node) ||
    (node.type === "JSXIdentifier" &&
      bindings.has(elementPath.scope.getBinding(node.name)))
  );
}

function hasSourceAttribute(attributes) {
  return attributes.some(
    (attribute) =>
      attribute.type === "JSXAttribute" &&
      attribute.name.type === "JSXIdentifier" &&
      attribute.name.name === SOURCE_ATTRIBUTE,
  );
}

function instrumentationPlugin({ types }, options) {
  const { rootDir, inject, onLocation, instrumentedImports = [] } = options;
  let instrumentedBindings = new Set();

  return {
    name: "agentation-source-location",
    visitor: {
      Program(programPath) {
        instrumentedBindings = collectInstrumentedBindings(
          programPath,
          instrumentedImports,
        );
      },
      JSXOpeningElement(babelPath, state) {
        const node = babelPath.node;
        if (!shouldInstrumentElement(babelPath, instrumentedBindings) || !node.loc) {
          return;
        }

        const filename = state.file.opts.filename;
        if (!filename) return;

        const entry = createLocation(filename, rootDir, node.loc.start);
        onLocation?.(entry.id, entry.location);

        if (!inject || hasSourceAttribute(node.attributes)) return;

        node.attributes.push(
          types.jsxAttribute(
            types.jsxIdentifier(SOURCE_ATTRIBUTE),
            types.stringLiteral(entry.id),
          ),
        );
      },
    },
  };
}

function transformSource({
  source,
  filename,
  rootDir,
  inject,
  onLocation,
  instrumentedImports,
}) {
  const result = transformSync(source, {
    filename,
    babelrc: false,
    configFile: false,
    sourceMaps: inject,
    sourceFileName: normalizePath(path.relative(rootDir, filename)),
    parserOpts: {
      sourceType: "unambiguous",
      plugins: ["jsx", "typescript"],
    },
    generatorOpts: {
      retainLines: true,
    },
    plugins: [
      [
        instrumentationPlugin,
        { rootDir, inject, onLocation, instrumentedImports },
      ],
    ],
  });

  return {
    code: result?.code ?? source,
    map: result?.map ?? undefined,
  };
}

function collectSourceFiles(directory) {
  const files = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(entryPath));
    } else if (SOURCE_EXTENSION.test(entry.name)) {
      files.push(entryPath);
    }
  }

  return files.sort();
}

function createManifest(rootDir, sourceDirs, instrumentedImports) {
  const files = [];
  const fileIndexes = new Map();
  const locations = {};
  const filenames = normalizeSourceDirs(sourceDirs)
    .filter((sourceDir) => fs.existsSync(sourceDir))
    .flatMap(collectSourceFiles);

  for (const filename of [...new Set(filenames)].sort()) {
    const source = fs.readFileSync(filename, "utf8");
    transformSource({
      source,
      filename,
      rootDir,
      inject: false,
      instrumentedImports,
      onLocation(id, location) {
        let fileIndex = fileIndexes.get(location.fileName);
        if (fileIndex === undefined) {
          fileIndex = files.length;
          files.push(location.fileName);
          fileIndexes.set(location.fileName, fileIndex);
        }

        const tuple = [fileIndex, location.lineNumber, location.columnNumber ?? 0];
        const previous = locations[id];
        if (
          previous &&
          (previous[0] !== tuple[0] ||
            previous[1] !== tuple[1] ||
            previous[2] !== tuple[2])
        ) {
          throw new Error(`Agentation source id collision: ${id}`);
        }
        locations[id] = tuple;
      },
    });
  }

  return { version: MANIFEST_VERSION, files, locations };
}

function createManifestScript(rootDir, sourceDirs, instrumentedImports) {
  return (
    "globalThis.__AGENTATION_SOURCE_MANIFEST__=" +
    JSON.stringify(createManifest(rootDir, sourceDirs, instrumentedImports)) +
    ";\n"
  );
}

module.exports = {
  MANIFEST_VERSION,
  SOURCE_EXTENSION,
  createManifest,
  createManifestScript,
  isFileInside,
  transformSource,
};
