// packages/backend/src/models/templates/services/get-templates/tests/get-templates.test.ts

import { serviceGetTemplates } from '../index';
import { getRefDoc } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { createMockDocRef } from '../../../../tests/mocks/firestore';

// Мокаем помощники работы с Firestore; DbRef берём из реального (чистого) модуля types.
jest.mock('../../../../helpers', () => ({
  ...jest.requireActual('../../../../helpers/types'),
  getRefDoc: jest.fn(),
}));

const getRefDocMock = getRefDoc as jest.Mock;

describe('serviceGetTemplates', () => {
  it('собирает шаблоны из существующих bunches и подставляет bunchesUpdated', async () => {
    const template1 = { id: 'template-1' };
    const template2 = { id: 'template-2' };
    const bunch1Doc = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: true, data: () => ({ template1, template2 }) }),
    });
    const bunch2Doc = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: false }),
    });
    const bunchesUpdatedDoc = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: true, data: () => ({ 'bunch-1': 123 }) }),
    });
    getRefDocMock.mockImplementation((_type: DbRef, { bunchId }: { bunchId: string }) => {
      if (bunchId === 'bunchesUpdated') return bunchesUpdatedDoc;
      return bunchId === 'bunch-1' ? bunch1Doc : bunch2Doc;
    });

    const res = await serviceGetTemplates(['bunch-1', 'bunch-2']);

    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.TEMPLATE, { bunchId: 'bunch-1' });
    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.TEMPLATE, { bunchId: 'bunch-2' });
    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.TEMPLATE, { bunchId: 'bunchesUpdated' });
    expect(res).toEqual({
      templates: [template1, template2],
      bunchesUpdated: { 'bunch-1': 123 },
    });
  });

  it('возвращает пустой список и пустой bunchesUpdated при отсутствии данных', async () => {
    const emptyDoc = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: false }),
    });
    getRefDocMock.mockReturnValue(emptyDoc);

    const res = await serviceGetTemplates(['bunch-1']);

    expect(res).toEqual({ templates: [], bunchesUpdated: {} });
  });
});
