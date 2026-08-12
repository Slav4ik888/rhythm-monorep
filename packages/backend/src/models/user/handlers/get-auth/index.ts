import { Company, serviceGetCompany } from '../../../company';
import { serviceGetUser } from '../../services';
import { User } from '../../types';

/** Аргументы для getAuthModel */
export interface GetAuthArgs {
  userId: string;
  companyId: string;
}

/** Ответ getAuth */
export interface ResGetAuth {
  userData: User;
  companyData: Company;
}

/** Get user`s userData & companyData */
export async function getAuthModel({ userId, companyId }: GetAuthArgs): Promise<ResGetAuth> {
  const userData = await serviceGetUser(companyId, userId);
  const companyData = await serviceGetCompany(companyId);

  return {
    userData,
    companyData,
  };
}
