// packages/backend/src/models/dashboard-view/services/create-group-items/tests/create-group-items.test.ts

import { serviceDashboardViewCreateGroupItems } from '../index';
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
  set: jest.fn(),
  update: jest.fn(),
  commit: jest.fn().mockResolvedValue(undefined),
};

describe('serviceDashboardViewCreateGroupItems', () => {
  beforeEach(() => {
    dbBatchMock.mockReturnValue(batch);
    batch.set.mockClear();
    batch.update.mockClear();
    batch.commit.mockClear();
  });

  it('при bunchAction=create создаёт первый элемент через set, остальные через update', async () => {
    const item1 = createMockViewItem({ id: 'item-1', bunchId: 'bunch-1' });
    const item2 = createMockViewItem({ id: 'item-2', bunchId: 'bunch-1' });
    const item3 = createMockViewItem({ id: 'item-3', bunchId: 'bunch-2' });

    const bunch1Ref = createMockDocRef();
    const bunch2Ref = createMockDocRef();
    const companyRef = createMockDocRef();
    getRefDocMock.mockImplementation((type: DbRef, data: { bunchId?: string }) => {
      if (type === DbRef.COMPANY) return companyRef;
      return data.bunchId === 'bunch-1' ? bunch1Ref : bunch2Ref;
    });

    const res = await serviceDashboardViewCreateGroupItems({
      viewItems: [item1, item2, item3],
      companyId: 'company-1',
      bunchUpdatedMs: 123,
      bunchAction: 'create',
      userId: 'user-1',
    });

    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.COMPANY, { companyId: 'company-1' });

    expect(batch.set).toHaveBeenCalledTimes(1);
    expect(batch.set).toHaveBeenCalledWith(bunch1Ref, {
      'item-1': expect.objectContaining({
        id: 'item-1',
        bunchId: 'bunch-1',
        createdAt: { userId: 'user-1', date: expect.any(Number) },
        lastChange: { userId: 'user-1', date: expect.any(Number) },
      }),
    });

    // Два оставшихся viewItem + компания
    expect(batch.update).toHaveBeenCalledTimes(3);
    expect(batch.update).toHaveBeenCalledWith(companyRef, { 'bunchesUpdated.bunch-1': 123 });

    expect(batch.commit).toHaveBeenCalledTimes(1);

    expect(res).toEqual({
      viewItems: [item1, item2, item3],
      companyId: 'company-1',
      bunchUpdatedMs: 123,
      bunchAction: 'create',
    });
  });

  it('при bunchAction=update обновляет все элементы через batch.update', async () => {
    const item1 = createMockViewItem({ id: 'item-1', bunchId: 'bunch-1' });
    const item2 = createMockViewItem({ id: 'item-2', bunchId: 'bunch-1' });

    const bunchRef = createMockDocRef();
    const companyRef = createMockDocRef();
    getRefDocMock.mockImplementation((type: DbRef) => (type === DbRef.COMPANY ? companyRef : bunchRef));

    const res = await serviceDashboardViewCreateGroupItems({
      viewItems: [item1, item2],
      companyId: 'company-1',
      bunchUpdatedMs: 123,
      bunchAction: 'update',
      userId: 'user-1',
    });

    expect(batch.set).not.toHaveBeenCalled();
    expect(batch.update).toHaveBeenCalledTimes(3); // два viewItem + компания
    expect(batch.commit).toHaveBeenCalledTimes(1);

    expect(res).toEqual({
      viewItems: [item1, item2],
      companyId: 'company-1',
      bunchUpdatedMs: 123,
      bunchAction: 'update',
    });
  });
});
