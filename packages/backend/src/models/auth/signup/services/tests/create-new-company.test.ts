// packages/backend/src/models/auth/signup/services/tests/create-new-company.test.ts

import { createNewCompany } from '../create-new-company';
import { getRefCol, getRefDoc } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { MOCK_SIGNUP_DATA_FULL } from '../../mocks';
import { createMockColRef, createMockDocRef } from '../../../../tests/mocks/firestore';

// Мокаем помощников работы с Firestore: сервис через них обращается к БД.
// DbRef берём из реального (чистого) модуля types — он не тянет firebase.
jest.mock('../../../../helpers', () => ({
  ...jest.requireActual('../../../../helpers/types'),
  getRefCol: jest.fn(),
  getRefDoc: jest.fn(),
}));
// Мокаем firebase целиком, чтобы не инициализировать Admin SDK в тестах.
jest.mock('../../../../../libs/firebase', () => ({ auth: {}, admin: {}, db: {} }));

const getRefColMock = getRefCol as jest.Mock;
const getRefDocMock = getRefDoc as jest.Mock;

describe('createNewCompany', () => {
  it('создаёт компанию, заполняет owner/ownerId и возвращает companyId', async () => {
    const colRef = createMockColRef({
      add: jest.fn().mockResolvedValue({ id: 'mock-company-id' }),
    });
    getRefColMock.mockReturnValue(colRef);

    const docRef = createMockDocRef();
    getRefDocMock.mockReturnValue(docRef);

    const res = await createNewCompany(MOCK_SIGNUP_DATA_FULL, 'mock-user-id');

    expect(getRefColMock).toHaveBeenCalledWith(DbRef.COMPANIES);
    expect(colRef.add).toHaveBeenCalledWith(
      expect.objectContaining({
        companyName: 'Bobby Mayers',
        owner: MOCK_SIGNUP_DATA_FULL.email,
        ownerId: 'mock-user-id',
      }),
    );

    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.COMPANY, { companyId: 'mock-company-id' });
    expect(docRef.update).toHaveBeenCalledWith(expect.objectContaining({ id: 'mock-company-id' }));

    expect(res.companyId).toBe('mock-company-id');
    expect(res.newCompanyData.id).toBe('mock-company-id');
    expect(res.newCompanyData.createdAt.userId).toBe('mock-user-id');
    expect(res.newCompanyData.lastChange.userId).toBe('mock-user-id');
    expect(typeof res.newCompanyData.createdAt.date).toBe('number');
  });
});
