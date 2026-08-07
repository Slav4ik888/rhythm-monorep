import { Context } from '../../../../app/types/global';
import { serviceDashboardViewDeleteGroup } from '../../services';
import { PartialViewItemUpdate } from '../update';



export interface DeleteViews {
  bunchUpdatedMs : number
  companyId      : string
  viewItems      : PartialViewItemUpdate[] // Ids удаляемого и всех вложенных элементов
}

/**
 * @requires body.folder
 */
export const deleteViewItemModel = async (ctx: Context): Promise<void> => {
  const { viewItems = [], companyId, bunchUpdatedMs } = ctx.request.body as DeleteViews;

  // TODO: Permissions
  // TODO: Remove fields that are not allowed to be updated
  // TODO: validateDeleteViewItem (ctx, userData);
  if (! companyId || ! viewItems || ! viewItems?.length || ! bunchUpdatedMs ) {
    ctx.throw(400, 'invalid body required field');
  }

  await serviceDashboardViewDeleteGroup(ctx);

  ctx.status = 200;
  ctx.body = {};
};
