// packages/backend/src/models/dashboard-view/handlers-view/update/index.ts
// Рефакторинг: убран ctx, принимает UpdateViewItem + userId, возвращает результат

import { serviceDashboardUpdateGroupItems } from '../../services';
import { PartialViewItem } from '../../types';

export interface PartialViewItemUpdate extends PartialViewItem {
  bunchId: string;
}

export interface UpdateViewItem {
  bunchUpdatedMs: number;
  companyId: string;
  viewItems: PartialViewItemUpdate[];
}

export interface UpdateViewItemArgs extends UpdateViewItem {
  userId: string;
}

/**
 * @requires body.UpdateViewItem
 */
export const updateGroupViewItemsModel = async (args: UpdateViewItemArgs): Promise<UpdateViewItem> => {
  const { viewItems, companyId, bunchUpdatedMs, userId } = args;

  // TODO: Permissions
  // TODO: Remove fields that are not allowed to be updated
  // TODO: validateUpdateViewItem(userData);

  if (!companyId || !viewItems || !viewItems?.length || !bunchUpdatedMs) {
    throw Object.assign(new Error('invalid body required field'), { statusCode: 400 });
  }

  return serviceDashboardUpdateGroupItems({ viewItems, companyId, bunchUpdatedMs, userId });
};
