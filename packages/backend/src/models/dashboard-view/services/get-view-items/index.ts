import { DbRef, getRefDoc } from '../../../helpers';
import { ViewItem } from '../../types';



/**
 * Get bunches by bunchIds
 * @returns viewItem[]
 */
export async function serviceGetDashboardViewItems(companyId: string, bunchIds: string[]): Promise<ViewItem[]> {
  const results = [];

  for await (const bunchId of bunchIds) {
    const doc = await getRefDoc(DbRef.BUNCH, { companyId, bunchId }).get();

    if (doc.exists) {
      Object.values(doc.data()).forEach(item => {
        results.push(item);
      });
    }
  }

  return results
}
