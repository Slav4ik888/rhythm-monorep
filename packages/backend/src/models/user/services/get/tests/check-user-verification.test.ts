// packages/backend/src/models/user/services/get/tests/check-user-verification.test.ts

import { serviceCheckUserVerification } from '../check-user-verification';
import { admin } from '../../../../../libs/firebase';
import { User } from '../../../types';
import { MOCK_USER_EMPLOYEE } from '../../../mocks';

// Мокаем firebase admin — реальный Admin SDK в тестах не инициализируется.
jest.mock('../../../../../libs/firebase', () => ({
  admin: { auth: jest.fn() },
}));

const getUserMock = jest.fn();

(admin.auth as jest.Mock).mockReturnValue({ getUser: getUserMock });

describe('serviceCheckUserVerification', () => {
  it('возвращает true, если email подтверждён в Firebase Auth', async () => {
    const user: User = { ...MOCK_USER_EMPLOYEE };
    getUserMock.mockResolvedValue({ emailVerified: true });

    const res = await serviceCheckUserVerification(user);

    expect(getUserMock).toHaveBeenCalledWith(user.id);
    expect(res).toBe(true);
  });

  it('возвращает false, если email не подтверждён', async () => {
    const user: User = { ...MOCK_USER_EMPLOYEE };
    getUserMock.mockResolvedValue({ emailVerified: false });

    const res = await serviceCheckUserVerification(user);

    expect(res).toBe(false);
  });
});
