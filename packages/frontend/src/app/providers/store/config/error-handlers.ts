// packages/frontend/src/app/providers/store/config/error-handlers.ts

import { useUIStore } from 'entities/ui';
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import type { StateSchema, ThunkExtraArg } from './state';
import { Errors } from 'shared/lib/validators';
import { useUserStore } from 'entities/user';
import { __devLog } from 'shared/lib/tests/__dev-log';
import { LS } from 'shared/lib/local-storage';
import { isDashboardPage } from 'shared/lib/hooks/use-pages/utils';
import { Location } from 'react-router-dom';
import { objectFieldsToString } from 'shared/helpers/objects';

export interface CustomAxiosError {
  code: string;
  stack: string;
  response: {
    status: number;
    data: Errors;
    config: {
      url: string;
    };
  };
}

interface ErrorHandlersConfig {
  pathname?: string;
}

export const errorHandlers = (
  e: CustomAxiosError,
  dispatch: ThunkDispatch<StateSchema, ThunkExtraArg, AnyAction>,
  cfg: ErrorHandlersConfig = {},
) => {
  __devLog('errorHandlers', 'e: ', e);
  __devLog('errorHandlers', 'response: ', e.response);
  __devLog('errorHandlers', 'status: ', e.response?.status);
  __devLog('errorHandlers', 'stack: ', e.stack);

  const uiStore = useUIStore.getState();
  const errors = e.response?.data || {};
  const status = e.response?.status;
  const { pathname } = cfg;

  __devLog('errorHandlers', 'pathname: ', pathname);

  uiStore.setPageLoading(); // Снять крутилку

  if (errors.updateRequired) {
    LS.clearStorage();
    return uiStore.setInfoMessage('Приложение обновилось. Необходимо обновить страницу.');
  }
  if (e.code === 'ECONNABORTED') {
    return uiStore.setWarningMessage('Отсутствует интернет-соединение. Попробуйте позже.');
  }
  if (errors.general) {
    if (errors.general !== 'auth/user-not-found') return uiStore.setWarningMessage(errors.general);
    return uiStore.setErrorMessage(errors.general);
  }

  // if (errors.message) return dispatch(actionsUI.setWarningMessage(errors.message));

  if (status === 204) {
    // No Content
    return uiStore.setWarningMessage('По вашему запросу отсутствуют данные.');
  } else if (status === 400) {
    return uiStore.setWarningMessage(objectFieldsToString(errors));
  }
  // Не редиректим на loginPage и не выводим сообщение о необходимости авторизации,
  // тк пользователь может посетить страницу без необходимости авторизации
  // а инфа об этом не приходит от сервера
  else if (status === 401) {
    useUserStore.getState().clearUser();
    // if (isDashboardPage(pathname)) dispatch(actionsUI.setWarningMessage('Необходимо авторизоваться'));
    // return dispatch(actionsUI.setErrorStatus({ status: 401, pathname }));
  } else if (status === 403) return uiStore.setErrorStatus(403, pathname);
  else if (status === 404) {
    return uiStore.setWarningMessage(
      `Сервер вернул ошибку - отсутствует обработчик на данный запрос [${e.response?.config?.url}].
       Повторите действие позже.`,
    );
  } else if (status === 500 || status === 501 || status === 502 || status === 504) {
    // dispatch(actionsUI.setErrorStatus(504));
    return uiStore.setWarningMessage('Извините, сервер временно не доступен...');
  }
  // else if (e.stack) {
  //   return dispatch(actionsUI.setErrorMessage(e.stack));
  // }
};
