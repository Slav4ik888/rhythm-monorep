// packages/backend/src/models/templates/services/delete/tests/delete.test.ts

import { serviceDashboardDeleteTemlate } from '../index';
import { getRefDoc, getRefCol } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { db } from '../../../../../libs/firebase';
import { FieldValue } from 'firebase-admin/firestore';
import { createMockColRef, createMockDocRef } from '../../../../tests/mocks/firestore';

// Мокаем помощники работы с Firestore; DbRef берём из реального (чистого) модуля types.
jest.mock('../../../../helpers', () => ({
  ...jest.requireActual('../../../../helpers/types'),
  getRefDoc: jest.fn(),
  getRefCol: jest.fn(),
}));
// Мокаем firebase целиком, чтобы не инициализировать Admin SDK в тестах.
jest.mock('../../../../../libs/firebase', () => ({ db: { batch: jest.fn() }, admin: {}, auth: {} }));
// FieldValue.delete() возвращает sentinel; мокаем, чтобы не инициализировать firebase-admin.
jest.mock('firebase-admin/firestore', () => ({
  FieldValue: { delete: jest.fn(() => 'field-value-delete-sentinel') },
}));

const getRefDocMock = getRefDoc as jest.Mock;
const getRefColMock = getRefCol as jest.Mock;
const dbBatchMock = db.batch as jest.Mock;
const fieldValueDeleteMock = FieldValue.delete as unknown as jest.Mock;

const batch = {
  update: jest.fn(),
  commit: jest.fn().mockResolvedValue(undefined),
};

describe('serviceDashboardDeleteTemlate', () => {
  beforeEach(() => {
    dbBatchMock.mockReturnValue(batch);
    batch.update.mockClear();
    batch.commit.mockClear();
  });

  it('удаляет шаблон через FieldValue.delete() и обновляет bunchesUpdated', async () => {
    const templateRef = createMockDocRef();
    const bunchesUpdatedDoc = createMockDocRef();
    const colRef = createMockColRef({ doc: jest.fn().mockReturnValue(bunchesUpdatedDoc) });

    getRefDocMock.mockReturnValue(templateRef);
    getRefColMock.mockReturnValue(colRef);

    const args = { templateId: 'template-1', bunchId: 'bunch-1', bunchUpdatedMs: 123 };
    const res = await serviceDashboardDeleteTemlate(args);

    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.TEMPLATE, { bunchId: 'bunch-1' });
    expect(getRefColMock).toHaveBeenCalledWith(DbRef.TEMPLATES);
    expect(colRef.doc).toHaveBeenCalledWith('bunchesUpdated');

    expect(batch.update).toHaveBeenCalledWith(templateRef, { 'template-1': 'field-value-delete-sentinel' });
    expect(batch.update).toHaveBeenCalledWith(bunchesUpdatedDoc, { 'bunch-1': 123 });

    expect(fieldValueDeleteMock).toHaveBeenCalledTimes(1);
    expect(batch.commit).toHaveBeenCalledTimes(1);

    expect(res).toEqual(args);
  });
});
