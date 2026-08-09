// packages/frontend/src/entities/transactions/model/hooks/use-transactions/index.ts

import { useTransactionsStore } from '../../store';
import type { RequestTransactions } from '../../types';
import { sendTransactions } from 'features/transactions';

export const useTransactions = () => {
  const setErrors = useTransactionsStore((s) => s.setErrors);
  const clearErrors = useTransactionsStore((s) => s.clearErrors);

  const serviceSendTransactions = async (request: RequestTransactions) => {
    useTransactionsStore.getState().startLoading();
    try {
      await sendTransactions(request);
      useTransactionsStore.getState().finishLoading();
    } catch {
      useTransactionsStore.getState().setErrors({ general: 'Error in features/transactions/sendTransactions' });
    }
  };

  return {
    setErrors,
    clearErrors,
    serviceSendTransactions,
  };
};
