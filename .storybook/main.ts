module.exports = {
  stories: ["../src/**/stories.{js,tsx}", "../src/stories/*.stories.{js,tsx}"],

  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },

  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/preset-create-react-app"],

  webpackFinal: async (config, { configType }) => {
    // Make whatever fine-grained changes you need
    // Return the altered config
    config.resolve.extensions.push('.ts', '.tsx')
    return config;
  },

  docs: {
    autodocs: true
  }
};