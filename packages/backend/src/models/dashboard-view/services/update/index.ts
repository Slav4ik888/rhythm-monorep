// packages/backend/src/models/dashboard-view/services/update/index.ts
// Рефакторинг: убран ctx, принимает UpdateViewItem + userId

import { convertToDot } from '../../../../shared/utils/objects';
import { creatorFixDate } from '../../../base';
import { DbRef, getRefDoc } from '../../../helpers';
import { db } from '../../../../libs/firebase';
import { UpdateViewItem } from '../../handlers-view/update';
import { getBunchesTimestamps } from '../../utils';

export interface ServiceUpdateGroupItemsArgs extends UpdateViewItem {
  userId: string;
}

/** Update ViewItem in DB */
export const serviceDashboardUpdateGroupItems = async (args: ServiceUpdateGroupItemsArgs): Promise<UpdateViewItem> => {
  const { viewItems, companyId, bunchUpdatedMs, userId } = args;
  const fixDate = creatorFixDate(userId, bunchUpdatedMs);

  // Get a new write batch
  const batch = db.batch();

  viewItems.forEach((item) => {
    const ref = getRefDoc(DbRef.BUNCH, { companyId, bunchId: item.bunchId });
    const viewItem = {
      ...item,
      lastChange: fixDate,
    };
    batch.update(ref, convertToDot({ [viewItem.id]: viewItem }));
  });

  // Update the company bunchesUpdated
  const ref = getRefDoc(DbRef.COMPANY, { companyId });
  batch.update(ref, convertToDot({ bunchesUpdated: getBunchesTimestamps(viewItems, bunchUpdatedMs) }));

  // Commit the batch
  await batch.commit();

  return { viewItems, companyId, bunchUpdatedMs };
};
