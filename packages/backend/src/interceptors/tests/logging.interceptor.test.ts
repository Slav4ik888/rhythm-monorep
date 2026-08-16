// packages/backend/src/interceptors/tests/logging.interceptor.test.ts
// Unit-тесты LoggingInterceptor: фильтрация internalUsers и извлечение userId.

import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { LoggingInterceptor } from '../logging.interceptor';
import { loggerUrl } from '../../libs/loggers';

// Мокаем логгер, чтобы winston не создавал File-transports.
jest.mock('../../libs/loggers', () => ({
  loggerUrl: { info: jest.fn(), error: jest.fn() },
}));

// Фиксируем имя cookie и список служебных пользователей для предсказуемых ассертов.
jest.mock('../../app/config', () => ({
  cfg: { COOKIE_NAME: 'rhythm', INTERNAL_USERS: ['pT5sk0UDkzgVGXtCRLjk72h4jwV2'] },
}));

const loggerUrlInfoMock = loggerUrl.info as jest.Mock;
const loggerUrlErrorMock = loggerUrl.error as jest.Mock;

// Один из служебных пользователей, логи которых не пишутся.
const INTERNAL_USER_ID = 'pT5sk0UDkzgVGXtCRLjk72h4jwV2';

const createContext = (request: unknown): ExecutionContext =>
  ({ switchToHttp: () => ({ getRequest: () => request }) }) as unknown as ExecutionContext;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createNext = (stream: Observable<any> = of('ok')) => ({ handle: () => stream }) as CallHandler;

describe('LoggingInterceptor', () => {
  let interceptor: LoggingInterceptor;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
  });

  describe('getUserId', () => {
    it('извлекает uid-часть из cookies (uid/session)', () => {
      const request = { cookies: { rhythm: 'uid123/session456' }, headers: {} };

      expect((interceptor as any).getUserId(request)).toBe('uid123');
    });

    it('извлекает uid-часть из cookie без session-части', () => {
      const request = { cookies: { rhythm: 'uid123' }, headers: {} };

      expect((interceptor as any).getUserId(request)).toBe('uid123');
    });

    it('извлекает uid-часть из заголовка cookie при отсутствии parsed cookies', () => {
      const request = { cookies: {}, headers: { cookie: 'rhythm=uid123/session789' } };

      expect((interceptor as any).getUserId(request)).toBe('uid123');
    });

    it('возвращает пустую строку при отсутствии cookie', () => {
      const request = { cookies: {}, headers: {} };

      expect((interceptor as any).getUserId(request)).toBe('');
    });
  });

  describe('intercept', () => {
    it('не логирует служебных пользователей', () => {
      const request = {
        url: '/api/dashboard/view/get',
        cookies: { rhythm: `${INTERNAL_USER_ID}/session` },
        headers: { referer: 'https://site' },
        body: { companyId: 'comp-1' },
      };

      interceptor.intercept(createContext(request), createNext());

      expect(loggerUrlInfoMock).not.toHaveBeenCalled();
    });

    it('логирует запрос обычного пользователя с companyId и referer', () => {
      const request = {
        url: '/api/dashboard/view/get',
        cookies: { rhythm: 'uid123/session456' },
        headers: { referer: 'https://site' },
        body: { companyId: 'comp-1' },
      };

      interceptor.intercept(createContext(request), createNext());

      expect(loggerUrlInfoMock).toHaveBeenCalledWith(
        '[r]: /api/dashboard/view/get [ci]: comp-1 [u]: uid123 [ref]: https://site',
      );
    });

    it('логирует гостя как quest при отсутствии userId', () => {
      const request = { url: '/api/auth/login/byEmail', cookies: {}, headers: {}, body: {} };

      interceptor.intercept(createContext(request), createNext());

      expect(loggerUrlInfoMock).toHaveBeenCalledWith(expect.stringContaining('[u]: quest'));
    });

    it('логирует ошибку потока ответа', () => {
      const request = {
        url: '/api/dashboard/view/get',
        cookies: { rhythm: 'uid123/session456' },
        headers: {},
        body: {},
      };

      interceptor
        .intercept(createContext(request), createNext(throwError(() => new Error('boom'))))
        .subscribe({ error: () => undefined });

      expect(loggerUrlErrorMock).toHaveBeenCalledWith('[r]: /api/dashboard/view/get [error]: boom');
    });
  });
});
