// packages/backend/src/models/dashboard-view/handlers-view/delete/index.ts

import { assertCanEditDashboard } from '../../../company/access';
import { serviceGetCompany } from '../../../company/services';
import type { User } from '../../../user/types';
import { serviceDashboardViewDeleteGroup } from '../../services';
import { PartialViewItemUpdate } from '../update';

export interface DeleteViews {
  bunchUpdatedMs: number;
  companyId: string;
  viewItems: PartialViewItemUpdate[]; // Ids удаляемого и всех вложенных элементов
}

export interface DeleteViewsArgs extends DeleteViews {
  user: User;
}

/**
 * @requires body.folder
 */
export const deleteViewItemModel = async (args: DeleteViewsArgs): Promise<void> => {
  const { viewItems = [], companyId, bunchUpdatedMs, user } = args;

  if (!companyId || !viewItems || !viewItems?.length || !bunchUpdatedMs) {
    throw Object.assign(new Error('invalid body required field'), { statusCode: 400 });
  }

  // Проверка прав на редактирование дашборда
  const company = await serviceGetCompany(companyId);
  assertCanEditDashboard(user, company);

  await serviceDashboardViewDeleteGroup({ viewItems, companyId, bunchUpdatedMs, userId: user.id });
};
