import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sendTransactions } from 'features/transactions';
import { getPayloadError as getError } from 'shared/lib/errors';
import { Errors } from 'shared/lib/validators';
import { StateSchemaTransactions } from './state-schema';



const initialState: StateSchemaTransactions = {
  loading : false,
  errors  : {}
};


export const slice = createSlice({
  name: 'entities/transactions',
  initialState,
  reducers: {
    setErrors: (state, { payload }: PayloadAction<Errors>) => {
      state.errors = getError(payload);
    },
    clearErrors: (state) => {
      state.errors = {};
    }
  },

  extraReducers: builder => {
    // SEND-TRANSACTIONS
    builder
      .addCase(sendTransactions.pending, (state) => {
        state.loading = true;
        state.errors  = {};
      })
      .addCase(sendTransactions.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.errors  = {};
      })
      .addCase(sendTransactions.rejected, (state, { payload }) => {
        state.errors  = getError(payload);
        state.loading = false;
      })
  }
})

export const { actions, reducer } = slice;
