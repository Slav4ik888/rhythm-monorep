import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig, errorHandlers, CustomAxiosError } from 'app/providers/store';
import { ViewItem } from '../../../types';
import { API_PATHS } from '../../../../../shared/api/api-paths';
import { Errors } from 'shared/lib/validators';
import { LS } from 'shared/lib/local-storage';
import cfg from 'app/config';
import { SetDashboardViewItems } from '../../slice/types';
import { BunchesUpdated } from 'shared/lib/structures/bunch';



export interface ReqGetViewItems {
  companyId        : string
  bunchIds         : string[]
  pathname         : string // For errorHandlers
  bunchesUpdated   : BunchesUpdated
  dashboardSheetId : string | undefined // Для проверки наличия публичного доступа (на сервере)
}


/** 2025-06-23 */
interface ResGetViewItems {
  viewItems: ViewItem[]
}

/** DEPRECATED 2025-07-16 */
export const getViewItems = createAsyncThunk<
  SetDashboardViewItems,
  ReqGetViewItems,
  ThunkConfig<Errors>
>(
  'entities/dashboardView/getViewItems',
  async (data, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi;
    const { pathname, bunchIds, bunchesUpdated } = data || {};

    try {
      let viewItems = [] as ViewItem[],
        companyId = '';

      // На время разработки, использовать данные сохраннённые в LS,
      // а также случай отсутствия интернета (для разработки)
      if (cfg.IS_DEV) {
        companyId = LS.getLastCompanyId() || '';
        // viewItems = LS.getDashboardViewItems(companyId);
      }
      else {
        const { data: { viewItems: vi } } = await extra.api.post<ResGetViewItems>(
          API_PATHS.dashboard.bunch.get,
          {
            companyId: data.companyId,
            bunchIds
          }
        );

        viewItems = vi;
        companyId = data.companyId;
      }

      return { companyId, viewItems, bunchesUpdated };
    }
    catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch, { pathname });
      return rejectWithValue((e as CustomAxiosError).response.data || {
        general: 'Error in entities/dashboardView/getViewItems'
      });
    }
  }
);
