// packages/frontend/src/app/providers/store/config/reducer-manager.ts

import { AnyAction, combineReducers, Reducer, ReducersMapObject } from '@reduxjs/toolkit';
import type { ReducerManager, StateSchema, StateKey, MountedReducers } from './state';

// Резервный редьюсер для пустого стора — чтобы combineReducers({}) не падал
const noopReducer: Reducer = (state = {}) => state;

export function createReducerManager(initialReducers: ReducersMapObject<StateSchema>): ReducerManager {
  const reducers: ReducersMapObject<StateSchema> = { ...initialReducers },
    mountedReducers: MountedReducers = {};

  // Если initialReducers пустой, добавляем заглушку, иначе combineReducers упадёт
  let combinedReducer: Reducer;
  // @ts-ignore
  const hasReducers = Object.keys(reducers).length > 0;
  combinedReducer = hasReducers ? combineReducers(reducers) : noopReducer;
  let keysToRemove: StateKey[] = [];

  return {
    getReducerMap: () => reducers,
    getMountedReducers: () => mountedReducers,

    reduce: (state: StateSchema, action: AnyAction) => {
      if (keysToRemove.length > 0) {
        state = { ...state };
        keysToRemove.forEach((key) => {
          // @ts-ignore
          delete state[key];
        });

        keysToRemove = [];
      }

      // @ts-ignore
      return combinedReducer(state, action);
    },

    add: (key: StateKey, reducer: Reducer) => {
      if (!key || reducers[key]) return;

      reducers[key] = reducer;
      mountedReducers[key] = true;

      combinedReducer = combineReducers(reducers);
    },

    remove: (key: StateKey) => {
      if (!key || !reducers[key]) return;

      // @ts-ignore
      delete reducers[key];
      mountedReducers[key] = false;
      keysToRemove.push(key);

      const hasAny = Object.keys(reducers).length > 0;
      combinedReducer = hasAny ? combineReducers(reducers) : noopReducer;
    },
  };
}
