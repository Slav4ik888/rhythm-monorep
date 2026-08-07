import type { Config } from 'jest';
import cfg from './jest.config';


const config: Config = Object.assign(cfg, {
  displayName: {
    name: 'VALIDATORS',
    color: 'blue'
  },
  testMatch: [
    '**/*validate*.test.ts'
  ]
});

export default config;
