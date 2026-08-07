import { Context } from '../../../../app/types/global';
import { BunchAction } from '../../../../shared/lib/structures/bunch';
import { serviceDashboardViewCreateGroupItems } from '../../services';
import { ViewItem } from '../../types';



export interface CreateGroupViewItems {
  bunchUpdatedMs : number
  companyId      : string
  viewItems      : ViewItem[]
  bunchAction    : BunchAction
}

/**
 * @requires body.AddNewViews
 */
export const createGroupViewItemsModel = async (ctx: Context): Promise<void> => {
  const { viewItems, companyId, bunchUpdatedMs, bunchAction } = ctx.request.body as CreateGroupViewItems;

  // TODO: Permissions
  // TODO: Remove fields that are not allowed to be updated

  // TODO: validateNewView(ctx, userData);

  if (! companyId || ! viewItems || ! viewItems?.length || ! bunchUpdatedMs || ! bunchAction ) {
    ctx.throw(400, 'invalid body required field');
  }

  const result = await serviceDashboardViewCreateGroupItems(ctx);

  ctx.status = 200;
  ctx.body = result;
};
