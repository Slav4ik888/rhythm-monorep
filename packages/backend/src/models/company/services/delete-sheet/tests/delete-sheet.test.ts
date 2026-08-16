// packages/backend/src/models/company/services/delete-sheet/tests/delete-sheet.test.ts

import { serviceCompanyDeleteSheet } from '../index';
import { getRefDoc } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { FieldValue } from 'firebase-admin/firestore';
import { createMockDocRef } from '../../../../tests/mocks/firestore';

// Мокаем помощники работы с Firestore; DbRef берём из реального (чистого) модуля types.
jest.mock('../../../../helpers', () => ({
  ...jest.requireActual('../../../../helpers/types'),
  getRefDoc: jest.fn(),
}));
// FieldValue.delete() возвращает sentinel; мокаем, чтобы не инициализировать firebase-admin.
jest.mock('firebase-admin/firestore', () => ({
  FieldValue: { delete: jest.fn(() => 'field-value-delete-sentinel') },
}));

const getRefDocMock = getRefDoc as jest.Mock;
const fieldValueDeleteMock = FieldValue.delete as unknown as jest.Mock;

describe('serviceCompanyDeleteSheet', () => {
  it('удаляет лист и фиксирует lastChange', async () => {
    const docRef = createMockDocRef();
    getRefDocMock.mockReturnValue(docRef);

    const res = await serviceCompanyDeleteSheet('company-1', 'sheet-1', 'user-1');

    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.COMPANY, { companyId: 'company-1' });
    expect(docRef.update).toHaveBeenCalledWith({
      'sheets.sheet-1': 'field-value-delete-sentinel',
      lastChange: { userId: 'user-1', date: expect.any(Number) },
    });
    expect(fieldValueDeleteMock).toHaveBeenCalled();
    expect(res).toBeUndefined();
  });
});
