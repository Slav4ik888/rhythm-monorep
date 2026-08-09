// packages/frontend/src/pages/login/model/services/auth-by-email/index.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import cfg from 'app/config';
import { CustomAxiosError, errorHandlers, ThunkConfig } from 'app/providers/store';
import { getCookie } from './utils';
import { useUserStore, User } from 'entities/user';
import { Errors } from 'shared/lib/validators';
import { API_PATHS } from 'shared/api';
import { useCompanyStore, Company } from 'entities/company';
import { LS } from 'shared/lib/local-storage';
import { userApi } from 'shared/api/features/user';

export interface ResAuthByLogin {
  user: User;
  company: Company;
  message: string;
}

/** Запрашиваемые данные при входе в аккаунт */
export interface AuthByLogin {
  email: string;
  password: string;
}

export const authByLogin = createAsyncThunk<undefined, AuthByLogin, ThunkConfig<Errors>>(
  'pages/login/authByLogin',
  // eslint-disable-next-line consistent-return
  async (authByLogin, thunkApi) => {
    const { extra, dispatch, rejectWithValue } = thunkApi,
      csrfToken = getCookie(cfg.COOKIE_NAME);

    try {
      const {
        data: { user, company },
      } = await extra.api.post<ResAuthByLogin>(API_PATHS.auth.login.byEmail, { authByLogin, csrfToken });

      // Проверяем, есть ли подсказки от которых отказалить будучи без авторизации
      const hints = user.settings?.hintsDontShowAgain || [];
      const hintsWithLS = Array.from(new Set([...hints, ...LS.getHintsDontShowAgain()]));

      if (hintsWithLS.length !== hints.length) {
        await userApi.update(extra.api, {
          id: user.id,
          companyId: user.companyId,
          settings: { hintsDontShowAgain: hintsWithLS },
        });

        if (!user.settings) user.settings = {};
        if (!user.settings.hintsDontShowAgain) user.settings.hintsDontShowAgain = [];
        user.settings.hintsDontShowAgain = [...hintsWithLS];
      }

      // Сохраняем в LS те хинты, что у пользователя
      LS.setHintsDontShowAgain(hintsWithLS);
      // End check dontShowAgain

      useUserStore.getState().setUser(user.companyId, user);
      useCompanyStore.getState().setCompany(company);
    } catch (e) {
      errorHandlers(e as CustomAxiosError, dispatch);
      return rejectWithValue(
        (e as CustomAxiosError).response.data || {
          general: 'Error in pages/login/authByLogin',
        },
      );
    }
  },
);
