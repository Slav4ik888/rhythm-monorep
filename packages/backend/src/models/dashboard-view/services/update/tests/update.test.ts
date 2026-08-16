// packages/backend/src/models/dashboard-view/services/update/tests/update.test.ts

import { serviceDashboardUpdateGroupItems } from '../index';
import { getRefDoc } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { db } from '../../../../../libs/firebase';
import { createMockDocRef } from '../../../../tests/mocks/firestore';
import { createMockViewItem } from '../../../mocks';

// Мокаем помощники работы с Firestore; DbRef берём из реального (чистого) модуля types.
jest.mock('../../../../helpers', () => ({
  ...jest.requireActual('../../../../helpers/types'),
  getRefDoc: jest.fn(),
}));
// Мокаем firebase целиком, чтобы не инициализировать Admin SDK в тестах.
jest.mock('../../../../../libs/firebase', () => ({ db: { batch: jest.fn() }, admin: {}, auth: {} }));

const getRefDocMock = getRefDoc as jest.Mock;
const dbBatchMock = db.batch as jest.Mock;

const batch = {
  update: jest.fn(),
  commit: jest.fn().mockResolvedValue(undefined),
};

describe('serviceDashboardUpdateGroupItems', () => {
  beforeEach(() => {
    dbBatchMock.mockReturnValue(batch);
    batch.update.mockClear();
    batch.commit.mockClear();
  });

  it('обновляет каждый viewItem с lastChange и компанию с bunchesUpdated', async () => {
    const item1 = createMockViewItem({ id: 'item-1', bunchId: 'bunch-1' });
    const item2 = createMockViewItem({ id: 'item-2', bunchId: 'bunch-2' });

    const bunch1Ref = createMockDocRef();
    const bunch2Ref = createMockDocRef();
    const companyRef = createMockDocRef();
    getRefDocMock.mockImplementation((type: DbRef, data: { bunchId?: string }) => {
      if (type === DbRef.COMPANY) return companyRef;
      return data.bunchId === 'bunch-1' ? bunch1Ref : bunch2Ref;
    });

    const res = await serviceDashboardUpdateGroupItems({
      viewItems: [item1, item2],
      companyId: 'company-1',
      bunchUpdatedMs: 123,
      userId: 'user-1',
    });

    // lastChange.date берётся из bunchUpdatedMs (creatorFixDate(userId, bunchUpdatedMs))
    expect(batch.update).toHaveBeenCalledWith(
      bunch1Ref,
      expect.objectContaining({
        'item-1.id': 'item-1',
        'item-1.lastChange.userId': 'user-1',
        'item-1.lastChange.date': 123,
      }),
    );
    expect(batch.update).toHaveBeenCalledWith(
      bunch2Ref,
      expect.objectContaining({
        'item-2.id': 'item-2',
        'item-2.lastChange.userId': 'user-1',
        'item-2.lastChange.date': 123,
      }),
    );

    expect(batch.update).toHaveBeenCalledWith(companyRef, {
      'bunchesUpdated.bunch-1': 123,
      'bunchesUpdated.bunch-2': 123,
    });

    expect(batch.commit).toHaveBeenCalledTimes(1);

    expect(res).toEqual({
      viewItems: [item1, item2],
      companyId: 'company-1',
      bunchUpdatedMs: 123,
    });
  });
});
