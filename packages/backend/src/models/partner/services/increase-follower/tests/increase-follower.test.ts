// packages/backend/src/models/partner/services/increase-follower/tests/increase-follower.test.ts

import { serviceIncreaseFollower } from '../index';
import { getRefDoc } from '../../../../helpers';
import { DbRef } from '../../../../helpers/types';
import { createMockDocRef } from '../../../../tests/mocks/firestore';

// Мокаем помощники работы с Firestore; DbRef берём из реального (чистого) модуля types.
jest.mock('../../../../helpers', () => ({
  ...jest.requireActual('../../../../helpers/types'),
  getRefDoc: jest.fn(),
}));

const getRefDocMock = getRefDoc as jest.Mock;

describe('serviceIncreaseFollower', () => {
  it('увеличивает followers существующего партнёра через update (convertToDot)', async () => {
    const ref = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: true, data: () => ({ id: 'azbuka', followers: 5 }) }),
    });
    getRefDocMock.mockReturnValue(ref);

    await serviceIncreaseFollower('azbuka');

    expect(getRefDocMock).toHaveBeenCalledWith(DbRef.PARTNER, { partnerId: 'azbuka' });
    expect(ref.get).toHaveBeenCalledTimes(1);
    // convertToDot({ followers: 6 }) → { followers: 6 }
    expect(ref.update).toHaveBeenCalledWith({ followers: 6 });
    expect(ref.set).not.toHaveBeenCalled();
  });

  it('ставит followers=1, если у партнёра нет счётчика followers', async () => {
    const ref = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: true, data: () => ({ id: 'azbuka' }) }),
    });
    getRefDocMock.mockReturnValue(ref);

    await serviceIncreaseFollower('azbuka');

    expect(ref.update).toHaveBeenCalledWith({ followers: 1 });
    expect(ref.set).not.toHaveBeenCalled();
  });

  it('создаёт нового партнёра через set при отсутствии документа', async () => {
    const ref = createMockDocRef({
      get: jest.fn().mockResolvedValue({ exists: false }),
    });
    getRefDocMock.mockReturnValue(ref);

    await serviceIncreaseFollower('azbuka');

    expect(ref.set).toHaveBeenCalledWith({ id: 'azbuka', followers: 1 });
    expect(ref.update).not.toHaveBeenCalled();
  });
});
