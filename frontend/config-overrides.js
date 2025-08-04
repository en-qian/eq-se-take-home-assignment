const path = require('path');

module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@api': path.resolve(__dirname, 'src/api'),
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@configs': path.resolve(__dirname, 'src/configs'),
    '@constants': path.resolve(__dirname, 'src/constants'),
    '@pages': path.resolve(__dirname, 'src/pages'),
    '@styles': path.resolve(__dirname, 'src/styles'),
    '@types': path.resolve(__dirname, 'src/types'),
    '@utils': path.resolve(__dirname, 'src/utils'),
  };

  config.resolve.modules = [path.resolve(__dirname, 'src'), 'node_modules'];

  config.devtool = false;

  return config;
};
