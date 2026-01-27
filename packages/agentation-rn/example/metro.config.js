const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../../..');
const libraryRoot = path.resolve(projectRoot, '..');
const librarySrc = path.resolve(libraryRoot, 'src');

const config = getDefaultConfig(projectRoot);

// Watch library and monorepo for hot reload
config.watchFolders = [libraryRoot, monorepoRoot];

// Resolve from monorepo root first to avoid duplicate React
config.resolver.nodeModulesPaths = [
  path.resolve(monorepoRoot, 'node_modules'),
  path.resolve(projectRoot, 'node_modules'),
];

// Disable package exports to avoid dist/ resolution
config.resolver.unstable_enablePackageExports = false;

// Ensure single copy of React packages
const reactPackages = ['react', 'react-native', 'react/jsx-runtime', 'react/jsx-dev-runtime'];

// Custom resolver
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Redirect agentation-rn to src/
  if (moduleName === 'agentation-rn') {
    return {
      filePath: path.resolve(librarySrc, 'index.ts'),
      type: 'sourceFile',
    };
  }

  // Ensure React packages resolve from monorepo root
  if (reactPackages.includes(moduleName)) {
    return context.resolveRequest(
      { ...context, originModulePath: path.resolve(monorepoRoot, 'index.js') },
      moduleName,
      platform
    );
  }

  // Fall back to default resolution
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
