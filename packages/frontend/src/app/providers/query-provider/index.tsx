// packages/frontend/src/app/providers/query-provider/index.tsx
// TanStack Query v5 — провайдер для серверного состояния
// Заменяет ручные loading/errors в Zustand-сторах для серверных данных

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { FC, ReactNode } from 'react';

/** Конфигурация QueryClient с разумными значениями по умолчанию */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Данные считаются свежими 30 секунд
      staleTime: 30 * 1000,
      // Кешируются 5 минут
      gcTime: 5 * 60 * 1000,
      // 3 попытки при ошибке
      retry: 3,
      // Не перезапрашивать при возвращении фокуса (у нас данные меняются редко)
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Мутации не ретраим по умолчанию
      retry: 0,
    },
  },
});

interface Props {
  children: ReactNode;
}

export const QueryProvider: FC<Props> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

export { queryClient };
