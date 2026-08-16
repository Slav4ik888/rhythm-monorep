// packages/backend/src/models/dashboard-view/services/get-view-items/tests/get-view-items.test.ts

import { serviceGetDashboardViewItems } from '../index';
import { getRefDoc } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { createMockDocRef } from '../../../../tests/mocks/firestore';

// Мокаем помощники работы с Firestore; DbRef берём из реального (чистого) модуля types.
jest.mock('../../../../helpers', () => ({
  ...jest.requireActual('../../../../helpers/types'),
  getRefDoc: jest.fn(),
}));

const getRefDocMock = getRefDoc as jest.Mock;

describe('serviceGetDashboardViewItems', () => {
  it('собирает все элементы из существующих bunches', async () => {
    const item1 = { id: 'item-1' };
    const item2 = { id: 'item-2' };
    const bunch1Doc = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: true, data: () => ({ item1, item2 }) }),
    });
    const bunch2Doc = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: false }),
    });
    getRefDocMock.mockImplementation((_type: DbRef, { bunchId }: { bunchId: string }) =>
      bunchId === 'bunch-1' ? bunch1Doc : bunch2Doc,
    );

    const res = await serviceGetDashboardViewItems('company-1', ['bunch-1', 'bunch-2']);

    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.BUNCH, { companyId: 'company-1', bunchId: 'bunch-1' });
    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.BUNCH, { companyId: 'company-1', bunchId: 'bunch-2' });
    expect(res).toEqual([item1, item2]);
  });

  it('возвращает пустой массив, если ни один bunch не существует', async () => {
    const doc = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: false }),
    });
    getRefDocMock.mockReturnValue(doc);

    const res = await serviceGetDashboardViewItems('company-1', ['bunch-1']);

    expect(res).toEqual([]);
  });
});
