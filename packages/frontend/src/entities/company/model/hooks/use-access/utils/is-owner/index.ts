import { ParamsCompany } from '../../../../../types';


/** Является ли пользователь Владельцем аккаунта компании  */
export const isOwner = (
  company   : ParamsCompany,
  userEmail : string | undefined
): boolean => company?.owner === userEmail;
