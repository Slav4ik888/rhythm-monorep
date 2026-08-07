import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getPayloadError as getError } from 'shared/lib/errors';
import { Errors } from 'shared/lib/validators';
import { signupByEmailEnd, signupByEmailStart, signupSendCodeAgain } from '../services';
import { SignupData } from '../types';
import { StateSchemaSignupPage } from './state-schema';



const initialState: StateSchemaSignupPage = {
  loading         : false,
  errors          : {},
  signupData      : {} as SignupData,
  codeSended      : false,
};


export const slice = createSlice({
  name: 'signupPage',
  initialState,
  reducers: {
    setErrors: (state, { payload }: PayloadAction<Errors>) => {
      state.errors = payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(signupByEmailStart.pending, (state) => {
        state.errors  = {};
        state.loading = true;
      })
      .addCase(signupByEmailStart.fulfilled, (state, { payload }: PayloadAction<SignupData>) => {
        state.signupData = payload;
        state.codeSended = true;
        state.errors     = {};
        state.loading    = false;
      })
      .addCase(signupByEmailStart.rejected, (state, { payload }) => {
        state.errors  = getError(payload);
        state.loading = false;
      })

    builder
      .addCase(signupSendCodeAgain.pending, (state) => {
        state.errors  = {};
        state.loading = true;
      })
      .addCase(signupSendCodeAgain.fulfilled, (state) => {
        state.codeSended = true;
        state.errors     = {};
        state.loading    = false;
      })
      .addCase(signupSendCodeAgain.rejected, (state, { payload }) => {
        state.errors  = getError(payload);
        state.loading = false;
      })

    builder
      .addCase(signupByEmailEnd.pending, (state) => {
        state.errors  = {};
        state.loading = true;
      })
      .addCase(signupByEmailEnd.fulfilled, (state) => {
        state.codeSended = false;
        state.errors     = {};
        state.loading    = false;
      })
      .addCase(signupByEmailEnd.rejected, (state, { payload }) => {
        state.errors  = getError(payload);
        state.loading = false;
      })
  }
})

export const { actions, reducer } = slice;
