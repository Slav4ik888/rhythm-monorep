import { Context } from '../../../../app/types/global';
import { convertToDot } from '../../../../shared/utils/objects';
import { creatorFixDate } from '../../../base';
import { DbRef, getRefDoc } from '../../../helpers';
import { getUserId } from '../../../user';
import { db } from '../../../../libs/firebase';
import { UpdateViewItem } from '../../handlers-view/update';
import { getBunchesTimestamps } from '../../utils';



/** Update ViewItem in DB */
export const serviceDashboardUpdateGroupItems = async (ctx: Context): Promise<UpdateViewItem> => {
  const { viewItems, companyId, bunchUpdatedMs } = ctx.request.body as UpdateViewItem;
  const userId = getUserId(ctx);
  const fixDate = creatorFixDate(userId, bunchUpdatedMs);

  // Get a new write batch
  const batch = db.batch();

  viewItems.forEach(item => {
    const ref = getRefDoc(DbRef.BUNCH, { companyId, bunchId: item.bunchId });
    const viewItem = {
      ...item,
      lastChange: fixDate
    };
    batch.update(ref, convertToDot({ [viewItem.id]: viewItem }));
  });


  // Update the company bunchesUpdated
  const ref = getRefDoc(DbRef.COMPANY, { companyId });
  batch.update(ref, convertToDot({ bunchesUpdated: getBunchesTimestamps(viewItems, bunchUpdatedMs) }));

  // Commit the batch
  await batch.commit();

  return ctx.request.body as UpdateViewItem
};
