import { assertCanEditTemplates } from '../../../company/access';
import { ViewItemId } from '../../../dashboard-view/types';
import type { User } from '../../../user/types';
import { serviceDashboardDeleteTemlate } from '../../services/delete';

/** v.2025-07-01 */
export interface DeleteTemplate {
  bunchUpdatedMs: number;
  templateId: ViewItemId;
  bunchId: ViewItemId;
}

/** Аргументы deleteTemlateModel */
export interface DeleteTemplateArgs extends DeleteTemplate {
  user: User;
}

/**
 * @requires body.folder
 */
export const deleteTemlateModel = async (args: DeleteTemplateArgs): Promise<DeleteTemplate> => {
  const { templateId, bunchId, bunchUpdatedMs, user } = args;

  if (!templateId || !bunchId || !bunchUpdatedMs) {
    throw Object.assign(new Error('invalid body required field'), {
      statusCode: 400,
      body: { general: 'invalid body required field' },
    });
  }

  // Шаблоны глобальные — менять может только владелец/привилегированная роль
  assertCanEditTemplates(user);

  const result = await serviceDashboardDeleteTemlate({ templateId, bunchId, bunchUpdatedMs });
  return result;
};
