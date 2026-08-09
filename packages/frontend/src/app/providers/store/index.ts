// packages/frontend/src/app/providers/store/index.ts
// Заглушка после удаления Redux. Оставлена для обратной совместимости импортов.

import type { Errors } from 'shared/lib/validators';

export interface CustomAxiosError {
  code?: string;
  response?: {
    data?: Errors;
  };
}

/** Обработчик ошибок. В старом Redux принимал (error, dispatch). Теперь dispatch не нужен. */
export const errorHandlers = (error: CustomAxiosError, _dispatch?: any, _opts?: any): Errors =>
  error?.response?.data || { general: 'Unknown error' };

/** Заглушка StateSchema для тестов, которые ещё не переписаны на Zustand */
export type StateSchema = Record<string, any>;

/** Заглушка StoreProvider для тестов (импортируется из move-item-up-downward.test.tsx и action-main-*.test.tsx) */
export const StoreProvider = ({ children, initialState }: { children: React.ReactNode; initialState?: any }) =>
  children as React.ReactElement;
