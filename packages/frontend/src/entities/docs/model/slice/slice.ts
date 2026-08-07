import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getPayloadError as getError } from 'shared/lib/errors';
import { Errors } from 'shared/lib/validators';
import { getPolicy } from '../../../../features/docs/get-policy/model/services';
import { StateSchemaDocs, DocKeys, DocKey } from './types';



const initialState: StateSchemaDocs = {
  loading : false,
  errors  : {},
  docKeys : {} as DocKeys
};


export const slice = createSlice({
  name: 'entities/docs',
  initialState,
  reducers: {
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.loading = payload;
    },
    setErrors: (state, { payload }: PayloadAction<Errors>) => {
      state.errors = payload;
    },
    clearErrors: (state) => {
      state.errors = {};
    }
  },

  extraReducers: builder => {
    builder
      .addCase(getPolicy.pending, (state) => {
        state.errors  = {};
        state.loading = true;
      })
      .addCase(getPolicy.fulfilled, (state, { payload }) => {
        state.docKeys.policy = payload;
        state.errors  = {};
        state.loading = false;
      })
      .addCase(getPolicy.rejected, (state, { payload }) => {
        state.errors  = getError(payload);
        state.loading = false;
      })
  }
})

export const { actions, reducer } = slice;
