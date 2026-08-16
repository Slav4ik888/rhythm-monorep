// packages/frontend/src/shared/api/features/dashboard-view/dashboard-view.test.ts

import { createGroupViewItems, updateViewItems, deleteViewItems } from './index';
import { api } from 'shared/api';
import { API_PATHS } from 'shared/api/api-paths';

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

describe('dashboard-view api', () => {
  it('createGroupViewItems: POST /dashboard/view/createGroupItems', async () => {
    const payload = { companyId: 'company-1', viewItems: [] };
    (api.post as jest.Mock).mockResolvedValue({ data: { ok: true } });

    const res = await createGroupViewItems(payload);

    expect(api.post).toHaveBeenCalledWith(API_PATHS.dashboard.view.createGroupItems, payload);
    expect(res).toEqual({ ok: true });
  });

  it('updateViewItems: POST /dashboard/view/update', async () => {
    const payload = { companyId: 'company-1', updates: {} };
    (api.post as jest.Mock).mockResolvedValue({ data: { ok: true } });

    const res = await updateViewItems(payload);

    expect(api.post).toHaveBeenCalledWith(API_PATHS.dashboard.view.update, payload);
    expect(res).toEqual({ ok: true });
  });

  it('deleteViewItems: POST /dashboard/view/delete', async () => {
    const payload = { companyId: 'company-1', viewItemIds: ['v1'] };
    (api.post as jest.Mock).mockResolvedValue({ data: { ok: true } });

    const res = await deleteViewItems(payload);

    expect(api.post).toHaveBeenCalledWith(API_PATHS.dashboard.view.delete, payload);
    expect(res).toEqual({ ok: true });
  });
});
