// packages/frontend/src/entities/user/model/store.ts

import { create } from 'zustand';
import { updateObject } from 'shared/helpers/objects';
import { getPayloadError as getError } from 'shared/lib/errors';
import { LS } from 'shared/lib/local-storage';
import { Errors } from 'shared/lib/validators';
import { creatorUser } from '../lib/creators';
import type { PartialUser, User } from '../types';

export interface StateSchemaUser {
  _isLoaded: boolean;
  loading: boolean;
  errors: Errors;
  auth: boolean;
  user: User;
}

const initialState: StateSchemaUser = {
  _isLoaded: false,
  loading: false,
  errors: {},
  auth: false,
  user: {} as User,
};

interface UserActions {
  // Синхронные действия (аналоги Redux reducers)
  setErrors: (errors: Errors) => void;
  clearErrors: () => void;
  setAuth: (auth: boolean) => void;
  setUser: (companyId: string, user: User) => void;
  updateUser: (user: PartialUser) => void;
  clearUser: () => void;

  // Асинхронные действия (заменяют extraReducers для getAuth)
  startLoading: () => void;
  finishGetAuth: (companyId: string, user: User) => void;
  failGetAuth: (errors: Errors) => void;
}

export type UserStore = StateSchemaUser & UserActions;

export const useUserStore = create<UserStore>((set) => ({
  ...initialState,

  setErrors: (errors) => set({ errors: getError(errors) }),
  clearErrors: () => set({ errors: {} }),

  setAuth: (auth) => set({ auth }),

  setUser: (companyId, user) =>
    set((state) => {
      const newState = {
        ...state,
        auth: true,
        user: creatorUser(user),
      };
      LS.setUserState(companyId, newState);
      return newState;
    }),

  updateUser: (user) =>
    set((state) => ({
      user: updateObject(state.user, user) as User,
      errors: {},
      loading: false,
    })),

  clearUser: () =>
    set({
      auth: false,
      user: {} as User,
      errors: {},
    }),

  // Асинхронные действия для getAuth
  startLoading: () => set({ errors: {}, loading: true }),

  finishGetAuth: (companyId, user) =>
    set((state) => {
      const newState = {
        ...state,
        auth: true,
        _isLoaded: true,
        user,
        errors: {},
        loading: false,
      };
      LS.setUserState(companyId, newState);
      return newState;
    }),

  failGetAuth: (errors) =>
    set({
      _isLoaded: true, // Вернулся ответ от сервера, чтобы не загружать повторно
      errors: errors || {},
      loading: false,
    }),
}));
