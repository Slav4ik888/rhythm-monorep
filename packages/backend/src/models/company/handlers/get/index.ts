import { Company } from '../..';
import { Context } from '../../../../app/types/global';
import { ERROR_NAME, getErrorText } from '../../../../libs/validators';
import { serviceGetCompany } from '../../services';


/**
 * @requires body.companyId
 */
export const getCompanyModel = async (ctx: Context): Promise<Company> => {
  const { companyId } = ctx.request.body;

  if (! companyId) return ctx.throw(400, { general: getErrorText(ERROR_NAME.INVALID_DATA, 'companyId') })

  const company = await serviceGetCompany(companyId);

  if (ctx.state.callback) return company;
  else ctx.body = company;
};
