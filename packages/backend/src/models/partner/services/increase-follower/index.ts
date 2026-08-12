import { DbRef, getRefDoc } from '../../../helpers';
import { convertToDot } from '../../../../shared/utils/objects';
import { PartnerData } from '../../types';

/**
 * Увеличивает счётчик followers для партнёра в БД.
 * Рефакторинг: убрана зависимость от Koa ctx — принимает partnerId напрямую.
 */
export const serviceIncreaseFollower = async (partnerId: string): Promise<void> => {
  // Set | Update
  const ref = getRefDoc(DbRef.PARTNER, { partnerId });

  const docTemp = await ref.get();
  if (docTemp.exists) {
    const partner = docTemp.data() as PartnerData;

    ref.update(
      convertToDot({
        followers: partner.followers ? partner.followers + 1 : 1,
      }),
    );
  } else {
    // Для нового партнёра
    ref.set({
      id: partnerId,
      followers: 1,
    });
  }
};
