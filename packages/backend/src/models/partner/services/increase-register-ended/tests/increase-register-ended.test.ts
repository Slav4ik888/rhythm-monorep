// packages/backend/src/models/partner/services/increase-register-ended/tests/increase-register-ended.test.ts

import { serviceIncreaseRegisterEnded } from '../index';
import { getRefDoc } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { db } from '../../../../../libs/firebase';
import { createMockDocRef } from '../../../../tests/mocks/firestore';
import { createMockPartner } from '../../../mocks';

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

describe('serviceIncreaseRegisterEnded', () => {
  beforeEach(() => {
    dbBatchMock.mockReturnValue(batch);
    batch.update.mockClear();
    batch.commit.mockClear();
  });

  it('ничего не делает, если документ партнёра не найден', async () => {
    const ref = createMockDocRef({ get: jest.fn().mockResolvedValue({ exists: false }) });
    getRefDocMock.mockReturnValue(ref);

    const res = await serviceIncreaseRegisterEnded('azbuka', 'ivan@example.com', 'company-1');

    expect(res).toBeUndefined();
    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.PARTNER, { partnerId: 'azbuka' });
    expect(dbBatchMock).not.toHaveBeenCalled();
  });

  it('увеличивает registered и дополняет registeredData', async () => {
    const partner = createMockPartner({
      registered: 3,
      registeredData: {
        'old@example.com': { email: 'old@example.com', companyId: 'company-old', createdAt: 1 },
      },
    });
    const ref = createMockDocRef({ get: jest.fn().mockResolvedValue({ exists: true, data: () => partner }) });
    getRefDocMock.mockReturnValue(ref);

    await serviceIncreaseRegisterEnded('azbuka', 'ivan@example.com', 'company-1');

    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.PARTNER, { partnerId: 'azbuka' });
    expect(dbBatchMock).toHaveBeenCalledTimes(1);

    expect(batch.update).toHaveBeenCalledTimes(2);
    expect(batch.update).toHaveBeenNthCalledWith(1, ref, { registered: 4 });
    expect(batch.update).toHaveBeenNthCalledWith(2, ref, {
      registeredData: {
        'old@example.com': { email: 'old@example.com', companyId: 'company-old', createdAt: 1 },
        'ivan@example.com': { email: 'ivan@example.com', companyId: 'company-1', createdAt: expect.any(Number) },
      },
    });
    expect(batch.commit).toHaveBeenCalledTimes(1);
  });

  it('инициализирует registered=1 и создаёт запись при пустом счётчике', async () => {
    const partner = createMockPartner();
    const ref = createMockDocRef({ get: jest.fn().mockResolvedValue({ exists: true, data: () => partner }) });
    getRefDocMock.mockReturnValue(ref);

    await serviceIncreaseRegisterEnded('azbuka', 'ivan@example.com', 'company-1');

    expect(batch.update).toHaveBeenNthCalledWith(1, ref, { registered: 1 });
    expect(batch.update).toHaveBeenNthCalledWith(2, ref, {
      registeredData: {
        'ivan@example.com': { email: 'ivan@example.com', companyId: 'company-1', createdAt: expect.any(Number) },
      },
    });
  });
});
