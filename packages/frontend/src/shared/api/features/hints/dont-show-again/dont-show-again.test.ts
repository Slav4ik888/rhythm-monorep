// packages/frontend/src/shared/api/features/hints/dont-show-again/dont-show-again.test.ts

import { dontShowAgain } from './index';
import { api } from 'shared/api';

jest.mock('axios', () => {
  const instance = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };

  return {
    __esModule: true,
    default: { create: jest.fn(() => instance) },
  };
});

describe('dontShowAgain', () => {
  it('отправляет POST на /hints/dontShowAgain с переданным payload', async () => {
    const payload = { hintId: 'hint-1', id: 'user-1', companyId: 'company-1', settings: { a: 1 } };

    (api.post as jest.Mock).mockResolvedValue({ data: {} });

    await dontShowAgain(payload);

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(api.post).toHaveBeenCalledWith('/hints/dontShowAgain', payload);
  });
});
