// packages/backend/src/models/partner/services/increase-register-started/tests/increase-register-started.test.ts

import { serviceIncreaseRegisterStarted } from '../index';
import { getRefDoc } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { db } from '../../../../../libs/firebase';
import { createMockDocRef } from '../../../../tests/mocks/firestore';
import { createMockPartner } from '../../../mocks';
import type { SignupData } from '../../../../auth/signup/types';

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

const createMockSignupData = (overrides: Partial<SignupData> = {}): SignupData => ({
  firstName: 'Иван',
  email: 'ivan@example.com',
  password: 'password',
  confirmPassword: 'password',
  partnerId: 'azbuka',
  permissions: true,
  isMobile: false,
  ...overrides,
});

describe('serviceIncreaseRegisterStarted', () => {
  beforeEach(() => {
    dbBatchMock.mockReturnValue(batch);
    batch.update.mockClear();
    batch.commit.mockClear();
  });

  it('ничего не делает, если partnerId не задан', async () => {
    const res = await serviceIncreaseRegisterStarted(createMockSignupData({ partnerId: null }));

    expect(res).toBeUndefined();
    expect(getRefDocMock).not.toHaveBeenCalled();
    expect(dbBatchMock).not.toHaveBeenCalled();
  });

  it('ничего не делает, если документ партнёра не найден', async () => {
    const ref = createMockDocRef({ get: jest.fn().mockResolvedValue({ exists: false }) });
    getRefDocMock.mockReturnValue(ref);

    await serviceIncreaseRegisterStarted(createMockSignupData());

    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.PARTNER, { partnerId: 'azbuka' });
    expect(dbBatchMock).not.toHaveBeenCalled();
  });

  it('увеличивает registerStarted и дополняет registerStartedData', async () => {
    const partner = createMockPartner({
      registerStarted: 2,
      registerStartedData: {
        'old@example.com': {
          email: 'old@example.com',
          companyName: 'Старая',
          firstName: 'Олег',
          createdAt: 1,
        },
      },
    });
    const ref = createMockDocRef({ get: jest.fn().mockResolvedValue({ exists: true, data: () => partner }) });
    getRefDocMock.mockReturnValue(ref);

    const signupData = createMockSignupData({ companyName: 'Компания' });
    await serviceIncreaseRegisterStarted(signupData);

    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.PARTNER, { partnerId: 'azbuka' });
    expect(dbBatchMock).toHaveBeenCalledTimes(1);

    expect(batch.update).toHaveBeenCalledTimes(2);
    expect(batch.update).toHaveBeenNthCalledWith(1, ref, { registerStarted: 3 });
    expect(batch.update).toHaveBeenNthCalledWith(2, ref, {
      registerStartedData: {
        'old@example.com': {
          email: 'old@example.com',
          companyName: 'Старая',
          firstName: 'Олег',
          createdAt: 1,
        },
        'ivan@example.com': {
          email: 'ivan@example.com',
          companyName: 'Компания',
          firstName: 'Иван',
          createdAt: expect.any(Number),
        },
      },
    });
    expect(batch.commit).toHaveBeenCalledTimes(1);
  });

  it('инициализирует registerStarted=1 и создаёт запись при пустом счётчике', async () => {
    const partner = createMockPartner();
    const ref = createMockDocRef({ get: jest.fn().mockResolvedValue({ exists: true, data: () => partner }) });
    getRefDocMock.mockReturnValue(ref);

    await serviceIncreaseRegisterStarted(createMockSignupData({ companyName: 'Компания' }));

    expect(batch.update).toHaveBeenNthCalledWith(1, ref, { registerStarted: 1 });
    expect(batch.update).toHaveBeenNthCalledWith(2, ref, {
      registerStartedData: {
        'ivan@example.com': {
          email: 'ivan@example.com',
          companyName: 'Компания',
          firstName: 'Иван',
          createdAt: expect.any(Number),
        },
      },
    });
  });
});
