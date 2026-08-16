// packages/backend/src/models/auth/signup/services/tests/create-new-user.test.ts

import { createNewUser } from '../create-new-user';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Role } from '../../../../user/types';
import { NewUser } from '../../utils';
import { MOCK_SIGNUP_DATA_SMALL } from '../../mocks';

// Мокаем firebase целиком, чтобы не инициализировать Admin SDK в тестах.
jest.mock('../../../../../libs/firebase', () => ({ auth: {}, admin: {}, db: {} }));
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

const createUserWithEmailAndPasswordMock = createUserWithEmailAndPassword as jest.Mock;

describe('createNewUser', () => {
  it('создаёт пользователя с ролью OWNER и без служебных полей', async () => {
    createUserWithEmailAndPasswordMock.mockResolvedValue({ user: { uid: 'mock-uid' } });

    const res = await createNewUser(MOCK_SIGNUP_DATA_SMALL);
    const newUserData = res.newUserData as NewUser;

    expect(createUserWithEmailAndPasswordMock).toHaveBeenCalledWith(
      expect.anything(),
      MOCK_SIGNUP_DATA_SMALL.email,
      MOCK_SIGNUP_DATA_SMALL.password,
    );

    expect(res.userCredential).toEqual({ user: { uid: 'mock-uid' } });
    expect(newUserData.id).toBe('mock-uid');
    expect(newUserData.role).toBe(Role.OWNER);
    expect(newUserData.createdAt.userId).toBe('mock-uid');
    expect(newUserData.lastChange.userId).toBe('mock-uid');

    // Служебные поля должны быть удалены перед записью в БД
    expect(newUserData.password).toBeUndefined();
    expect(newUserData.confirmPassword).toBeUndefined();
    expect(newUserData.isMobile).toBeUndefined();
  });
});
