// packages/backend/src/libs/redis/helpers/session/set-session/tests/set-session.test.ts
// Unit-тесты redisSetSession: сохранение cookie и сериализованного пользователя в Redis.

import { redisSetSession } from '../index';
import { client } from '../../../../init';

// Мокаем init, чтобы не поднимать реальное Redis-подключение.
jest.mock('../../../../init', () => ({
  client: { hSet: jest.fn() },
}));

const hSetMock = client.hSet as jest.Mock;

describe('redisSetSession', () => {
  beforeEach(() => {
    hSetMock.mockReset();
    hSetMock.mockResolvedValue(undefined);
  });

  it('сохраняет cookie и сериализованного пользователя под id пользователя', async () => {
    const user = { id: 'u1', email: 'a@b.c' };

    await redisSetSession(user as any, 'session123');

    expect(hSetMock).toHaveBeenCalledWith('u1', {
      cookie: 'session123',
      user: JSON.stringify(user),
    });
  });
});
