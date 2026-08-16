// packages/frontend/src/shared/api/api.test.ts
// Unit-тесты axios-инстанса api и response-interceptor (обработка 409 Conflict + сброс SW/cache)

import { api } from './api';

// Мокаем axios: создаём самодостаточный mock-instance с перехватчиками.
// Ссылку на instance получаем через api (это тот же объект, что вернул axios.create).
jest.mock('axios', () => {
  const instance = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => instance),
    },
  };
});

describe('api (axios instance)', () => {
  // Моки браузерного окружения, которых нет в jsdom
  const getRegistrations = jest.fn();
  const unregister = jest.fn();
  const cachesKeys = jest.fn();
  const cachesDelete = jest.fn();
  const reload = jest.fn();

  const regs = [{ unregister }];

  // Извлекаем перехватчики, зарегистрированные в api.ts при импорте модуля.
  // use.mock.calls[0] = [onFulfilled, onRejected]
  const useMock = api.interceptors.response.use as unknown as jest.Mock;
  const [successHandler, errorHandler] = useMock.mock.calls[0] as [
    (response: unknown) => unknown,
    (error: any) => Promise<unknown>,
  ];

  beforeAll(() => {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { getRegistrations },
    });
    Object.defineProperty(window, 'caches', {
      configurable: true,
      value: { keys: cachesKeys, delete: cachesDelete },
    });
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload },
    });
  });

  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
    getRegistrations.mockResolvedValue(regs);
    cachesKeys.mockResolvedValue(['v1', 'v2']);
    cachesDelete.mockResolvedValue(true);
  });

  describe('success handler', () => {
    it('пропускает ответ как есть', () => {
      const response = { data: { ok: true } };
      expect(successHandler(response)).toBe(response);
    });
  });

  describe('error handler', () => {
    it('пробрасывает ошибку, если статус не 409', async () => {
      const error = { response: { status: 500, data: {} } };
      await expect(errorHandler(error)).rejects.toBe(error);
      expect(reload).not.toHaveBeenCalled();
    });

    it('пробрасывает ошибку, если статус 409, но нет updateRequired', async () => {
      const error = { response: { status: 409, data: {} } };
      await expect(errorHandler(error)).rejects.toBe(error);
      expect(reload).not.toHaveBeenCalled();
    });

    it('при 409 + updateRequired сбрасывает SW, чистит кэш и перезагружает страницу', async () => {
      const error = { response: { status: 409, data: { updateRequired: true } } };

      await expect(errorHandler(error)).rejects.toBe(error);

      expect(getRegistrations).toHaveBeenCalledTimes(1);
      await Promise.resolve(); // дождаться микрозадачи getRegistrations().then(...)
      expect(unregister).toHaveBeenCalledTimes(1);

      expect(cachesKeys).toHaveBeenCalledTimes(1);
      await Promise.resolve();
      expect(cachesDelete).toHaveBeenCalledTimes(2);

      expect(reload).toHaveBeenCalledTimes(1);
      expect(sessionStorage.getItem('vcheck-reload')).not.toBeNull();
    });

    it('защита от зацикливания: не чаще одного reload в 3 секунды', async () => {
      sessionStorage.setItem('vcheck-reload', String(Date.now()));
      const error = { response: { status: 409, data: { updateRequired: true } } };

      await expect(errorHandler(error)).rejects.toBe(error);

      expect(reload).not.toHaveBeenCalled();
      expect(getRegistrations).not.toHaveBeenCalled();
      expect(cachesKeys).not.toHaveBeenCalled();
    });

    it('через 3 секунды повторный 409 снова перезагружает страницу', async () => {
      sessionStorage.setItem('vcheck-reload', String(Date.now() - 4000));
      const error = { response: { status: 409, data: { updateRequired: true } } };

      await expect(errorHandler(error)).rejects.toBe(error);

      expect(reload).toHaveBeenCalledTimes(1);
    });
  });
});
