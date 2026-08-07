import { Context } from '../../../../app/types/global';
import { DbRef, getRefCol, getRefDoc } from '../../../helpers';
import { convertToDot } from '../../../../shared/utils/objects';
import { IncreaseFollowerConfig } from '../../handlers/increase-follower';
import { PartnerData } from '../../types';



/** increase followers in DB */
export const serviceIncreaseFollower = async (ctx: Context): Promise<undefined> => {
  const { partnerId } = ctx.request.body as IncreaseFollowerConfig;

  // Set | Update
  const ref = getRefDoc(DbRef.PARTNER, { partnerId });

  const docTemp = await ref.get();
  if (docTemp.exists) {
    const partner = docTemp.data() as PartnerData;

    ref.update(convertToDot({
      followers: partner.followers
        ? partner.followers + 1
        : 1
    }));
  }
  else { // Для нового партнёра
    ref.set({
      id: partnerId,
      followers: 1
    });
  }

  return
};
