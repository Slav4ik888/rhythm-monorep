import { Context } from '../../../../app/types/global';

export const getCompanyId = (ctx: Context): string => ctx.state.user.companyId;
