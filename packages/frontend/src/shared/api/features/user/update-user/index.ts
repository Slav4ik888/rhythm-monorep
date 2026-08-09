// packages/frontend/src/shared/api/features/user/update-user/index.ts

import { api, API_PATHS } from 'shared/api';

export interface UpdateUserPayload {
  [key: string]: unknown;
}

/** Обновить данные пользователя */
export const updateUser = async (payload: UpdateUserPayload): Promise<void> => {
  await api.post(API_PATHS.user.update, payload);
};
