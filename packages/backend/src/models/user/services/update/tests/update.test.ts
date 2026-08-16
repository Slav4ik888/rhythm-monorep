// packages/backend/src/models/user/services/update/tests/update.test.ts

import { serviceUpdateUser } from '../index';
import { getRefDoc } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { PartialUser } from '../../../types';
import { creatorFixDate } from '../../../../base';
import { createMockDocRef } from '../../../../tests/mocks/firestore';

// Мокаем помощники работы с Firestore; DbRef берём из реального (чистого) модуля types.
jest.mock('../../../../helpers', () => ({
  ...jest.requireActual('../../../../helpers/types'),
  getRefDoc: jest.fn(),
}));

const getRefDocMock = getRefDoc as jest.Mock;

describe('serviceUpdateUser', () => {
  it('перезаписывает lastChange на текущего пользователя и сохраняет в БД', async () => {
    const user: PartialUser = {
      id: 'mock-user-id',
      companyId: 'mock-company-id',
      email: 'test@mail.ru',
      lastChange: creatorFixDate('old-user-id', 123),
    };
    const docRef = createMockDocRef();
    getRefDocMock.mockReturnValue(docRef);

    await serviceUpdateUser(user, 'new-user-id');

    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.USER, {
      companyId: 'mock-company-id',
      userId: 'mock-user-id',
    });
    expect(docRef.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'mock-user-id',
        companyId: 'mock-company-id',
        email: 'test@mail.ru',
        'lastChange.userId': 'new-user-id',
      }),
    );
  });

  it('не добавляет lastChange, если поля нет в данных', async () => {
    const user: PartialUser = {
      id: 'mock-user-id',
      companyId: 'mock-company-id',
      email: 'test@mail.ru',
    };
    const docRef = createMockDocRef();
    getRefDocMock.mockReturnValue(docRef);

    await serviceUpdateUser(user, 'new-user-id');

    expect(docRef.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'mock-user-id',
        companyId: 'mock-company-id',
        email: 'test@mail.ru',
      }),
    );
    expect(docRef.update).toHaveBeenCalledWith(expect.not.objectContaining({ 'lastChange.userId': expect.anything() }));
  });
});
