// packages/backend/src/libs/redis/helpers/signup/update-signup-answer-time/tests/update-signup-answer-time.test.ts
// Unit-тесты redisUpdateSignupAnswerTime: обновление answerTime с сохранением прежнего codeTime.

import { redisUpdateSignupAnswerTime } from '../index';
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

describe('redisUpdateSignupAnswerTime', () => {
  beforeEach(() => {
    hSetMock.mockReset();
    hSetMock.mockResolvedValue(undefined);
    jest.spyOn(Date, 'now').mockReturnValue(1700000100000);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('обновляет answerTime, сохраняя прежний codeTime', async () => {
    await redisUpdateSignupAnswerTime('a@b.c', signupData, '123456', 1700000000000);

    expect(hSetMock).toHaveBeenCalledWith('a@b.c', {
      code: '123456',
      signupData: JSON.stringify(signupData),
      codeTime: 1700000000000,
      answerTime: 1700000100000,
    });
  });
});
