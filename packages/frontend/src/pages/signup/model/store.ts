// packages/frontend/src/pages/signup/model/store.ts

import { create } from 'zustand';
import { errorHandlers } from 'app/providers/store';
import { useUserStore } from 'entities/user';
import { useCompanyStore } from 'entities/company';
import { useUIStore } from 'entities/ui';
import { LS } from 'shared/lib/local-storage';
import { Errors } from 'shared/lib/validators';
import { API_PATHS } from 'shared/api';
import { api } from 'shared/api/api';
import { __devLog } from 'shared/lib/tests/__dev-log';
import type { SignupData, SignupDataEnd } from './types';

// --- Типы (перенесены из удалённого Redux-слайса) ---

export interface StateSchemaSignupPage {
  loading: boolean;
  errors: Errors;
  signupData: SignupData;
  codeSended: boolean;
}

interface ResSignupStart {
  message: string;
}

interface ResSendCodeAgain {
  message: string;
}

interface ResSignup {
  newUserData: import('entities/user').User;
  newCompanyData: import('entities/company').Company;
  message: string;
}

const initialState: StateSchemaSignupPage = {
  loading: false,
  errors: {},
  signupData: {} as SignupData,
  codeSended: false,
};

interface SignupPageActions {
  setErrors: (errors: Errors) => void;

  // Асинхронные действия (заменяют createAsyncThunk)
  serviceSignupStart: (data: SignupData) => Promise<void>;
  serviceSendCodeAgain: (data: SignupData) => Promise<void>;
  serviceSignupEnd: (data: SignupDataEnd) => Promise<void>;
}

export type SignupPageStore = StateSchemaSignupPage & SignupPageActions;

export const useSignupPageStore = create<SignupPageStore>((set) => ({
  ...initialState,

  setErrors: (errors) => set({ errors }),

  serviceSignupStart: async (signupData: SignupData) => {
    set({ errors: {}, loading: true });

    try {
      const {
        data: { message },
      } = await api.post<ResSignupStart>(API_PATHS.auth.signup.byEmailStart, { signupData });

      useUIStore.getState().setSuccessMessage(message);

      set({ signupData, codeSended: true, errors: {}, loading: false });
    } catch (e) {
      errorHandlers(e as any, undefined as any);
      set({
        errors: ((e as any)?.response?.data as Errors) || { general: 'Error in pages/signup/byEmailStart' },
        loading: false,
      });
    }
  },

  serviceSendCodeAgain: async (signupData: SignupData) => {
    set({ errors: {}, loading: true });

    try {
      const {
        data: { message },
      } = await api.post<ResSendCodeAgain>(API_PATHS.auth.signup.sendCodeAgain, { signupData });

      useUIStore.getState().setSuccessMessage(message);

      set({ codeSended: true, errors: {}, loading: false });
    } catch (e) {
      errorHandlers(e as any, undefined as any);
      set({
        errors: ((e as any)?.response?.data as Errors) || { general: 'Error in pages/signup/sendCodeAgain' },
        loading: false,
      });
    }
  },

  serviceSignupEnd: async (signupDataEnd: SignupDataEnd) => {
    set({ errors: {}, loading: true });

    try {
      const {
        data: { newUserData, newCompanyData, message },
      } = await api.post<ResSignup>(API_PATHS.auth.signup.byEmailEnd, { signupDataEnd });

      __devLog('signupByEmailEnd', 'data: ', newUserData, newCompanyData, message);
      const companyId = newCompanyData?.id || LS.getLastCompanyId();

      if (companyId) {
        useUserStore.getState().setUser(companyId, newUserData);
        useCompanyStore.getState().setCompany(newCompanyData);
        useUIStore.getState().setSuccessMessage(message);
      }

      set({ codeSended: false, errors: {}, loading: false });
    } catch (e) {
      errorHandlers(e as any, undefined as any);
      set({
        errors: ((e as any)?.response?.data as Errors) || { general: 'Error in pages/signup/signupByEmailEnd' },
        loading: false,
      });
    }
  },
}));
