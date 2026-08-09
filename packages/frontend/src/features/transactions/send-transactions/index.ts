// packages/frontend/src/features/transactions/send-transactions/index.ts

import { api, API_PATHS } from 'shared/api';
import { RequestTransactions } from 'entities/transactions';

/**
 * Прямой API-вызов (без Redux createAsyncThunk).
 * Обработка ошибок — в вызывающем коде (useTransactions).
 */
export const sendTransactions = async (request: RequestTransactions): Promise<void> => {
  await api.post(API_PATHS.transactions.sendTransactions, request);
};
