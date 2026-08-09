// packages/frontend/src/shared/api/features/user/logout/index.ts

import { api, API_PATHS } from 'shared/api';

export const logout = async (): Promise<void> => {
  await api.post(API_PATHS.user.logout);
};
