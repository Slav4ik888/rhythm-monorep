// packages/backend/src/interceptors/tests/check-version.interceptor.test.ts
// Unit-тесты CheckVersionInterceptor: сверка заголовка X-Client-Version с версией сервера.

import { CallHandler, ExecutionContext, HttpException } from '@nestjs/common';
import { of } from 'rxjs';
import { CheckVersionInterceptor } from '../check-version.interceptor';
import { loggerApp } from '../../libs/loggers';

// Мокаем логгер, чтобы winston не создавал File-transports.
jest.mock('../../libs/loggers', () => ({
  loggerApp: { error: jest.fn() },
}));

// Фиксируем версию сервера для предсказуемых ассертов.
jest.mock('../../app/config', () => ({
  cfg: { VERSION: '2.39.0' },
}));

const loggerAppErrorMock = loggerApp.error as jest.Mock;

const createContext = (request: unknown): ExecutionContext =>
  ({ switchToHttp: () => ({ getRequest: () => request }) }) as unknown as ExecutionContext;

describe('CheckVersionInterceptor', () => {
  let interceptor: CheckVersionInterceptor;

  beforeEach(() => {
    interceptor = new CheckVersionInterceptor();
  });

  it('пропускает запрос, если версия клиента совпадает с серверной', () => {
    const request = { headers: { 'x-client-version': '2.39.0' } };
    const handleResult = of('ok');
    const next = { handle: jest.fn().mockReturnValue(handleResult) } as unknown as CallHandler;

    const result = interceptor.intercept(createContext(request), next);

    expect(result).toBe(handleResult);
    expect(next.handle).toHaveBeenCalledTimes(1);
  });

  it('пропускает запрос без заголовка версии (health-check, curl)', () => {
    const request = { headers: {} };
    const handleResult = of('ok');
    const next = { handle: jest.fn().mockReturnValue(handleResult) } as unknown as CallHandler;

    const result = interceptor.intercept(createContext(request), next);

    expect(result).toBe(handleResult);
  });

  it('бросает 409 Conflict при рассинхроне версии', () => {
    const request = { headers: { 'x-client-version': '1.0.0' } };
    const next = { handle: jest.fn() } as unknown as CallHandler;

    let caught: unknown;
    try {
      interceptor.intercept(createContext(request), next);
    } catch (err) {
      caught = err;
    }

    expect(caught).toBeInstanceOf(HttpException);
    const httpErr = caught as HttpException;
    expect(httpErr.getStatus()).toBe(409);
    expect(httpErr.getResponse()).toEqual({
      error: 'Version mismatch',
      clientVersion: '1.0.0',
      serverVersion: '2.39.0',
      updateRequired: true,
    });
    expect(next.handle).not.toHaveBeenCalled();
    expect(loggerAppErrorMock).toHaveBeenCalled();
  });
});
