// packages/frontend/config/jest/jest.config-shared.js

/* eslint-disable @typescript-eslint/no-require-imports */
const cfg = require('./jest.config.js');

/** @type {import('jest').Config} */
const config = Object.assign(cfg, {
  displayName: {
    name: 'SHARED',
    color: 'blue',
  },
  testMatch: ['**/shared/**/*.test.ts'],
});

module.exports = config;
