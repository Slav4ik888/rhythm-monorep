// packages/backend/src/models/dashboard-view/services/delete-group/index.ts
// Рефакторинг: убран ctx, принимает DeleteViews + userId

import { db } from '../../../../libs/firebase';
import { DbRef, getRefDoc } from '../../../helpers';
import { DeleteViews } from '../../handlers-view/delete';
import { convertToDot } from '../../../../shared/utils/objects';
import { getBunchesTimestamps } from '../../utils';
import { FieldValue } from 'firebase-admin/firestore';

export interface ServiceDeleteGroupArgs extends DeleteViews {
  userId: string;
}

/** Delete group ViewItems from DB */
export const serviceDashboardViewDeleteGroup = async (args: ServiceDeleteGroupArgs): Promise<undefined> => {
  const { viewItems, companyId, bunchUpdatedMs } = args;

  // Get a new write batch
  const batch = db.batch();

  viewItems.forEach((item) => {
    const ref = getRefDoc(DbRef.BUNCH, { companyId, bunchId: item.bunchId });
    const updateObject = {
      [item.id]: FieldValue.delete(),
    };
    batch.update(ref, updateObject);
  });

  // Update the company bunchesUpdated
  const ref = getRefDoc(DbRef.COMPANY, { companyId });
  batch.update(ref, convertToDot({ bunchesUpdated: getBunchesTimestamps(viewItems, bunchUpdatedMs) }));

  // Commit the batch
  await batch.commit();
};
