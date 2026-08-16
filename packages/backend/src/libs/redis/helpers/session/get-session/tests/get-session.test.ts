// packages/backend/src/libs/redis/helpers/session/get-session/tests/get-session.test.ts
// Unit-тесты redisGetSession: чтение cookie и пользователя из Redis по userId.

import { redisGetSession } from '../index';
import { client } from '../../../../init';

// Мокаем init, чтобы не поднимать реальное Redis-подключение.
jest.mock('../../../../init', () => ({
  client: { hGetAll: jest.fn() },
}));

const hGetAllMock = client.hGetAll as jest.Mock;

describe('redisGetSession', () => {
  beforeEach(() => {
    hGetAllMock.mockReset();
  });

  it('возвращает cookie и распарсенного пользователя', async () => {
    hGetAllMock.mockResolvedValue({
      cookie: 'session123',
      user: JSON.stringify({ id: 'u1', email: 'a@b.c' }),
    });

    await expect(redisGetSession('u1')).resolves.toEqual({
      cookie: 'session123',
      user: { id: 'u1', email: 'a@b.c' },
    });

    expect(hGetAllMock).toHaveBeenCalledWith('u1');
  });

  it('возвращает пустую cookie и пустую строку user при отсутствии данных', async () => {
    hGetAllMock.mockResolvedValue(undefined);

    const res = await redisGetSession('u1');

    expect(res.cookie).toBe('');
    expect(res.user).toBe('');
  });

  it('возвращает пустую строку user при пустом JSON', async () => {
    hGetAllMock.mockResolvedValue({ cookie: 'session123', user: '' });

    const res = await redisGetSession('u1');

    expect(res.cookie).toBe('session123');
    expect(res.user).toBe('');
  });
});
