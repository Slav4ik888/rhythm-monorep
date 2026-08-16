// packages/backend/src/models/auth/login/services/tests/check-is-user-disabled.test.ts

import { checkIsUserDisabled } from '../check-is-user-disabled';
import { admin } from '../../../../../libs/firebase';

// Мокаем только firebase admin — реальный Admin SDK в тестах не инициализируется.
jest.mock('../../../../../libs/firebase', () => ({
  admin: { auth: jest.fn() },
}));

const getUserByEmailMock = jest.fn();

(admin.auth as jest.Mock).mockReturnValue({ getUserByEmail: getUserByEmailMock });

describe('checkIsUserDisabled', () => {
  it('выбрасывает 400 InvalidEmail при отсутствии email', async () => {
    await expect(checkIsUserDisabled(undefined)).rejects.toMatchObject({
      statusCode: 400,
      body: { email: 'Не корректные email.' },
    });
  });

  it('выбрасывает 400 AccountDisabled для отключённого пользователя', async () => {
    getUserByEmailMock.mockResolvedValue({ disabled: true });

    await expect(checkIsUserDisabled('disabled@mail.ru')).rejects.toMatchObject({
      statusCode: 400,
      body: { email: 'Данный аккаунт отключен. Обратитесь в службу технической поддержки.' },
    });

    expect(getUserByEmailMock).toHaveBeenCalledWith('disabled@mail.ru');
  });

  it('не выбрасывает ошибку для активного пользователя', async () => {
    getUserByEmailMock.mockResolvedValue({ disabled: false });

    await expect(checkIsUserDisabled('active@mail.ru')).resolves.toBeUndefined();
  });
});
