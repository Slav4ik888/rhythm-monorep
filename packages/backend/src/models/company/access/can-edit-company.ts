// packages/backend/src/models/company/access/can-edit-company.ts

import type { User } from '../../user/types';
import type { Company } from '../types/company';
import { isOwner } from './is-owner';
import { isPrivileged } from './is-privileged';

/** Может ли пользователь редактировать профиль компании (владелец или привилегированная роль) */
export const canEditCompany = (user: User | undefined, company: Company | undefined): boolean => {
  if (!user || !company) return false;
  if (isPrivileged(user)) return true;

  return company.ownerId === user.id || isOwner(company, user.email);
};
