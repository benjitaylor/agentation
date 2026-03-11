import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  framework: "@storybook/react-vite",
  addons: [
    "@alexgorbatchev/storybook-addon-localstorage",
  ],
  viteFinal: (config) => {
    config.define = {
      ...config.define,
      __VERSION__: JSON.stringify("storybook"),
    };
    return config;
  },
};

export default config;
