// packages/frontend/src/app/providers/store/config/state.ts

import { AxiosInstance } from 'axios';
import { NavigateOptions, To } from 'react-router-dom';
import { Action, EnhancedStore, Reducer, ReducersMapObject } from '@reduxjs/toolkit';
import type { StateSchemaUI } from 'entities/ui';
import type { StateSchemaDashboardData } from 'entities/dashboard-data';
import type { StateSchemaCompany } from 'entities/company';
import type { StateSchemaUser } from 'entities/user';
import type { StateSchemaSignupPage } from 'pages/signup';
import type { StateSchemaLoginPage } from 'pages/login';
import type { StateSchemaDocs } from 'entities/docs';
import type { StateSchemaDashboardView } from 'entities/dashboard-view';
import type { StateSchemaDashboardTemplates } from 'entities/dashboard-templates';
import type { StateSchemaHints } from 'entities/hints/model/slice';
import type { StateSchemaUserFeatures } from 'features/user/model/slice/state-schema';

export interface StateSchema {
  // Entities
  ui?: StateSchemaUI; // UI переведён на Zustand, Redux-слайс удалён
  user?: StateSchemaUser; // User переведён на Zustand, Redux-слайс удалён
  company?: StateSchemaCompany; // Company переведён на Zustand, Redux-слайс удалён
  docs?: StateSchemaDocs; // Docs переведён на Zustand, Redux-слайс удалён
  hints?: StateSchemaHints; // Hints переведён на Zustand, Redux-слайс удалён

  // Async reducer
  signupPage?: StateSchemaSignupPage;
  loginPage?: StateSchemaLoginPage;
  userFeatures?: StateSchemaUserFeatures;
  dashboardView?: StateSchemaDashboardView;
  dashboardTemplates?: StateSchemaDashboardTemplates; // DashboardTemplates переведён на Zustand, Redux-слайс в процессе миграции
  dashboardData?: StateSchemaDashboardData; // DashboardData переведён на Zustand, Redux-слайс удалён
}

// export const selectProps = (_: StateSchema, props: any) => props;
export const selectState = (state: StateSchema) => state;

export type StateKey = keyof StateSchema;
export type MountedReducers = OptionalRecord<StateKey, boolean>; // True - mounted, false - not mounted

export interface ReducerManager {
  getReducerMap: () => ReducersMapObject<StateSchema>;
  reduce: (state: StateSchema, action: Action) => any; // CombinedState<StateSchema>
  add: (key: StateKey, reducer: Reducer) => void;
  remove: (key: StateKey) => void;
  getMountedReducers: () => MountedReducers;
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
  reducerManager: ReducerManager;
}

export interface ThunkExtraArg {
  api: AxiosInstance;
  navigate?: (to: To, options?: NavigateOptions) => void;
}

export interface ThunkConfig<T> {
  rejectValue: T;
  extra: ThunkExtraArg;
  state: StateSchema;
}
