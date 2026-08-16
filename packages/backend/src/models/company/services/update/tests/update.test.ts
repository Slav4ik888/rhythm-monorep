// packages/backend/src/models/company/services/update/tests/update.test.ts

import { serviceUpdateCompany } from '../index';
import { getRefDoc } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { PartialCompany } from '../../../types';
import { creatorFixDate } from '../../../../base';
import { createMockDocRef } from '../../../../tests/mocks/firestore';

// Мокаем помощники работы с Firestore; DbRef берём из реального (чистого) модуля types.
jest.mock('../../../../helpers', () => ({
  ...jest.requireActual('../../../../helpers/types'),
  getRefDoc: jest.fn(),
}));

const getRefDocMock = getRefDoc as jest.Mock;

describe('serviceUpdateCompany', () => {
  it('перезаписывает lastChange на текущего пользователя и сохраняет в БД', async () => {
    const company: PartialCompany = {
      id: 'mock-company-id',
      companyName: 'Рога и копыта',
      lastChange: creatorFixDate('old-user-id', 123),
    };
    const docRef = createMockDocRef();
    getRefDocMock.mockReturnValue(docRef);

    const res = await serviceUpdateCompany(company, 'new-user-id');

    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.COMPANY, { companyId: 'mock-company-id' });
    expect(docRef.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'mock-company-id',
        companyName: 'Рога и копыта',
        'lastChange.userId': 'new-user-id',
      }),
    );
    // Сервис возвращает ту же компанию, но с перезаписанным lastChange.
    expect(res).toEqual(company);
    expect(res.lastChange).toEqual(expect.objectContaining({ userId: 'new-user-id' }));
  });

  it('не добавляет lastChange, если поля нет в данных', async () => {
    const company: PartialCompany = {
      id: 'mock-company-id',
      companyName: 'Рога и копыта',
    };
    const docRef = createMockDocRef();
    getRefDocMock.mockReturnValue(docRef);

    await serviceUpdateCompany(company, 'new-user-id');

    expect(docRef.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'mock-company-id',
        companyName: 'Рога и копыта',
      }),
    );
    expect(docRef.update).toHaveBeenCalledWith(expect.not.objectContaining({ 'lastChange.userId': expect.anything() }));
  });
});
