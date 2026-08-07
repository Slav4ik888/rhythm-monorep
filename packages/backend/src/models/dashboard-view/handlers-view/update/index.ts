import { Context } from '../../../../app/types/global';
import { serviceDashboardUpdateGroupItems } from '../../services';
import { PartialViewItem } from '../../types';


export interface PartialViewItemUpdate extends PartialViewItem {
  bunchId: string
}

export interface UpdateViewItem {
  bunchUpdatedMs : number
  companyId      : string
  viewItems      : PartialViewItemUpdate[]
}

/**
 * @requires body.UpdateViewItem
 */
export const updateGroupViewItemsModel = async (ctx: Context): Promise<void> => {
  const { viewItems, companyId, bunchUpdatedMs } = ctx.request.body as UpdateViewItem;

  // TODO: Permissions
  // TODO: Remove fields that are not allowed to be updated

  // TODO: validateUpdateViewItem (ctx, userData);
  if (! companyId || ! viewItems || ! viewItems?.length || ! bunchUpdatedMs ) {
    ctx.throw(400, 'invalid body required field');
  }

  const result = await serviceDashboardUpdateGroupItems(ctx);

  ctx.status = 200;
  ctx.body = result;
};
