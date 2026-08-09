// packages/frontend/src/entities/transactions/model/store.ts

import { create } from 'zustand';
import { Errors } from 'shared/lib/validators';
import { getPayloadError as getError } from 'shared/lib/errors';
import type { StateSchemaTransactions } from './slice/state-schema';

const initialState: StateSchemaTransactions = {
  loading: false,
  errors: {},
};

interface TransactionsActions {
  setErrors: (errors: Errors) => void;
  clearErrors: () => void;
  setLoading: (loading: boolean) => void;
  startLoading: () => void;
  finishLoading: () => void;
}

export type TransactionsStore = StateSchemaTransactions & TransactionsActions;

export const useTransactionsStore = create<TransactionsStore>((set) => ({
  ...initialState,

  setErrors: (errors) => set({ errors: getError(errors) }),
  clearErrors: () => set({ errors: {} }),
  setLoading: (loading) => set({ loading }),
  startLoading: () => set({ loading: true, errors: {} }),
  finishLoading: () => set({ loading: false }),
}));
