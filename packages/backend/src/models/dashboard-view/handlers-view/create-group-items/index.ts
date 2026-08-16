// packages/backend/src/models/dashboard-view/handlers-view/create-group-items/index.ts

import { BunchAction } from '../../../../shared/lib/structures/bunch';
import { assertCanEditDashboard } from '../../../company/access';
import { serviceGetCompany } from '../../../company/services';
import type { User } from '../../../user/types';
import { serviceDashboardViewCreateGroupItems } from '../../services';
import { ViewItem } from '../../types';
import { filterViewItems } from '../../utils';

export interface CreateGroupViewItems {
  bunchUpdatedMs: number;
  companyId: string;
  viewItems: ViewItem[];
  bunchAction: BunchAction;
}

export interface CreateGroupViewItemsArgs extends CreateGroupViewItems {
  user: User;
}

/**
 * @requires body.AddNewViews
 */
export const createGroupViewItemsModel = async (args: CreateGroupViewItemsArgs): Promise<CreateGroupViewItems> => {
  const { viewItems, companyId, bunchUpdatedMs, bunchAction, user } = args;

  if (!companyId || !viewItems || !viewItems?.length || !bunchUpdatedMs || !bunchAction) {
    throw Object.assign(new Error('invalid body required field'), { statusCode: 400 });
  }

  // Проверка прав на редактирование дашборда
  const company = await serviceGetCompany(companyId);
  assertCanEditDashboard(user, company);

  // Отсекаем серверные поля (createdAt/lastChange)
  const safeViewItems = filterViewItems(viewItems);

  return serviceDashboardViewCreateGroupItems({
    viewItems: safeViewItems,
    companyId,
    bunchUpdatedMs,
    bunchAction,
    userId: user.id,
  });
};
