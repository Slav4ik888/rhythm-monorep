// packages/backend/src/libs/tests/modify-fields/index.ts

import { MOCK_FIX_DATE } from '../../../models/base';

export interface ModifyFields {
  createdAt: number;
  lastChange: number;
}

/**
 * 2023-12-19
 * Поля с временными значениями заменяем на константы
 * createdAt
 * lastChange
 */
export function modifyFields<ModifyFields>(obj: ModifyFields): ModifyFields {
  return {
    ...obj,
    createdAt: MOCK_FIX_DATE,
    lastChange: MOCK_FIX_DATE,
  };
}
