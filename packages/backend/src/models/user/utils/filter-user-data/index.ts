// packages/backend/src/models/user/utils/filter-user-data/index.ts

import { pick } from '../../../../shared/utils/objects/pick';
import type { PartialUser } from '../../types';

/** Поля пользователя, которые можно обновлять через /user/update (профиль) */
export const USER_UPDATE_ALLOWED_FIELDS = ['person', 'settings'] as const;

/**
 * Оставляет только разрешённые поля пользователя (защита от mass assignment).
 * id и companyId подставляются сервером из аутентифицированного пользователя.
 * Запрещено менять: role, status, emailVerified, permissions, partner, email, isEditAccess, order.
 */
export const filterUserData = (user: PartialUser): Partial<PartialUser> => pick(user, USER_UPDATE_ALLOWED_FIELDS);
