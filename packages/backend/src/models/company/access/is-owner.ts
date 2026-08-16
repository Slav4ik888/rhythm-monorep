// packages/backend/src/models/company/access/is-owner.ts

import type { Company } from '../types/company';

/** Является ли пользователь владельцем компании (по email, как на фронте) */
export const isOwner = (company: Company | undefined, userEmail: string | undefined): boolean =>
  Boolean(userEmail) && company?.owner === userEmail;
