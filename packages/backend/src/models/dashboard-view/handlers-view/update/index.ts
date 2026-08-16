// packages/backend/src/models/dashboard-view/handlers-view/update/index.ts

import { assertCanEditDashboard } from '../../../company/access';
import { serviceGetCompany } from '../../../company/services';
import type { User } from '../../../user/types';
import { serviceDashboardUpdateGroupItems } from '../../services';
import { PartialViewItem } from '../../types';
import { filterViewItems } from '../../utils';

export interface PartialViewItemUpdate extends PartialViewItem {
  bunchId: string;
}

export interface UpdateViewItem {
  bunchUpdatedMs: number;
  companyId: string;
  viewItems: PartialViewItemUpdate[];
}

export interface UpdateViewItemArgs extends UpdateViewItem {
  user: User;
}

/**
 * @requires body.UpdateViewItem
 */
export const updateGroupViewItemsModel = async (args: UpdateViewItemArgs): Promise<UpdateViewItem> => {
  const { viewItems, companyId, bunchUpdatedMs, user } = args;

  if (!companyId || !viewItems || !viewItems?.length || !bunchUpdatedMs) {
    throw Object.assign(new Error('invalid body required field'), { statusCode: 400 });
  }

  // Проверка прав на редактирование дашборда
  const company = await serviceGetCompany(companyId);
  assertCanEditDashboard(user, company);

  // Отсекаем серверные поля (createdAt/lastChange)
  const safeViewItems = filterViewItems(viewItems);

  return serviceDashboardUpdateGroupItems({ viewItems: safeViewItems, companyId, bunchUpdatedMs, userId: user.id });
};
