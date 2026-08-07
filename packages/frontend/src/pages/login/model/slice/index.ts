import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getPayloadError as getError } from 'shared/lib/errors';
import { Errors, isNotUndefined } from 'shared/lib/validators';
import { authByLogin, resetEmailPassword } from '../services';
import { StateSchemaLoginPage } from '../types';



const initialState: StateSchemaLoginPage = {
  loading        : false,
  errors         : {},
  resetEmailResult : false
};


export const slice = createSlice({
  name: 'loginPage',
  initialState,
  reducers: {
    setErrors: (state, { payload }: PayloadAction<Errors | undefined>) => {
      state.errors = getError(payload);
    },
    clearErrors: (state) => {
      state.errors = {};
    },
    setResetEmailResult: (state, { payload }: PayloadAction<boolean | undefined>) => {
      state.resetEmailResult = isNotUndefined(payload) ? payload as boolean : false;
    }
    // setPassword: (state, { payload }: PayloadAction<string>) => {
    //   state.password = payload;
    // },
    // clearEmailAndPassword: (state) => {
    //   state.email    = '';
    //   state.password = '';
    //   state.password = {}
    // }
  },
  extraReducers: builder => {
    // Auth by login
    // eslint-disable-line @typescript-eslint/no-unused-expressions
    builder
      .addCase(authByLogin.pending, (state) => {
        state.errors  = {};
        state.loading = true;
      })
      .addCase(authByLogin.fulfilled, (state) => {
        state.errors  = {};
        state.loading = false;
      })
      .addCase(authByLogin.rejected, (state, { payload }) => {
        state.errors  = getError(payload);
        state.loading = false;
      })

    // Recovery password
    builder
      .addCase(resetEmailPassword.pending, (state) => {
        state.errors = {};
        state.loading = true;
        state.resetEmailResult = false;
      })
      .addCase(resetEmailPassword.fulfilled, (state) => {
        state.errors = {};
        state.loading = false;
        state.resetEmailResult = true;
      })
      .addCase(resetEmailPassword.rejected, (state, { payload }) => {
        state.errors = getError(payload);
        state.loading = false;
        state.resetEmailResult = false;
      })
  }
})

export const { actions, reducer } = slice;
