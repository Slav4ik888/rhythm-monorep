// packages/backend/src/guards/tests/optional-firebase-auth.guard.test.ts
// Unit-тесты OptionalFirebaseAuthGuard: опциональная аутентификация (не кидает 401).

import { ExecutionContext } from '@nestjs/common';
import { OptionalFirebaseAuthGuard } from '../optional-firebase-auth.guard';
import { admin } from '../../libs/firebase/config/admin-sdk';
import models from '../../models';

// Мокаем admin SDK
jest.mock('../../libs/firebase/config/admin-sdk', () => ({
  admin: { auth: jest.fn() },
}));

// Мокаем models: guard обращается только к models.user.serviceFindUserById
jest.mock('../../models', () => ({
  __esModule: true,
  default: { user: { serviceFindUserById: jest.fn() } },
}));

const adminAuthMock = admin.auth as jest.Mock;
const verifySessionCookieMock = jest.fn();
const serviceFindUserByIdMock = models.user.serviceFindUserById as jest.Mock;

const createContext = (request: unknown): ExecutionContext =>
  ({ switchToHttp: () => ({ getRequest: () => request }) }) as unknown as ExecutionContext;

describe('OptionalFirebaseAuthGuard', () => {
  let guard: OptionalFirebaseAuthGuard;

  beforeEach(() => {
    verifySessionCookieMock.mockReset();
    serviceFindUserByIdMock.mockReset();
    adminAuthMock.mockReturnValue({ verifySessionCookie: verifySessionCookieMock });
    guard = new OptionalFirebaseAuthGuard();
  });

  it('пропускает анонимного (без cookie) как true', async () => {
    const context = createContext({ cookies: {}, headers: {} });
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('кладёт user в request при валидной сессии', async () => {
    verifySessionCookieMock.mockResolvedValue({ uid: 'uid1' });
    serviceFindUserByIdMock.mockResolvedValue({ id: 'uid1', email: 'a@b.c' });

    const request = { cookies: { rhythm: 'uid1/sess1' }, headers: {} };
    await guard.canActivate(createContext(request));

    expect(verifySessionCookieMock).toHaveBeenCalledWith('sess1', true);
    expect((request as { user?: unknown }).user).toEqual({ id: 'uid1', email: 'a@b.c' });
  });

  it('не кидает при невалидной сессии (обрабатывается как аноним)', async () => {
    verifySessionCookieMock.mockRejectedValue(new Error('bad token'));

    const context = createContext({ cookies: { rhythm: 'uid1/sess1' }, headers: {} });
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('не кидает, если пользователь не найден в Firestore', async () => {
    verifySessionCookieMock.mockResolvedValue({ uid: 'uid1' });
    serviceFindUserByIdMock.mockResolvedValue(undefined);

    const context = createContext({ cookies: { rhythm: 'uid1/sess1' }, headers: {} });
    await expect(guard.canActivate(context)).resolves.toBe(true);
  });
});
