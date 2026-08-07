// packages/frontend/config/jest/jest.config-entities.js

/* eslint-disable @typescript-eslint/no-require-imports */
const cfg = require('./jest.config.js');

/** @type {import('jest').Config} */
const config = Object.assign(cfg, {
  displayName: 'ENTITIES',
  testMatch: ['**/entities/**/*.test.ts'],
});

module.exports = config;
