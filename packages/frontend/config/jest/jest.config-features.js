// packages/frontend/config/jest/jest.config-features.js

/* eslint-disable @typescript-eslint/no-require-imports */
const cfg = require('./jest.config.js');

/** @type {import('jest').Config} */
const config = Object.assign(cfg, {
  displayName: 'FEATURES',
  testMatch: ['**/features/**/*.test.ts'],
});

module.exports = config;
