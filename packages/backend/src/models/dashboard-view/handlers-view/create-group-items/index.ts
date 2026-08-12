// packages/backend/src/models/dashboard-view/handlers-view/create-group-items/index.ts
// Рефакторинг: убран ctx, принимает CreateGroupViewItems + userId, возвращает результат

import { BunchAction } from '../../../../shared/lib/structures/bunch';
import { serviceDashboardViewCreateGroupItems } from '../../services';
import { ViewItem } from '../../types';

export interface CreateGroupViewItems {
  bunchUpdatedMs: number;
  companyId: string;
  viewItems: ViewItem[];
  bunchAction: BunchAction;
}

export interface CreateGroupViewItemsArgs extends CreateGroupViewItems {
  userId: string;
}

/**
 * @requires body.AddNewViews
 */
export const createGroupViewItemsModel = async (args: CreateGroupViewItemsArgs): Promise<CreateGroupViewItems> => {
  const { viewItems, companyId, bunchUpdatedMs, bunchAction, userId } = args;

  // TODO: Permissions
  // TODO: Remove fields that are not allowed to be updated
  // TODO: validateNewView(userData);

  if (!companyId || !viewItems || !viewItems?.length || !bunchUpdatedMs || !bunchAction) {
    throw Object.assign(new Error('invalid body required field'), { statusCode: 400 });
  }

  return serviceDashboardViewCreateGroupItems({ viewItems, companyId, bunchUpdatedMs, bunchAction, userId });
};
