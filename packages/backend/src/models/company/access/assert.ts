// packages/backend/src/models/company/access/assert.ts
// Хелперы, кидающие 403 (Forbidden) при отсутствии прав.

import { ERROR_NAME, getErrorText } from '../../../libs/validators';
import { Role } from '../../user/types/roles';
import type { User } from '../../user/types';
import type { Company } from '../types/company';
import { canEditCompany } from './can-edit-company';
import { canEditDashboard } from './can-edit-dashboard';
import { isPrivileged } from './is-privileged';

/** Ошибка «Нет разрешения на данную операцию» (403) */
const forbidden = (message: string = getErrorText(ERROR_NAME.PERMISSONS_NOT_ALLOWED)) =>
  Object.assign(new Error(message), { statusCode: 403, body: { general: message } });

/** Проверка прав на редактирование профиля компании */
export const assertCanEditCompany = (user: User, company: Company | undefined): void => {
  if (!canEditCompany(user, company)) throw forbidden();
};

/** Проверка прав на редактирование дашборда компании */
export const assertCanEditDashboard = (user: User, company: Company | undefined): void => {
  if (!canEditDashboard(user, company)) throw forbidden();
};

/**
 * Проверка прав на изменение глобальных шаблонов.
 * Шаблоны общие для всех компаний, поэтому их меняют только привилегированные роли и владелец.
 */
export const assertCanEditTemplates = (user: User): void => {
  if (!isPrivileged(user) && user.role !== Role.OWNER) throw forbidden();
};
