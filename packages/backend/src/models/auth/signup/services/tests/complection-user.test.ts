// packages/backend/src/models/auth/signup/services/tests/complection-user.test.ts

import { complectionUser } from '../complection-user';
import { getRefDoc } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { MOCK_USER_EMPLOYEE } from '../../../../user/mocks';
import { createMockDocRef } from '../../../../tests/mocks/firestore';

// Мокаем помощники работы с Firestore; DbRef берём из реального (чистого) модуля types.
jest.mock('../../../../helpers', () => ({
  ...jest.requireActual('../../../../helpers/types'),
  getRefCol: jest.fn(),
  getRefDoc: jest.fn(),
}));
// Мокаем firebase целиком, чтобы не инициализировать Admin SDK в тестах.
jest.mock('../../../../../libs/firebase', () => ({ auth: {}, admin: {}, db: {} }));

const getRefDocMock = getRefDoc as jest.Mock;

describe('complectionUser', () => {
  it('проставляет companyId и сохраняет пользователя в БД', async () => {
    const docRef = createMockDocRef();
    getRefDocMock.mockReturnValue(docRef);

    const user = { ...MOCK_USER_EMPLOYEE };
    await complectionUser(user, 'mock-company-id');

    expect(user.companyId).toBe('mock-company-id');
    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.USER, {
      companyId: 'mock-company-id',
      userId: user.id,
    });
    expect(docRef.set).toHaveBeenCalledWith(user);
  });
});
