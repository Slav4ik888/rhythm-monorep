// packages/frontend/src/shared/api/hooks/use-company-queries.ts
// TanStack Query-хуки для работы с компанией
// Заменяет ручные API-вызовы в shared/api/features/company и Zustand-сторе

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCompanyStore } from 'entities/company';
import { useUIStore } from 'entities/ui';
import type { ParamsCompany, PartialCompany } from 'entities/company';
import { queryKeys } from '../query-keys';
import { api, API_PATHS } from 'shared/api';

/** Аргументы для запроса параметров компании */
interface GetParamsCompanyArgs {
  companyId: string;
  dashboardSheetId: string;
}

/** Аргументы для удаления листа */
interface DeleteSheetArgs {
  companyId: string;
  sheetId: string;
}

/**
 * Хук для получения параметров компании.
 * Автоматически обновляет Zustand-стор при успешном ответе.
 */
export const useGetParamsCompanyQuery = ({ companyId, dashboardSheetId }: GetParamsCompanyArgs) => {
  const store = useCompanyStore;
  const isLoading = useCompanyStore((s) => s.loading);

  return useQuery({
    queryKey: queryKeys.company.params(companyId, dashboardSheetId),
    queryFn: async ({ signal }): Promise<ParamsCompany> => {
      store.getState().startLoading();
      const { data } = await api.get<ParamsCompany>(
        `${API_PATHS.paramsCompany.get}?companyId=${companyId}&dashboardSheetId=${dashboardSheetId}`,
        { signal },
      );
      store.getState().finishGetParamsCompany(data);
      useUIStore.getState().setPageLoading({ 'get-params-company': { text: '', name: 'getParamsCompany' } });
      return data;
    },
    enabled: !!companyId,
    staleTime: 60 * 1000, // Параметры компании меняются редко — 1 минута
    retry: 2,
  });
};

/**
 * Хук для обновления данных компании.
 * Автоматически инвалидирует кеш параметров компании после успешного обновления.
 */
export const useUpdateCompanyMutation = () => {
  const queryClient = useQueryClient();
  const store = useCompanyStore;

  return useMutation({
    mutationFn: async (company: PartialCompany): Promise<void> => {
      store.getState().startLoading();
      const { data } = await api.post(API_PATHS.company.update, company);
      store.getState().finishUpdateCompany(data as Partial<ParamsCompany>);
      // Перезагружаем параметры компании после обновления
      if (company.id) {
        await api.get(`${API_PATHS.paramsCompany.get}?companyId=${company.id}&dashboardSheetId=`);
        queryClient.invalidateQueries({ queryKey: queryKeys.company.params(company.id, '') });
      }
    },
    onError: (err: any) => {
      const errors = err?.response?.data?.errors || { default: err.message };
      useUIStore.getState().setErrorStatus(err?.response?.status || 0);
      store.getState().failUpdateCompany(errors);
    },
  });
};

/**
 * Хук для удаления листа компании.
 * Автоматически инвалидирует кеш параметров компании после успешного удаления.
 */
export const useDeleteSheetMutation = () => {
  const queryClient = useQueryClient();
  const store = useCompanyStore;

  return useMutation({
    mutationFn: async ({ companyId, sheetId }: DeleteSheetArgs): Promise<void> => {
      store.getState().startLoading();
      await api.post(API_PATHS.company.deleteSheet, { companyId, sheetId });
      store.getState().finishDeleteSheet(sheetId);
      queryClient.invalidateQueries({ queryKey: queryKeys.company.params(companyId, '') });
    },
    onError: (err: any) => {
      const errors = err?.response?.data?.errors || { default: err.message };
      useUIStore.getState().setErrorStatus(err?.response?.status || 0);
      store.getState().failDeleteSheet(errors);
    },
  });
};
