import { BunchesUpdated } from '../../../../shared/lib/structures/bunch';
import { DbRef, getRefCol } from '../../../helpers';



/**
 * Get bunches by bunchIds
 */
export async function serviceGetBunchesUpdated(): Promise<BunchesUpdated> {
  let bunchesUpdated = {} as BunchesUpdated

  const docTemp = await getRefCol(DbRef.TEMPLATES).doc('bunchesUpdated').get();

  if (docTemp.exists) bunchesUpdated = docTemp.data() as BunchesUpdated;

  return bunchesUpdated
}
