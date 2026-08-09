// packages/frontend/src/pages/login/model/store.ts

import { create } from 'zustand';
import cfg from 'app/config';
import { errorHandlers } from 'app/providers/store';
import { useUserStore } from 'entities/user';
import { useCompanyStore } from 'entities/company';
import { useUIStore } from 'entities/ui';
import { LS } from 'shared/lib/local-storage';
import { Errors } from 'shared/lib/validators';
import { API_PATHS } from 'shared/api';
import { userApi } from 'shared/api/features/user';
import { api } from 'shared/api/api';
import { getCookie } from './utils';

// --- Типы (перенесены из удалённых Redux-слайсов) ---

export interface StateSchemaLoginPage {
  loading: boolean;
  errors: Errors;
  resetEmailResult: boolean;
}

/** Запрашиваемые данные при входе в аккаунт */
export interface AuthByLogin {
  email: string;
  password: string;
}

interface ResAuthByLogin {
  user: import('entities/user').User;
  company: import('entities/company').Company;
  message: string;
}

interface ResResetEmailPassword {
  message: string;
}

const initialState: StateSchemaLoginPage = {
  loading: false,
  errors: {},
  resetEmailResult: false,
};

interface LoginPageActions {
  setErrors: (errors?: Errors) => void;
  clearErrors: () => void;
  setResetEmailResult: (result?: boolean) => void;

  // Асинхронные действия (заменяют createAsyncThunk)
  serviceAuthByLogin: (data: AuthByLogin) => Promise<void>;
  serviceResetEmailPassword: (email: string) => Promise<void>;
}

export type LoginPageStore = StateSchemaLoginPage & LoginPageActions;

export const useLoginPageStore = create<LoginPageStore>((set) => ({
  ...initialState,

  setErrors: (errors) => set({ errors: errors || {} }),
  clearErrors: () => set({ errors: {} }),
  setResetEmailResult: (result) => set({ resetEmailResult: !!result }),

  serviceAuthByLogin: async (authByLoginData: AuthByLogin) => {
    set({ errors: {}, loading: true });
    const csrfToken = getCookie(cfg.COOKIE_NAME);

    try {
      const {
        data: { user, company },
      } = await api.post<ResAuthByLogin>(API_PATHS.auth.login.byEmail, {
        authByLogin: authByLoginData,
        csrfToken,
      });

      // Проверяем, есть ли подсказки от которых отказались будучи без авторизации
      const hints = user.settings?.hintsDontShowAgain || [];
      const hintsWithLS = Array.from(new Set([...hints, ...LS.getHintsDontShowAgain()]));

      if (hintsWithLS.length !== hints.length) {
        await userApi.update(api, {
          id: user.id,
          companyId: user.companyId,
          settings: { hintsDontShowAgain: hintsWithLS },
        });

        if (!user.settings) user.settings = {};
        if (!user.settings.hintsDontShowAgain) user.settings.hintsDontShowAgain = [];
        user.settings.hintsDontShowAgain = [...hintsWithLS];
      }

      LS.setHintsDontShowAgain(hintsWithLS);

      useUserStore.getState().setUser(user.companyId, user);
      useCompanyStore.getState().setCompany(company);

      set({ errors: {}, loading: false });
    } catch (e) {
      errorHandlers(e as any, undefined as any);
      set({
        errors: ((e as any)?.response?.data as Errors) || { general: 'Error in pages/login/authByLogin' },
        loading: false,
      });
    }
  },

  serviceResetEmailPassword: async (email: string) => {
    set({ errors: {}, loading: true, resetEmailResult: false });

    try {
      const {
        data: { message },
      } = await api.post<ResResetEmailPassword>(API_PATHS.auth.login.resetEmailPassword, { email });

      useUIStore.getState().setSuccessMessage(message);

      set({ errors: {}, loading: false, resetEmailResult: true });
    } catch (e) {
      errorHandlers(e as any, undefined as any);
      set({
        errors: ((e as any)?.response?.data as Errors) || { general: 'Error pages/login/resetEmailPassword' },
        loading: false,
        resetEmailResult: false,
      });
    }
  },
}));
