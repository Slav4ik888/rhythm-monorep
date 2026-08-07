import { convertToDot, isField } from '../../../../shared/utils/objects';
import { creatorFixDate } from '../../../base';
import { DbRef, getRefDoc } from '../../../helpers';
import { PartialUser } from '../../types';




/** Update User in DB */
export const serviceUpdateUser = async (user: PartialUser, userId: string): Promise<undefined> => {
  const
    companyId = user.companyId,
    id        = user.id;

  if (isField(user, 'lastChange')) user.lastChange = creatorFixDate(userId);

  const dataInDot = convertToDot(user);

  await getRefDoc(DbRef.USER, { companyId, userId: id }).update(dataInDot);

  return
};
