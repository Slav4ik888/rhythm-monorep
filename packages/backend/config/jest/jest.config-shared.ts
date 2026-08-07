// packages/backend/config/jest/jest.config-shared.ts

import type { Config } from 'jest';
import cfg from './jest.config';

const config: Config = {
  ...cfg,
  displayName: 'SHARED',
  // Переопределяем testPathIgnorePatterns, убирая /shared/ — иначе shared-тесты игнорируются
  testPathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/shared/**/*.test.ts'],
};

export default config;
