// packages/backend/src/models/company/access/consts.ts
// Приоритеты уровней доступа (зеркалит фронт entities/company/model/hooks/use-access/consts/index.ts)

import type { AccessLevel } from '../types/access';

/** Приоритет уровней доступа */
export const ACCESS_PRIORITY: Record<AccessLevel, number> = {
  n: 0, // 'none' — нет доступа
  v: 10, // 'view' — просмотр с авторизацией
  e: 20, // 'edit' — права на редактирование
};
