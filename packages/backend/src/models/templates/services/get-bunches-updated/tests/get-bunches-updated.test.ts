// packages/backend/src/models/templates/services/get-bunches-updated/tests/get-bunches-updated.test.ts

import { serviceGetBunchesUpdated } from '../index';
import { getRefCol } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { createMockColRef, createMockDocRef } from '../../../../tests/mocks/firestore';

// Мокаем помощники работы с Firestore; DbRef берём из реального (чистого) модуля types.
jest.mock('../../../../helpers', () => ({
  ...jest.requireActual('../../../../helpers/types'),
  getRefCol: jest.fn(),
}));

const getRefColMock = getRefCol as jest.Mock;

describe('serviceGetBunchesUpdated', () => {
  it('возвращает данные документа bunchesUpdated', async () => {
    const doc = createMockDocRef({
      get: jest.fn().mockResolvedValue({
        exists: true,
        data: () => ({ 'bunch-1': 123, 'bunch-2': 456 }),
      }),
    });
    const colRef = createMockColRef({ doc: jest.fn().mockReturnValue(doc) });
    getRefColMock.mockReturnValue(colRef);

    const res = await serviceGetBunchesUpdated();

    expect(getRefColMock).toHaveBeenCalledWith(DbRef.TEMPLATES);
    expect(colRef.doc).toHaveBeenCalledWith('bunchesUpdated');
    expect(res).toEqual({ 'bunch-1': 123, 'bunch-2': 456 });
  });

  it('возвращает пустой объект, если документ не существует', async () => {
    const doc = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: false }),
    });
    const colRef = createMockColRef({ doc: jest.fn().mockReturnValue(doc) });
    getRefColMock.mockReturnValue(colRef);

    const res = await serviceGetBunchesUpdated();

    expect(res).toEqual({});
  });
});
