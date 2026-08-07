import { Company } from '../../types';
import { DbRef, getRefDoc } from '../../../helpers';


export async function serviceGetCompany(companyId: string): Promise<Company | undefined> {
  const docCompany = await getRefDoc(DbRef.COMPANY, { companyId }).get();

  if (docCompany.exists) return docCompany.data() as Company;
  return undefined;
};
