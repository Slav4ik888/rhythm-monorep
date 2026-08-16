// packages/frontend/src/shared/api/hooks/use-dashboard-view-queries.test.ts

import { renderHook, waitFor } from '@testing-library/react';
import {
  useGetBunchesQuery,
  useCreateGroupViewItemsMutation,
  useUpdateViewItemsMutation,
  useDeleteViewItemMutation,
} from './use-dashboard-view-queries';
import { createWrapper } from './tests/test-utils';
import { api } from 'shared/api';
import { useDashboardViewStore } from 'entities/dashboard-view';
import { LS } from 'shared/lib/local-storage';

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

// В тестах используем прод-ветку: bunches грузятся через API, а не из LS
jest.mock('app/config', () => ({
  __esModule: true,
  default: { IS_DEV: false, VERSION: 'test' },
}));

jest.mock('entities/dashboard-view', () => {
  const state = {
    loading: false,
    errors: {},
    entities: {} as Record<string, unknown>,
    _isLoaded: false,
    activatedMovementId: '',
    activatedCopied: undefined,
    bright: false,
    isUnsaved: false,
    selectedId: '',
    newStoredViewItem: undefined,
    prevStoredViewItem: undefined,
  };

  const setState = jest.fn((partial: any) => Object.assign(state, partial));

  return { useDashboardViewStore: { setState, getState: () => state } };
});

jest.mock('shared/lib/local-storage', () => ({
  LS: {
    getBunches: jest.fn(() => ({})),
    setBunches: jest.fn(),
    getViewBunchesUpdated: jest.fn(() => ({})),
    setViewBunchesUpdated: jest.fn(),
    getLastCompanyId: jest.fn(() => 'c1'),
  },
}));

jest.mock('shared/lib/errors', () => ({
  getPayloadError: jest.fn((payload) => payload ?? {}),
}));

jest.mock('entities/base', () => ({
  updateEntities: jest.fn((entities, items) => {
    const result = { ...(entities || {}) };
    (Array.isArray(items) ? items : [items]).forEach((item: any) => {
      result[item.id] = item;
    });
    return result;
  }),
}));

jest.mock('entities/dashboard-view/model/utils/get-viewitems-from-bunches', () => ({
  getViewitemsFromBunches: jest.fn((bunches: any) => Object.values(bunches || {})),
}));

jest.mock('entities/dashboard-view/model/utils/get-bunches-from-viewitems', () => ({
  getBunchesFromViewItems: jest.fn(() => ({})),
}));

jest.mock('entities/dashboard-view/model/utils/get-bunches-timestamps', () => ({
  getBunchesTimestamps: jest.fn(() => ({})),
}));

jest.mock('entities/dashboard-view/model/utils/update-bunches', () => ({
  updateBunches: jest.fn(() => ({})),
}));

const viewStore = useDashboardViewStore as unknown as { setState: jest.Mock };

describe('use-dashboard-view-queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useGetBunchesQuery', () => {
    it('загружает bunches через API и обновляет стор', async () => {
      const bunches = { b1: { id: 'v1' } };
      (api.post as jest.Mock).mockResolvedValue({ data: { bunches } });

      const { result } = renderHook(() => useGetBunchesQuery({ companyId: 'c1', bunchIds: ['b1'] }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(api.post).toHaveBeenCalledWith(
        '/dashboard/bunch/get',
        { companyId: 'c1', bunchIds: ['b1'] },
        expect.any(Object),
      );
      expect(LS.setBunches).toHaveBeenCalledWith('c1', expect.objectContaining({ b1: { id: 'v1' } }));
      expect(result.current.data).toEqual(bunches);
    });

    it('не делает запрос, если bunchIds пустой', () => {
      renderHook(() => useGetBunchesQuery({ companyId: 'c1', bunchIds: [] }), {
        wrapper: createWrapper(),
      });

      expect(api.post).not.toHaveBeenCalled();
    });
  });

  describe('useCreateGroupViewItemsMutation', () => {
    it('создаёт группу view-элементов через POST', async () => {
      const payload = { companyId: 'c1', viewItems: [{ id: 'v1' }] };
      (api.post as jest.Mock).mockResolvedValue({ data: {} });

      const { result } = renderHook(() => useCreateGroupViewItemsMutation(), { wrapper: createWrapper() });

      await result.current.mutateAsync(payload as any);

      expect(api.post).toHaveBeenCalledWith('/dashboard/view/createGroupItems', payload);
      expect(viewStore.setState).toHaveBeenCalledWith({ loading: false });
    });

    it('при ошибке записывает errors в стор', async () => {
      const payload = { companyId: 'c1', viewItems: [] };
      const error = { response: { data: { general: 'Ошибка создания' } } };
      (api.post as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useCreateGroupViewItemsMutation(), { wrapper: createWrapper() });

      await expect(result.current.mutateAsync(payload as any)).rejects.toBe(error);

      expect(viewStore.setState).toHaveBeenCalledWith(
        expect.objectContaining({ errors: { general: 'Ошибка создания' }, loading: false }),
      );
    });
  });

  describe('useUpdateViewItemsMutation', () => {
    it('сохраняет изменения через PATCH и обновляет стор', async () => {
      const payload = { companyId: 'c1', viewItems: [{ id: 'v1' }], bunchUpdatedMs: 1 };
      (api.patch as jest.Mock).mockResolvedValue({ data: {} });

      const { result } = renderHook(() => useUpdateViewItemsMutation(), { wrapper: createWrapper() });

      await result.current.mutateAsync(payload as any);

      expect(api.patch).toHaveBeenCalledWith('/dashboard/view/update', payload);
      expect(LS.setBunches).toHaveBeenCalled();
      expect(LS.setViewBunchesUpdated).toHaveBeenCalled();
      expect(viewStore.setState).toHaveBeenCalledWith(expect.objectContaining({ isUnsaved: false }));
    });

    it('при ошибке записывает errors в стор', async () => {
      const payload = { companyId: 'c1', viewItems: [] };
      const error = { response: { data: { general: 'Ошибка сохранения' } } };
      (api.patch as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateViewItemsMutation(), { wrapper: createWrapper() });

      await expect(result.current.mutateAsync(payload as any)).rejects.toBe(error);

      expect(viewStore.setState).toHaveBeenCalledWith(
        expect.objectContaining({ errors: { general: 'Ошибка сохранения' }, loading: false }),
      );
    });
  });

  describe('useDeleteViewItemMutation', () => {
    it('удаляет view-элементы через POST и очищает selectedId', async () => {
      const payload = { companyId: 'c1', viewItems: [{ id: 'v1' }], bunchUpdatedMs: 1 };
      (api.post as jest.Mock).mockResolvedValue({ data: {} });

      const { result } = renderHook(() => useDeleteViewItemMutation(), { wrapper: createWrapper() });

      await result.current.mutateAsync(payload as any);

      expect(api.post).toHaveBeenCalledWith('/dashboard/view/delete', payload);
      expect(LS.setBunches).toHaveBeenCalled();
      expect(viewStore.setState).toHaveBeenCalledWith(expect.objectContaining({ selectedId: '' }));
    });
  });
});
