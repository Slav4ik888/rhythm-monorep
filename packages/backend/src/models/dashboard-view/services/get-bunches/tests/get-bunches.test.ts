// packages/backend/src/models/dashboard-view/services/get-bunches/tests/get-bunches.test.ts

import { serviceGetDashboardBunches } from '../index';
import { getRefDoc } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { createMockDocRef } from '../../../../tests/mocks/firestore';

// Мокаем помощники работы с Firestore; DbRef берём из реального (чистого) модуля types.
jest.mock('../../../../helpers', () => ({
  ...jest.requireActual('../../../../helpers/types'),
  getRefDoc: jest.fn(),
}));

const getRefDocMock = getRefDoc as jest.Mock;

describe('serviceGetDashboardBunches', () => {
  it('возвращает только существующие bunches', async () => {
    const bunch1Doc = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: true, data: () => ({ id: 'bunch-1' }) }),
    });
    const bunch2Doc = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: false }),
    });
    getRefDocMock.mockImplementation((_type: DbRef, { bunchId }: { bunchId: string }) =>
      bunchId === 'bunch-1' ? bunch1Doc : bunch2Doc,
    );

    const res = await serviceGetDashboardBunches('company-1', ['bunch-1', 'bunch-2']);

    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.BUNCH, { companyId: 'company-1', bunchId: 'bunch-1' });
    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.BUNCH, { companyId: 'company-1', bunchId: 'bunch-2' });
    expect(res).toEqual({ 'bunch-1': { id: 'bunch-1' } });
  });

  it('возвращает пустой объект, если ни один bunch не существует', async () => {
    const doc = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: false }),
    });
    getRefDocMock.mockReturnValue(doc);

    const res = await serviceGetDashboardBunches('company-1', ['bunch-1']);

    expect(res).toEqual({});
  });
});
