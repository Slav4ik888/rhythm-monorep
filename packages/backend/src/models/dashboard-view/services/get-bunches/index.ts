import { DbRef, getRefDoc } from '../../../helpers';
import { BunchesViewItem } from '../../types';



/**
 * Get bunches by bunchIds
 */
export async function serviceGetDashboardBunches(companyId: string, bunchIds: string[]): Promise<BunchesViewItem> {
  const results = {};

  for await (const bunchId of bunchIds) {
    const doc = await getRefDoc(DbRef.BUNCH, { companyId, bunchId }).get();

    if (doc.exists) {
      results[bunchId] = {};
      results[bunchId] = { ...doc.data() };
    }
  }

  return results
}
