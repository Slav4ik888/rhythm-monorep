// packages/frontend/src/entities/user/model/services/get-auth/index.ts

import { CustomAxiosError, errorHandlers } from 'app/providers/store';
import { actionsCompany, Company } from 'entities/company';
import { API_PATHS } from 'shared/api';
import { Errors } from 'shared/lib/validators';
import type { User } from '../../../types';
import { LS } from 'shared/lib/local-storage';
import cfg from 'app/config';
import { cloneObj } from 'shared/helpers/objects';
import { useUIStore } from 'entities/ui';
import { useUserStore } from '../../store';
import { AxiosInstance } from 'axios';

export interface ReqGetAuth {
  pathname: string;
}

/** 2025-06-13 */
interface ResGetAuth {
  userData: User;
  companyData: Company;
}

/** Проверяет, авторизован ли пользователь, и если да, то возвращает данные пользователя. */
export const getAuth = async (
  { pathname }: ReqGetAuth,
  api: AxiosInstance,
  dispatch: any, // Остаётся для dispatch(actionsCompany) и errorHandlers, пока company на Redux
) => {
  const store = useUserStore.getState();
  store.startLoading();

  try {
    let user = {} as User,
      company = {} as Company,
      companyId = '';

    // На время разработки, использовать данные сохраннённые в LS,
    // а также случай отсутствия интернета (для разработки)
    if (cfg.IS_DEV) {
      companyId = LS.getLastCompanyId() || '';
      user = LS.getUserState(companyId)?.user || ({} as User);
      company = LS.getCompanyState(companyId)?.company as Company;
    } else {
      const {
        data: { userData, companyData },
      } = await api.get<ResGetAuth>(API_PATHS.user.getAuth);
      user = cloneObj(userData);
      company = cloneObj(companyData);
      companyId = companyData.id;
    }

    if (company) {
      // Чтобы при отсутствии данных, не затёрлись имеющиеся в LS
      dispatch(actionsCompany.setCompany({ company }));
    }

    useUIStore.getState().setPageLoading({ 'get-auth': { text: '', name: 'getAuth' } });

    useUserStore.getState().finishGetAuth(companyId, user);
  } catch (e) {
    errorHandlers(e as CustomAxiosError, dispatch, { pathname });
    useUserStore.getState().failGetAuth(
      (e as CustomAxiosError).response?.data || {
        general: 'Error in entities/user/getAuth',
      },
    );
  }
};
