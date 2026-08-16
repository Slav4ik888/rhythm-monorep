// packages/frontend/src/shared/api/hooks/use-company-queries.test.ts

import { renderHook, waitFor } from '@testing-library/react';
import { useGetParamsCompanyQuery, useUpdateCompanyMutation, useDeleteSheetMutation } from './use-company-queries';
import { createWrapper } from './tests/test-utils';
import { api } from 'shared/api';
import { useCompanyStore } from 'entities/company';
import { useUIStore } from 'entities/ui';

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

jest.mock('entities/company', () => {
  const store = {
    loading: false,
    startLoading: jest.fn(),
    finishGetParamsCompany: jest.fn(),
    failGetParamsCompany: jest.fn(),
    finishUpdateCompany: jest.fn(),
    failUpdateCompany: jest.fn(),
    finishDeleteSheet: jest.fn(),
    failDeleteSheet: jest.fn(),
  };

  const useCompanyStoreMock = (selector?: (s: any) => any) => (selector ? selector(store) : store);
  (useCompanyStoreMock as any).getState = () => store;
  (useCompanyStoreMock as any).setState = (partial: any) => Object.assign(store, partial);

  return { useCompanyStore: useCompanyStoreMock };
});

jest.mock('entities/ui', () => {
  const store = {
    setErrorStatus: jest.fn(),
    setPageLoading: jest.fn(),
  };

  return { useUIStore: { getState: () => store } };
});

const companyState = useCompanyStore.getState() as unknown as Record<string, jest.Mock>;
const uiState = useUIStore.getState() as unknown as Record<string, jest.Mock>;

describe('use-company-queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useGetParamsCompanyQuery', () => {
    it('загружает параметры компании и обновляет стор', async () => {
      const data = { id: 'c1', name: 'Компания' };
      (api.get as jest.Mock).mockResolvedValue({ data });

      const { result } = renderHook(() => useGetParamsCompanyQuery({ companyId: 'c1', dashboardSheetId: 's1' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(api.get).toHaveBeenCalledWith('/paramsCompany/get?companyId=c1&dashboardSheetId=s1', expect.any(Object));
      expect(companyState.startLoading).toHaveBeenCalled();
      expect(companyState.finishGetParamsCompany).toHaveBeenCalledWith(data);
      expect(uiState.setPageLoading).toHaveBeenCalled();
    });

    it('не делает запрос, если companyId пустой', () => {
      renderHook(() => useGetParamsCompanyQuery({ companyId: '', dashboardSheetId: 's1' }), {
        wrapper: createWrapper(),
      });

      expect(api.get).not.toHaveBeenCalled();
    });
  });

  describe('useUpdateCompanyMutation', () => {
    it('обновляет компанию, перезапрашивает параметры и инвалидирует кеш', async () => {
      const company = { id: 'c1', name: 'Новое имя' };
      (api.post as jest.Mock).mockResolvedValue({ data: { id: 'c1' } });
      (api.get as jest.Mock).mockResolvedValue({ data: { id: 'c1' } });

      const { result } = renderHook(() => useUpdateCompanyMutation(), { wrapper: createWrapper() });

      await result.current.mutateAsync(company);

      expect(api.post).toHaveBeenCalledWith('/company/update', company);
      expect(companyState.finishUpdateCompany).toHaveBeenCalledWith({ id: 'c1' });
      expect(api.get).toHaveBeenCalledWith('/paramsCompany/get?companyId=c1&dashboardSheetId=');
    });

    it('при ошибке вызывает setErrorStatus и failUpdateCompany', async () => {
      const company = { id: 'c1', name: 'Новое имя' };
      const error = { message: 'fail', response: { status: 400, data: { errors: { name: 'required' } } } };
      (api.post as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateCompanyMutation(), { wrapper: createWrapper() });

      await expect(result.current.mutateAsync(company)).rejects.toBe(error);

      expect(uiState.setErrorStatus).toHaveBeenCalledWith(400);
      expect(companyState.failUpdateCompany).toHaveBeenCalledWith({ name: 'required' });
    });
  });

  describe('useDeleteSheetMutation', () => {
    it('удаляет лист и обновляет стор', async () => {
      (api.post as jest.Mock).mockResolvedValue({ data: {} });

      const { result } = renderHook(() => useDeleteSheetMutation(), { wrapper: createWrapper() });

      await result.current.mutateAsync({ companyId: 'c1', sheetId: 's1' });

      expect(api.post).toHaveBeenCalledWith('/company/deleteSheet', { companyId: 'c1', sheetId: 's1' });
      expect(companyState.finishDeleteSheet).toHaveBeenCalledWith('s1');
    });

    it('при ошибке вызывает setErrorStatus и failDeleteSheet', async () => {
      const error = { message: 'fail', response: { status: 500, data: { errors: { general: 'Ошибка' } } } };
      (api.post as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteSheetMutation(), { wrapper: createWrapper() });

      await expect(result.current.mutateAsync({ companyId: 'c1', sheetId: 's1' })).rejects.toBe(error);

      expect(uiState.setErrorStatus).toHaveBeenCalledWith(500);
      expect(companyState.failDeleteSheet).toHaveBeenCalledWith({ general: 'Ошибка' });
    });
  });
});
