// packages/frontend/src/shared/api/hooks/use-auth-query.ts
// TanStack Query-хук для получения данных авторизации (GET /user/getAuth)
// Заменяет ручной loading/errors в entities/user/model/services/get-auth

import { useQuery } from '@tanstack/react-query';
import { useUserStore, getAuth } from 'entities/user';
import { queryKeys } from '../query-keys';
import { api } from '../api';
import { useCallback } from 'react';
import type { AxiosInstance } from 'axios';

interface UseAuthQueryResult {
  /** Загружены ли данные пользователя */
  isAuthLoaded: boolean;
  /** Идёт ли загрузка */
  isLoading: boolean;
  /** Ошибка загрузки */
  authError: Error | null;
}

/**
 * Хук проверки авторизации пользователя.
 * Использует существующую функцию getAuth (она обновляет Zustand-сторы user и company).
 * TanStack Query кеширует результат на всё время сессии.
 */
export const useAuthQuery = (): UseAuthQueryResult => {
  const _isLoaded = useUserStore((s) => s._isLoaded);
  const loading = useUserStore((s) => s.loading);

  const query = useQuery({
    queryKey: queryKeys.auth.getAuth,
    queryFn: useCallback(async (): Promise<null> => {
      // Используем существующую функцию getAuth (она сама обновляет Zustand-сторы)
      await getAuth({ pathname: window.location.pathname }, api as unknown as AxiosInstance);
      return null;
    }, []),
    // Данные авторизации кешируются на всё время сессии
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    isAuthLoaded: _isLoaded,
    isLoading: query.isLoading || loading,
    authError: query.error,
  };
};
