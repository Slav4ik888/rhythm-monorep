// packages/backend/src/models/user/services/find-user-by-email/tests/find-user-by-email.test.ts

import { serviceFindUserByEmail } from '../index';
import { db } from '../../../../../libs/firebase';
import { DbRef } from '../../../../helpers/types';
import { User } from '../../../../user/types';
import { MOCK_USER_EMPLOYEE } from '../../../../user/mocks';
import { createMockCollectionGroup } from '../../../../tests/mocks/firestore';

// Мокаем firebase целиком, чтобы не инициализировать Admin SDK в тестах.
// serviceFindUserByEmail работает напрямую с db.collectionGroup(...).
jest.mock('../../../../../libs/firebase', () => ({
  db: { collectionGroup: jest.fn() },
  admin: {},
  auth: {},
}));

const collectionGroupMock = db.collectionGroup as jest.Mock;

describe('serviceFindUserByEmail', () => {
  it('возвращает пользователя из первого документа коллекции', async () => {
    const user: User = { ...MOCK_USER_EMPLOYEE };
    const query = createMockCollectionGroup({
      get: jest.fn().mockResolvedValue({ docs: [{ data: () => user }], size: 1, empty: false }),
    });
    collectionGroupMock.mockReturnValue(query);

    const res = await serviceFindUserByEmail(user.email);

    expect(collectionGroupMock).toHaveBeenCalledWith(DbRef.USERS);
    expect(query.where).toHaveBeenCalledWith('email', '==', user.email);
    expect(query.limit).toHaveBeenCalledWith(1);
    expect(res).toEqual(user);
  });

  it('возвращает undefined, если документы не найдены', async () => {
    const query = createMockCollectionGroup({
      get: jest.fn().mockResolvedValue({ docs: [], size: 0, empty: true }),
    });
    collectionGroupMock.mockReturnValue(query);

    const res = await serviceFindUserByEmail('nobody@mail.ru');

    expect(res).toBeUndefined();
  });
});
