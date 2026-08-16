// packages/backend/src/models/dashboard-view/services/get-all-views/tests/get-all-views.test.ts

import { serviceDashboardViewGetAllViewItems } from '../index';
import { getRefCol } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { createMockColRef } from '../../../../tests/mocks/firestore';

// Мокаем помощники работы с Firestore; DbRef берём из реального (чистого) модуля types.
jest.mock('../../../../helpers', () => ({
  ...jest.requireActual('../../../../helpers/types'),
  getRefCol: jest.fn(),
}));

const getRefColMock = getRefCol as jest.Mock;

describe('serviceDashboardViewGetAllViewItems', () => {
  it('собирает все view items из всех bunches', async () => {
    const item1 = { id: 'item-1' };
    const item2 = { id: 'item-2' };
    const colRef = createMockColRef({
      get: jest.fn().mockResolvedValue({
        empty: false,
        forEach: (cb: (doc: { data: () => Record<string, unknown> }) => void) => {
          cb({ data: () => ({ item1 }) });
          cb({ data: () => ({ item2 }) });
        },
      }),
    });
    getRefColMock.mockReturnValue(colRef);

    const res = await serviceDashboardViewGetAllViewItems('company-1');

    expect(getRefColMock).toHaveBeenCalledWith(DbRef.BUNCHES, { companyId: 'company-1' });
    expect(res).toEqual([item1, item2]);
  });

  it('возвращает пустой массив, если bunches пусты', async () => {
    const colRef = createMockColRef({
      get: jest.fn().mockResolvedValue({ empty: true, forEach: jest.fn() }),
    });
    getRefColMock.mockReturnValue(colRef);

    const res = await serviceDashboardViewGetAllViewItems('company-1');

    expect(res).toEqual([]);
  });
});
