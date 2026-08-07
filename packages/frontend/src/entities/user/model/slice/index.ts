import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { updateObject } from 'shared/helpers/objects';
import { getPayloadError as getError } from 'shared/lib/errors';
import { LS } from 'shared/lib/local-storage';
import { Errors } from 'shared/lib/validators';
import { creatorUser } from '../../lib/creators';
import { getAuth } from '../services';
import { PartialUser, User } from '../../types';
import { StateSchemaUser } from './state-schema';
import { SetUser } from './types';



const initialState: StateSchemaUser = {
  _isLoaded : false,
  loading   : false,
  errors    : {},
  auth      : false,
  user      : {} as User
};


export const slice = createSlice({
  name: 'entities/user',
  initialState,
  reducers: {
    setErrors: (state, { payload }: PayloadAction<Errors>) => {
      state.errors = getError(payload);
    },
    clearErrors: (state) => {
      state.errors = {};
    },
    setAuth: (state, { payload }: PayloadAction<boolean>) => {
      state.auth = payload;
    },
    setUser: (state, { payload }: PayloadAction<SetUser>) => {
      state.auth      = true;
      // state._isLoaded = true;
      state.user      = creatorUser(payload.user);
      LS.setUserState(payload.companyId, state);
    },
    updateUser: (state, { payload }: PayloadAction<PartialUser>) => {
      state.user    = updateObject(state.user, payload);
      state.errors  = {};
      state.loading = false;
    },
    clearUser: (state) => {
      state.auth   = false;
      state.user   = {} as User;
      state.errors = {};
    },
  },

  extraReducers: builder => {
    // GET-AUTH
    builder
      .addCase(getAuth.pending, (state) => {
        state.errors  = {};
        state.loading = true;
      })
      .addCase(getAuth.fulfilled, (state, { payload }) => {
        state.auth      = true;
        state._isLoaded = true;
        state.user      = payload.user;
        state.errors    = {};
        state.loading   = false;
        LS.setUserState(payload.companyId, state);
      })
      .addCase(getAuth.rejected, (state, { payload }) => {
        state._isLoaded = true; // Вернулся ответ от сервера, чтобы не загружать повторно (в бесконечном цикле)
        state.errors    = payload || {};
        state.loading   = false;
      })
  }
})

export const { actions, reducer } = slice;
