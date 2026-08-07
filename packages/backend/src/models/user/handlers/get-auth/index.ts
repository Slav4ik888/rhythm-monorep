import { Context } from '../../../../app/types/global';
import { Company, serviceGetCompany } from '../../../company';
import { serviceGetUser } from '../../services';
import { User } from '../../types';



/** 2025-06-13 */
interface ResGetAuth {
  userData      : User
  companyData   : Company
}


/** Get user`s userData & companyData */
export async function getAuthModel(ctx: Context): Promise<any> {
  const { id, companyId } = ctx.state.user;

  const userData      = await serviceGetUser(companyId, id);
  const companyData   = await serviceGetCompany(companyId);

  ctx.body = {
    userData, companyData
  };
}
