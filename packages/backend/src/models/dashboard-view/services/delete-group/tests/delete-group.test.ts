// packages/backend/src/models/dashboard-view/services/delete-group/tests/delete-group.test.ts

import { serviceDashboardViewDeleteGroup } from '../index';
import { getRefDoc } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { db } from '../../../../../libs/firebase';
import { FieldValue } from 'firebase-admin/firestore';
import { createMockDocRef } from '../../../../tests/mocks/firestore';
import { createMockViewItem } from '../../../mocks';

// Мокаем помощники работы с Firestore; DbRef берём из реального (чистого) модуля types.
jest.mock('../../../../helpers', () => ({
  ...jest.requireActual('../../../../helpers/types'),
  getRefDoc: jest.fn(),
}));
// Мокаем firebase целиком, чтобы не инициализировать Admin SDK в тестах.
jest.mock('../../../../../libs/firebase', () => ({ db: { batch: jest.fn() }, admin: {}, auth: {} }));
// FieldValue.delete() возвращает sentinel; мокаем, чтобы не инициализировать firebase-admin.
jest.mock('firebase-admin/firestore', () => ({
  FieldValue: { delete: jest.fn(() => 'field-value-delete-sentinel') },
}));

const getRefDocMock = getRefDoc as jest.Mock;
const dbBatchMock = db.batch as jest.Mock;
const fieldValueDeleteMock = FieldValue.delete as unknown as jest.Mock;

const batch = {
  update: jest.fn(),
  commit: jest.fn().mockResolvedValue(undefined),
};

describe('serviceDashboardViewDeleteGroup', () => {
  beforeEach(() => {
    dbBatchMock.mockReturnValue(batch);
    batch.update.mockClear();
    batch.commit.mockClear();
  });

  it('удаляет элементы через FieldValue.delete() и обновляет компанию', async () => {
    const item1 = createMockViewItem({ id: 'item-1', bunchId: 'bunch-1' });
    const item2 = createMockViewItem({ id: 'item-2', bunchId: 'bunch-1' });

    const bunchRef = createMockDocRef();
    const companyRef = createMockDocRef();
    getRefDocMock.mockImplementation((type: DbRef) => (type === DbRef.COMPANY ? companyRef : bunchRef));

    const res = await serviceDashboardViewDeleteGroup({
      viewItems: [item1, item2],
      companyId: 'company-1',
      bunchUpdatedMs: 123,
      userId: 'user-1',
    });

    expect(batch.update).toHaveBeenCalledWith(bunchRef, { 'item-1': 'field-value-delete-sentinel' });
    expect(batch.update).toHaveBeenCalledWith(bunchRef, { 'item-2': 'field-value-delete-sentinel' });
    expect(batch.update).toHaveBeenCalledWith(companyRef, { 'bunchesUpdated.bunch-1': 123 });

    expect(fieldValueDeleteMock).toHaveBeenCalledTimes(2);
    expect(batch.commit).toHaveBeenCalledTimes(1);

    expect(res).toBeUndefined();
  });
});
