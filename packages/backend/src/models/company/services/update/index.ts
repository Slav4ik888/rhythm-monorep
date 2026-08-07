import { convertToDot, isField } from '../../../../shared/utils/objects';
import { creatorFixDate } from '../../../base';
import { DbRef, getRefDoc } from '../../../helpers';
import { PartialCompany } from '../../types';




/** Update Company in DB */
export const serviceUpdateCompany = async (company: PartialCompany, userId: string): Promise<PartialCompany> => {
  const companyId = company.id;

  if (isField(company, 'lastChange')) company.lastChange = creatorFixDate(userId);

  const dataInDot = convertToDot(company);

  await getRefDoc(DbRef.COMPANY, { companyId }).update(dataInDot);

  return company
};
