'use strict';

const baseConfig = require('./jest.config');

module.exports = {
  ...baseConfig,
  // The root directory that Jest should scan for tests and modules within
  rootDir: 'src/client',
};
