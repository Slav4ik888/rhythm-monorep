// packages/backend/src/models/company/access/is-privileged.ts

import { Role } from '../../user/types/roles';

/** Привилегированная роль (Super admin / Developer) — обходит проверки прав */
export const isPrivileged = (user: { role?: Role } | undefined): boolean =>
  user?.role === Role.SUPER || user?.role === Role.DEV;
