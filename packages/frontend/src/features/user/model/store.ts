// packages/frontend/src/features/user/model/store.ts

import { create } from 'zustand';
import { getPayloadError as getError } from 'shared/lib/errors';
import { Errors } from 'shared/lib/validators';
import { useUserStore, PartialUser } from 'entities/user';
import { useCompanyStore, Company } from 'entities/company';
import { useUIStore } from 'entities/ui';
import { userApi } from 'shared/api/features/user/api';
import { api } from 'shared/api/api';

// --- Типы (перенесены из удалённого Redux-слайса) ---

interface StateSchemaUserFeatures {
  loading: boolean;
  errors: Errors;
}

const initialState: StateSchemaUserFeatures = {
  loading: false,
  errors: {},
};

interface UserFeaturesActions {
  setErrors: (errors: Errors) => void;
  clearErrors: () => void;

  // Асинхронные действия
  serviceUpdateUser: (userData: PartialUser) => Promise<void>;
  serviceLogout: () => Promise<void>;
}

export type UserFeaturesStore = StateSchemaUserFeatures & UserFeaturesActions;

export const useUserFeaturesStore = create<UserFeaturesStore>((set) => ({
  ...initialState,

  setErrors: (errors) => set({ errors: getError(errors) }),
  clearErrors: () => set({ errors: {} }),

  serviceUpdateUser: async (userData: PartialUser) => {
    set({ errors: {}, loading: true });
    try {
      await userApi.update(api, userData);

      useUserStore.getState().updateUser(userData);
      useUIStore.getState().setSuccessMessage('Сохранено');

      set({ errors: {}, loading: false });
    } catch (e) {
      set({
        errors: ((e as any)?.response?.data as Errors) || { general: 'Error in features/user/update' },
        loading: false,
      });
    }
  },

  serviceLogout: async () => {
    set({ errors: {}, loading: true });
    try {
      await userApi.logout(api);

      useUserStore.getState().clearUser();
      useCompanyStore.getState().setCompany({} as Company);

      set({ errors: {}, loading: false });
    } catch (e) {
      set({
        errors: ((e as any)?.response?.data as Errors) || { general: 'Error in features/user/logout' },
        loading: false,
      });
    }
  },
}));
