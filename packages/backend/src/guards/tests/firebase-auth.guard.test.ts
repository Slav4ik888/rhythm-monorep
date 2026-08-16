// packages/backend/src/guards/tests/firebase-auth.guard.test.ts
// Unit-тесты FirebaseAuthGuard: парсинг session cookie и верификация сессии.

import { ExecutionContext } from '@nestjs/common';
import { FirebaseAuthGuard } from '../firebase-auth.guard';
import { admin } from '../../libs/firebase/config/admin-sdk';
import models from '../../models';

// Мокаем admin SDK: guard использует только admin.auth().verifySessionCookie.
jest.mock('../../libs/firebase/config/admin-sdk', () => ({
  admin: { auth: jest.fn() },
}));

// Мокаем логгер, чтобы winston не создавал File-transports.
jest.mock('../../libs/loggers', () => ({
  loggerAuth: { info: jest.fn(), error: jest.fn() },
}));

// Мокаем models: guard обращается только к models.user.serviceFindUserById.
jest.mock('../../models', () => ({
  __esModule: true,
  default: { user: { serviceFindUserById: jest.fn() } },
}));

const adminAuthMock = admin.auth as jest.Mock;
const verifySessionCookieMock = jest.fn();
const serviceFindUserByIdMock = models.user.serviceFindUserById as jest.Mock;

const createContext = (request: unknown): ExecutionContext =>
  ({ switchToHttp: () => ({ getRequest: () => request }) }) as unknown as ExecutionContext;

describe('FirebaseAuthGuard', () => {
  let guard: FirebaseAuthGuard;

  beforeEach(() => {
    verifySessionCookieMock.mockReset();
    serviceFindUserByIdMock.mockReset();
    adminAuthMock.mockReturnValue({ verifySessionCookie: verifySessionCookieMock });
    guard = new FirebaseAuthGuard();
  });

  describe('extractSessionCookie', () => {
    it('извлекает session-часть из cookies (uid/session)', () => {
      const request = { cookies: { rhythm: 'uid123/session456' }, headers: {} };

      expect((guard as any).extractSessionCookie(request)).toBe('session456');
    });

    it('возвращает null, если cookie есть, но без session-части', () => {
      const request = { cookies: { rhythm: 'uid123' }, headers: {} };

      expect((guard as any).extractSessionCookie(request)).toBeNull();
    });

    it('извлекает session-часть из заголовка cookie при отсутствии parsed cookies', () => {
      const request = { cookies: {}, headers: { cookie: 'rhythm=uid123/session789; foo=bar' } };

      expect((guard as any).extractSessionCookie(request)).toBe('session789');
    });

    it('возвращает null, если заголовок cookie не содержит session-части', () => {
      const request = { cookies: {}, headers: { cookie: 'rhythm=uid123' } };

      expect((guard as any).extractSessionCookie(request)).toBeNull();
    });

    it('возвращает null при полном отсутствии cookie', () => {
      const request = { cookies: {}, headers: {} };

      expect((guard as any).extractSessionCookie(request)).toBeNull();
    });
  });

  describe('canActivate', () => {
    it('отклоняет запрос без session cookie (401)', async () => {
      const context = createContext({ cookies: {}, headers: {} });

      await expect(guard.canActivate(context)).rejects.toThrow('Cookie not authenticated');
    });

    it('пропускает запрос с валидной сессией и кладёт user в request', async () => {
      const user = { id: 'uid123', email: 'a@b.c' };
      verifySessionCookieMock.mockResolvedValue({ uid: 'uid123' });
      serviceFindUserByIdMock.mockResolvedValue(user);

      const request = { cookies: { rhythm: 'uid123/session456' }, headers: {} };
      const context = createContext(request);

      await expect(guard.canActivate(context)).resolves.toBe(true);

      expect(verifySessionCookieMock).toHaveBeenCalledWith('session456', true);
      expect(serviceFindUserByIdMock).toHaveBeenCalledWith('uid123');
      expect((request as any).user).toEqual(user);
    });

    it('отклоняет запрос, если пользователь не найден в Firestore (401)', async () => {
      verifySessionCookieMock.mockResolvedValue({ uid: 'uid123' });
      serviceFindUserByIdMock.mockResolvedValue(undefined);

      const request = { cookies: { rhythm: 'uid123/session456' }, headers: {} };
      const context = createContext(request);

      await expect(guard.canActivate(context)).rejects.toThrow('User not found');
    });

    it('отклоняет запрос при ошибке верификации токена (401)', async () => {
      verifySessionCookieMock.mockRejectedValue(new Error('invalid session'));

      const request = { cookies: { rhythm: 'uid123/session456' }, headers: {} };
      const context = createContext(request);

      await expect(guard.canActivate(context)).rejects.toThrow('Session verification failed');
    });
  });
});
