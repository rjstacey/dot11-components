module.exports = {
  stories: ["../src/**/stories.{js,tsx}", "../src/stories/*.stories.{js,tsx}"],
  framework: '@storybook/react',
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/preset-create-react-app"],
  core: {
    builder: "webpack5"
  },
  webpackFinal: async (config, { configType }) => {
    // Make whatever fine-grained changes you need
    // Return the altered config
    config.resolve.extensions.push('.ts', '.tsx')
    return config;
  },
};