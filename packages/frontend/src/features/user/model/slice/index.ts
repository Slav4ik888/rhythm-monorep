import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logout, updateUser } from 'shared/api/features/user';
import { getPayloadError as getError } from 'shared/lib/errors';
import { Errors } from 'shared/lib/validators';
import { StateSchemaUserFeatures } from './state-schema';



const initialState: StateSchemaUserFeatures = {
  loading : false,
  errors  : {},
};


export const slice = createSlice({
  name: 'features/user',
  initialState,
  reducers: {
    setErrors: (state, { payload }: PayloadAction<Errors>) => {
      state.errors = getError(payload);
    },
    clearErrors: (state) => {
      state.errors = {};
    },
  },

  extraReducers: builder => {
    // UPDATE-USER
    builder
      .addCase(updateUser.pending, (state) => {
        state.errors  = {};
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.errors  = {};
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        state.errors  = getError(payload);
        state.loading = false;
      })

    // DELETE-USER
    // builder
    //   .addCase(deleteUser.pending, (state) => {
    //     state.errors  = {};
    //     state.loading = true;
    //   })
    //   .addCase(deleteUser.fulfilled, (state) => {
    //     state.errors  = {};
    //     state.loading = false;
    //   })
    //   .addCase(deleteUser.rejected, (state, { payload }) => {
    //     state.errors  = payload;
    //     state.loading = false;
    //   })

    // LOGOUT-USER
    builder
      .addCase(logout.pending, (state) => {
        state.errors  = {};
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.errors  = {};
        state.loading = false;
      })
      .addCase(logout.rejected, (state, { payload }) => {
        state.errors  = payload || {};
        state.loading = false;
      })

    // SEND-EMAIL-CONFIRMATION
    // builder
    //   .addCase(sendEmailConfirmation.pending, (state) => {
    //     state.errors  = {};
    //     state.loading = true;
    //   })
    //   .addCase(sendEmailConfirmation.fulfilled, (state) => {
    //     state.errors  = {};
    //     state.loading = false;
    //   })
    //   .addCase(sendEmailConfirmation.rejected, (state, { payload }) => {
    //     state.errors  = payload;
    //     state.loading = false;
    //   })
  }
})

export const { actions, reducer } = slice;
