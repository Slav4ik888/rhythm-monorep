import { Context } from '../../../../app/types/global';
import { getUserId } from '../../../user';
import { serviceUpdateCompany } from '../../services';
import { PartialCompany } from '../../types';
import { validateCompanyData } from '../../validators';



export interface UpdatedConfig {
  companyData: PartialCompany
}


/**
 * @requires body as UpdatedConfig
 */
export const updateCompanyModel = async (ctx: Context): Promise<void> => {
  const { companyData } = ctx.request.body as UpdatedConfig;
  const userId = getUserId(ctx);

  // TODO: Permissions
  // TODO: Remove fields that are not allowed to be updated: owner

  validateCompanyData(ctx, companyData);

  // Update
  const company = await serviceUpdateCompany(companyData, userId);

  ctx.body = company;
};
