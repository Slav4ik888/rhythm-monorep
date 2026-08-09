// packages/frontend/src/entities/docs/model/store.ts

import { create } from 'zustand';
import { Errors } from 'shared/lib/validators';
import { getPayloadError as getError } from 'shared/lib/errors';
import type { DocKey, DocKeys, StateSchemaDocs } from './slice/types';

const initialState: StateSchemaDocs = {
  loading: false,
  errors: {},
  docKeys: {} as DocKeys,
};

interface DocsActions {
  setLoading: (loading: boolean) => void;
  setErrors: (errors: Errors) => void;
  clearErrors: () => void;
  startLoading: () => void;
  finishLoading: () => void;
  setDocKey: (key: DocKey, value: string) => void;
}

export type DocsStore = StateSchemaDocs & DocsActions;

export const useDocsStore = create<DocsStore>((set) => ({
  ...initialState,

  setLoading: (loading) => set({ loading }),
  setErrors: (errors) => set({ errors: getError(errors) }),
  clearErrors: () => set({ errors: {} }),
  startLoading: () => set({ loading: true, errors: {} }),
  finishLoading: () => set({ loading: false }),
  setDocKey: (key, value) =>
    set((state) => ({
      docKeys: { ...state.docKeys, [key]: value },
    })),
}));
