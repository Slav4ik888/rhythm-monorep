// packages/backend/src/config/tests/load-env.test.ts
// Unit-тесты load-env: подгрузка .env только вне production.

// Стабильный мок, на который ссылается фабрика jest.mock (префикс mock обязателен).
const mockConfig = jest.fn();

jest.mock('dotenv', () => ({ config: mockConfig }));

describe('load-env', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.resetModules();
    mockConfig.mockClear();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('подгружает .env вне production', async () => {
    process.env.NODE_ENV = 'test';
    await import('../load-env');

    expect(mockConfig).toHaveBeenCalledTimes(1);
  });

  it('не подгружает .env в production', async () => {
    process.env.NODE_ENV = 'production';
    await import('../load-env');

    expect(mockConfig).not.toHaveBeenCalled();
  });
});
