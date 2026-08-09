// packages/frontend/src/shared/api/features/hints/dont-show-again/index.ts

import { api } from 'shared/api';

export interface ReqDontShowAgain {
  hintId: string;
  id?: string;
  companyId?: string;
  settings?: Record<string, any>;
}

/** Отправить запрос на скрытие подсказки */
export const dontShowAgain = async (payload: ReqDontShowAgain): Promise<void> => {
  await api.post('/hints/dontShowAgain', payload);
};
