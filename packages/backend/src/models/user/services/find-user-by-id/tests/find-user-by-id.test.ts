// packages/backend/src/models/user/services/find-user-by-id/tests/find-user-by-id.test.ts

import { serviceFindUserById } from '../index';
import { db } from '../../../../../libs/firebase';
import { DbRef } from '../../../../helpers/types';
import { User } from '../../../../user/types';
import { MOCK_USER_EMPLOYEE } from '../../../../user/mocks';
import { createMockCollectionGroup } from '../../../../tests/mocks/firestore';

// Мокаем firebase целиком, чтобы не инициализировать Admin SDK в тестах.
jest.mock('../../../../../libs/firebase', () => ({
  db: { collectionGroup: jest.fn() },
  admin: {},
  auth: {},
}));

const collectionGroupMock = db.collectionGroup as jest.Mock;

describe('serviceFindUserById', () => {
  it('возвращает пользователя по id из первого документа коллекции', async () => {
    const user: User = { ...MOCK_USER_EMPLOYEE };
    const query = createMockCollectionGroup({
      get: jest.fn().mockResolvedValue({ docs: [{ data: () => user }], size: 1, empty: false }),
    });
    collectionGroupMock.mockReturnValue(query);

    const res = await serviceFindUserById(user.id);

    expect(collectionGroupMock).toHaveBeenCalledWith(DbRef.USERS);
    expect(query.where).toHaveBeenCalledWith('id', '==', user.id);
    expect(query.limit).toHaveBeenCalledWith(1);
    expect(res).toEqual(user);
  });

  it('возвращает undefined, если документы не найдены', async () => {
    const query = createMockCollectionGroup({
      get: jest.fn().mockResolvedValue({ docs: [], size: 0, empty: true }),
    });
    collectionGroupMock.mockReturnValue(query);

    const res = await serviceFindUserById('unknown-id');

    expect(res).toBeUndefined();
  });
});
