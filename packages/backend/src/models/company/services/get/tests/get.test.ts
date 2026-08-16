// packages/backend/src/models/company/services/get/tests/get.test.ts

import { serviceGetCompany } from '../index';
import { getRefDoc } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { createMockDocRef } from '../../../../tests/mocks/firestore';
import { MOCK_COMPANY } from '../../../mocks';

// Мокаем помощники работы с Firestore; DbRef берём из реального (чистого) модуля types.
jest.mock('../../../../helpers', () => ({
  ...jest.requireActual('../../../../helpers/types'),
  getRefDoc: jest.fn(),
}));

const getRefDocMock = getRefDoc as jest.Mock;

describe('serviceGetCompany', () => {
  it('возвращает компанию, если документ существует', async () => {
    const docRef = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: true, data: () => MOCK_COMPANY }),
    });
    getRefDocMock.mockReturnValue(docRef);

    const res = await serviceGetCompany(MOCK_COMPANY.id);

    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.COMPANY, { companyId: MOCK_COMPANY.id });
    expect(res).toEqual(MOCK_COMPANY);
  });

  it('возвращает undefined, если документ не существует', async () => {
    const docRef = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: false }),
    });
    getRefDocMock.mockReturnValue(docRef);

    const res = await serviceGetCompany('unknown-id');

    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.COMPANY, { companyId: 'unknown-id' });
    expect(res).toBeUndefined();
  });
});
