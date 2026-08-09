// packages/frontend/src/shared/api/features/transactions/index.ts
// Отправка транзакций на сервер

import { api, API_PATHS } from 'shared/api';

export interface RequestTransactions {
  [key: string]: unknown;
}

/** Отправка группы транзакций (Firestore operations) */
export const sendTransactions = async (request: RequestTransactions): Promise<void> => {
  await api.post(API_PATHS.transactions.sendTransactions, request);
};
