import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig, errorHandlers, CustomAxiosError } from 'app/providers/store';
import { BunchesViewItem } from '../../../types';
import { API_PATHS } from '../../../../../shared/api/api-paths';
import { Errors } from 'shared/lib/validators';
import { LS } from 'shared/lib/local-storage';
import cfg from 'app/config';
import { SetDashboardBunches } from '../../slice/types';
import { BunchesUpdated } from 'shared/lib/structures/bunch';



export interface ReqGetBunches {
  companyId        : string
  bunchIds         : string[]
  pathname         : string // For errorHandlers
  bunchesUpdated   : BunchesUpdated
  dashboardSheetId : string | undefined // Для проверки наличия публичного доступа (на сервере)
}


/** 2025-07-16 */
interface ResGetViewItems {
  bunches: BunchesViewItem
}


export const getBunches = createAsyncThunk<
  SetDashboardBunches,
  ReqGetBunches,
  ThunkConfig<Errors>
>(
  'entities/dashboardView/getBunches',
  async (data, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;
    const { pathname, bunchIds, bunchesUpdated } = data || {};

    try {
      let bunches = {} as BunchesViewItem,
        companyId = '';

      // На время разработки, использовать данные сохраннённые в LS,
      // а также случай отсутствия интернета (для разработки)
      if (cfg.IS_DEV) {
        companyId = LS.getLastCompanyId() || '';
        bunches = LS.getBunches(companyId);
      }
      else {
        const { data: { bunches: bu } } = await extra.api.post<ResGetViewItems>(
          API_PATHS.dashboard.bunch.get,
          {
            companyId: data.companyId,
            bunchIds
          }
        );

        bunches = bu;
        companyId = data.companyId;
      }

      return { companyId, bunches, bunchesUpdated };
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch, { pathname });
      return rejectWithValue((e as CustomAxiosError).response.data || {
        general: 'Error in entities/dashboardView/getBunches'
      });
    }
  }
);
