import { ViewItemId } from '../../../dashboard-view/types';
import { serviceDashboardDeleteTemlate } from '../../services/delete';

/** v.2025-07-01 */
export interface DeleteTemplate {
  bunchUpdatedMs: number;
  templateId: ViewItemId;
  bunchId: ViewItemId;
}

/**
 * @requires body.folder
 * Рефакторинг: убрана зависимость от Koa ctx — принимает явные аргументы.
 */
export const deleteTemlateModel = async (args: DeleteTemplate): Promise<DeleteTemplate> => {
  const { templateId, bunchId, bunchUpdatedMs } = args;

  // TODO: Permissions
  // TODO: Remove fields that are not allowed to be updated
  if (!templateId || !bunchId || !bunchUpdatedMs) {
    throw Object.assign(new Error('invalid body required field'), {
      statusCode: 400,
      body: { general: 'invalid body required field' },
    });
  }

  const result = await serviceDashboardDeleteTemlate(args);
  return result;
};
