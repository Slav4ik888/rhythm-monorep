// packages/backend/src/libs/firebase/auth/tests/set-cookie-fastify.test.ts
// Unit-тесты setCookieFastify: получение idToken из UserCredential и делегирование
// создания session cookie в createSessionFastify.

import { setCookieFastify } from '../set-cookie-fastify';
import { createSessionFastify } from '../create-session-fastify';

// Мокаем createSessionFastify — здесь проверяем только обвязку вокруг него.
jest.mock('../create-session-fastify', () => ({
  createSessionFastify: jest.fn(),
}));

const createSessionFastifyMock = createSessionFastify as jest.Mock;

describe('setCookieFastify', () => {
  beforeEach(() => {
    createSessionFastifyMock.mockReset();
    createSessionFastifyMock.mockResolvedValue(undefined);
  });

  it('получает idToken и создаёт session cookie через createSessionFastify', async () => {
    const getIdTokenMock = jest.fn().mockResolvedValue('id-token-123');
    const userCredential = { user: { getIdToken: getIdTokenMock } };
    const reply = { header: jest.fn() };
    const user = { id: 'uid123', email: 'a@b.c' };

    await setCookieFastify(reply as any, userCredential as any, user as any, 'log-temp');

    // idToken запрашивается с принудительным обновлением
    expect(getIdTokenMock).toHaveBeenCalledWith(true);

    // делегирует создание cookie с полученным idToken и пользователем
    expect(createSessionFastifyMock).toHaveBeenCalledWith(reply, 'id-token-123', user);
  });
});
