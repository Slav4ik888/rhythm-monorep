// packages/backend/config/jest/jest.config-emulators.ts
// Отдельный прогон «реальных» сценариев входа/регистрации против Firebase-эмуляторов
// (docker compose up -d) + Redis. Не входит в обычный `npm test`: запускается явно через
// `npm run test:emulators -w packages/backend`.

import type { Config } from 'jest';

const config: Config = {
  displayName: 'EMULATORS',
  clearMocks: true,
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleDirectories: ['node_modules', 'src'],
  modulePaths: ['<rootDir>src'],
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'ts', 'json', 'node'],
  roots: ['../../'],
  testMatch: ['**/*.emulators.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/shared/', '/server/'],
  // setupFiles (а не AfterEnv): env эмуляторов и секреты должны быть в process.env
  // ДО импорта libs/firebase (admin-sdk инициализируется на этапе require).
  setupFiles: ['<rootDir>setup-emulators.ts'],
  // Эмуляторы и Redis отвечают по сети — даём больше времени на первый запуск.
  testTimeout: 30_000,
};

export default config;
