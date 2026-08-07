import { DbRef, getRefDoc } from '../../../helpers';
import { ResGetTemplates } from '../../handlers/get-templates';
import { Template } from '../../types';



/**
 * Get bunches by bunchIds
 */
export async function serviceGetTemplates(bunchIds: string[]): Promise<ResGetTemplates> {
  const results: ResGetTemplates = {
    templates      : [],
    bunchesUpdated : {}
  };

  for await (const bunchId of bunchIds) {
    const doc = await getRefDoc(DbRef.TEMPLATE, { bunchId }).get();

    if (doc.exists) {
      Object.values(doc.data()).forEach(item => {
        results.templates.push(item as Template);
      });
    }
  }

  const bunches = await getRefDoc(DbRef.TEMPLATE, { bunchId: 'bunchesUpdated' }).get();
  if (bunches.exists) {
    results.bunchesUpdated = bunches.data();
  }

  return results

  // const tempRes = await getRefCol(DbRef.TEMPLATES).get();

  // if (! tempRes?.empty) {
  //   tempRes.forEach(temp => {
  //     const bunch = temp.data();

  //     if (bunch.hasOwnProperty('bunchesUpdated')) {
  //       results.bunchesUpdated = { ...bunch };
  //     }
  //     else {
  //       Object.values((bunch as Bunch<ViewItemId, Template>)).forEach(item => {
  //         results.templates.push(bunch);
  //       });
  //     }
  //   })
  // }

  // return results
}
