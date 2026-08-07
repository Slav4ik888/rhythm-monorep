import { createAsyncThunk } from '@reduxjs/toolkit';
import { CustomAxiosError, errorHandlers, ThunkConfig } from 'app/providers/store';
import { RequestTransactions } from 'entities/transactions';
import { API_PATHS } from 'shared/api';
import { Errors } from 'shared/lib/validators';



export const sendTransactions = createAsyncThunk <
  undefined,
  RequestTransactions,
  ThunkConfig<Errors>
>(
  'features/transactions/sendTransactions',
  // eslint-disable-next-line consistent-return
  async (request, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
      await extra.api.post(API_PATHS.transactions.sendTransactions, request);
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue({ general: 'Error in features/transactions/sendTransactions' });
    }
  }
);
