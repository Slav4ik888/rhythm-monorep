import { User } from '../..';
import { DbRef, getRefDoc } from '../../../helpers';
import { sendMail } from '../../../../libs/emails';
import { convertToDot } from '../../../../shared/utils/objects';
import { creatorFixDate } from '../../../base';
import { CompanyStatus } from '../../../company/types';
import { UserStatus } from '../../types';
import { cfg } from '../../../../app/config';



/** Обновляем данные пользователя после верификации email */
export async function serviceSetVerification(user: User): Promise<any> {
  user.emailVerified = true;
  user.status = UserStatus.VERIFIED;

  const companyId = user.companyId;

  // COMPANY
  await getRefDoc(DbRef.COMPANY, { companyId }).update(convertToDot({
    id         : companyId,
    status     : CompanyStatus.VERIFIED,
    lastChange : creatorFixDate(user.id)
  }));

  // USER
  await getRefDoc(DbRef.USER, { companyId, userId: user.id }).update(convertToDot({
    emailVerified : true,
    status        : UserStatus.VERIFIED
  }));

  await sendMail({
    to       : cfg.INFO_EMAIL,
    subject  : `Подтвердили email ${user.email}`,
    template : 'info-email-verified',
    locals: {
      platform_name : cfg.SITE_TITLE_FULL,
      companyId     : user.companyId,
      email         : user.email,
    },
  });

  return
};
