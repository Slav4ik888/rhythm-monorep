// packages/frontend/config/jest/jest.config-widgets.js

/* eslint-disable @typescript-eslint/no-require-imports */
const cfg = require('./jest.config.js');

/** @type {import('jest').Config} */
const config = Object.assign(cfg, {
  displayName: 'WIDGETS',
  testMatch: ['**/widgets/**/*.test.ts'],
});

module.exports = config;
