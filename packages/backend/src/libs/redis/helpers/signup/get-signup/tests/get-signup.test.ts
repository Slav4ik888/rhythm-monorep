// packages/backend/src/libs/redis/helpers/signup/get-signup/tests/get-signup.test.ts
// Unit-тесты redisGetSignup: чтение кода подтверждения и данных регистрации из Redis.

import { redisGetSignup } from '../index';
import { client } from '../../../../init';

// Мокаем init, чтобы не поднимать реальное Redis-подключение.
jest.mock('../../../../init', () => ({
  client: { hGetAll: jest.fn() },
}));

const hGetAllMock = client.hGetAll as jest.Mock;

const signupData = {
  firstName: 'Vasya',
  email: 'a@b.c',
  password: 'p',
  confirmPassword: 'p',
  partnerId: null,
  permissions: true,
  isMobile: false,
};

describe('redisGetSignup', () => {
  beforeEach(() => {
    hGetAllMock.mockReset();
  });

  it('возвращает code, распарсенный signupData и времена', async () => {
    hGetAllMock.mockResolvedValue({
      code: '123456',
      signupData: JSON.stringify(signupData),
      codeTime: '1700000000000',
      answerTime: '1700000000000',
    });

    await expect(redisGetSignup('a@b.c')).resolves.toEqual({
      code: '123456',
      signupData,
      codeTime: '1700000000000',
      answerTime: '1700000000000',
    });

    expect(hGetAllMock).toHaveBeenCalledWith('a@b.c');
  });

  it('возвращает пустые значения при отсутствии данных', async () => {
    hGetAllMock.mockResolvedValue(undefined);

    const res = await redisGetSignup('a@b.c');

    expect(res.code).toBeUndefined();
    expect(res.signupData).toBe('');
    expect(res.codeTime).toBeUndefined();
    expect(res.answerTime).toBeUndefined();
  });
});
