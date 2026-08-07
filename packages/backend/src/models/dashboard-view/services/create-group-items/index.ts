import { Context } from '../../../../app/types/global';
import { creatorFixDate } from '../../../base';
import { DbRef, getRefDoc } from '../../../helpers';
import { getUserId } from '../../../user';
import { db } from '../../../../libs/firebase';
import { CreateGroupViewItems } from '../../handlers-view/create-group-items';
import { convertToDot } from '../../../../shared/utils/objects';



/** Create new ViewItems in DB */
export const serviceDashboardViewCreateGroupItems = async (ctx: Context): Promise<CreateGroupViewItems> => {
  const { viewItems, companyId, bunchUpdatedMs, bunchAction } = ctx.request.body as CreateGroupViewItems;
  const userId = getUserId(ctx);
  const fixDate = creatorFixDate(userId);
  const isBunchCreate = bunchAction === 'create';

  // Get a new write batch
  const batch = db.batch();

  viewItems.forEach((item, idx) => {
    const ref = getRefDoc(DbRef.BUNCH, { companyId, bunchId: item.bunchId });
    const viewItem = {
      ...item,
      createdAt  : fixDate,
      lastChange : fixDate,
    };
    if (isBunchCreate && idx === 0) {
      batch.set(ref, { [viewItem.id]: viewItem });
    }
    else {
      batch.update(ref, convertToDot({ [viewItem.id]: viewItem }));
    }
  });

  // Update the company bunchesUpdated
  const ref = getRefDoc(DbRef.COMPANY, { companyId });
  batch.update(ref, convertToDot({ bunchesUpdated: { [viewItems[0].bunchId]: bunchUpdatedMs } }));


  // Commit the batch
  await batch.commit();

  return ctx.request.body as CreateGroupViewItems
};
