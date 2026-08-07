import { DbRef, getRefCol } from '../../../helpers';
import { ViewItem } from '../../types';


/**
 * Get all view Viewitems which contained on the selected sheet
 */
export async function serviceDashboardViewGetAllViewItems(companyId: string): Promise<ViewItem[]> {
  const viewItems  = [];

  const bunchesRes = await getRefCol(DbRef.BUNCHES, { companyId }).get();

  if (! bunchesRes?.empty) bunchesRes.forEach(f => {
    Object.values(f.data()).forEach(item => {
      viewItems.push(item);
    });
  })

  return viewItems;
}
