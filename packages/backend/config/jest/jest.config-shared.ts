import type { Config } from 'jest';
import cfg from './jest.config';


const config: Config = Object.assign(cfg, {
  displayName: 'SHARED',
  testMatch: [
    '**/shared/**/*.test.ts'
  ]
});

export default config;
