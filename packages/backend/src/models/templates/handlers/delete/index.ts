import { Context } from '../../../../app/types/global';
import { ViewItemId } from '../../../dashboard-view/types';
import { serviceDashboardDeleteTemlate } from '../../services';



/** v.2025-07-01 */
export interface DeleteTemplate {
  bunchUpdatedMs : number
  templateId     : ViewItemId
  bunchId        : ViewItemId
}

/**
 * @requires body.folder
 */
export const deleteTemlateModel = async (ctx: Context): Promise<void> => {
  const { templateId, bunchId, bunchUpdatedMs } = ctx.request.body as DeleteTemplate;

  // TODO: Permissions
  // TODO: Remove fields that are not allowed to be updated
  if (! templateId || ! bunchId || ! bunchUpdatedMs ) {
    ctx.throw(400, 'invalid body required field');
  }

  const result = await serviceDashboardDeleteTemlate(ctx);

  ctx.status = 200;
  ctx.body = result;
};
