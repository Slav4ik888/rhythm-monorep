import { isCodeExpired } from '..';


describe('isCodeExpired', () => {
  const now = Date.now();
  const oneMinute = 60 * 1000; // 1 минута в мс
  const oneHour = 60 * oneMinute; // 1 час в мс

  beforeEach(() => {
    // Мокаем Date.now(), чтобы контролировать текущее время в тестах
    jest.spyOn(Date, 'now').mockImplementation(() => now);
  });

  afterEach(() => {
    // Восстанавливаем оригинальный Date.now()
    jest.restoreAllMocks();
  });

  it('возвращает false, если код еще не истек', () => {
    const codeTime = now - oneMinute; // Код получен 1 минуту назад
    const codeLifetime = oneHour; // Время жизни кода — 1 час
    expect(isCodeExpired(codeTime, codeLifetime)).toBe(false);
  });

  it('возвращает true, если код истек', () => {
    const codeTime = now - oneHour - 1; // Код получен 1 час и 1 мс назад
    const codeLifetime = oneHour; // Время жизни — 1 час
    expect(isCodeExpired(codeTime, codeLifetime)).toBe(true);
  });

  it('возвращает false, если код получен прямо сейчас', () => {
    const codeTime = now; // Код получен "прямо сейчас"
    const codeLifetime = oneMinute; // Время жизни — 1 минута
    expect(isCodeExpired(codeTime, codeLifetime)).toBe(false);
  });

  it('возвращает true, если время жизни кода равно 0', () => {
    const codeTime = now - 1; // Код получен 1 мс назад
    const codeLifetime = 0; // Время жизни — 0 мс (код мгновенно истекает)
    expect(isCodeExpired(codeTime, codeLifetime)).toBe(true);
  });

  it('возвращает true, если код получен в прошлом, а время жизни отрицательное (некорректный случай)', () => {
    const codeTime = now - oneMinute; // Код получен 1 минуту назад
    const codeLifetime = -oneMinute; // Отрицательное время жизни (некорректно)
    expect(isCodeExpired(codeTime, codeLifetime)).toBe(true);
  });

  it('возвращает false, если код получен в будущем (некорректный случай)', () => {
    const codeTime = now + oneMinute; // Код "получен" через минуту (ошибка логики)
    const codeLifetime = oneMinute; // Время жизни — 1 минута
    expect(isCodeExpired(codeTime, codeLifetime)).toBe(false);
  });
});

// npm run test:unit is-code-expired.test.ts
