// packages/backend/src/models/user/services/get/tests/get.test.ts

import { serviceGetUser } from '../index';
import { getRefDoc } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { serviceCheckUserVerification } from '../check-user-verification';
import { serviceSetVerification } from '../set-verification';
import { User } from '../../../types';
import { MOCK_USER_EMPLOYEE } from '../../../mocks';
import { createMockDocRef } from '../../../../tests/mocks/firestore';

// Мокаем помощники работы с Firestore; DbRef берём из реального (чистого) модуля types.
jest.mock('../../../../helpers', () => ({
  ...jest.requireActual('../../../../helpers/types'),
  getRefDoc: jest.fn(),
}));
// Мокаем внутренние сервисы — тестируем логику get изолированно.
jest.mock('../check-user-verification', () => ({
  serviceCheckUserVerification: jest.fn(),
}));
jest.mock('../set-verification', () => ({
  serviceSetVerification: jest.fn(),
}));
// Мокаем firebase целиком: get импортирует User из models/user/index.ts → firebase.
jest.mock('../../../../../libs/firebase', () => ({ auth: {}, admin: {}, db: {} }));

const getRefDocMock = getRefDoc as jest.Mock;
const checkMock = serviceCheckUserVerification as jest.Mock;
const setMock = serviceSetVerification as jest.Mock;

describe('serviceGetUser', () => {
  it('возвращает undefined, если пользователь не существует', async () => {
    const docRef = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: false }),
    });
    getRefDocMock.mockReturnValue(docRef);

    const res = await serviceGetUser('company-id', 'user-id');

    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.USER, {
      companyId: 'company-id',
      userId: 'user-id',
    });
    expect(res).toBeUndefined();
    expect(checkMock).not.toHaveBeenCalled();
    expect(setMock).not.toHaveBeenCalled();
  });

  it('возвращает пользователя сразу, если email уже подтверждён', async () => {
    const user: User = { ...MOCK_USER_EMPLOYEE, emailVerified: true };
    const docRef = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: true, data: () => user }),
    });
    getRefDocMock.mockReturnValue(docRef);

    const res = await serviceGetUser(user.companyId, user.id);

    expect(res).toEqual(user);
    expect(checkMock).not.toHaveBeenCalled();
    expect(setMock).not.toHaveBeenCalled();
  });

  it('вызывает setVerification, когда верификация пройдена', async () => {
    const user: User = { ...MOCK_USER_EMPLOYEE };
    const docRef = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: true, data: () => user }),
    });
    getRefDocMock.mockReturnValue(docRef);
    checkMock.mockResolvedValue(true);

    const res = await serviceGetUser(user.companyId, user.id);

    expect(checkMock).toHaveBeenCalledWith(user);
    expect(setMock).toHaveBeenCalledWith(user);
    expect(res).toEqual(user);
  });

  it('не вызывает setVerification, если верификация не пройдена', async () => {
    const user: User = { ...MOCK_USER_EMPLOYEE };
    const docRef = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: true, data: () => user }),
    });
    getRefDocMock.mockReturnValue(docRef);
    checkMock.mockResolvedValue(false);

    const res = await serviceGetUser(user.companyId, user.id);

    expect(checkMock).toHaveBeenCalledWith(user);
    expect(setMock).not.toHaveBeenCalled();
    expect(res).toEqual(user);
  });
});
