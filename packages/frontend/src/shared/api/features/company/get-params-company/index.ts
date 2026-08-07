import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig, errorHandlers, CustomAxiosError } from 'app/providers/store';
import { ParamsCompany } from 'entities/company';
import { API_PATHS } from '../../../api-paths';
import { Errors } from 'shared/lib/validators';
import { LS } from 'shared/lib/local-storage';
import cfg from 'app/config';
import { cloneObj } from 'shared/helpers/objects';
import { actionsUI } from 'entities/ui';



export interface ReqGetCompany {
  companyId        : string
  dashboardSheetId : string | undefined // к какой странице запрашивается доступ
}

export interface SetParamsCompany {
  paramsCompany: ParamsCompany
}


/** Возвращает данные компании. */
export const getParamsCompany = createAsyncThunk<
  SetParamsCompany, // ResData
  ReqGetCompany,    // ReqData
  ThunkConfig<Errors>
>(
  'features/company/getParamsCompany',
  async (companyData, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;

    try {
      let paramsCompany = {} as ParamsCompany;

      // На время разработки, использовать данные сохраннённые в LS,
      // а также случай отсутствия интернета (для разработки)
      if (cfg.IS_DEV) {
        paramsCompany = LS.getParamsCompanyState() as ParamsCompany;
      }
      else {
        const { data } = await extra.api.post<ParamsCompany>(
          API_PATHS.paramsCompany.get,
          companyData
        );
        paramsCompany = cloneObj(data);
      }

      dispatch(actionsUI.setPageLoading({ 'get-params-company': { text: '', name: 'getParamsCompany' } }));

      return { paramsCompany };
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue((e as CustomAxiosError).response.data || {
        general: 'Error in features/company/getParamsCompany'
      });
    }
  }
);
