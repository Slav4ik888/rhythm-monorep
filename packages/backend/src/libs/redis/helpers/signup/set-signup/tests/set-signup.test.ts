// packages/backend/src/libs/redis/helpers/signup/set-signup/tests/set-signup.test.ts
// Unit-тесты redisSetSignup: сохранение кода и данных регистрации в Redis.

import { redisSetSignup } from '../index';
import { client } from '../../../../init';

// Мокаем init, чтобы не поднимать реальное Redis-подключение.
jest.mock('../../../../init', () => ({
  client: { hSet: jest.fn() },
}));

const hSetMock = client.hSet as jest.Mock;

const signupData = {
  firstName: 'Vasya',
  email: 'a@b.c',
  password: 'p',
  confirmPassword: 'p',
  partnerId: null,
  permissions: true,
  isMobile: false,
};

describe('redisSetSignup', () => {
  beforeEach(() => {
    hSetMock.mockReset();
    hSetMock.mockResolvedValue(undefined);
    jest.spyOn(Date, 'now').mockReturnValue(1700000000000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('сохраняет code, сериализованный signupData и времена', async () => {
    await redisSetSignup('a@b.c', signupData, '123456');

    expect(hSetMock).toHaveBeenCalledWith('a@b.c', {
      code: '123456',
      signupData: JSON.stringify(signupData),
      codeTime: 1700000000000,
      answerTime: 1700000000000,
    });
  });
});
