import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig, errorHandlers, CustomAxiosError } from 'app/providers/store';
import { actionsCompany, Company } from 'entities/company';
import { API_PATHS } from 'shared/api';
import { Errors } from 'shared/lib/validators';
import { User } from '../../../types';
import { SetUser } from '../../slice/types';
import { LS } from 'shared/lib/local-storage';
import cfg from 'app/config';
import { cloneObj } from 'shared/helpers/objects';
import { actionsUI } from 'entities/ui';



export interface ReqGetAuth {
  pathname: string
}


/** 2025-06-13 */
interface ResGetAuth {
  userData    : User
  companyData : Company
}

/** Проверяет, авторизован ли пользователь, и если да, то возвращает данные пользователя. */
export const getAuth = createAsyncThunk<
  SetUser,    // ResData
  ReqGetAuth, // ReqData
  ThunkConfig<Errors>
>(
  'entities/user/getAuth',
  async ({ pathname }, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
      let user    = {} as User,
        company   = {} as Company,
        companyId = '';

      // На время разработки, использовать данные сохраннённые в LS,
      // а также случай отсутствия интернета (для разработки)
      if (cfg.IS_DEV) {
        companyId = LS.getLastCompanyId() || '';
        user      = LS.getUserState(companyId)?.user || {} as User;
        company   = LS.getCompanyState(companyId)?.company as Company;
      }
      else {
        const { data: { userData, companyData } } = await extra.api.get<ResGetAuth>(API_PATHS.user.getAuth);
        user      = cloneObj(userData);
        company   = cloneObj(companyData);
        companyId = companyData.id;
      }

      if (company) { // Чтобы при отсутствии данных, не затёрлись имеющиеся в LS
        dispatch(actionsCompany.setCompany({ company }));
      }

      dispatch(actionsUI.setPageLoading({ 'get-auth': { text: '', name: 'getAuth' } }));

      return { companyId, user };
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch, { pathname });
      return rejectWithValue((e as CustomAxiosError).response.data || {
        general: 'Error in entities/user/getAuth'
      });
    }
  }
);
