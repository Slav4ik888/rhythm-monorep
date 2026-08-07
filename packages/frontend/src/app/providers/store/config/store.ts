import { configureStore, ReducersMapObject } from '@reduxjs/toolkit'
import { reducerUI } from 'entities/ui';
import { StateSchema } from './state';
import { createReducerManager } from './reducer-manager';
import { api } from 'shared/api';
import { reducerCompany } from 'entities/company';
import { reducerUser } from 'entities/user';
import { reducerDocs } from 'entities/docs';
import { reducerHints } from 'entities/hints';


export function createReduxStore(
  initialState?  : StateSchema,
  asyncReducers? : ReducersMapObject<StateSchema>,
) {
  const
    rootReducers: ReducersMapObject<StateSchema> = {
      ...asyncReducers,

      // Entities
      ui           : reducerUI,
      user         : reducerUser,
      company      : reducerCompany,
      docs         : reducerDocs,
      hints        : reducerHints,
    },
    reducerManager = createReducerManager(rootReducers),
    extraArg = {
      api
    };

  const store = configureStore({
    reducer        : reducerManager.reduce,
    devTools       : __IS_DEV__,
    preloadedState : initialState || {},
    middleware     : getDefaultMiddleware => getDefaultMiddleware({
      thunk: {
        extraArgument: extraArg
      }
    })
  });

  // @ts-ignore
  store.reducerManager = reducerManager;

  return store
}

export type AppDispatch = ReturnType<typeof createReduxStore>['dispatch'];
