// packages/backend/src/libs/firebase/auth/tests/create-session-fastify.test.ts
// Unit-тесты createSessionFastify: создание session cookie через Firebase Admin,
// сохранение сессии в Redis и установка Set-Cookie заголовка через Fastify reply.

import { createSessionFastify } from '../create-session-fastify';
import { admin } from '../../config/admin-sdk';
import { redisSetSession } from '../../../redis';

// Мокаем admin SDK: используется только admin.auth().createSessionCookie.
jest.mock('../../config/admin-sdk', () => ({
  admin: { auth: jest.fn() },
}));

// Мокаем redis: сессия сохраняется без реального подключения.
jest.mock('../../../redis', () => ({
  redisSetSession: jest.fn(),
}));

// Фиксируем конфиг для предсказуемых ассертов (SESSION_EXP / COOKIE_NAME).
jest.mock('../../../../app/config', () => ({
  cfg: { SESSION_EXP: 86_400_000, COOKIE_NAME: 'rhythm' },
}));

const adminAuthMock = admin.auth as jest.Mock;
const createSessionCookieMock = jest.fn();
const redisSetSessionMock = redisSetSession as jest.Mock;

describe('createSessionFastify', () => {
  beforeEach(() => {
    createSessionCookieMock.mockReset();
    createSessionCookieMock.mockResolvedValue('session-cookie-456');
    adminAuthMock.mockReset();
    adminAuthMock.mockReturnValue({ createSessionCookie: createSessionCookieMock });
    redisSetSessionMock.mockReset();
    redisSetSessionMock.mockResolvedValue(undefined);
  });

  it('создаёт session cookie, сохраняет сессию в Redis и ставит Set-Cookie', async () => {
    const reply = { header: jest.fn() };
    const user = { id: 'uid123', email: 'a@b.c' };

    await createSessionFastify(reply as any, 'id-token-123', user as any);

    // session cookie создаётся через Firebase Admin с переданным сроком действия
    expect(adminAuthMock).toHaveBeenCalled();
    expect(createSessionCookieMock).toHaveBeenCalledWith('id-token-123', { expiresIn: 86_400_000 });

    // сессия сохраняется в Redis (user + sessionCookie)
    expect(redisSetSessionMock).toHaveBeenCalledWith(user, 'session-cookie-456');

    // cookie формата userId/sessionCookie с корректными атрибутами
    expect(reply.header).toHaveBeenCalledWith(
      'Set-Cookie',
      'rhythm=uid123/session-cookie-456; Path=/; Max-Age=86400; HttpOnly',
    );
  });

  it('вычисляет Max-Age как expiresIn / 1000 (секунды)', async () => {
    const reply = { header: jest.fn() };

    await createSessionFastify(reply as any, 'id-token-123', { id: 'uid123' } as any);

    expect(reply.header).toHaveBeenCalledWith('Set-Cookie', expect.stringContaining('Max-Age=86400'));
  });
});
