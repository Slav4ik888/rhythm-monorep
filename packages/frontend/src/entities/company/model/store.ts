// packages/frontend/src/entities/company/model/store.ts

import { create } from 'zustand';
import { Errors } from 'shared/lib/validators';
import { getPayloadError as getError } from 'shared/lib/errors';
import { LS } from 'shared/lib/local-storage';
import { updateObject } from 'shared/helpers/objects';
import type { Company, CustomSettings, ParamsCompany } from '../types';
import type { StateSchemaCompany } from './slice/state-schema';

const initialState: StateSchemaCompany = {
  loading: false,
  errors: {},
  company: {} as Company,
  paramsCompany: {} as ParamsCompany,
  storedCompany: {} as ParamsCompany,
  _isParamsCompanyIdLoaded: false,
};

interface CompanyActions {
  // Синхронные действия (аналоги Redux reducers)
  setErrors: (errors?: Errors) => void;
  setCompany: (company: Company) => void;
  updateParamsCompany: (data: Partial<ParamsCompany>) => void;
  setIsParamsCompanyIdLoaded: (status: boolean) => void;
  updateParamsCustomSettings: (data: Partial<CustomSettings>) => void;
  cancelParamsCustomSettings: () => void;

  // Асинхронные действия (заменяют extraReducers)
  startLoading: () => void;
  finishGetParamsCompany: (paramsCompany: ParamsCompany) => void;
  failGetParamsCompany: (errors?: Errors) => void;
  finishUpdateCompany: (payload: Partial<Company>) => void;
  failUpdateCompany: (errors?: Errors) => void;
  finishDeleteSheet: (sheetId: string) => void;
  failDeleteSheet: (errors?: Errors) => void;
}

export type CompanyStore = StateSchemaCompany & CompanyActions;

export const useCompanyStore = create<CompanyStore>((set) => ({
  ...initialState,

  setErrors: (errors) => set({ errors: getError(errors) }),

  setCompany: (company) =>
    set((state) => {
      const newState = {
        ...state,
        company,
        storedCompany: company as ParamsCompany,
        paramsCompany: company as ParamsCompany, // Если по итогу paramsCompanyId окажется другой, то перезапишется
      };
      LS.setCompanyState(company.id, newState);
      LS.setLastCompanyId(company.id);
      return newState;
    }),

  updateParamsCompany: (data) =>
    set((state) => ({
      paramsCompany: updateObject(state.paramsCompany, data) as ParamsCompany,
    })),

  setIsParamsCompanyIdLoaded: (status) => set({ _isParamsCompanyIdLoaded: status }),

  updateParamsCustomSettings: (data) =>
    set((state) => {
      const paramsCompany = { ...state.paramsCompany };
      if (!paramsCompany.customSettings) paramsCompany.customSettings = {};
      paramsCompany.customSettings = updateObject(paramsCompany.customSettings, data) as CustomSettings;
      return { paramsCompany };
    }),

  cancelParamsCustomSettings: () =>
    set((state) => {
      if (state.storedCompany) {
        const paramsCompany = { ...state.storedCompany };
        return { paramsCompany, storedCompany: {} as ParamsCompany };
      }
      return state;
    }),

  // Асинхронные действия
  startLoading: () => set({ loading: true, errors: {} }),

  finishGetParamsCompany: (paramsCompany) =>
    set((state) => {
      const newState = {
        ...state,
        storedCompany: paramsCompany,
        paramsCompany,
        _isParamsCompanyIdLoaded: true,
        loading: false,
        errors: {},
      };
      if (paramsCompany?.id) {
        LS.setParamsCompanyState(paramsCompany);
      }
      return newState;
    }),

  failGetParamsCompany: (errors) =>
    set({
      _isParamsCompanyIdLoaded: true, // Чтобы не попасть в бесконечный цикл запросов
      errors: getError(errors),
      loading: false,
    }),

  finishUpdateCompany: (payload) =>
    set((state) => {
      const paramsCompany = updateObject(state.paramsCompany, payload) as ParamsCompany;
      return {
        paramsCompany,
        storedCompany: paramsCompany,
        loading: false,
        errors: {},
      };
    }),

  failUpdateCompany: (errors) =>
    set({
      errors: getError(errors),
      loading: false,
    }),

  finishDeleteSheet: (sheetId) =>
    set((state) => {
      const paramsCompany = { ...state.paramsCompany };
      const storedCompany = { ...state.storedCompany };
      if (paramsCompany?.sheets?.[sheetId]) delete paramsCompany.sheets[sheetId];
      if (storedCompany?.sheets?.[sheetId]) delete storedCompany.sheets[sheetId];
      return {
        paramsCompany,
        storedCompany,
        loading: false,
        errors: {},
      };
    }),

  failDeleteSheet: (errors) =>
    set({
      errors: getError(errors),
      loading: false,
    }),
}));
