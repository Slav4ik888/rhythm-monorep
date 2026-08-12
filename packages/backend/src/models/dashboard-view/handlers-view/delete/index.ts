// packages/backend/src/models/dashboard-view/handlers-view/delete/index.ts
// Рефакторинг: убран ctx, принимает DeleteViews + userId

import { serviceDashboardViewDeleteGroup } from '../../services';
import { PartialViewItemUpdate } from '../update';

export interface DeleteViews {
  bunchUpdatedMs: number;
  companyId: string;
  viewItems: PartialViewItemUpdate[]; // Ids удаляемого и всех вложенных элементов
}

export interface DeleteViewsArgs extends DeleteViews {
  userId: string;
}

/**
 * @requires body.folder
 */
export const deleteViewItemModel = async (args: DeleteViewsArgs): Promise<void> => {
  const { viewItems = [], companyId, bunchUpdatedMs, userId } = args;

  // TODO: Permissions
  // TODO: Remove fields that are not allowed to be updated
  // TODO: validateDeleteViewItem(userData);

  if (!companyId || !viewItems || !viewItems?.length || !bunchUpdatedMs) {
    throw Object.assign(new Error('invalid body required field'), { statusCode: 400 });
  }

  await serviceDashboardViewDeleteGroup({ viewItems, companyId, bunchUpdatedMs, userId });
};
