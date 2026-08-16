// packages/backend/src/models/company/access/can-access.ts

import type { AccessLevel } from '../types/access';
import { ACCESS_PRIORITY } from './consts';

/** Достаточно ли прав у пользователя для требуемой операции */
export const canAccess = (userAccess: AccessLevel | undefined, requiredAccess: AccessLevel): boolean =>
  Boolean(userAccess) && ACCESS_PRIORITY[userAccess] >= ACCESS_PRIORITY[requiredAccess];
