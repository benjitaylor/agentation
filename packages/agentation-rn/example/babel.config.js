const { inspectorBabelPlugin } = require('react-native-dev-inspector/metro');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Injects __callerSource prop into JSX elements with file, line, and column info
      inspectorBabelPlugin,
    ],
  };
};
