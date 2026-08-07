import { DbRef, getRefDoc } from '../../../helpers';
import { PartnerData } from '../../types';
import { getCurrentMs } from '../../../../shared/utils/dates';
import { CompanyId } from '../../../company';
import { Email } from '../../../base';
import { db } from '../../../../libs/firebase';



/** increase register ended in DB */
export const serviceIncreaseRegisterEnded = async (
  partnerId : string,
  email     : Email,
  companyId : CompanyId
): Promise<undefined> => {

  // Set | Update
  const ref = getRefDoc(DbRef.PARTNER, { partnerId });

  const docTemp = await ref.get();
  if (! docTemp.exists) return

  const partner = docTemp.data() as PartnerData;

  // Get a new write batch
  const batch = db.batch();

  batch.update(ref, {
    registered: partner.registered
      ? partner.registered + 1
      : 1
  });

  batch.update(ref, {
    // @ts-ignore
    registeredData: {
      ...(partner.registeredData ? partner.registeredData : {}),
      [email]: {
        email,
        companyId,
        createdAt: getCurrentMs()
      }
    }
  });

  // Commit the batch
  await batch.commit();
};
