// packages/frontend/src/features/docs/get-policy/model/services/get-policy/index.ts

import { api, API_PATHS } from 'shared/api';

export interface ResGetPolicy {
  policy: string;
}

/**
 * Прямой API-вызов (без Redux createAsyncThunk).
 * Обработка ошибок — в вызывающем коде (useDocs).
 */
export const getPolicy = async (): Promise<string> => {
  const {
    data: { policy },
  } = await api.get<ResGetPolicy>(API_PATHS.docs.getPolicy);
  return policy;
};
