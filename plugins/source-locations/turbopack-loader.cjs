const { isFileInside, transformSource } = require("./core.cjs");

module.exports = function agentationSourceLocationLoader(source) {
  this.cacheable(true);
  const callback = this.async();
  const { rootDir, sourceDirs, instrumentedImports } = this.getOptions();

  if (!sourceDirs.some((sourceDir) => isFileInside(sourceDir, this.resourcePath))) {
    callback(null, source);
    return;
  }

  try {
    const result = transformSource({
      source: source.toString(),
      filename: this.resourcePath,
      rootDir,
      inject: true,
      instrumentedImports,
    });
    callback(null, result.code, result.map);
  } catch (error) {
    callback(error);
  }
};
