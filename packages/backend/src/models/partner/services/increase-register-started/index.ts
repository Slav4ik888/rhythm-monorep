import { Context } from '../../../../app/types/global';
import { DbRef, getRefDoc } from '../../../helpers';
import { PartnerData } from '../../types';
import { SignupData } from '../../../auth';
import { getCurrentMs } from '../../../../shared/utils/dates';
import { db } from '../../../../libs/firebase';



/** increase register started in DB */
export const serviceIncreaseRegisterStarted = async (ctx: Context): Promise<undefined> => {
  const { signupData } = ctx.request.body as { signupData: SignupData };
  const { email, partnerId, companyName, firstName } = signupData;

  // Set | Update
  const ref = getRefDoc(DbRef.PARTNER, { partnerId });

  const docTemp = await ref.get();
  if (! docTemp.exists) return

  const partner = docTemp.data() as PartnerData;

  // Get a new write batch
  const batch = db.batch();

  batch.update(ref, {
    registerStarted: partner.registerStarted
      ? partner.registerStarted + 1
      : 1
  });

  batch.update(ref, {
    // @ts-ignore
    registerStartedData: {
      ...(partner.registerStartedData ? partner.registerStartedData : {}),
      [email]: {
        email,
        companyName,
        firstName,
        createdAt: getCurrentMs()
      }
    }
  });

  // Commit the batch
  await batch.commit();

  return
};
